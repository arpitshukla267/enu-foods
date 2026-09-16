import React from "react";
import { Check, Loader2 } from "lucide-react";
import { ProductBottomSheet } from "./ProductBottomSheet";

export interface MobileCategoryOption {
  value: string;
  label: string;
}

interface SimpleMobileCategorySheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  options: MobileCategoryOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
  isLoading?: boolean;
}

export const SimpleMobileCategorySheet: React.FC<SimpleMobileCategorySheetProps> = ({
  isOpen,
  onClose,
  title = "Categories",
  options,
  selectedValue,
  onSelect,
  isLoading = false,
}) => {
  const handleSelect = (value: string) => {
    onSelect(value);
    onClose();
  };

  return (
    <ProductBottomSheet isOpen={isOpen} onClose={onClose} title={title}>
      {isLoading ? (
        <div className="flex items-center justify-center py-8 text-[#736854]">
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
          Loading categories...
        </div>
      ) : (
        <div className="space-y-1">
          {options.map((option) => {
            const isActive = selectedValue === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-colors ${
                  isActive
                    ? "bg-[#284C38]/10 text-[#284C38] font-semibold"
                    : "text-[#1D1D1D] hover:bg-[#F7F5EF]"
                }`}
              >
                <span>{option.label}</span>
                {isActive ? <Check className="w-4 h-4" /> : null}
              </button>
            );
          })}
        </div>
      )}
    </ProductBottomSheet>
  );
};
