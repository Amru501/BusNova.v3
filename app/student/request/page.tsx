"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import SpotlightCard from "@/components/SpotlightCard";

type Route = {
  id: number;
  name: string;
  daily_price: number;
  weekly_price: number;
};

function TiltCard({ children }: { children: React.ReactNode }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / rect.width - 0.5);
    y.set(mouseY / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="perspective-1000"
    >
      {children}
    </motion.div>
  );
}

type Pass = {
  id: number;
  is_active: boolean;
  expires_at: string | null;
};

export default function RequestPassPage() {
  const router = useRouter();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [routeId, setRouteId] = useState("");
  const [passType, setPassType] = useState<"daily" | "weekly">("daily");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasActivePass, setHasActivePass] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/routes")
      .then((res) => res.json())
      .then((data) => {
        if (data.routes) setRoutes(data.routes);
      });
  }, []);

  useEffect(() => {
    fetch("/api/passes")
      .then((res) => res.json())
      .then((data) => {
        const passes: Pass[] = data.passes ?? [];
        const active = passes.some(
          (p) =>
            p.is_active &&
            (!p.expires_at || new Date(p.expires_at) > new Date())
        );
        setHasActivePass(active);
      })
      .catch(() => setHasActivePass(false));
  }, []);

  const selectedRoute = routes.find((r) => r.id === Number(routeId));
  const amount = selectedRoute
    ? passType === "daily"
      ? selectedRoute.daily_price
      : selectedRoute.weekly_price
    : 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!routeId) {
      setError("Please select a route");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/passes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ route_id: Number(routeId), pass_type: passType }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to request pass");
        return;
      }
      if (data.pass_id) {
        router.push(`/student/pay/${data.pass_id}`);
      } else {
        router.push("/student");
      }
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-[60vh]">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-5%] left-[-5%] w-[40%] h-[40%] bg-amber-900/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] bg-amber-950/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 space-y-6">
        <Link
          href="/student"
          className="inline-block text-zinc-400 hover:text-amber-400 transition-colors"
        >
          ← Dashboard
        </Link>

        {/* Header */}
        <header className="mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-2 mb-4"
          >
            <div className="h-px w-8 bg-amber-500" />
            <span className="text-amber-500 font-bold uppercase tracking-widest text-[10px]">
              New Request
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="text-3xl md:text-4xl font-black tracking-tighter"
          >
            Request <span className="text-amber-500 italic">Pass</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-zinc-500 mt-2 max-w-md text-sm"
          >
            Configure your transit credentials and get instant digital authorization.
          </motion.p>
        </header>

        {hasActivePass === true ? (
          <SpotlightCard
            className="p-8 md:p-10 border border-white/10 bg-zinc-900/80 backdrop-blur-xl shadow-2xl max-w-lg"
            spotlightColor="rgba(245, 158, 11, 0.15)"
          >
            <p className="text-lg font-semibold text-white mb-2">You already own a pass.</p>
            <p className="text-zinc-500 text-sm mb-6">
              You can request a new pass only after your current pass expires.
            </p>
            <Link
              href="/student/my-pass"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-black font-bold rounded-xl text-sm transition-colors"
            >
              View my pass
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </SpotlightCard>
        ) : (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start">
          {/* Left: Form */}
          <div className="lg:col-span-3 space-y-6">
            <SpotlightCard
              className="p-6 md:p-8 border border-white/10 bg-zinc-900/80 backdrop-blur-xl shadow-2xl"
              spotlightColor="rgba(245, 158, 11, 0.15)"
            >
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Route selection */}
                <div className="space-y-4">
                  <label className="text-xs text-zinc-500 uppercase font-black tracking-widest flex items-center gap-2">
                    <span className="w-1 h-1 bg-amber-500 rounded-full" />
                    Select Route
                  </label>
                  <div className="grid grid-cols-1 gap-3">
                    {routes.length === 0 ? (
                      <p className="text-zinc-500 text-sm">Loading routes...</p>
                    ) : (
                      routes.map((r) => (
                        <button
                          key={r.id}
                          type="button"
                          onClick={() => setRouteId(String(r.id))}
                          className={`text-left p-4 rounded-2xl border transition-all duration-300 text-sm font-medium ${
                            routeId === String(r.id)
                              ? "bg-amber-500/10 border-amber-500/50 text-amber-400"
                              : "bg-white/5 border-white/5 text-zinc-400 hover:bg-white/10"
                          }`}
                        >
                          College – {r.name}
                        </button>
                      ))
                    )}
                  </div>
                </div>

                {/* Pass type */}
                <div className="space-y-4">
                  <label className="text-xs text-zinc-500 uppercase font-black tracking-widest flex items-center gap-2">
                    <span className="w-1 h-1 bg-amber-500 rounded-full" />
                    Pass Type
                  </label>
                  <div className="flex gap-3">
                    {(["daily", "weekly"] as const).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setPassType(type)}
                        className={`flex-1 p-5 rounded-2xl border transition-all duration-300 text-center ${
                          passType === type
                            ? "bg-amber-500/10 border-amber-500/50 text-amber-400"
                            : "bg-white/5 border-white/5 text-zinc-400 hover:bg-white/10"
                        }`}
                      >
                        <div className="text-base font-black tracking-tight capitalize">
                          {type}
                        </div>
                        {selectedRoute && (
                          <div className="text-xs text-zinc-500 mt-1 font-normal">
                            ₹{type === "daily" ? selectedRoute.daily_price : selectedRoute.weekly_price}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {selectedRoute && (
                  <p className="text-sm text-zinc-500">
                    Amount: <span className="font-semibold text-white">₹{amount}</span>
                  </p>
                )}

                {error && (
                  <p className="text-sm text-red-400">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading || routes.length === 0}
                  className="w-full py-5 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-black font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-amber-900/20 flex items-center justify-center gap-3 overflow-hidden relative group"
                >
                  {loading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full"
                    />
                  ) : (
                    <>
                      <span>Generate Digital Pass</span>
                      <svg
                        className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            </SpotlightCard>

            <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-[0.2em] text-center px-4">
              Automatic validation enabled. Digital passes are issued instantly upon payment confirmation.
            </p>
          </div>

          {/* Right: Preview */}
          <div className="lg:col-span-2 lg:sticky lg:top-12">
            <TiltCard>
              <div className="relative group overflow-visible">
                <div className="absolute -inset-1 bg-amber-500/10 rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-100 transition duration-700" />
                <div className="relative bg-zinc-900 rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden scale-90 origin-top">
                  {/* Ticket top */}
                  <div className="p-6 md:p-8 border-b-2 border-dashed border-zinc-800 relative bg-gradient-to-br from-zinc-800/50 to-transparent">
                    <div className="flex justify-between items-start mb-6">
                      <div style={{ transform: "translateZ(30px)" }}>
                        <div className="w-8 h-8 bg-amber-500/20 rounded-xl flex items-center justify-center text-amber-500 mb-4">
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            aria-hidden
                          >
                            <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" />
                          </svg>
                        </div>
                        <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em]">
                          New Pass Request
                        </p>
                      </div>
                      <div className="text-right" style={{ transform: "translateZ(20px)" }}>
                        <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest italic opacity-50">
                          {selectedRoute ? `₹${amount}` : "Pricing varies by route"}
                        </p>
                      </div>
                    </div>
                    <h4 className="text-xl md:text-2xl font-black tracking-tight leading-tight min-h-[3rem] text-white">
                      {selectedRoute ? `College – ${selectedRoute.name}` : "Select a route"}
                    </h4>
                    <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-[#0f0f12] rounded-full border border-white/5" />
                    <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-[#0f0f12] rounded-full border border-white/5" />
                  </div>
                  {/* Details grid */}
                  <div
                    className="p-6 md:p-8 grid grid-cols-2 gap-6"
                    style={{ transform: "translateZ(10px)" }}
                  >
                    <div>
                      <label className="text-[9px] text-zinc-600 font-black uppercase tracking-widest block mb-1">
                        Validity
                      </label>
                      <p className="text-white font-bold text-sm capitalize">
                        {passType} Access
                      </p>
                    </div>
                    <div>
                      <label className="text-[9px] text-zinc-600 font-black uppercase tracking-widest block mb-1">
                        Status
                      </label>
                      <p className="text-zinc-500 font-bold text-sm tracking-tight italic">
                        Awaiting Issue
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TiltCard>

            {/* Requirements */}
            <div className="mt-6 p-6 bg-white/5 border border-white/5 rounded-3xl backdrop-blur-sm">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-4">
                Requirements
              </h4>
              <ul className="space-y-3">
                {[
                  "Valid Student Credentials",
                  "Cleared Transaction Balance",
                  "One Pass Per User Limit",
                ].map((text, i) => (
                  <li key={i} className="flex items-center gap-3 text-xs text-zinc-400">
                    <div className="w-4 h-4 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0">
                      <svg
                        className="w-2 h-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-hidden
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    {text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
