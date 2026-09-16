import React from 'react';
import { Flame } from 'lucide-react';

interface SpicinessRatingProps {
  level: number; // 1 to 5
  onChange?: (level: number) => void;
  interactive?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const SpicinessRating: React.FC<SpicinessRatingProps> = ({
  level,
  onChange,
  interactive = false,
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  }[size];

  const levelsText = ['Very Mild', 'Mild', 'Medium Warm', 'Spicy Piquant', 'Extra Hot & Fiery'];

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((index) => {
          const isActive = index <= level;
          return (
            <button
              key={index}
              type={interactive ? 'button' : undefined}
              disabled={!interactive}
              onClick={() => interactive && onChange && onChange(index)}
              className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-all`}
              aria-label={`Spiciness level ${index}`}
            >
              <Flame
                className={`${sizeClasses} ${
                  isActive
                    ? 'text-[#9E382B] fill-[#9E382B]'
                    : 'text-[#DCD4C0] fill-transparent'
                }`}
              />
            </button>
          );
        })}
      </div>
      <span className="text-xs text-[#736854] font-medium ml-1">
        {levelsText[Math.max(0, Math.min(4, level - 1))]}
      </span>
    </div>
  );
};
