import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Tags, 
  Pencil, 
  Trash2, 
  ChevronDown, 
  ChevronRight, 
  FolderPlus,
  Layers,
  Check,
  X,
  Package,
  Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Category, Subcategory } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { EmptyState } from '../common/EmptyState';

interface CategoriesViewProps {
  categories: Category[];
  onNewCategory: () => void;
  onEditCategory: (category: Category) => void;
  onDeleteCategory: (id: string) => void;
  onAddSubcategory: (categoryId: string, name: string, slug: string) => void;
  onUpdateSubcategory: (categoryId: string, subcategoryId: string, updates: Partial<Subcategory>) => void;
  onDeleteSubcategory: (categoryId: string, subcategoryId: string) => void;
}

export const CategoriesView: React.FC<CategoriesViewProps> = ({
  categories,
  onNewCategory,
  onEditCategory,
  onDeleteCategory,
  onAddSubcategory,
  onUpdateSubcategory,
  onDeleteSubcategory
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Expansion state for category accordions
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    'cat-blends': true,
    'cat-singles': true,
    'cat-south-indian': true,
    'cat-herbs': true
  });

  // Adding subcategory inline state
  const [addingSubForCatId, setAddingSubForCatId] = useState<string | null>(null);
  const [newSubName, setNewSubName] = useState('');

  // Editing subcategory inline state
  const [editingSub, setEditingSub] = useState<{ categoryId: string; subcategoryId: string; name: string } | null>(null);

  // Deletion confirm state
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const [deletingSubcategory, setDeletingSubcategory] = useState<{ categoryId: string; subcategoryId: string; name: string } | null>(null);

  const toggleExpand = (catId: string) => {
    setExpandedCategories(prev => ({ ...prev, [catId]: !prev[catId] }));
  };

  const handleSaveNewSubcategory = (categoryId: string) => {
    if (!newSubName.trim()) return;
    const slug = newSubName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    onAddSubcategory(categoryId, newSubName.trim(), slug);
    setNewSubName('');
    setAddingSubForCatId(null);
  };

  const handleSaveEditSubcategory = () => {
    if (!editingSub || !editingSub.name.trim()) return;
    const slug = editingSub.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    onUpdateSubcategory(editingSub.categoryId, editingSub.subcategoryId, {
      name: editingSub.name.trim(),
      slug
    });
    setEditingSub(null);
  };

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    return categories.filter(c => {
      const matchesCat = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSub = c.subcategories?.some(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCat || matchesSub;
    });
  }, [categories, searchQuery]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-[#E8E2D5] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold text-[#173D2A] font-serif-brand">
              Spice Taxonomy & Hierarchy
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-[#F4EFE6] text-[#173D2A] text-xs font-medium border border-[#E5DEC9]">
              {filteredCategories.length} Categories
            </span>
          </div>
          <p className="text-xs text-[#736854] mt-0.5">
            Organize parent spice categories and nested subcategories with real-time product association.
          </p>
        </div>

        <button
          onClick={onNewCategory}
          className="flex items-center justify-center gap-2 px-4 py-2 text-xs font-medium text-[#173D2A] bg-[#D99B26] hover:bg-[#C68A1B] rounded-xl shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Spice Category</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#E8E2D5] shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-[#8F816B] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search categories or subcategories..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-[#F9F7F2] border border-[#DCD4C0] rounded-xl text-[#1A211D] placeholder-[#8F816B] focus:outline-none focus:border-[#173D2A]"
          />
        </div>
      </div>

      {/* Category List */}
      {filteredCategories.length === 0 ? (
        <EmptyState
          icon={Tags}
          title="No Categories Found"
          description="No spice categories matched your search term."
          actionLabel="Clear Search"
          onAction={() => setSearchQuery('')}
        />
      ) : (
        <div className="space-y-4">
          {filteredCategories.map((category) => {
            const isExpanded = !!expandedCategories[category.id];
            const subcategories = category.subcategories || [];

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl border border-[#E8E2D5] shadow-xs overflow-hidden transition-all"
              >
                {/* Category Header Row */}
                <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FFFFFF] border-b border-[#F0EBE0]">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleExpand(category.id)}
                      className="p-1 rounded-lg text-[#736854] hover:bg-[#F4EFE6] transition-colors"
                      aria-label="Toggle category expansion"
                    >
                      {isExpanded ? <ChevronDown className="w-5 h-5 text-[#173D2A]" /> : <ChevronRight className="w-5 h-5 text-[#8F816B]" />}
                    </button>

                    <div className="w-12 h-12 rounded-xl bg-[#F4EFE6] border border-[#DCD4C0] overflow-hidden shrink-0 shadow-2xs">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-[#173D2A] font-serif-brand">
                          {category.name}
                        </h3>
                        <StatusBadge status={category.status} type="category" size="sm" />
                      </div>
                      <p className="text-xs text-[#736854] mt-0.5 line-clamp-1">
                        {category.description}
                      </p>
                      <div className="text-[11px] text-[#8F816B] mt-0.5 font-mono">
                        Slug: /{category.slug} • {category.productCount} Active Catalog Products
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => {
                        setAddingSubForCatId(category.id);
                        setExpandedCategories(prev => ({ ...prev, [category.id]: true }));
                      }}
                      className="px-3 py-1.5 text-xs font-semibold text-[#173D2A] bg-[#F4EFE6] hover:bg-[#EAE2D2] border border-[#DCD4C0] rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <FolderPlus className="w-3.5 h-3.5" />
                      <span>+ Subcategory</span>
                    </button>

                    <button
                      onClick={() => onEditCategory(category)}
                      className="p-2 text-xs font-semibold text-[#173D2A] bg-white hover:bg-[#F4EFE6] border border-[#DCD4C0] rounded-lg transition-colors flex items-center gap-1"
                      title="Edit Category"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => setDeletingCategory(category)}
                      className="p-2 text-[#9E382B] hover:bg-[#FDF0EE] rounded-lg transition-colors"
                      title="Delete Category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Subcategories Accordion Content */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="bg-[#FAF8F5] p-4 sm:p-5 border-t border-[#F0EBE0] space-y-3 overflow-hidden"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Layers className="w-4 h-4 text-[#8F816B]" />
                          <span className="text-xs font-bold text-[#173D2A] uppercase tracking-wider">
                            Subcategories ({subcategories.length})
                          </span>
                        </div>
                      </div>

                      {/* Add new subcategory input row */}
                      {addingSubForCatId === category.id && (
                        <div className="p-3 bg-white border-2 border-[#D99B26] rounded-xl flex items-center gap-2 animate-in fade-in duration-100 shadow-xs">
                          <input
                            type="text"
                            autoFocus
                            value={newSubName}
                            onChange={(e) => setNewSubName(e.target.value)}
                            placeholder="Enter new subcategory name (e.g. Masala Powders)..."
                            className="flex-1 px-3 py-1.5 text-xs bg-[#F9F7F2] border border-[#DCD4C0] rounded-lg text-[#1A211D] focus:outline-none focus:border-[#173D2A]"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveNewSubcategory(category.id);
                              if (e.key === 'Escape') setAddingSubForCatId(null);
                            }}
                          />
                          <button
                            onClick={() => handleSaveNewSubcategory(category.id)}
                            className="px-3 py-1.5 text-xs font-bold text-white bg-[#173D2A] hover:bg-[#0F281B] rounded-lg flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Save</span>
                          </button>
                          <button
                            onClick={() => {
                              setAddingSubForCatId(null);
                              setNewSubName('');
                            }}
                            className="px-2 py-1.5 text-xs text-[#736854] hover:bg-[#F4EFE6] rounded-lg"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}

                      {/* Subcategory List */}
                      {subcategories.length === 0 && addingSubForCatId !== category.id ? (
                        <div className="text-xs text-[#8F816B] italic py-2">
                          No subcategories yet. Click &ldquo;+ Subcategory&rdquo; above to add specific regional or grain varieties.
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                          {subcategories.map((sub) => {
                            const isEditing = editingSub?.categoryId === category.id && editingSub?.subcategoryId === sub.id;

                            if (isEditing) {
                              return (
                                <div key={sub.id} className="p-2 bg-white border border-[#D99B26] rounded-lg flex items-center gap-1.5 shadow-2xs">
                                  <input
                                    type="text"
                                    autoFocus
                                    value={editingSub.name}
                                    onChange={(e) => setEditingSub({ ...editingSub, name: e.target.value })}
                                    className="flex-1 px-2 py-1 text-xs bg-[#F9F7F2] border border-[#DCD4C0] rounded text-[#1A211D] focus:outline-none"
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') handleSaveEditSubcategory();
                                      if (e.key === 'Escape') setEditingSub(null);
                                    }}
                                  />
                                  <button
                                    onClick={handleSaveEditSubcategory}
                                    className="p-1 text-white bg-[#173D2A] rounded hover:bg-[#0F281B]"
                                    title="Save"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => setEditingSub(null)}
                                    className="p-1 text-[#736854] hover:bg-[#F4EFE6] rounded"
                                    title="Cancel"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              );
                            }

                            return (
                              <div
                                key={sub.id}
                                className="p-2.5 bg-white border border-[#E8E2D5] rounded-xl flex items-center justify-between gap-2 shadow-2xs hover:border-[#DCD4C0] transition-colors"
                              >
                                <div>
                                  <div className="text-xs font-bold text-[#1A211D]">
                                    {sub.name}
                                  </div>
                                  <div className="text-[10px] text-[#8F816B] font-mono">
                                    /{sub.slug}
                                  </div>
                                </div>

                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => setEditingSub({ categoryId: category.id, subcategoryId: sub.id, name: sub.name })}
                                    className="p-1 text-[#8F816B] hover:text-[#173D2A] hover:bg-[#F4EFE6] rounded"
                                    title="Edit subcategory"
                                  >
                                    <Pencil className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={() => setDeletingSubcategory({ categoryId: category.id, subcategoryId: sub.id, name: sub.name })}
                                    className="p-1 text-[#8F816B] hover:text-[#9E382B] hover:bg-[#FDF0EE] rounded"
                                    title="Delete subcategory"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Delete Category Modal */}
      <ConfirmDialog
        isOpen={!!deletingCategory}
        title="Delete Category?"
        message={`Are you sure you want to delete "${deletingCategory?.name}"? Products categorized under this will become uncategorized.`}
        confirmLabel="Delete Category"
        cancelLabel="Cancel"
        isDestructive={true}
        onConfirm={() => {
          if (deletingCategory) {
            onDeleteCategory(deletingCategory.id);
            setDeletingCategory(null);
          }
        }}
        onCancel={() => setDeletingCategory(null)}
      />

      {/* Delete Subcategory Modal */}
      <ConfirmDialog
        isOpen={!!deletingSubcategory}
        title="Delete Subcategory?"
        message={`Are you sure you want to delete subcategory "${deletingSubcategory?.name}"?`}
        confirmLabel="Delete Subcategory"
        cancelLabel="Cancel"
        isDestructive={true}
        onConfirm={() => {
          if (deletingSubcategory) {
            onDeleteSubcategory(deletingSubcategory.categoryId, deletingSubcategory.subcategoryId);
            setDeletingSubcategory(null);
          }
        }}
        onCancel={() => setDeletingSubcategory(null)}
      />
    </motion.div>
  );
};
