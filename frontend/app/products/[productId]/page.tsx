"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ProductDetailsPage } from "@/src/components/pages/ProductDetailsPage";
import { Search, ArrowLeft, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { Product } from "@/src/types";
import { fetchProductBySlug, ProductApiError } from "@/src/lib/productApi";

interface ProductPageProps {
  params?: { productId?: string };
  onAddToCart?: (product: Product, weight?: string, qty?: number) => void;
}

export default function ProductDetailPageWrapper({
  params,
  onAddToCart,
}: ProductPageProps) {
  const routeParams = useParams<{ productId: string }>();
  const slug = params?.productId || routeParams?.productId;

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProduct = async () => {
    if (!slug) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchProductBySlug(slug);
      setProduct(data);
    } catch (fetchError) {
      setProduct(null);
      setError(
        fetchError instanceof ProductApiError
          ? fetchError.message
          : fetchError instanceof Error
            ? fetchError.message
            : "Failed to load product",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProduct();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="pt-32 pb-20 bg-[#F7F5EF] min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2 text-[#284C38]">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="font-body text-sm">Loading product details...</span>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="pt-32 pb-20 bg-[#F7F5EF] min-h-screen flex items-center justify-center px-4 text-center">
        <div className="bg-white rounded-3xl p-10 max-w-md w-full border border-[#D6A146]/30 shadow-xl space-y-5">
          <div className="w-16 h-16 rounded-full bg-[#1E3A2B]/10 text-[#284C38] flex items-center justify-center mx-auto">
            {error ? (
              <AlertCircle className="w-8 h-8 text-[#284C38]" />
            ) : (
              <Search className="w-8 h-8 text-[#284C38]" />
            )}
          </div>
          <h1 className="font-heading text-2xl font-bold text-[#1D1D1D]">
            Product Not Found
          </h1>
          <p className="font-body text-sm text-gray-600 font-light leading-relaxed">
            {error || `We couldn't find a spice matching "${slug}".`}
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={loadProduct}
              className="inline-flex items-center gap-2 bg-white border border-[#D6A146]/40 text-[#284C38] font-bold text-xs py-3 px-5 rounded-xl font-btn"
            >
              <RefreshCw className="w-4 h-4" />
              Retry
            </button>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-[#284C38] hover:bg-[#1E3A2B] text-white font-bold text-xs py-3 px-6 rounded-xl font-btn shadow-md transition-all"
            >
              <ArrowLeft className="w-4 h-4 text-[#D6A146]" />
              <span>Browse All Spices</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <ProductDetailsPage product={product} onAddToCart={onAddToCart} />;
}
