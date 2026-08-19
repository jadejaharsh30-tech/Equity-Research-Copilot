import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  companyName: string;
  ticker?: string;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  companyName,
  ticker
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
        <div className="flex items-start justify-between">
          <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100 shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4">
          <h3 className="text-base font-bold text-slate-900 font-heading">
            Delete Coverage Workspace?
          </h3>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            Are you sure you want to permanently remove <strong className="text-slate-800">{companyName}</strong> {ticker ? `(${ticker})` : ''} and all its indexed filings, research notes, con-call transcripts, and generated investment models from your coverage universe?
          </p>
        </div>

        <div className="flex items-center justify-end gap-2.5 mt-6 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="inline-flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Confirm Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};
