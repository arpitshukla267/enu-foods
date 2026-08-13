import React from 'react';
import { Recipe } from '../types';
import { X, Clock, ChefHat, Users, Utensils, CheckCircle2, Sparkles } from 'lucide-react';

interface RecipeModalProps {
  recipe: Recipe | null;
  onClose: () => void;
}

export const RecipeModal: React.FC<RecipeModalProps> = ({ recipe, onClose }) => {
  if (!recipe) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn text-left">
      <div 
        className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-[#D6A146]/30 relative max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="relative h-48 bg-[#1E3A2B] shrink-0 overflow-hidden">
          <img 
            src={recipe.image} 
            alt={recipe.title} 
            className="w-full h-full object-cover opacity-80"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1D1D1D] via-[#1D1D1D]/40 to-transparent" />
          
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 hover:bg-[#D6A146] text-white hover:text-[#1D1D1D] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-6 right-6 text-white">
            <span className="text-xs text-[#D6A146] uppercase font-btn font-bold tracking-wider">
              {recipe.subtitle}
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold">
              {recipe.title}
            </h2>
          </div>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
          
          {/* Recipe Meta Info */}
          <div className="grid grid-cols-3 gap-3 bg-[#F7F5EF] p-4 rounded-2xl text-center border border-[#D6A146]/20">
            <div>
              <Clock className="w-4 h-4 text-[#284C38] mx-auto mb-1" />
              <div className="text-[10px] text-gray-500 font-btn uppercase">Cook Time</div>
              <div className="text-xs font-bold text-[#1D1D1D] font-body">{recipe.cookTime}</div>
            </div>
            <div className="border-x border-gray-200">
              <ChefHat className="w-4 h-4 text-[#C86D39] mx-auto mb-1" />
              <div className="text-[10px] text-gray-500 font-btn uppercase">Difficulty</div>
              <div className="text-xs font-bold text-[#1D1D1D] font-body">{recipe.difficulty}</div>
            </div>
            <div>
              <Users className="w-4 h-4 text-[#D6A146] mx-auto mb-1" />
              <div className="text-[10px] text-gray-500 font-btn uppercase">Servings</div>
              <div className="text-xs font-bold text-[#1D1D1D] font-body">{recipe.servings}</div>
            </div>
          </div>

          {/* Featured ENU Spices Box */}
          <div className="bg-[#284C38]/10 p-4 rounded-2xl border border-[#284C38]/20">
            <span className="text-xs font-bold text-[#284C38] uppercase font-btn flex items-center gap-1.5 mb-2">
              <Sparkles className="w-4 h-4 text-[#D6A146]" />
              ENU Spices Required For Best Result:
            </span>
            <div className="flex flex-wrap gap-2">
              {recipe.enuSpicesUsed.map((spice, i) => (
                <span key={i} className="text-xs bg-[#284C38] text-white px-3 py-1 rounded-full font-medium font-body shadow-sm">
                  ✓ {spice}
                </span>
              ))}
            </div>
          </div>

          {/* Ingredients List */}
          <div>
            <h3 className="font-heading text-xl font-bold text-[#1D1D1D] mb-3">
              Ingredients Needed
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-body text-gray-700">
              {recipe.ingredientsList.map((item, i) => (
                <div key={i} className="flex items-start gap-2 bg-[#F7F5EF] p-2.5 rounded-lg border border-gray-100">
                  <CheckCircle2 className="w-4 h-4 text-[#284C38] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Step-by-Step Instructions */}
          <div>
            <h3 className="font-heading text-xl font-bold text-[#1D1D1D] mb-3">
              Cooking Instructions
            </h3>
            <div className="space-y-3">
              {recipe.instructions.map((step, i) => (
                <div key={i} className="flex gap-3 text-xs font-body text-gray-800 leading-relaxed bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <span className="w-6 h-6 rounded-full bg-[#284C38] text-[#D6A146] font-bold text-xs flex items-center justify-center shrink-0 font-btn">
                    {i + 1}
                  </span>
                  <p className="pt-0.5 font-light">{step}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
