import type { SelectHTMLAttributes } from "react";

export function Select({
  className = "",
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={`w-full rounded-lg border border-white/15 bg-zinc-900/70 px-4 py-2.5 text-zinc-100 backdrop-blur-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}
