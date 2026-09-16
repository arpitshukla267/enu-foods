import React, { useEffect, useId, useRef } from "react";
import { X } from "lucide-react";

interface ProductBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const ProductBottomSheet: React.FC<ProductBottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
}) => {
  const titleId = useId();
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  return (
    <div
      className={`fixed inset-0 z-[120] sm:hidden transition-opacity duration-300 ease-out ${
        isOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
      role="presentation"
      aria-hidden={!isOpen}
    >
      <button
        type="button"
        aria-label="Close sheet"
        className={`absolute inset-0 bg-black/50 backdrop-blur-[2px] transition-opacity duration-300 ease-out ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
        tabIndex={isOpen ? 0 : -1}
      />

      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-hidden={!isOpen}
        className={`absolute inset-x-0 max-h-[min(85vh,calc(100dvh-var(--mobile-stacked-bars-height)-1rem))] flex flex-col rounded-t-3xl bg-white shadow-2xl border-t border-[#D6A146]/30 transform transition-transform duration-300 ease-out ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ bottom: 0 + "px" }}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#E8E2D5] shrink-0">
          <h2 id={titleId} className="font-heading text-lg font-bold text-[#1E3A2B]">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-2 rounded-full text-[#284C38] hover:bg-[#F7F5EF] transition-colors"
            tabIndex={isOpen ? 0 : -1}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">{children}</div>

        {footer ? (
          <div className="shrink-0 border-t border-[#E8E2D5] bg-white px-4 py-3">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
};
