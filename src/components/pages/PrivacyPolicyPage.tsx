import React from "react";
import { Shield } from "lucide-react";

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="pt-28 pb-20 bg-[#F7F5EF] min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-[#284C38] flex items-center justify-center">
            <Shield className="w-6 h-6 text-[#D6A146]" />
          </div>
          <div>
            <h1 className="font-heading text-3xl font-bold text-[#1D1D1D]">Privacy Policy</h1>
            <p className="text-sm text-gray-500">Last updated: August 2026</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#D6A146]/20 p-6 sm:p-8 space-y-6 text-sm text-gray-600 leading-relaxed">
          <section>
            <h2 className="font-heading text-lg font-semibold text-[#284C38] mb-2">Information We Collect</h2>
            <p>
              When you create an account, place an order, or contact us, we may collect your name, email address,
              phone number, delivery address, and payment details. We also collect browsing data through cookies
              to improve your shopping experience.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-[#284C38] mb-2">How We Use Your Data</h2>
            <p>
              Your information is used to process orders, send delivery updates, provide customer support, and
              share promotional offers you opt into. We never sell your personal data to third parties.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-[#284C38] mb-2">Data Security</h2>
            <p>
              All transactions are encrypted with 256-bit SSL. Payment information is processed through
              PCI-DSS compliant gateways and is not stored on our servers.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-[#284C38] mb-2">Your Rights</h2>
            <p>
              You may request access, correction, or deletion of your personal data at any time by emailing{" "}
              <a href="mailto:care@enufoods.com" className="text-[#C86D39] hover:underline">
                care@enufoods.com
              </a>
              . You can also unsubscribe from marketing emails using the link in any promotional message.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-[#284C38] mb-2">Contact</h2>
            <p>
              ENU Foods Spice Park, Plot 42, Organic Agro Hub, Gujarat 380001, India.
              Phone: +91 1800-200-3688
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
