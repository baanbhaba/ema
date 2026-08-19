import React from "react";

interface CardProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  headerAction?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  headerAction,
  children,
  className = "",
}) => {
  return (
    <div
      className={`bg-[#fff8f6] dark:bg-[#181211] border-2 border-[#231917] dark:border-[#f4a300] shadow-[4px_4px_0px_#231917] dark:shadow-[4px_4px_0px_#f4a300] overflow-hidden ${className}`}
    >
      {(title || subtitle || headerAction) && (
        <div className="px-5 py-3.5 border-b-2 border-[#231917] dark:border-[#f4a300] flex items-center justify-between bg-[#fdf8f0] dark:bg-[#231917]">
          <div>
            {title && <h3 className="text-xs font-black uppercase tracking-wider text-[#231917] dark:text-[#fdf8f0] font-mono">{title}</h3>}
            {subtitle && <p className="text-xs text-[#5c4a45] dark:text-[#dcc0ba] font-sans font-medium mt-0.5">{subtitle}</p>}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
};
