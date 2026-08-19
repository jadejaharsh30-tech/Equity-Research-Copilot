import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Company } from '../types';
import { Edit3, X, Save, RefreshCw } from 'lucide-react';

interface EditCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  company: Company;
}

export const EditCompanyModal: React.FC<EditCompanyModalProps> = ({
  isOpen,
  onClose,
  company
}) => {
  const { updateCompany, runAnalysis } = useApp();

  const [name, setName] = useState(company.name);
  const [ticker, setTicker] = useState(company.ticker);
  const [exchange, setExchange] = useState(company.exchange || 'NSE / BSE');
  const [sector, setSector] = useState(company.sector || '');
  const [industry, setIndustry] = useState(company.industry || '');
  const [currentPrice, setCurrentPrice] = useState(company.currentPrice?.toString() || '');
  const [marketCapCr, setMarketCapCr] = useState(company.marketCapCr?.toString() || '');
  const [currency, setCurrency] = useState(company.currency || 'INR');
  const [peRatio, setPeRatio] = useState(company.peRatio?.toString() || '');
  const [pbRatio, setPbRatio] = useState(company.pbRatio?.toString() || '');
  const [description, setDescription] = useState(company.description || '');
  const [reRunAnalysisOnSave, setReRunAnalysisOnSave] = useState(false);

  useEffect(() => {
    setName(company.name);
    setTicker(company.ticker);
    setExchange(company.exchange || 'NSE / BSE');
    setSector(company.sector || '');
    setIndustry(company.industry || '');
    setCurrentPrice(company.currentPrice?.toString() || '');
    setMarketCapCr(company.marketCapCr?.toString() || '');
    setCurrency(company.currency || 'INR');
    setPeRatio(company.peRatio?.toString() || '');
    setPbRatio(company.pbRatio?.toString() || '');
    setDescription(company.description || '');
  }, [company]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !ticker) return;

    const updatedData: Partial<Company> = {
      name: name.trim(),
      ticker: ticker.trim().toUpperCase(),
      exchange: exchange.trim(),
      sector: sector.trim(),
      industry: industry.trim(),
      currentPrice: parseFloat(currentPrice) || company.currentPrice,
      marketCapCr: parseFloat(marketCapCr) || company.marketCapCr,
      currency: currency.trim(),
      peRatio: parseFloat(peRatio) || company.peRatio,
      pbRatio: parseFloat(pbRatio) || company.pbRatio,
      description: description.trim()
    };

    updateCompany(company.id, updatedData);
    onClose();

    if (reRunAnalysisOnSave) {
      setTimeout(() => {
        runAnalysis();
      }, 200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 font-bold">
              <Edit3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm font-heading">
                Edit Company & Coverage Profile
              </h3>
              <p className="text-[11px] text-slate-500">
                Update market parameters, financials, or sector classification
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Company Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Ticker Symbol</label>
              <input
                type="text"
                value={ticker}
                onChange={(e) => setTicker(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono uppercase text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Exchange</label>
              <input
                type="text"
                value={exchange}
                onChange={(e) => setExchange(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Sector</label>
              <input
                type="text"
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Industry</label>
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Current Price ({currency})</label>
              <input
                type="number"
                step="any"
                value={currentPrice}
                onChange={(e) => setCurrentPrice(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Market Cap (Cr)</label>
              <input
                type="number"
                step="any"
                value={marketCapCr}
                onChange={(e) => setMarketCapCr(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">P/E Multiple</label>
              <input
                type="number"
                step="any"
                value={peRatio}
                onChange={(e) => setPeRatio(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Business Overview & Thesis Context</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Key product lines, business drivers, competitive advantage..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Optional Re-run Pipeline Checkbox */}
          <div className="bg-blue-50/70 border border-blue-200/60 rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-blue-600 shrink-0" />
              <div>
                <div className="text-xs font-bold text-slate-800">Re-run AI Synthesis Pipeline after saving?</div>
                <div className="text-[11px] text-slate-500">Recalculates upside potential, target multiples, and thesis pillars based on new inputs</div>
              </div>
            </div>
            <input
              type="checkbox"
              id="reRunAnalysis"
              checked={reRunAnalysisOnSave}
              onChange={(e) => setReRunAnalysisOnSave(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-slate-300 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
