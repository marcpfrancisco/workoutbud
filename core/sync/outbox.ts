import { createClient } from "@/core/supabase/client";
import { db } from "@/core/db/schema";
import type { SyncOutboxItem } from "@/core/db/schema";

type OutboxItemWithId = SyncOutboxItem & { id: number };

async function processItem(item: OutboxItemWithId): Promise<void> {
  const supabase = createClient();
  const payload = item.payload as Record<string, unknown>;

  let result;
  if (item.operation === "create") {
    result = await supabase.from(item.table).insert(payload);
  } else if (item.operation === "update") {
    result = await supabase.from(item.table).upsert(payload);
  } else {
    result = await supabase
      .from(item.table)
      .delete()
      .eq("id", (payload as { id: string }).id);
  }

  if (result.error) throw new Error(result.error.message);
}

export async function flushOutbox(): Promise<void> {
  const items = await db.syncOutbox.orderBy("createdAt").toArray();
  if (items.length === 0) return;

  for (const item of items) {
    if (item.id === undefined) continue;
    const typed = item as OutboxItemWithId;

    try {
      await processItem(typed);
      await db.syncOutbox.delete(typed.id);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown sync error";
      await db.syncOutbox.update(typed.id, {
        retries: typed.retries + 1,
        error: message,
      });
      await db.syncErrors.add({
        message,
        table: typed.table,
        payload: typed.payload,
        occurredAt: Date.now(),
      });
    }
  }
}

export function initSyncWorker(): () => void {
  function handleOnline() {
    flushOutbox().catch(console.error);
  }

  if (typeof window !== "undefined") {
    window.addEventListener("online", handleOnline);
    if (navigator.onLine) handleOnline();
  }

  return () => {
    if (typeof window !== "undefined") {
      window.removeEventListener("online", handleOnline);
    }
  };
}
