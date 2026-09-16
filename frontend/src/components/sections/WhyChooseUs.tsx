import React from 'react';
import { WHY_CHOOSE_ENU } from '../../data/mockData';
import { Sprout, UtensilsCrossed, Shield, Ban, CheckCircle, Cpu } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sprout':
        return <Sprout className="w-7 h-7 text-[#284C38]" />;
      case 'UtensilsCrossed':
        return <UtensilsCrossed className="w-7 h-7 text-[#C86D39]" />;
      case 'Shield':
        return <Shield className="w-7 h-7 text-[#D6A146]" />;
      case 'Ban':
        return <Ban className="w-7 h-7 text-[#C86D39]" />;
      case 'CheckCircle':
        return <CheckCircle className="w-7 h-7 text-[#284C38]" />;
      case 'Cpu':
        return <Cpu className="w-7 h-7 text-[#D6A146]" />;
      default:
        return <Shield className="w-7 h-7 text-[#284C38]" />;
    }
  };

  return (
    <section
      id="why-choose-enu-section"
      className="py-20 lg:py-28 bg-[#F7F5EF] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          {/* <span className="text-xs font-semibold uppercase tracking-widest text-[#C86D39] font-btn">
            Pure By Nature
          </span> */}
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#1D1D1D] mt-1">
            Why <span className="text-[#284C38]/90">ENU Foods</span> Belongs In
            Your Kitchen
          </h2>
          <p className="font-body text-gray-600 mt-4 text-base font-light">
            We blend century-old culinary tradition with modern cold-milling
            technology.
          </p>
        </div>

        {/* 6 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {WHY_CHOOSE_ENU.map((item, idx) => (
            <div
              key={item.title}
              className="bg-white rounded-2xl p-8 border border-[#D6A146]/20 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col justify-between group relative text-left"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-[#F7F5EF] group-hover:bg-[#284C38]/10 flex items-center justify-center mb-6 transition-colors">
                  {getIcon(item.iconName)}
                </div>
                <h3 className="text-2xl font-semibold text-[#1D1D1D] group-hover:text-[#284C38] transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 mt-2 leading-relaxed font-light">
                  {item.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-[#D6A146] font-medium font-btn">
                <span>Purity Guarantee</span>
                <span className="w-2 h-2 rounded-full bg-[#D6A146]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
