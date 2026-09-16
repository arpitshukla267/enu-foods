import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarouselArrowsProps {
  canScrollLeft: boolean;
  canScrollRight: boolean;
  onScrollLeft: () => void;
  onScrollRight: () => void;
}

/* Shared gold arrow-button pair used across the carousel sections. */
export const CarouselArrows: React.FC<CarouselArrowsProps> = ({
  canScrollLeft,
  canScrollRight,
  onScrollLeft,
  onScrollRight,
}) => (
  <>
    <button
      type="button"
      aria-label="Scroll to previous"
      onClick={onScrollLeft}
      disabled={!canScrollLeft}
      className="flex absolute -left-5 lg:-left-5 top-[38%] -translate-y-1/2 z-30 w-9 h-9 lg:w-11 lg:h-11 rounded-full bg-[#D6A146] hover:bg-[#c4923a] disabled:opacity-40 disabled:cursor-not-allowed items-center justify-center shadow-md transition-colors"
    >
      <ChevronLeft
        className="w-4 h-4 lg:w-5 lg:h-5 text-white"
        strokeWidth={2.5}
      />
    </button>

    <button
      type="button"
      aria-label="Scroll to more"
      onClick={onScrollRight}
      disabled={!canScrollRight}
      className="flex absolute -right-5 lg:-right-5 top-[38%] -translate-y-1/2 z-30 w-9 h-9 lg:w-11 lg:h-11 rounded-full bg-[#D6A146] hover:bg-[#c4923a] disabled:opacity-40 disabled:cursor-not-allowed items-center justify-center shadow-md transition-colors"
    >
      <ChevronRight
        className="w-4 h-4 lg:w-5 lg:h-5 text-white"
        strokeWidth={2.5}
      />
    </button>
  </>
);
