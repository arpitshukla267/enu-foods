import React from "react";
import { FileText } from "lucide-react";

export const TermsOfServicePage: React.FC = () => {
  return (
    <div className="pt-28 pb-20 bg-[#F7F5EF] min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-[#284C38] flex items-center justify-center">
            <FileText className="w-6 h-6 text-[#D6A146]" />
          </div>
          <div>
            <h1 className="font-heading text-3xl font-bold text-[#1D1D1D]">Terms of Service</h1>
            <p className="text-sm text-gray-500">Last updated: August 2026</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#D6A146]/20 p-6 sm:p-8 space-y-6 text-sm text-gray-600 leading-relaxed">
          <section>
            <h2 className="font-heading text-lg font-semibold text-[#284C38] mb-2">Acceptance of Terms</h2>
            <p>
              By accessing or using the ENU Foods website and placing orders, you agree to be bound by these
              Terms of Service. If you do not agree, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-[#284C38] mb-2">Products &amp; Pricing</h2>
            <p>
              All spice products are subject to availability. Prices displayed are in Indian Rupees (₹) and
              include applicable taxes unless stated otherwise. We reserve the right to modify prices without
              prior notice.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-[#284C38] mb-2">Orders &amp; Delivery</h2>
            <p>
              Orders are confirmed upon successful payment. Delivery timelines vary by location. ENU Foods is
              not liable for delays caused by courier partners or force majeure events.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-[#284C38] mb-2">Returns &amp; Refunds</h2>
            <p>
              Unopened products may be returned within 7 days of delivery. Opened or used products cannot be
              returned due to food safety regulations. Refunds are processed within 5–7 business days to the
              original payment method.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-[#284C38] mb-2">Governing Law</h2>
            <p>
              These terms are governed by the laws of India. Any disputes shall be subject to the exclusive
              jurisdiction of courts in Gujarat, India.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
