import React from 'react';
import { ProductStatus, OrderStatus, PaymentStatus, CategoryStatus, UserStatus } from '../../types';

interface StatusBadgeProps {
  status: ProductStatus | OrderStatus | PaymentStatus | CategoryStatus | UserStatus | string;
  type?: 'product' | 'order' | 'payment' | 'category' | 'user';
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type = 'product', size = 'md' }) => {
  const normalized = status.toLowerCase();
  
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  let colorClasses = 'bg-[#F4EFE6] text-[#605544] border-[#E5DEC9]';
  let dotColor = 'bg-[#8F816B]';
  let label = status.charAt(0).toUpperCase() + status.slice(1);

  if (['active', 'delivered', 'paid'].includes(normalized)) {
    colorClasses = 'bg-[#EBF5EE] text-[#173D2A] border-[#C3DEC9] font-medium';
    dotColor = 'bg-[#245A3F]';
  } else if (['shipped', 'processing', 'confirmed'].includes(normalized)) {
    colorClasses = 'bg-[#FBF5E6] text-[#8F6612] border-[#F2DEB0] font-medium';
    dotColor = 'bg-[#D99B26]';
  } else if (['pending', 'draft'].includes(normalized)) {
    colorClasses = 'bg-[#F6F4EF] text-[#6E6454] border-[#E0D8C8] font-medium';
    dotColor = 'bg-[#9C917E]';
  } else if (['cancelled', 'failed', 'refunded', 'inactive', 'archived'].includes(normalized)) {
    colorClasses = 'bg-[#FDF0EE] text-[#9E382B] border-[#F5C7C1] font-medium';
    dotColor = 'bg-[#9E382B]';
  }

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border ${colorClasses} ${sizeClasses} whitespace-nowrap tracking-wide`}>
      {/* <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} /> */}
      {label}
    </span>
  );
};
