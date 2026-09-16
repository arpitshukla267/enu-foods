import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { 
  Plus, 
  Search, 
  Eye, 
  Pencil, 
  Copy, 
  Trash2, 
  Package, 
  ArrowUpDown,
  X,
  Loader2,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { Product, Category } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { Pagination } from '../common/Pagination';
import { EmptyState } from '../common/EmptyState';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { motion } from 'motion/react';
import * as adminProductApi from '../../lib/adminProductApi';
import { ApiError } from '../../lib/apiClient';

interface ProductsViewProps {
  categories: Category[];
  refreshToken: number;
  onProductsLoaded?: (products: Product[]) => void;
  onNewProduct: () => void;
  onEditProduct: (product: Product) => void;
  onDuplicateProduct: (id: string) => void;
  onDeleteProduct: (id: string) => void;
  onViewProduct?: (product: Product) => void;
}

export const ProductsView: React.FC<ProductsViewProps> = ({
  categories,
  refreshToken,
  onProductsLoaded,
  onNewProduct,
  onEditProduct,
  onDuplicateProduct,
  onDeleteProduct,
  onViewProduct
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc' | 'name-asc' | 'stock-asc'>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [products, setProducts] = useState<Product[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
      setCurrentPage(1);
    }, 350);
    return () => window.clearTimeout(timer);
  }, [searchQuery]);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const selectedCat = categories.find((category) => category.id === selectedCategory);
      const selectedSub = selectedCat?.subcategories?.find(
        (subcategory) => subcategory.id === selectedSubcategory,
      );

      const result = await adminProductApi.getProducts({
        page: currentPage,
        limit: pageSize,
        search: debouncedSearch,
        category: selectedCategory !== 'all' ? selectedCat?.slug || selectedCategory : undefined,
        subcategory: selectedSubcategory !== 'all' ? selectedSub?.slug || selectedSubcategory : undefined,
        status: selectedStatus !== 'all' ? selectedStatus as Product['status'] : 'all',
        sort: sortBy,
      });

      setProducts(result.products);
      setTotalItems(result.pagination.total);
      onProductsLoaded?.(result.products);
    } catch (fetchError) {
      setProducts([]);
      setTotalItems(0);
      setError(
        fetchError instanceof ApiError
          ? fetchError.message
          : fetchError instanceof Error
            ? fetchError.message
            : 'Failed to load products',
      );
    } finally {
      setIsLoading(false);
    }
  }, [
    categories,
    currentPage,
    pageSize,
    debouncedSearch,
    selectedCategory,
    selectedSubcategory,
    selectedStatus,
    sortBy,
    onProductsLoaded,
  ]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts, refreshToken]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedSubcategory('all');
    setSelectedStatus('all');
    setSortBy('newest');
    setCurrentPage(1);
  };

  const availableSubcategories = useMemo(() => {
    if (selectedCategory === 'all') {
      return categories.flatMap(c => c.subcategories || []);
    }
    const cat = categories.find(c => c.id === selectedCategory);
    return cat ? cat.subcategories || [] : [];
  }, [selectedCategory, categories]);

  const hasActiveFilters = searchQuery || selectedCategory !== 'all' || selectedSubcategory !== 'all' || selectedStatus !== 'all';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-[#E8E2D5] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold text-[#173D2A] font-serif-brand">
              Product & Spice Catalog
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-[#F4EFE6] text-[#173D2A] text-xs font-medium border border-[#E5DEC9]">
              {totalItems} Items
            </span>
          </div>
          <p className="text-xs text-[#736854] mt-0.5">
            Manage your single-origin spices, hand-crafted blends, variant weights, and inventory levels.
          </p>
        </div>

        <button
          onClick={onNewProduct}
          className="flex items-center justify-center gap-2 px-4 py-2 text-xs font-medium text-[#173D2A] bg-[#D99B26] hover:bg-[#C68A1B] rounded-xl shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Spice / Product</span>
        </button>
      </div>

      {/* Top Filter Controls */}
      <div className="bg-white p-4 rounded-xl border border-[#E8E2D5] shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          
          {/* Search */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 text-[#8F816B] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by spice name, ingredients, SKU..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-[#F9F7F2] border border-[#DCD4C0] rounded-xl text-[#1A211D] placeholder-[#8F816B] focus:outline-none focus:border-[#173D2A]"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSelectedSubcategory('all');
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-xs bg-[#F9F7F2] border border-[#DCD4C0] rounded-xl text-[#1A211D] font-medium focus:outline-none focus:border-[#173D2A]"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Subcategory Filter */}
          <div>
            <select
              value={selectedSubcategory}
              onChange={(e) => {
                setSelectedSubcategory(e.target.value);
                setCurrentPage(1);
              }}
              disabled={availableSubcategories.length === 0}
              className="w-full px-3 py-2 text-xs bg-[#F9F7F2] border border-[#DCD4C0] rounded-xl text-[#1A211D] font-medium focus:outline-none focus:border-[#173D2A] disabled:opacity-50"
            >
              <option value="all">All Subcategories</option>
              {availableSubcategories.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-xs bg-[#F9F7F2] border border-[#DCD4C0] rounded-xl text-[#1A211D] font-medium focus:outline-none focus:border-[#173D2A]"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="draft">Drafts Only</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        {/* Secondary Row: Sorting, filters & refresh */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#F0EBE0]">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-[#736854] flex items-center gap-1">
              <ArrowUpDown className="w-3 h-3 text-[#173D2A]" />
              Sort By:
            </span>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value as typeof sortBy);
                setCurrentPage(1);
              }}
              className="px-2.5 py-1 text-xs bg-white border border-[#DCD4C0] rounded-lg text-[#1A211D] font-medium focus:outline-none focus:border-[#173D2A]"
            >
              <option value="newest">Newest First</option>
              <option value="name-asc">Alphabetical (A-Z)</option>
              <option value="price-asc">Price (Low to High)</option>
              <option value="price-desc">Price (High to Low)</option>
              <option value="stock-asc">Lowest Stock First</option>
            </select>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {hasActiveFilters && (
              <>
                <span className="text-[11px] text-[#736854]">Active Filters:</span>
                {selectedCategory !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#F4EFE6] border border-[#DCD4C0] text-[11px] font-medium text-[#173D2A]">
                    Cat: {categories.find(c => c.id === selectedCategory)?.name}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedCategory('all')} />
                  </span>
                )}
                {selectedStatus !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#F4EFE6] border border-[#DCD4C0] text-[11px] font-medium text-[#173D2A]">
                    Status: {selectedStatus}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedStatus('all')} />
                  </span>
                )}
                <button
                  onClick={handleClearFilters}
                  className="text-[11px] font-medium text-[#9E382B] hover:underline"
                >
                  Clear all
                </button>
              </>
            )}

            <button
              onClick={() => fetchProducts()}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-[#173D2A] bg-white border border-[#DCD4C0] rounded-lg hover:bg-[#F4EFE6] disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-[#FDF0EE] border border-[#F5C7C1] rounded-xl p-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[#9E382B] text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={() => fetchProducts()}
            className="px-3 py-1.5 text-xs font-medium text-white bg-[#9E382B] rounded-lg"
          >
            Retry
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="bg-white rounded-xl border border-[#E8E2D5] shadow-xs p-16 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-[#173D2A] animate-spin" />
          <p className="text-sm text-[#736854]">Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No Products Matching Your Criteria"
          description="Try adjusting your search terms, changing the category filter, or reset your filters."
          actionLabel="Clear All Filters"
          onAction={handleClearFilters}
        />
      ) : (
        <div className="bg-white rounded-xl border border-[#E8E2D5] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#5C5343]">
              <thead className="bg-[#F9F7F2] text-[#736854] font-medium uppercase tracking-wider border-b border-[#E8E2D5]">
                <tr>
                  <th className="py-3.5 px-4">Product & Origin</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Subcategory</th>
                  <th className="py-3.5 px-4">Base Price</th>
                  <th className="py-3.5 px-4">Variants & Stock</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Featured</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EBE0]">
                {products.map((product) => {
                  const totalStock = product.weightOptions.reduce((sum, v) => sum + v.stock, 0);
                  const isLowStock = product.weightOptions.some(v => v.stock <= 15);

                  return (
                    <tr key={product.id} className="hover:bg-[#FDFBF7] transition-colors">
                      {/* Product Thumbnail & Name */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-[#F4EFE6] border border-[#DCD4C0] overflow-hidden shrink-0 shadow-2xs">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-medium text-sm text-[#1A211D] font-serif-brand">
                              {product.name}
                            </div>
                            <div className="text-[11px] text-[#8F816B] flex items-center gap-2 mt-0.5">
                              <span>Default: {product.defaultWeight}</span>
                              <span>,</span>
                              <span className="font-mono text-[10px]">{product.weightOptions[0]?.sku || 'SKU'}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4 font-medium text-[#173D2A]">
                        {product.categoryName}
                      </td>

                      {/* Subcategory */}
                      <td className="py-3.5 px-4 text-[#736854]">
                        {product.subcategoryName || '—'}
                      </td>

                      {/* Base Price */}
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-[#1A211D] text-sm">
                          ₹{product.price}
                        </div>
                        {product.originalPrice > product.price && (
                          <div className="text-[11px] text-[#8F816B] line-through">
                            ₹{product.originalPrice}
                          </div>
                        )}
                      </td>

                      {/* Variants & Stock */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className={`font-medium ${isLowStock ? 'text-[#9E382B]' : 'text-[#173D2A]'}`}>
                            {totalStock} units
                          </span>
                          {isLowStock && (
                            <span className="px-1.5 py-0.2 rounded bg-[#FDF0EE] text-[#9E382B] text-[10px] font-medium border border-[#F5C7C1]">
                              Low
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-[#8F816B] mt-0.5">
                          {product.weightOptions.length} weight option{product.weightOptions.length > 1 ? 's' : ''} ({product.weightOptions.map(v => v.weight).join(', ')})
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <StatusBadge status={product.status} type="product" size="sm" />
                      </td>

                      {/* Featured */}
                      <td className="py-3.5 px-4">
                        {product.isFeatured ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#FBF5E6] text-[#966710] border border-[#F2DEB0] rounded-full text-[11px] font-medium">
                            Featured
                          </span>
                        ) : (
                          <span className="text-[#A39988] text-xs">—</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {onViewProduct && (
                            <button
                              onClick={() => onViewProduct(product)}
                              className="p-1.5 rounded-lg text-[#5C5343] hover:text-[#173D2A] hover:bg-[#F4EFE6] transition-colors"
                              title="Preview product"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => onEditProduct(product)}
                            className="p-1.5 rounded-lg text-[#173D2A] hover:bg-[#F4EFE6] transition-colors"
                            title="Edit product"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDuplicateProduct(product.id)}
                            className="p-1.5 rounded-lg text-[#5C5343] hover:text-[#173D2A] hover:bg-[#F4EFE6] transition-colors"
                            title="Duplicate product"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeletingProduct(product)}
                            className="p-1.5 rounded-lg text-[#9E382B] hover:bg-[#FDF0EE] transition-colors"
                            title="Delete product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-3 border-t border-[#E8E2D5] bg-[#F9F7F2]">
            <Pagination
              currentPage={currentPage}
              totalItems={totalItems}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={(newSize) => {
                setPageSize(newSize);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deletingProduct}
        title="Delete Spice Product?"
        message={`Are you sure you want to remove "${deletingProduct?.name}" from the product catalog? This action will remove all pricing variants and cannot be easily undone.`}
        confirmLabel="Delete Product"
        cancelLabel="Keep Product"
        isDestructive={true}
        onConfirm={() => {
          if (deletingProduct) {
            onDeleteProduct(deletingProduct.id);
            setDeletingProduct(null);
          }
        }}
        onCancel={() => setDeletingProduct(null)}
      />
    </motion.div>
  );
};
