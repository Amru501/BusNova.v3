"use client";

/**
 * Static holographic-style background for BusNova (amber theme).
 * CSS-only, no animations, to avoid lag.
 */
export default function HolographicBackground() {
  return (
    <div
      className="fixed inset-0 -z-[50] overflow-hidden pointer-events-none h-screen w-screen bg-[#0a0a0c]"
      aria-hidden
    >
      {/* Base gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(15,15,18,1) 0%, rgba(10,10,12,1) 100%)",
        }}
      />

      {/* Amber grid */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: "linear-gradient(to right, rgba(245,158,11,0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(245,158,11,0.5) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          maskImage: "radial-gradient(circle at 50% 50%, black, transparent 80%)",
          WebkitMaskImage: "radial-gradient(circle at 50% 50%, black, transparent 80%)",
        }}
      />

      {/* Static amber orbs (no animation) */}
      <div className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] bg-amber-900/20 blur-[100px] rounded-full" />
      <div className="absolute -bottom-[10%] -right-[10%] w-[60%] h-[60%] bg-amber-800/15 blur-[100px] rounded-full" />
    </div>
  );
}
