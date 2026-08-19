import React from "react";

interface GridPatternProps {
  className?: string;
  size?: number;
}

export const GridPattern: React.FC<GridPatternProps> = ({ className = "", size = 32 }) => {
  return (
    <div
      className={`pointer-events-none absolute inset-0 -z-10 h-full w-full opacity-60 dark:opacity-30 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] ${className}`}
      style={{
        backgroundImage: `radial-gradient(rgba(245, 158, 11, 0.25) 1px, transparent 1px)`,
        backgroundSize: `${size}px ${size}px`,
      }}
    />
  );
};
