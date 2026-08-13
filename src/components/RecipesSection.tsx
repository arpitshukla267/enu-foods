import React from 'react';
import { RECIPES } from '../data/mockData';
import { Recipe, NavigationPage } from '../types';
import { Utensils, Sparkles, ChefHat } from 'lucide-react';

interface RecipesSectionProps {
  onSelectRecipe: (recipe: Recipe) => void;
  onNavigate: (page: NavigationPage) => void;
}

export const RecipesSection: React.FC<RecipesSectionProps> = ({ onSelectRecipe }) => {
  return (
    <section id="recipes-section" className="py-12 md:py-16 lg:py-24 bg-[#F7F5EF] relative overflow-hidden text-left">
      <div className="max-w-[95vw] md:max-w-7xl mx-auto px-0 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#C86D39] font-btn bg-[#C86D39]/10 px-3.5 py-1 rounded-full border border-[#C86D39]/20 inline-block mb-2">
            Signature Kitchen Creations
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#1D1D1D]">
            Authentic Recipes Crafted With ENU Spices
          </h2>
          <p className="font-body text-gray-600 mt-2 text-sm font-light">
            Tap any dish photo to view ingredient pairings and quick cooking tips.
          </p>
        </div>

        {/* Recipe Cards Image Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-x-2 gap-y-4 lg:gap-6">
          {RECIPES.slice(0, 4).map((recipe) => (
            <div 
              key={recipe.id}
              onClick={() => onSelectRecipe(recipe)}
              className="relative h-80 rounded-2xl lg:rounded-3xl overflow-hidden shadow-lg border border-[#D6A146]/30 cursor-pointer group transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
            >
              {/* Full background image */}
              <img 
                src={recipe.image} 
                alt={recipe.title} 
                className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              
              {/* Dark overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

              {/* Top spice tag */}
              <div className="absolute max-w-fit md:top-4 top-3 left-2 md:left-4 bg-[#1E3A2B]/90 backdrop-blur-md text-[#D6A146] text-[10px] font-semibold px-3 py-1 rounded-full font-btn border border-[#D6A146]/40 flex items-center gap-1.5 shadow-md">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{recipe.enuSpicesUsed[0] || 'ENU Spices'}</span>
              </div>

              {/* Bottom text overlay on image */}
              <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
                <div className="text-[10px] text-[#D6A146] uppercase font-btn font-bold tracking-wider flex items-center gap-1">
                  <ChefHat className="w-3 h-3" />
                  <span>{recipe.cookTime} • {recipe.difficulty}</span>
                </div>
                <h3 className="font-heading text-lg font-bold leading-tight group-hover:text-[#D6A146] transition-colors">
                  {recipe.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
