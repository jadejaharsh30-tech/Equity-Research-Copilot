import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CitationPopover } from './CitationPopover';
import { 
  BarChart3, 
  Wallet, 
  Activity, 
  PieChart, 
  MessageSquare, 
  Target, 
  FileText,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const DetailedAnalysisTab: React.FC = () => {
  const { activeCompany } = useApp();

  const [activeSection, setActiveSection] = useState<string>('all');

  if (!activeCompany?.latestAnalysis?.detailedAnalysis) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center">
        <p className="text-slate-500 text-sm">Please run an institutional analysis run to view the detailed breakdown.</p>
      </div>
    );
  }

  const analysis = activeCompany.latestAnalysis;
  const det = analysis.detailedAnalysis;

  const sections = [
    { id: 'all', label: 'All Modules', icon: BarChart3 },
    { id: 'revenue', label: 'Revenue & Margin Dynamics', icon: TrendingUp },
    { id: 'balance_sheet', label: 'Balance Sheet Health', icon: Wallet },
    { id: 'cash_flow', label: 'Cash Flow Quality & FCF', icon: Activity },
    { id: 'segments', label: 'Segment Breakdown', icon: PieChart },
    { id: 'mgmt', label: 'Management Commentary', icon: MessageSquare },
    { id: 'guidance', label: 'Guidance vs Delivered', icon: Target }
  ];

  return (
    <div className="space-y-6">

      {/* Section Filter Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 border-b border-slate-200">
        {sections.map(s => {
          const Icon = s.icon;
          const isActive = activeSection === s.id;
          return (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive 
                  ? 'bg-slate-900 text-white shadow-xs' 
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{s.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. Revenue & Margin Trends */}
      {(activeSection === 'all' || activeSection === 'revenue') && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">1. Revenue & Profitability Dynamics (YoY & QoQ)</h3>
                <p className="text-xs text-slate-500">Analysis of top-line velocity, volume trends, and operating margin drivers</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {det.revenueMarginTrends.citations.map((c, i) => (
                <CitationPopover key={i} citationText={c} citationsList={analysis.citations} />
              ))}
            </div>
          </div>

          <div className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200/70">
            <strong className="text-slate-900">Executive Overview: </strong>
            {det.revenueMarginTrends.summary}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-white">
              <div className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">Year-over-Year (YoY) Dynamics</div>
              <p className="text-xs text-slate-600 leading-relaxed">{det.revenueMarginTrends.yoyCommentary}</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 bg-white">
              <div className="text-xs font-bold text-indigo-700 uppercase tracking-wider mb-1">Sequential (QoQ) Evolution</div>
              <p className="text-xs text-slate-600 leading-relaxed">{det.revenueMarginTrends.qoqCommentary}</p>
            </div>
          </div>

          <div>
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Key Topline & Margin Growth Drivers:</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {det.revenueMarginTrends.keyDrivers.map((driver, idx) => (
                <div key={idx} className="flex items-start gap-2 bg-blue-50/50 border border-blue-100 p-3 rounded-xl text-xs text-slate-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0"></div>
                  <span>{driver}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. Balance Sheet Health */}
      {(activeSection === 'all' || activeSection === 'balance_sheet') && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                <Wallet className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">2. Balance Sheet Health & Capital Structure</h3>
                <p className="text-xs text-slate-500">Solvency, liquidity reserves, debt profile, and working capital robustness</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {det.balanceSheetHealth.citations.map((c, i) => (
                <CitationPopover key={i} citationText={c} citationsList={analysis.citations} />
              ))}
            </div>
          </div>

          <p className="text-sm text-slate-700 leading-relaxed">
            {det.balanceSheetHealth.summary}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-purple-50/40 border border-purple-100 p-4 rounded-xl">
              <div className="text-xs font-bold text-purple-900 uppercase tracking-wider mb-1">Leverage & Solvency</div>
              <p className="text-xs text-slate-600 leading-relaxed">{det.balanceSheetHealth.leverageAnalysis}</p>
            </div>
            <div className="bg-purple-50/40 border border-purple-100 p-4 rounded-xl">
              <div className="text-xs font-bold text-purple-900 uppercase tracking-wider mb-1">Liquidity & Treasury</div>
              <p className="text-xs text-slate-600 leading-relaxed">{det.balanceSheetHealth.liquidityAnalysis}</p>
            </div>
            <div className="bg-purple-50/40 border border-purple-100 p-4 rounded-xl">
              <div className="text-xs font-bold text-purple-900 uppercase tracking-wider mb-1">Working Capital Health</div>
              <p className="text-xs text-slate-600 leading-relaxed">{det.balanceSheetHealth.workingCapitalAssessment}</p>
            </div>
          </div>
        </div>
      )}

      {/* 3. Cash Flow Quality */}
      {(activeSection === 'all' || activeSection === 'cash_flow') && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">3. Cash Flow Quality & Free Cash Flow (FCF)</h3>
                <p className="text-xs text-slate-500">OCF to PAT conversion ratios, Capex trajectory, and capital return capacity</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {det.cashFlowQuality.citations.map((c, i) => (
                <CitationPopover key={i} citationText={c} citationsList={analysis.citations} />
              ))}
            </div>
          </div>

          <p className="text-sm text-slate-700 leading-relaxed">
            {det.cashFlowQuality.summary}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-emerald-50/40 border border-emerald-100 p-4 rounded-xl">
              <div className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-1">OCF vs Net Income Conversion</div>
              <p className="text-xs text-slate-600 leading-relaxed">{det.cashFlowQuality.ocfVsPatAnalysis}</p>
            </div>
            <div className="bg-emerald-50/40 border border-emerald-100 p-4 rounded-xl">
              <div className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-1">Capex Trajectory & Tech Investments</div>
              <p className="text-xs text-slate-600 leading-relaxed">{det.cashFlowQuality.capexTrends}</p>
            </div>
            <div className="bg-emerald-50/40 border border-emerald-100 p-4 rounded-xl">
              <div className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-1">Free Cash Flow Generation</div>
              <p className="text-xs text-slate-600 leading-relaxed">{det.cashFlowQuality.fcfGeneration}</p>
            </div>
          </div>
        </div>
      )}

      {/* 4. Segment Breakdown */}
      {(activeSection === 'all' || activeSection === 'segments') && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                <PieChart className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">4. Segment / Product-Line Performance</h3>
                <p className="text-xs text-slate-500">Volume share, growth trajectory, and market dominance by product category</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {det.segmentPerformance.citations.map((c, i) => (
                <CitationPopover key={i} citationText={c} citationsList={analysis.citations} />
              ))}
            </div>
          </div>

          <p className="text-sm text-slate-700 leading-relaxed">
            {det.segmentPerformance.summary}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {det.segmentPerformance.segments.map((seg, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-slate-900">{seg.name}</span>
                  <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                    {seg.sharePct}% Share
                  </span>
                </div>
                <div className="text-xs font-semibold text-emerald-700 mb-1.5">YoY Growth: {seg.growthYoY}</div>
                <p className="text-xs text-slate-600 leading-relaxed">{seg.commentary}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Management Commentary Synthesis */}
      {(activeSection === 'all' || activeSection === 'mgmt') && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">5. Management Commentary & Con-Call Synthesis</h3>
                <p className="text-xs text-slate-500">Executive tone, hedging language, and strategic milestones from con-call transcripts</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-extrabold uppercase px-2.5 py-1 rounded-lg ${
                det.managementCommentary.tone === 'Bullish' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-slate-100 text-slate-800'
              }`}>
                Tone: {det.managementCommentary.tone}
              </span>
              {det.managementCommentary.citations.map((c, i) => (
                <CitationPopover key={i} citationText={c} citationsList={analysis.citations} />
              ))}
            </div>
          </div>

          <p className="text-sm text-slate-700 leading-relaxed">
            {det.managementCommentary.summary}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-amber-50/40 border border-amber-200/70 p-4 rounded-xl">
              <div className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-2">Hedging & Volatility Observations</div>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {det.managementCommentary.hedgingObservations.map((obs, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>{obs}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-blue-50/40 border border-blue-200/70 p-4 rounded-xl">
              <div className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-2">Key Strategic Initiatives</div>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {det.managementCommentary.strategicInitiatives.map((init, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>{init}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 6. Guidance vs Actuals */}
      {(activeSection === 'all' || activeSection === 'guidance') && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
                <Target className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">6. Guidance vs Actual Results Delivered</h3>
                <p className="text-xs text-slate-500">Historical performance against prior quarterly guidance and management commitments</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {det.guidanceVsActuals.citations.map((c, i) => (
                <CitationPopover key={i} citationText={c} citationsList={analysis.citations} />
              ))}
            </div>
          </div>

          <p className="text-sm text-slate-700 leading-relaxed">
            {det.guidanceVsActuals.summary}
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border border-slate-200 rounded-xl overflow-hidden">
              <thead className="bg-slate-100 text-slate-700 uppercase font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4">Metric / Commitment</th>
                  <th className="py-2.5 px-4">Guidance / Expected</th>
                  <th className="py-2.5 px-4">Actual Delivered</th>
                  <th className="py-2.5 px-4 text-center">Verdict</th>
                  <th className="py-2.5 px-4">Analytical Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {det.guidanceVsActuals.comparisons.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 font-bold text-slate-900">{item.metric}</td>
                    <td className="py-3 px-4 text-slate-600 font-mono">{item.guidanceOrExpected}</td>
                    <td className="py-3 px-4 text-slate-900 font-bold font-mono">{item.actualDelivered}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded font-extrabold uppercase text-[10px] ${
                        item.verdict === 'Beat' ? 'bg-emerald-100 text-emerald-800' :
                        item.verdict === 'Met' ? 'bg-blue-100 text-blue-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {item.verdict === 'Beat' && <CheckCircle2 className="w-3 h-3" />}
                        {item.verdict}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{item.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
