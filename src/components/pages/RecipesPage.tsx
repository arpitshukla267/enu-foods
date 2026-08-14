import React, { useState, useMemo } from "react";
import { RECIPES } from "../../data/mockData";
import { Recipe, NavigationPage } from "../../types";
import {
  Search,
  Clock,
  ChefHat,
  Users,
  Sparkles,
  ArrowRight,
  Utensils,
  BookOpen,
} from "lucide-react";

interface RecipesPageProps {
  onSelectRecipe: (recipe: Recipe) => void;
  onNavigate: (page: NavigationPage) => void;
}

export const RecipesPage: React.FC<RecipesPageProps> = ({
  onSelectRecipe,
  onNavigate,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All");
  const [selectedSpiceFilter, setSelectedSpiceFilter] = useState<string>("All");

  // Extract all unique spices mentioned across recipes
  const allSpices = useMemo(() => {
    const spiceSet = new Set<string>();
    RECIPES.forEach((r) => {
      r.enuSpicesUsed.forEach((s) => spiceSet.add(s));
    });
    return Array.from(spiceSet);
  }, []);

  const filteredRecipes = useMemo(() => {
    return RECIPES.filter((recipe) => {
      const matchesSearch =
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.enuSpicesUsed.some((spice) =>
          spice.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        recipe.ingredientsList.some((ing) =>
          ing.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesDifficulty =
        selectedDifficulty === "All" ||
        recipe.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();

      const matchesSpice =
        selectedSpiceFilter === "All" ||
        recipe.enuSpicesUsed.includes(selectedSpiceFilter);

      return matchesSearch && matchesDifficulty && matchesSpice;
    });
  }, [searchQuery, selectedDifficulty, selectedSpiceFilter]);

  return (
    <div className="min-h-screen bg-[#F7F5EF] pt-28 pb-20 text-left">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Hero Banner */}
        {/* <div className="relative bg-[#1E3A2B] text-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl p-5 sm:p-8 mb-6 border border-[#D6A146]/30">
          <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-[#D6A146]/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl">
           

            <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight mb-2 text-white">
              Cook With <span className="text-[#D6A146]">Pure ENU Spices</span>
            </h1>

            <p className="font-body text-gray-300 text-xs sm:text-sm leading-relaxed">
              Chef-crafted step-by-step recipes to bring out natural aromas and
              essential oils of stone-ground masalas.
            </p>
          </div>
        </div> */}

        {/* Controls: Search & Filters */}
        <div className="bg-white rounded-xl sm:rounded-2xl border border-[#D6A146]/20 shadow-xs p-3 sm:p-4 mb-6 space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search recipe, dish, or spice used..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F7F5EF] border border-gray-200 focus:border-[#D6A146] focus:bg-white rounded-xl py-2 pl-9 pr-4 text-xs sm:text-sm outline-none transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600 bg-gray-200 rounded-full w-4 h-4 flex items-center justify-center"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Difficulty Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto pb-0.5 sm:pb-0 scrollbar-none">
              {["All", "Easy", "Medium", "Advanced"].map((diff) => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`px-2.5 py-1.5 text-[11px] sm:text-xs font-semibold rounded-lg transition-colors shrink-0 ${
                    selectedDifficulty === diff
                      ? "bg-[#284C38] text-white shadow-xs"
                      : "bg-[#F7F5EF] text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          {/* Spice Filter Chips */}
          <div className="pt-2 border-t border-gray-100 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            <span className="text-[10px] sm:text-xs font-semibold text-gray-500 shrink-0">
              Spice:
            </span>
            <button
              onClick={() => setSelectedSpiceFilter("All")}
              className={`px-2 py-0.5 text-[10px] sm:text-[11px] rounded-full border transition-colors shrink-0 ${
                selectedSpiceFilter === "All"
                  ? "border-[#D6A146] bg-[#D6A146]/10 text-[#1D1D1D] font-bold"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
              }`}
            >
              All
            </button>
            {allSpices.map((spice) => (
              <button
                key={spice}
                onClick={() =>
                  setSelectedSpiceFilter(
                    selectedSpiceFilter === spice ? "All" : spice
                  )
                }
                className={`px-2 py-0.5 text-[10px] sm:text-[11px] rounded-full border transition-colors shrink-0 ${
                  selectedSpiceFilter === spice
                    ? "border-[#284C38] bg-[#284C38] text-white font-medium"
                    : "border-gray-200 bg-[#F7F5EF] text-gray-700 hover:border-[#D6A146]/50"
                }`}
              >
                {spice.replace("ENU ", "")}
              </button>
            ))}
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-4 px-1">
          <p className="text-xs sm:text-sm text-gray-600">
            Showing{" "}
            <strong className="text-[#1D1D1D] font-semibold">
              {filteredRecipes.length}
            </strong>{" "}
            recipe{filteredRecipes.length === 1 ? "" : "s"}
          </p>
          {(searchQuery ||
            selectedDifficulty !== "All" ||
            selectedSpiceFilter !== "All") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedDifficulty("All");
                setSelectedSpiceFilter("All");
              }}
              className="text-[11px] text-[#C86D39] hover:underline font-medium"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Compact Responsive Recipes Grid: 2 cols on mobile, 3 on tab, 4-5 on desktop */}
        {filteredRecipes.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
            {filteredRecipes.map((recipe) => (
              <div
                key={recipe.id}
                onClick={() => onSelectRecipe(recipe)}
                className="group bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-[#D6A146]/20 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col cursor-pointer"
              >
                {/* Image Container - Compact height */}
                <div className="relative h-32 sm:h-36 md:h-40 overflow-hidden bg-[#1E3A2B]">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

                  {/* Difficulty Badge */}
                  <div className="absolute top-2 left-2 bg-[#1E3A2B]/90 backdrop-blur-md text-white text-[9px] sm:text-[10px] font-semibold px-2 py-0.5 rounded-full border border-white/20 flex items-center gap-1">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        recipe.difficulty === "Easy"
                          ? "bg-green-400"
                          : recipe.difficulty === "Medium"
                          ? "bg-amber-400"
                          : "bg-red-400"
                      }`}
                    />
                    <span>{recipe.difficulty}</span>
                  </div>

                  {/* Cook time badge */}
                  <div className="absolute bottom-2 left-2 flex items-center gap-1 text-white text-[10px] bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md font-medium">
                    <Clock className="w-3 h-3 text-[#D6A146]" />
                    <span>{recipe.cookTime}</span>
                  </div>
                </div>

                {/* Content Container - Compact padding & text */}
                <div className="p-2.5 sm:p-3 flex-1 flex flex-col justify-between gap-2">
                  <div>
                    <h3 className="font-heading text-xs sm:text-sm font-bold text-[#1D1D1D] group-hover:text-[#284C38] transition-colors line-clamp-1 mb-1 leading-snug">
                      {recipe.title}
                    </h3>
                    <p className="text-[10px] sm:text-xs text-gray-500 line-clamp-1 leading-normal mb-2">
                      {recipe.subtitle}
                    </p>

                    {/* Compact Spice Tag Pills */}
                    <div className="flex flex-wrap gap-1 mb-1">
                      {recipe.enuSpicesUsed.slice(0, 2).map((spice) => (
                        <span
                          key={spice}
                          className="text-[9px] sm:text-[10px] bg-[#F7F5EF] text-[#284C38] border border-[#284C38]/15 px-1.5 py-0.5 rounded font-medium truncate max-w-full"
                        >
                          {spice.replace("ENU ", "")}
                        </span>
                      ))}
                      {recipe.enuSpicesUsed.length > 2 && (
                        <span className="text-[9px] text-gray-400 self-center">
                          +{recipe.enuSpicesUsed.length - 2}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Footer CTA */}
                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[10px] sm:text-[11px] font-semibold text-gray-500">
                    <span className="truncate">{recipe.servings}</span>
                    <span className="text-[#284C38] group-hover:text-[#D6A146] font-bold inline-flex items-center gap-0.5 shrink-0 transition-colors">
                      <span>View</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-2xl p-8 text-center border border-gray-200 max-w-md mx-auto">
            <div className="w-12 h-12 rounded-full bg-[#F7F5EF] flex items-center justify-center mx-auto mb-3 text-gray-400">
              <Utensils className="w-6 h-6" />
            </div>
            <h3 className="font-heading text-base font-bold text-[#1D1D1D] mb-1">
              No matching recipes found
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Try adjusting your search terms or filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedDifficulty("All");
                setSelectedSpiceFilter("All");
              }}
              className="bg-[#284C38] hover:bg-[#1E3A2B] text-white text-xs font-bold py-2 px-4 rounded-xl transition-all"
            >
              Show All Recipes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
