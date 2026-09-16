import React from "react";
import { CERTIFICATIONS } from "../../data/mockData";
import {
  ShieldCheck,
  Award,
  HeartHandshake,
  Sparkles,
  CheckCircle2,
  Leaf,
} from "lucide-react";

export const Certifications: React.FC = () => {
  const getCertIcon = (iconName: string) => {
    switch (iconName) {
      case "ShieldCheck":
        return <ShieldCheck className="w-8 h-8 text-[#284C38]" />;
      case "Award":
        return <Award className="w-8 h-8 text-[#D6A146]" />;
      case "HeartHandshake":
        return <HeartHandshake className="w-8 h-8 text-[#C86D39]" />;
      case "Sparkles":
        return <Sparkles className="w-8 h-8 text-[#284C38]" />;
      case "CheckCircle2":
        return <CheckCircle2 className="w-8 h-8 text-[#D6A146]" />;
      case "Leaf":
        return <Leaf className="w-8 h-8 text-[#284C38]" />;
      default:
        return <Award className="w-8 h-8 text-[#D6A146]" />;
    }
  };

  // Duplicate the list so the track can loop seamlessly at -50%
  const loopItems = [...CERTIFICATIONS, ...CERTIFICATIONS];

  return (
    <section
      id="certifications-section"
      className="py-16 bg-[#F7F5EF] border-y border-[#D6A146]/20 overflow-hidden"
    >
      <div className="max-w-[90vw] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1D1D1D] mt-1">
            Certified Pure By National Food Safety Standards
          </h2>
        </div>

        {/* Carousel viewport with fade-out edges */}
        <div
          className="relative w-full"
          style={{
            maskImage:
              "linear-gradient(to right, transparent 0, black 5%, black 95%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0, black 5%, black 95%, transparent 100%)",
          }}
        >
          <div className="cert-track flex w-max gap-4 md:gap-6">
            {loopItems.map((cert, i) => (
              <div
                key={`${cert.id}-${i}`}
                className="bg-white rounded-2xl p-5 border border-[#D6A146]/20 shadow-sm hover:shadow-md transition-all text-center flex flex-col items-center justify-center group shrink-0 w-40 md:w-48"
              >
                <div className="w-14 h-14 rounded-full bg-[#F7F5EF] group-hover:bg-[#284C38]/10 flex items-center justify-center mb-3 transition-colors">
                  {getCertIcon(cert.iconName)}
                </div>
                <h3 className="font-heading text-base font-bold text-[#1D1D1D] group-hover:text-[#284C38] transition-colors">
                  {cert.title}
                </h3>
                <p className="font-body text-[11px] text-gray-600 mt-1 font-light leading-tight">
                  {cert.subtitle}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .cert-track {
          animation: cert-scroll 30s linear infinite;
        }
        @keyframes cert-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
};
