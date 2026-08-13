import React from 'react';
import { TESTIMONIALS } from '../data/mockData';
import { Star, Quote, CheckCircle2 } from 'lucide-react';

export const Testimonials: React.FC = () => {
  return (
    <section id="testimonials-section" className="py-20 lg:py-28 bg-[#1E3A2B] text-white relative overflow-hidden">
      
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#D6A146]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#D6A146] font-btn">
            Voice Of Indian Kitchens
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-1">
            Loved By Homemakers & Executive Chefs
          </h2>
          <p className="font-body text-white/80 mt-2 text-base font-light">
            Real feedback from kitchens across India enjoying 100% pure cold-ground spices.
          </p>
        </div>

        {/* Testimonials Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TESTIMONIALS.map((testimonial) => (
            <div 
              key={testimonial.id}
              className="bg-[#284C38]/80 backdrop-blur-md rounded-3xl p-6 border border-[#D6A146]/30 shadow-xl flex flex-col justify-between text-left hover:border-[#D6A146] transition-all duration-300 transform hover:-translate-y-1.5 relative group"
            >
              {/* Quote Icon */}
              <div className="absolute top-4 right-4 text-[#D6A146]/20 group-hover:text-[#D6A146]/40 transition-colors">
                <Quote className="w-8 h-8" />
              </div>

              <div>
                {/* 5 Star Rating */}
                <div className="flex items-center gap-1 text-[#D6A146] mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#D6A146]" />
                  ))}
                </div>

                {/* Highlight Title */}
                <h3 className="font-heading text-lg font-bold text-white mb-2">
                  "{testimonial.highlight}"
                </h3>

                {/* Comment Text */}
                <p className="font-body text-xs text-white/80 leading-relaxed font-light italic">
                  "{testimonial.comment}"
                </p>
              </div>

              {/* Author Footer */}
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-3">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name} 
                  className="w-10 h-10 rounded-full object-cover border border-[#D6A146]"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <div className="font-heading text-sm font-bold text-white flex items-center gap-1">
                    <span>{testimonial.name}</span>
                    {testimonial.verified && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#D6A146]" />
                    )}
                  </div>
                  <div className="font-body text-[10px] text-white/60">
                    {testimonial.location}
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
