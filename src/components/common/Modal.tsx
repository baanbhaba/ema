import React, { useEffect } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl";
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  maxWidth = "lg",
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const widthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
  }[maxWidth];

  return (
    <div className="fixed inset-0 z-[999] overflow-y-auto bg-[#231917]/70 backdrop-blur-xs">
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <div
          className={`bg-[#fdf8f0] dark:bg-[#181211] border-2 border-[#231917] dark:border-[#f4a300] shadow-[6px_6px_0px_#231917] dark:shadow-[6px_6px_0px_#f4a300] w-full text-left inline-block ${widthClasses} overflow-hidden align-middle font-mono`}
          role="dialog"
          aria-modal="true"
        >
          <div className="px-5 py-3.5 border-b-2 border-[#231917] dark:border-[#f4a300] flex items-center justify-between bg-[#fff8f6] dark:bg-[#231917]">
            <h3 className="font-display text-sm uppercase tracking-wider text-[#231917] dark:text-[#fdf8f0]">{title}</h3>
            <button
              onClick={onClose}
              className="p-1 bg-[#fff8f6] dark:bg-[#181211] border border-[#231917] dark:border-[#f4a300] text-[#231917] dark:text-[#fdf8f0] shadow-[1px_1px_0px_#231917] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="p-5 text-[#231917] dark:text-[#fdf8f0] text-xs max-h-[75vh] overflow-y-auto">{children}</div>
          {footer && (
            <div className="px-5 py-3 border-t-2 border-[#231917] dark:border-[#f4a300] bg-[#fff8f6] dark:bg-[#231917] flex items-center justify-end space-x-2">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
