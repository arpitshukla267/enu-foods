import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = true,
  onConfirm,
  onCancel
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-[#111A15]/60 backdrop-blur-xs"
            onClick={onCancel}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative w-full max-w-md bg-[#FFFFFF] rounded-2xl border border-[#E8E2D5] shadow-2xl p-6 overflow-hidden z-10 my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onCancel}
              className="absolute top-4 right-4 p-1.5 rounded-xl text-[#7A7160] hover:text-[#173D2A] hover:bg-[#F4EFE6] transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-full shrink-0 ${isDestructive ? 'bg-[#FDF0EE] text-[#9E382B]' : 'bg-[#FBF5E6] text-[#D99B26]'}`}>
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="flex-1 pr-4">
                <h3 className="text-lg font-semibold text-[#1A211D] tracking-tight">
                  {title}
                </h3>
                <p className="mt-2 text-sm text-[#5C5343] leading-relaxed">
                  {message}
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-[#F0EBE0]">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-xs font-medium text-[#4A4130] bg-[#F4EFE6] hover:bg-[#EAE3D4] rounded-xl transition-colors"
              >
                {cancelLabel}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className={`px-4 py-2 text-xs font-medium text-white rounded-xl transition-colors shadow-xs ${
                  isDestructive
                    ? 'bg-[#9E382B] hover:bg-[#852C20]'
                    : 'bg-[#173D2A] hover:bg-[#112E20]'
                }`}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
