import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Calculator, 
  Layers, 
  ChevronRight, 
  Filter, 
  Calendar,
  DollarSign,
  Activity,
  Table as TableIcon
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Line, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid 
} from 'recharts';

export const FinancialStatementsTab: React.FC = () => {
  const { activeCompany, handleExportFinancialsCsv } = useApp();

  const [activeStatement, setActiveStatement] = useState<'pnl' | 'balance_sheet' | 'cash_flow' | 'ratios'>('pnl');
  const [periodRange, setPeriodRange] = useState<'5Y' | '10Y' | 'ALL'>('5Y');

  if (!activeCompany?.financialData) {
    return (
      <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center">
        <Calculator className="w-10 h-10 text-slate-400 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-800">No Financial Statements Loaded</h3>
        <p className="text-xs text-slate-500 mt-1">Upload an Excel or CSV file in the Ingestion tab to parse statement line-items.</p>
      </div>
    );
  }

  const { periods, incomeStatement, balanceSheet, cashFlowStatement, derivedMetrics } = activeCompany.financialData;

  // Filter periods
  const visiblePeriods = periodRange === '5Y' ? periods.slice(-5) :
                         periodRange === '10Y' ? periods.slice(-10) : periods;

  // Build chart dataset
  const chartData = visiblePeriods.map(p => {
    const revItem = incomeStatement.find(i => i.canonicalKey === 'operating_revenue' || i.rawLabel.toLowerCase().includes('operating income') || i.rawLabel.toLowerCase().includes('net sales'));
    const patItem = incomeStatement.find(i => i.canonicalKey === 'pat' || i.rawLabel.toLowerCase().includes('profit after tax') || i.rawLabel.toLowerCase().includes('consolidated net profit'));
    
    return {
      period: p,
      revenue: revItem?.values[p] || 0,
      pat: patItem?.values[p] || 0,
      ebitdaMargin: derivedMetrics.ebitdaMarginPct[p] || 0,
      patMargin: derivedMetrics.netProfitMarginPct[p] || 0,
      roce: derivedMetrics.rocePct[p] || 0,
      fcf: derivedMetrics.freeCashFlow[p] || 0
    };
  });

  return (
    <div className="space-y-6">

      {/* Top Controller Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveStatement('pnl')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeStatement === 'pnl' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Profit & Loss (P&L)
          </button>
          <button
            onClick={() => setActiveStatement('balance_sheet')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeStatement === 'balance_sheet' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Balance Sheet
          </button>
          <button
            onClick={() => setActiveStatement('cash_flow')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeStatement === 'cash_flow' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Cash Flow
          </button>
          <button
            onClick={() => setActiveStatement('ratios')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeStatement === 'ratios' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Derived Ratios & Metrics
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Period Range Switcher */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={() => setPeriodRange('5Y')}
              className={`px-2.5 py-1 rounded-lg font-semibold ${periodRange === '5Y' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'}`}
            >
              Last 5Y
            </button>
            <button
              onClick={() => setPeriodRange('10Y')}
              className={`px-2.5 py-1 rounded-lg font-semibold ${periodRange === '10Y' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'}`}
            >
              Last 10Y
            </button>
            <button
              onClick={() => setPeriodRange('ALL')}
              className={`px-2.5 py-1 rounded-lg font-semibold ${periodRange === 'ALL' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'}`}
            >
              All ({periods.length}Y)
            </button>
          </div>

          <button
            onClick={handleExportFinancialsCsv}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Visual Chart Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Financial Growth & Profitability Trajectory</h3>
            <p className="text-xs text-slate-500">Revenue, Net Profit ({activeCompany.currency} Cr), and Operating Margins (%)</p>
          </div>
          <div className="text-xs font-mono bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-100">
            Source: {activeCompany.financialData.sourceTemplateName || 'Normalized Feed'}
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="period" stroke="#94a3b8" fontSize={11} />
              <YAxis yAxisId="left" stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `${v}`} />
              <YAxis yAxisId="right" orientation="right" stroke="#0284c7" fontSize={11} tickFormatter={(v) => `${v}%`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '12px' }}
                formatter={(value: any, name: string) => [
                  name.includes('Margin') || name === 'ROCE' ? `${value}%` : `${activeCompany.currency} ${Number(value).toLocaleString()} Cr`,
                  name
                ]}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar yAxisId="left" dataKey="revenue" name="Revenue (Cr)" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={32} />
              <Bar yAxisId="left" dataKey="pat" name="PAT (Cr)" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={32} />
              <Line yAxisId="right" type="monotone" dataKey="ebitdaMargin" name="EBITDA Margin (%)" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 3 }} />
              <Line yAxisId="right" type="monotone" dataKey="roce" name="ROCE (%)" stroke="#8b5cf6" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 3 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Financial Table View */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TableIcon className="w-4 h-4 text-slate-600" />
            <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wider">
              {activeStatement === 'pnl' ? 'Consolidated Profit & Loss Statement' :
               activeStatement === 'balance_sheet' ? 'Consolidated Balance Sheet' :
               activeStatement === 'cash_flow' ? 'Consolidated Cash Flow Statement' : 'Derived Performance Ratios & Metrics'}
            </h4>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            Values in {activeCompany.reportingUnit} ({activeCompany.currency})
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100/90 text-slate-700 uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-bold text-slate-900 sticky left-0 bg-slate-100 min-w-[240px] z-10">
                  Particulars / Canonical Field
                </th>
                {visiblePeriods.map(p => (
                  <th key={p} className="py-3 px-4 text-right font-bold text-slate-800 min-w-[90px]">
                    {p}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">

              {/* Profit & Loss Lines */}
              {activeStatement === 'pnl' && incomeStatement.map((item, idx) => {
                const isHighlight = item.canonicalKey === 'operating_revenue' || item.canonicalKey === 'ebitda' || item.canonicalKey === 'pat';
                return (
                  <tr key={idx} className={`hover:bg-slate-50/80 ${isHighlight ? 'bg-blue-50/30 font-bold text-slate-900' : 'text-slate-700'}`}>
                    <td className={`py-2.5 px-4 sticky left-0 ${isHighlight ? 'bg-blue-50/80 text-blue-950 font-bold' : 'bg-white text-slate-800'} border-r border-slate-100`}>
                      {item.rawLabel}
                    </td>
                    {visiblePeriods.map(p => {
                      const val = item.values[p];
                      return (
                        <td key={p} className="py-2.5 px-4 text-right font-mono">
                          {val !== undefined && val !== null ? val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-'}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}

              {/* Balance Sheet Lines */}
              {activeStatement === 'balance_sheet' && balanceSheet.map((item, idx) => {
                const isHighlight = item.canonicalKey === 'net_worth' || item.canonicalKey === 'total_assets' || item.canonicalKey === 'cash_bank_balances';
                return (
                  <tr key={idx} className={`hover:bg-slate-50/80 ${isHighlight ? 'bg-purple-50/30 font-bold text-slate-900' : 'text-slate-700'}`}>
                    <td className={`py-2.5 px-4 sticky left-0 ${isHighlight ? 'bg-purple-50/80 text-purple-950 font-bold' : 'bg-white text-slate-800'} border-r border-slate-100`}>
                      {item.rawLabel}
                    </td>
                    {visiblePeriods.map(p => {
                      const val = item.values[p];
                      return (
                        <td key={p} className="py-2.5 px-4 text-right font-mono">
                          {val !== undefined && val !== null ? val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-'}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}

              {/* Cash Flow Lines */}
              {activeStatement === 'cash_flow' && cashFlowStatement.map((item, idx) => {
                const isHighlight = item.canonicalKey === 'cash_flow_operations' || item.canonicalKey === 'free_cash_flow';
                return (
                  <tr key={idx} className={`hover:bg-slate-50/80 ${isHighlight ? 'bg-emerald-50/30 font-bold text-slate-900' : 'text-slate-700'}`}>
                    <td className={`py-2.5 px-4 sticky left-0 ${isHighlight ? 'bg-emerald-50/80 text-emerald-950 font-bold' : 'bg-white text-slate-800'} border-r border-slate-100`}>
                      {item.rawLabel}
                    </td>
                    {visiblePeriods.map(p => {
                      const val = item.values[p];
                      return (
                        <td key={p} className="py-2.5 px-4 text-right font-mono">
                          {val !== undefined && val !== null ? val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-'}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}

              {/* Derived Ratios Table */}
              {activeStatement === 'ratios' && (
                <>
                  <tr className="bg-slate-50 font-bold text-slate-900">
                    <td colSpan={visiblePeriods.length + 1} className="py-2 px-4 uppercase text-[10px] tracking-wider text-slate-500">
                      Growth & Margins (Derived by Copilot)
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50/80 font-semibold text-slate-800">
                    <td className="py-2.5 px-4 sticky left-0 bg-white border-r border-slate-100">Revenue Growth YoY (%)</td>
                    {visiblePeriods.map(p => (
                      <td key={p} className={`py-2.5 px-4 text-right font-mono ${derivedMetrics.revenueYoY[p] > 0 ? 'text-emerald-700' : 'text-slate-600'}`}>
                        {derivedMetrics.revenueYoY[p] !== undefined ? `${derivedMetrics.revenueYoY[p]}%` : '-'}
                      </td>
                    ))}
                  </tr>

                  <tr className="hover:bg-slate-50/80 font-semibold text-slate-800">
                    <td className="py-2.5 px-4 sticky left-0 bg-white border-r border-slate-100">EBITDA Margin (%)</td>
                    {visiblePeriods.map(p => (
                      <td key={p} className="py-2.5 px-4 text-right font-mono font-bold text-blue-700">
                        {derivedMetrics.ebitdaMarginPct[p] !== undefined ? `${derivedMetrics.ebitdaMarginPct[p]}%` : '-'}
                      </td>
                    ))}
                  </tr>

                  <tr className="hover:bg-slate-50/80 font-semibold text-slate-800">
                    <td className="py-2.5 px-4 sticky left-0 bg-white border-r border-slate-100">Net Profit (PAT) Margin (%)</td>
                    {visiblePeriods.map(p => (
                      <td key={p} className="py-2.5 px-4 text-right font-mono text-slate-800">
                        {derivedMetrics.netProfitMarginPct[p] !== undefined ? `${derivedMetrics.netProfitMarginPct[p]}%` : '-'}
                      </td>
                    ))}
                  </tr>

                  <tr className="bg-slate-50 font-bold text-slate-900">
                    <td colSpan={visiblePeriods.length + 1} className="py-2 px-4 uppercase text-[10px] tracking-wider text-slate-500">
                      Capital Efficiency & Solvency Ratios
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50/80 font-semibold text-slate-800">
                    <td className="py-2.5 px-4 sticky left-0 bg-white border-r border-slate-100">Return on Capital Employed (ROCE %)</td>
                    {visiblePeriods.map(p => (
                      <td key={p} className="py-2.5 px-4 text-right font-mono font-bold text-purple-700">
                        {derivedMetrics.rocePct[p] !== undefined ? `${derivedMetrics.rocePct[p]}%` : '-'}
                      </td>
                    ))}
                  </tr>

                  <tr className="hover:bg-slate-50/80 font-semibold text-slate-800">
                    <td className="py-2.5 px-4 sticky left-0 bg-white border-r border-slate-100">Return on Net Worth (RONW / ROE %)</td>
                    {visiblePeriods.map(p => (
                      <td key={p} className="py-2.5 px-4 text-right font-mono text-slate-800">
                        {derivedMetrics.ronwPct[p] !== undefined ? `${derivedMetrics.ronwPct[p]}%` : '-'}
                      </td>
                    ))}
                  </tr>

                  <tr className="hover:bg-slate-50/80 text-slate-700">
                    <td className="py-2.5 px-4 sticky left-0 bg-white border-r border-slate-100">Debt to Equity Ratio (x)</td>
                    {visiblePeriods.map(p => (
                      <td key={p} className="py-2.5 px-4 text-right font-mono">
                        {derivedMetrics.debtToEquity[p] !== undefined ? `${derivedMetrics.debtToEquity[p]}x` : '-'}
                      </td>
                    ))}
                  </tr>

                  <tr className="hover:bg-slate-50/80 text-slate-700">
                    <td className="py-2.5 px-4 sticky left-0 bg-white border-r border-slate-100">Current Ratio (x)</td>
                    {visiblePeriods.map(p => (
                      <td key={p} className="py-2.5 px-4 text-right font-mono">
                        {derivedMetrics.currentRatio[p] !== undefined ? `${derivedMetrics.currentRatio[p]}x` : '-'}
                      </td>
                    ))}
                  </tr>

                  <tr className="bg-slate-50 font-bold text-slate-900">
                    <td colSpan={visiblePeriods.length + 1} className="py-2 px-4 uppercase text-[10px] tracking-wider text-slate-500">
                      Cash Generation Quality
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50/80 font-bold text-emerald-900 bg-emerald-50/20">
                    <td className="py-2.5 px-4 sticky left-0 bg-emerald-50/60 border-r border-slate-100">Free Cash Flow (FCF in Cr)</td>
                    {visiblePeriods.map(p => (
                      <td key={p} className="py-2.5 px-4 text-right font-mono font-bold text-emerald-700">
                        {derivedMetrics.freeCashFlow[p] !== undefined ? derivedMetrics.freeCashFlow[p].toLocaleString() : '-'}
                      </td>
                    ))}
                  </tr>

                  <tr className="hover:bg-slate-50/80 text-slate-700">
                    <td className="py-2.5 px-4 sticky left-0 bg-white border-r border-slate-100">FCF to Net Profit Conversion (%)</td>
                    {visiblePeriods.map(p => (
                      <td key={p} className="py-2.5 px-4 text-right font-mono text-slate-700">
                        {derivedMetrics.fcfToPatPct[p] !== undefined ? `${derivedMetrics.fcfToPatPct[p]}%` : '-'}
                      </td>
                    ))}
                  </tr>
                </>
              )}

            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
