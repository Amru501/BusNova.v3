"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import SpotlightCard from "@/components/SpotlightCard";

type Pass = {
  id: number;
  route_id: number;
  pass_type: string;
  amount: number;
  payment_status: string;
  route_name: string;
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

export default function PaymentPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [pass, setPass] = useState<Pass | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/passes")
      .then((res) => res.json())
      .then((data) => {
        const p = data.passes?.find((x: { id: number }) => x.id === parseInt(id, 10));
        setPass(p ?? null);
      });
  }, [id]);

  async function handlePay(e: React.FormEvent) {
    e.preventDefault();
    if (!pass) return;
    if (pass.payment_status === "paid") {
      router.push("/student");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pass_id: pass.id, payment_method: "Simulated" }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Payment failed");
        return;
      }
      router.push("/student");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  if (!pass) {
    return (
      <div className="space-y-6">
        <Link href="/student" className="inline-flex items-center gap-2 text-zinc-400 hover:text-amber-400 transition-colors">
          <span className="text-amber-500">←</span> Dashboard
        </Link>
        <p className="text-zinc-400">Loading pass...</p>
      </div>
    );
  }

  if (pass.payment_status === "paid") {
    return (
      <div className="space-y-6">
        <Link href="/student" className="inline-flex items-center gap-2 text-zinc-400 hover:text-amber-400 transition-colors">
          <span className="text-amber-500">←</span> Dashboard
        </Link>
        <div className="rounded-3xl border border-white/10 bg-zinc-900/80 backdrop-blur-xl p-8">
          <p className="text-amber-400 font-medium">This pass is already paid.</p>
          <Link href="/student" className="inline-block mt-4 text-sm text-amber-500 hover:underline">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const passId = `BP-${String(pass.id).padStart(7, "0")}`;
  const routeLabel = `College – ${pass.route_name}`;

  return (
    <div className="min-h-full text-zinc-100 font-sans">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-5%] left-[-5%] w-[40%] h-[40%] bg-amber-900/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] bg-amber-800/10 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <Link href="/student" className="inline-flex items-center gap-2 text-zinc-400 hover:text-amber-400 transition-colors mb-8">
          <span className="text-amber-500">←</span> Dashboard
        </Link>

        {/* Header */}
        <header className="mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 mb-4"
          >
            <div className="h-px w-8 bg-amber-500" />
            <span className="text-amber-500 font-bold uppercase tracking-widest text-[10px]">Checkout</span>
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter">
            Finalize <span className="text-amber-500 italic">Payment</span>
          </h1>
          <p className="text-zinc-500 mt-2 max-w-md">
            Complete your transaction to activate your digital transit pass.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
          {/* Left: Payment action (simulated – no form fields) */}
          <div className="lg:col-span-3 space-y-8">
            <SpotlightCard className="p-8 border-white/5" spotlightColor="rgba(245, 158, 11, 0.15)">
              <div className="mb-8">
                <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-2">
                  Simulated payment
                </p>
                <p className="text-sm text-zinc-400">
                  No card or bank details required. Click below to confirm and activate your pass.
                </p>
              </div>

              <form onSubmit={handlePay} className="space-y-6">
                {error && (
                  <p className="text-sm text-red-400">{error}</p>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-5 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-amber-900/20 flex items-center justify-center gap-3 group relative overflow-hidden"
                >
                  {loading ? (
                    <div className="flex items-center gap-3">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      />
                      <span className="text-[11px]">Verifying...</span>
                    </div>
                  ) : (
                    <>
                      <span>Complete Payment</span>
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            </SpotlightCard>

            <div className="flex items-center justify-center gap-8 opacity-40 grayscale text-[10px] font-black uppercase tracking-widest text-zinc-500">
              <span>SSL Secured</span>
              <span>AES-256 Encryption</span>
              <span>PCI Compliant</span>
            </div>
          </div>

          {/* Right: Pass summary ticket */}
          <div className="lg:col-span-2 sticky top-12">
            <TiltCard>
              <div className="relative group overflow-visible">
                <div className="absolute -inset-1 bg-amber-500/10 rounded-[2.5rem] blur-2xl opacity-30 group-hover:opacity-60 transition duration-700" />
                <div className="relative bg-zinc-900 rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden scale-95 origin-top">
                  <div className="p-8 border-b-2 border-dashed border-zinc-800/80 bg-gradient-to-br from-zinc-800/40 to-transparent">
                    <div className="flex justify-between items-start mb-10" style={{ transform: "translateZ(30px)" }}>
                      <div>
                        <p className="text-[10px] text-amber-500 font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          Summary
                        </p>
                        <h4 className="text-2xl font-black tracking-tight leading-tight text-white uppercase">
                          {pass.pass_type} Pass
                        </h4>
                      </div>
                    </div>
                    <div className="space-y-1" style={{ transform: "translateZ(20px)" }}>
                      <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Assigned Route</p>
                      <p className="text-sm font-bold text-zinc-100">{routeLabel}</p>
                    </div>
                    <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-[#0f0f12] rounded-full border border-white/5" />
                    <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-[#0f0f12] rounded-full border border-white/5" />
                  </div>

                  <div className="p-8 space-y-8" style={{ transform: "translateZ(10px)" }}>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest mb-1">Pass ID</p>
                        <p className="text-xs font-mono text-zinc-400">{passId}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest mb-1">Validity</p>
                        <p className="text-xs text-zinc-400">{pass.pass_type === "weekly" ? "7 Days Access" : "1 Day Access"}</p>
                      </div>
                    </div>

                    <div className="pt-8 border-t border-white/5 flex justify-between items-end">
                      <div>
                        <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest mb-1">Total Due</p>
                        <p className="text-3xl font-black text-white">₹{pass.amount}</p>
                      </div>
                      <div className="text-[8px] text-zinc-700 font-black uppercase tracking-[0.3em] mb-1">
                        Ref: {passId}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TiltCard>

            <div className="mt-8 p-6 bg-white/5 border border-white/5 rounded-3xl backdrop-blur-sm">
              <h5 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Transit Policy</h5>
              <p className="text-[11px] text-zinc-600 leading-relaxed italic">
                Digital passes are generated immediately after successful verification. All transit transactions are final and non-refundable upon ticket activation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
