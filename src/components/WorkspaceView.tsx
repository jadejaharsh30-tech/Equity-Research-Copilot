import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TurnaroundRiskTab } from './TurnaroundRiskTab';
import { DeepDiveView } from './DeepDiveView';
import { WorkflowDrawer } from './WorkflowDrawer';
import { PromptConfigModal } from './PromptConfigModal';
import { AuditLogModal } from './AuditLogModal';
import { InitiateCoverageModal } from './InitiateCoverageModal';
import { EditCompanyModal } from './EditCompanyModal';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';
import { 
  Sparkles, 
  Download, 
  Clock, 
  SlidersHorizontal, 
  Target, 
  ChevronRight, 
  ChevronDown,
  Table as TableIcon,
  HelpCircle,
  FileSpreadsheet,
  FileText,
  Layers,
  Building2,
  Plus,
  Edit3,
  Trash2
} from 'lucide-react';

export const WorkspaceView: React.FC = () => {
  const { 
    companies,
    activeCompany, 
    setActiveCompanyId,
    setViewMode,
    activeTab, 
    setActiveTab, 
    setActiveDeepDiveSubTab,
    isAnalyzing, 
    runAnalysis, 
    currentUser,
    deleteCompany,
    handleExportPdf,
    handleExportFinancialsCsv
  } = useApp();

  const [showPromptConfig, setShowPromptConfig] = useState(false);
  const [showAuditLogs, setShowAuditLogs] = useState(false);
  const [showGuideDrawer, setShowGuideDrawer] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showInitiateModal, setShowInitiateModal] = useState(false);
  const [showEditCompanyModal, setShowEditCompanyModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);

  if (!activeCompany) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 text-center shadow-xs">
          <div className="w-14 h-14 bg-slate-100 text-slate-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-200/60">
            <Building2 className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 font-heading tracking-tight">Institutional Research Workspace</h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1.5 mb-6 leading-relaxed">
            Initiate a new coverage company to begin multi-document financial modeling, con-call synthesis, and turnaround tracking, or open your existing coverage universe.
          </p>

          <div className="flex items-center justify-center gap-3 flex-wrap">
            <button
              onClick={() => setShowInitiateModal(true)}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Initiate New Coverage</span>
            </button>
            <button
              onClick={() => setViewMode('coverage')}
              className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 transition-all cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5 text-slate-500" />
              <span>View Coverage Universe ({companies.length})</span>
            </button>
          </div>
        </div>

        <InitiateCoverageModal 
          isOpen={showInitiateModal}
          onClose={() => setShowInitiateModal(false)}
        />
      </div>
    );
  }

  const thesis = activeCompany.latestAnalysis?.investmentThesis;
  const rec = thesis?.recommendation || 'BUY';

  const getRecBadge = (r: string) => {
    if (r.includes('BUY')) return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    if (r === 'HOLD') return 'bg-amber-100 text-amber-800 border-amber-300';
    return 'bg-rose-100 text-rose-800 border-rose-300';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-3.5">

      {/* Compact Executive Header Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3.5 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          
          {/* Company Identity */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-sm tracking-wider shadow-2xs shrink-0">
              {activeCompany.logoText || activeCompany.ticker.slice(0, 3)}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg font-extrabold text-slate-900 tracking-tight">
                  {activeCompany.name}
                </h1>
                <span className="font-mono text-[11px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                  {activeCompany.ticker}
                </span>
                <span className={`px-2 py-0.2 rounded text-[10px] font-extrabold uppercase border ${getRecBadge(rec)}`}>
                  {rec}
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5 flex-wrap">
                <span>{activeCompany.exchange}</span>
                <span>•</span>
                <span className="font-medium text-slate-700">{activeCompany.sector}</span>
                <span>•</span>
                <span>{activeCompany.industry}</span>
                <span>•</span>
                <span className="text-[11px] font-mono text-slate-400">Model: {activeCompany.latestAnalysis?.version || 'v1.0'}</span>
              </div>
            </div>
          </div>

          {/* Pricing Strip & Controls */}
          <div className="flex items-center justify-between lg:justify-end gap-2.5 flex-wrap sm:flex-nowrap">
            
            {/* Quick Financial Snapshot Metrics */}
            <div className="flex items-center gap-2.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/80 text-xs">
              <div>
                <span className="text-[9px] uppercase font-semibold text-slate-400 block leading-none">CMP</span>
                <span className="font-black text-slate-900 text-xs">
                  {activeCompany.currency} {activeCompany.currentPrice.toLocaleString()}
                </span>
              </div>

              <div className="h-5 w-px bg-slate-200"></div>

              <div>
                <span className="text-[9px] uppercase font-semibold text-slate-400 block leading-none">Target (12M)</span>
                <div className="flex items-center gap-1">
                  <span className={`font-black text-xs ${thesis?.targetPrice ? 'text-blue-600' : 'text-slate-400 italic'}`}>
                    {thesis?.targetPrice ? `${activeCompany.currency} ${thesis.targetPrice}` : 'Unmodeled'}
                  </span>
                  {thesis?.impliedUpsidePct ? (
                    <span className="text-[9px] font-bold text-emerald-600">
                      +{thesis.impliedUpsidePct}%
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="h-5 w-px bg-slate-200"></div>

              <div>
                <span className="text-[9px] uppercase font-semibold text-slate-400 block leading-none">Market Cap</span>
                <span className="font-semibold text-slate-700 text-xs">
                  ₹{activeCompany.marketCapCr.toLocaleString()} Cr
                </span>
              </div>
            </div>

            {/* Utility Actions (Guide, Config, Audit, Unified Export) */}
            <div className="flex items-center gap-1.5">
              
              {/* Interactive Guide Trigger */}
              <button
                onClick={() => setShowGuideDrawer(true)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-indigo-50 hover:bg-indigo-100/80 text-indigo-700 border border-indigo-200/70 transition-colors cursor-pointer"
                title="Interactive Guide & Workflow"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Guide</span>
              </button>

              {currentUser.role === 'admin' && (
                <>
                  <button
                    onClick={() => setShowEditCompanyModal(true)}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                    title="Edit Company Profile & Market Inputs"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                  </button>

                  <button
                    onClick={() => setShowPromptConfig(true)}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                    title="Configure Gemini Prompts"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5 text-purple-600" />
                  </button>

                  <button
                    onClick={() => setShowDeleteConfirmModal(true)}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                    title="Delete Workspace / Remove from Coverage"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </>
              )}

              <button
                onClick={() => setShowAuditLogs(true)}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                title="Audit Trail"
              >
                <Clock className="w-3.5 h-3.5 text-blue-600" />
              </button>

              {/* Unified Export Menu Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-slate-600" />
                  <span>Export</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {showExportMenu && (
                  <div className="absolute right-0 mt-1 w-52 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-30 animate-in fade-in">
                    <button
                      onClick={() => {
                        handleExportPdf();
                        setShowExportMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5 text-rose-600" />
                      <span>Research Note (PDF)</span>
                    </button>
                    <button
                      onClick={() => {
                        handleExportFinancialsCsv();
                        setShowExportMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Financial Statements (CSV)</span>
                    </button>
                  </div>
                )}
              </div>

              {currentUser.role !== 'viewer' && (
                <button
                  onClick={() => runAnalysis(activeCompany.id)}
                  disabled={isAnalyzing}
                  className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg font-bold text-xs shadow-2xs transition-all disabled:opacity-50 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isAnalyzing ? 'Running...' : 'Run Pipeline'}</span>
                </button>
              )}
            </div>

          </div>

        </div>
      </div>

      {/* In-Progress Synthesis Progress Banner */}
      {isAnalyzing && (
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 rounded-xl shadow-xs animate-pulse flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Sparkles className="w-4 h-4 animate-spin" />
            <div>
              <div className="font-bold text-xs">Gemini Multi-Step Synthesis Pipeline Running...</div>
              <div className="text-[11px] text-blue-100">Cross-examining audited financial models & qualitative transcript claims</div>
            </div>
          </div>
          <span className="text-[10px] bg-white/20 px-2.5 py-0.5 rounded-full font-mono font-semibold">
            gemini-3.7-flash
          </span>
        </div>
      )}

      {/* Progressive 2-Mode Primary Selector */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="inline-flex bg-slate-100 p-1 rounded-xl border border-slate-200/80">
          
          {/* Mode A: Quick Memo (Default / Lightweight) */}
          <button
            onClick={() => setActiveTab('quick_memo')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'quick_memo'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <TableIcon className="w-3.5 h-3.5 text-teal-600" />
            <span>Mode A: Quick Memo (Turnaround / Risk Table)</span>
          </button>

          {/* Mode B: Deep Dive (Comprehensive Research) */}
          <button
            onClick={() => setActiveTab('deep_dive')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'deep_dive'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Target className="w-3.5 h-3.5 text-blue-600" />
            <span>Mode B: Deep Dive Research</span>
          </button>

        </div>

        <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-400 font-medium">
          <span>{activeTab === 'quick_memo' ? 'Executive 2-Column Summary Mode' : 'Institutional Multi-Module Analysis'}</span>
        </div>
      </div>

      {/* Main Mode Viewport */}
      <div className="transition-all">
        {activeTab === 'quick_memo' && <TurnaroundRiskTab />}
        {activeTab === 'deep_dive' && <DeepDiveView />}
      </div>

      {/* Interactive Guide Slide-over Drawer */}
      <WorkflowDrawer 
        isOpen={showGuideDrawer}
        onClose={() => setShowGuideDrawer(false)}
        onSelectTab={({ tab, mode }) => {
          setActiveTab(mode);
          if (setActiveDeepDiveSubTab && tab) {
            setActiveDeepDiveSubTab(tab);
          }
        }}
      />

      {/* Admin Modals */}
      <PromptConfigModal 
        isOpen={showPromptConfig} 
        onClose={() => setShowPromptConfig(false)} 
      />

      <AuditLogModal 
        isOpen={showAuditLogs} 
        onClose={() => setShowAuditLogs(false)} 
      />

      {/* Edit Company Profile & Market Inputs */}
      {activeCompany && (
        <EditCompanyModal
          isOpen={showEditCompanyModal}
          onClose={() => setShowEditCompanyModal(false)}
          company={activeCompany}
        />
      )}

      {/* Delete Workspace Confirmation Modal */}
      {activeCompany && (
        <ConfirmDeleteModal
          isOpen={showDeleteConfirmModal}
          onClose={() => setShowDeleteConfirmModal(false)}
          onConfirm={() => {
            deleteCompany(activeCompany.id);
            setShowDeleteConfirmModal(false);
          }}
          companyName={activeCompany.name}
          ticker={activeCompany.ticker}
        />
      )}

    </div>
  );
};
