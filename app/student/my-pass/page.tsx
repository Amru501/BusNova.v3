"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

type Pass = {
  id: number;
  route_id: number;
  pass_type: string;
  amount: number;
  payment_status: string;
  approval_status: string;
  is_active: boolean;
  active_at: string | null;
  expires_at: string | null;
  created_at: string;
  route_name: string;
};

function isExpired(p: Pass): boolean {
  return !!(p.expires_at && new Date(p.expires_at) <= new Date());
}

function statusLabel(p: Pass): string {
  if (p.is_active && isExpired(p)) return "Expired";
  if (p.is_active) return "Active";
  if (p.payment_status === "pending" && p.approval_status === "pending") return "Payment Pending";
  if (p.payment_status === "paid" && p.approval_status === "pending") return "Awaiting Approval";
  if (p.approval_status === "rejected") return "Rejected";
  if (p.payment_status === "paid" && p.approval_status === "approved") return isExpired(p) ? "Expired" : "Active";
  return `${p.payment_status} / ${p.approval_status}`;
}

function statusDotColor(p: Pass): string {
  if (isExpired(p)) return "bg-red-500";
  if (p.is_active) return "bg-amber-500";
  if (p.payment_status === "pending" && p.approval_status === "pending") return "bg-amber-500";
  if (p.approval_status === "rejected") return "bg-red-500";
  return "bg-zinc-500";
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function TiltCard({ children }: { children: React.ReactNode }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
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

export default function MyPassPage() {
  const [passes, setPasses] = useState<Pass[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/passes")
      .then((res) => res.json())
      .then((data) => {
        if (data.passes) setPasses(data.passes);
      })
      .finally(() => setLoading(false));
  }, []);

  const primaryPass = passes.length > 0 ? passes[0] : null;
  const pendingPayment = passes.find(
    (p) => p.payment_status === "pending" && p.approval_status === "pending"
  );
  const otherPasses = passes.slice(1);

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
              Student Portal
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="text-3xl md:text-4xl font-black tracking-tighter"
          >
            My <span className="text-amber-500 italic">Pass</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-zinc-500 mt-2 max-w-md text-sm"
          >
            Your current active transportation pass and authorization token.
          </motion.p>
        </header>

        {loading ? (
          <p className="text-zinc-400">Loading...</p>
        ) : passes.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-zinc-900/80 backdrop-blur-xl py-12 text-center max-w-md">
            <p className="text-zinc-400">You don&apos;t have any passes yet.</p>
            <Link
              href="/student/request"
              className="mt-4 inline-block text-amber-400 hover:underline"
            >
              Request a pass →
            </Link>
          </div>
        ) : primaryPass ? (
          <>
            {/* Main pass card */}
            <section className="mb-10">
              <TiltCard>
                <div className="relative group overflow-visible">
                  <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/20 to-amber-400/10 rounded-[2.5rem] blur-2xl opacity-50 group-hover:opacity-100 transition duration-1000" />
                  <div className="relative bg-zinc-900 rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden">
                    {/* Perforated top section */}
                    <div className="p-8 md:p-10 border-b-2 border-dashed border-zinc-800/80 relative bg-gradient-to-br from-zinc-800/40 to-transparent">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
                        <div style={{ transform: "translateZ(40px)" }}>
                          <div className="flex items-center gap-2 mb-4">
                            <span
                              className={`w-2 h-2 rounded-full animate-pulse shadow-[0_0_10px] ${statusDotColor(primaryPass)} ${
                                primaryPass.is_active && !isExpired(primaryPass)
                                  ? "shadow-amber-500/50"
                                  : "shadow-zinc-500/50"
                              }`}
                            />
                            <span
                              className={`text-[10px] font-black uppercase tracking-[0.2em] ${
                                isExpired(primaryPass) ? "text-red-400" : "text-amber-500"
                              }`}
                            >
                              {statusLabel(primaryPass)} Pass
                            </span>
                          </div>
                          <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-2 leading-none text-white">
                            College – {primaryPass.route_name}
                          </h2>
                          <p className="text-zinc-500 font-mono text-sm tracking-tighter">
                            ID: #BN-{primaryPass.id}
                          </p>
                        </div>
                        <div className="text-right shrink-0" style={{ transform: "translateZ(30px)" }}>
                          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-3xl inline-block">
                            <div className="w-12 h-12 bg-white rounded-lg p-1.5 mx-auto">
                              <div className="w-full h-full bg-zinc-900 grid grid-cols-3 gap-0.5 p-0.5">
                                {[...Array(9)].map((_, i) => (
                                  <div
                                    key={i}
                                    className="bg-white/90 rounded-[1px]"
                                    aria-hidden
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-[9px] text-zinc-600 mt-3 font-black uppercase tracking-widest">
                              Digital Token
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="absolute -bottom-5 -left-5 w-10 h-10 bg-[#0f0f12] rounded-full border border-white/5 z-20" />
                      <div className="absolute -bottom-5 -right-5 w-10 h-10 bg-[#0f0f12] rounded-full border border-white/5 z-20" />
                    </div>

                    {/* Info grid */}
                    <div
                      className="p-8 md:p-10 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
                      style={{ transform: "translateZ(20px)" }}
                    >
                      <div>
                        <label className="text-[10px] text-zinc-600 font-black uppercase tracking-widest block mb-2">
                          Pass Type
                        </label>
                        <p className="text-white font-bold text-lg leading-none">
                          {primaryPass.pass_type.charAt(0).toUpperCase() + primaryPass.pass_type.slice(1)}
                        </p>
                      </div>
                      <div>
                        <label className="text-[10px] text-zinc-600 font-black uppercase tracking-widest block mb-2">
                          Amount Paid
                        </label>
                        <p className="text-amber-400 font-bold text-lg leading-none">₹{primaryPass.amount}</p>
                      </div>
                      <div>
                        <label className="text-[10px] text-zinc-600 font-black uppercase tracking-widest block mb-2">
                          Issued On
                        </label>
                        <p className="text-zinc-300 font-medium text-sm leading-none">
                          {formatDate(primaryPass.active_at ?? primaryPass.created_at)}
                        </p>
                      </div>
                      <div>
                        <label className="text-[10px] text-zinc-600 font-black uppercase tracking-widest block mb-2">
                          Expires On
                        </label>
                        <p className="text-zinc-300 font-medium text-sm leading-none italic">
                          {formatDate(primaryPass.expires_at)}
                        </p>
                      </div>
                    </div>

                    {/* Actions – only show Pay now when pending */}
                    {(primaryPass.payment_status === "pending" &&
                      primaryPass.approval_status === "pending") && (
                      <div className="px-8 md:px-10 pb-8 md:pb-10">
                        <Link
                          href={`/student/pay/${primaryPass.id}`}
                          className="block w-full py-4 bg-amber-600 hover:bg-amber-500 text-black font-bold uppercase tracking-widest text-xs text-center rounded-2xl transition-all hover:scale-[1.01] active:scale-[0.99]"
                        >
                          Pay now — ₹{primaryPass.amount}
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </TiltCard>
            </section>

            {/* Other passes (compact list) */}
            {otherPasses.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-sm font-bold text-zinc-500 uppercase tracking-wider">
                  Other passes
                </h2>
                {otherPasses.map((p) => (
                  <div
                    key={p.id}
                    className="dashboard-panel flex flex-row items-center justify-between gap-4"
                  >
                    <div className="dashboard-panel-body flex-1 min-w-0">
                      <span className={`text-sm font-medium ${isExpired(p) ? "text-red-400" : "text-amber-400"}`}>
                        {statusLabel(p)}
                      </span>
                      <p className="text-white font-semibold truncate">College – {p.route_name}</p>
                      <p className="text-zinc-500 text-sm">
                        {p.pass_type.charAt(0).toUpperCase() + p.pass_type.slice(1)} · ₹{p.amount}
                        {p.expires_at && ` · Expires ${formatDate(p.expires_at)}`}
                      </p>
                    </div>
                    {p.payment_status === "pending" && p.approval_status === "pending" && (
                      <Link
                        href={`/student/pay/${p.id}`}
                        className="shrink-0 px-4 py-2 bg-amber-600/20 hover:bg-amber-600 text-amber-400 hover:text-black text-xs font-bold rounded-xl transition-colors"
                      >
                        Pay now
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            )}

            {pendingPayment && pendingPayment.id !== primaryPass?.id && (
              <div className="flex justify-center">
                <Link
                  href={`/student/pay/${pendingPayment.id}`}
                  className="text-sm text-amber-400 hover:underline"
                >
                  Pay for {pendingPayment.route_name} (₹{pendingPayment.amount}) →
                </Link>
              </div>
            )}
          </>
        ) : null}

        {/* Footer */}
        <footer className="mt-12 md:mt-16 py-10 border-t border-white/5 text-center">
          <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.3em]">
            BusNova Secure Ledger • 2025
          </p>
        </footer>
      </div>
    </div>
  );
}
