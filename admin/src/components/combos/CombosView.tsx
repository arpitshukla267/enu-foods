import React, { useState, useEffect, useCallback } from 'react';
import { 
  Plus, 
  Search, 
  Pencil, 
  Trash2, 
  Boxes, 
  Percent, 
  Eye, 
  Sparkles,
  PackageCheck,
  Loader2,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { Combo } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { EmptyState } from '../common/EmptyState';
import { motion, AnimatePresence } from 'motion/react';
import * as adminComboApi from '../../lib/adminComboApi';
import { ApiError } from '../../lib/apiClient';

interface CombosViewProps {
  refreshToken: number;
  onCombosLoaded?: (combos: Combo[]) => void;
  onNewCombo: () => void;
  onEditCombo: (combo: Combo) => void;
  onDeleteCombo: (id: string) => void;
}

export const CombosView: React.FC<CombosViewProps> = ({
  refreshToken,
  onCombosLoaded,
  onNewCombo,
  onEditCombo,
  onDeleteCombo
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [deletingCombo, setDeletingCombo] = useState<Combo | null>(null);
  const [combos, setCombos] = useState<Combo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
    }, 350);
    return () => window.clearTimeout(timer);
  }, [searchQuery]);

  const fetchCombos = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await adminComboApi.getCombos({
        limit: 100,
        search: debouncedSearch || undefined,
        status: selectedStatus === 'all' ? 'all' : selectedStatus as Combo['status'],
      });

      setCombos(result.combos);
      onCombosLoaded?.(result.combos);
    } catch (fetchError) {
      setError(
        fetchError instanceof ApiError
          ? fetchError.message
          : fetchError instanceof Error
            ? fetchError.message
            : 'Failed to load combos',
      );
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, selectedStatus, onCombosLoaded]);

  useEffect(() => {
    fetchCombos();
  }, [fetchCombos, refreshToken]);

  const getComboPrice = (combo: Combo) => combo.price ?? combo.discountedPrice;

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
              Combos & Recipe Bundles
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-[#F4EFE6] text-[#173D2A] text-xs font-medium border border-[#E5DEC9]">
              {combos.length} Kits
            </span>
          </div>
          <p className="text-xs text-[#736854] mt-0.5">
            Curated gift sets, recipe trios, and discounted spice pairings for home chefs.
          </p>
        </div>

        <button
          onClick={onNewCombo}
          className="flex items-center justify-center gap-2 px-4 py-2 text-xs font-medium text-[#173D2A] bg-[#D99B26] hover:bg-[#C68A1B] rounded-xl shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Curate New Combo</span>
        </button>
      </div>

      {/* Filter bar */}
      <div className="bg-white p-4 rounded-xl border border-[#E8E2D5] shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#8F816B] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search combos by title, category..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-[#F9F7F2] border border-[#DCD4C0] rounded-xl text-[#1A211D] placeholder-[#8F816B] focus:outline-none focus:border-[#173D2A]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 text-xs bg-[#F9F7F2] border border-[#DCD4C0] rounded-xl text-[#1A211D] font-medium focus:outline-none focus:border-[#173D2A]"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Kits</option>
            <option value="draft">Drafts</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-[#FDF0EE] border border-[#E8C4BE] rounded-xl p-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[#9E382B] text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={fetchCombos}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#173D2A] hover:underline"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retry
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-20 text-[#736854]">
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
          Loading combo bundles...
        </div>
      ) : combos.length === 0 ? (
        <EmptyState
          icon={Boxes}
          title="No Spice Combos Found"
          description="Create your first curated spice gift kit or reset your search."
          actionLabel="Create Combo Kit"
          onAction={onNewCombo}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {combos.map((combo) => {
            return (
              <div
                key={combo.id}
                className="bg-white rounded-2xl border border-[#E8E2D5] shadow-xs overflow-hidden flex flex-col justify-between group hover:shadow-md transition-all duration-200"
              >
                <div>
                  {/* Top Image Banner */}
                  <div className="relative h-44 w-full bg-[#173D2A] overflow-hidden">
                    <img
                      src={combo.image}
                      alt={combo.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    {/* Floating Badges */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#D99B26] text-[#173D2A] text-[10px] font-medium shadow-xs">
                        {combo.badge || 'Popular'}
                      </span>
                      {combo.discountPercent > 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-white/90 text-[#173D2A] text-[10px] font-medium">
                          {combo.discountPercent}% OFF
                        </span>
                      )}
                    </div>

                    <div className="absolute top-3 right-3">
                      <StatusBadge status={combo.status} type="combo" size="sm" />
                    </div>

                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="text-[10px] font-medium text-[#D99B26] uppercase tracking-wider">
                        {combo.category} , {combo.tag || 'Set'}
                      </div>
                      <h3 className="text-base font-medium text-white font-serif-brand line-clamp-1">
                        {combo.title}
                      </h3>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-3">
                    <p className="text-xs text-[#736854] line-clamp-2">
                      {combo.description}
                    </p>

                    {/* Included Spices Preview */}
                    <div className="p-3 bg-[#F9F7F2] rounded-xl border border-[#E8E2D5] space-y-2">
                      <div className="text-[10px] font-medium uppercase tracking-wider text-[#736854] flex items-center justify-between">
                        <span>Includes {combo.items?.length || 0} Spice Formulations:</span>
                      </div>

                      <div className="space-y-1.5">
                        {combo.items?.slice(0, 3).map((item, idx) => {
                          return (
                            <div key={idx} className="flex items-center justify-between text-xs">
                              <span className="font-medium text-[#1A211D] truncate max-w-[170px]">
                                {item.productName || 'Spice formulation'}
                              </span>
                              <span className="text-[11px] text-[#736854] font-medium">
                                {item.weight}
                              </span>
                            </div>
                          );
                        })}
                        {(combo.items?.length || 0) > 3 && (
                          <div className="text-[10px] text-[#8F816B] font-medium italic">
                            + {(combo.items?.length || 0) - 3} more spices in this kit
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Pricing & Actions */}
                <div className="p-4 bg-[#FAF8F5] border-t border-[#E8E2D5] flex items-center justify-between">
                  <div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-base font-medium text-[#173D2A]">₹{getComboPrice(combo)}</span>
                      {combo.originalPrice > getComboPrice(combo) && (
                        <span className="text-xs text-[#8F816B] line-through">₹{combo.originalPrice}</span>
                      )}
                    </div>
                    <span className="text-[10px] text-[#736854]">Complete Bundle Price</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onEditCombo(combo)}
                      className="p-2 text-xs font-medium text-[#173D2A] bg-white hover:bg-[#F4EFE6] border border-[#DCD4C0] rounded-lg transition-colors flex items-center gap-1"
                      title="Edit Combo"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => setDeletingCombo(combo)}
                      className="p-2 text-[#9E382B] hover:bg-[#FDF0EE] rounded-lg transition-colors"
                      title="Delete Combo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingCombo}
        title="Delete Spice Combo Kit?"
        message={`Are you sure you want to remove the bundle "${deletingCombo?.title}"?`}
        confirmLabel="Delete Combo"
        cancelLabel="Cancel"
        isDestructive={true}
        onConfirm={() => {
          if (deletingCombo) {
            onDeleteCombo(deletingCombo.id);
            setDeletingCombo(null);
          }
        }}
        onCancel={() => setDeletingCombo(null)}
      />
    </motion.div>
  );
};
