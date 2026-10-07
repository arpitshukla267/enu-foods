import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

interface StartupLoaderProps {
  onFinish?: () => void;
}

export const StartupLoader: React.FC<StartupLoaderProps> = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setFadeOut(true);
            setTimeout(() => {
              if (onFinish) onFinish();
            }, 400);
          }, 200);
          return 100;
        }
        return prev + 12;
      });
    }, 80);

    return () => clearInterval(interval);
  }, [onFinish]);

  return (
    <div 
      className={`fixed inset-0 z-[100] bg-[#1E3A2B] text-white flex flex-col items-center justify-center transition-opacity duration-500 ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="relative flex flex-col items-center text-center p-6 max-w-sm">
        
        {/* Animated Brand Emblem */}
        <div className="w-20 h-20 flex items-center justify-center mb-6 relative animate-pulse">
          <img src="/Ayka_logo.webp" alt="Ayka Exports" className="w-full h-full object-contain" />
        </div>

        <h1 className="font-heading text-3xl font-bold tracking-tight text-white mb-1">
          Ayka <span className="text-[#D6A146]">Exports</span>
        </h1>
        <p className="text-xs uppercase tracking-widest text-[#D6A146] font-btn font-semibold mb-8">
          Pure Masala Spices • Cold Ground
        </p>

        {/* Progress Bar Container */}
        <div className="w-48 h-1.5 bg-white/20 rounded-full overflow-hidden relative mb-3">
          <div 
            className="h-full bg-gradient-to-r from-[#D6A146] to-[#E5C180] transition-all duration-150 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        <span className="text-[11px] text-white/70 font-btn font-medium">
          Loading Heritage Spices ({progress}%)
        </span>

      </div>
    </div>
  );
};
