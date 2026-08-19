import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Building2, 
  TrendingUp, 
  Layers, 
  HelpCircle
} from 'lucide-react';
import { WorkflowDrawer } from './WorkflowDrawer';

export const Header: React.FC = () => {
  const { 
    viewMode, 
    setViewMode, 
    companies, 
    activeCompany, 
    setActiveCompanyId,
    setActiveTab,
    setActiveDeepDiveSubTab
  } = useApp();

  const [showGuide, setShowGuide] = useState(false);

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between min-h-16 py-2 gap-3 flex-wrap md:flex-nowrap">
          
          {/* Logo & Platform Name - Clickable Home Trigger */}
          <button 
            onClick={() => {
              setViewMode('workspace');
              setActiveTab('quick_memo');
            }}
            className="flex items-center space-x-3 shrink-0 text-left hover:opacity-90 transition-opacity cursor-pointer focus:outline-none group"
            title="Go to Home / Workspace"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-sky-400 flex items-center justify-center shadow-md shadow-blue-500/20 font-black text-sm text-white shrink-0 group-hover:scale-105 transition-transform">
              EC
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading text-base sm:text-lg font-bold tracking-tight text-white whitespace-nowrap group-hover:text-blue-200 transition-colors">
                  Equity Research Copilot
                </span>
                <span className="hidden lg:inline-block text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  Institutional AI
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Cross-Document Financial Ingestion & Thesis Engine</p>
            </div>
          </button>

          {/* Navigation Modes */}
          <nav className="flex items-center space-x-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/80 shrink-0">
            <button
              onClick={() => setViewMode('workspace')}
              className={`flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'workspace' 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Workspace</span>
            </button>

            <button
              onClick={() => setViewMode('coverage')}
              className={`flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'coverage' 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Coverage ({companies.length})</span>
            </button>

            <button
              onClick={() => setViewMode('compare')}
              className={`flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'compare' 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Peer </span><span>Compare</span>
            </button>
          </nav>

          {/* User Account & Controls */}
          <div className="flex items-center space-x-2 shrink-0">
            {/* Interactive Guide Trigger in Header */}
            <button
              onClick={() => setShowGuide(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/40 transition-all cursor-pointer shadow-2xs"
            >
              <HelpCircle className="w-3.5 h-3.5 text-indigo-300" />
              <span>Guide</span>
            </button>

            {/* Active Company Quick Switcher */}
            {viewMode === 'workspace' && activeCompany && companies.length > 1 && (
              <div className="hidden xl:flex items-center bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-300">
                <span className="text-slate-400 mr-1 text-[11px]">Viewing:</span>
                <select
                  value={activeCompany.id}
                  onChange={(e) => setActiveCompanyId(e.target.value)}
                  className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer pr-1 text-xs max-w-[140px] truncate"
                >
                  {companies.map(c => (
                    <option key={c.id} value={c.id} className="bg-slate-900 text-white">
                      {c.ticker} — {c.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* User Profile display */}
            <div className="flex items-center space-x-2 bg-slate-800/80 border border-slate-700/80 px-2.5 py-1 rounded-xl shrink-0">
              <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center font-bold text-[11px] text-white">
                HR
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-xs font-semibold text-slate-200 leading-tight">Harsh Raj</div>
                <div className="flex items-center">
                  <span className="text-[9px] px-1 py-0.1 rounded font-bold uppercase bg-purple-900/60 text-purple-300 border border-purple-700/60">
                    ADMIN
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Global Workflow / Guide Slide-over Drawer */}
      <WorkflowDrawer
        isOpen={showGuide}
        onClose={() => setShowGuide(false)}
        onSelectTab={({ tab, mode }) => {
          setViewMode('workspace');
          if (setActiveTab) {
            setActiveTab(mode);
          }
          if (setActiveDeepDiveSubTab && tab) {
            setActiveDeepDiveSubTab(tab);
          }
        }}
      />
    </header>
  );
};
