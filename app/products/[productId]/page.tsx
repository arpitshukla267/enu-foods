"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { PRODUCTS } from '@/src/data/mockData';
import { ProductDetailsPage } from '@/src/components/pages/ProductDetailsPage';
import { Search, ArrowLeft } from 'lucide-react';
import { Product } from '@/src/types';

interface ProductPageProps {
  params?: { productId?: string };
  onAddToCart?: (product: Product, weight?: string, qty?: number) => void;
}

export default function ProductDetailPageWrapper({ params, onAddToCart }: ProductPageProps) {
  const router = useRouter();
  const routeParams = useParams<{ productId: string }>();
  const productId = params?.productId || routeParams?.productId;

  const product = PRODUCTS.find((item) => item.id === productId);

  if (!product) {
    return (
      <div className="pt-32 pb-20 bg-[#F7F5EF] min-h-screen flex items-center justify-center px-4 text-center">
        <div className="bg-white rounded-3xl p-10 max-w-md w-full border border-[#D6A146]/30 shadow-xl space-y-5">
          <div className="w-16 h-16 rounded-full bg-[#1E3A2B]/10 text-[#284C38] flex items-center justify-center mx-auto">
            <Search className="w-8 h-8 text-[#284C38]" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-[#1D1D1D]">
            Product Not Found
          </h1>
          <p className="font-body text-sm text-gray-600 font-light leading-relaxed">
            We couldn't find a spice matching <code className="text-[#C86D39] font-medium">"{productId}"</code>. It may have been renamed or moved.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-[#284C38] hover:bg-[#1E3A2B] text-white font-bold text-xs py-3 px-6 rounded-xl font-btn shadow-md transition-all"
          >
            <ArrowLeft className="w-4 h-4 text-[#D6A146]" />
            <span>Browse All Spices</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <ProductDetailsPage
      product={product}
      onAddToCart={onAddToCart}
    />
  );
}
