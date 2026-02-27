"use client";

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';

// --- Reusable Components ---

const SpotlightCard = ({ children, className = "", spotlightColor = "rgba(245, 158, 11, 0.15)" }: any) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: any) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={`relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/80 backdrop-blur-xl shadow-2xl transition-all duration-300 ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-500"
        style={{
          opacity,
          background: `radial-gradient(circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 70%)`,
        }}
      />
      {children}
    </div>
  );
};

// --- Page Component ---

type Payment = {
  id: number;
  pass_id: number;
  amount: number;
  payment_method: string;
  transaction_id: string;
  status: string;
  created_at: string;
  pass_type?: string;
  route_name?: string;
  user_name?: string;
};

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    fetch("/api/payments")
      .then((res) => res.json())
      .then((data) => {
        if (data.payments) setPayments(data.payments);
      })
      .finally(() => setLoading(false));
  }, []);

  const loadPayments = () => {
    setLoading(true);
    fetch("/api/payments")
      .then((res) => res.json())
      .then((data) => {
        if (data.payments) setPayments(data.payments);
      })
      .finally(() => setLoading(false));
  };

  const handleDeletePass = async (passId: number, userLabel: string) => {
    if (!confirm(`Delete pass #${passId} for ${userLabel || "this user"}? This will remove the pass and its payment record from the database.`)) return;
    const res = await fetch(`/api/passes/${passId}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error ?? "Failed to delete pass");
      return;
    }
    loadPayments();
  };

  const filteredPayments = payments.filter(payment => {
    // Map database status (success, failed, pending) to our UI filters (All, Success, Pending, Failed)
    let statusMapped = payment.status === "success" ? "Success" :
      payment.status === "pending" ? "Pending" :
        "Failed";

    const matchesSearch = (payment.user_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(payment.transaction_id).includes(searchQuery) ||
      String(payment.pass_id).includes(searchQuery);

    const matchesFilter = filterStatus === "All" || statusMapped === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'success': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'pending': return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
      case 'failed': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-zinc-800 text-zinc-500 border-white/5';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "success": return "Success";
      case "pending": return "Pending";
      case "failed": return "Failed";
      default: return status;
    }
  };

  return (
    <div className="w-full text-zinc-100 font-sans selection:bg-amber-500/30">
      <Link href="/admin" className="inline-block text-zinc-400 hover:text-white transition-colors mb-4 border border-white/10 rounded-full px-4 py-1.5 text-xs font-medium bg-black/20 backdrop-blur-sm">
        ← Back to Dashboard
      </Link>

      {/* Background Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1]">
        <div className="absolute top-[-5%] left-[-5%] w-[40%] h-[40%] bg-amber-900/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] bg-amber-950/10 blur-[120px] rounded-full" />
      </div>

      <div className="w-full relative z-10">
        {/* Header Section */}
        <header className="mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 mb-4"
          >
            <div className="h-px w-8 bg-amber-500" />
            <span className="text-amber-500 font-bold uppercase tracking-widest text-[10px]">Financial Ledger</span>
          </motion.div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter">
                Payment <span className="text-amber-500 italic">History</span>
              </h1>
              <p className="text-zinc-500 mt-2 max-w-md">
                Review transactions, verify payment methods, and monitor the revenue stream.
              </p>
            </div>
            <div className="flex gap-2 p-1 bg-zinc-900/50 backdrop-blur-md rounded-2xl border border-white/5">
              {["All", "Success", "Pending", "Failed"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${filterStatus === status
                      ? "bg-amber-600 text-white shadow-lg shadow-amber-900/20"
                      : "text-zinc-500 hover:text-zinc-300"
                    }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* Search Bar */}
        <div className="mb-10 relative group">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Transaction ID, Student, or Pass ID..."
            className="w-full bg-zinc-900/50 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all text-sm font-medium backdrop-blur-md"
          />
          <div className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center flex flex-col items-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="w-10 h-10 border-4 border-white/10 border-t-amber-500 rounded-full mb-4"
            />
            <p className="text-zinc-500 font-black uppercase tracking-widest text-[10px]">Querying database...</p>
          </div>
        ) : (
          <>
            {/* Payments Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredPayments.map((payment, index) => {
                  const dateObj = new Date(payment.created_at);
                  const dateStr = dateObj.toLocaleDateString();
                  const timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                  return (
                    <motion.div
                      key={payment.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <SpotlightCard className="group p-0 border-white/5 overflow-visible">
                        <div className="relative">
                          {/* Receipt Header */}
                          <div className="p-6 border-b border-dashed border-zinc-800/80 bg-gradient-to-br from-zinc-800/20 to-transparent">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className={`px-2.5 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-widest inline-flex items-center gap-1.5 mb-4 ${getStatusStyles(payment.status)}`}>
                                  {payment.status === 'success' && <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_#f59e0b]" />}
                                  {getStatusLabel(payment.status)}
                                </div>
                                <h3 className="text-xl font-bold text-white tracking-tight leading-none group-hover:text-amber-400 transition-colors">
                                  {payment.user_name || "—"}
                                </h3>
                                <p className="text-[10px] text-zinc-600 font-mono mt-1 tracking-widest">Pass ID: {payment.pass_id}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest mb-1">Transaction ID</p>
                                <p className="text-xs font-mono text-zinc-400">{payment.transaction_id || "—"}</p>
                              </div>
                            </div>

                            {/* Side Notches for Receipt Feel */}
                            <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-[#0f0f12] rounded-full border border-white/5" />
                            <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-[#0f0f12] rounded-full border border-white/5" />
                          </div>

                          {/* Receipt Body */}
                          <div className="p-6">
                            <div className="grid grid-cols-2 gap-y-4">
                              <div>
                                <label className="text-[9px] text-zinc-600 font-black uppercase tracking-widest block mb-0.5">Method</label>
                                <p className="text-xs text-zinc-300 font-medium capitalize">{payment.payment_method || "—"}</p>
                              </div>
                              <div className="text-right">
                                <label className="text-[9px] text-zinc-600 font-black uppercase tracking-widest block mb-0.5">Amount</label>
                                <p className="text-xl font-black text-white">₹{payment.amount}</p>
                              </div>
                              <div>
                                <label className="text-[9px] text-zinc-600 font-black uppercase tracking-widest block mb-0.5">Route / Scope</label>
                                <p className="text-xs text-zinc-400 font-mono tracking-tighter truncate">{payment.route_name || "—"}</p>
                              </div>
                              <div className="text-right">
                                <label className="text-[9px] text-zinc-600 font-black uppercase tracking-widest block mb-0.5">{dateStr}</label>
                                <p className="text-xs text-zinc-400 font-mono">{timeStr}</p>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-all">
                              <span className="text-[9px] text-zinc-600 font-mono uppercase tracking-widest">DB ID: {payment.id}</span>
                              <button
                                type="button"
                                onClick={() => handleDeletePass(payment.pass_id, payment.user_name ?? "—")}
                                className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 text-[10px] font-black uppercase tracking-widest rounded-xl transition-colors border border-red-500/20"
                              >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </SpotlightCard>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Empty State */}
            {filteredPayments.length === 0 && (
              <div className="py-20 text-center">
                <div className="w-16 h-16 bg-zinc-900 border border-white/5 rounded-3xl flex items-center justify-center mx-auto mb-4 text-zinc-700">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-zinc-400 font-bold">No transactions found</h3>
                <p className="text-zinc-600 text-xs mt-1">Refine your search parameters or check other status filters.</p>
              </div>
            )}
          </>
        )}

        {/* Footer */}
        <footer className="mt-20 py-10 border-t border-white/5 text-center">
          <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.3em]">
            BusNova Financial Systems • Secure Transaction Engine v3
          </p>
        </footer>
      </div>
    </div>
  );
}
