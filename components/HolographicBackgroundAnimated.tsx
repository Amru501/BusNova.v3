"use client";

import { motion } from "motion/react";

/**
 * Animated holographic background (amber theme). Use only on login screen.
 */
export default function HolographicBackgroundAnimated() {
  return (
    <div className="fixed inset-0 -z-[45] bg-[#0a0a0c] overflow-hidden pointer-events-none h-screen w-screen" aria-hidden>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(15,15,18,1)_0%,_rgba(10,10,12,1)_100%)]" />
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(245,158,11,0.6) 1px, transparent 1px), linear-gradient(to bottom, rgba(245,158,11,0.6) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
          maskImage: "radial-gradient(circle at 50% 50%, black, transparent 80%)",
        }}
      />
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.25, 0.15],
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] bg-amber-900/30 blur-[120px] rounded-full"
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.1, 0.2, 0.1],
          x: [0, -40, 0],
          y: [0, -20, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-[10%] -right-[10%] w-[60%] h-[60%] bg-amber-800/25 blur-[120px] rounded-full"
      />
      <svg className="absolute inset-0 w-full h-full opacity-[0.1]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="loginBgLineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#fbbf24" />
          </linearGradient>
        </defs>
        <motion.path
          d="M-100,200 L400,200 L600,400 L1200,400"
          stroke="url(#loginBgLineGradient)"
          strokeWidth="1"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 3, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        />
        <motion.path
          d="M1400,100 L1000,100 L800,300 L200,300"
          stroke="url(#loginBgLineGradient)"
          strokeWidth="1"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 4, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 1 }}
        />
        {[
          { x: "15%", y: "25%" },
          { x: "85%", y: "15%" },
          { x: "45%", y: "65%" },
          { x: "75%", y: "85%" },
          { x: "10%", y: "75%" },
        ].map((point, i) => (
          <motion.circle
            key={i}
            cx={point.x}
            cy={point.y}
            r="2.5"
            fill="#f59e0b"
            animate={{ opacity: [0.3, 0.9, 0.3], scale: [1, 1.8, 1] }}
            transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </svg>
    </div>
  );
}
