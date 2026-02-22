import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-6 py-16">
        <h1 className="mb-2 text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Bus Pass Management
        </h1>
        <p className="mb-12 text-center text-zinc-400">
          Sign in or register to continue
        </p>

        <div className="flex w-full flex-col gap-4 sm:max-w-sm">
          <Link
            href="/login?role=student"
            className="flex items-center justify-center rounded-xl bg-emerald-600 px-6 py-4 text-lg font-semibold text-white transition hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-zinc-950"
          >
            Login as Student
          </Link>
          <Link
            href="/login?role=admin"
            className="flex items-center justify-center rounded-xl bg-zinc-700 px-6 py-4 text-lg font-semibold text-white transition hover:bg-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 focus:ring-offset-zinc-950"
          >
            Login as Admin
          </Link>
        </div>

        <div className="mt-10 flex flex-col gap-3 text-center sm:flex-row sm:gap-6">
          <Link
            href="/register?role=student"
            className="text-sm text-zinc-400 underline decoration-zinc-600 underline-offset-2 hover:text-emerald-400 hover:decoration-emerald-500"
          >
            Register as Student
          </Link>
          <Link
            href="/register?role=admin"
            className="text-sm text-zinc-400 underline decoration-zinc-600 underline-offset-2 hover:text-emerald-400 hover:decoration-emerald-500"
          >
            Register as Admin
          </Link>
        </div>
      </div>
    </div>
  );
}
