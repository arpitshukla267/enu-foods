import React, { useCallback, useEffect, useState } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  UtensilsCrossed,
  Clock,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { motion } from "motion/react";
import { Recipe } from "../../types";
import { StatusBadge } from "../common/StatusBadge";
import { ConfirmDialog } from "../common/ConfirmDialog";
import { EmptyState } from "../common/EmptyState";
import * as adminRecipeApi from "../../lib/adminRecipeApi";
import { ApiError } from "../../lib/apiClient";

interface RecipesViewProps {
  refreshToken: number;
  onNewRecipe: () => void;
  onEditRecipe: (recipe: Recipe) => void;
  onDeleteRecipe: (id: string) => void;
}

export const RecipesView: React.FC<RecipesViewProps> = ({
  refreshToken,
  onNewRecipe,
  onEditRecipe,
  onDeleteRecipe,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [deletingRecipe, setDeletingRecipe] = useState<Recipe | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
    }, 350);
    return () => window.clearTimeout(timer);
  }, [searchQuery]);

  const fetchRecipes = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await adminRecipeApi.getRecipes({
        limit: 100,
        search: debouncedSearch || undefined,
        status: selectedStatus === "all" ? "all" : (selectedStatus as Recipe["status"]),
      });

      setRecipes(result.recipes);
    } catch (fetchError) {
      setRecipes([]);
      setError(
        fetchError instanceof ApiError
          ? fetchError.message
          : fetchError instanceof Error
            ? fetchError.message
            : "Failed to load recipes",
      );
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, selectedStatus]);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes, refreshToken]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-[#E8E2D5] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold text-[#173D2A] font-serif-brand">Recipes</h2>
            <span className="px-2 py-0.5 rounded-full bg-[#F4EFE6] text-[#173D2A] text-xs font-medium border border-[#E5DEC9]">
              {recipes.length} Recipes
            </span>
          </div>
          <p className="text-xs text-[#736854] mt-0.5">
            Manage chef-crafted recipes shown on the storefront.
          </p>
        </div>

        <button
          onClick={onNewRecipe}
          className="flex items-center justify-center gap-2 px-4 py-2 text-xs font-medium text-[#173D2A] bg-[#D99B26] hover:bg-[#C68A1B] rounded-xl shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Recipe</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl border border-[#E8E2D5] shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#8F816B] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search recipes by title, spice..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-[#F9F7F2] border border-[#DCD4C0] rounded-xl text-[#1A211D] placeholder-[#8F816B] focus:outline-none focus:border-[#173D2A]"
          />
        </div>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="w-full sm:w-auto px-3 py-2 text-xs bg-[#F9F7F2] border border-[#DCD4C0] rounded-xl text-[#1A211D] font-medium focus:outline-none focus:border-[#173D2A]"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="draft">Drafts</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {error && (
        <div className="bg-[#FDF0EE] border border-[#E8C4BE] rounded-xl p-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[#9E382B] text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={fetchRecipes}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#173D2A] hover:underline"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retry
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-20 text-[#736854]">
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
          Loading recipes...
        </div>
      ) : recipes.length === 0 ? (
        <EmptyState
          icon={UtensilsCrossed}
          title="No Recipes Found"
          description="Create your first recipe or reset your search."
          actionLabel="Add Recipe"
          onAction={onNewRecipe}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              className="bg-white rounded-2xl border border-[#E8E2D5] shadow-xs overflow-hidden flex flex-col justify-between group hover:shadow-md transition-all duration-200"
            >
              <div>
                <div className="relative h-44 w-full bg-[#173D2A] overflow-hidden">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute top-3 right-3">
                    <StatusBadge status={recipe.status} size="sm" />
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="text-[10px] font-semibold text-[#D99B26] uppercase tracking-wider line-clamp-1">
                      {recipe.subtitle}
                    </p>
                    <h3 className="text-base font-bold text-white font-serif-brand line-clamp-1">
                      {recipe.title}
                    </h3>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <p className="text-xs text-[#736854] line-clamp-2">{recipe.description}</p>

                  <div className="flex items-center gap-3 text-[11px] text-[#736854]">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {recipe.cookTime || "—"}
                    </span>
                    <span>{recipe.difficulty}</span>
                    <span>{recipe.servings || "—"}</span>
                  </div>

                  {recipe.enuSpicesUsed.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {recipe.enuSpicesUsed.slice(0, 3).map((spice) => (
                        <span
                          key={spice}
                          className="text-[10px] bg-[#F9F7F2] text-[#173D2A] px-2 py-0.5 rounded-full border border-[#E8E2D5]"
                        >
                          {spice}
                        </span>
                      ))}
                      {recipe.enuSpicesUsed.length > 3 && (
                        <span className="text-[10px] text-[#8F816B]">
                          +{recipe.enuSpicesUsed.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 bg-[#FAF8F5] border-t border-[#E8E2D5] flex items-center justify-end gap-1">
                <button
                  onClick={() => onEditRecipe(recipe)}
                  className="p-2 text-xs font-semibold text-[#173D2A] bg-white hover:bg-[#F4EFE6] border border-[#DCD4C0] rounded-lg transition-colors flex items-center gap-1"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => setDeletingRecipe(recipe)}
                  className="p-2 text-[#9E382B] hover:bg-[#FDF0EE] rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deletingRecipe}
        title="Delete Recipe?"
        message={`Are you sure you want to remove "${deletingRecipe?.title}"?`}
        confirmLabel="Delete Recipe"
        cancelLabel="Cancel"
        isDestructive
        onConfirm={() => {
          if (deletingRecipe) {
            onDeleteRecipe(deletingRecipe.id);
            setDeletingRecipe(null);
          }
        }}
        onCancel={() => setDeletingRecipe(null)}
      />
    </motion.div>
  );
};
