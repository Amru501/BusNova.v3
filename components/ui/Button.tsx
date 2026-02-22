import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "danger" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  isLoading?: boolean;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-emerald-600/90 text-white hover:bg-emerald-500/90 focus:ring-emerald-500 backdrop-blur-sm",
  secondary:
    "bg-zinc-700/80 text-zinc-100 hover:bg-zinc-600/80 focus:ring-zinc-500 backdrop-blur-sm",
  danger:
    "bg-red-600/90 text-white hover:bg-red-500/90 focus:ring-red-500 backdrop-blur-sm",
  ghost:
    "bg-white/5 text-zinc-300 hover:bg-white/10 focus:ring-zinc-500 backdrop-blur-sm",
};

export function Button({
  className = "",
  variant = "primary",
  isLoading,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900/80 disabled:opacity-50 ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        children
      )}
    </button>
  );
}
