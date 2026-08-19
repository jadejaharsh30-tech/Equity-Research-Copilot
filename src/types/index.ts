export type UserRole = 'admin' | 'analyst' | 'viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  assignedCompanyIds: string[] | 'all';
}

export type DocumentType = 
  | 'earnings_call_transcript'
  | 'investor_presentation'
  | 'annual_report'
  | 'quarterly_results'
  | 'analyst_report'
  | 'other';

export interface UploadedDocument {
  id: string;
  companyId?: string;
  title: string;
  fileName?: string;
  fileType: DocumentType;
  period: string; // e.g. "Q1 FY27", "FY 2024-25"
  uploadDate: string;
  fileSize?: string;
  summary: string;
  keyHighlights: string[];
  extractedMetrics?: string[];
  managementTone?: string;
  rawText?: string;
  pageCount?: number;
}

export interface FinancialLineItem {
  canonicalKey: string;
  rawLabel: string;
  category: 'income' | 'expense' | 'asset' | 'liability' | 'equity' | 'cash_flow' | 'ratio';
  values: { [period: string]: number }; // period -> numeric value
  unit: string;
  currency: string;
}

export interface FinancialStatementData {
  companyId?: string;
  periods: string[]; // e.g. ["Mar-21", "Mar-22", "Mar-23", "Mar-24", "Mar-25"] or ["Jun-25", "Sep-25", "Dec-25", "Mar-26"]
  incomeStatement: FinancialLineItem[];
  quarterlyIncomeStatement?: FinancialLineItem[];
  balanceSheet: FinancialLineItem[];
  cashFlowStatement: FinancialLineItem[];
  derivedMetrics: DerivedMetrics;
  sourceTemplateName?: string;
  rawCsvOrData?: string;
}

export interface DerivedMetrics {
  periods: string[];
  revenueYoY: { [period: string]: number };
  ebitdaYoY?: { [period: string]: number };
  patYoY?: { [period: string]: number };
  grossMarginPct?: { [period: string]: number };
  ebitdaMarginPct: { [period: string]: number };
  netProfitMarginPct: { [period: string]: number };
  rocePct: { [period: string]: number };
  ronwPct: { [period: string]: number };
  debtToEquity: { [period: string]: number };
  currentRatio: { [period: string]: number };
  freeCashFlow: { [period: string]: number };
  fcfToPatPct: { [period: string]: number };
  eps: { [period: string]: number };
}

export interface MappingField {
  canonicalKey: string;
  canonicalLabel: string;
  statement: 'pnl' | 'balance_sheet' | 'cash_flow' | 'ratios';
  matchedHeader: string;
  confidence: number; // 0 to 1
  isUserConfirmed: boolean;
}

export interface CitationItem {
  id: string;
  docTitle: string;
  docType: DocumentType;
  pageOrSection: string;
  period: string;
  excerpt: string;
}

export interface DiscrepancyCheck {
  id: string;
  claim: string;
  documentSource: string;
  statedValue: string;
  auditedFinancialValue: string;
  status: 'verified' | 'discrepancy' | 'unverified';
  explanation: string;
  citationId?: string;
}

export interface DetailedAnalysis {
  revenueMarginTrends: {
    summary: string;
    yoyCommentary: string;
    qoqCommentary: string;
    keyDrivers: string[];
    citations: string[];
  };
  balanceSheetHealth: {
    summary: string;
    leverageAnalysis: string;
    liquidityAnalysis: string;
    workingCapitalAssessment: string;
    citations: string[];
  };
  cashFlowQuality: {
    summary: string;
    ocfVsPatAnalysis: string;
    capexTrends: string;
    fcfGeneration: string;
    citations: string[];
  };
  segmentPerformance: {
    summary: string;
    segments: Array<{
      name: string;
      sharePct: number;
      growthYoY: string;
      commentary: string;
    }>;
    citations: string[];
  };
  managementCommentary: {
    summary: string;
    tone: 'Bullish' | 'Constructive' | 'Neutral' | 'Cautious';
    hedgingObservations: string[];
    strategicInitiatives: string[];
    citations: string[];
  };
  guidanceVsActuals: {
    summary: string;
    comparisons: Array<{
      metric: string;
      guidanceOrExpected: string;
      actualDelivered: string;
      verdict: 'Beat' | 'Met' | 'Miss';
      notes: string;
    }>;
    citations: string[];
  };
}

export interface InvestmentThesis {
  recommendation: 'STRONG BUY' | 'BUY' | 'HOLD' | 'REDUCE' | 'SELL';
  targetPrice?: number;
  currentPrice?: number;
  impliedUpsidePct?: number;
  targetMultiple?: string;
  valuationContext: string;
  executiveSummary: string;
  bullCase: {
    title: string;
    pillars: Array<{
      title: string;
      detail: string;
      impact: 'High' | 'Medium';
      citation?: string;
    }>;
  };
  bearCase: {
    title: string;
    risks: Array<{
      category: 'Regulatory' | 'Competition' | 'Execution' | 'Financial' | 'Macro';
      detail: string;
      severity: 'High' | 'Medium' | 'Low';
      citation?: string;
    }>;
  };
  inflectionPoints: Array<{
    event: string;
    timeframe: string;
    financialImpact: string;
    description: string;
  }>;
  monitoringCatalysts: Array<{
    catalyst: string;
    expectedTiming: string;
    potentialDirection: 'Positive' | 'Negative' | 'Binary';
  }>;
  whatWouldChangeView: string[];
}

export interface AnalysisRun {
  id: string;
  companyId: string;
  runDate: string;
  status: 'completed' | 'running' | 'failed';
  executedBy: {
    userId: string;
    userName: string;
    userRole: UserRole;
  };
  version: string;
  detailedAnalysis: DetailedAnalysis;
  investmentThesis: InvestmentThesis;
  discrepancies: DiscrepancyCheck[];
  citations: CitationItem[];
  financialModelSummary?: {
    latestRevenue: string;
    latestEbitdaMargin: string;
    latestPat: string;
    latestRoce: string;
    fyForecastRevenue?: string;
    fyForecastPat?: string;
  };
}

export interface SentimentRecord {
  id: string;
  companyId: string;
  timestamp: string; // ISO date string
  source: string;
  headline: string;
  summary: string;
  url?: string;
  sentimentScore: number; // -1.00 to +1.00
  sentimentLabel: 'Very Bullish' | 'Bullish' | 'Neutral' | 'Bearish' | 'Very Bearish';
  keyTopic: string;
  rationale: string;
  isMajorEvent: boolean;
  eventTag?: string;
  sourceType: 'automated_feed' | 'manual_upload' | 'analyst_note';
}

export interface Company {
  id: string;
  ticker: string;
  name: string;
  exchange: string;
  sector: string;
  industry: string;
  country: string;
  currency: string;
  reportingUnit: 'Crores' | 'Lakhs' | 'Millions' | 'Billions';
  currentPrice: number;
  marketCapCr: number;
  peRatio?: number;
  pbRatio?: number;
  dividendYieldPct?: number;
  description: string;
  logoText?: string;
  financialData?: FinancialStatementData;
  documents: UploadedDocument[];
  latestAnalysis?: AnalysisRun;
  analysisHistory: AnalysisRun[];
  sentimentHistory: SentimentRecord[];
  turnaroundRiskTable?: TurnaroundRiskTableData;
  createdAt: string;
  lastUpdated: string;
}

export type FundBucket = 'Growth Mantra' | 'Wealth Mantra';
export type AssessmentRating = 'Good' | 'Neutral' | 'Poor';

export interface TurnaroundItem {
  title: string;
  text: string;
}

export interface RiskItem {
  title: string;
  text: string;
}

export interface TurnaroundRiskTableData {
  companyName: string;
  sector?: string;
  fundBucket: FundBucket;
  aiSuggestedRating: AssessmentRating;
  selectedRating?: AssessmentRating | 'AI Suggested';
  turnarounds: TurnaroundItem[];
  risks: RiskItem[];
  generatedAt?: string;
}

export type WorkspaceTab = 'quick_memo' | 'deep_dive';

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  companyId?: string;
  companyName?: string;
  action: 'analysis_run' | 'document_upload' | 'mapping_update' | 'company_created' | 'news_ingested' | 'thesis_edited';
  details: string;
}

export interface LineItemMapping {
  rawLabel: string;
  canonicalKey: string;
  confidenceScore: number;
  statementType: 'income_statement' | 'balance_sheet' | 'cash_flow' | 'ratios';
  values: { [period: string]: number };
}

export const CANONICAL_FINANCIAL_KEYS = [
  { key: 'operating_revenue', label: 'Revenue from Operations / Gross Sales', category: 'income' },
  { key: 'other_income', label: 'Other Income / Treasury Income', category: 'income' },
  { key: 'employee_expenses', label: 'Employee Benefits Expense', category: 'expense' },
  { key: 'operating_expenses', label: 'Operating & Establishment Expenses', category: 'expense' },
  { key: 'it_expenses', label: 'IT & Software Support Expenses', category: 'expense' },
  { key: 'other_expenses', label: 'Other Administration & Miscellaneous Expenses', category: 'expense' },
  { key: 'total_expenditure', label: 'Total Operating Expenditure', category: 'expense' },
  { key: 'ebitda', label: 'EBITDA / Operating Profit (PBIDT)', category: 'income' },
  { key: 'depreciation', label: 'Depreciation & Amortization', category: 'expense' },
  { key: 'finance_costs', label: 'Finance Costs / Interest', category: 'expense' },
  { key: 'pbt', label: 'Profit Before Tax (PBT)', category: 'income' },
  { key: 'tax_expense', label: 'Tax Expenses / Provision for Tax', category: 'expense' },
  { key: 'pat', label: 'Profit After Tax (PAT) / Net Profit', category: 'income' },
  { key: 'eps', label: 'Earnings Per Share (EPS)', category: 'ratio' },
  { key: 'dividend_pct', label: 'Equity Dividend %', category: 'ratio' },
  { key: 'equity_share_capital', label: 'Equity Share Capital', category: 'equity' },
  { key: 'reserves_and_surplus', label: 'Reserves & Surplus', category: 'equity' },
  { key: 'net_worth', label: 'Net Worth / Shareholders Funds', category: 'equity' },
  { key: 'core_sgf', label: 'Core Settlement Guarantee Fund (SGF)', category: 'liability' },
  { key: 'total_debt', label: 'Total Borrowings / Debt', category: 'liability' },
  { key: 'gross_block', label: 'Gross Block / PPE', category: 'asset' },
  { key: 'net_block', label: 'Net Block / Fixed Assets', category: 'asset' },
  { key: 'investments_non_current', label: 'Non-Current Investments', category: 'asset' },
  { key: 'current_investments', label: 'Current Investments', category: 'asset' },
  { key: 'trade_receivables', label: 'Sundry Debtors / Trade Receivables', category: 'asset' },
  { key: 'cash_bank_balances', label: 'Cash and Bank Balances', category: 'asset' },
  { key: 'total_current_assets', label: 'Total Current Assets', category: 'asset' },
  { key: 'total_current_liabilities', label: 'Total Current Liabilities', category: 'liability' },
  { key: 'total_assets', label: 'Total Assets / Balance Sheet Size', category: 'asset' },
  { key: 'cash_flow_operations', label: 'Cash Flow from Operations (OCF)', category: 'cash_flow' },
  { key: 'capital_expenditure', label: 'Capital Expenditure / Capex', category: 'cash_flow' },
  { key: 'cash_flow_investing', label: 'Cash Flow from Investing Activities', category: 'cash_flow' },
  { key: 'cash_flow_financing', label: 'Cash Flow from Financing Activities', category: 'cash_flow' },
  { key: 'free_cash_flow', label: 'Free Cash Flow (FCF)', category: 'cash_flow' },
  { key: 'net_cash_inflow', label: 'Net Cash Inflow / (Outflow)', category: 'cash_flow' }
];

export interface PipelinePromptConfig {
  detailedAnalysisPrompt: string;
  investmentThesisPrompt: string;
  thesisSystemPrompt?: string;
  discrepancyCheckPrompt?: string;
  sentimentPrompt: string;
  modeAPrompt?: string;
  temperature?: number;
  maxCitationDepth?: number;
  verificationStrictness: 'High' | 'Standard' | 'Relaxed';
  citationRequirement: boolean;
}
