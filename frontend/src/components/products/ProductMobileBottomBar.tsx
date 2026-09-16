import React, { useMemo } from "react";
import { LayoutGrid, SlidersHorizontal, ArrowUpDown, Check } from "lucide-react";

export const PRODUCT_MOBILE_BOTTOM_BAR_PATHS = [
  "/products",
  "/new-arrivals",
  "/bestsellers",
  "/recipes",
  "/combos",
] as const;

export const hasProductMobileBottomBar = (pathname: string | null | undefined) =>
  Boolean(
    pathname &&
      PRODUCT_MOBILE_BOTTOM_BAR_PATHS.includes(
        pathname as (typeof PRODUCT_MOBILE_BOTTOM_BAR_PATHS)[number],
      ),
  );

interface ProductMobileBottomBarProps {
  hasCategoryFilter?: boolean;
  activeFilterCount?: number;
  sortActive?: boolean;
  onOpenCategories?: () => void;
  onOpenFilter?: () => void;
  onOpenSort?: () => void;
  showCategories?: boolean;
  showFilter?: boolean;
  showSort?: boolean;
}

export const ProductMobileBottomBar: React.FC<ProductMobileBottomBarProps> = ({
  hasCategoryFilter = false,
  activeFilterCount = 0,
  sortActive = false,
  onOpenCategories,
  onOpenFilter,
  onOpenSort,
  showCategories = true,
  showFilter = true,
  showSort = true,
}) => {
  const visibleActions = useMemo(() => {
    const actions: Array<{
      key: "categories" | "filter" | "sort";
      label: string;
      onClick?: () => void;
      active: boolean;
      icon: React.ReactNode;
    }> = [];

    if (showCategories) {
      actions.push({
        key: "categories",
        label: "Categories",
        onClick: onOpenCategories,
        active: hasCategoryFilter,
        icon: (
          <span className="relative">
            <LayoutGrid className="w-5 h-5" />
            {hasCategoryFilter ? (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#D6A146]" />
            ) : null}
          </span>
        ),
      });
    }

    if (showFilter) {
      actions.push({
        key: "filter",
        label: "Filter",
        onClick: onOpenFilter,
        active: activeFilterCount > 0,
        icon: (
          <span className="relative inline-flex items-center gap-1">
            <SlidersHorizontal className="w-5 h-5" />
            {activeFilterCount > 0 ? (
              <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-[#284C38] text-white text-[10px] font-bold leading-[18px] text-center">
                {activeFilterCount}
              </span>
            ) : null}
          </span>
        ),
      });
    }

    if (showSort) {
      actions.push({
        key: "sort",
        label: "Sort",
        onClick: onOpenSort,
        active: sortActive,
        icon: (
          <span className="relative">
            <ArrowUpDown className="w-5 h-5" />
            {sortActive ? (
              <Check className="absolute -top-1 -right-2 w-3 h-3 text-[#D6A146]" />
            ) : null}
          </span>
        ),
      });
    }

    return actions;
  }, [
    showCategories,
    showFilter,
    showSort,
    hasCategoryFilter,
    activeFilterCount,
    sortActive,
    onOpenCategories,
    onOpenFilter,
    onOpenSort,
  ]);

  if (visibleActions.length === 0) {
    return null;
  }

  const gridColsClass =
    visibleActions.length === 1
      ? "grid-cols-1"
      : visibleActions.length === 2
        ? "grid-cols-2"
        : "grid-cols-3";

  return (
    <nav
      aria-label="Product listing actions"
      className="sm:hidden fixed inset-x-0 z-[55] bg-white border-t border-[#D6A146]/30 shadow-[0_-8px_24px_rgba(30,58,43,0.12)]"
      style={{
        bottom: "calc(var(--mobile-nav-height) + env(safe-area-inset-bottom, 0px))",
      }}
    >
      <div className={`grid ${gridColsClass}`}>
        {visibleActions.map((action, index) => (
          <button
            key={action.key}
            type="button"
            onClick={action.onClick}
            aria-pressed={action.active}
            className={`flex flex-col items-center justify-center gap-1 px-2 min-h-[var(--mobile-product-bar-height)] transition-colors ${
              index > 0 ? "border-l border-[#E8E2D5]" : ""
            } ${
              action.active
                ? "text-[#284C38] bg-[#284C38]/5"
                : "text-[#5C5343] hover:bg-[#F7F5EF]"
            }`}
          >
            {action.icon}
            <span className="text-[11px] font-semibold font-btn">{action.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};
