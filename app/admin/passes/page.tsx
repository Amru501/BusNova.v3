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

type Pass = {
  id: number;
  user_id: number;
  route_id: number;
  pass_type: string;
  amount: number;
  payment_status: string;
  approval_status: string;
  is_active: boolean;
  created_at: string;
  route_name: string;
  user_name: string;
  user_email: string;
};

export default function PassesPage() {
  const [passes, setPasses] = useState<Pass[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  function loadPasses() {
    fetch("/api/passes")
      .then((res) => res.json())
      .then((data) => {
        if (data.passes) setPasses(data.passes);
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadPasses();
  }, []);

  async function handleAction(passId: number, action: "approve" | "reject") {
    const res = await fetch(`/api/passes/${passId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    if (res.ok) loadPasses();
  }

  const filteredPasses = passes.filter(pass => {
    // Map database `approval_status` (pending, approved, rejected) to our UI filters (All, Active, Pending, Declined)
    let statusMapped = pass.approval_status === "approved" ? "Active" :
      pass.approval_status === "pending" ? "Pending" :
        "Declined";

    const matchesSearch = (pass.user_name || pass.user_email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(pass.id).includes(searchQuery) ||
      (pass.route_name || "").toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = filterStatus === "All" || statusMapped === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'pending': return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
      case 'rejected': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-zinc-800 text-zinc-500 border-white/5';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "approved": return "Active";
      case "pending": return "Pending";
      case "rejected": return "Declined";
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
            <span className="text-amber-500 font-bold uppercase tracking-widest text-[10px]">Admin Console</span>
          </motion.div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter">
                Pass <span className="text-amber-500 italic">Approvals</span>
              </h1>
              <p className="text-zinc-500 mt-2 max-w-md">
                Monitor IDs, verify payments, and authorize digital credentials across the network.
              </p>
            </div>
            <div className="flex gap-2 p-1 bg-zinc-900/50 backdrop-blur-md rounded-2xl border border-white/5">
              {["All", "Active", "Pending", "Declined"].map((status) => (
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
            placeholder="Search student, ID, or Route..."
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
            {/* Passes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <AnimatePresence mode="popLayout">
                {filteredPasses.map((pass, index) => (
                  <motion.div
                    key={pass.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <SpotlightCard className="group p-0 border-white/5 overflow-visible">
                      {/* Digital Ticket Layout */}
                      <div className="relative">
                        {/* Ticket Header: Status and ID */}
                        <div className="p-6 border-b border-dashed border-zinc-800/80 bg-gradient-to-br from-zinc-800/20 to-transparent">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className={`px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest inline-flex items-center gap-1.5 mb-4 ${getStatusStyles(pass.approval_status)}`}>
                                {pass.approval_status === 'approved' && <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse shadow-[0_0_8px_#f59e0b]" />}
                                {pass.approval_status === 'pending' && <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-pulse" />}
                                {getStatusLabel(pass.approval_status)}
                              </div>
                              <h3 className="text-2xl font-black text-white tracking-tight leading-none group-hover:text-amber-400 transition-colors">
                                {pass.user_name || pass.user_email}
                              </h3>
                              <p className="text-[11px] text-zinc-500 font-mono mt-2 tracking-widest">ID: {pass.id}</p>
                            </div>
                            <div className="text-right">
                              <span className="text-[10px] text-zinc-600 font-black uppercase tracking-widest block mb-1">Pass Type</span>
                              <span className="px-3 py-1 bg-zinc-800/80 rounded-lg text-[10px] font-bold text-white border border-white/5 capitalize">
                                {pass.pass_type}
                              </span>
                            </div>
                          </div>

                          {/* Notches for Ticket Effect */}
                          <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-[#0f0f12] rounded-full border border-white/5" />
                          <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-[#0f0f12] rounded-full border border-white/5" />
                        </div>

                        {/* Ticket Body: Details */}
                        <div className="p-6 space-y-6">
                          <div className="grid grid-cols-2 gap-6">
                            <div className="col-span-2">
                              <label className="text-[9px] text-zinc-600 font-black uppercase tracking-widest block mb-1.5">Route Assignment</label>
                              <p className="text-sm text-zinc-300 font-medium leading-relaxed">{pass.route_name}</p>
                            </div>
                            <div>
                              <label className="text-[9px] text-zinc-600 font-black uppercase tracking-widest block mb-1.5">Amount</label>
                              <p className="text-lg font-black text-white">₹{pass.amount}</p>
                            </div>
                            <div>
                              <label className="text-[9px] text-zinc-600 font-black uppercase tracking-widest block mb-1.5">Payment</label>
                              <span className={`text-xs font-bold capitalize ${pass.payment_status === 'paid' ? 'text-amber-400' : 'text-zinc-500'}`}>
                                {pass.payment_status}
                              </span>
                            </div>
                          </div>

                          {/* Interaction Area: Approval Actions */}
                          <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                            <p className="text-[9px] text-zinc-600 font-mono uppercase tracking-tighter">Issue Date: {new Date(pass.created_at).toLocaleDateString()}</p>

                            <div className="flex gap-2">
                              {pass.payment_status === 'paid' && pass.approval_status === 'pending' && (
                                <>
                                  <button
                                    onClick={() => handleAction(pass.id, 'reject')}
                                    className="px-4 py-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                                  >
                                    Reject
                                  </button>
                                  <button
                                    onClick={() => handleAction(pass.id, 'approve')}
                                    className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-amber-900/20"
                                  >
                                    Approve
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </SpotlightCard>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Empty State */}
            {filteredPasses.length === 0 && (
              <div className="py-20 text-center">
                <div className="w-16 h-16 bg-zinc-900 border border-white/5 rounded-3xl flex items-center justify-center mx-auto mb-4 text-zinc-700">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-zinc-400 font-bold">No records matched</h3>
                <p className="text-zinc-600 text-xs mt-1">Try adjusting your filters or search terms.</p>
              </div>
            )}
          </>
        )}

        {/* Footer */}
        <footer className="mt-20 py-10 border-t border-white/5 text-center">
          <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.3em]">
            BusNova Credential Authority • Secure Ledger v3
          </p>
        </footer>
      </div>
    </div>
  );
}
