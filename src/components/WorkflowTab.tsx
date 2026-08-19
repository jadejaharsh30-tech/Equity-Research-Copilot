import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Compass, 
  Sparkles, 
  Table as TableIcon, 
  Target, 
  BarChart3, 
  FileSpreadsheet, 
  FileText, 
  Newspaper, 
  Layers, 
  ArrowRight, 
  UploadCloud, 
  CheckCircle2, 
  Download, 
  SlidersHorizontal, 
  Clock, 
  FileCheck, 
  Lightbulb, 
  TrendingUp, 
  ShieldCheck, 
  BookOpen, 
  PlayCircle,
  HelpCircle,
  Laptop
} from 'lucide-react';

export const WorkflowTab: React.FC = () => {
  const { setActiveTab, setViewMode, activeCompany, runAnalysis, isAnalyzing } = useApp();

  const steps = [
    {
      step: '01',
      title: 'Upload Documents & Ingest Research',
      icon: <UploadCloud className="w-5 h-5 text-blue-600" />,
      tabKey: 'ingestion' as const,
      color: 'blue',
      description: 'Upload quarterly earnings transcripts, investor presentations, annual reports, or broker research (PDF, PNG, JPG, WEBP). Gemini extracts financial metrics, management guidance, capex targets, and competitor commentary automatically.',
      actionLabel: 'Go to Document Repo',
      tips: [
        'Supports multi-file ingestion & OCR on scanned charts',
        'Automatic extraction of con-call timestamps & verbatim quotes',
        'Repository documents are persistent across your session'
      ]
    },
    {
      step: '02',
      title: 'Generate Turnaround / Risk Summary Table',
      icon: <TableIcon className="w-5 h-5 text-indigo-600" />,
      tabKey: 'table' as const,
      color: 'indigo',
      description: 'Produce a presentation-ready 2-column institutional summary comparing Key Turnaround catalysts versus Key Problem / Key Risk points. Choose between Wealth Mantra (Red) or Growth Mantra (Teal) fund branding and customize output points.',
      actionLabel: 'Open Table Generator',
      tips: [
        'AI suggested rating (Good / Neutral / Poor) with manual override',
        'Grounds every point in actual financial figures and transcript dates',
        'One-click high-resolution PNG export for decks and investment memos'
      ]
    },
    {
      step: '03',
      title: 'Execute Full Gemini Synthesis Pipeline',
      icon: <Sparkles className="w-5 h-5 text-purple-600" />,
      tabKey: 'thesis' as const,
      color: 'purple',
      description: 'Run the multi-step quantitative and qualitative synthesis engine. Gemini cross-examines audited financial data against management transcript statements, detects guidance deviations, and computes 12-month valuation scenarios.',
      actionLabel: 'View Investment Thesis',
      tips: [
        'Generates 3 valuation models: DCF, Target P/E multiple & EV/EBITDA',
        'Triangulates Bear, Base, and Bull price targets with upside %',
        'Evaluates Competitive Moat across pricing power & barrier to entry'
      ]
    },
    {
      step: '04',
      title: 'Audit Financials & Normalized Statements',
      icon: <FileSpreadsheet className="w-5 h-5 text-emerald-600" />,
      tabKey: 'financials' as const,
      color: 'emerald',
      description: 'Inspect standardized Multi-Year P&L, Balance Sheet, and Cash Flow statements. Explore auto-computed CAGR growth metrics, gross & operating margins, EBITDA margins, and Working Capital cycle trends.',
      actionLabel: 'Explore Financial Statements',
      tips: [
        'Includes interactive interactive margin progression bar charts',
        'Export clean spreadsheet data as CSV for Excel modeling',
        'Direct mapping of line items with segment breakdown'
      ]
    },
    {
      step: '05',
      title: 'Monitor Live News & Sentiment Scoring',
      icon: <Newspaper className="w-5 h-5 text-amber-600" />,
      tabKey: 'sentiment' as const,
      color: 'amber',
      description: 'Track real-time market sentiment and regulatory news feeds. Score custom breaking articles with Gemini sentiment analysis to see instantaneous impact on fundamental thesis and risk rating.',
      actionLabel: 'Open News & Sentiment',
      tips: [
        'Real-time automated sentiment classification (+1.0 to -1.0)',
        'Event tagging for Capex, Regulatory, and Earnings surprises',
        'Custom article scorer to stress-test breaking broker headlines'
      ]
    },
    {
      step: '06',
      title: 'Export Institutional Note & Compare Universe',
      icon: <Download className="w-5 h-5 text-rose-600" />,
      tabKey: 'thesis' as const,
      color: 'rose',
      description: 'Generate institutional PDF research notes with complete audit logs, citations, and compliance disclaimers. Switch to Peer Comparison Mode to benchmark valuation multiples against industry peers side-by-side.',
      actionLabel: 'Switch to Peer Compare',
      onAction: () => setViewMode('compare'),
      tips: [
        'Comprehensive multi-page PDF generation with company metrics',
        'Side-by-side matrix of P/E, P/B, EV/EBITDA, and revenue growth',
        'Immutable compliance audit trail tracking all prompts and model edits'
      ]
    }
  ];

  const quickCapabilities = [
    {
      title: 'Multi-Modal Research Ingestion',
      desc: 'Ingest broker research, concall audio transcripts, quarterly reports, and investor presentation slides directly.',
      icon: <FileText className="w-4 h-4 text-blue-600" />
    },
    {
      title: 'Fixed-Format Table Generator',
      desc: 'Institutional 2-column turnaround vs risk table matching executive portfolio management standards.',
      icon: <TableIcon className="w-4 h-4 text-teal-600" />
    },
    {
      title: 'Multi-Scenario Valuation',
      desc: 'Automatic 3-stage DCF, historical P/E bands, and EV/EBITDA triangulation with Bear/Base/Bull price targets.',
      icon: <TrendingUp className="w-4 h-4 text-indigo-600" />
    },
    {
      title: 'Compliance Audit Trail',
      desc: 'Full regulatory traceability logging all prompt configurations, document uploads, and thesis overrides.',
      icon: <ShieldCheck className="w-4 h-4 text-emerald-600" />
    }
  ];

  return (
    <div className="space-y-6">

      {/* Hero Welcome Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute right-20 bottom-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-semibold mb-3">
            <Compass className="w-3.5 h-3.5" />
            <span>Interactive Operational Guide</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-2">
            Welcome to the Equity Research Copilot
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6">
            A comprehensive, institutional-grade equity analysis platform designed for portfolio managers, fund analysts, and investment committees. Follow this step-by-step workflow to ingest documents, generate research tables, evaluate financial models, and export notes.
          </p>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => setActiveTab('table')}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Start with Turnaround / Risk Table</span>
            </button>

            {activeCompany && (
              <button
                onClick={() => runAnalysis(activeCompany.id)}
                disabled={isAnalyzing}
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>{isAnalyzing ? 'Synthesizing Pipeline...' : `Run Analysis on ${activeCompany.ticker}`}</span>
              </button>
            )}

            <button
              onClick={() => setViewMode('coverage')}
              className="inline-flex items-center gap-2 text-slate-300 hover:text-white text-xs font-semibold px-3 py-2 transition-colors cursor-pointer"
            >
              <span>View Coverage Universe</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Core Capabilities Grid */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <span>Platform Core Capabilities</span>
          </h2>
          <span className="text-xs text-slate-400 font-medium">Enterprise Equity Engine</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {quickCapabilities.map((cap, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
              <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center mb-3">
                {cap.icon}
              </div>
              <h3 className="text-xs font-bold text-slate-900 mb-1">{cap.title}</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">{cap.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Step-by-Step Interactive Workflow */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <PlayCircle className="w-4 h-4 text-blue-600" />
            <span>Recommended Research Workflow</span>
          </h2>
          <span className="text-xs text-slate-500 font-medium">6 Structured Phases</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {steps.map((item, idx) => (
            <div 
              key={idx}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-black text-slate-400 bg-slate-100 px-2 py-1 rounded-lg border border-slate-200">
                      STEP {item.step}
                    </span>
                    <div className="p-1.5 bg-slate-50 rounded-lg border border-slate-100">
                      {item.icon}
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Phase {idx + 1}
                  </span>
                </div>

                {/* Title & Description */}
                <h3 className="text-sm font-extrabold text-slate-900 mb-1.5">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {item.description}
                </p>

                {/* Highlights List */}
                <div className="space-y-1.5 mb-4 bg-slate-50/70 border border-slate-100 rounded-xl p-3">
                  {item.tips.map((tip, tIdx) => (
                    <div key={tIdx} className="flex items-start gap-2 text-[11px] text-slate-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-medium text-slate-400">Direct Navigation</span>
                <button
                  type="button"
                  onClick={() => {
                    if (item.onAction) {
                      item.onAction();
                    } else {
                      setActiveTab(item.tabKey);
                    }
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100/80 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  <span>{item.actionLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* Analyst Tools & FAQs Footer Strip */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <HelpCircle className="w-4 h-4 text-slate-700" />
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Frequently Asked Questions & Tips
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600">
          <div className="bg-white p-3.5 rounded-xl border border-slate-200/80">
            <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
              <Laptop className="w-3.5 h-3.5 text-blue-600" />
              <span>How do I add a new company?</span>
            </h4>
            <p className="text-[11px] leading-relaxed text-slate-500">
              Click on the top company dropdown selector in the main header and choose <strong>"+ Add New Company"</strong> to specify the ticker, exchange, sector, and starting financials.
            </p>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200/80">
            <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-purple-600" />
              <span>Can I customize Gemini prompts?</span>
            </h4>
            <p className="text-[11px] leading-relaxed text-slate-500">
              Yes! Click the <strong>Prompt Config</strong> button in the top action bar to adjust the exact system instructions and temperature for valuation, turnaround, or concall synthesis.
            </p>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200/80">
            <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Where is the compliance audit log?</span>
            </h4>
            <p className="text-[11px] leading-relaxed text-slate-500">
              Click the <strong>Audit Trail</strong> button in the top bar to inspect timestamped logs of every document parsed, financial statement mapped, or thesis edited.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
