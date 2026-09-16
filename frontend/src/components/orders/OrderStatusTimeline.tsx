import React from "react";
import { CheckCircle2, Circle } from "lucide-react";
import type { CustomerOrder } from "../../lib/orderApi";
import {
  buildOrderTimeline,
  formatOrderDate,
  formatOrderStatusLabel,
  formatPaymentStatusLabel,
} from "../../lib/orderUi";

interface OrderStatusTimelineProps {
  order: CustomerOrder;
}

export const OrderStatusTimeline: React.FC<OrderStatusTimelineProps> = ({ order }) => {
  const entries = buildOrderTimeline(order);

  return (
    <div className="space-y-0">
      <h3 className="font-heading text-sm font-bold text-[#1D1D1D] mb-4">
        Order Status Timeline
      </h3>
      <ol className="relative space-y-0">
        {entries.map((entry, index) => {
          const isLast = index === entries.length - 1;
          const isCurrent = index === entries.length - 1;

          return (
            <li key={`${entry.status}-${entry.timestamp}-${index}`} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    isCurrent
                      ? "bg-[#284C38] text-white shadow-sm"
                      : "bg-[#284C38]/10 text-[#284C38]"
                  }`}
                >
                  {isCurrent ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <Circle className="w-3.5 h-3.5" />
                  )}
                </div>
                {!isLast && <div className="w-px flex-1 min-h-[1.5rem] bg-gray-200 my-1" />}
              </div>

              <div className={`pb-5 min-w-0 ${isLast ? "pb-0" : ""}`}>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-bold text-[#1D1D1D]">
                    {formatOrderStatusLabel(entry.status)}
                  </span>
                  {entry.paymentStatus && (
                    <span className="text-[10px] uppercase tracking-wide font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                      {formatPaymentStatusLabel(entry.paymentStatus)}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  {formatOrderDate(entry.timestamp, true)}
                </p>
                {entry.note && (
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">{entry.note}</p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
};
