import Link from "next/link";
import SpotlightCard from "@/components/SpotlightCard";
import HolographicBackgroundAnimated from "@/components/HolographicBackgroundAnimated";

export default function Home() {
  return (
    <div className="min-h-screen min-h-[100dvh] flex flex-col items-center justify-center px-4 sm:px-6 py-8 sm:py-16 w-full max-w-full box-border relative">
      <HolographicBackgroundAnimated />
      <SpotlightCard className="w-full max-w-md shadow-lg backdrop-blur-sm mx-auto">
        <h1 className="mb-2 text-center text-2xl sm:text-3xl font-bold tracking-tight text-white sm:text-4xl">
          BusNova.v3
        </h1>
        <p className="mb-8 sm:mb-10 text-center text-zinc-400 text-sm sm:text-base">
          Sign in or register to continue
        </p>

        <div className="flex w-full flex-col gap-3 sm:gap-4">
          <Link
            href="/login?role=student"
            className="flex items-center justify-center rounded-xl bg-amber-500 px-6 py-3.5 sm:py-4 text-base sm:text-lg font-semibold text-black transition hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-zinc-900/80 backdrop-blur-sm min-h-[48px] touch-manipulation"
          >
            Login as Student
          </Link>
          <Link
            href="/login?role=admin"
            className="flex items-center justify-center rounded-xl bg-black border border-amber-500/50 px-6 py-3.5 sm:py-4 text-base sm:text-lg font-semibold text-white transition hover:border-amber-400/70 hover:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-zinc-900/80 backdrop-blur-sm min-h-[48px] touch-manipulation"
          >
            Login as Admin
          </Link>
        </div>

        <div className="mt-6 sm:mt-8 flex flex-col gap-3 text-center sm:flex-row sm:justify-center sm:gap-6">
          <Link
            href="/register?role=student"
            className="text-sm text-zinc-400 underline decoration-white/20 underline-offset-2 hover:text-amber-400 hover:decoration-amber-500"
          >
            Register as Student
          </Link>
          <Link
            href="/register?role=admin"
            className="text-sm text-zinc-400 underline decoration-white/20 underline-offset-2 hover:text-amber-400 hover:decoration-amber-500"
          >
            Register as Admin
          </Link>
        </div>
      </SpotlightCard>
    </div>
  );
}
