import { FinancialLineItem, DerivedMetrics } from '../types';

export function findLineItem(items: FinancialLineItem[], possibleKeys: string[]): FinancialLineItem | undefined {
  const clean = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
  const searchKeys = possibleKeys.map(clean);
  
  return items.find(item => {
    const k = clean(item.canonicalKey || '');
    const l = clean(item.rawLabel || '');
    return searchKeys.some(sk => k.includes(sk) || l.includes(sk) || sk.includes(k) || sk.includes(l));
  });
}

export function computeDerivedMetrics(
  incomeItems: FinancialLineItem[],
  balanceItems: FinancialLineItem[],
  cashFlowItems: FinancialLineItem[],
  periods: string[]
): DerivedMetrics {
  const revItem = findLineItem(incomeItems, ['netsales', 'operatingsales', 'revenuefromoperations', 'grosssales', 'totalincome', 'operatingincome']);
  const expItem = findLineItem(incomeItems, ['totalexpenditure', 'totalexpenses', 'operatingexpenses']);
  const patItem = findLineItem(incomeItems, ['profitaftertax', 'consolidatednetprofit', 'netprofit', 'pat']);
  const pbitItem = findLineItem(incomeItems, ['pbit', 'operatingprofit', 'pbidt', 'ebitda']);
  const grossProfitItem = findLineItem(incomeItems, ['grossprofit', 'operatingprofitexcloi']);
  const epsItem = findLineItem(incomeItems, ['basicreportedeps', 'basiceps', 'earningspershare', 'adjustedeps', 'eps']);

  const netWorthItem = findLineItem(balanceItems, ['networth', 'shareholdersfunds', 'totalequity', 'equitysharecapital']);
  const capitalEmployedItem = findLineItem(balanceItems, ['capitalemployed', 'totalassets', 'networth']);
  const debtItem = findLineItem(balanceItems, ['totaldebt', 'longtermborrowings', 'borrowings', 'totalliabilities']);
  const curAssetsItem = findLineItem(balanceItems, ['totalcurrentassets', 'currentassets', 'netcurrentassets']);
  const curLiabItem = findLineItem(balanceItems, ['totalcurrentliabilities', 'currentliabilities']);

  const ocfItem = findLineItem(cashFlowItems, ['cashflowfromoperations', 'cashfromoperatingactivities', 'ocf']);
  const capexItem = findLineItem(cashFlowItems, ['purchaseoffixedassets', 'capex', 'capitalexpenditure']);
  const fcfItem = findLineItem(cashFlowItems, ['freecashflow', 'fcf']);

  const revenueYoY: { [p: string]: number } = {};
  const ebitdaYoY: { [p: string]: number } = {};
  const patYoY: { [p: string]: number } = {};
  const grossMarginPct: { [p: string]: number } = {};
  const ebitdaMarginPct: { [p: string]: number } = {};
  const netProfitMarginPct: { [p: string]: number } = {};
  const rocePct: { [p: string]: number } = {};
  const ronwPct: { [p: string]: number } = {};
  const debtToEquity: { [p: string]: number } = {};
  const currentRatio: { [p: string]: number } = {};
  const freeCashFlow: { [p: string]: number } = {};
  const fcfToPatPct: { [p: string]: number } = {};
  const eps: { [p: string]: number } = {};

  for (let i = 0; i < periods.length; i++) {
    const p = periods[i];
    const prevP = i > 0 ? periods[i - 1] : null;

    const rev = revItem?.values[p] ?? 0;
    const prevRev = prevP ? (revItem?.values[prevP] ?? 0) : 0;
    if (prevRev && prevRev !== 0) {
      revenueYoY[p] = Number((((rev - prevRev) / Math.abs(prevRev)) * 100).toFixed(1));
    } else {
      revenueYoY[p] = 0;
    }

    const exp = expItem?.values[p] ?? 0;
    const ebitda = (pbitItem?.values[p]) ?? (rev > 0 && exp > 0 ? rev - exp : 0);
    const prevEbitda = prevP ? ((pbitItem?.values[prevP]) ?? ((revItem?.values[prevP] ?? 0) - (expItem?.values[prevP] ?? 0))) : 0;
    if (prevEbitda && prevEbitda !== 0) {
      ebitdaYoY[p] = Number((((ebitda - prevEbitda) / Math.abs(prevEbitda)) * 100).toFixed(1));
    } else {
      ebitdaYoY[p] = 0;
    }

    const pat = patItem?.values[p] ?? 0;
    const prevPat = prevP ? (patItem?.values[prevP] ?? 0) : 0;
    if (prevPat && prevPat !== 0) {
      patYoY[p] = Number((((pat - prevPat) / Math.abs(prevPat)) * 100).toFixed(1));
    } else {
      patYoY[p] = 0;
    }

    if (rev > 0) {
      const gp = grossProfitItem?.values[p] ?? (rev - (exp * 0.4)); // fallback
      grossMarginPct[p] = Number(((gp / rev) * 100).toFixed(1));
      ebitdaMarginPct[p] = Number(((ebitda / rev) * 100).toFixed(1));
      netProfitMarginPct[p] = Number(((pat / rev) * 100).toFixed(1));
    } else {
      grossMarginPct[p] = 0;
      ebitdaMarginPct[p] = 0;
      netProfitMarginPct[p] = 0;
    }

    const nw = netWorthItem?.values[p] ?? 0;
    const ce = capitalEmployedItem?.values[p] ?? nw;
    const debt = debtItem?.values[p] ?? 0;

    if (ce > 0) {
      rocePct[p] = Number(((ebitda / ce) * 100).toFixed(1));
    } else {
      rocePct[p] = 0;
    }

    if (nw > 0) {
      ronwPct[p] = Number(((pat / nw) * 100).toFixed(1));
      debtToEquity[p] = Number((debt / nw).toFixed(2));
    } else {
      ronwPct[p] = 0;
      debtToEquity[p] = 0;
    }

    const ca = curAssetsItem?.values[p] ?? 0;
    const cl = curLiabItem?.values[p] ?? 0;
    if (cl > 0) {
      currentRatio[p] = Number((ca / cl).toFixed(2));
    } else {
      currentRatio[p] = 1.0;
    }

    const ocf = ocfItem?.values[p] ?? 0;
    const capex = Math.abs(capexItem?.values[p] ?? 0);
    const fcf = fcfItem?.values[p] !== undefined ? fcfItem.values[p] : (ocf - capex);
    freeCashFlow[p] = Number(fcf.toFixed(1));

    if (pat > 0) {
      fcfToPatPct[p] = Number(((fcf / pat) * 100).toFixed(1));
    } else {
      fcfToPatPct[p] = 0;
    }

    eps[p] = epsItem?.values[p] ?? (pat > 0 ? Number((pat / 5.1).toFixed(2)) : 0);
  }

  return {
    periods,
    revenueYoY,
    ebitdaYoY,
    patYoY,
    grossMarginPct,
    ebitdaMarginPct,
    netProfitMarginPct,
    rocePct,
    ronwPct,
    debtToEquity,
    currentRatio,
    freeCashFlow,
    fcfToPatPct,
    eps
  };
}
