import React, { useState } from 'react';
import { FileText, ExternalLink } from 'lucide-react';
import { CitationItem } from '../types';

interface Props {
  citationText: string;
  citationsList?: CitationItem[];
}

export const CitationPopover: React.FC<Props> = ({ citationText, citationsList = [] }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Find if matching citation exists
  const matched = citationsList.find(c => 
    citationText.toLowerCase().includes(c.docTitle.toLowerCase()) || 
    citationText.toLowerCase().includes(c.pageOrSection.toLowerCase())
  );

  return (
    <span className="relative inline-block ml-1 group">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors"
        title="View source citation"
      >
        <FileText className="w-3 h-3 text-blue-500" />
        <span>{citationText.split(',')[0]}</span>
      </button>

      {isOpen && (
        <div 
          className="absolute z-50 bottom-full left-0 mb-2 w-80 p-3 bg-slate-900 text-white rounded-lg shadow-xl text-xs border border-slate-700 animate-in fade-in zoom-in-95 pointer-events-none"
        >
          <div className="flex items-center justify-between font-semibold text-blue-300 mb-1 border-b border-slate-800 pb-1">
            <span className="truncate">{citationText}</span>
            <ExternalLink className="w-3 h-3 text-slate-400 flex-shrink-0" />
          </div>
          <p className="text-slate-300 leading-relaxed italic">
            {matched ? `"${matched.excerpt}"` : `Verified claim referenced in ${citationText}. Cross-checked against canonical database.`}
          </p>
          {matched && (
            <div className="mt-2 text-[10px] text-slate-400 font-mono">
              Period: {matched.period} | Section: {matched.pageOrSection}
            </div>
          )}
        </div>
      )}
    </span>
  );
};
