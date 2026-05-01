"use client";

import { useState, useTransition } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/core/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      router.push("/");
      router.refresh();
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-sm"
    >
      <div className="holo-border glow-cyan rounded-holo p-8 space-y-6">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-bold text-neon-cyan text-glow-cyan tracking-tight">
            WorkoutBud
          </h1>
          <p className="text-muted text-xs font-mono tracking-widest uppercase">
            Sign In
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs text-muted font-mono uppercase tracking-wider">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="you@example.com"
              className="w-full bg-obsidian-surface border border-obsidian-raised focus:border-neon-cyan rounded-holo px-4 py-3 text-ghost-white text-sm outline-none transition-colors placeholder:text-muted/50"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-muted font-mono uppercase tracking-wider">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className="w-full bg-obsidian-surface border border-obsidian-raised focus:border-neon-cyan rounded-holo px-4 py-3 text-ghost-white text-sm outline-none transition-colors placeholder:text-muted/50"
            />
          </div>

          {error && (
            <p className="text-red-400 text-xs font-mono">{error}</p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-neon-cyan/10 border border-neon-cyan text-neon-cyan font-semibold rounded-holo py-3 text-sm tracking-wide transition-all hover:bg-neon-cyan/20 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isPending ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="text-center text-muted text-xs">
          No account?{" "}
          <Link
            href="/signup"
            className="text-neon-cyan hover:opacity-80 transition-opacity"
          >
            Sign up
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
