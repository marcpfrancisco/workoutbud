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
      const { error } = await supabase.auth.signInWithPassword({ email, password });

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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full max-w-sm"
    >
      <div className="card p-8 space-y-7">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold text-primary tracking-tight">Sign in</h1>
          <p className="text-secondary text-sm">Welcome back to WorkoutBud</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs text-secondary font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="you@example.com"
              className="field"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-secondary font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className="field"
            />
          </div>

          {error && (
            <p className="text-error text-xs">{error}</p>
          )}

          <button type="submit" disabled={isPending} className="btn mt-2">
            {isPending ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="text-secondary text-xs text-center">
          No account?{" "}
          <Link href="/signup" className="text-primary hover:text-accent transition-colors">
            Create one
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
