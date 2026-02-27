"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import SpotlightCard from "@/components/SpotlightCard";

type Driver = { id: number; name: string; phone: string | null };

export default function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/drivers")
      .then((res) => res.json())
      .then((data) => {
        if (data.drivers) setDrivers(data.drivers);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredDrivers = useMemo(() => {
    if (!search.trim()) return drivers;
    const q = search.trim().toLowerCase();
    return drivers.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        (d.phone && d.phone.toLowerCase().includes(q))
    );
  }, [drivers, search]);

  return (
    <div className="relative min-h-[60vh]">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-5%] left-[-5%] w-[30%] h-[30%] bg-amber-900/10 blur-[100px] rounded-full" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] bg-amber-950/10 blur-[100px] rounded-full" />
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
              Staff Directory
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="text-3xl md:text-4xl font-black tracking-tighter"
          >
            Our <span className="text-amber-500 italic">Drivers</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-zinc-500 mt-2 max-w-md text-sm"
          >
            Direct contact information for authorized personnel and transit staff.
          </motion.p>
        </header>

        {loading ? (
          <p className="text-zinc-400">Loading...</p>
        ) : drivers.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-zinc-900/80 backdrop-blur-xl py-12 text-center">
            <p className="text-zinc-400">No drivers listed yet.</p>
          </div>
        ) : (
          <>
            {/* Search bar */}
            <div className="mb-6 relative max-w-xl">
              <input
                type="text"
                placeholder="Search drivers..."
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

            {/* Driver grid */}
            {filteredDrivers.length === 0 ? (
              <p className="text-zinc-400">No drivers match your search.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
                {filteredDrivers.map((driver, index) => (
                  <motion.div
                    key={driver.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                  >
                    <SpotlightCard
                      className="group p-6 hover:border-amber-500/30 transition-colors border border-white/10 bg-zinc-900/80 backdrop-blur-xl shadow-2xl"
                      spotlightColor="rgba(245, 158, 11, 0.15)"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-zinc-800 border border-white/5 flex items-center justify-center font-bold text-zinc-500 group-hover:bg-amber-500/10 group-hover:text-amber-500 transition-colors shrink-0">
                            {driver.name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-bold text-lg tracking-tight group-hover:text-amber-400 transition-colors leading-none truncate">
                              {driver.name}
                            </h3>
                            <p className="text-zinc-500 text-xs mt-1.5 font-mono uppercase tracking-tighter">
                              Authorized Personnel
                            </p>
                          </div>
                        </div>

                        {driver.phone && (
                          <a
                            href={`tel:${driver.phone}`}
                            className="p-3 bg-zinc-800/50 hover:bg-amber-600 text-zinc-400 hover:text-white rounded-xl transition-all shadow-sm shrink-0"
                            aria-label={`Call ${driver.name}`}
                          >
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
                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                              />
                            </svg>
                          </a>
                        )}
                      </div>

                      <div className="mt-6 pt-6 border-t border-white/5 flex justify-between items-center gap-2">
                        <span className="text-zinc-600 text-[10px] font-black uppercase tracking-widest shrink-0">
                          Phone
                        </span>
                        <span className="text-white font-medium text-sm tracking-tight truncate text-right">
                          {driver.phone ?? "—"}
                        </span>
                      </div>
                    </SpotlightCard>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Footer note */}
            <footer className="mt-12 text-center">
              <p className="text-zinc-600 text-[10px] uppercase tracking-[0.2em] font-bold">
                Secured by BusNova
              </p>
            </footer>
          </>
        )}
      </div>
    </div>
  );
}
