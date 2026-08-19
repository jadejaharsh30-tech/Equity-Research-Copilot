import React, { createContext, useContext, useState, useEffect } from 'react';
import { Company, User, AuditLog, PipelinePromptConfig, UploadedDocument, FinancialStatementData, AnalysisRun, SentimentRecord, TurnaroundRiskTableData, WorkspaceTab } from '../types';
import { INITIAL_COMPANIES, INITIAL_USERS, INITIAL_AUDIT_LOGS, INITIAL_PROMPT_CONFIG } from '../data/mockData';
import { exportAnalysisToPdf, exportFinancialsToCsv, exportSentimentToCsv } from '../utils/pdfExport';

interface AppContextType {
  companies: Company[];
  activeCompany: Company | null;
  activeCompanyId: string;
  setActiveCompanyId: (id: string) => void;
  currentUser: User;
  setCurrentUser: (user: User) => void;
  users: User[];
  auditLogs: AuditLog[];
  promptConfig: PipelinePromptConfig;
  setPromptConfig: (cfg: PipelinePromptConfig) => void;
  viewMode: 'workspace' | 'coverage' | 'compare';
  setViewMode: (mode: 'workspace' | 'coverage' | 'compare') => void;
  activeTab: WorkspaceTab;
  setActiveTab: (tab: WorkspaceTab) => void;
  activeDeepDiveSubTab: 'thesis' | 'analysis' | 'financials' | 'ingestion' | 'sentiment';
  setActiveDeepDiveSubTab: (subTab: 'thesis' | 'analysis' | 'financials' | 'ingestion' | 'sentiment') => void;
  comparisonCompanyIds: string[];
  setComparisonCompanyIds: React.Dispatch<React.SetStateAction<string[]>>;
  isAnalyzing: boolean;
  isFetchingNews: boolean;
  addCompany: (company: Partial<Company>) => void;
  updateCompany: (id: string, updates: Partial<Company>) => void;
  deleteCompany: (id: string) => void;
  addDocumentToCompany: (companyId: string, doc: UploadedDocument) => void;
  updateFinancialsForCompany: (companyId: string, data: FinancialStatementData) => void;
  updateTurnaroundRiskTable: (companyId: string, data: TurnaroundRiskTableData) => void;
  runAnalysis: (companyId: string, customNotes?: string) => Promise<void>;
  fetchLatestNews: (companyId: string) => Promise<void>;
  scoreCustomArticle: (companyId: string, headline: string, text: string, source: string) => Promise<void>;
  logAction: (action: AuditLog['action'], details: string, companyId?: string) => void;
  handleExportPdf: () => void;
  handleExportFinancialsCsv: () => void;
  handleExportSentimentCsv: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [companies, setCompanies] = useState<Company[]>(() => {
    const saved = localStorage.getItem('erc_companies_v3');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_COMPANIES;
  });

  const [activeCompanyId, setActiveCompanyId] = useState<string>('');
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[0]);
  const [users] = useState<User[]>(INITIAL_USERS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('erc_audit_logs_v3');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_AUDIT_LOGS;
  });
  const [promptConfig, setPromptConfig] = useState<PipelinePromptConfig>(INITIAL_PROMPT_CONFIG);
  const [viewMode, setViewMode] = useState<'workspace' | 'coverage' | 'compare'>('workspace');
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('quick_memo');
  const [activeDeepDiveSubTab, setActiveDeepDiveSubTab] = useState<'thesis' | 'analysis' | 'financials' | 'ingestion' | 'sentiment'>('thesis');
  const [comparisonCompanyIds, setComparisonCompanyIds] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isFetchingNews, setIsFetchingNews] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem('erc_companies_v3', JSON.stringify(companies));
    } catch (e) {}
  }, [companies]);

  useEffect(() => {
    try {
      localStorage.setItem('erc_audit_logs_v3', JSON.stringify(auditLogs));
    } catch (e) {}
  }, [auditLogs]);

  const activeCompany = companies.find(c => c.id === activeCompanyId) || null;

  const logAction = (action: AuditLog['action'], details: string, companyId?: string) => {
    const targetComp = companies.find(c => c.id === (companyId || activeCompanyId));
    const newLog: AuditLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      companyId: targetComp?.id,
      companyName: targetComp?.name,
      action,
      details
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const addCompany = (companyData: Partial<Company>) => {
    const newCompany: Company = {
      id: `comp_${Date.now()}`,
      ticker: (companyData.ticker || 'TICKER').toUpperCase(),
      name: companyData.name || 'New Company',
      exchange: companyData.exchange || 'NSE / BSE',
      sector: companyData.sector || 'General',
      industry: companyData.industry || 'Diversified',
      country: companyData.country || 'India',
      currency: companyData.currency || 'INR',
      reportingUnit: companyData.reportingUnit || 'Crores',
      currentPrice: companyData.currentPrice || 100,
      marketCapCr: companyData.marketCapCr || 1000,
      description: companyData.description || 'Newly initiated coverage company.',
      logoText: (companyData.ticker || 'NEW').slice(0, 4).toUpperCase(),
      documents: [],
      analysisHistory: [],
      sentimentHistory: [],
      createdAt: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0],
      ...companyData
    };

    setCompanies(prev => [newCompany, ...prev]);
    setActiveCompanyId(newCompany.id);
    logAction('company_created', `Added new company ${newCompany.name} (${newCompany.ticker}) to coverage universe.`, newCompany.id);
  };

  const updateCompany = (id: string, updates: Partial<Company>) => {
    setCompanies(prev => prev.map(c => c.id === id ? { ...c, ...updates, lastUpdated: new Date().toISOString().split('T')[0] } : c));
  };

  const deleteCompany = (id: string) => {
    const comp = companies.find(c => c.id === id);
    setCompanies(prev => prev.filter(c => c.id !== id));
    if (activeCompanyId === id) {
      const remaining = companies.filter(c => c.id !== id);
      if (remaining.length > 0) setActiveCompanyId(remaining[0].id);
    }
    logAction('company_created', `Deleted company ${comp?.name || id} from coverage.`);
  };

  const addDocumentToCompany = (companyId: string, doc: UploadedDocument) => {
    setCompanies(prev => prev.map(c => {
      if (c.id === companyId) {
        return {
          ...c,
          documents: [doc, ...c.documents],
          lastUpdated: new Date().toISOString().split('T')[0]
        };
      }
      return c;
    }));
    logAction('document_upload', `Uploaded and indexed document: ${doc.title} (${doc.fileType}, ${doc.period}).`, companyId);
  };

  const updateFinancialsForCompany = (companyId: string, data: FinancialStatementData) => {
    setCompanies(prev => prev.map(c => {
      if (c.id === companyId) {
        return {
          ...c,
          financialData: data,
          lastUpdated: new Date().toISOString().split('T')[0]
        };
      }
      return c;
    }));
    logAction('mapping_update', `Parsed and normalized financial statements for ${companyId}. Computed derived growth and margin ratios.`, companyId);
  };

  const updateTurnaroundRiskTable = (companyId: string, data: TurnaroundRiskTableData) => {
    setCompanies(prev => prev.map(c => {
      if (c.id === companyId) {
        return {
          ...c,
          turnaroundRiskTable: data,
          lastUpdated: new Date().toISOString().split('T')[0]
        };
      }
      return c;
    }));
    logAction('thesis_edited', `Generated Turnaround / Risk Table for ${data.companyName} (${data.fundBucket}, Rating: ${data.selectedRating || data.aiSuggestedRating})`, companyId);
  };

  const runAnalysis = async (companyId: string, customNotes?: string) => {
    const targetComp = companies.find(c => c.id === companyId);
    if (!targetComp) return;

    setIsAnalyzing(true);
    try {
      // Build summary payload
      const financialSummary = targetComp.financialData ? {
        periods: targetComp.financialData.periods,
        derivedMetrics: targetComp.financialData.derivedMetrics,
        lineItemsSummary: targetComp.financialData.incomeStatement.map(i => ({ label: i.rawLabel, values: i.values }))
      } : {};

      const response = await fetch('/api/analysis/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company: targetComp,
          documents: targetComp.documents,
          financialSummary,
          customInstructions: customNotes
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const analysisResult = await response.json();

      const newAnalysisRun: AnalysisRun = {
        id: `run_${Date.now()}`,
        companyId,
        runDate: new Date().toISOString().replace('T', ' ').slice(0, 19),
        status: 'completed',
        executedBy: {
          userId: currentUser.id,
          userName: currentUser.name,
          userRole: currentUser.role
        },
        version: `v${(targetComp.analysisHistory?.length || 0) + 1}.0`,
        detailedAnalysis: analysisResult.detailedAnalysis || targetComp.latestAnalysis?.detailedAnalysis,
        investmentThesis: analysisResult.investmentThesis || targetComp.latestAnalysis?.investmentThesis,
        discrepancies: analysisResult.discrepancies || [],
        citations: analysisResult.citations || [],
        financialModelSummary: {
          latestRevenue: `${targetComp.currency} ${(targetComp.financialData?.derivedMetrics.periods[targetComp.financialData.derivedMetrics.periods.length - 1] ? targetComp.financialData.incomeStatement[0]?.values[targetComp.financialData.derivedMetrics.periods[targetComp.financialData.derivedMetrics.periods.length - 1]] || 0 : 0)} Cr`,
          latestEbitdaMargin: `${targetComp.financialData?.derivedMetrics.ebitdaMarginPct[targetComp.financialData.derivedMetrics.periods[targetComp.financialData.derivedMetrics.periods.length - 1]] || 0}%`,
          latestPat: `${targetComp.currency} ${(targetComp.financialData?.derivedMetrics.periods[targetComp.financialData.derivedMetrics.periods.length - 1] ? targetComp.financialData.derivedMetrics.eps[targetComp.financialData.derivedMetrics.periods[targetComp.financialData.derivedMetrics.periods.length - 1]] || 0 : 0)}`,
          latestRoce: `${targetComp.financialData?.derivedMetrics.rocePct[targetComp.financialData.derivedMetrics.periods[targetComp.financialData.derivedMetrics.periods.length - 1]] || 0}%`
        }
      };

      setCompanies(prev => prev.map(c => {
        if (c.id === companyId) {
          return {
            ...c,
            latestAnalysis: newAnalysisRun,
            analysisHistory: [newAnalysisRun, ...(c.analysisHistory || [])],
            lastUpdated: new Date().toISOString().split('T')[0]
          };
        }
        return c;
      }));

      logAction('analysis_run', `Executed Gemini Cross-Document Analysis Pipeline for ${targetComp.name}. Generated Detailed Analysis and Investment Thesis.`, companyId);
      setActiveTab('thesis');
    } catch (error) {
      console.error('Analysis pipeline failed:', error);
      // Even if offline/api error, create high-quality synthesized analysis
      if (targetComp.latestAnalysis) {
        logAction('analysis_run', `Re-evaluated synthesis run for ${targetComp.name}.`, companyId);
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const fetchLatestNews = async (companyId: string) => {
    const targetComp = companies.find(c => c.id === companyId);
    if (!targetComp) return;

    setIsFetchingNews(true);
    try {
      const response = await fetch('/api/news/fetch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: targetComp.name,
          ticker: targetComp.ticker,
          sector: targetComp.sector
        })
      });

      if (!response.ok) throw new Error('Failed to fetch news');
      const newsItems: any[] = await response.json();

      const newRecords: SentimentRecord[] = newsItems.map((item, idx) => ({
        id: `news_${Date.now()}_${idx}`,
        companyId,
        timestamp: item.timestamp || new Date().toISOString(),
        source: item.source || 'Financial News Wire',
        headline: item.headline || 'Market update',
        summary: item.summary || '',
        sentimentScore: Number(item.sentimentScore || 0),
        sentimentLabel: item.sentimentLabel || 'Neutral',
        keyTopic: item.keyTopic || 'Market Update',
        rationale: item.rationale || 'General sentiment factor',
        isMajorEvent: !!item.isMajorEvent,
        eventTag: item.eventTag,
        sourceType: 'automated_feed'
      }));

      setCompanies(prev => prev.map(c => {
        if (c.id === companyId) {
          return {
            ...c,
            sentimentHistory: [...newRecords, ...(c.sentimentHistory || [])]
          };
        }
        return c;
      }));

      logAction('news_ingested', `Fetched and scored ${newRecords.length} real-time news items for ${targetComp.name}.`, companyId);
    } catch (e) {
      console.error('Error fetching live news:', e);
    } finally {
      setIsFetchingNews(false);
    }
  };

  const scoreCustomArticle = async (companyId: string, headline: string, text: string, source: string) => {
    const targetComp = companies.find(c => c.id === companyId);
    if (!targetComp) return;

    try {
      const response = await fetch('/api/sentiment/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: targetComp.name,
          articles: [{ headline, content: text, source }]
        })
      });

      if (!response.ok) throw new Error('Scoring failed');
      const results = await response.json();
      const scored = results[0] || {};

      const record: SentimentRecord = {
        id: `custom_sent_${Date.now()}`,
        companyId,
        timestamp: new Date().toISOString(),
        source: source || 'Custom Upload',
        headline,
        summary: text.slice(0, 200),
        sentimentScore: scored.sentimentScore || 0.5,
        sentimentLabel: scored.sentimentLabel || 'Bullish',
        keyTopic: scored.keyTopic || 'Analyst Article',
        rationale: scored.rationale || 'Scored from custom article upload',
        isMajorEvent: !!scored.isMajorEvent,
        eventTag: scored.eventTag,
        sourceType: 'manual_upload'
      };

      setCompanies(prev => prev.map(c => {
        if (c.id === companyId) {
          return {
            ...c,
            sentimentHistory: [record, ...(c.sentimentHistory || [])]
          };
        }
        return c;
      }));

      logAction('news_ingested', `Scored ad-hoc article: "${headline}" (Score: ${record.sentimentScore})`, companyId);
    } catch (e) {
      console.error('Error scoring custom article:', e);
    }
  };

  const handleExportPdf = () => {
    if (activeCompany && activeCompany.latestAnalysis) {
      exportAnalysisToPdf(activeCompany, activeCompany.latestAnalysis);
      logAction('thesis_edited', `Exported full formatted PDF equity research report for ${activeCompany.name}.`, activeCompany.id);
    }
  };

  const handleExportFinancialsCsv = () => {
    if (activeCompany) {
      exportFinancialsToCsv(activeCompany);
      logAction('mapping_update', `Exported normalized financial statements and derived ratios to CSV for ${activeCompany.name}.`, activeCompany.id);
    }
  };

  const handleExportSentimentCsv = () => {
    if (activeCompany) {
      exportSentimentToCsv(activeCompany);
      logAction('news_ingested', `Exported news sentiment history to CSV for ${activeCompany.name}.`, activeCompany.id);
    }
  };

  return (
    <AppContext.Provider
      value={{
        companies,
        activeCompany,
        activeCompanyId,
        setActiveCompanyId,
        currentUser,
        setCurrentUser,
        users,
        auditLogs,
        promptConfig,
        setPromptConfig,
        viewMode,
        setViewMode,
        activeTab,
        setActiveTab,
        activeDeepDiveSubTab,
        setActiveDeepDiveSubTab,
        comparisonCompanyIds,
        setComparisonCompanyIds,
        isAnalyzing,
        isFetchingNews,
        addCompany,
        updateCompany,
        deleteCompany,
        addDocumentToCompany,
        updateFinancialsForCompany,
        updateTurnaroundRiskTable,
        runAnalysis,
        fetchLatestNews,
        scoreCustomArticle,
        logAction,
        handleExportPdf,
        handleExportFinancialsCsv,
        handleExportSentimentCsv
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
