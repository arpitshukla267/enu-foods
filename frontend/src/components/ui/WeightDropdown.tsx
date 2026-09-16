import React, { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { ProductWeightVariant } from "../../types";

interface WeightDropdownProps {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  variants?: ProductWeightVariant[];
}

const normalizeWeight = (weight: string) => weight.trim().toLowerCase();

/* Shared weight/size selector with animated open + close, portaled to
   document.body so it floats above any overflow-hidden / scrolling parent
   (like the horizontal product carousels). */
export const WeightDropdown: React.FC<WeightDropdownProps> = ({
  options,
  value,
  onChange,
  variants = [],
}) => {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const getPriceForWeight = (weight: string) =>
    variants.find(
      (variant) => normalizeWeight(variant.weight) === normalizeWeight(weight),
    )?.price;

  const isWeightInStock = (weight: string) => {
    const variant = variants.find(
      (entry) => normalizeWeight(entry.weight) === normalizeWeight(weight),
    );

    if (variant?.inStock !== undefined) {
      return variant.inStock;
    }

    if (variant?.stock !== undefined) {
      return variant.stock > 0;
    }

    return true;
  };

  const selectedPrice = getPriceForWeight(value);
  const selectedInStock = isWeightInStock(value);

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
        <span className="truncate">
          {value}
          {selectedPrice != null && (
            <span className="text-[#1F5136] font-semibold"> · ₹{selectedPrice}</span>
          )}
          {!selectedInStock && (
            <span className="text-red-600 font-semibold"> · Out of stock</span>
          )}
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.18 }}
          className="text-[#6B6A5E] text-xs ml-2 shrink-0"
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
                className="z-[100] bg-white rounded-xl border border-[#E9E3D2] shadow-lg py-1 origin-top max-h-[7.25rem] overflow-y-auto"
              >
                {options.map((opt, index) => {
                  const active = opt === value;
                  const optionPrice = getPriceForWeight(opt);
                  const optionInStock = isWeightInStock(opt);

                  return (
                    <li key={`${opt}-${index}`}>
                      <button
                        type="button"
                        onClick={() => {
                          onChange(opt);
                          setOpen(false);
                        }}
                        className={`w-full flex items-center justify-between text-left px-4 py-2 text-sm transition-colors ${
                          active
                            ? "bg-[#EAF3E5] text-[#1F5136] font-semibold"
                            : optionInStock
                              ? "text-[#3A3A32] hover:bg-[#F7F2E4]"
                              : "text-gray-400 hover:bg-[#F7F2E4]"
                        }`}
                      >
                        <span className={optionInStock ? "" : "line-through opacity-70"}>
                          {opt}
                        </span>
                        <span className="flex items-center gap-2 shrink-0">
                          {!optionInStock && (
                            <span className="text-[10px] font-bold uppercase text-red-600">
                              Out of stock
                            </span>
                          )}
                          {optionPrice != null && (
                            <span
                              className={`text-xs ${
                                active
                                  ? "font-bold text-[#1F5136]"
                                  : "font-semibold text-[#5C5343]"
                              }`}
                            >
                              ₹{optionPrice}
                            </span>
                          )}
                          {active && (
                            <Check className="w-3.5 h-3.5 text-[#1F5136]" />
                          )}
                        </span>
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
