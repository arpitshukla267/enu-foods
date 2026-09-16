import React from 'react';
import { LucideIcon, Package } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Package,
  title,
  description,
  actionLabel,
  onAction
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-[#FFFFFF] border border-[#E8E2D5] rounded-xl my-4">
      <div className="p-4 rounded-full bg-[#F6F3EC] text-[#173D2A] border border-[#E5DEC9] mb-4">
        <Icon className="w-8 h-8 stroke-[1.5]" />
      </div>
      <h3 className="text-lg font-semibold text-[#1A211D] font-serif-brand">
        {title}
      </h3>
      <p className="mt-1.5 text-sm text-[#736854] max-w-sm">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-5 px-4 py-2 text-sm font-medium text-white bg-[#173D2A] hover:bg-[#112E20] rounded-lg transition-colors shadow-xs"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
