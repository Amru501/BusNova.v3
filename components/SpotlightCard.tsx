"use client";

import { useRef, useState, type ReactNode } from "react";
import { motion } from "motion/react";

type SpotlightCardProps = {
  children: ReactNode;
  className?: string;
  spotlightColor?: string;
};

const TILT_MAX = 8;

export default function SpotlightCard({
  children,
  className = "",
  spotlightColor = "rgba(250, 204, 21, 0.2)",
}: SpotlightCardProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current || isFocused) return;
    const rect = divRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setPosition({ x, y });
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateY = centerX ? ((x - centerX) / centerX) * TILT_MAX : 0;
    const rotateX = centerY ? ((centerY - y) / centerY) * TILT_MAX : 0;
    setTilt({ rotateX, rotateY });
  };

  const handleFocus = () => {
    setIsFocused(true);
    setOpacity(0.6);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setOpacity(0);
  };

  const handleMouseEnter = () => {
    setOpacity(0.6);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`perspective-1000 relative rounded-3xl border border-amber-900/50 bg-neutral-900 overflow-hidden p-8 ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-in-out"
        style={{
          opacity,
          background: `radial-gradient(circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 80%)`,
        }}
      />
      <motion.div
        className="relative z-10"
        style={{
          rotateX: tilt.rotateX,
          rotateY: tilt.rotateY,
          transformStyle: "preserve-3d",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {children}
      </motion.div>
    </div>
  );
}
