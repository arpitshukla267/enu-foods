import React, { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";

interface WeightDropdownProps {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}

/* Shared weight/size selector with animated open + close, portaled to
   document.body so it floats above any overflow-hidden / scrolling parent
   (like the horizontal product carousels). */
export const WeightDropdown: React.FC<WeightDropdownProps> = ({
  options,
  value,
  onChange,
}) => {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const openDropdown = () => {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (rect)
      setPosition({ top: rect.bottom + 6, left: rect.left, width: rect.width });
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (buttonRef.current?.contains(target)) return;
      if (listRef.current?.contains(target)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => {
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [open]);

  return (
    <div
      className="relative"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        onClick={() => (open ? setOpen(false) : openDropdown())}
        aria-expanded={open}
        className={`w-full flex items-center justify-between bg-white border text-[#3A3A32] text-sm rounded-full px-4 py-2 transition-colors ${
          open
            ? "border-[#1F5136] ring-1 ring-[#1F5136]"
            : "border-[#D8CFAF] hover:border-[#1F5136]/50"
        }`}
      >
        <span>{value}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.18 }}
          className="text-[#6B6A5E] text-xs ml-2"
        >
          ▾
        </motion.span>
      </button>

      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {open && position && (
              <motion.ul
                ref={listRef}
                initial={{ opacity: 0, y: -6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.97 }}
                transition={{ duration: 0.16, ease: "easeOut" }}
                style={{
                  position: "fixed",
                  top: position.top,
                  left: position.left,
                  width: position.width,
                }}
                className="z-[100] bg-white rounded-xl border border-[#E9E3D2] shadow-lg overflow-hidden py-1 origin-top"
              >
                {options.map((opt) => {
                  const active = opt === value;
                  return (
                    <li key={opt}>
                      <button
                        type="button"
                        onClick={() => {
                          onChange(opt);
                          setOpen(false);
                        }}
                        className={`w-full flex items-center justify-between text-left px-4 py-2 text-sm transition-colors ${
                          active
                            ? "bg-[#EAF3E5] text-[#1F5136] font-semibold"
                            : "text-[#3A3A32] hover:bg-[#F7F2E4]"
                        }`}
                      >
                        <span>{opt}</span>
                        {active && (
                          <Check className="w-3.5 h-3.5 text-[#1F5136]" />
                        )}
                      </button>
                    </li>
                  );
                })}
              </motion.ul>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </div>
  );
};
