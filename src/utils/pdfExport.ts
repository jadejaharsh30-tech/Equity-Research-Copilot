import jsPDF from 'jspdf';
import { Company, AnalysisRun, SentimentRecord } from '../types';

export function exportAnalysisToPdf(company: Company, analysis: AnalysisRun) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const primaryColor = [15, 23, 42]; // Slate 900
  const secondaryColor = [30, 58, 138]; // Blue 900
  const accentColor = [2, 132, 199]; // Sky 600
  const textDark = [30, 41, 59];
  const textMuted = [100, 116, 139];

  let y = 18;
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;

  // Header Banner
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageWidth, 28, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('EQUITY RESEARCH COPILOT — INSTITUTIONAL REPORT', margin, 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Generated: ${new Date().toLocaleDateString()} | Version: ${analysis.version} | Author: ${analysis.executedBy.userName} (${analysis.executedBy.userRole.toUpperCase()})`, margin, 20);

  y = 38;

  // Company Overview Box
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, y, contentWidth, 26, 2, 2, 'FD');

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(`${company.name} (${company.ticker})`, margin + 4, y + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text(`Sector: ${company.sector} | Industry: ${company.industry} | Exchange: ${company.exchange}`, margin + 4, y + 14);
  doc.text(`Current Price: ${company.currency} ${company.currentPrice} | Market Cap: ${company.currency} ${company.marketCapCr} Cr | P/E: ${company.peRatio || 'N/A'}x`, margin + 4, y + 20);

  // Recommendation Badge
  const rec = analysis.investmentThesis.recommendation;
  const recBg = rec.includes('BUY') ? [22, 101, 52] : rec.includes('SELL') ? [153, 27, 27] : [133, 77, 14];
  doc.setFillColor(recBg[0], recBg[1], recBg[2]);
  doc.roundedRect(pageWidth - margin - 38, y + 4, 34, 16, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text(rec, pageWidth - margin - 21, y + 14, { align: 'center' });

  y += 34;

  // Executive Summary & Thesis
  doc.setTextColor(30, 58, 138);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('1. INVESTMENT THESIS & EXECUTIVE SUMMARY', margin, y);
  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  
  const execLines = doc.splitTextToSize(analysis.investmentThesis.executiveSummary, contentWidth);
  doc.text(execLines, margin, y);
  y += execLines.length * 4.5 + 4;

  // Target Price & Valuation Context
  if (analysis.investmentThesis.targetPrice) {
    doc.setFont('helvetica', 'bold');
    doc.text(`Target Price: ${company.currency} ${analysis.investmentThesis.targetPrice} (${analysis.investmentThesis.impliedUpsidePct}% upside) | Valuation Basis: ${analysis.investmentThesis.targetMultiple || 'Multiple'}`, margin, y);
    y += 5;
  }
  const valLines = doc.splitTextToSize(`Valuation Rationale: ${analysis.investmentThesis.valuationContext}`, contentWidth);
  doc.setFont('helvetica', 'normal');
  doc.text(valLines, margin, y);
  y += valLines.length * 4.5 + 6;

  // Bull Case
  doc.setFillColor(240, 253, 244);
  doc.setDrawColor(187, 247, 208);
  doc.roundedRect(margin, y, contentWidth, 24, 2, 2, 'FD');
  doc.setTextColor(22, 101, 52);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text(`BULL CASE: ${analysis.investmentThesis.bullCase.title}`, margin + 3, y + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  let bullY = y + 11;
  analysis.investmentThesis.bullCase.pillars.slice(0, 3).forEach((p) => {
    doc.text(`• [${p.impact} Impact] ${p.title}: ${p.detail.slice(0, 110)}...`, margin + 3, bullY);
    bullY += 4.5;
  });
  y += 28;

  // Bear Case
  doc.setFillColor(254, 242, 242);
  doc.setDrawColor(254, 202, 202);
  doc.roundedRect(margin, y, contentWidth, 24, 2, 2, 'FD');
  doc.setTextColor(153, 27, 27);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text(`BEAR CASE: ${analysis.investmentThesis.bearCase.title}`, margin + 3, y + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  let bearY = y + 11;
  analysis.investmentThesis.bearCase.risks.slice(0, 3).forEach((r) => {
    doc.text(`• [${r.category} | ${r.severity} Risk] ${r.detail.slice(0, 110)}...`, margin + 3, bearY);
    bearY += 4.5;
  });
  y += 30;

  // Page 2: Detailed Analysis & Citations
  doc.addPage();
  y = 18;

  doc.setTextColor(30, 58, 138);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('2. DETAILED FINANCIAL & QUALITATIVE ANALYSIS', margin, y);
  y += 8;

  const det = analysis.detailedAnalysis;

  // Revenue & Margin Trends
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('A. Revenue & Margin Dynamics (YoY / QoQ)', margin, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  const revLines = doc.splitTextToSize(det.revenueMarginTrends.summary, contentWidth);
  doc.text(revLines, margin, y);
  y += revLines.length * 4.2 + 5;

  // Balance Sheet & Cash Flow
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('B. Balance Sheet Health & Cash Flow Quality', margin, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  const bsLines = doc.splitTextToSize(`${det.balanceSheetHealth.summary} Cash Flow: ${det.cashFlowQuality.summary}`, contentWidth);
  doc.text(bsLines, margin, y);
  y += bsLines.length * 4.2 + 5;

  // Management Commentary
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text(`C. Management Commentary & Tone (Tone: ${det.managementCommentary.tone})`, margin, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  const mgmtLines = doc.splitTextToSize(det.managementCommentary.summary, contentWidth);
  doc.text(mgmtLines, margin, y);
  y += mgmtLines.length * 4.2 + 8;

  // Cross-Document Discrepancy & Verification
  doc.setTextColor(30, 58, 138);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('3. CROSS-DOCUMENT VERIFICATION & DISCREPANCY CHECKS', margin, y);
  y += 6;

  analysis.discrepancies.forEach((disc) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    const statusText = disc.status === 'verified' ? '✓ VERIFIED' : '⚠ DISCREPANCY';
    doc.setTextColor(disc.status === 'verified' ? 22 : 185, disc.status === 'verified' ? 101 : 28, disc.status === 'verified' ? 52 : 28);
    doc.text(`[${statusText}] ${disc.claim}`, margin, y);
    y += 4;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text(`Source: ${disc.documentSource} | Stated: ${disc.statedValue} | Financials: ${disc.auditedFinancialValue}`, margin + 3, y);
    y += 4.5;
  });

  y += 4;

  // Source Citations Index
  doc.setTextColor(30, 58, 138);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('4. SOURCE CITATION REPOSITORY', margin, y);
  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);

  analysis.citations.forEach((cit, idx) => {
    doc.text(`[${idx + 1}] ${cit.docTitle} (${cit.pageOrSection}): "${cit.excerpt}"`, margin, y);
    y += 4.5;
  });

  // Save PDF
  doc.save(`${company.ticker}_Equity_Research_Report.pdf`);
}

export function exportFinancialsToCsv(company: Company) {
  if (!company.financialData) return;

  const { periods, incomeStatement, balanceSheet, cashFlowStatement, derivedMetrics } = company.financialData;

  let csvContent = `Financial Data Export: ${company.name} (${company.ticker})\n`;
  csvContent += `Unit: ${company.reportingUnit}, Currency: ${company.currency}\n\n`;

  // Income Statement
  csvContent += '--- PROFIT & LOSS STATEMENT ---\n';
  csvContent += `Line Item,${periods.join(',')}\n`;
  incomeStatement.forEach(item => {
    const vals = periods.map(p => item.values[p] ?? '');
    csvContent += `"${item.rawLabel}",${vals.join(',')}\n`;
  });
  csvContent += '\n';

  // Balance Sheet
  csvContent += '--- BALANCE SHEET ---\n';
  csvContent += `Line Item,${periods.join(',')}\n`;
  balanceSheet.forEach(item => {
    const vals = periods.map(p => item.values[p] ?? '');
    csvContent += `"${item.rawLabel}",${vals.join(',')}\n`;
  });
  csvContent += '\n';

  // Cash Flow
  csvContent += '--- CASH FLOW STATEMENT ---\n';
  csvContent += `Line Item,${periods.join(',')}\n`;
  cashFlowStatement.forEach(item => {
    const vals = periods.map(p => item.values[p] ?? '');
    csvContent += `"${item.rawLabel}",${vals.join(',')}\n`;
  });
  csvContent += '\n';

  // Derived Metrics
  csvContent += '--- DERIVED RATIOS & PERFORMANCE METRICS ---\n';
  csvContent += `Metric,${periods.join(',')}\n`;
  csvContent += `Revenue Growth YoY (%),${periods.map(p => derivedMetrics.revenueYoY[p] ?? '').join(',')}\n`;
  csvContent += `EBITDA Margin (%),${periods.map(p => derivedMetrics.ebitdaMarginPct[p] ?? '').join(',')}\n`;
  csvContent += `Net Profit Margin (%),${periods.map(p => derivedMetrics.netProfitMarginPct[p] ?? '').join(',')}\n`;
  csvContent += `ROCE (%),${periods.map(p => derivedMetrics.rocePct[p] ?? '').join(',')}\n`;
  csvContent += `RONW / ROE (%),${periods.map(p => derivedMetrics.ronwPct[p] ?? '').join(',')}\n`;
  csvContent += `Debt to Equity (x),${periods.map(p => derivedMetrics.debtToEquity[p] ?? '').join(',')}\n`;
  csvContent += `Current Ratio (x),${periods.map(p => derivedMetrics.currentRatio[p] ?? '').join(',')}\n`;
  csvContent += `Free Cash Flow (Cr),${periods.map(p => derivedMetrics.freeCashFlow[p] ?? '').join(',')}\n`;
  csvContent += `FCF / PAT (%),${periods.map(p => derivedMetrics.fcfToPatPct[p] ?? '').join(',')}\n`;

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${company.ticker}_Financial_Statements_Metrics.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportSentimentToCsv(company: Company) {
  let csvContent = `News Sentiment History: ${company.name} (${company.ticker})\n`;
  csvContent += `Timestamp,Source,Headline,Sentiment Score,Label,Key Topic,Rationale,Major Event\n`;

  (company.sentimentHistory || []).forEach(s => {
    csvContent += `"${s.timestamp}","${s.source}","${s.headline.replace(/"/g, '""')}",${s.sentimentScore},"${s.sentimentLabel}","${s.keyTopic}","${s.rationale.replace(/"/g, '""')}",${s.isMajorEvent ? 'YES' : 'NO'}\n`;
  });

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${company.ticker}_Sentiment_History.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
