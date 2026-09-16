import React, { useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Product } from '../../types';
import { ArrowLeft, Flame, CheckCircle2, Sparkles, Package, Leaf, ShoppingBag, Check, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useProductBatch } from '../../hooks/useProductBatch';
import { getVariantDiscountPercent, getVariantPricing, getProductWeightVariants, isVariantInStock, getPreferredWeight } from '../../lib/productPricing';
import { OutOfStockBadge } from '../ui/OutOfStockBadge';

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
  const [selectedWeight, setSelectedWeight] = useState<string>(() => getPreferredWeight(product));
  const [addedNotice, setAddedNotice] = useState(false);
  const [addedMap, setAddedMap] = useState<{ [key: string]: boolean }>({});
  const thumbScrollRef = useRef(null);
  const images = [product.image, ...(product.secondaryImages || [])];

  const scrollThumbs = (direction: number) => {
    if (thumbScrollRef.current) {
      thumbScrollRef.current.scrollBy({ top: direction * 70, behavior: "smooth" });
    }
  };

  const touchStartX = useRef<number | null>(null);

const currentIndex = images.indexOf(activeImage);

const goToNextImage = () => {
  const nextIdx = (currentIndex + 1) % images.length;
  setActiveImage(images[nextIdx]);
};

const goToPrevImage = () => {
  const prevIdx = (currentIndex - 1 + images.length) % images.length;
  setActiveImage(images[prevIdx]);
};

const handleTouchStart = (e: React.TouchEvent) => {
  touchStartX.current = e.touches[0].clientX;
};

const handleTouchEnd = (e: React.TouchEvent) => {
  if (touchStartX.current === null) return;
  const touchEndX = e.changedTouches[0].clientX;
  const diff = touchStartX.current - touchEndX;

  if (Math.abs(diff) > 50) {
    if (diff > 0) goToNextImage();
    else goToPrevImage();
  }
  touchStartX.current = null;
};

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
    setSelectedWeight(getPreferredWeight(product));
  }, [product.id, product.image, product.defaultWeight, product.weightVariants]);


  const { products: categoryProducts } = useProductBatch(
    {
      category: product.categorySlug || undefined,
      limit: 4,
      sort: "newest",
    },
    Boolean(product.categorySlug),
  );

  const relatedProducts = useMemo(
    () => categoryProducts.filter((item) => item.id !== product.id).slice(0, 3),
    [categoryProducts, product.id],
  );

  const { price: displayPrice, originalPrice: displayOriginalPrice } = useMemo(
    () => getVariantPricing(product, selectedWeight),
    [product, selectedWeight],
  );

  const discount = getVariantDiscountPercent(product, selectedWeight);
  const selectedInStock = isVariantInStock(product, selectedWeight);

  const handleAddToCart = () => {
    if (!selectedInStock || !onAddToCart) {
      return;
    }

    onAddToCart(product, selectedWeight, 1);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2000);
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
        <div className="bg-white border border-gray-200 grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 sm:p-6 mb-8 font-sans">
{/* Left Column: Image Gallery */}
<div className="lg:col-span-5 flex gap-3">

  {/* Desktop: vertical thumbnail column — hidden on mobile */}
  {images.length > 1 && (
    <div className="hidden lg:flex relative flex-col items-center">
      <div
        ref={thumbScrollRef}
        className="flex flex-col gap-2 overflow-y-auto max-h-[380px] sm:max-h-[420px] scrollbar-hide scroll-smooth"
      >
        {images.map((imgUrl, idx) => (
          <button
            key={idx}
            onClick={() => setActiveImage(imgUrl)}
            className={`w-14 h-14 shrink-0 border overflow-hidden ${
              activeImage === imgUrl
                ? "border-[#284C38]"
                : "border-gray-200 opacity-70 hover:opacity-100"
            }`}
          >
            <img src={imgUrl} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </button>
        ))}
      </div>
    </div>
  )}

  <div className="flex-1">
    {/* Main image with swipe + arrows for mobile, static for desktop */}
    <div
      className="relative border border-gray-100 h-[320px] sm:h-[420px] flex items-center justify-center bg-[#F7F5EF] overflow-hidden touch-pan-y"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <img
        src={activeImage}
        alt={product.name}
        className="w-full h-full object-cover"
        referrerPolicy="no-referrer"
      />

      {/* Mobile-only arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={goToPrevImage}
            className="lg:hidden absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 border border-gray-200 flex items-center justify-center shadow-sm active:scale-95"
          >
            <ChevronLeft className="w-4 h-4 text-[#284C38]" />
          </button>
          <button
            onClick={goToNextImage}
            className="lg:hidden absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 border border-gray-200 flex items-center justify-center shadow-sm active:scale-95"
          >
            <ChevronRight className="w-4 h-4 text-[#284C38]" />
          </button>
        </>
      )}
    </div>

    {/* Mobile-only dots */}
    {images.length > 1 && (
      <div className="lg:hidden flex justify-center gap-1.5 mt-3">
        {images.map((imgUrl, idx) => (
          <button
            key={idx}
            onClick={() => setActiveImage(imgUrl)}
            className={`h-1.5 rounded-full transition-all ${
              activeImage === imgUrl ? "w-5 bg-[#284C38]" : "w-1.5 bg-gray-300"
            }`}
          />
        ))}
      </div>
    )}

    <div className="mt-4 flex gap-3">
      <button
        onClick={handleAddToCart}
        disabled={!selectedInStock}
        className={`flex-1 py-3.5 text-sm font-medium flex items-center justify-center gap-2 border transition-colors ${
          selectedInStock
            ? "bg-white border-[#D6A146] text-[#284C38] hover:bg-[#D6A146]/10"
            : "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
        }`}
      >
        <ShoppingBag className="w-4 h-4" />
        {addedNotice ? "ADDED" : "ADD TO CART"}
      </button>
      <button
        disabled={!selectedInStock}
        className={`flex-1 py-3.5 text-sm font-medium text-white transition-colors ${
          selectedInStock ? "bg-[#284C38] hover:bg-[#1E3A2B]" : "bg-gray-300 cursor-not-allowed"
        }`}
      >
        BUY NOW
      </button>
    </div>

    <div className="mt-3 flex items-start gap-2 text-xs text-gray-600">
      <Package className="w-4 h-4 text-[#284C38] shrink-0 mt-0.5" />
      <span><span className="font-medium text-gray-800">Storage: </span>{product.storageInstructions}</span>
    </div>
  </div>
</div>

  {/* Right Column */}
  <div className="lg:col-span-7 space-y-3">
    <div className="text-xs text-[#C86D39] font-medium uppercase tracking-wide">{product.category}</div>

    <h1 className="text-lg sm:text-xl text-[#1D1D1D] leading-snug font-semibold">
      {product.name}
    </h1>

    {/* Rating badge — brand green, only if you have a rating value */}
    {/* <span className="inline-flex items-center gap-1 bg-[#284C38] text-white text-xs font-medium px-1.5 py-0.5 rounded-sm">
      4.3 <Star className="w-3 h-3 fill-white" />
    </span> */}

    {/* Price block */}
    <div className="pt-1">
      <div className="flex items-baseline gap-2.5">
        <span className="text-2xl font-semibold text-[#1D1D1D]">₹{displayPrice}</span>
        {displayOriginalPrice > displayPrice && (
          <span className="text-sm text-[#878787] line-through">₹{displayOriginalPrice}</span>
        )}
        {discount > 0 && (
          <span className="text-sm font-medium text-emerald-700">{discount}% off</span>
        )}
      </div>
      <p className="text-xs text-gray-500 mt-1">Inclusive of all taxes</p>
    </div>

    <p className="text-sm text-[#1D1D1D] leading-relaxed pt-2 border-t border-gray-100 mt-2">
      {product.fullDescription}
    </p>

    {/* Pack size selector */}
    <div className="pt-3">
      <div className="text-sm font-medium text-[#1D1D1D] mb-2">Pack Size</div>
      <div className="flex flex-wrap gap-2">
        {getProductWeightVariants(product).map((variant) => {
          const variantInStock = isVariantInStock(product, variant.weight);
          return (
            <button
              key={variant.weight}
              onClick={() => setSelectedWeight(variant.weight)}
              className={`px-3 py-2 text-xs border rounded-sm ${
                selectedWeight === variant.weight
                  ? variantInStock
                    ? "border-[#284C38] text-[#284C38] bg-[#284C38]/10"
                    : "border-red-300 text-red-600 bg-red-50"
                  : variantInStock
                    ? "border-gray-300 text-gray-700 hover:border-[#284C38]"
                    : "border-gray-200 text-gray-400"
              }`}
            >
              <span className={variantInStock ? "" : "line-through"}>{variant.weight}</span>
              <span className="ml-1 text-gray-500">· ₹{variant.price}</span>
              {!variantInStock && <span className="block text-[10px] text-red-600">Out of stock</span>}
            </button>
          );
        })}
      </div>
      {!selectedInStock && <OutOfStockBadge className="mt-2" />}
    </div>

    {/* Highlights */}
    <div className="pt-4">
      <div className="text-base font-semibold text-[#1D1D1D] mb-2">Why You'll Love It</div>
      <ul className="list-disc list-inside space-y-1 text-sm text-[#1D1D1D] marker:text-[#D6A146]">
        {product.benefits.map((benefit, i) => (
          <li key={i}>{benefit}</li>
        ))}
      </ul>
    </div>

    {/* Specifications table */}
    <div className="pt-4">
      <div className="text-base font-semibold text-[#1D1D1D] mb-2">Specifications</div>
      <table className="w-full text-sm">
        <tbody>
          <tr className="border-b border-gray-100">
            <td className="py-2 text-gray-500 w-1/3 align-top">Ingredients</td>
            <td className="py-2 text-[#1D1D1D]">{product.ingredients.join(", ")}</td>
          </tr>
          <tr className="border-b border-gray-100">
            <td className="py-2 text-gray-500 align-top">Aroma Profile</td>
            <td className="py-2 text-[#1D1D1D]">{product.aromaProfile}</td>
          </tr>
          <tr>
            <td className="py-2 text-gray-500 align-top">Heat Scale</td>
            <td className="py-2 text-[#1D1D1D] flex items-center gap-1 mt-1">
              {[1, 2, 3, 4, 5].map((lvl) => (
                <Flame
                  key={lvl}
                  className={`w-3.5 h-3.5 ${
                    lvl <= product.spicinessLevel ? "text-[#C86D39] fill-[#C86D39]" : "text-gray-300"
                  }`}
                />
              ))}
              <span className="ml-1 text-xs text-gray-500">{product.spicinessLevel}/5</span>
            </td>
          </tr>
        </tbody>
      </table>
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
                    href={`/products/${rel.slug || rel.id}`}
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

