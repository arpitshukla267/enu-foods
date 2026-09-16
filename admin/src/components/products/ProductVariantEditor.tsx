import React from 'react';
import { Plus, Trash2, CheckCircle } from 'lucide-react';
import { ProductWeightVariant } from '../../types';
import { generateVariantSku, normalizeWeightLabel } from '../../lib/productSku';

const WEIGHT_PRESETS = ['50g', '100g', '200g', '250g', '500g', '1kg'];

const DEFAULT_PRICES: Record<string, { price: number; originalPrice: number; stock: number }> = {
  '50g': { price: 99, originalPrice: 129, stock: 50 },
  '100g': { price: 180, originalPrice: 220, stock: 40 },
  '200g': { price: 340, originalPrice: 420, stock: 25 },
  '250g': { price: 399, originalPrice: 499, stock: 30 },
  '500g': { price: 699, originalPrice: 849, stock: 20 },
  '1kg': { price: 1299, originalPrice: 1599, stock: 15 },
};

interface ProductVariantEditorProps {
  variants: ProductWeightVariant[];
  onChange: (variants: ProductWeightVariant[]) => void;
  productName?: string;
  autoGenerateSku?: boolean;
}

const createVariant = (
  weight: string,
  productName: string,
  isDefault: boolean,
): ProductWeightVariant => {
  const preset = DEFAULT_PRICES[normalizeWeightLabel(weight)] || DEFAULT_PRICES['100g'];

  return {
    id: `var-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    weight,
    price: preset.price,
    originalPrice: preset.originalPrice,
    stock: preset.stock,
    sku: generateVariantSku(productName, weight),
    isDefault,
  };
};

export const ProductVariantEditor: React.FC<ProductVariantEditorProps> = ({
  variants,
  onChange,
  productName = '',
  autoGenerateSku = true,
}) => {
  const isPresetSelected = (preset: string) =>
    variants.some((variant) => normalizeWeightLabel(variant.weight) === normalizeWeightLabel(preset));

  const ensureDefaultVariant = (nextVariants: ProductWeightVariant[]) => {
    if (!nextVariants.length) {
      return nextVariants;
    }

    if (!nextVariants.some((variant) => variant.isDefault)) {
      return nextVariants.map((variant, index) => ({
        ...variant,
        isDefault: index === 0,
      }));
    }

    return nextVariants;
  };

  const togglePresetWeight = (preset: string) => {
    if (isPresetSelected(preset)) {
      if (variants.length <= 1) {
        return;
      }

      const filtered = variants.filter(
        (variant) => normalizeWeightLabel(variant.weight) !== normalizeWeightLabel(preset),
      );
      onChange(ensureDefaultVariant(filtered));
      return;
    }

    onChange(
      ensureDefaultVariant([
        ...variants,
        createVariant(preset, productName, variants.length === 0),
      ]),
    );
  };

  const handleAddVariant = () => {
    const fallbackWeight = WEIGHT_PRESETS.find((preset) => !isPresetSelected(preset)) || '250g';

    onChange([
      ...variants,
      createVariant(fallbackWeight, productName, variants.length === 0),
    ]);
  };

  const handleRemoveVariant = (id: string) => {
    if (variants.length <= 1) {
      return;
    }

    onChange(ensureDefaultVariant(variants.filter((variant) => variant.id !== id)));
  };

  const handleUpdateField = (
    id: string,
    field: keyof ProductWeightVariant,
    value: ProductWeightVariant[keyof ProductWeightVariant],
  ) => {
    const updated = variants.map((variant) => {
      if (variant.id !== id) {
        return variant;
      }

      const nextVariant = { ...variant, [field]: value };

      if (autoGenerateSku && field === 'weight' && typeof value === 'string') {
        nextVariant.sku = generateVariantSku(productName, value);
      }

      return nextVariant;
    });

    onChange(updated);
  };

  const handleSetDefault = (id: string) => {
    onChange(
      variants.map((variant) => ({
        ...variant,
        isDefault: variant.id === id,
      })),
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h4 className="text-sm font-bold text-[#173D2A] uppercase tracking-wider">
            Packaging Sizes & Pricing Variants
          </h4>
          <p className="text-xs text-[#736854] mt-0.5">
            Select one or more pack sizes below. Each weight gets its own price, stock, and SKU.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddVariant}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#173D2A] bg-[#F4EFE6] hover:bg-[#EAE2D2] border border-[#DCD4C0] rounded-lg transition-colors shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Custom Weight</span>
        </button>
      </div>

      <div className="p-3.5 rounded-xl border border-[#E8E2D5] bg-white">
        <p className="text-[10px] font-bold text-[#736854] uppercase tracking-wide mb-2">
          Quick Select Pack Sizes
        </p>
        <div className="flex flex-wrap gap-2">
          {WEIGHT_PRESETS.map((preset) => {
            const selected = isPresetSelected(preset);

            return (
              <button
                key={preset}
                type="button"
                onClick={() => togglePresetWeight(preset)}
                className={`px-3 py-1.5 text-xs font-bold rounded-full border transition-colors ${
                  selected
                    ? 'bg-[#173D2A] text-white border-[#173D2A]'
                    : 'bg-[#F9F7F2] text-[#5C5343] border-[#DCD4C0] hover:border-[#173D2A] hover:text-[#173D2A]'
                }`}
              >
                {selected ? '✓ ' : ''}
                {preset}
              </button>
            );
          })}
        </div>
        <p className="text-[11px] text-[#8F816B] mt-2">
          Click to toggle weights on or off. At least one pack size is required.
        </p>
      </div>

      <div className="space-y-2.5">
        {variants.map((variant) => (
          <div
            key={variant.id}
            className={`p-3.5 rounded-xl border transition-all ${
              variant.isDefault
                ? 'bg-[#F9F7F2] border-[#D99B26] ring-1 ring-[#D99B26]/30'
                : 'bg-white border-[#E8E2D5]'
            }`}
          >
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
              <div className="sm:col-span-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSetDefault(variant.id)}
                  title={variant.isDefault ? 'Default variant' : 'Click to make default'}
                  className={`p-1.5 rounded-lg transition-colors shrink-0 ${
                    variant.isDefault
                      ? 'bg-[#D99B26] text-[#173D2A]'
                      : 'bg-[#F4EFE6] text-[#8F816B] hover:text-[#173D2A]'
                  }`}
                >
                  <CheckCircle className="w-4 h-4" />
                </button>
                <div className="flex-1">
                  <label className="block text-[10px] font-bold text-[#736854] uppercase">
                    Weight / Pack
                  </label>
                  <input
                    type="text"
                    value={variant.weight}
                    onChange={(event) => handleUpdateField(variant.id, 'weight', event.target.value)}
                    placeholder="e.g. 100g or 1kg Pack"
                    className="w-full mt-0.5 px-2.5 py-1 text-xs font-semibold bg-white border border-[#DCD4C0] rounded-lg text-[#1A211D] focus:outline-none focus:border-[#173D2A]"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[10px] font-bold text-[#736854] uppercase">Price (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={variant.price}
                  onChange={(event) =>
                    handleUpdateField(variant.id, 'price', Number(event.target.value))
                  }
                  className="w-full mt-0.5 px-2.5 py-1 text-xs font-bold text-[#173D2A] bg-white border border-[#DCD4C0] rounded-lg focus:outline-none focus:border-[#173D2A]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[10px] font-bold text-[#736854] uppercase">MRP (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={variant.originalPrice}
                  onChange={(event) =>
                    handleUpdateField(variant.id, 'originalPrice', Number(event.target.value))
                  }
                  className="w-full mt-0.5 px-2.5 py-1 text-xs text-[#736854] bg-white border border-[#DCD4C0] rounded-lg focus:outline-none focus:border-[#173D2A]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[10px] font-bold text-[#736854] uppercase">Stock (Units)</label>
                <input
                  type="number"
                  min="0"
                  value={variant.stock}
                  onChange={(event) =>
                    handleUpdateField(variant.id, 'stock', Number(event.target.value))
                  }
                  className={`w-full mt-0.5 px-2.5 py-1 text-xs font-semibold bg-white border rounded-lg focus:outline-none ${
                    variant.stock <= 15
                      ? 'border-[#9E382B] text-[#9E382B]'
                      : 'border-[#DCD4C0] text-[#1A211D]'
                  }`}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[10px] font-bold text-[#736854] uppercase">SKU Code</label>
                <input
                  type="text"
                  value={variant.sku || ''}
                  readOnly={autoGenerateSku}
                  onChange={(event) => handleUpdateField(variant.id, 'sku', event.target.value)}
                  placeholder="ENU-PRODUCT-100G"
                  className={`w-full mt-0.5 px-2 py-1 text-xs text-[#5C5343] border border-[#DCD4C0] rounded-lg focus:outline-none focus:border-[#173D2A] ${
                    autoGenerateSku ? 'bg-[#F9F7F2] cursor-default' : 'bg-white'
                  }`}
                />
              </div>

              <div className="sm:col-span-1 flex justify-end">
                <button
                  type="button"
                  disabled={variants.length <= 1}
                  onClick={() => handleRemoveVariant(variant.id)}
                  className="p-1.5 text-[#9E382B] hover:bg-[#FDF0EE] rounded-lg disabled:opacity-30 disabled:pointer-events-none transition-colors"
                  title="Remove variant"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
