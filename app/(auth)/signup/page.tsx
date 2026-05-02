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
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-sm"
        >
          <div className="card p-8 space-y-4">
            <div className="w-10 h-10 rounded-full bg-surface-raised flex items-center justify-center">
              <span className="text-lg">✉</span>
            </div>
            <div className="space-y-1">
              <h2 className="text-base font-semibold text-primary">Check your email</h2>
              <p className="text-secondary text-sm leading-relaxed">
                Confirmation sent to{" "}
                <span className="text-primary">{email}</span>.
              </p>
            </div>
            <Link
              href="/login"
              className="text-secondary text-xs hover:text-primary transition-colors"
            >
              ← Back to sign in
            </Link>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="form"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full max-w-sm"
        >
          <div className="card p-8 space-y-7">
            <div className="space-y-1">
              <h1 className="text-xl font-semibold text-primary tracking-tight">
                Create account
              </h1>
              <p className="text-secondary text-sm">Join WorkoutBud</p>
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
                  minLength={8}
                  autoComplete="new-password"
                  placeholder="Min 8 characters"
                  className="field"
                />
              </div>

              {error && <p className="text-error text-xs">{error}</p>}

              <button type="submit" disabled={isPending} className="btn mt-2">
                {isPending ? "Creating account…" : "Create account"}
              </button>
            </form>

            <p className="text-secondary text-xs text-center">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-primary hover:text-accent transition-colors"
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
