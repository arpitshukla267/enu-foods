import React, { useState } from 'react';
import Link from 'next/link';
import { Search, X, Sparkles, ArrowRight } from 'lucide-react';
import { PRODUCTS, RECIPES, CATEGORIES } from '../../data/mockData';
import { Product, Recipe, NavigationPage } from '../../types';

interface SearchOverlayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct?: (product: Product) => void;
  onSelectRecipe: (recipe: Recipe) => void;
  onNavigate: (page: NavigationPage, categoryName?: string) => void;
}

export const SearchOverlayModal: React.FC<SearchOverlayModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
  onSelectRecipe,
  onNavigate
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const matchedProducts = query ? PRODUCTS.filter(p => 
    p.name.toLowerCase().includes(query.toLowerCase()) || 
    p.category.toLowerCase().includes(query.toLowerCase()) ||
    p.ingredients.some(i => i.toLowerCase().includes(query.toLowerCase()))
  ) : [];

  const matchedRecipes = query ? RECIPES.filter(r => 
    r.title.toLowerCase().includes(query.toLowerCase()) ||
    r.enuSpicesUsed.some(s => s.toLowerCase().includes(query.toLowerCase()))
  ) : [];

  const matchedCategories = query ? CATEGORIES.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase())
  ) : [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/70 backdrop-blur-md animate-fadeIn text-left">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-[#D6A146]/40 relative max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="p-4 sm:p-6 border-b border-gray-100 flex items-center gap-3 bg-[#F7F5EF]">
          <Search className="w-6 h-6 text-[#284C38] shrink-0" />
          <input 
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search ENU Spices (e.g., Sambhar, Garam Masala, Turmeric)..."
            className="w-full bg-transparent text-lg text-[#1D1D1D]  placeholder-gray-400 focus:outline-none"
          />
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200 text-gray-500 hover:text-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Results */}
        <div className="p-6 overflow-y-auto space-y-6">
          {!query ? (
            <div className="space-y-4">
              <div className="text-xs font-bold text-[#C86D39] font-btn uppercase tracking-wider">
                Popular Searches:
              </div>
              <div className="flex flex-wrap gap-2">
                {['Sambhar Masala', 'Garam Masala', 'Turmeric Powder', 'Kitchen King', 'Paneer Butter Masala'].map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="text-xs bg-[#F7F5EF] hover:bg-[#284C38] text-gray-700 hover:text-white px-3 py-1.5 rounded-full font-body transition-colors border border-gray-200"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Product Matches */}
              {matchedProducts.length > 0 && (
                <div>
                  <div className="text-xs font-bold text-[#284C38] font-btn uppercase tracking-wider mb-3">
                    Spices & Masalas ({matchedProducts.length})
                  </div>
                  <div className="space-y-2">
                    {matchedProducts.map((product) => (
                      <Link
                        key={product.id}
                        href={`/products/${product.id}`}
                        onClick={onClose}
                        className="p-3 rounded-2xl hover:bg-[#F7F5EF] flex items-center justify-between cursor-pointer border border-transparent hover:border-[#D6A146]/30 transition-all group block"
                      >
                        <div className="flex items-center gap-3">
                          <img src={product.image} alt="" className="w-12 h-12 rounded-xl object-cover bg-[#1E3A2B]" referrerPolicy="no-referrer" />
                          <div>
                            <div className="font-heading font-bold text-base text-[#1D1D1D] group-hover:text-[#284C38]">
                              {product.name}
                            </div>
                            <div className="text-xs text-gray-500 font-body">
                              {product.category} • {product.defaultWeight}
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-[#D6A146] opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Recipe Matches */}
              {matchedRecipes.length > 0 && (
                <div>
                  <div className="text-xs font-bold text-[#C86D39] font-btn uppercase tracking-wider mb-3">
                    Culinary Recipes ({matchedRecipes.length})
                  </div>
                  <div className="space-y-2">
                    {matchedRecipes.map((recipe) => (
                      <div
                        key={recipe.id}
                        onClick={() => {
                          onClose();
                          onSelectRecipe(recipe);
                        }}
                        className="p-3 rounded-2xl hover:bg-[#F7F5EF] flex items-center justify-between cursor-pointer border border-transparent hover:border-[#D6A146]/30 transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <img src={recipe.image} alt="" className="w-12 h-12 rounded-xl object-cover bg-[#1E3A2B]" referrerPolicy="no-referrer" />
                          <div>
                            <div className="font-heading font-bold text-base text-[#1D1D1D] group-hover:text-[#284C38]">
                              {recipe.title}
                            </div>
                            <div className="text-xs text-gray-500 font-body">
                              {recipe.cookTime} • {recipe.difficulty}
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-[#D6A146] opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* No matches */}
              {matchedProducts.length === 0 && matchedRecipes.length === 0 && (
                <div className="text-center py-8 text-gray-500 font-body text-sm">
                  No matching ENU spices or recipes found for "{query}".
                </div>
              )}
            </>
          )}
        </div>

      </div>
    </div>
  );
};
