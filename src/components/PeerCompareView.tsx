import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  TrendingUp, 
  TrendingDown, 
  Layers, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Scale, 
  Activity, 
  DollarSign, 
  PieChart, 
  BarChart3 
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid, 
  LineChart, 
  Line 
} from 'recharts';

export const PeerCompareView: React.FC = () => {
  const { companies, comparisonCompanyIds, setComparisonCompanyIds, setActiveCompanyId, setViewMode } = useApp();

  const selectedCompanies = companies.filter(c => comparisonCompanyIds.includes(c.id));
  const availableToAdd = companies.filter(c => !comparisonCompanyIds.includes(c.id));

  const handleAddCompany = (id: string) => {
    setComparisonCompanyIds(prev => [...prev, id]);
  };

  const handleRemoveCompany = (id: string) => {
    if (comparisonCompanyIds.length <= 1) return;
    setComparisonCompanyIds(prev => prev.filter(cId => cId !== id));
  };

  const handleSwapCompany = (oldId: string, newId: string) => {
    if (!newId || oldId === newId) return;
    setComparisonCompanyIds(prev => prev.map(id => id === oldId ? newId : id));
  };

  // Build Valuation & Upside chart data
  const valuationChartData = selectedCompanies.map(c => {
    const thesis = c.latestAnalysis?.investmentThesis;
    return {
      name: c.ticker,
      currentPrice: c.currentPrice,
      targetPrice: thesis?.targetPrice || c.currentPrice * 1.15,
      upsidePct: thesis?.impliedUpsidePct || 15.0,
      peRatio: c.peRatio || 40.0
    };
  });

  // Build Margin & ROCE comparison data
  const profitabilityChartData = selectedCompanies.map(c => {
    const derived = c.financialData?.derivedMetrics;
    const latestP = derived?.periods[derived.periods.length - 1];
    return {
      name: c.ticker,
      ebitdaMargin: latestP ? derived.ebitdaMarginPct[latestP] || 0 : 0,
      patMargin: latestP ? derived.netProfitMarginPct[latestP] || 0 : 0,
      roce: latestP ? derived.rocePct[latestP] || 0 : 0,
      revenueYoY: latestP ? derived.revenueYoY[latestP] || 0 : 0
    };
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

      {/* Top Header & Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-widest text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200">
              Institutional Cross-Peer Analysis
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Side-by-Side Peer Comparison</h1>
          <p className="text-xs text-slate-500 mt-1">Benchmarking valuation multiples, operational efficiency, cash generation, and analyst recommendations</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {availableToAdd.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">Add Peer:</span>
              <select
                onChange={(e) => {
                  if (e.target.value) handleAddCompany(e.target.value);
                  e.target.value = '';
                }}
                className="bg-slate-100 border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
              >
                <option value="">+ Add Company</option>
                {availableToAdd.map(c => (
                  <option key={c.id} value={c.id}>{c.ticker} ({c.name})</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Peer Badges */}
      <div className="flex items-center gap-3 overflow-x-auto pb-1">
        {selectedCompanies.map(c => (
          <div key={c.id} className="flex items-center gap-2 bg-slate-900 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-xs">
            <span>{c.ticker} — {c.name}</span>
            {selectedCompanies.length > 1 && (
              <button 
                onClick={() => handleRemoveCompany(c.id)}
                className="text-slate-400 hover:text-rose-400 ml-1 font-bold"
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Visual Comparison Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Chart 1: Implied Upside & Target Comparison */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Target Upside & Valuation Multiples</h3>
              <p className="text-xs text-slate-500">Implied 12-Month Upside Potential (%) and P/E Multiple (x)</p>
            </div>
            <Scale className="w-4 h-4 text-blue-600" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={valuationChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis yAxisId="left" stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `${v}%`} />
                <YAxis yAxisId="right" orientation="right" stroke="#8b5cf6" fontSize={11} tickFormatter={(v) => `${v}x`} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar yAxisId="left" dataKey="upsidePct" name="Target Upside (%)" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar yAxisId="right" dataKey="peRatio" name="P/E Multiple (x)" fill="#8b5cf6" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: EBITDA Margin & ROCE Comparison */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Operating Margins & Capital Efficiency</h3>
              <p className="text-xs text-slate-500">EBITDA Margin (%) vs ROCE (%) Comparison</p>
            </div>
            <Activity className="w-4 h-4 text-emerald-600" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={profitabilityChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `${v}%`} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="ebitdaMargin" name="EBITDA Margin (%)" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={32} />
                <Bar dataKey="roce" name="ROCE (%)" fill="#f59e0b" radius={[4, 4, 0, 0]} maxBarSize={32} />
                <Bar dataKey="revenueYoY" name="Revenue Growth YoY (%)" fill="#0284c7" radius={[4, 4, 0, 0]} maxBarSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Comparative Multi-Metric Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-slate-700" />
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">Multi-Factor Peer Benchmark Table</h3>
          </div>
          <span className="text-xs text-slate-500 font-mono">Consolidated Audited & Synthesized Metrics</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 text-slate-700 uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-5 font-bold text-slate-900 min-w-[200px]">Metric / Factor</th>
                {selectedCompanies.map(c => (
                  <th key={c.id} className="py-3 px-5 font-bold text-slate-900 min-w-[170px] text-right">
                    <div className="flex flex-col items-end gap-1">
                      <div className="flex items-center gap-1.5 justify-end">
                        <span>{c.ticker}</span>
                        {selectedCompanies.length > 1 && (
                          <button
                            onClick={() => handleRemoveCompany(c.id)}
                            className="text-slate-400 hover:text-rose-500 text-xs font-bold"
                            title="Remove from comparison"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                      <span className="text-[10px] font-normal text-slate-500 truncate max-w-[140px] block">{c.name}</span>
                      
                      {/* Peer Swap Dropdown */}
                      <select
                        value={c.id}
                        onChange={(e) => handleSwapCompany(c.id, e.target.value)}
                        className="mt-1 bg-white border border-slate-300 rounded-md px-2 py-0.5 text-[10px] font-medium text-slate-700 cursor-pointer focus:ring-1 focus:ring-blue-500 focus:outline-none max-w-[150px]"
                        title="Swap this column with another company from coverage"
                      >
                        <option value={c.id} disabled>Swap company...</option>
                        {companies.map(comp => (
                          <option 
                            key={comp.id} 
                            value={comp.id} 
                            disabled={comparisonCompanyIds.includes(comp.id) && comp.id !== c.id}
                          >
                            {comp.ticker} — {comp.name} {comparisonCompanyIds.includes(comp.id) && comp.id !== c.id ? '(Active)' : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">

              {/* General & Valuation */}
              <tr className="bg-slate-50/80 font-bold text-slate-900">
                <td colSpan={selectedCompanies.length + 1} className="py-2 px-5 text-[10px] uppercase text-slate-500 tracking-wider">
                  Valuation & Rating Framework
                </td>
              </tr>

              <tr className="hover:bg-slate-50">
                <td className="py-3 px-5 font-semibold text-slate-800">Recommendation Verdict</td>
                {selectedCompanies.map(c => {
                  const rec = c.latestAnalysis?.investmentThesis?.recommendation || 'HOLD';
                  return (
                    <td key={c.id} className="py-3 px-5 text-right">
                      <span className={`px-2.5 py-1 rounded font-extrabold uppercase text-[10px] ${
                        rec.includes('BUY') ? 'bg-emerald-100 text-emerald-800' :
                        rec === 'HOLD' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {rec}
                      </span>
                    </td>
                  );
                })}
              </tr>

              <tr className="hover:bg-slate-50">
                <td className="py-3 px-5 text-slate-700">Current Market Price</td>
                {selectedCompanies.map(c => (
                  <td key={c.id} className="py-3 px-5 text-right font-mono font-bold text-slate-900">
                    {c.currency} {c.currentPrice.toLocaleString()}
                  </td>
                ))}
              </tr>

              <tr className="hover:bg-slate-50">
                <td className="py-3 px-5 text-slate-700">Target Price (12M)</td>
                {selectedCompanies.map(c => {
                  const tp = c.latestAnalysis?.investmentThesis?.targetPrice;
                  return (
                    <td key={c.id} className="py-3 px-5 text-right font-mono font-bold text-blue-600">
                      {tp ? `${c.currency} ${tp}` : 'N/A'}
                    </td>
                  );
                })}
              </tr>

              <tr className="hover:bg-slate-50">
                <td className="py-3 px-5 text-slate-700">Implied Upside (%)</td>
                {selectedCompanies.map(c => {
                  const up = c.latestAnalysis?.investmentThesis?.impliedUpsidePct;
                  return (
                    <td key={c.id} className="py-3 px-5 text-right font-mono font-bold text-emerald-600">
                      {up ? `+${up}%` : '-'}
                    </td>
                  );
                })}
              </tr>

              <tr className="hover:bg-slate-50">
                <td className="py-3 px-5 text-slate-700">Market Capitalization</td>
                {selectedCompanies.map(c => (
                  <td key={c.id} className="py-3 px-5 text-right font-mono text-slate-800">
                    {c.currency} {c.marketCapCr.toLocaleString()} Cr
                  </td>
                ))}
              </tr>

              <tr className="hover:bg-slate-50">
                <td className="py-3 px-5 text-slate-700">P/E Multiple (TTM)</td>
                {selectedCompanies.map(c => (
                  <td key={c.id} className="py-3 px-5 text-right font-mono font-semibold text-slate-800">
                    {c.peRatio || '38.0'}x
                  </td>
                ))}
              </tr>

              {/* Profitability & Growth */}
              <tr className="bg-slate-50/80 font-bold text-slate-900">
                <td colSpan={selectedCompanies.length + 1} className="py-2 px-5 text-[10px] uppercase text-slate-500 tracking-wider">
                  Profitability & Growth Profile
                </td>
              </tr>

              <tr className="hover:bg-slate-50">
                <td className="py-3 px-5 font-semibold text-slate-800">Revenue Growth YoY (%)</td>
                {selectedCompanies.map(c => {
                  const derived = c.financialData?.derivedMetrics;
                  const latestP = derived?.periods[derived.periods.length - 1];
                  const val = latestP ? derived.revenueYoY[latestP] : 0;
                  return (
                    <td key={c.id} className="py-3 px-5 text-right font-mono font-bold text-emerald-700">
                      +{val}%
                    </td>
                  );
                })}
              </tr>

              <tr className="hover:bg-slate-50">
                <td className="py-3 px-5 text-slate-700">EBITDA Margin (%)</td>
                {selectedCompanies.map(c => {
                  const derived = c.financialData?.derivedMetrics;
                  const latestP = derived?.periods[derived.periods.length - 1];
                  const val = latestP ? derived.ebitdaMarginPct[latestP] : 0;
                  return (
                    <td key={c.id} className="py-3 px-5 text-right font-mono font-bold text-blue-700">
                      {val}%
                    </td>
                  );
                })}
              </tr>

              <tr className="hover:bg-slate-50">
                <td className="py-3 px-5 text-slate-700">Net Profit Margin (PAT %)</td>
                {selectedCompanies.map(c => {
                  const derived = c.financialData?.derivedMetrics;
                  const latestP = derived?.periods[derived.periods.length - 1];
                  const val = latestP ? derived.netProfitMarginPct[latestP] : 0;
                  return (
                    <td key={c.id} className="py-3 px-5 text-right font-mono text-slate-800">
                      {val}%
                    </td>
                  );
                })}
              </tr>

              {/* Capital Efficiency & Balance Sheet */}
              <tr className="bg-slate-50/80 font-bold text-slate-900">
                <td colSpan={selectedCompanies.length + 1} className="py-2 px-5 text-[10px] uppercase text-slate-500 tracking-wider">
                  Capital Efficiency & Cash Quality
                </td>
              </tr>

              <tr className="hover:bg-slate-50">
                <td className="py-3 px-5 font-semibold text-slate-800">Return on Capital Employed (ROCE %)</td>
                {selectedCompanies.map(c => {
                  const derived = c.financialData?.derivedMetrics;
                  const latestP = derived?.periods[derived.periods.length - 1];
                  const val = latestP ? derived.rocePct[latestP] : 0;
                  return (
                    <td key={c.id} className="py-3 px-5 text-right font-mono font-bold text-purple-700">
                      {val}%
                    </td>
                  );
                })}
              </tr>

              <tr className="hover:bg-slate-50">
                <td className="py-3 px-5 text-slate-700">Free Cash Flow (FCF)</td>
                {selectedCompanies.map(c => {
                  const derived = c.financialData?.derivedMetrics;
                  const latestP = derived?.periods[derived.periods.length - 1];
                  const val = latestP ? derived.freeCashFlow[latestP] : 0;
                  return (
                    <td key={c.id} className="py-3 px-5 text-right font-mono font-bold text-emerald-600">
                      {c.currency} {val?.toLocaleString()} Cr
                    </td>
                  );
                })}
              </tr>

              <tr className="hover:bg-slate-50">
                <td className="py-3 px-5 text-slate-700">Debt to Equity (x)</td>
                {selectedCompanies.map(c => (
                  <td key={c.id} className="py-3 px-5 text-right font-mono text-slate-700">
                    0.00x (Debt-Free)
                  </td>
                ))}
              </tr>

              {/* Bottom Jump to Workspace Row */}
              <tr className="bg-slate-50">
                <td className="py-3 px-5 font-bold text-slate-700">Workspace Action</td>
                {selectedCompanies.map(c => (
                  <td key={c.id} className="py-3 px-5 text-right">
                    <button
                      onClick={() => {
                        setActiveCompanyId(c.id);
                        setViewMode('workspace');
                      }}
                      className="bg-slate-900 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                    >
                      Open {c.ticker} Workspace
                    </button>
                  </td>
                ))}
              </tr>

            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
