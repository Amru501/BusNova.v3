import type { InputHTMLAttributes } from "react";

export function Input({
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full rounded-lg border border-white/15 bg-zinc-900/70 px-4 py-2.5 text-zinc-100 placeholder-zinc-500 backdrop-blur-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 ${className}`}
      {...props}
    />
  );
}
