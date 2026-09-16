import React from "react";

interface OutOfStockBadgeProps {
  className?: string;
  compact?: boolean;
}

export const OutOfStockBadge: React.FC<OutOfStockBadgeProps> = ({
  className = "",
  compact = false,
}) => (
  <span
    className={`inline-flex items-center rounded-full bg-red-50 text-red-700 border border-red-200 font-bold uppercase tracking-wide ${
      compact ? "px-1.5 py-0.5 text-[9px]" : "px-2 py-0.5 text-[10px]"
    } ${className}`}
  >
    Out of Stock
  </span>
);
