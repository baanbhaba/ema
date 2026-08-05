import React from "react";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger" | "amber" | "ghost";
  size?: "xs" | "sm" | "md" | "lg";
  icon?: React.ElementType;
  iconPosition?: "left" | "right";
  isLoading?: boolean;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "sm",
  icon: Icon,
  iconPosition = "left",
  isLoading = false,
  fullWidth = false,
  children,
  className = "",
  disabled,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-mono font-bold transition-all duration-150 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500/50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none select-none active:scale-[0.98]";

  const variantStyles = {
    primary:
      "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black border border-amber-400/40 shadow-xs hover:shadow-amber-500/20",
    amber:
      "bg-amber-500 hover:bg-amber-400 text-black border border-amber-400/50 shadow-xs hover:shadow-amber-500/25",
    secondary:
      "bg-zinc-900 hover:bg-zinc-800 text-zinc-100 border border-zinc-700 hover:border-amber-500/50 shadow-xs",
    outline:
      "bg-transparent hover:bg-zinc-800/60 text-zinc-300 hover:text-zinc-100 border border-zinc-700 hover:border-zinc-500",
    danger:
      "bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 hover:border-red-500/60",
    ghost:
      "bg-transparent hover:bg-zinc-800/50 text-zinc-400 hover:text-zinc-100 border border-transparent",
  }[variant];

  const sizeStyles = {
    xs: "px-2 py-1 text-[11px] space-x-1",
    sm: "px-3 py-1.5 text-xs space-x-1.5",
    md: "px-4 py-2 text-xs space-x-2",
    lg: "px-5 py-2.5 text-sm space-x-2.5",
  }[size];

  const widthStyle = fullWidth ? "w-full" : "";

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variantStyles} ${sizeStyles} ${widthStyle} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
      ) : (
        Icon && iconPosition === "left" && <Icon className="w-3.5 h-3.5 shrink-0" />
      )}
      <span>{children}</span>
      {!isLoading && Icon && iconPosition === "right" && (
        <Icon className="w-3.5 h-3.5 shrink-0" />
      )}
    </button>
  );
};
