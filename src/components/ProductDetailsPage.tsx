import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Product } from '../types';
import { PRODUCTS } from '../data/mockData';
import { ArrowLeft, Flame, CheckCircle2, Sparkles, Package, Leaf, ShoppingBag, Check, Plus } from 'lucide-react';

interface ProductDetailsPageProps {
  product: Product;
  onBack?: () => void;
  onSelectProduct?: (product: Product) => void;
  onAddToCart?: (product: Product, weight?: string, qty?: number) => void;
}

export const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({ 
  product, 
  onBack,
  onAddToCart
}) => {
  const router = useRouter();
  const [activeImage, setActiveImage] = useState<string>(product.image);
  const [selectedWeight, setSelectedWeight] = useState<string>(product.defaultWeight);
  const [addedNotice, setAddedNotice] = useState(false);
  const [addedMap, setAddedMap] = useState<{ [key: string]: boolean }>({});
  
  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product);
      setAddedMap((prev) => ({ ...prev, [product.id]: true }));
      setTimeout(() => {
        setAddedMap((prev) => ({ ...prev, [product.id]: false }));
      }, 1500);
    }
  };
  // Sync activeImage if product changes
  React.useEffect(() => {
    setActiveImage(product.image);
    setSelectedWeight(product.defaultWeight);
  }, [product.id, product.image, product.defaultWeight]);

  const images = [product.image, ...(product.secondaryImages || [])];

  // Find related products in same category or featured
  const relatedProducts = PRODUCTS.filter(p => p.id !== product.id && (p.category === product.category || p.isFeatured)).slice(0, 3);

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product, selectedWeight, 1);
      setAddedNotice(true);
      setTimeout(() => setAddedNotice(false), 2000);
    }
  };

  const handleBackClick = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <div className="pt-36 sm:pt-36 pb-20 bg-[#F7F5EF] min-h-screen text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={handleBackClick}
          className="inline-flex items-center gap-2 text-[#284C38] hover:text-[#D6A146] font-semibold text-sm font-btn mb-6 transition-colors group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Spices Range</span>
        </button>

        {/* Main Product Showcase Card */}
        <div className="bg-white rounded-3xl border border-[#D6A146]/20 shadow-xl overflow-hidden p-4 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start mb-16">
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-6 space-y-4">
            {/* Active Image Stage */}
            <div className="relative rounded-2xl overflow-hidden h-[360px] sm:h-[460px] border border-[#D6A146]/30 flex items-center justify-center">
              <img
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-cover rounded-xl transition-all duration-300"
                referrerPolicy="no-referrer"
              />

              {/* Natural Seal Badge */}
              <div className="absolute top-4 left-4 bg-[#1D1D1D]/80 backdrop-blur-md text-[#D6A146] text-xs px-3.5 py-1.5 rounded-full font-btn font-semibold flex items-center gap-1.5 border border-[#D6A146]/40">
                <Sparkles className="w-3.5 h-3.5 text-[#D6A146]" />
                <span>Cold Milled Formula</span>
              </div>
            </div>

            {/* Thumbnail selector */}
            {images.length > 1 && (
              <div className="flex items-center gap-3">
                {images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(imgUrl)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      activeImage === imgUrl
                        ? "border-[#D6A146] ring-2 ring-[#D6A146]/20"
                        : "border-gray-200 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt=""
                      className="w-full h-full object-cover rounded-lg"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Quick Storage Note Box */}
            <div className="bg-[#EFECE1] rounded-2xl p-4 border border-[#D6A146]/20 flex items-start gap-3 text-xs text-gray-700 font-body">
              <Package className="w-5 h-5 text-[#284C38] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#284C38] font-semibold block mb-0.5">
                  Storage Instruction:
                </strong>
                {product.storageInstructions}
              </div>
            </div>
          </div>

          {/* Right Column: Details & Specs */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#284C38]/10 text-[#284C38] text-xs font-semibold rounded-full uppercase tracking-wider font-btn mb-2">
                <Leaf className="w-3.5 h-3.5 text-[#D6A146]" />
                <span>{product.category}</span>
              </div>

              <h1 className="font-heading text-3xl sm:text-4xl font-bold text-[#1D1D1D] break-words max-w-full">
                {product.name}
              </h1>

              {/* Price Banner */}
              <div className="flex items-center gap-3 mt-3">
                <span className="font-heading text-2xl font-bold text-[#284C38]">
                  ₹{product.price}
                </span>
                <span className="text-sm text-gray-400 line-through">
                  ₹{product.originalPrice}
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full font-btn">
                  15% OFF
                </span>
              </div>

              <p className="font-body text-gray-600 mt-3 text-sm font-light leading-relaxed">
                {product.fullDescription}
              </p>
            </div>

            {/* Weight Option Selector */}
            <div className="pt-2 border-t border-gray-100">
              <div className="text-xs font-bold uppercase tracking-wider text-[#1D1D1D] font-btn mb-2.5">
                Available Pack Sizes:
              </div>
              <div className="flex flex-wrap gap-2.5">
                {product.weightOptions.map((weight) => (
                  <button
                    key={weight}
                    onClick={() => setSelectedWeight(weight)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-semibold font-btn transition-all border ${
                      selectedWeight === weight
                        ? "bg-[#284C38] text-[#D6A146] border-[#D6A146] shadow-md"
                        : "bg-[#F7F5EF] text-gray-700 border-gray-200 hover:border-[#284C38]"
                    }`}
                  >
                    {weight} Pouch
                  </button>
                ))}
              </div>
            </div>

            {/* Add to Cart CTA */}
            <div className="pt-2">
              <button
                onClick={handleAddToCart}
                className="w-full bg-[#284C38] hover:bg-[#1E3A2B] text-white font-bold text-sm sm:text-base py-4 rounded-2xl font-btn shadow-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
              >
                {addedNotice ? (
                  <>
                    <Check className="w-5 h-5 text-[#D6A146]" />
                    <span>Added To Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5 text-[#D6A146]" />
                    <span>ADD TO CART • ₹{product.price}</span>
                  </>
                )}
              </button>
            </div>

            {/* Aroma Profile & Spiciness meter */}
            <div className="bg-[#F7F5EF] p-4 rounded-2xl border border-[#D6A146]/20 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#C86D39] font-btn block mb-1">
                  Aroma Profile:
                </span>
                <span className="text-xs text-gray-700 font-body leading-tight block">
                  {product.aromaProfile}
                </span>
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#C86D39] font-btn block mb-1">
                  Heat Scale:
                </span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((lvl) => (
                    <Flame
                      key={lvl}
                      className={`w-4 h-4 ${
                        lvl <= product.spicinessLevel
                          ? "text-[#C86D39] fill-[#C86D39]"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="text-xs text-gray-600 font-body ml-2 font-medium">
                    {product.spicinessLevel}/5
                  </span>
                </div>
              </div>
            </div>

            {/* Ingredients List */}
            <div className="space-y-2">
              <h3 className="font-heading text-xl font-bold text-[#1D1D1D]">
                Ingredients
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.ingredients.map((ing, i) => (
                  <span
                    key={i}
                    className="text-xs bg-[#284C38]/10 text-[#284C38] px-3 py-1.5 rounded-lg font-medium font-body border border-[#284C38]/20"
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>

            {/* Key Benefits */}
            <div className="space-y-2">
              <h3 className="font-heading text-xl font-bold text-[#1D1D1D]">
                Why You'll Love It
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
          </div>
        </div>

        {/* Related Products Carousel */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#1D1D1D] mb-6 sm:mb-8">
              Explore Related Spice Blends
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
              {relatedProducts.map((rel) => {
                const discount =
                  rel.originalPrice > rel.price
                    ? Math.round((1 - rel.price / rel.originalPrice) * 100)
                    : 0;

                return (
                  <Link
                    key={rel.id}
                    href={`/products/${rel.id}`}
                    className="bg-white rounded-2xl overflow-visible border border-[#D6A146]/20 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group block transform hover:-translate-y-1"
                  >
                    {/* Image */}
                    <div className="relative">
                      <div className="relative aspect-square bg-[#1E3A2B] overflow-hidden rounded-t-2xl">
                        <img
                          src={rel.image}
                          alt={rel.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />

                        {rel.isFeatured && (
                          <div className="absolute top-2 left-2 bg-[#D6A146] text-[#1E3A2B] text-[9px] px-2 py-0.5 rounded-full font-btn font-bold uppercase tracking-wide">
                            Bestseller
                          </div>
                        )}

                        {/* {discount > 0 && (
                          <div className="absolute top-2 right-2 bg-[#C86D39] text-white text-[9px] px-2 py-0.5 rounded-full font-btn font-bold flex items-center gap-0.5">
                            <Percent className="w-2.5 h-2.5" />
                            {discount} OFF
                          </div>
                        )} */}
                      </div>

                      {/* Floating quick-add button */}
                      <button
                        onClick={(e) => handleQuickAdd(rel, e)}
                        aria-label={
                          addedMap[rel.id] ? "Added to cart" : "Add to cart"
                        }
                        className={`absolute -bottom-4 right-2.5 w-9 h-9 rounded-full shadow-lg border-2 flex items-center justify-center cursor-pointer transition-all duration-300 z-10 ${
                          addedMap[rel.id]
                            ? "bg-[#284C38] border-[#284C38]"
                            : "bg-white border-[#284C38] hover:bg-[#284C38]"
                        }`}
                      >
                        {addedMap[rel.id] ? (
                          <Check className="w-4 h-4 text-[#D6A146]" />
                        ) : (
                          <Plus
                            className="w-4 h-4 text-[#284C38] hover:!text-[#D6A146]"
                            strokeWidth={2.5}
                          />
                        )}
                      </button>
                    </div>

                    {/* Content */}
                    <div className="p-3 pt-5 flex-1 flex flex-col justify-between">
                      <div>
                        <span className="text-[9px] text-[#284C38] uppercase font-btn font-bold tracking-wider">
                          {rel.category}
                        </span>
                        <h3 className="font-heading text-sm font-bold text-[#1D1D1D] group-hover:text-[#284C38] transition-colors mt-0.5 break-words line-clamp-2 leading-snug">
                          {rel.name}
                        </h3>
                      </div>

                      <div className="mt-2 pt-2 border-t border-gray-100 flex items-baseline gap-1.5 flex-wrap">
                        <span className="font-bold text-[#284C38] text-sm">
                          ₹{rel.price}
                        </span>
                        {rel.originalPrice > rel.price && (
                          <span className="text-gray-400 line-through text-[10px] font-normal">
                            ₹{rel.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

