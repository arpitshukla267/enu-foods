import React from "react";
import { Plus, Trash2 } from "lucide-react";

interface DynamicTextListFieldProps {
  label: string;
  hint?: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
  multiline?: boolean;
  addLabel?: string;
}

const createEmptyItem = () => "";

export const DynamicTextListField: React.FC<DynamicTextListFieldProps> = ({
  label,
  hint,
  items,
  onChange,
  placeholder = "Enter text...",
  multiline = false,
  addLabel = "Add",
}) => {
  const rows = items.length > 0 ? items : [createEmptyItem()];

  const updateItem = (index: number, value: string) => {
    onChange(rows.map((item, itemIndex) => (itemIndex === index ? value : item)));
  };

  const removeItem = (index: number) => {
    const next = rows.filter((_, itemIndex) => itemIndex !== index);
    onChange(next.length > 0 ? next : [createEmptyItem()]);
  };

  const addItem = () => {
    onChange([...rows, createEmptyItem()]);
  };

  return (
    <div className="space-y-3 rounded-2xl border border-[#E8E2D5] bg-[#FAF8F5] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <label className="block text-xs font-bold text-[#1A211D] uppercase tracking-wide">
            {label}
          </label>
          {hint && <p className="text-[11px] text-[#736854] mt-0.5">{hint}</p>}
        </div>
        <button
          type="button"
          onClick={addItem}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-[#173D2A] bg-[#F4EFE6] border border-[#DCD4C0] rounded-xl hover:bg-[#EAE2D2] transition-colors shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          {addLabel}
        </button>
      </div>

      <div className="space-y-2">
        {rows.map((item, index) => (
          <div key={index} className="flex items-start gap-2">
            <span className="w-6 h-6 rounded-full bg-[#173D2A] text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-2">
              {index + 1}
            </span>

            {multiline ? (
              <textarea
                rows={2}
                value={item}
                onChange={(event) => updateItem(index, event.target.value)}
                placeholder={placeholder}
                className="flex-1 px-3 py-2 text-sm bg-white border border-[#DCD4C0] rounded-xl focus:outline-none focus:border-[#173D2A] resize-y min-h-[72px]"
              />
            ) : (
              <input
                type="text"
                value={item}
                onChange={(event) => updateItem(index, event.target.value)}
                placeholder={placeholder}
                className="flex-1 px-3 py-2 text-sm bg-white border border-[#DCD4C0] rounded-xl focus:outline-none focus:border-[#173D2A]"
              />
            )}

            <button
              type="button"
              onClick={() => removeItem(index)}
              className="p-2 text-[#9E382B] hover:bg-[#FDF0EE] rounded-lg transition-colors shrink-0 mt-0.5"
              aria-label={`Remove ${label.toLowerCase()} item`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export const normalizeTextList = (items: string[]) =>
  items.map((item) => item.trim()).filter(Boolean);

export const textListFromArray = (items: string[]) => (items.length > 0 ? items : [""]);
