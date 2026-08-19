import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Building2, X } from 'lucide-react';

interface InitiateCoverageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InitiateCoverageModal: React.FC<InitiateCoverageModalProps> = ({ isOpen, onClose }) => {
  const { addCompany, setViewMode } = useApp();

  const [newTicker, setNewTicker] = useState('');
  const [newName, setNewName] = useState('');
  const [newExchange, setNewExchange] = useState('NSE / BSE');
  const [newSector, setNewSector] = useState('Financial Markets & Exchanges');
  const [newIndustry, setNewIndustry] = useState('Market Infrastructure');
  const [newPrice, setNewPrice] = useState('1200');
  const [newMarketCap, setNewMarketCap] = useState('15000');
  const [newCurrency, setNewCurrency] = useState('INR');
  const [newDescription, setNewDescription] = useState('');

  if (!isOpen) return null;

  const handleCreateCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicker || !newName) return;

    addCompany({
      ticker: newTicker.toUpperCase(),
      name: newName,
      exchange: newExchange,
      sector: newSector,
      industry: newIndustry,
      currency: newCurrency,
      currentPrice: parseFloat(newPrice) || 100,
      marketCapCr: parseFloat(newMarketCap) || 1000,
      description: newDescription || 'Institutional equity coverage profile initiated in Copilot.',
      reportingUnit: 'Crores',
      country: 'India',
      peRatio: 35.0,
      pbRatio: 6.5
    });

    onClose();
    setViewMode('workspace');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-sm">Initiate New Company Coverage</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleCreateCompany} className="mt-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Ticker Symbol</label>
              <input
                type="text"
                placeholder="e.g. CDSL, BSE, TRENT"
                value={newTicker}
                onChange={(e) => setNewTicker(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono uppercase focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Company Name</label>
              <input
                type="text"
                placeholder="e.g. Central Depository Services"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Sector</label>
              <input
                type="text"
                value={newSector}
                onChange={(e) => setNewSector(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Industry</label>
              <input
                type="text"
                value={newIndustry}
                onChange={(e) => setNewIndustry(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Current Price (INR)</label>
              <input
                type="number"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Market Cap (Cr)</label>
              <input
                type="number"
                value={newMarketCap}
                onChange={(e) => setNewMarketCap(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Business Description</label>
            <textarea
              rows={2}
              placeholder="Primary business model, key segments, and industry positioning..."
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
            >
              Initiate Coverage
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
