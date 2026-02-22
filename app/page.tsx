import Link from "next/link";
import SpotlightCard from "@/components/SpotlightCard";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16">
      <SpotlightCard className="w-full max-w-md shadow-lg backdrop-blur-sm">
        <h1 className="mb-2 text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Bus Pass Management
        </h1>
        <p className="mb-10 text-center text-zinc-400">
          Sign in or register to continue
        </p>

        <div className="flex w-full flex-col gap-4">
          <Link
            href="/login?role=student"
            className="flex items-center justify-center rounded-xl bg-emerald-600/90 px-6 py-4 text-lg font-semibold text-white transition hover:bg-emerald-500/90 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-zinc-900/80 backdrop-blur-sm"
          >
            Login as Student
          </Link>
          <Link
            href="/login?role=admin"
            className="flex items-center justify-center rounded-xl bg-zinc-700/80 px-6 py-4 text-lg font-semibold text-white transition hover:bg-zinc-600/80 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 focus:ring-offset-zinc-900/80 backdrop-blur-sm"
          >
            Login as Admin
          </Link>
        </div>

        <div className="mt-8 flex flex-col gap-3 text-center sm:flex-row sm:justify-center sm:gap-6">
          <Link
            href="/register?role=student"
            className="text-sm text-zinc-400 underline decoration-white/20 underline-offset-2 hover:text-emerald-400 hover:decoration-emerald-500"
          >
            Register as Student
          </Link>
          <Link
            href="/register?role=admin"
            className="text-sm text-zinc-400 underline decoration-white/20 underline-offset-2 hover:text-emerald-400 hover:decoration-emerald-500"
          >
            Register as Admin
          </Link>
        </div>
      </SpotlightCard>
    </div>
  );
}
