import React from "react";

interface MarqueeRibbonProps {
  items: string[];
  className?: string;
}

export const MarqueeRibbon: React.FC<MarqueeRibbonProps> = ({ items, className = "" }) => {
  return (
    <div className={`relative overflow-hidden w-full py-2 bg-amber-500/10 dark:bg-amber-500/5 border-y border-amber-500/20 text-xs font-mono select-none ${className}`}>
      <div className="flex w-max animate-marquee space-x-8 whitespace-nowrap">
        {items.concat(items).map((item, idx) => (
          <div key={idx} className="flex items-center space-x-2 text-zinc-700 dark:text-zinc-300">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="font-semibold">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
