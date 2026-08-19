import * as XLSX from 'xlsx';
import { FinancialLineItem, FinancialStatementData, MappingField } from '../types';
import { computeDerivedMetrics } from './financialCalculations';

export const CANONICAL_FIELDS: { key: string; label: string; category: FinancialLineItem['category']; aliases: string[] }[] = [
  // Income Statement
  { key: 'operating_revenue', label: 'Revenue from Operations / Gross Sales', category: 'income', aliases: ['gross sales', 'operating income', 'net sales', 'revenue from operations', 'total income', 'income from operations'] },
  { key: 'other_income', label: 'Other Income / Treasury Income', category: 'income', aliases: ['other income', 'investment income', 'non-operating income'] },
  { key: 'employee_expenses', label: 'Employee Benefits Expense', category: 'expense', aliases: ['employee cost', 'employee benefits expense', 'salaries and wages', 'staff cost', 'personnel expenses'] },
  { key: 'operating_expenses', label: 'Operating & Establishment Expenses', category: 'expense', aliases: ['operating & establishment expenses', 'operating & manufacturing expenses', 'c&s charges', 'cost of services'] },
  { key: 'it_expenses', label: 'IT & Software Support Expenses', category: 'expense', aliases: ['information technology and related expenses', 'software support and communication charges', 'tech expenses'] },
  { key: 'other_expenses', label: 'Other Administration & Miscellaneous Expenses', category: 'expense', aliases: ['administrations & other expenses', 'miscellaneous expenses', 'other expenses', 'general administration expenses'] },
  { key: 'total_expenditure', label: 'Total Operating Expenditure', category: 'expense', aliases: ['total expenditure', 'total expenses', 'operating expenses'] },
  { key: 'ebitda', label: 'EBITDA / Operating Profit (PBIDT)', category: 'income', aliases: ['operating profit (excl oi)', 'operating profit', 'pbidt', 'ebitda', 'pbidt (excl oi)'] },
  { key: 'depreciation', label: 'Depreciation & Amortization', category: 'expense', aliases: ['depreciation', 'depreciation and amortization expense', 'depreciation and amortisation expense'] },
  { key: 'finance_costs', label: 'Finance Costs / Interest', category: 'expense', aliases: ['interest', 'finance costs', 'interest expense'] },
  { key: 'pbt', label: 'Profit Before Tax (PBT)', category: 'income', aliases: ['profit before tax', 'pbt', 'profit before taxation & exceptional items'] },
  { key: 'tax_expense', label: 'Tax Expenses / Provision for Tax', category: 'expense', aliases: ['provision for tax', 'tax', 'tax expenses', 'current tax'] },
  { key: 'pat', label: 'Profit After Tax (PAT) / Net Profit', category: 'income', aliases: ['profit after tax', 'consolidated net profit', 'net profit (after extrodinary items)', 'pat'] },
  { key: 'eps', label: 'Earnings Per Share (EPS)', category: 'ratio', aliases: ['earnings per share(calculated)', 'eps - basic (reported)', 'basic eps before extraordinary items', 'adjusted eps', 'calculated eps (unit.curr.)'] },
  { key: 'dividend_pct', label: 'Equity Dividend %', category: 'ratio', aliases: ['equity dividend %', 'dividend (%)', 'dividend'] },

  // Balance Sheet
  { key: 'equity_share_capital', label: 'Equity Share Capital', category: 'equity', aliases: ['equity capital', 'equity paid up', 'share capital', 'equity share capital'] },
  { key: 'reserves_and_surplus', label: 'Reserves & Surplus', category: 'equity', aliases: ['reserves and surplus', 'total reserves', 'other equity', 'reserves'] },
  { key: 'net_worth', label: 'Net Worth / Shareholders Funds', category: 'equity', aliases: ['net worth', "shareholder's funds", 'total equity'] },
  { key: 'core_sgf', label: 'Core Settlement Guarantee Fund (SGF)', category: 'liability', aliases: ['core settlement guarantee fund (core sgf)', 'settlement guarantee fund', 'core sgf'] },
  { key: 'total_debt', label: 'Total Borrowings / Debt', category: 'liability', aliases: ['total debt', 'long-term borrowings', 'short term borrowings', 'borrowings'] },
  { key: 'gross_block', label: 'Gross Block / PPE', category: 'asset', aliases: ['gross block', 'property, plant and equipment'] },
  { key: 'net_block', label: 'Net Block / Fixed Assets', category: 'asset', aliases: ['net block', 'fixed assets', 'total property, plant and equipment'] },
  { key: 'investments_non_current', label: 'Non-Current Investments', category: 'asset', aliases: ['non current investments', 'investments', 'financial assets: non-current investments'] },
  { key: 'current_investments', label: 'Current Investments', category: 'asset', aliases: ['currents investments', 'current investments'] },
  { key: 'trade_receivables', label: 'Sundry Debtors / Trade Receivables', category: 'asset', aliases: ['sundry debtors', 'trade receivables'] },
  { key: 'cash_bank_balances', label: 'Cash and Bank Balances', category: 'asset', aliases: ['cash and bank', 'cash and bank balance', 'cash and cash equivalents', 'bank balances other than cash'] },
  { key: 'total_current_assets', label: 'Total Current Assets', category: 'asset', aliases: ['total current assets', 'current assets loans & advances'] },
  { key: 'total_current_liabilities', label: 'Total Current Liabilities', category: 'liability', aliases: ['total current liabilities', 'current liabilities'] },
  { key: 'total_assets', label: 'Total Assets / Balance Sheet Size', category: 'asset', aliases: ['total assets', 'total liabilities'] },

  // Cash Flow
  { key: 'cash_flow_operations', label: 'Cash Flow from Operations (OCF)', category: 'cash_flow', aliases: ['cash flow from operations', 'cash from operating activities', 'cash generated from operations'] },
  { key: 'capital_expenditure', label: 'Capital Expenditure / Capex', category: 'cash_flow', aliases: ['purchase of fixed assets', 'capital expenditure on property, plant and equipment', 'capex'] },
  { key: 'cash_flow_investing', label: 'Cash Flow from Investing Activities', category: 'cash_flow', aliases: ['cash flow from investing activities', 'cash flow from investing'] },
  { key: 'cash_flow_financing', label: 'Cash Flow from Financing Activities', category: 'cash_flow', aliases: ['cash from financing activities', 'cash flow from finance activities', 'cash flow from financing'] },
  { key: 'free_cash_flow', label: 'Free Cash Flow (FCF)', category: 'cash_flow', aliases: ['free cash flow', 'fcf'] },
  { key: 'net_cash_inflow', label: 'Net Cash Inflow / (Outflow)', category: 'cash_flow', aliases: ['net cash inflow / outflow', 'net increase / (decrease) in cash and cash equivalents'] }
];

export function parseRawCsvText(csvText: string): { sections: { title: string; headers: string[]; rows: { label: string; values: (number | null)[] }[] }[] } {
  const lines = csvText.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
  const sections: { title: string; headers: string[]; rows: { label: string; values: (number | null)[] }[] }[] = [];

  let currentTitle = 'Financial Statement';
  let currentHeaders: string[] = [];
  let currentRows: { label: string; values: (number | null)[] }[] = [];

  for (let line of lines) {
    // If it's a disclaimer or noise
    if (line.startsWith('"Source:') || line.startsWith('Disclaimer')) continue;

    const parts = line.split(',').map(p => p.trim().replace(/^"|"$/g, ''));
    const firstCell = parts[0];

    // Detect section header or title
    if (firstCell && (firstCell.includes('Multi Commodity Exchange') || firstCell.includes('Profit And Loss') || firstCell.includes('Balance Sheet') || firstCell.includes('Cash Flow') || firstCell.includes('Financial Highlights') || firstCell.includes('Trailing Quarters'))) {
      if (currentRows.length > 0) {
        sections.push({ title: currentTitle, headers: currentHeaders, rows: currentRows });
        currentRows = [];
      }
      currentTitle = firstCell;
      continue;
    }

    if (firstCell.toUpperCase() === 'DESCRIPTION' || firstCell.toUpperCase() === 'PARTICULARS') {
      currentHeaders = parts.slice(1).filter(h => h.length > 0);
      continue;
    }

    if (firstCell && currentHeaders.length > 0) {
      // Check if it has numbers
      const rawValues = parts.slice(1, currentHeaders.length + 1);
      const numericValues = rawValues.map(v => {
        const cleanV = v.replace(/,/g, '').replace(/%/g, '').trim();
        const num = parseFloat(cleanV);
        return isNaN(num) ? null : num;
      });

      // If at least one value is non-null or it's a valid row
      currentRows.push({
        label: firstCell,
        values: numericValues
      });
    }
  }

  if (currentRows.length > 0) {
    sections.push({ title: currentTitle, headers: currentHeaders, rows: currentRows });
  }

  return { sections };
}

export function autoMapLineItems(
  rawRows: { label: string; values: (number | null)[] }[],
  headers: string[],
  unit: string = 'Crores',
  currency: string = 'INR'
): { mappedItems: FinancialLineItem[]; mappingReview: MappingField[] } {
  const mappedItems: FinancialLineItem[] = [];
  const mappingReview: MappingField[] = [];

  const clean = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

  for (const cField of CANONICAL_FIELDS) {
    let bestMatchRow: { label: string; values: (number | null)[] } | null = null;
    let bestScore = 0;

    for (const row of rawRows) {
      const rowLabelClean = clean(row.label);
      if (!rowLabelClean) continue;

      for (const alias of cField.aliases) {
        const aliasClean = clean(alias);
        if (rowLabelClean === aliasClean) {
          bestMatchRow = row;
          bestScore = 1.0;
          break;
        } else if (rowLabelClean.startsWith(aliasClean) || rowLabelClean.includes(aliasClean)) {
          const score = aliasClean.length / rowLabelClean.length;
          if (score > bestScore) {
            bestScore = score;
            bestMatchRow = row;
          }
        }
      }
      if (bestScore === 1.0) break;
    }

    if (bestMatchRow && bestScore >= 0.5) {
      const valuesMap: { [p: string]: number } = {};
      headers.forEach((h, idx) => {
        const val = bestMatchRow!.values[idx];
        if (val !== null && val !== undefined) {
          valuesMap[h] = val;
        }
      });

      const statementType: 'pnl' | 'balance_sheet' | 'cash_flow' | 'ratios' = 
        cField.category === 'income' || cField.category === 'expense' ? 'pnl' :
        cField.category === 'asset' || cField.category === 'liability' || cField.category === 'equity' ? 'balance_sheet' :
        cField.category === 'cash_flow' ? 'cash_flow' : 'ratios';

      mappingReview.push({
        canonicalKey: cField.key,
        canonicalLabel: cField.label,
        statement: statementType,
        matchedHeader: bestMatchRow.label,
        confidence: Number(bestScore.toFixed(2)),
        isUserConfirmed: true
      });

      mappedItems.push({
        canonicalKey: cField.key,
        rawLabel: bestMatchRow.label,
        category: cField.category,
        values: valuesMap,
        unit,
        currency
      });
    }
  }

  return { mappedItems, mappingReview };
}

export function processExcelOrCsvData(rawText: string, templateName: string = 'Standard Financials'): FinancialStatementData {
  const { sections } = parseRawCsvText(rawText);

  // Group sections or pick the richest headers
  let mainHeaders: string[] = [];
  const allRows: { label: string; values: (number | null)[] }[] = [];

  for (const sec of sections) {
    if (sec.headers.length > mainHeaders.length && !sec.title.includes('Trailing Quarters')) {
      mainHeaders = sec.headers;
    }
    allRows.push(...sec.rows);
  }

  if (mainHeaders.length === 0 && sections.length > 0) {
    mainHeaders = sections[0].headers;
  }

  // Normalize chronological order if needed (e.g. Mar-10 -> Mar-25)
  // Let's reverse if starts from latest to oldest
  const isDescending = mainHeaders.length > 1 && (
    mainHeaders[0].includes('25') || mainHeaders[0].includes('26') || mainHeaders[0].includes('Mar-25')
  );
  const periodsInOrder = isDescending ? [...mainHeaders].reverse() : [...mainHeaders];

  const { mappedItems } = autoMapLineItems(allRows, periodsInOrder);

  const incomeStatement = mappedItems.filter(i => i.category === 'income' || i.category === 'expense');
  const balanceSheet = mappedItems.filter(i => i.category === 'asset' || i.category === 'liability' || i.category === 'equity');
  const cashFlowStatement = mappedItems.filter(i => i.category === 'cash_flow');

  const derivedMetrics = computeDerivedMetrics(incomeStatement, balanceSheet, cashFlowStatement, periodsInOrder);

  return {
    periods: periodsInOrder,
    incomeStatement,
    balanceSheet,
    cashFlowStatement,
    derivedMetrics,
    sourceTemplateName: templateName,
    rawCsvOrData: rawText
  };
}
