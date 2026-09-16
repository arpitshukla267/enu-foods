import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  X,
  Check,
  Image as ImageIcon,
  UploadCloud,
  Loader2,
  Percent,
  ChefHat,
  FileText,
  Tag,
  Trash2,
  AlertCircle,
} from 'lucide-react';
import { Combo, ComboItem, ComboStatus, Product } from '../../types';
import { ComboProductSelector } from './ComboProductSelector';
import { uploadProductImage } from '../../lib/uploadApi';
import { motion, AnimatePresence } from 'motion/react';

interface ComboFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (comboData: Omit<Combo, 'id' | 'createdAt' | 'updatedAt'>) => void;
  comboToEdit?: Combo | null;
}

const CATEGORY_OPTIONS = [
  'Daily Essentials',
  'Gourmet Blends',
  'Street Specials',
  'Essential Collections',
  'Festive & Royal',
];

const BADGE_PRESETS = ['Popular', 'Bestseller', 'Chef Choice', 'Festive Special', 'New Kit'];

const fieldClass = (hasError: boolean, base = '') =>
  `${base} border rounded-xl transition-colors focus:outline-none ${
    hasError
      ? 'border-[#9E382B] ring-2 ring-[#9E382B]/20 bg-[#FDF0EE]/50'
      : 'border-[#DCD4C0] bg-white focus:border-[#173D2A]'
  }`;

export const ComboFormModal: React.FC<ComboFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  comboToEdit,
}) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState(CATEGORY_OPTIONS[0]);
  const [tag, setTag] = useState('');
  const [badge, setBadge] = useState('Popular');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [discountPercent, setDiscountPercent] = useState<number>(15);
  const [customChefTip, setCustomChefTip] = useState('');
  const [status, setStatus] = useState<ComboStatus>('active');
  const [items, setItems] = useState<ComboItem[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Record<string, Product>>({});
  const [highlights, setHighlights] = useState<string[]>([]);
  const [newHighlight, setNewHighlight] = useState('');
  const [idealRecipes, setIdealRecipes] = useState<string[]>([]);
  const [newRecipe, setNewRecipe] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    if (comboToEdit) {
      setTitle(comboToEdit.title);
      setSubtitle(comboToEdit.subtitle || '');
      setCategory(comboToEdit.category);
      setTag(comboToEdit.tag || '');
      setBadge(comboToEdit.badge || 'Popular');
      setDescription(comboToEdit.description);
      setImage(comboToEdit.image);
      setDiscountPercent(comboToEdit.discountPercent);
      setCustomChefTip(comboToEdit.customChefTip || comboToEdit.chefTip || '');
      setStatus(comboToEdit.status);
      setItems(
        (comboToEdit.items || []).map((item) => ({
          ...item,
          quantity: item.quantity && item.quantity > 0 ? item.quantity : 1,
        })),
      );
      setHighlights(comboToEdit.highlights || []);
      setIdealRecipes(comboToEdit.idealRecipes || []);
    } else {
      setTitle('');
      setSubtitle('');
      setCategory(CATEGORY_OPTIONS[0]);
      setTag('Kitchen Trio Set');
      setBadge('Popular');
      setDescription('');
      setImage('');
      setDiscountPercent(15);
      setCustomChefTip('');
      setStatus('active');
      setItems([]);
      setHighlights(['100% Single Origin Spices', 'Cold Ground Heritage Aroma', 'No Fillers or Starches']);
      setIdealRecipes(['Everyday Indian Kitchen', 'Special Weekend Feasts']);
    }

    setNewHighlight('');
    setNewRecipe('');
    setSelectedProducts({});
    setErrors({});
    setUploadError(null);
  }, [comboToEdit, isOpen]);

  const originalPrice = useMemo(
    () =>
      items.reduce((sum, item) => {
        const product = selectedProducts[item.productId];
        if (!product) return sum;
        const variant =
          product.weightOptions.find((entry) => entry.weight === item.weight) ||
          product.weightOptions[0];
        const unitPrice = variant ? variant.price : product.price;
        const quantity = item.quantity && item.quantity > 0 ? item.quantity : 1;
        return sum + unitPrice * quantity;
      }, 0),
    [items, selectedProducts],
  );

  const price = Math.round(originalPrice * (1 - discountPercent / 100));

  const clearError = (field: string) => {
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    setUploadError(null);

    try {
      const uploaded = await uploadProductImage(file);
      setImage(uploaded.url);
      clearError('image');
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Image upload failed');
    } finally {
      setIsUploadingImage(false);
      event.target.value = '';
    }
  };

  const handleAddHighlight = () => {
    const value = newHighlight.trim();
    if (!value) return;
    setHighlights((current) => [...current, value]);
    setNewHighlight('');
  };

  const handleAddRecipe = () => {
    const value = newRecipe.trim();
    if (!value) return;
    setIdealRecipes((current) => [...current, value]);
    setNewRecipe('');
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = 'Combo title is required';
    if (!category.trim()) newErrors.category = 'Category is required';
    if (!description.trim()) newErrors.description = 'Short description is required';
    if (!image.trim()) newErrors.image = 'Banner image is required';
    if (items.length === 0) newErrors.items = 'Add at least one product to this bundle';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      window.setTimeout(() => {
        formRef.current
          ?.querySelector('[data-error="true"]')
          ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 0);
      return;
    }

    onSave({
      title: title.trim(),
      subtitle: subtitle.trim(),
      slug: comboToEdit?.slug || '',
      category: category.trim(),
      tag: tag.trim(),
      badge: badge.trim(),
      description: description.trim(),
      fullStory: description.trim(),
      fullDescription: description.trim(),
      image: image.trim(),
      price: price > 0 ? price : 0,
      originalPrice: originalPrice > 0 ? originalPrice : 0,
      discountedPrice: price > 0 ? price : 0,
      discountPercent,
      chefTip: customChefTip.trim(),
      customChefTip: customChefTip.trim(),
      status,
      items,
      highlights,
      idealRecipes,
    });
  };

  if (!isOpen) return null;

  const errorEntries = Object.entries(errors);

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
                  {comboToEdit ? 'Edit Spice Bundle' : 'Curate Spice Combo Kit'}
                </span>
                <h3 className="text-lg font-bold font-serif-brand text-[#F9F7F2] mt-0.5">
                  {comboToEdit ? comboToEdit.title : 'New Recipe Combo Box'}
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
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
                  <span>Bundle Information</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div data-error={errors.title ? 'true' : undefined}>
                    <label className="block text-xs font-bold text-[#1A211D] uppercase tracking-wide">
                      Combo Title <span className="text-[#9E382B]">*</span>
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(event) => {
                        setTitle(event.target.value);
                        clearError('title');
                      }}
                      placeholder="e.g. Royal Kitchen Trio Set"
                      className={fieldClass(Boolean(errors.title), 'w-full mt-1 px-3 py-2.5 text-sm text-[#1A211D]')}
                    />
                    {errors.title && (
                      <p className="text-xs text-[#9E382B] mt-1 font-medium">{errors.title}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1A211D] uppercase tracking-wide">
                      Subtitle / Catchphrase
                    </label>
                    <input
                      type="text"
                      value={subtitle}
                      onChange={(event) => setSubtitle(event.target.value)}
                      placeholder="e.g. Master Every Indian Kitchen Classic"
                      className={fieldClass(false, 'w-full mt-1 px-3 py-2.5 text-sm text-[#1A211D]')}
                    />
                  </div>

                  <div data-error={errors.category ? 'true' : undefined}>
                    <label className="block text-xs font-semibold text-[#5C5343]">
                      Category <span className="text-[#9E382B]">*</span>
                    </label>
                    <select
                      value={category}
                      onChange={(event) => {
                        setCategory(event.target.value);
                        clearError('category');
                      }}
                      className={fieldClass(Boolean(errors.category), 'w-full mt-1 px-3 py-2.5 text-sm text-[#1A211D]')}
                    >
                      {CATEGORY_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="text-xs text-[#9E382B] mt-1 font-medium">{errors.category}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#5C5343]">Publication Status</label>
                    <select
                      value={status}
                      onChange={(event) => setStatus(event.target.value as ComboStatus)}
                      className={fieldClass(false, 'w-full mt-1 px-3 py-2.5 text-sm text-[#1A211D]')}
                    >
                      <option value="active">Active (Visible on Storefront)</option>
                      <option value="draft">Draft (CMS only)</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#5C5343]">Tag / Packaging Type</label>
                    <input
                      type="text"
                      value={tag}
                      onChange={(event) => setTag(event.target.value)}
                      placeholder="e.g. Trio Pack or Hamper"
                      className={fieldClass(false, 'w-full mt-1 px-3 py-2.5 text-sm text-[#1A211D]')}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#5C5343]">Display Badge</label>
                    <input
                      type="text"
                      value={badge}
                      onChange={(event) => setBadge(event.target.value)}
                      placeholder="e.g. Bestseller or Festive"
                      className={fieldClass(false, 'w-full mt-1 px-3 py-2.5 text-sm text-[#1A211D]')}
                    />
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {BADGE_PRESETS.map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setBadge(preset)}
                          className={`px-2.5 py-1 text-[10px] font-bold rounded-full border transition-colors ${
                            badge === preset
                              ? 'bg-[#173D2A] text-white border-[#173D2A]'
                              : 'bg-white text-[#173D2A] border-[#DCD4C0] hover:bg-[#F4EFE6]'
                          }`}
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div data-error={errors.description ? 'true' : undefined}>
                  <label className="block text-xs font-bold text-[#1A211D] uppercase tracking-wide">
                    Short Kit Description <span className="text-[#9E382B]">*</span>
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(event) => {
                      setDescription(event.target.value);
                      clearError('description');
                    }}
                    placeholder="Three foundational spice mastercrafts bundled for every culinary adventure."
                    className={fieldClass(Boolean(errors.description), 'w-full mt-1 px-3 py-2.5 text-sm text-[#1A211D]')}
                  />
                  {errors.description && (
                    <p className="text-xs text-[#9E382B] mt-1 font-medium">{errors.description}</p>
                  )}
                </div>
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
                  <span>Combo Banner Image <span className="text-[#9E382B]">*</span></span>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="w-32 h-32 rounded-2xl bg-[#F9F7F2] border border-[#DCD4C0] overflow-hidden flex items-center justify-center shrink-0 shadow-inner">
                    {image ? (
                      <img src={image} alt="Combo banner preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-[#8F816B]" />
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <label className="block text-xs font-semibold text-[#5C5343]">Image URL or Upload</label>
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
                    <label className="inline-flex items-center gap-2 px-3 py-2 text-xs font-bold text-[#173D2A] bg-[#F4EFE6] border border-[#DCD4C0] rounded-xl cursor-pointer hover:bg-[#EAE2D2] transition-colors">
                      {isUploadingImage ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <UploadCloud className="w-4 h-4" />
                      )}
                      {isUploadingImage ? 'Uploading...' : 'Upload from computer'}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                        disabled={isUploadingImage}
                      />
                    </label>
                    {errors.image && (
                      <p className="text-xs text-[#9E382B] font-medium">{errors.image}</p>
                    )}
                    {uploadError && <p className="text-xs text-[#9E382B] font-medium">{uploadError}</p>}
                  </div>
                </div>
              </section>

              <section className="p-5 rounded-2xl border border-[#E8E2D5] bg-[#F9F7F2] space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-[#173D2A] uppercase tracking-wide">
                  <Percent className="w-4 h-4 text-[#D99B26]" />
                  <span>Calculated Bundle Pricing</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-stretch">
                  <div>
                    <label className="block text-[11px] font-bold text-[#736854] uppercase">
                      Discount Offered (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="90"
                      value={discountPercent}
                      onChange={(event) => setDiscountPercent(Number(event.target.value))}
                      className="w-full mt-1 px-3 py-2 text-sm font-bold text-[#173D2A] bg-white border border-[#DCD4C0] rounded-xl focus:outline-none focus:border-[#173D2A]"
                    />
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-[#DCD4C0] flex flex-col justify-center">
                    <span className="text-[10px] uppercase font-bold text-[#736854]">Combined MRP Value</span>
                    <div className="text-xl font-bold text-[#5C5343]">₹{originalPrice}</div>
                  </div>

                  <div className="p-3 bg-[#173D2A] text-white rounded-xl shadow-xs flex flex-col justify-center">
                    <span className="text-[10px] uppercase font-bold text-[#D99B26]">Selling Price</span>
                    <div className="text-xl font-bold text-[#F9F7F2]">₹{price}</div>
                  </div>
                </div>
              </section>

              <section data-error={errors.items ? 'true' : undefined}>
                <ComboProductSelector
                  comboItems={items}
                  onChange={(nextItems) => {
                    setItems(nextItems);
                    clearError('items');
                  }}
                  onSelectedProductsChange={setSelectedProducts}
                  hasError={Boolean(errors.items)}
                  errorMessage={errors.items}
                />
              </section>

              <section className="p-5 rounded-2xl border border-[#E8E2D5] bg-white space-y-5">
                <div className="flex items-center gap-2 text-xs font-bold text-[#173D2A] uppercase tracking-wide">
                  <ChefHat className="w-4 h-4 text-[#D99B26]" />
                  <span>Chef Tips & Highlights</span>
                </div>

                <div className="p-4 bg-[#F9F7F2] border border-[#E8E2D5] rounded-xl space-y-2">
                  <label className="block text-xs font-bold text-[#173D2A] uppercase tracking-wide">
                    Master Chef&apos;s Culinary Tip
                  </label>
                  <textarea
                    rows={3}
                    value={customChefTip}
                    onChange={(event) => setCustomChefTip(event.target.value)}
                    placeholder="Provide kitchen advice on layering spices, blooming techniques, and pan temperatures..."
                    className="w-full px-3 py-2.5 text-xs bg-white border border-[#DCD4C0] rounded-xl text-[#1A211D] focus:outline-none focus:border-[#173D2A]"
                  />
                </div>

                <div className="space-y-3">
                  <label className="block text-xs font-bold text-[#1A211D] uppercase tracking-wide">
                    Kit Quality Highlights
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newHighlight}
                      onChange={(event) => setNewHighlight(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          event.preventDefault();
                          handleAddHighlight();
                        }
                      }}
                      placeholder="e.g. 100% Single Origin Spices..."
                      className="flex-1 px-3 py-2 text-xs bg-white border border-[#DCD4C0] rounded-xl text-[#1A211D] focus:outline-none focus:border-[#173D2A]"
                    />
                    <button
                      type="button"
                      onClick={handleAddHighlight}
                      className="px-4 py-2 text-xs font-bold text-white bg-[#173D2A] hover:bg-[#0F281B] rounded-xl shrink-0"
                    >
                      + Add
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    {highlights.length === 0 ? (
                      <p className="text-xs text-[#8F816B] italic px-1">No highlights added yet.</p>
                    ) : (
                      highlights.map((highlight, index) => (
                        <div
                          key={`${highlight}-${index}`}
                          className="flex items-center justify-between px-3 py-2 bg-[#F9F7F2] border border-[#E8E2D5] rounded-xl text-xs"
                        >
                          <span className="text-[#1A211D]">✓ {highlight}</span>
                          <button
                            type="button"
                            onClick={() =>
                              setHighlights((current) => current.filter((_, i) => i !== index))
                            }
                            className="text-[#8F816B] hover:text-[#9E382B] p-1"
                            aria-label="Remove highlight"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center gap-1.5 text-xs font-bold text-[#1A211D] uppercase tracking-wide">
                    <Tag className="w-3.5 h-3.5 text-[#D99B26]" />
                    Recommended Recipes & Cuisines
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newRecipe}
                      onChange={(event) => setNewRecipe(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          event.preventDefault();
                          handleAddRecipe();
                        }
                      }}
                      placeholder="e.g. Shahi Paneer, Biryani..."
                      className="flex-1 px-3 py-2 text-xs bg-white border border-[#DCD4C0] rounded-xl text-[#1A211D] focus:outline-none focus:border-[#173D2A]"
                    />
                    <button
                      type="button"
                      onClick={handleAddRecipe}
                      className="px-4 py-2 text-xs font-bold text-white bg-[#173D2A] hover:bg-[#0F281B] rounded-xl shrink-0"
                    >
                      + Add
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {idealRecipes.length === 0 ? (
                      <p className="text-xs text-[#8F816B] italic px-1">No recipes added yet.</p>
                    ) : (
                      idealRecipes.map((recipe, index) => (
                        <span
                          key={`${recipe}-${index}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#EBF5EE] border border-[#C3DEC9] text-[#173D2A] text-xs font-semibold rounded-full"
                        >
                          {recipe}
                          <button
                            type="button"
                            onClick={() =>
                              setIdealRecipes((current) => current.filter((_, i) => i !== index))
                            }
                            className="text-[#245A3F] hover:text-[#9E382B]"
                            aria-label="Remove recipe"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))
                    )}
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
                  {comboToEdit ? 'Save Combo Changes' : 'Publish Combo Bundle'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
