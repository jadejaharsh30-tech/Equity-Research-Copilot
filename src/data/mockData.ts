import { Company, User, AuditLog, PipelinePromptConfig } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'user_admin',
    name: 'Harsh Raj',
    email: 'harshraj@turtlewealth.in',
    role: 'admin',
    assignedCompanyIds: 'all'
  }
];

export const INITIAL_PROMPT_CONFIG: PipelinePromptConfig = {
  modeAPrompt: `You are a Principal Equity Research Analyst synthesizing a high-conviction 2-Column Institutional Quick Memo.
Analyze the company's financial trajectory, management commentary, market moat, and competitive landscape.
Generate:
1. Turnaround & Structural Triggers: 4-6 concise, high-impact catalysts (e.g. Operating Leverage, Capacity Expansion, Market Share Gains, Regulatory tailwinds, Margin Expansion).
2. Key Problems, Vulnerabilities & Risks: 4-6 specific risk items (e.g. Regulatory scrutiny, Customer concentration, Tech disruption, Execution lag, Cyclicality).
3. Fund Bucket Assessment: 'Growth Mantra' (high beta, earnings acceleration) vs 'Wealth Mantra' (steady compounding, cash flow moat).
4. AI Suggested Rating: 'Good' (Strong turnaround clarity), 'Neutral' (Balanced risk/reward), or 'Poor' (Elevated downside).`,
  thesisSystemPrompt: `Formulate an institutional equity research Investment Thesis with rigorous valuation framework, bull/bear cases with quantified drivers, inflection points, and catalyst calendar.`,
  detailedAnalysisPrompt: `You are a Principal Equity Research Analyst. Reason across all provided structured financial statements (Excel/CSV) and qualitative disclosures (earnings transcripts, presentations, annual reports).
Provide:
1. Revenue & Margin Trends (YoY, QoQ) with key drivers
2. Balance Sheet Health (liquidity, debt, working capital)
3. Cash Flow Quality (OCF vs PAT conversion, Capex trends, FCF)
4. Segment performance & market share
5. Management commentary synthesis from con-calls (Tone, hedging language, strategic milestones)
6. Guidance vs Actuals comparison
Include exact inline citations: [DocName, Section/Page].`,
  investmentThesisPrompt: `Formulate a structured Investment Thesis:
1. Recommendation (STRONG BUY / BUY / HOLD / REDUCE / SELL)
2. Target valuation, implied multiples, fair value context
3. Bull Case (3-4 structural growth drivers with quantified impact)
4. Bear Case (regulatory, competitive, execution, cyclical risks)
5. Key Turnaround & Inflection Points
6. Catalysts to monitor & what would change this view`,
  discrepancyCheckPrompt: `Audit all management statements and claims in qualitative documents against audited financial line items and notes. Flag discrepancies with quantitative evidence.`,
  sentimentPrompt: `Analyze news headlines and qualitative text. Output sentiment score (-1.00 to +1.00), sentiment category, key topic driver, and a concise 1-line rationale.`,
  temperature: 0.2,
  maxCitationDepth: 5,
  verificationStrictness: 'High',
  citationRequirement: true
};

export const INITIAL_COMPANIES: Company[] = [];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [];
