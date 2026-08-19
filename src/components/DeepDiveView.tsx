import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { InvestmentThesisTab } from './InvestmentThesisTab';
import { DetailedAnalysisTab } from './DetailedAnalysisTab';
import { FinancialStatementsTab } from './FinancialStatementsTab';
import { IngestionTab } from './IngestionTab';
import { SentimentTab } from './SentimentTab';
import { 
  Target, 
  FileSpreadsheet, 
  FileText, 
  Newspaper, 
  BarChart3,
  Layers,
  ChevronRight,
  ChevronDown
} from 'lucide-react';

interface DeepDiveViewProps {
  initialSubTab?: 'thesis' | 'analysis' | 'financials' | 'ingestion' | 'sentiment';
}

export const DeepDiveView: React.FC<DeepDiveViewProps> = () => {
  const { activeCompany, activeDeepDiveSubTab, setActiveDeepDiveSubTab } = useApp();
  const subTab = activeDeepDiveSubTab || 'thesis';
  const setSubTab = setActiveDeepDiveSubTab;

  if (!activeCompany) return null;

  const modules = [
    {
      id: 'thesis' as const,
      label: 'Investment Thesis & Valuation',
      icon: Target,
      count: activeCompany.latestAnalysis ? 'Active' : 'Pending',
      badgeClass: activeCompany.latestAnalysis ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-500'
    },
    {
      id: 'analysis' as const,
      label: 'Con-Call Breakdown',
      icon: BarChart3,
      count: '6 Sections',
      badgeClass: 'bg-slate-100 text-slate-600'
    },
    {
      id: 'financials' as const,
      label: 'Financial Statements & Ratios',
      icon: FileSpreadsheet,
      count: '3 Statements',
      badgeClass: 'bg-slate-100 text-slate-600'
    },
    {
      id: 'ingestion' as const,
      label: 'Document Repository',
      icon: FileText,
      count: `${activeCompany.documents.length} Files`,
      badgeClass: activeCompany.documents.length > 0 ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-slate-100 text-slate-500'
    },
    {
      id: 'sentiment' as const,
      label: 'News & Sentiment Engine',
      icon: Newspaper,
      count: `${activeCompany.sentimentHistory.length} Feeds`,
      badgeClass: 'bg-slate-100 text-slate-600'
    }
  ];

  return (
    <div className="space-y-4">
      {/* Sub Navigation Strip */}
      <div className="bg-white rounded-xl border border-slate-200 p-1.5 flex items-center space-x-1 overflow-x-auto shadow-2xs">
        {modules.map((m) => {
          const Icon = m.icon;
          const isActive = subTab === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setSubTab(m.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{m.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium border ${
                isActive 
                  ? 'bg-white/20 text-white border-white/30' 
                  : m.badgeClass
              }`}>
                {m.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Sub Tab View Container */}
      <div className="transition-all">
        {subTab === 'thesis' && <InvestmentThesisTab />}
        {subTab === 'analysis' && <DetailedAnalysisTab />}
        {subTab === 'financials' && <FinancialStatementsTab />}
        {subTab === 'ingestion' && <IngestionTab />}
        {subTab === 'sentiment' && <SentimentTab />}
      </div>
    </div>
  );
};
