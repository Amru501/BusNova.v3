"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = (searchParams.get("role") === "admin" ? "admin" : "student") as "student" | "admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Login failed");
        return;
      }
      router.push(role === "admin" ? "/admin" : "/student");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  const title = role === "admin" ? "Admin Login" : "Student Login";

  return (
    <div className="min-h-screen min-h-[100dvh] flex flex-col px-4">
      <span className="inline-block pt-4 sm:pt-6 shrink-0">
        <Link
          href="/"
          aria-label="Back to home"
          className="back-to-home-box inline-flex touch-manipulation text-amber-500"
        >
          <svg
            className="back-to-home-arrow size-7"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </Link>
      </span>
      <div className="flex flex-1 flex-col items-center justify-center py-6 w-full max-w-full">
        <div className="auth-card w-full max-w-sm p-6 sm:p-8 mx-2">
          <h1 className="text-2xl font-bold text-white mb-6 text-center">{title}</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-zinc-400">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-zinc-400">
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && (
            <p className="text-sm text-red-400">{error}</p>
          )}
          <Button type="submit" className="w-full" isLoading={loading}>
            Sign in
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-zinc-500">
          Don&apos;t have an account?{" "}
          <Link
            href={`/register?role=${role}`}
            className="text-amber-400 hover:underline"
          >
            Register
          </Link>
        </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-zinc-400">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
