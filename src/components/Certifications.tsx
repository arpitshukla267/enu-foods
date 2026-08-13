import React from 'react';
import { CERTIFICATIONS } from '../data/mockData';
import { ShieldCheck, Award, HeartHandshake, Sparkles, CheckCircle2, Leaf } from 'lucide-react';

export const Certifications: React.FC = () => {
  const getCertIcon = (iconName: string) => {
    switch (iconName) {
      case 'ShieldCheck':
        return <ShieldCheck className="w-8 h-8 text-[#284C38]" />;
      case 'Award':
        return <Award className="w-8 h-8 text-[#D6A146]" />;
      case 'HeartHandshake':
        return <HeartHandshake className="w-8 h-8 text-[#C86D39]" />;
      case 'Sparkles':
        return <Sparkles className="w-8 h-8 text-[#284C38]" />;
      case 'CheckCircle2':
        return <CheckCircle2 className="w-8 h-8 text-[#D6A146]" />;
      case 'Leaf':
        return <Leaf className="w-8 h-8 text-[#284C38]" />;
      default:
        return <Award className="w-8 h-8 text-[#D6A146]" />;
    }
  };

  return (
    <section id="certifications-section" className="py-16 bg-[#F7F5EF] border-y border-[#D6A146]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-10">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#284C38] font-btn">
            Quality Approvals & Accreditations
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#1D1D1D] mt-1">
            Certified Pure By National Food Safety Standards
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {CERTIFICATIONS.map((cert) => (
            <div 
              key={cert.id}
              className="bg-white rounded-2xl p-5 border border-[#D6A146]/20 shadow-sm hover:shadow-md transition-all text-center flex flex-col items-center justify-center group"
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
    </section>
  );
};
