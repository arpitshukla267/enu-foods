"use client";

import React from "react";
import {
  ArrowLeft,
  Clock,
  ChefHat,
  Users,
  CheckCircle2,
  Sparkles,
  Utensils,
  Timer,
} from "lucide-react";
import { Recipe } from "../types";

interface RecipeDetailPageProps {
  recipe: Recipe;
  onBack: () => void;
}

export const RecipeDetailPage: React.FC<RecipeDetailPageProps> = ({
  recipe,
  onBack,
}) => {
  return (
    <div className="min-h-screen bg-[#F7F5EF] pt-24 pb-20 text-left">
      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-[#284C38] hover:text-[#C86D39] font-semibold text-sm font-btn mb-6 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Recipes</span>
        </button>

        {/* Hero / Main Recipe Card */}
        <div className="bg-white rounded-3xl overflow-hidden border border-[#D6A146]/25 shadow-xl">
          {/* Hero Image */}
          <div className="relative h-[300px] sm:h-[400px] lg:h-[500px] overflow-hidden bg-[#1E3A2B]">
            <img
              src={recipe.image}
              alt={recipe.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1D1D1D] via-[#1D1D1D]/30 to-transparent" />

            {/* Spice Badge */}
            <div className="absolute top-5 left-5 bg-[#1E3A2B]/90 backdrop-blur-md text-[#D6A146] px-4 py-2 rounded-full border border-[#D6A146]/40 flex items-center gap-2 text-xs font-semibold font-btn">
              <Sparkles className="w-4 h-4" />
              <span>ENU Signature Recipe</span>
            </div>

            {/* Hero Text */}
            <div className="absolute bottom-6 left-5 right-5 sm:left-8 sm:right-8 lg:left-10 lg:right-10 text-white">
              <span className="text-xs sm:text-sm text-[#D6A146] uppercase font-btn font-bold tracking-widest">
                {recipe.subtitle}
              </span>

              <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold mt-2 max-w-4xl leading-tight">
                {recipe.title}
              </h1>
            </div>
          </div>

          {/* Content */}
          <div className="p-5 sm:p-8 lg:p-10">
            {/* Description */}
            {recipe.description && (
              <div className="max-w-4xl mb-8">
                <p className="font-body text-gray-600 text-sm sm:text-base leading-relaxed">
                  {recipe.description}
                </p>
              </div>
            )}

            {/* Recipe Meta */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-[#F7F5EF] p-4 sm:p-5 rounded-2xl border border-[#D6A146]/20 mb-8">
              <div className="text-center">
                <Timer className="w-5 h-5 text-[#284C38] mx-auto mb-2" />
                <div className="text-[10px] text-gray-500 font-btn uppercase tracking-wide">
                  Prep Time
                </div>
                <div className="text-sm font-bold text-[#1D1D1D] font-body mt-1">
                  {recipe.prepTime}
                </div>
              </div>

              <div className="text-center md:border-x border-gray-200">
                <Clock className="w-5 h-5 text-[#284C38] mx-auto mb-2" />
                <div className="text-[10px] text-gray-500 font-btn uppercase tracking-wide">
                  Cook Time
                </div>
                <div className="text-sm font-bold text-[#1D1D1D] font-body mt-1">
                  {recipe.cookTime}
                </div>
              </div>

              <div className="text-center md:border-r border-gray-200">
                <ChefHat className="w-5 h-5 text-[#C86D39] mx-auto mb-2" />
                <div className="text-[10px] text-gray-500 font-btn uppercase tracking-wide">
                  Difficulty
                </div>
                <div className="text-sm font-bold text-[#1D1D1D] font-body mt-1">
                  {recipe.difficulty}
                </div>
              </div>

              <div className="text-center">
                <Users className="w-5 h-5 text-[#D6A146] mx-auto mb-2" />
                <div className="text-[10px] text-gray-500 font-btn uppercase tracking-wide">
                  Servings
                </div>
                <div className="text-sm font-bold text-[#1D1D1D] font-body mt-1">
                  {recipe.servings}
                </div>
              </div>
            </div>

            {/* Two Column Content */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              {/* LEFT - Ingredients */}
              <div className="lg:col-span-5">
                {/* ENU Spices */}
                <div className="bg-[#284C38]/10 p-5 rounded-2xl border border-[#284C38]/20 mb-7">
                  <span className="text-xs font-bold text-[#284C38] uppercase font-btn flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-[#D6A146]" />
                    ENU Spices Required
                  </span>

                  <div className="flex flex-wrap gap-2">
                    {recipe.enuSpicesUsed.map((spice, i) => (
                      <span
                        key={i}
                        className="text-xs bg-[#284C38] text-white px-3 py-1.5 rounded-full font-medium font-body shadow-sm"
                      >
                        ✓ {spice}
                      </span>
                    ))}
                  </div>

                  <p className="text-[11px] text-gray-600 mt-3 font-body">
                    Use these ENU spices for the best flavour and authentic
                    result.
                  </p>
                </div>

                {/* Ingredients */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Utensils className="w-5 h-5 text-[#C86D39]" />
                    <h2 className="font-heading text-2xl font-bold text-[#1D1D1D]">
                      Ingredients
                    </h2>
                  </div>

                  <div className="space-y-2">
                    {recipe.ingredientsList.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 bg-[#F7F5EF] p-3 rounded-xl border border-gray-100"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#284C38] shrink-0 mt-0.5" />

                        <span className="text-sm font-body text-gray-700 leading-relaxed">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* RIGHT - Instructions */}
              <div className="lg:col-span-7">
                <div className="flex items-center gap-2 mb-4">
                  <ChefHat className="w-5 h-5 text-[#C86D39]" />

                  <h2 className="font-heading text-2xl font-bold text-[#1D1D1D]">
                    Cooking Instructions
                  </h2>
                </div>

                <div className="space-y-4">
                  {recipe.instructions.map((step, i) => (
                    <div
                      key={i}
                      className="flex gap-4 bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="w-9 h-9 rounded-full bg-[#284C38] text-[#D6A146] font-bold text-sm flex items-center justify-center shrink-0 font-btn">
                        {i + 1}
                      </div>

                      <p className="text-sm font-body text-gray-700 leading-relaxed pt-1">
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="mt-10 pt-8 border-t border-gray-200">
              <div className="bg-[#1E3A2B] rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <h3 className="font-heading text-xl font-bold text-white">
                    Bring the authentic flavour home
                  </h3>

                  <p className="text-sm text-white/70 font-body mt-1">
                    Cook this recipe with ENU Spices.
                  </p>
                </div>

                <button
                  onClick={onBack}
                  className="bg-[#D6A146] hover:bg-[#e2b45e] text-[#1D1D1D] px-6 py-3 rounded-xl font-btn font-bold text-sm transition-all hover:-translate-y-0.5"
                >
                  Explore More Recipes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
