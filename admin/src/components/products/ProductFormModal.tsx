import React, { useEffect, useRef, useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  Image as ImageIcon,
  Check,
  UploadCloud,
  Layers,
  Flame,
  FileText,
  Tag,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { Product, Category, ProductStatus, ProductWeightVariant } from '../../types';
import { ProductVariantEditor } from './ProductVariantEditor';
import { SpicinessRating } from '../common/SpicinessRating';
import { motion, AnimatePresence } from 'motion/react';
import { uploadProductImage } from '../../lib/uploadApi';
import { generateVariantSku, normalizeWeightLabel } from '../../lib/productSku';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'> & {
    isBestSeller?: boolean;
    isNewArrival?: boolean;
  }) => void;
  productToEdit?: Product | null;
  categories: Category[];
}

const IMAGE_PRESETS = [
  { name: 'Garam Masala Bowl', url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80' },
  { name: 'Lakadong Turmeric', url: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80' },
  { name: 'Kashmiri Chilli', url: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=600&q=80' },
  { name: 'Kasuri Methi', url: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=600&q=80' },
];

const fieldClass = (hasError: boolean, base = '') =>
  `${base} border rounded-xl transition-colors focus:outline-none ${
    hasError
      ? 'border-[#9E382B] ring-2 ring-[#9E382B]/20 bg-[#FDF0EE]/50'
      : 'border-[#DCD4C0] bg-white focus:border-[#173D2A]'
  }`;

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  productToEdit,
  categories,
}) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [subcategoryId, setSubcategoryId] = useState('');
  const [status, setStatus] = useState<ProductStatus>('active');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(false);
  const [shortDescription, setShortDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [image, setImage] = useState('');
  const [secondaryImages, setSecondaryImages] = useState<string[]>([]);
  const [newSecondaryUrl, setNewSecondaryUrl] = useState('');
  const [isUploadingPrimary, setIsUploadingPrimary] = useState(false);
  const [isUploadingSecondary, setIsUploadingSecondary] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [variants, setVariants] = useState<ProductWeightVariant[]>([]);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [newIngredient, setNewIngredient] = useState('');
  const [benefits, setBenefits] = useState<string[]>([]);
  const [newBenefit, setNewBenefit] = useState('');
  const [bestFor, setBestFor] = useState<string[]>([]);
  const [newBestFor, setNewBestFor] = useState('');
  const [storageInstructions, setStorageInstructions] = useState('');
  const [aromaProfile, setAromaProfile] = useState('');
  const [spicinessLevel, setSpicinessLevel] = useState<number>(3);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isOpen) return;

    if (productToEdit) {
      setName(productToEdit.name);
      setSlug(productToEdit.slug);
      setCategoryId(productToEdit.categoryId);
      setSubcategoryId(productToEdit.subcategoryId || '');
      setStatus(productToEdit.status);
      setIsFeatured(productToEdit.isFeatured);
      setIsBestSeller(productToEdit.isBestSeller ?? false);
      setIsNewArrival(productToEdit.isNewArrival ?? false);
      setShortDescription(productToEdit.shortDescription);
      setFullDescription(productToEdit.fullDescription);
      setImage(productToEdit.image);
      setSecondaryImages(productToEdit.secondaryImages || []);
      setVariants(productToEdit.weightOptions || []);
      setIngredients(productToEdit.ingredients || []);
      setBenefits(productToEdit.benefits || []);
      setBestFor(productToEdit.bestFor || []);
      setStorageInstructions(productToEdit.storageInstructions || '');
      setAromaProfile(productToEdit.aromaProfile || '');
      setSpicinessLevel(productToEdit.spicinessLevel || 3);
    } else {
      setName('');
      setSlug('');
      setCategoryId(categories[0]?.id || '');
      setSubcategoryId(categories[0]?.subcategories?.[0]?.id || '');
      setStatus('active');
      setIsFeatured(false);
      setIsBestSeller(false);
      setIsNewArrival(false);
      setShortDescription('');
      setFullDescription('');
      setImage('');
      setSecondaryImages([]);
      setVariants([
        {
          id: `var-${Date.now()}-1`,
          weight: '100g',
          price: 180,
          originalPrice: 220,
          stock: 40,
          sku: generateVariantSku('', '100g'),
          isDefault: true,
        },
      ]);
      setIngredients(['Coriander', 'Cumin', 'Black Cardamom']);
      setBenefits(['Cold-ground below 38°C', '100% natural, no synthetic dyes']);
      setBestFor(['Homestyle Indian curries']);
      setStorageInstructions('Store in an airtight container in a cool, dry place.');
      setAromaProfile('Rich roasted spice notes with aromatic sweetness.');
      setSpicinessLevel(3);
    }

    setNewIngredient('');
    setNewBenefit('');
    setNewBestFor('');
    setNewSecondaryUrl('');
    setErrors({});
    setUploadError(null);
  }, [productToEdit, isOpen, categories]);

  useEffect(() => {
    if (!isOpen || productToEdit || !name.trim()) {
      return;
    }

    setVariants((current) =>
      current.map((variant) => ({
        ...variant,
        sku: generateVariantSku(name, variant.weight),
      })),
    );
  }, [isOpen, name, productToEdit]);

  if (!isOpen) return null;

  const currentCategory = categories.find((category) => category.id === categoryId);
  const availableSubcategories = currentCategory?.subcategories || [];
  const errorEntries = Object.entries(errors);

  const clearError = (field: string) => {
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const handleNameChange = (value: string) => {
    setName(value);
    clearError('name');
    if (!productToEdit) {
      setSlug(value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
      clearError('slug');
    }
  };

  const handleCategoryChange = (newCategoryId: string) => {
    setCategoryId(newCategoryId);
    clearError('categoryId');
    const category = categories.find((entry) => entry.id === newCategoryId);
    if (category?.subcategories?.length) {
      setSubcategoryId(category.subcategories[0].id);
    } else {
      setSubcategoryId('');
    }
  };

  const handlePrimaryImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setIsUploadingPrimary(true);

    try {
      const uploaded = await uploadProductImage(file);
      setImage(uploaded.url);
      clearError('image');
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Primary image upload failed');
    } finally {
      setIsUploadingPrimary(false);
      event.target.value = '';
    }
  };

  const handleSecondaryImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setIsUploadingSecondary(true);

    try {
      const uploaded = await uploadProductImage(file);
      setSecondaryImages((current) => [...current, uploaded.url]);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Secondary image upload failed');
    } finally {
      setIsUploadingSecondary(false);
      event.target.value = '';
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Product name is required';
    if (!slug.trim()) newErrors.slug = 'Product slug is required';
    if (!categoryId) newErrors.categoryId = 'Please select a category';
    if (!image.trim()) newErrors.image = 'Primary product image is required';
    if (!variants.length) {
      newErrors.variants = 'At least one weight variant is required';
    } else {
      const normalizedWeights = variants.map((variant) => normalizeWeightLabel(variant.weight));
      if (new Set(normalizedWeights).size !== normalizedWeights.length) {
        newErrors.variants = 'Each weight variant must be unique';
      }

      const skus = variants.map((variant) => (variant.sku || '').trim().toUpperCase()).filter(Boolean);
      if (new Set(skus).size !== skus.length) {
        newErrors.variants = 'Each variant must have a unique SKU code';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      window.setTimeout(() => {
        formRef.current
          ?.querySelector('[data-error="true"]')
          ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 0);
      return;
    }

    const defaultVariant = variants.find((variant) => variant.isDefault) || variants[0];
    const category = categories.find((entry) => entry.id === categoryId);
    const subcategory = category?.subcategories?.find((entry) => entry.id === subcategoryId);

    onSave({
      name: name.trim(),
      slug: slug.trim(),
      categoryId,
      categoryName: category?.name || 'Spices',
      subcategoryId: subcategoryId || undefined,
      subcategoryName: subcategory?.name || undefined,
      weightOptions: variants,
      defaultWeight: defaultVariant.weight,
      price: defaultVariant.price,
      originalPrice: defaultVariant.originalPrice,
      shortDescription,
      fullDescription,
      image: image.trim(),
      secondaryImages,
      ingredients,
      benefits,
      storageInstructions,
      aromaProfile,
      spicinessLevel,
      isFeatured,
      isBestSeller,
      isNewArrival,
      status,
      bestFor,
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 12 }}
            className="relative w-full max-w-4xl bg-white rounded-2xl border border-[#E8E2D5] shadow-2xl flex flex-col max-h-[92vh] overflow-hidden my-auto z-10"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="px-6 py-4.5 bg-[#173D2A] text-white flex items-center justify-between shrink-0 border-b border-[#245A3F]">
              <div>
                <span className="text-[10px] font-bold tracking-widest text-[#D99B26] uppercase">
                  {productToEdit ? 'Edit Spice Record' : 'Create New Product'}
                </span>
                <h3 className="text-lg font-bold font-serif-brand text-[#F9F7F2] mt-0.5">
                  {productToEdit ? productToEdit.name : 'New Spice Formulation'}
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form ref={formRef} onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              {errorEntries.length > 0 && (
                <div className="p-4 rounded-2xl bg-[#FDF0EE] border border-[#E8C4BE] flex gap-3">
                  <AlertCircle className="w-5 h-5 text-[#9E382B] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-[#9E382B]">Please complete the required fields</p>
                    <ul className="mt-2 space-y-1">
                      {errorEntries.map(([field, message]) => (
                        <li key={field} className="text-xs text-[#9E382B]">
                          • {message}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              <section className="p-5 rounded-2xl border border-[#E8E2D5] bg-[#FAF8F5] space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-[#173D2A] uppercase tracking-wide">
                  <FileText className="w-4 h-4 text-[#D99B26]" />
                  <span>Basic Information</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div data-error={errors.name ? 'true' : undefined}>
                    <label className="block text-xs font-bold text-[#1A211D] uppercase tracking-wide">
                      Product Name <span className="text-[#9E382B]">*</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(event) => handleNameChange(event.target.value)}
                      placeholder="e.g. ENU Royal Garam Masala"
                      className={fieldClass(Boolean(errors.name), 'w-full mt-1 px-3 py-2.5 text-sm text-[#1A211D]')}
                    />
                    {errors.name && <p className="text-xs text-[#9E382B] mt-1 font-medium">{errors.name}</p>}
                  </div>

                  <div data-error={errors.slug ? 'true' : undefined}>
                    <label className="block text-xs font-bold text-[#1A211D] uppercase tracking-wide">
                      URL Slug <span className="text-[#9E382B]">*</span>
                    </label>
                    <input
                      type="text"
                      value={slug}
                      onChange={(event) => {
                        setSlug(event.target.value);
                        clearError('slug');
                      }}
                      placeholder="e.g. enu-royal-garam-masala"
                      className={fieldClass(Boolean(errors.slug), 'w-full mt-1 px-3 py-2.5 text-sm font-mono text-[#5C5343] bg-[#F9F7F2]')}
                    />
                    {errors.slug && <p className="text-xs text-[#9E382B] mt-1 font-medium">{errors.slug}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#1A211D] uppercase tracking-wide">
                      Short Catchline
                    </label>
                    <input
                      type="text"
                      value={shortDescription}
                      onChange={(event) => setShortDescription(event.target.value)}
                      placeholder="e.g. Master blend of 14 royal whole spices..."
                      className={fieldClass(false, 'w-full mt-1 px-3 py-2.5 text-sm text-[#1A211D]')}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1A211D] uppercase tracking-wide">
                      Publication Status
                    </label>
                    <select
                      value={status}
                      onChange={(event) => setStatus(event.target.value as ProductStatus)}
                      className={fieldClass(false, 'w-full mt-1 px-3 py-2.5 text-sm text-[#1A211D]')}
                    >
                      <option value="active">Active (Visible in Storefront)</option>
                      <option value="draft">Draft (Hidden in CMS)</option>
                      <option value="archived">Archived / Seasonal</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1A211D] uppercase tracking-wide">
                    Full Heritage Story
                  </label>
                  <textarea
                    rows={3}
                    value={fullDescription}
                    onChange={(event) => setFullDescription(event.target.value)}
                    placeholder="Describe harvest origins, slow roasting process, tasting notes..."
                    className={fieldClass(false, 'w-full mt-1 px-3 py-2.5 text-sm text-[#1A211D]')}
                  />
                </div>
              </section>

              <section className="p-5 rounded-2xl border border-[#E8E2D5] bg-white space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-[#173D2A] uppercase tracking-wide">
                  <Layers className="w-4 h-4 text-[#D99B26]" />
                  <span>Category & Visibility</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div data-error={errors.categoryId ? 'true' : undefined}>
                    <label className="block text-xs font-semibold text-[#5C5343]">
                      Primary Category <span className="text-[#9E382B]">*</span>
                    </label>
                    <select
                      value={categoryId}
                      onChange={(event) => handleCategoryChange(event.target.value)}
                      className={fieldClass(Boolean(errors.categoryId), 'w-full mt-1 px-3 py-2.5 text-sm text-[#1A211D]')}
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    {errors.categoryId && (
                      <p className="text-xs text-[#9E382B] mt-1 font-medium">{errors.categoryId}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#5C5343]">Subcategory</label>
                    <select
                      value={subcategoryId}
                      onChange={(event) => setSubcategoryId(event.target.value)}
                      disabled={availableSubcategories.length === 0}
                      className={`${fieldClass(false, 'w-full mt-1 px-3 py-2.5 text-sm text-[#1A211D]')} disabled:opacity-50`}
                    >
                      <option value="">Select Subcategory (Optional)</option>
                      {availableSubcategories.map((subcategory) => (
                        <option key={subcategory.id} value={subcategory.id}>
                          {subcategory.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    {
                      label: 'Featured',
                      description: 'Homepage showcase',
                      checked: isFeatured,
                      onChange: setIsFeatured,
                    },
                    {
                      label: 'Best Seller',
                      description: 'Bestseller collections',
                      checked: isBestSeller,
                      onChange: setIsBestSeller,
                    },
                    {
                      label: 'New Arrival',
                      description: 'New arrivals sections',
                      checked: isNewArrival,
                      onChange: setIsNewArrival,
                    },
                  ].map((toggle) => (
                    <label
                      key={toggle.label}
                      className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                        toggle.checked
                          ? 'border-[#173D2A] bg-[#173D2A]/5'
                          : 'border-[#E8E2D5] bg-[#FAF8F5]'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={toggle.checked}
                        onChange={(event) => toggle.onChange(event.target.checked)}
                        className="mt-0.5 accent-[#173D2A]"
                      />
                      <span>
                        <span className="block text-xs font-bold text-[#1A211D]">{toggle.label}</span>
                        <span className="block text-[11px] text-[#736854]">{toggle.description}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </section>

              <section
                data-error={errors.variants ? 'true' : undefined}
                className={`p-5 rounded-2xl border space-y-3 ${
                  errors.variants
                    ? 'border-[#9E382B] bg-[#FDF0EE]/40 ring-1 ring-[#9E382B]/20'
                    : 'border-[#E8E2D5] bg-[#F9F7F2]'
                }`}
              >
                <div className="flex items-center gap-2 text-xs font-bold text-[#173D2A] uppercase tracking-wide">
                  <Tag className="w-4 h-4 text-[#D99B26]" />
                  <span>Weights & Pricing</span>
                </div>
                <ProductVariantEditor
                  variants={variants}
                  productName={name}
                  autoGenerateSku={!productToEdit}
                  onChange={(nextVariants) => {
                    setVariants(nextVariants);
                    clearError('variants');
                  }}
                />
                {errors.variants && (
                  <p className="text-xs text-[#9E382B] font-medium">{errors.variants}</p>
                )}
              </section>

              <section
                data-error={errors.image ? 'true' : undefined}
                className={`p-5 rounded-2xl border space-y-4 ${
                  errors.image
                    ? 'border-[#9E382B] bg-[#FDF0EE]/40 ring-1 ring-[#9E382B]/20'
                    : 'border-[#E8E2D5] bg-white'
                }`}
              >
                <div className="flex items-center gap-2 text-xs font-bold text-[#173D2A] uppercase tracking-wide">
                  <ImageIcon className="w-4 h-4 text-[#D99B26]" />
                  <span>Product Photography</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1A211D] uppercase tracking-wide mb-3">
                    Primary Cover Image <span className="text-[#9E382B]">*</span>
                  </label>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="w-32 h-32 rounded-2xl bg-[#F9F7F2] border border-[#DCD4C0] overflow-hidden flex items-center justify-center shrink-0 shadow-inner">
                      {image ? (
                        <img src={image} alt="Product cover preview" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-8 h-8 text-[#8F816B]" />
                      )}
                    </div>

                    <div className="flex-1 space-y-2">
                      <input
                        type="url"
                        value={image}
                        onChange={(event) => {
                          setImage(event.target.value);
                          clearError('image');
                        }}
                        placeholder="https://images.unsplash.com/photo-..."
                        className={fieldClass(Boolean(errors.image), 'w-full px-3 py-2.5 text-xs font-mono text-[#1A211D]')}
                      />
                      <label className="inline-flex items-center gap-2 px-3 py-2 text-xs font-bold text-[#173D2A] bg-[#F4EFE6] border border-[#DCD4C0] rounded-xl cursor-pointer hover:bg-[#EAE2D2]">
                        {isUploadingPrimary ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <UploadCloud className="w-4 h-4" />
                        )}
                        {isUploadingPrimary ? 'Uploading...' : 'Upload from computer'}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handlePrimaryImageUpload}
                          disabled={isUploadingPrimary}
                        />
                      </label>
                      {errors.image && <p className="text-xs text-[#9E382B] font-medium">{errors.image}</p>}
                      {uploadError && <p className="text-xs text-[#9E382B] font-medium">{uploadError}</p>}

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {IMAGE_PRESETS.map((preset) => (
                          <button
                            key={preset.name}
                            type="button"
                            onClick={() => {
                              setImage(preset.url);
                              clearError('image');
                            }}
                            className="px-2.5 py-1 text-[11px] bg-white hover:bg-[#EAE2D2] border border-[#DCD4C0] rounded-md text-[#173D2A]"
                          >
                            {preset.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#F0EBE0] space-y-3">
                  <label className="block text-xs font-bold text-[#1A211D] uppercase tracking-wide">
                    Secondary Gallery Images
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <input
                      type="url"
                      value={newSecondaryUrl}
                      onChange={(event) => setNewSecondaryUrl(event.target.value)}
                      placeholder="Enter secondary image URL..."
                      className="flex-1 min-w-[220px] px-3 py-2 text-xs bg-[#F9F7F2] border border-[#DCD4C0] rounded-xl text-[#1A211D] font-mono focus:outline-none focus:border-[#173D2A]"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!newSecondaryUrl.trim()) return;
                        setSecondaryImages((current) => [...current, newSecondaryUrl.trim()]);
                        setNewSecondaryUrl('');
                      }}
                      className="px-3 py-2 text-xs font-bold text-white bg-[#173D2A] hover:bg-[#0F281B] rounded-xl shrink-0"
                    >
                      + Add URL
                    </button>
                    <label className="inline-flex items-center gap-2 px-3 py-2 text-xs font-bold text-[#173D2A] bg-[#F4EFE6] border border-[#DCD4C0] rounded-xl cursor-pointer hover:bg-[#EAE2D2] shrink-0">
                      {isUploadingSecondary ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <UploadCloud className="w-4 h-4" />
                      )}
                      Upload Image
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleSecondaryImageUpload}
                        disabled={isUploadingSecondary}
                      />
                    </label>
                  </div>

                  {secondaryImages.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {secondaryImages.map((imgUrl, index) => (
                        <div
                          key={`${imgUrl}-${index}`}
                          className="relative group rounded-xl border border-[#DCD4C0] overflow-hidden aspect-square bg-[#F9F7F2]"
                        >
                          <img src={imgUrl} alt={`Secondary ${index + 1}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() =>
                              setSecondaryImages((current) => current.filter((_, i) => i !== index))
                            }
                            className="absolute top-1.5 right-1.5 p-1 bg-red-600/90 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </section>

              <section className="p-5 rounded-2xl border border-[#E8E2D5] bg-white space-y-5">
                <div className="flex items-center gap-2 text-xs font-bold text-[#173D2A] uppercase tracking-wide">
                  <Flame className="w-4 h-4 text-[#D99B26]" />
                  <span>Ingredients & Sensory Profile</span>
                </div>

                <div className="p-4 bg-[#F9F7F2] border border-[#E8E2D5] rounded-xl space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold text-[#173D2A] uppercase tracking-wide">
                        Spiciness Heat Level
                      </p>
                      <p className="text-xs text-[#736854] mt-0.5">Rate from 1 (mild) to 5 (intense)</p>
                    </div>
                    <SpicinessRating level={spicinessLevel} onChange={setSpicinessLevel} interactive size="lg" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#5C5343]">Aroma Profile</label>
                      <input
                        type="text"
                        value={aromaProfile}
                        onChange={(event) => setAromaProfile(event.target.value)}
                        placeholder="e.g. Woody cinnamon and green cardamom notes"
                        className={fieldClass(false, 'w-full mt-1 px-3 py-2 text-xs text-[#1A211D]')}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#5C5343]">Storage Instructions</label>
                      <input
                        type="text"
                        value={storageInstructions}
                        onChange={(event) => setStorageInstructions(event.target.value)}
                        placeholder="e.g. Store in airtight tin in a cool dark pantry"
                        className={fieldClass(false, 'w-full mt-1 px-3 py-2 text-xs text-[#1A211D]')}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-xs font-bold text-[#1A211D] uppercase tracking-wide">
                    Spice Ingredients ({ingredients.length})
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newIngredient}
                      onChange={(event) => setNewIngredient(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          event.preventDefault();
                          if (!newIngredient.trim()) return;
                          setIngredients((current) => [...current, newIngredient.trim()]);
                          setNewIngredient('');
                        }
                      }}
                      placeholder="e.g. Black Mace (Javitri), Green Cardamom..."
                      className="flex-1 px-3 py-2 text-xs border border-[#DCD4C0] rounded-xl focus:outline-none focus:border-[#173D2A]"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!newIngredient.trim()) return;
                        setIngredients((current) => [...current, newIngredient.trim()]);
                        setNewIngredient('');
                      }}
                      className="px-4 py-2 text-xs font-bold text-white bg-[#173D2A] hover:bg-[#0F281B] rounded-xl shrink-0"
                    >
                      + Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {ingredients.map((item, index) => (
                      <span
                        key={`${item}-${index}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F4EFE6] border border-[#DCD4C0] text-[#173D2A] text-xs font-medium rounded-full"
                      >
                        {item}
                        <button
                          type="button"
                          onClick={() => setIngredients((current) => current.filter((_, i) => i !== index))}
                          className="text-[#8F816B] hover:text-[#9E382B]"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-xs font-bold text-[#1A211D] uppercase tracking-wide">
                    Health & Culinary Benefits ({benefits.length})
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newBenefit}
                      onChange={(event) => setNewBenefit(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          event.preventDefault();
                          if (!newBenefit.trim()) return;
                          setBenefits((current) => [...current, newBenefit.trim()]);
                          setNewBenefit('');
                        }
                      }}
                      placeholder="e.g. Promotes digestive fire without acidity..."
                      className="flex-1 px-3 py-2 text-xs border border-[#DCD4C0] rounded-xl focus:outline-none focus:border-[#173D2A]"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!newBenefit.trim()) return;
                        setBenefits((current) => [...current, newBenefit.trim()]);
                        setNewBenefit('');
                      }}
                      className="px-4 py-2 text-xs font-bold text-white bg-[#173D2A] hover:bg-[#0F281B] rounded-xl shrink-0"
                    >
                      + Add
                    </button>
                  </div>
                  <div className="space-y-1.5">
                    {benefits.map((item, index) => (
                      <div
                        key={`${item}-${index}`}
                        className="flex items-center justify-between px-3 py-2 bg-[#F9F7F2] border border-[#E8E2D5] rounded-xl text-xs"
                      >
                        <span className="text-[#1A211D]">✓ {item}</span>
                        <button
                          type="button"
                          onClick={() => setBenefits((current) => current.filter((_, i) => i !== index))}
                          className="text-[#8F816B] hover:text-[#9E382B] p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-xs font-bold text-[#1A211D] uppercase tracking-wide">
                    Ideal Recipe Pairings ({bestFor.length})
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newBestFor}
                      onChange={(event) => setNewBestFor(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          event.preventDefault();
                          if (!newBestFor.trim()) return;
                          setBestFor((current) => [...current, newBestFor.trim()]);
                          setNewBestFor('');
                        }
                      }}
                      placeholder="e.g. Dum Aloo, Paneer Butter Masala..."
                      className="flex-1 px-3 py-2 text-xs border border-[#DCD4C0] rounded-xl focus:outline-none focus:border-[#173D2A]"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!newBestFor.trim()) return;
                        setBestFor((current) => [...current, newBestFor.trim()]);
                        setNewBestFor('');
                      }}
                      className="px-4 py-2 text-xs font-bold text-white bg-[#173D2A] hover:bg-[#0F281B] rounded-xl shrink-0"
                    >
                      + Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {bestFor.map((item, index) => (
                      <span
                        key={`${item}-${index}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#EBF5EE] border border-[#C3DEC9] text-[#173D2A] text-xs font-semibold rounded-full"
                      >
                        {item}
                        <button
                          type="button"
                          onClick={() => setBestFor((current) => current.filter((_, i) => i !== index))}
                          className="text-[#245A3F] hover:text-[#9E382B]"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </section>

              <div className="pt-2 border-t border-[#E8E2D5] flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 text-xs font-semibold text-[#5C5343] bg-[#F4EFE6] hover:bg-[#EAE2D2] rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold text-[#173D2A] bg-[#D99B26] hover:bg-[#C68A1B] rounded-xl shadow-md flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  {productToEdit ? 'Save Product Changes' : 'Publish Product'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
