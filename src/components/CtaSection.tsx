import React, { useState } from 'react';
import { ArrowRight, Sparkles, Check } from 'lucide-react';
import { NavigationPage } from '../types';

interface CtaSectionProps {
  onNavigate: (page: NavigationPage) => void;
}

export const CtaSection: React.FC<CtaSectionProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <section className="py-20 lg:py-28 bg-gradient-to-br from-[#1E3A2B] via-[#284C38] to-[#1D3527] text-white relative overflow-hidden">
      
      {/* Decorative Gold Rings */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-80 h-80 border-2 border-[#D6A146]/20 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-80 h-80 border-2 border-[#D6A146]/20 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">
        
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D6A146]/20 border border-[#D6A146]/30 text-[#D6A146] text-xs font-semibold uppercase tracking-wider font-btn">
          <Sparkles className="w-4 h-4" />
          <span>Pure By Nature. Trusted By You.</span>
        </div>

        <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
          Bring Authentic Indian Taste Home
        </h2>

        <p className="font-body text-base sm:text-lg text-white/80 max-w-2xl mx-auto font-light leading-relaxed">
          Upgrade your daily cooking with 100% natural, cold-ground spices crafted without artificial colors, starch fillers, or preservatives.
        </p>

        {/* CTA Buttons & Newsletter Input */}
        <div className="pt-4 max-w-lg mx-auto space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              id="cta-explore-products-btn"
              onClick={() => onNavigate('products')}
              className="w-full sm:w-auto bg-[#D6A146] hover:bg-[#E8BF73] text-[#1D1D1D] font-semibold text-base px-9 py-4 rounded-full font-btn shadow-xl transition-all duration-300 flex items-center justify-center gap-2 group transform hover:-translate-y-1"
            >
              <span>Explore Products</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button 
              id="cta-[#contact]-btn"
              onClick={() => onNavigate('contact')}
              className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border border-white/20 font-medium text-base px-8 py-4 rounded-full font-btn backdrop-blur-md transition-all"
            >
              Contact Distributorship
            </button>
          </div>

          {/* Quick Newsletter Signup */}
          <form onSubmit={handleSubmit} className="pt-6">
            <div className="text-xs text-[#D6A146] font-btn font-medium uppercase tracking-wider mb-2">
              Get Seasonal Recipes & Spice Updates
            </div>
            <div className="flex items-center bg-white/10 backdrop-blur-md rounded-full p-1.5 border border-[#D6A146]/30">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address..."
                className="w-full bg-transparent px-4 text-sm text-white placeholder-white/50 focus:outline-none font-body"
                required
              />
              <button 
                type="submit"
                className="bg-[#D6A146] hover:bg-[#E8BF73] text-[#1D1D1D] text-xs font-bold font-btn px-5 py-2.5 rounded-full shrink-0 transition-colors"
              >
                {subscribed ? 'Subscribed!' : 'Subscribe'}
              </button>
            </div>
            {subscribed && (
              <p className="text-xs text-[#D6A146] mt-2 flex items-center justify-center gap-1 font-body">
                <Check className="w-3.5 h-3.5" /> Thank you for subscribing to ENU Foods!
              </p>
            )}
          </form>
        </div>

      </div>
    </section>
  );
};
