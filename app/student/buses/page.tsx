"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import SpotlightCard from "@/components/SpotlightCard";

type Bus = { id: number; bus_number: string; route_id: number; route_name: string };

export default function ViewBusesPage() {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/buses")
      .then((res) => res.json())
      .then((data) => {
        if (data.buses) setBuses(data.buses);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredBuses = useMemo(() => {
    if (!search.trim()) return buses;
    const q = search.trim().toLowerCase();
    return buses.filter(
      (b) =>
        b.bus_number.toLowerCase().includes(q) ||
        b.route_name.toLowerCase().includes(q)
    );
  }, [buses, search]);

  return (
    <div className="relative min-h-[60vh]">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-5%] left-[-5%] w-[35%] h-[35%] bg-amber-900/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[35%] h-[35%] bg-amber-950/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 space-y-6">
        <Link
          href="/student"
          className="inline-block text-zinc-400 hover:text-amber-400 transition-colors"
        >
          ← Dashboard
        </Link>

        {/* Header Section */}
        <header className="mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-2 mb-4"
          >
            <div className="h-px w-8 bg-amber-500" />
            <span className="text-amber-500 font-bold uppercase tracking-widest text-[10px]">
              Transit Network
            </span>
          </motion.div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.05 }}
                className="text-3xl md:text-4xl font-black tracking-tighter"
              >
                Available <span className="text-amber-500 italic">Buses</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="text-zinc-500 mt-2 max-w-md text-sm"
              >
                Browse our active fleet and request travel passes for your daily commute.
              </motion.p>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="flex gap-3"
            >
              <Link
                href="/student/buses"
                className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 border border-white/5 rounded-xl text-xs font-bold transition-all text-zinc-200"
              >
                All Routes
              </Link>
              <Link
                href="/student/my-pass"
                className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-black rounded-xl text-xs font-bold transition-all shadow-lg shadow-amber-900/20"
              >
                My Requests
              </Link>
            </motion.div>
          </div>
        </header>

        {loading ? (
          <p className="text-zinc-400">Loading...</p>
        ) : buses.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-zinc-900/80 backdrop-blur-xl py-12 text-center">
            <p className="text-zinc-400">No buses found.</p>
          </div>
        ) : (
          <>
            {/* Search bar */}
            <div className="mb-6 relative max-w-xl">
              <input
                type="text"
                placeholder="Search by bus number or route..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all text-sm backdrop-blur-md text-zinc-100 placeholder-zinc-500"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Bus Grid */}
            {filteredBuses.length === 0 ? (
              <p className="text-zinc-400">No buses match your search.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl">
                {filteredBuses.map((bus, index) => (
                  <motion.div
                    key={bus.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.08, duration: 0.3 }}
                  >
                    <SpotlightCard
                      className="group p-0 overflow-visible border border-white/10 hover:border-amber-500/40 transition-colors bg-zinc-900/80 backdrop-blur-xl shadow-2xl"
                      spotlightColor="rgba(245, 158, 11, 0.15)"
                    >
                      <div className="p-6 md:p-8">
                        <div className="flex justify-between items-start mb-6">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                              <span className="text-[10px] text-zinc-500 font-black uppercase tracking-tighter">
                                Active
                              </span>
                            </div>
                            <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white group-hover:text-amber-400 transition-colors">
                              {bus.bus_number}
                            </h3>
                            <p className="text-zinc-500 text-xs font-mono mt-1">
                              Bus Service
                            </p>
                          </div>
                          <div className="bg-zinc-800/50 p-3 rounded-2xl border border-white/5 text-amber-500 shrink-0">
                            <svg
                              className="w-6 h-6"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              aria-hidden
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <label className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.2em] block mb-1">
                              Primary Route
                            </label>
                            <p className="text-zinc-300 text-sm leading-relaxed">
                              {bus.route_name}
                            </p>
                          </div>

                          <div className="pt-4 flex justify-end border-t border-white/5">
                            <Link
                              href="/student/request"
                              className="px-6 py-2.5 bg-amber-600/10 hover:bg-amber-600 text-amber-500 hover:text-black border border-amber-500/20 rounded-xl text-xs font-bold transition-all group-hover:scale-105 active:scale-95"
                            >
                              Request Pass
                            </Link>
                          </div>
                        </div>
                      </div>
                    </SpotlightCard>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Footer */}
            <footer className="mt-12 md:mt-16 py-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="text-xs text-zinc-500">Live Services</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500/50" />
                  <span className="text-xs text-zinc-500">Limited</span>
                </div>
              </div>
              <p className="text-zinc-600 text-[10px] uppercase tracking-widest font-bold">
                BusNova Transit
              </p>
            </footer>
          </>
        )}
      </div>
    </div>
  );
}
