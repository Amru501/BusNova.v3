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
          phone: phone || undefined,
          password,
          role,
          ...(role === "admin" && { admin_type: adminType }),
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
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
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
              Phone {role === "admin" ? "(required)" : "(optional)"}
            </label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1234567890"
              required={role === "admin"}
            />
          </div>
          {role === "admin" && (
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
            className="text-emerald-400 hover:underline"
          >
            Login
          </Link>
        </p>
        <p className="mt-4 text-center">
          <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-400">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400">Loading...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
