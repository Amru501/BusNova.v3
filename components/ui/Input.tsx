import type { InputHTMLAttributes } from "react";

export function Input({
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full min-h-[48px] rounded-lg border border-white/15 bg-zinc-900/70 px-4 py-2.5 text-base text-zinc-100 placeholder-zinc-500 backdrop-blur-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 ${className}`}
      {...props}
    />
  );
}
