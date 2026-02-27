"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'motion/react';
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

const TiltCard = ({ children }: any) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

  const handleMouseMove = (e: any) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
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
};

// --- Page Component ---

type Route = { id: number; name: string; daily_price: number; weekly_price: number };
type Bus = { id: number; bus_number: string; route_id: number; route_name: string };

export default function BusesPage() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [buses, setBuses] = useState<Bus[]>([]);
  const [busNumber, setBusNumber] = useState("");
  const [routeId, setRouteId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  function loadRoutes() {
    fetch("/api/routes")
      .then((res) => res.json())
      .then((data) => {
        if (data.routes) {
          setRoutes(data.routes);
        }
      });
  }

  function loadBuses() {
    fetch("/api/buses")
      .then((res) => res.json())
      .then((data) => {
        if (data.buses) setBuses(data.buses);
      });
  }

  useEffect(() => {
    loadRoutes();
    loadBuses();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);
    try {
      const res = await fetch("/api/buses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bus_number: busNumber, route_id: Number(routeId) }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to add bus");
        return;
      }
      setSuccess(true);
      setBusNumber("");
      setRouteId(routes[0] ? String(routes[0].id) : "");
      loadBuses();
    } finally {
      setLoading(false);
    }
  }

  // Derive selected route name for the preview
  const selectedRouteObj = routes.find(r => String(r.id) === routeId);
  const selectedRouteName = selectedRouteObj ? selectedRouteObj.name : "Unassigned";

  return (
    <div className="w-full text-zinc-100 font-sans selection:bg-amber-500/30 space-y-6">
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
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter">
            Manage <span className="text-amber-500 italic">Fleet</span>
          </h1>
          <p className="text-zinc-500 mt-2 max-w-md">
            Register new vehicles to the transit network and assign them to active corridors.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start mb-16">
          {/* Left Side: Creation Form */}
          <div className="lg:col-span-3 space-y-8">
            <SpotlightCard className="p-8 border-white/5">
              <form onSubmit={handleSubmit} className="space-y-8">
                {error && <p className="text-sm font-medium text-red-400 bg-red-400/10 p-4 rounded-xl border border-red-400/20">{error}</p>}
                {success && <p className="text-sm font-medium text-amber-400 bg-amber-400/10 p-4 rounded-xl border border-amber-400/20">Vehicle initialized securely in database.</p>}

                {/* Assigned Route Selection */}
                <div className="space-y-4">
                  <label className="text-xs text-zinc-500 uppercase font-black tracking-widest flex items-center gap-2">
                    Assigned Corridor
                  </label>
                  <select
                    value={routeId}
                    onChange={(e) => setRouteId(e.target.value)}
                    required
                    className="w-full bg-zinc-900 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all text-sm appearance-none"
                  >
                    <option value="" disabled>Choose a route</option>
                    {routes.map((r) => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                </div>

                {/* Bus Number Input */}
                <div className="space-y-4">
                  <label className="text-xs text-zinc-500 uppercase font-black tracking-widest flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                    Vehicle Identification
                  </label>
                  <input
                    type="text"
                    required
                    value={busNumber}
                    onChange={(e) => setBusNumber(e.target.value)}
                    placeholder="e.g. B101"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all text-sm font-bold tracking-tight"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-5 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-black font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-amber-900/20 flex items-center justify-center gap-3 relative group overflow-hidden"
                >
                  {loading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full"
                    />
                  ) : (
                    <>
                      <span>Register Vehicle</span>
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            </SpotlightCard>
          </div>

          {/* Right Side: Fleet Asset Preview */}
          <div className="lg:col-span-2 sticky top-12 hidden lg:block">
            <TiltCard>
              <div className="relative group overflow-visible">
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/20 to-amber-400/10 rounded-[2.5rem] blur-2xl opacity-40 group-hover:opacity-60 transition duration-700"></div>

                <div className="relative bg-zinc-900 rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden scale-95 origin-top">
                  <div className="p-8 border-b border-zinc-800/80 bg-gradient-to-br from-zinc-800/50 to-transparent">
                    <div className="flex justify-between items-center mb-12">
                      <div className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-[10px] font-black text-amber-500 tracking-widest uppercase">
                        Asset Registry
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_8px_#f59e0b]" />
                        <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-tighter">Live Fleet</span>
                      </div>
                    </div>
                    <h4 className="text-4xl font-black tracking-tighter leading-tight min-h-[4rem] text-white mb-2 break-words">
                      {busNumber || "UNIDENTIFIED"}
                    </h4>
                  </div>

                  <div className="p-8 bg-zinc-900/50">
                    <div>
                      <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-2">Assigned Corridor</p>
                      <p className="text-lg font-bold text-white leading-tight">{selectedRouteName}</p>
                    </div>

                    {/* Minimalist Bus Visual Representation */}
                    <div className="mt-8 flex justify-between items-end">
                      <div className="flex gap-1">
                        {[...Array(6)].map((_, i) => (
                          <div key={i} className="w-3 h-1 bg-zinc-800 rounded-full" />
                        ))}
                      </div>
                      <div className="text-[9px] font-black uppercase tracking-widest text-zinc-600">BusNova Asset V3</div>
                    </div>
                  </div>
                </div>
              </div>
            </TiltCard>
          </div>
        </div>

        {/* Active Fleet List Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-black tracking-tight">Active Fleet</h2>
            <div className="h-px flex-grow bg-white/5" />
            <span className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">{buses.length} Vehicles</span>
          </div>

          {buses.length === 0 ? (
            <div className="text-center py-12 text-zinc-500 border border-white/5 rounded-3xl bg-zinc-900/50">
              No vehicles in database yet. Register one above.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence>
                {buses.map((bus, idx) => (
                  <motion.div
                    key={bus.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <SpotlightCard className="group p-6 h-full flex flex-col">
                      <div className="flex flex-col justify-between h-full space-y-4 flex-grow">
                        <div className="flex justify-between items-start">
                          <h4 className="font-black text-xl text-white group-hover:text-amber-400 transition-colors tracking-tighter">
                            {bus.bus_number}
                          </h4>
                          <span className="text-xs text-zinc-600 font-mono">ID: {bus.id}</span>
                        </div>

                        <div className="pt-4 border-t border-white/5 my-auto">
                          <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest mb-1">Route Assignment</p>
                          <p className="text-xs font-medium text-zinc-300 group-hover:text-white transition-colors truncate">
                            {bus.route_name}
                          </p>
                        </div>

                        <div className="flex justify-end pt-2">
                          <button className="text-zinc-600 hover:text-amber-400 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </SpotlightCard>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="mt-20 py-10 border-t border-white/5 text-center">
          <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.3em]">
            BusNova Fleet Operations • Vehicle Management Module
          </p>
        </footer>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .perspective-1000 {
          perspective: 1000px;
        }
      `}} />
    </div>
  );
}
