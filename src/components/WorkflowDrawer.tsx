import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Sparkles, 
  Table as TableIcon, 
  Target, 
  FileSpreadsheet, 
  FileText, 
  Newspaper, 
  ArrowRight, 
  UploadCloud, 
  CheckCircle2, 
  Download, 
  SlidersHorizontal, 
  Clock, 
  Lightbulb, 
  TrendingUp, 
  ShieldCheck, 
  PlayCircle,
  HelpCircle,
  Laptop,
  ExternalLink
} from 'lucide-react';

interface WorkflowDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab?: (tab: any) => void;
}

export const WorkflowDrawer: React.FC<WorkflowDrawerProps> = ({
  isOpen,
  onClose,
  onSelectTab
}) => {
  const { setViewMode, activeCompany, runAnalysis, isAnalyzing } = useApp();

  if (!isOpen) return null;

  const steps = [
    {
      step: '01',
      title: 'Upload Documents & Ingest Research',
      icon: <UploadCloud className="w-4 h-4 text-blue-600" />,
      tabKey: 'ingestion',
      mode: 'deep_dive' as const,
      description: 'Upload quarterly concall transcripts, broker notes, investor decks, or annual reports (PDF, PNG, JPG, WEBP) for OCR extraction and entity parsing.',
      actionLabel: 'Go to Documents'
    },
    {
      step: '02',
      title: 'Generate Turnaround / Risk Table',
      icon: <TableIcon className="w-4 h-4 text-teal-600" />,
      tabKey: 'table',
      mode: 'quick_memo' as const,
      description: 'Create an executive 2-column turnaround vs. key problem table branded for Wealth Mantra (Red) or Growth Mantra (Teal) with instant PNG export.',
      actionLabel: 'Open Quick Table'
    },
    {
      step: '03',
      title: 'Run Gemini Synthesis Pipeline',
      icon: <Sparkles className="w-4 h-4 text-purple-600" />,
      tabKey: 'thesis',
      mode: 'deep_dive' as const,
      description: 'Cross-examine audited financials against management commentary to uncover guidance drift, competitive moat, and 3-scenario valuations.',
      actionLabel: 'View Thesis'
    },
    {
      step: '04',
      title: 'Inspect Standardized Financials',
      icon: <FileSpreadsheet className="w-4 h-4 text-emerald-600" />,
      tabKey: 'financials',
      mode: 'deep_dive' as const,
      description: 'Audit Multi-Year P&L, Balance Sheet, Free Cash Flows, margin progression charts, and export sanitized CSV spreadsheets.',
      actionLabel: 'View Financials'
    },
    {
      step: '05',
      title: 'Track News & Sentiment Impact',
      icon: <Newspaper className="w-4 h-4 text-amber-600" />,
      tabKey: 'sentiment',
      mode: 'deep_dive' as const,
      description: 'Automated real-time sentiment scoring with event classification (Capex, Regulatory, Results) and ad-hoc news headline stress testing.',
      actionLabel: 'Check Sentiment'
    },
    {
      step: '06',
      title: 'Export Institutional Note & Compare',
      icon: <Download className="w-4 h-4 text-rose-600" />,
      tabKey: 'thesis',
      mode: 'deep_dive' as const,
      description: 'Generate multi-page PDF research memos with complete audit trails and benchmark multiples side-by-side in Peer Compare mode.',
      actionLabel: 'Peer Compare',
      onAction: () => {
        setViewMode('compare');
        onClose();
      }
    }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
          {/* Drawer Header */}
          <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-400/30">
                <PlayCircle className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-extrabold text-white">Platform Guide & Workflow</h2>
                <p className="text-[11px] text-slate-400">Step-by-step operating procedure</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            
            {/* Quick Overview Pill Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-600">
              <p className="font-semibold text-slate-900 mb-1">
                How to use Equity Research Copilot:
              </p>
              <p className="text-[11px] leading-relaxed text-slate-500">
                Use <strong>Quick Memo</strong> for fast 2-column turnaround & risk tables, or switch to <strong>Deep Dive</strong> for full financial modeling, con-call breakdown, and scenario price targets.
              </p>
            </div>

            {/* Steps List */}
            <div className="space-y-3">
              {steps.map((s, idx) => (
                <div 
                  key={idx}
                  className="bg-white border border-slate-200 rounded-xl p-3.5 hover:border-slate-300 transition-all shadow-2xs"
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-black text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                        {s.step}
                      </span>
                      <div className="p-1 rounded bg-slate-50 border border-slate-100">
                        {s.icon}
                      </div>
                      <h3 className="text-xs font-bold text-slate-900 leading-tight">
                        {s.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 leading-relaxed mb-2.5">
                    {s.description}
                  </p>

                  <div className="flex items-center justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        if (s.onAction) {
                          s.onAction();
                        } else if (onSelectTab) {
                          onSelectTab({ tab: s.tabKey, mode: s.mode });
                          onClose();
                        }
                      }}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-2.5 py-1 rounded transition-colors cursor-pointer"
                    >
                      <span>{s.actionLabel}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Tips */}
            <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-3 text-[11px] text-blue-900 space-y-1.5">
              <div className="font-bold flex items-center gap-1 text-blue-950">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                <span>Analyst Tip:</span>
              </div>
              <p className="text-slate-600 leading-normal">
                You can directly export high-resolution PNG tables from Quick Memo for executive decks, or full multi-page PDF notes from Deep Dive using the top Export menu.
              </p>
            </div>

          </div>

          {/* Drawer Footer */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">Equity Research Copilot v2.0</span>
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-bold bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Close Guide
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
