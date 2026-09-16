import React from "react";

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg md:rounded-xl border border-[#F2DCBC] overflow-hidden animate-pulse">
      <div className="aspect-6/5 bg-[#E8E2D5]" />
      <div className="p-3 space-y-3">
        <div className="h-3 bg-[#E8E2D5] rounded w-1/2" />
        <div className="h-4 bg-[#E8E2D5] rounded w-4/5" />
        <div className="h-4 bg-[#E8E2D5] rounded w-3/5" />
        <div className="h-5 bg-[#E8E2D5] rounded w-1/3" />
      </div>
    </div>
  );
};
