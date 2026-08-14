import React, { useState } from 'react';
import { Product } from '../../types';
import { X, Flame, CheckCircle2, Eye, Sparkles, ShieldCheck, ShoppingBag, Check } from 'lucide-react';

interface ProductQuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onViewFullDetails: (product: Product) => void;
  onAddToCart?: (product: Product, weight?: string, qty?: number) => void;
}

export const ProductQuickViewModal: React.FC<ProductQuickViewModalProps> = ({ 
  product, 
  onClose,
  onViewFullDetails,
  onAddToCart
}) => {
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const handleAdd = () => {
    if (onAddToCart) {
      onAddToCart(product);
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn text-left">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-[#D6A146]/30 relative max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-[#284C38] text-gray-700 hover:text-white transition-colors shadow-md"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
          
          <div className="flex flex-col sm:flex-row gap-6 items-center">
            {/* Image */}
            <div className="w-full sm:w-48 h-48 rounded-2xl bg-[#1E3A2B] overflow-hidden shrink-0 border border-[#D6A146]/30 relative">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-2 left-2 bg-[#1D1D1D]/80 backdrop-blur-md text-[#D6A146] text-[10px] px-2.5 py-0.5 rounded-full font-btn font-semibold">
                {product.defaultWeight}
              </div>
            </div>

            {/* Info */}
            <div className="space-y-2 text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-[#284C38] font-btn">
                {product.category}
              </span>
              <h2 className="font-heading text-2xl font-bold text-[#1D1D1D]">
                {product.name}
              </h2>
              <p className="font-body text-xs text-gray-600 leading-relaxed font-light">
                {product.shortDescription}
              </p>

              <div className="pt-2 flex items-center gap-3 text-xs font-body">
                <div className="flex items-center gap-1 text-[#C86D39]">
                  <Flame className="w-4 h-4 fill-[#C86D39]" />
                  <span className="font-semibold">{product.spicinessLevel}/5 Heat</span>
                </div>
                <span className="text-gray-300">|</span>
                <span className="text-gray-600 font-medium">
                  Packs: {product.weightOptions.join(', ')}
                </span>
              </div>
            </div>
          </div>

          {/* Ingredients */}
          <div>
            <h3 className="font-heading text-lg font-bold text-[#1D1D1D] mb-2">
              Ingredients
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {product.ingredients.map((ing, i) => (
                <span key={i} className="text-xs bg-[#F7F5EF] text-[#284C38] px-2.5 py-1 rounded-md font-medium font-body border border-[#284C38]/10">
                  {ing}
                </span>
              ))}
            </div>
          </div>

          {/* Benefits */}
          <div>
            <h3 className="font-heading text-lg font-bold text-[#1D1D1D] mb-2">
              Key Highlights
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-body text-gray-700">
              {product.benefits.map((benefit, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#284C38] shrink-0" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Price & Action */}
          <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-heading text-2xl font-bold text-[#284C38]">₹{product.price}</span>
              <span className="text-xs text-gray-400 line-through">₹{product.originalPrice}</span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button 
                onClick={() => {
                  onClose();
                  onViewFullDetails(product);
                }}
                className="flex-1 sm:flex-initial bg-[#F7F5EF] hover:bg-[#284C38] text-gray-800 hover:text-white font-semibold text-xs py-3 px-4 rounded-xl font-btn border border-gray-200 transition-all flex items-center justify-center gap-1.5"
              >
                <Eye className="w-4 h-4 text-[#D6A146]" />
                <span>Specs Page</span>
              </button>

              <button 
                onClick={handleAdd}
                className="flex-1 sm:flex-initial bg-[#284C38] hover:bg-[#1E3A2B] text-white font-bold text-xs py-3 px-5 rounded-xl font-btn shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4 text-[#D6A146]" />
                    <span>Added To Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 text-[#D6A146]" />
                    <span>ADD TO CART</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
