"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { createClient } from "@/core/supabase/client";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({ email, password });

      if (error) {
        setError(error.message);
        return;
      }

      setSubmitted(true);
    });
  }

  return (
    <AnimatePresence mode="wait">
      {submitted ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm"
        >
          <div className="holo-border glow-cyan rounded-holo p-8 text-center space-y-4">
            <div className="text-4xl">✉️</div>
            <h2 className="text-lg font-bold text-neon-cyan text-glow-cyan">
              Check your email
            </h2>
            <p className="text-ghost-white/60 text-sm leading-relaxed">
              A confirmation link was sent to{" "}
              <span className="text-ghost-white">{email}</span>. Click it to
              activate your account.
            </p>
            <Link
              href="/login"
              className="block text-neon-cyan text-xs hover:opacity-80 transition-opacity"
            >
              Back to sign in
            </Link>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="form"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-sm"
        >
          <div className="holo-border glow-cyan rounded-holo p-8 space-y-6">
            <div className="space-y-1 text-center">
              <h1 className="text-2xl font-bold text-neon-cyan text-glow-cyan tracking-tight">
                WorkoutBud
              </h1>
              <p className="text-muted text-xs font-mono tracking-widest uppercase">
                Create Account
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
                  minLength={8}
                  autoComplete="new-password"
                  placeholder="Min 8 characters"
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
                {isPending ? "Creating account…" : "Create Account"}
              </button>
            </form>

            <p className="text-center text-muted text-xs">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-neon-cyan hover:opacity-80 transition-opacity"
              >
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
