import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  change?: number;
  changePeriod?: string;
  contextText?: string;
  accentColor?: 'green' | 'gold' | 'red' | 'neutral';
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon: Icon,
  change,
  changePeriod = 'vs last month',
  contextText,
  accentColor = 'green'
}) => {
  const isPositive = change !== undefined ? change >= 0 : true;

  const colorStyles = {
    green: 'bg-[#173D2A]/10 text-[#173D2A] border-[#173D2A]/20',
    gold: 'bg-[#D99B26]/10 text-[#966710] border-[#D99B26]/30',
    red: 'bg-[#9E382B]/10 text-[#9E382B] border-[#9E382B]/20',
    neutral: 'bg-[#8F816B]/10 text-[#605544] border-[#8F816B]/20'
  }[accentColor];

  return (
    <div className="bg-[#FFFFFF] border border-[#E8E2D5] rounded-xl p-5 shadow-xs hover:border-[#D4CBBB] transition-all">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-[#736854] uppercase tracking-wider">
          {label}
        </span>
        <div className={`p-2 rounded-lg border ${colorStyles}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl font-medium text-[#173D2A] font-serif-brand tracking-tight">
          {value}
        </span>
      </div>

      {(change !== undefined || contextText) && (
        <div className="mt-3 flex items-center gap-1.5 text-xs">
          {change !== undefined && (
            <span
              className={`inline-flex items-center font-medium ${
                isPositive ? 'text-[#1B663E]' : 'text-[#9E382B]'
              }`}
            >
              {isPositive ? (
                <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5 mr-0.5" />
              )}
              {isPositive ? `+${change}%` : `${change}%`}
            </span>
          )}
          <span className="text-[#857A68]">
            {change !== undefined ? changePeriod : contextText}
          </span>
        </div>
      )}
    </div>
  );
};
