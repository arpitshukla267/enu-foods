import React from 'react';
import { Leaf, Droplets, Sparkles, Award } from 'lucide-react';
import { TRUST_PILLARS } from '../data/mockData';

export const TrustSection: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Leaf':
        return <Leaf className="w-8 h-8 text-[#284C38]" />;
      case 'DropletOff':
        return <Droplets className="w-8 h-8 text-[#C86D39]" />;
      case 'Sparkles':
        return <Sparkles className="w-8 h-8 text-[#D6A146]" />;
      case 'Award':
        return <Award className="w-8 h-8 text-[#284C38]" />;
      default:
        return <Sparkles className="w-8 h-8 text-[#D6A146]" />;
    }
  };

  return (
    <section
      id="trust-section"
      className="py-16 sm:py-20 bg-[#F7F5EF] relative z-20 -mt-8"
    >
      <div className="max-w-[95vw] lg:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="sticky top-[16.66vh] md:static mb-64 md:mb-12 text-center max-w-2xl mx-auto">
          {" "}
          <span className="text-xs font-semibold uppercase tracking-widest text-[#C86D39] font-btn">
            Uncompromising Standards
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-semibold md:font-bold text-[#1D1D1D] mt-1">
            Why ENU Foods Is Trusted By Every Household
          </h2>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 -mt-36 md:mt-0 lg:grid-cols-4 md:gap-2 lg:gap-6 max-w-[95vw] lg:max-w-7xl mx-auto">
          {TRUST_PILLARS.map((pillar, index) => (
            <div
              key={pillar.title}
              className="sticky top-[33.33vh] md:static bg-white rounded-2xl p-6 shadow-md hover:shadow-xl border border-[#D6A146]/20 transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col items-center text-center group relative overflow-hidden"
            >
              {/* Top Accent Gradient Border */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#284C38] via-[#D6A146] to-[#C86D39] opacity-0 group-hover:opacity-100 transition-opacity" />

              {/* Animated Icon Circle */}
              <div className="w-16 h-16 rounded-full bg-[#F7F5EF] group-hover:bg-[#284C38]/10 flex items-center justify-center mb-5 transition-colors duration-300 group-hover:scale-110">
                {getIcon(pillar.iconName)}
              </div>

              {/* Title */}
              <h3 className="font-heading text-xl font-bold text-[#1D1D1D] mb-2 group-hover:text-[#284C38] transition-colors">
                {pillar.title}
              </h3>

              {/* Description */}
              <p className="font-body text-sm text-gray-600 leading-relaxed font-light">
                {pillar.description}
              </p>

              {/* Index Number Watermark */}
              <div className="absolute bottom-2 right-4 font-heading text-4xl font-bold text-gray-100 select-none pointer-events-none group-hover:text-[#D6A146]/20 transition-colors">
                0{index + 1}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
