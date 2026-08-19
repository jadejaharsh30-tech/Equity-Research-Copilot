import React from 'react';
import { useApp } from '../context/AppContext';
import { CitationPopover } from './CitationPopover';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  ShieldAlert, 
  ArrowUpRight, 
  Target, 
  Clock, 
  Layers, 
  Zap, 
  Eye, 
  HelpCircle,
  FileCheck,
  Download,
  Flame,
  Scale,
  FolderOpen
} from 'lucide-react';

export const InvestmentThesisTab: React.FC = () => {
  const { activeCompany, isAnalyzing, runAnalysis, currentUser, handleExportPdf, setActiveDeepDiveSubTab } = useApp();

  if (!activeCompany) return null;

  const analysis = activeCompany.latestAnalysis;
  const thesis = analysis?.investmentThesis;

  if (!thesis) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-xs">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">No Analysis Generated Yet</h3>
        <p className="text-slate-500 text-sm max-w-md mx-auto mt-2 mb-6">
          Upload and index transcripts, annual reports, or financials in the Document Repository to trigger the multi-step Gemini synthesis engine.
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <button
            onClick={() => setActiveDeepDiveSubTab('ingestion')}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-xs transition-all cursor-pointer"
          >
            <FolderOpen className="w-4 h-4" />
            <span>Upload Documents & Financials</span>
          </button>
          {currentUser.role !== 'viewer' && (
            <button
              onClick={() => runAnalysis(activeCompany.id)}
              disabled={isAnalyzing}
              className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 px-5 py-2.5 rounded-xl font-bold text-xs border border-slate-300 transition-all disabled:opacity-50 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>{isAnalyzing ? 'Running Synthesis Pipeline...' : 'Run Pipeline Direct'}</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  const getRecStyles = (rec: string) => {
    switch (rec) {
      case 'STRONG BUY':
      case 'BUY':
        return {
          bg: 'bg-emerald-50 border-emerald-300 text-emerald-950',
          badge: 'bg-emerald-600 text-white',
          tag: 'bg-emerald-100 text-emerald-800 border-emerald-200'
        };
      case 'HOLD':
        return {
          bg: 'bg-amber-50 border-amber-300 text-amber-950',
          badge: 'bg-amber-600 text-white',
          tag: 'bg-amber-100 text-amber-800 border-amber-200'
        };
      case 'REDUCE':
      case 'SELL':
        return {
          bg: 'bg-rose-50 border-rose-300 text-rose-950',
          badge: 'bg-rose-600 text-white',
          tag: 'bg-rose-100 text-rose-800 border-rose-200'
        };
      default:
        return {
          bg: 'bg-slate-50 border-slate-300 text-slate-950',
          badge: 'bg-slate-700 text-white',
          tag: 'bg-slate-100 text-slate-800 border-slate-200'
        };
    }
  };

  const recStyles = getRecStyles(thesis.recommendation);

  return (
    <div className="space-y-6">

      {/* Top Action Bar & Summary Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-lg text-sm font-extrabold tracking-wider ${recStyles.badge}`}>
              {thesis.recommendation}
            </span>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Investment Thesis & Valuation Framework
            </h2>
            <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              {analysis.version}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Last synthesized by <span className="font-semibold text-slate-700">{analysis.executedBy.userName}</span> on {analysis.runDate}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportPdf}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Institutional PDF</span>
          </button>

          {currentUser.role !== 'viewer' && (
            <button
              onClick={() => runAnalysis(activeCompany.id)}
              disabled={isAnalyzing}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isAnalyzing ? 'Re-Synthesizing...' : 'Re-Run Synthesis'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Valuation Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Current Market Price</div>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {activeCompany.currency} {activeCompany.currentPrice.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 mt-1">Market Cap: {activeCompany.currency} {activeCompany.marketCapCr} Cr</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Target Price (12M)</div>
          <div className="text-2xl font-black text-blue-600 mt-1">
            {activeCompany.currency} {thesis.targetPrice?.toLocaleString() || 'N/A'}
          </div>
          <div className="flex items-center text-xs font-semibold text-emerald-600 mt-1">
            <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
            <span>+{thesis.impliedUpsidePct}% Implied Upside</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Valuation Basis</div>
          <div className="text-base font-bold text-slate-800 mt-1.5 truncate" title={thesis.targetMultiple}>
            {thesis.targetMultiple || 'Multiple Driven'}
          </div>
          <div className="text-xs text-slate-500 mt-1">P/E: {activeCompany.peRatio || '48'}x | P/B: {activeCompany.pbRatio || '9.6'}x</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Cross-Check Audit</div>
          <div className="flex items-center gap-1.5 mt-1.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <span className="text-sm font-bold text-slate-800">
              {analysis.discrepancies.filter(d => d.status === 'verified').length}/{analysis.discrepancies.length} Claims Verified
            </span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">P&L & BS figures cross-checked</div>
        </div>
      </div>

      {/* Executive Summary Box */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">Executive Summary</h3>
        </div>
        <p className="text-slate-700 text-sm leading-relaxed">
          {thesis.executiveSummary}
        </p>

        {thesis.valuationContext && (
          <div className="mt-4 pt-4 border-t border-slate-100 bg-slate-50/80 -mx-6 -mb-6 p-6 rounded-b-2xl">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-blue-600" />
              <span>Valuation Context & Multiples Rationale</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {thesis.valuationContext}
            </p>
          </div>
        )}
      </div>

      {/* Bull Case & Bear Case 2-Column Split */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Bull Case Card */}
        <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-emerald-200/60 mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-emerald-950 text-base">Bull Case</h4>
                  <p className="text-xs text-emerald-700">{thesis.bullCase.title}</p>
                </div>
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full border border-emerald-300">
                {thesis.bullCase.pillars.length} Pillars
              </span>
            </div>

            <div className="space-y-3.5">
              {thesis.bullCase.pillars.map((pillar, idx) => (
                <div key={idx} className="bg-white/90 border border-emerald-100 rounded-xl p-3.5 shadow-xs">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-bold text-sm text-slate-900">{pillar.title}</span>
                    <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                      pillar.impact === 'High' ? 'bg-emerald-600 text-white' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {pillar.impact} Impact
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {pillar.detail}
                    {pillar.citation && <CitationPopover citationText={pillar.citation} citationsList={analysis.citations} />}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bear Case Card */}
        <div className="bg-rose-50/60 border border-rose-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-rose-200/60 mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold text-sm">
                  <TrendingDown className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-rose-950 text-base">Bear Case & Key Risks</h4>
                  <p className="text-xs text-rose-700">{thesis.bearCase.title}</p>
                </div>
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 bg-rose-100 text-rose-800 rounded-full border border-rose-300">
                {thesis.bearCase.risks.length} Risk Factors
              </span>
            </div>

            <div className="space-y-3.5">
              {thesis.bearCase.risks.map((risk, idx) => (
                <div key={idx} className="bg-white/90 border border-rose-100 rounded-xl p-3.5 shadow-xs">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                        {risk.category}
                      </span>
                      <span className="font-bold text-sm text-slate-900 truncate">{risk.detail.slice(0, 45)}...</span>
                    </div>
                    <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                      risk.severity === 'High' ? 'bg-rose-600 text-white' : risk.severity === 'Medium' ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {risk.severity} Risk
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {risk.detail}
                    {risk.citation && <CitationPopover citationText={risk.citation} citationsList={analysis.citations} />}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Key Inflection Points & Turnarounds */}
      {thesis.inflectionPoints && thesis.inflectionPoints.length > 0 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                Identified Inflection Points & Structural Turnarounds
              </h3>
            </div>
            <span className="text-xs text-slate-400">Data-Driven Milestones</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {thesis.inflectionPoints.map((inf, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <span className="text-[11px] font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded font-semibold border border-blue-200">
                      {inf.timeframe}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-700">{inf.financialImpact}</span>
                  </div>
                  <h5 className="font-bold text-sm text-slate-900 mb-1">{inf.event}</h5>
                  <p className="text-xs text-slate-600 leading-relaxed">{inf.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Monitoring Catalysts & What Would Change View */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Catalysts to Monitor */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-blue-600" />
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900">Key Catalysts to Monitor</h4>
          </div>
          <div className="space-y-2.5">
            {thesis.monitoringCatalysts.map((cat, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
                <span className="font-semibold text-slate-800 pr-2">{cat.catalyst}</span>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="font-mono text-[11px] text-slate-500">{cat.expectedTiming}</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                    cat.potentialDirection === 'Positive' ? 'bg-emerald-100 text-emerald-800' :
                    cat.potentialDirection === 'Negative' ? 'bg-rose-100 text-rose-800' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {cat.potentialDirection}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* What would change this view */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <HelpCircle className="w-4 h-4 text-slate-600" />
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900">What Would Invalidate This Thesis</h4>
          </div>
          <ul className="space-y-2 text-xs text-slate-600">
            {thesis.whatWouldChangeView.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 bg-amber-50/50 p-2.5 rounded-lg border border-amber-200/60">
                <span className="text-amber-600 font-bold">•</span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Discrepancy & Verification Layer Drawer */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-lg">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-blue-400" />
            <div>
              <h4 className="font-bold text-sm text-white">Cross-Document Fact Verification & Discrepancy Log</h4>
              <p className="text-xs text-slate-400">Automated verification comparing qualitative claims in PDFs against parsed financial statements</p>
            </div>
          </div>
          <span className="text-xs bg-blue-500/20 text-blue-300 px-2.5 py-1 rounded-full border border-blue-400/30">
            Strict Multi-Source Audit
          </span>
        </div>

        <div className="space-y-3">
          {analysis.discrepancies.map((disc) => (
            <div key={disc.id} className="bg-slate-800/90 rounded-xl p-3.5 border border-slate-700 text-xs">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="font-semibold text-slate-200">{disc.claim}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase flex-shrink-0 ${
                  disc.status === 'verified' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                  'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                }`}>
                  {disc.status === 'verified' ? '✓ Verified' : '⚠ Discrepancy Found'}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-400 font-mono bg-slate-900/60 p-2 rounded-lg mt-2">
                <div><span className="text-slate-500">Stated Claim:</span> {disc.statedValue} ({disc.documentSource})</div>
                <div><span className="text-slate-500">Audited P&L/BS:</span> {disc.auditedFinancialValue}</div>
              </div>
              <p className="text-[11px] text-slate-300 mt-2 italic">
                {disc.explanation}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
