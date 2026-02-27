"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = (searchParams.get("role") === "admin" ? "admin" : "student") as "student" | "admin";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [adminType, setAdminType] = useState<"checking" | "driver" | "administrator">("administrator");
  const [securityKey, setSecurityKey] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          password,
          role,
          ...(role === "admin" && { admin_type: adminType, security_key: securityKey }),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Registration failed");
        return;
      }
      router.push(role === "admin" ? "/admin" : "/student");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  const title = role === "admin" ? "Register as Admin" : "Register as Student";

  return (
    <div className="min-h-screen min-h-[100dvh] flex flex-col px-4 py-6 sm:py-12">
      <span className="inline-block shrink-0">
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
      <div className="flex flex-1 flex-col items-center justify-center py-6 w-full max-w-full overflow-auto">
        <div className="auth-card w-full max-w-sm p-6 sm:p-8 mx-2">
          <h1 className="text-2xl font-bold text-white mb-6 text-center">{title}</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-zinc-400">
              Name
            </label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
            />
          </div>
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
            <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-zinc-400">
              Phone
            </label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1234567890"
              required
            />
          </div>
          {role === "admin" && (
            <>
              <div>
                <label htmlFor="security_key" className="mb-1.5 block text-sm font-medium text-zinc-400">
                  Admin security key
                </label>
                <Input
                  id="security_key"
                  type="password"
                  value={securityKey}
                  onChange={(e) => setSecurityKey(e.target.value)}
                  placeholder="Enter security key"
                  required={role === "admin"}
                  autoComplete="off"
                />
              </div>
              <div>
                <label htmlFor="admin_type" className="mb-1.5 block text-sm font-medium text-zinc-400">
                  Admin type
                </label>
                <Select
                  id="admin_type"
                  value={adminType}
                  onChange={(e) => setAdminType(e.target.value as "checking" | "driver" | "administrator")}
                >
                  <option value="administrator">Administrator</option>
                  <option value="checking">Checking</option>
                  <option value="driver">Driver</option>
                </Select>
              </div>
            </>
          )}
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
            Create account
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-zinc-500">
          Already have an account?{" "}
          <Link
            href={`/login?role=${role}`}
            className="text-amber-400 hover:underline"
          >
            Login
          </Link>
        </p>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-zinc-400">Loading...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
