import React from "react";
import { RECIPES } from "../../data/mockData";
import { Recipe, NavigationPage } from "../../types";
import {
  Sparkles,
  ChefHat,
  Clock,
  ArrowUpRight,
  ArrowRight,
} from "lucide-react";

interface RecipesSectionProps {
  onSelectRecipe: (recipe: Recipe) => void;
  onNavigate: (page: NavigationPage) => void;
}

export const RecipesSection: React.FC<RecipesSectionProps> = ({
  onSelectRecipe,
  onNavigate,
}) => {
  const [featured, ...rest] = RECIPES.slice(0, 5);

  return (
    <section
      id="recipes-section"
      className="py-8 md:py-8 lg:py-10 bg-[#F7F5EF] relative overflow-hidden text-left lg:max-h-[90vh] lg:flex lg:flex-col"
    >
      {/* Ambient texture */}
      <div className="absolute -top-24 -right-24 w-[420px] h-[420px] bg-[#D6A146]/10 rounded-full blur-[110px] pointer-events-none" />

      <div className="max-w-[95vw] md:max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 relative lg:flex lg:flex-col lg:flex-1 lg:min-h-0 w-full">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 lg:mb-6 px-4 sm:px-0 shrink-0">
          <div className="max-w-2xl">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#1D1D1D] leading-tight">
              Authentic Recipes Crafted With{" "} <br className="hidden sm:inline" />
              <span className="text-[#284C38]/90">ENU Spices</span>
            </h2>
          </div>

          <button
            onClick={() => onNavigate("recipes")}
            className="inline-flex items-center gap-1.5 text-[#284C38] hover:text-[#D6A146] font-medium text-sm transition-colors self-start sm:self-auto shrink-0 group"
          >
            <span className="border-b border-transparent group-hover:border-[#D6A146] transition-colors">
              View all recipes
            </span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>

        {/* Asymmetric grid: one large featured card + smaller cards alongside.
            lg:flex-1 + min-h-0 lets the grid consume whatever vertical space
            is left inside the 90vh-capped section, instead of using a fixed
            px height that can overflow the viewport. */}
        <div className="grid grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 gap-x-2 gap-y-4 lg:gap-6 px-2 sm:px-0 lg:flex-1 lg:min-h-0">
          {featured && (
            <RecipeCard
              recipe={featured}
              onClick={() => onSelectRecipe(featured)}
              className="col-span-2 row-span-2 h-80 lg:h-full"
              large
            />
          )}
          {rest.slice(0, 4).map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onClick={() => onSelectRecipe(recipe)}
              className="h-64 lg:h-full"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const RecipeCard: React.FC<{
  recipe: Recipe;
  onClick: () => void;
  className?: string;
  large?: boolean;
}> = ({ recipe, onClick, className = "", large = false }) => (
  <div
    onClick={onClick}
    className={`relative rounded-2xl lg:rounded-3xl overflow-hidden shadow-lg border border-[#D6A146]/30 cursor-pointer group transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${className}`}
  >
    {/* Background image */}
    <img
      src={recipe.image}
      alt={recipe.title}
      loading="lazy"
      className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
      referrerPolicy="no-referrer"
    />

    {/* Gradient overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/5" />

    {/* Top spice tag */}
    <div className="absolute max-w-fit md:top-4 top-3 left-2 md:left-4 bg-[#1E3A2B]/90 backdrop-blur-md text-[#D6A146] text-[10px] font-semibold px-3 py-1 rounded-full font-btn border border-[#D6A146]/40 flex items-center gap-1.5 shadow-md">
      <span>{recipe.enuSpicesUsed[0] || "ENU Spices"}</span>
    </div>

    {/* "Featured" ribbon for the hero card */}
    {large && (
      <div className="absolute top-3 md:top-4 right-2 md:right-4 bg-[#D6A146] text-[#1D1D1D] text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full font-btn shadow-md">
        Chef's Pick
      </div>
    )}

    {/* Bottom text overlay */}
    <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5 text-white space-y-1.5">
      <div className="flex items-center gap-3 text-[10px] text-[#E5C180] uppercase font-btn font-bold tracking-wider">
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {recipe.cookTime}
        </span>
     
      </div>

      <h3
        className={`leading-tight group-hover:text-[#D6A146] transition-colors ${
          large ? "text-xl md:text-2xl" : "text-lg"
        }`}
      >
        {recipe.title}
      </h3>

      {/* Reveal-on-hover CTA */}
      <div className="flex items-center gap-1 text-xs font-semibold text-[#D6A146] max-h-0 group-hover:max-h-6 opacity-0 group-hover:opacity-100 transition-all duration-300 overflow-hidden pt-0.5">
        <span>View recipe</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  </div>
);
