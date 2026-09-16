import React, { useState, useEffect } from 'react';
import { X, Check, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Category, CategoryStatus } from '../../types';

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (catData: Omit<Category, 'id' | 'subcategories' | 'productCount'>) => void;
  categoryToEdit?: Category | null;
}

export const CategoryFormModal: React.FC<CategoryFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  categoryToEdit
}) => {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [status, setStatus] = useState<CategoryStatus>('active');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (categoryToEdit) {
      setName(categoryToEdit.name);
      setSlug(categoryToEdit.slug);
      setDescription(categoryToEdit.description);
      setImage(categoryToEdit.image);
      setStatus(categoryToEdit.status);
    } else {
      setName('');
      setSlug('');
      setDescription('');
      setImage('https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80');
      setStatus('active');
    }
    setErrors({});
  }, [categoryToEdit, isOpen]);

  const handleNameChange = (val: string) => {
    setName(val);
    if (!categoryToEdit) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Category name is required';
    if (!slug.trim()) newErrors.slug = 'Category slug is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      name,
      slug,
      description,
      image,
      status
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop with Fade */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={onClose}
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative w-full max-w-lg bg-white rounded-2xl border border-[#E8E2D5] shadow-2xl overflow-hidden z-10 my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-4 bg-[#173D2A] text-white flex items-center justify-between border-b border-[#245A3F]">
              <div>
                <h3 className="text-base font-bold font-serif-brand text-[#F9F7F2]">
                  {categoryToEdit ? 'Edit Spice Category' : 'Create New Category'}
                </h3>
                <p className="text-xs text-[#A6C5B3]">
                  Organize spice families and regional culinary collections.
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#1A211D] uppercase tracking-wide">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Specialty Blends"
                  className="w-full mt-1 px-3 py-2 text-sm bg-white border border-[#DCD4C0] rounded-xl text-[#1A211D] focus:outline-none focus:border-[#173D2A]"
                />
                {errors.name && <p className="text-xs text-[#9E382B] mt-1 font-medium">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1A211D] uppercase tracking-wide">
                  URL Slug *
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. specialty-blends"
                  className="w-full mt-1 px-3 py-2 text-xs font-mono bg-[#F9F7F2] border border-[#DCD4C0] rounded-xl text-[#5C5343] focus:outline-none focus:border-[#173D2A]"
                />
                {errors.slug && <p className="text-xs text-[#9E382B] mt-1 font-medium">{errors.slug}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1A211D] uppercase tracking-wide">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short description of this spice category family..."
                  className="w-full mt-1 px-3 py-2 text-xs bg-white border border-[#DCD4C0] rounded-xl text-[#1A211D] focus:outline-none focus:border-[#173D2A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1A211D] uppercase tracking-wide">
                  Category Cover Image URL
                </label>
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full mt-1 px-3 py-2 text-xs font-mono bg-white border border-[#DCD4C0] rounded-xl text-[#1A211D] focus:outline-none focus:border-[#173D2A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1A211D] uppercase tracking-wide">
                  Category Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as CategoryStatus)}
                  className="w-full mt-1 px-3 py-2 text-xs font-semibold bg-white border border-[#DCD4C0] rounded-xl text-[#1A211D] focus:outline-none focus:border-[#173D2A]"
                >
                  <option value="active">Active (Visible in Storefront & CMS)</option>
                  <option value="inactive">Inactive / Hidden</option>
                </select>
              </div>

              {/* Footer Actions */}
              <div className="pt-4 border-t border-[#E8E2D5] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-[#5C5343] bg-[#F4EFE6] hover:bg-[#EAE2D2] rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#173D2A] hover:bg-[#0F281B] rounded-xl transition-colors shadow-sm flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{categoryToEdit ? 'Save Category' : 'Create Category'}</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
