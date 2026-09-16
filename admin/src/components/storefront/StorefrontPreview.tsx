import React, { useState } from 'react';
import { 
  X, 
  Store, 
  ShoppingBag, 
  Flame, 
  Sparkles, 
  Check, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  Leaf, 
  Search,
  Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, Combo, Category } from '../../types';
import { SpicinessRating } from '../common/SpicinessRating';

interface StorefrontPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  combos: Combo[];
  categories: Category[];
}

export const StorefrontPreview: React.FC<StorefrontPreviewProps> = ({
  isOpen,
  onClose,
  products,
  combos,
  categories
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedWeightByProduct, setSelectedWeightByProduct] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const activeProducts = products.filter(p => p.status === 'active');
  const activeCombos = combos.filter(c => c.status === 'active');

  const filteredProducts = activeProducts.filter(p => {
    const matchesCat = activeCategory === 'all' || p.categoryId === activeCategory;
    const matchesSearch = !searchQuery.trim() || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.categoryName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleSelectWeight = (productId: string, weight: string) => {
    setSelectedWeightByProduct(prev => ({ ...prev, [productId]: weight }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex flex-col overflow-hidden"
        >
          {/* Top Banner Bar for Admin */}
          <div className="bg-[#173D2A] text-white px-4 py-2.5 flex items-center justify-between border-b border-[#245A3F] shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D99B26] animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#F9F7F2]">
                Live Storefront Customer Simulation
              </span>
              <span className="text-[11px] text-[#A6C5B3] hidden sm:inline">
                (Changes made in CMS are reflected here in real time)
              </span>
            </div>

            <button
              onClick={onClose}
              className="px-3 py-1 bg-[#D99B26] hover:bg-[#C68A1B] text-[#173D2A] text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <X className="w-4 h-4" />
              <span>Exit Preview</span>
            </button>
          </div>

          {/* Storefront View Canvas */}
          <div className="flex-1 overflow-y-auto bg-[#F9F7F2] text-[#1A211D]">
            
            {/* Customer Header */}
            <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-[#E8E2D5] px-6 py-4 flex items-center justify-between shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#173D2A] text-[#D99B26] flex items-center justify-center font-bold text-lg border border-[#D99B26]/30">
                  E
                </div>
                <div>
                  <span className="text-lg font-bold tracking-widest uppercase text-[#173D2A]">
                    ENU FOODS
                  </span>
                  <span className="block text-[9px] font-semibold text-[#8F816B] tracking-wider uppercase">
                    Single Origin & Heritage Blends
                  </span>
                </div>
              </div>

              {/* Storefront Live Search Bar */}
              <div className="relative w-48 sm:w-72">
                <Search className="w-4 h-4 text-[#8F816B] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search pure spices & blends..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#F9F7F2] border border-[#DCD4C0] rounded-full text-[#1A211D] placeholder-[#8F816B] focus:outline-none focus:border-[#173D2A]"
                />
              </div>

              <div className="flex items-center gap-4 text-xs font-semibold text-[#173D2A]">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F4EFE6] rounded-full text-[#173D2A] border border-[#DCD4C0]">
                  <ShoppingBag className="w-3.5 h-3.5 text-[#D99B26]" />
                  <span>Cart (0)</span>
                </div>
              </div>
            </header>

            {/* Brand Hero Banner */}
            <section className="bg-[#173D2A] text-[#F9F7F2] py-12 px-6 text-center relative overflow-hidden">
              <div className="max-w-2xl mx-auto space-y-3 relative z-10">
                <span className="text-xs uppercase tracking-widest text-[#D99B26] font-bold">
                  Single Origin Harvests • Sun Dried
                </span>
                <h1 className="text-3xl sm:text-4xl font-bold">
                  Spices Grounded in Tradition
                </h1>
                <p className="text-xs sm:text-sm text-[#D4E2D9] max-w-lg mx-auto">
                  Experience the pristine flavors of hand-roasted whole spices, slow ground in small batches to preserve volatile natural aroma oils.
                </p>
              </div>
            </section>

            {/* Category Filter Pills */}
            <div className="max-w-6xl mx-auto px-6 pt-8 pb-4">
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                <button
                  onClick={() => setActiveCategory('all')}
                  className={`px-4 py-2 text-xs font-bold rounded-full transition-all shrink-0 ${
                    activeCategory === 'all'
                      ? 'bg-[#173D2A] text-white shadow-xs'
                      : 'bg-white text-[#5C5343] border border-[#E8E2D5] hover:border-[#173D2A]'
                  }`}
                >
                  All Spices ({activeProducts.length})
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-4 py-2 text-xs font-bold rounded-full transition-all shrink-0 ${
                      activeCategory === cat.id
                        ? 'bg-[#173D2A] text-white shadow-xs'
                        : 'bg-white text-[#5C5343] border border-[#E8E2D5] hover:border-[#173D2A]'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Product Grid */}
            <section className="max-w-6xl mx-auto px-6 pb-12">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-[#173D2A]">
                    {activeCategory === 'all' ? 'All Handcrafted Spices' : categories.find(c => c.id === activeCategory)?.name}
                  </h2>
                  <p className="text-xs text-[#736854]">
                    Showing {filteredProducts.length} live artisanal formulations
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => {
                  const selectedWeight = selectedWeightByProduct[product.id] || product.defaultWeight;
                  const currentVariant = product.weightOptions.find(w => w.weight === selectedWeight) || product.weightOptions[0];

                  return (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2 }}
                      className="bg-white rounded-2xl border border-[#E8E2D5] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                    >
                      <div>
                        {/* Image Container */}
                        <div className="relative h-48 bg-[#F4EFE6] overflow-hidden">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {product.isFeatured && (
                            <span className="absolute top-3 left-3 bg-[#D99B26] text-[#173D2A] text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md shadow-xs">
                              Bestseller
                            </span>
                          )}
                        </div>

                        {/* Details */}
                        <div className="p-4 space-y-3">
                          <div>
                            <span className="text-[10px] font-bold text-[#736854] uppercase tracking-wider">
                              {product.categoryName}
                            </span>
                            <h3 className="text-sm font-bold text-[#173D2A] line-clamp-1">
                              {product.name}
                            </h3>
                            <p className="text-xs text-[#736854] line-clamp-2 mt-1">
                              {product.shortDescription}
                            </p>
                          </div>

                          {/* Weight Variant Selector */}
                          <div className="space-y-1.5 pt-2 border-t border-[#F0EBE0]">
                            <span className="text-[10px] font-semibold text-[#8F816B] uppercase">
                              Pack Size:
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {product.weightOptions.map((v) => (
                                <button
                                  key={v.id}
                                  type="button"
                                  onClick={() => handleSelectWeight(product.id, v.weight)}
                                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all ${
                                    v.weight === selectedWeight
                                      ? 'border-[#173D2A] bg-[#173D2A] text-[#F9F7F2]'
                                      : 'border-[#DCD4C0] bg-[#F9F7F2] text-[#5C5343] hover:border-[#173D2A]'
                                  }`}
                                >
                                  {v.weight}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Card Footer & Add to Cart */}
                      <div className="p-4 bg-[#FAF8F5] border-t border-[#E8E2D5] flex items-center justify-between">
                        <div>
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-base font-bold text-[#173D2A]">
                              ₹{currentVariant.price}
                            </span>
                            {currentVariant.originalPrice && currentVariant.originalPrice > currentVariant.price && (
                              <span className="text-xs text-[#8F816B] line-through">
                                ₹{currentVariant.originalPrice}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-[#736854]">
                            ({currentVariant.weight})
                          </span>
                        </div>

                        <button
                          type="button"
                          className="px-3.5 py-1.5 text-xs font-bold text-[#173D2A] bg-[#D99B26] hover:bg-[#C68A1B] rounded-xl transition-colors shadow-xs"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-12 bg-white rounded-2xl border border-[#E8E2D5] p-8">
                  <p className="text-xs text-[#736854]">No products match &ldquo;{searchQuery}&rdquo;.</p>
                </div>
              )}
            </section>

            {/* Combos Section */}
            {activeCombos.length > 0 && (
              <section className="bg-white py-12 border-t border-[#E8E2D5]">
                <div className="max-w-6xl mx-auto px-6 space-y-6">
                  <div>
                    <span className="text-xs font-bold text-[#D99B26] uppercase tracking-wider">
                      Chef Curations
                    </span>
                    <h2 className="text-2xl font-bold text-[#173D2A]">
                      Signature Spice Kits & Combos
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activeCombos.map((combo) => (
                      <div
                        key={combo.id}
                        className="bg-[#F9F7F2] rounded-2xl border border-[#E8E2D5] overflow-hidden flex flex-col justify-between"
                      >
                        <div className="p-5 space-y-3">
                          <img
                            src={combo.image}
                            alt={combo.title}
                            className="w-full h-44 object-cover rounded-xl border border-[#E8E2D5]"
                          />
                          <div>
                            <span className="text-[10px] font-bold text-[#D99B26] uppercase">
                              {combo.tag || combo.category}
                            </span>
                            <h3 className="text-base font-bold text-[#173D2A]">
                              {combo.title}
                            </h3>
                            <p className="text-xs text-[#736854] mt-1">
                              {combo.description}
                            </p>
                          </div>
                        </div>

                        <div className="p-4 bg-white border-t border-[#E8E2D5] flex items-center justify-between">
                          <div>
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-base font-bold text-[#173D2A]">₹{combo.price ?? combo.discountedPrice}</span>
                              {combo.originalPrice && combo.originalPrice > (combo.price ?? combo.discountedPrice) && (
                                <span className="text-xs text-[#8F816B] line-through">₹{combo.originalPrice}</span>
                              )}
                            </div>
                            <span className="text-[10px] text-[#736854]">Complete Bundle</span>
                          </div>

                          <button
                            type="button"
                            className="px-3.5 py-1.5 text-xs font-bold text-[#173D2A] bg-[#D99B26] hover:bg-[#C68A1B] rounded-xl transition-colors shadow-xs"
                          >
                            Buy Combo Set
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
