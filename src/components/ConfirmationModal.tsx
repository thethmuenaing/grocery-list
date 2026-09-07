import React from 'react';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { ModalConfig } from '../types';

interface ConfirmationModalProps {
  config: ModalConfig;
  onClose: () => void;
  onConfirm: () => void;
  purchasedCount?: number;
  totalCount?: number;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  config,
  onClose,
  onConfirm,
  purchasedCount = 0,
  totalCount = 0,
}) => {
  const { t } = useTranslation();

  if (!config.isOpen || !config.type) return null;

  let title = '';
  let message = '';
  let confirmBtnText = t('confirmDelete');

  if (config.type === 'delete_one') {
    title = t('confirmDeleteTitle');
    message = t('confirmDeleteMsg', { name: config.targetName || '' });
    confirmBtnText = t('confirmDelete');
  } else if (config.type === 'clear_purchased') {
    title = t('confirmClearPurchasedTitle');
    message = t('confirmClearPurchasedMsg', { count: purchasedCount });
    confirmBtnText = t('confirmClear');
  } else if (config.type === 'clear_all') {
    title = t('confirmClearAllTitle');
    message = t('confirmClearAllMsg', { count: totalCount });
    confirmBtnText = t('confirmClear');
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-sm p-5 sm:p-6 border border-slate-200 dark:border-slate-700 shadow-xl relative animate-scaleUp">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Warning Icon */}
        <div className="w-11 h-11 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-3.5 border border-rose-100 dark:border-rose-900/50">
          <AlertTriangle className="w-5 h-5" />
        </div>

        {/* Content */}
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">
          {title}
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-5">
          {message}
        </p>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            {t('cancel')}
          </button>
          <button
            id="confirm-modal-action-btn"
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{confirmBtnText}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
