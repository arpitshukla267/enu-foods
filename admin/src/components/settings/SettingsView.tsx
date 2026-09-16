import React, { useState } from 'react';
import { 
  Settings, 
  Store, 
  Truck, 
  Receipt, 
  Database, 
  Save, 
  Download, 
  Upload, 
  RefreshCw, 
  Check, 
  AlertTriangle 
} from 'lucide-react';
import { StoreSettings } from '../../types';
import { ConfirmDialog } from '../common/ConfirmDialog';

interface SettingsViewProps {
  settings: StoreSettings;
  onSaveSettings: (newSettings: StoreSettings) => void;
  onExportData: () => void;
  onImportData: (jsonData: string) => void;
  onResetSeedData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onSaveSettings,
  onExportData,
  onImportData,
  onResetSeedData
}) => {
  const [formData, setFormData] = useState<StoreSettings>({ ...settings });
  const [isSaved, setIsSaved] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        onImportData(content);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-[#E8E2D5] shadow-xs">
        <div>
          <h2 className="text-xl font-semibold text-[#173D2A] font-serif-brand">
            Store Settings & Operations Logistics
          </h2>
          <p className="text-xs text-[#736854] mt-0.5">
            Configure brand parameters, shipping thresholds, GST billing rates, and backup data.
          </p>
        </div>

        {isSaved && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#EBF5EE] text-[#173D2A] text-xs font-medium border border-[#C3DEC9]">
            <Check className="w-4 h-4" />
            <span>Settings Saved!</span>
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Brand Information */}
        <div className="bg-white p-6 rounded-xl border border-[#E8E2D5] shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#F0EBE0] text-sm font-medium text-[#173D2A] uppercase tracking-wider">
            <Store className="w-4 h-4 text-[#D99B26]" />
            <span>Brand Profile & Support Information</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#1A211D] uppercase">Store Brand Name</label>
              <input
                type="text"
                value={formData.storeName}
                onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                className="w-full mt-1 px-3 py-2 text-xs bg-[#F9F7F2] border border-[#DCD4C0] rounded-xl text-[#1A211D] font-medium focus:outline-none focus:border-[#173D2A]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#1A211D] uppercase">Currency Symbol</label>
              <input
                type="text"
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full mt-1 px-3 py-2 text-xs bg-[#F9F7F2] border border-[#DCD4C0] rounded-xl text-[#1A211D] font-medium focus:outline-none focus:border-[#173D2A]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#1A211D] uppercase">Customer Support Email</label>
              <input
                type="email"
                value={formData.supportEmail}
                onChange={(e) => setFormData({ ...formData, supportEmail: e.target.value })}
                className="w-full mt-1 px-3 py-2 text-xs bg-[#F9F7F2] border border-[#DCD4C0] rounded-xl text-[#1A211D] focus:outline-none focus:border-[#173D2A]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#1A211D] uppercase">Customer Support Phone</label>
              <input
                type="text"
                value={formData.supportPhone}
                onChange={(e) => setFormData({ ...formData, supportPhone: e.target.value })}
                className="w-full mt-1 px-3 py-2 text-xs bg-[#F9F7F2] border border-[#DCD4C0] rounded-xl text-[#1A211D] focus:outline-none focus:border-[#173D2A]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-[#1A211D] uppercase">Physical Origin Address (Packaging & Processing Unit)</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full mt-1 px-3 py-2 text-xs bg-[#F9F7F2] border border-[#DCD4C0] rounded-xl text-[#1A211D] focus:outline-none focus:border-[#173D2A]"
              />
            </div>
          </div>
        </div>

        {/* Shipping & Delivery Rules */}
        <div className="bg-white p-6 rounded-xl border border-[#E8E2D5] shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#F0EBE0] text-sm font-medium text-[#173D2A] uppercase tracking-wider">
            <Truck className="w-4 h-4 text-[#D99B26]" />
            <span>Shipping & Packaging Logistics</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#1A211D] uppercase">
                Free Shipping Threshold (₹)
              </label>
              <input
                type="number"
                min="0"
                value={formData.freeShippingThreshold}
                onChange={(e) => setFormData({ ...formData, freeShippingThreshold: Number(e.target.value) })}
                className="w-full mt-1 px-3 py-2 text-xs font-medium text-[#173D2A] bg-[#F9F7F2] border border-[#DCD4C0] rounded-xl focus:outline-none focus:border-[#173D2A]"
              />
              <p className="text-[11px] text-[#736854] mt-1">Orders at or above receive Free Shipping.</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#1A211D] uppercase">
                Standard Shipping Fee (₹)
              </label>
              <input
                type="number"
                min="0"
                value={formData.standardShippingFee}
                onChange={(e) => setFormData({ ...formData, standardShippingFee: Number(e.target.value) })}
                className="w-full mt-1 px-3 py-2 text-xs font-medium text-[#173D2A] bg-[#F9F7F2] border border-[#DCD4C0] rounded-xl focus:outline-none focus:border-[#173D2A]"
              />
              <p className="text-[11px] text-[#736854] mt-1">Charged for standard shipping below threshold.</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#1A211D] uppercase">
                Express Shipping Fee (₹)
              </label>
              <input
                type="number"
                min="0"
                value={formData.expressShippingFee ?? 49}
                onChange={(e) => setFormData({ ...formData, expressShippingFee: Number(e.target.value) })}
                className="w-full mt-1 px-3 py-2 text-xs font-medium text-[#173D2A] bg-[#F9F7F2] border border-[#DCD4C0] rounded-xl focus:outline-none focus:border-[#173D2A]"
              />
              <p className="text-[11px] text-[#736854] mt-1">Charged for 24–36 hrs Priority Air delivery.</p>
            </div>
          </div>
        </div>

        {/* Tax & Invoicing */}
        <div className="bg-white p-6 rounded-xl border border-[#E8E2D5] shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#F0EBE0] text-sm font-medium text-[#173D2A] uppercase tracking-wider">
            <Receipt className="w-4 h-4 text-[#D99B26]" />
            <span>GST & Tax Invoicing</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#1A211D] uppercase">GSTIN / Tax ID Number</label>
              <input
                type="text"
                value={formData.gstNumber}
                onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
                className="w-full mt-1 px-3 py-2 text-xs font-mono bg-[#F9F7F2] border border-[#DCD4C0] rounded-xl text-[#1A211D] focus:outline-none focus:border-[#173D2A]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#1A211D] uppercase">Spice GST Rate (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.taxRatePercent}
                onChange={(e) => setFormData({ ...formData, taxRatePercent: Number(e.target.value) })}
                className="w-full mt-1 px-3 py-2 text-xs font-medium text-[#173D2A] bg-[#F9F7F2] border border-[#DCD4C0] rounded-xl focus:outline-none focus:border-[#173D2A]"
              />
              <p className="text-[11px] text-[#736854] mt-1">Standard rate is 5% (custom GST rates up to 100% supported).</p>
            </div>
          </div>
        </div>

        {/* Save Settings Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 text-xs font-medium text-white bg-[#173D2A] hover:bg-[#0F281B] rounded-xl shadow-sm transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4 text-[#D99B26]" />
            <span>Save Store Configuration</span>
          </button>
        </div>
      </form>

      {/* Data Management Section */}
      <div className="bg-white p-6 rounded-xl border border-[#E8E2D5] shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-[#F0EBE0] text-sm font-medium text-[#173D2A] uppercase tracking-wider">
          <Database className="w-4 h-4 text-[#D99B26]" />
          <span>Catalog Backup & Data Management</span>
        </div>

        <p className="text-xs text-[#736854]">
          Download a complete snapshot of all products, combos, categories, orders, and customer accounts to JSON, or restore from a previous backup file.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          {/* Export JSON */}
          <button
            type="button"
            onClick={onExportData}
            className="px-4 py-2 text-xs font-medium text-[#173D2A] bg-[#F4EFE6] hover:bg-[#EAE2D2] border border-[#DCD4C0] rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Download className="w-4 h-4 text-[#D99B26]" />
            <span>Export Store JSON Backup</span>
          </button>

          {/* Import JSON */}
          <label className="px-4 py-2 text-xs font-medium text-[#173D2A] bg-[#F4EFE6] hover:bg-[#EAE2D2] border border-[#DCD4C0] rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer">
            <Upload className="w-4 h-4 text-[#173D2A]" />
            <span>Import JSON Backup</span>
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          {/* Reset Seed Data */}
          <button
            type="button"
            onClick={() => setIsResetConfirmOpen(true)}
            className="px-4 py-2 text-xs font-medium text-[#9E382B] bg-[#FDF0EE] hover:bg-[#FCE6E3] border border-[#F5C7C1] rounded-xl transition-colors flex items-center gap-1.5 ml-auto"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset Demo Store Data</span>
          </button>
        </div>
      </div>

      {/* Reset Confirmation */}
      <ConfirmDialog
        isOpen={isResetConfirmOpen}
        title="Reset All Storefront Data?"
        message="This will overwrite current products, combos, and mock orders with fresh initial seed data. Are you sure?"
        confirmLabel="Reset Everything"
        cancelLabel="Cancel"
        isDestructive={true}
        onConfirm={() => {
          onResetSeedData();
          setIsResetConfirmOpen(false);
        }}
        onCancel={() => setIsResetConfirmOpen(false)}
      />
    </div>
  );
};
