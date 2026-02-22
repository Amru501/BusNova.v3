"use client";

import type { HTMLAttributes } from "react";
import SpotlightCard from "@/components/SpotlightCard";

export function Card({
  className = "",
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <SpotlightCard className={`p-0 shadow-lg backdrop-blur-sm ${className}`} {...props}>
      {children}
    </SpotlightCard>
  );
}

export function CardHeader({
  className = "",
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`border-b border-white/5 px-6 py-4 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardContent({
  className = "",
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`px-6 py-4 ${className}`} {...props}>
      {children}
    </div>
  );
}
