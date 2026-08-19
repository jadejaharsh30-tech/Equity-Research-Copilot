import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Building2, 
  Search, 
  Filter, 
  Plus, 
  ArrowUpRight, 
  Layers, 
  Sparkles, 
  TrendingUp, 
  Trash2, 
  CheckCircle2,
  SlidersHorizontal,
  FolderOpen,
  ArrowRight,
  TrendingDown,
  Edit3
} from 'lucide-react';
import { Company } from '../types';
import { EditCompanyModal } from './EditCompanyModal';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';

export const CoverageUniverseView: React.FC = () => {
  const { 
    companies, 
    setActiveCompanyId, 
    setViewMode, 
    addCompany, 
    deleteCompany, 
    currentUser,
    setComparisonCompanyIds
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [sectorFilter, setSectorFilter] = useState('all');
  const [recFilter, setRecFilter] = useState('all');
  const [showAddCompanyModal, setShowAddCompanyModal] = useState(false);
  const [companyToEdit, setCompanyToEdit] = useState<Company | null>(null);
  const [companyToDelete, setCompanyToDelete] = useState<Company | null>(null);

  // New company form state
  const [newTicker, setNewTicker] = useState('');
  const [newName, setNewName] = useState('');
  const [newExchange, setNewExchange] = useState('NSE / BSE');
  const [newSector, setNewSector] = useState('Financial Markets & Exchanges');
  const [newIndustry, setNewIndustry] = useState('Market Infrastructure');
  const [newPrice, setNewPrice] = useState('1200');
  const [newMarketCap, setNewMarketCap] = useState('15000');
  const [newCurrency, setNewCurrency] = useState('INR');
  const [newDescription, setNewDescription] = useState('');

  // Filtering
  const filteredCompanies = companies.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.ticker.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.sector.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector = sectorFilter === 'all' || c.sector === sectorFilter;
    const rec = c.latestAnalysis?.investmentThesis?.recommendation || 'PENDING';
    const matchesRec = recFilter === 'all' || 
      (recFilter === 'BUY' && rec.includes('BUY')) || 
      (recFilter === 'HOLD' && rec === 'HOLD') || 
      (recFilter === 'SELL' && (rec.includes('SELL') || rec === 'REDUCE'));
    
    return matchesSearch && matchesSector && matchesRec;
  });

  const sectors = Array.from(new Set(companies.map(c => c.sector)));

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

    setShowAddCompanyModal(false);
    setViewMode('workspace');
  };

  const getRecBadge = (rec?: string) => {
    if (!rec) return 'bg-slate-100 text-slate-600 border-slate-200';
    if (rec.includes('BUY')) return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    if (rec === 'HOLD') return 'bg-amber-100 text-amber-800 border-amber-300';
    return 'bg-rose-100 text-rose-800 border-rose-300';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

      {/* Hero Strip / Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 text-white p-6 rounded-3xl shadow-xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-widest text-blue-400 bg-blue-500/20 px-2.5 py-0.5 rounded-md border border-blue-400/30">
              Institutional Coverage Universe
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">Equity Research Coverage Dashboard</h1>
          <p className="text-xs text-slate-400 mt-1">Multi-asset cross-document research hub with synchronized financial models and automated thesis generation</p>
        </div>

        <div className="flex items-center gap-3">
          {currentUser.role === 'admin' && (
            <button
              onClick={() => setShowAddCompanyModal(true)}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-md shadow-blue-600/30 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Initiate New Coverage</span>
            </button>
          )}
        </div>
      </div>

      {/* Coverage KPI Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Coverage Universe</div>
          <div className="text-3xl font-black text-slate-900 mt-1">{companies.length} <span className="text-sm font-medium text-slate-500">Companies</span></div>
          <div className="text-xs text-slate-500 mt-1">Active institutional models</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Buy / Strong Buy Ratings</div>
          <div className="text-3xl font-black text-emerald-600 mt-1">
            {companies.filter(c => c.latestAnalysis?.investmentThesis?.recommendation.includes('BUY')).length}
          </div>
          <div className="text-xs text-emerald-700 mt-1">Highest conviction ideas</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Indexed Documents</div>
          <div className="text-3xl font-black text-blue-600 mt-1">
            {companies.reduce((sum, c) => sum + c.documents.length, 0)}
          </div>
          <div className="text-xs text-slate-500 mt-1">Transcripts, 10-K, decks & releases</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Sentiment Records</div>
          <div className="text-3xl font-black text-indigo-600 mt-1">
            {companies.reduce((sum, c) => sum + (c.sentimentHistory?.length || 0), 0)}
          </div>
          <div className="text-xs text-slate-500 mt-1">NLP-scored market events</div>
        </div>
      </div>

      {/* Filter & Search Toolbar (shown when companies exist) */}
      {companies.length > 0 && (
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by company name, ticker or sector..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={sectorFilter}
              onChange={(e) => setSectorFilter(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="all">All Sectors</option>
              {sectors.map(s => <option key={s} value={s}>{s}</option>)}
            </select>

            <select
              value={recFilter}
              onChange={(e) => setRecFilter(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="all">All Ratings</option>
              <option value="BUY">Buy / Strong Buy</option>
              <option value="HOLD">Hold</option>
              <option value="SELL">Sell / Reduce</option>
            </select>
          </div>
        </div>
      )}

      {/* Company Grid or Empty State */}
      {companies.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center shadow-xs">
          <div className="w-14 h-14 bg-slate-100 text-slate-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-200/60">
            <Building2 className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 font-heading">Coverage Universe is Empty</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1.5 mb-6 leading-relaxed">
            No coverage companies have been initiated yet. Add a new company to begin multi-document financial modeling, con-call synthesis, and turnaround tracking.
          </p>
          <button
            onClick={() => setShowAddCompanyModal(true)}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Initiate First Company</span>
          </button>
        </div>
      ) : filteredCompanies.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center shadow-xs">
          <p className="text-xs text-slate-500">No companies match the selected search or sector filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map(company => {
            const thesis = company.latestAnalysis?.investmentThesis;
            const rec = thesis?.recommendation || 'HOLD';
            const recColor = getRecBadge(rec);

            // Calculate average sentiment
            const avgSent = company.sentimentHistory && company.sentimentHistory.length > 0 
              ? (company.sentimentHistory.reduce((acc, curr) => acc + curr.sentimentScore, 0) / company.sentimentHistory.length).toFixed(2)
              : '+0.45';

            return (
              <div 
                key={company.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
              >
                <div className="p-6">
                  
                  {/* Header with Ticker and Rec Badge */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-sm tracking-wider shadow-sm">
                        {company.logoText || company.ticker.slice(0, 3)}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-base leading-tight group-hover:text-blue-600 transition-colors">
                          {company.name}
                        </h3>
                        <div className="text-xs text-slate-400 font-mono">
                          {company.ticker} • {company.exchange}
                        </div>
                      </div>
                    </div>

                    <span className={`px-2.5 py-1 rounded-lg text-xs font-extrabold uppercase border ${recColor}`}>
                      {rec}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                    {company.description}
                  </p>

                  {/* Price & Target Row */}
                  <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100 mb-4 text-xs">
                    <div>
                      <span className="text-slate-400 block font-medium">CMP</span>
                      <span className="font-bold text-slate-900 text-sm">{company.currency} {company.currentPrice.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">Target Price</span>
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-blue-600 text-sm">
                          {thesis?.targetPrice ? `${company.currency} ${thesis.targetPrice}` : 'N/A'}
                        </span>
                        {thesis?.impliedUpsidePct && (
                          <span className="text-[10px] font-bold text-emerald-600">
                            (+{thesis.impliedUpsidePct}%)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Badges strip */}
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                    <div className="flex items-center gap-1 font-semibold text-slate-700">
                      <FolderOpen className="w-3.5 h-3.5 text-blue-500" />
                      <span>{company.documents.length} Docs Indexed</span>
                    </div>
                    <div className="flex items-center gap-1 font-semibold text-slate-700">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Sentiment: <strong className={Number(avgSent) >= 0 ? 'text-emerald-700' : 'text-rose-700'}>{Number(avgSent) >= 0 ? `+${avgSent}` : avgSent}</strong></span>
                    </div>
                  </div>

                </div>

                {/* Bottom Actions Bar */}
                <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setComparisonCompanyIds([company.id, companies.find(c => c.id !== company.id)?.id || company.id]);
                        setViewMode('compare');
                      }}
                      className="text-xs font-semibold text-slate-600 hover:text-blue-600 hover:underline cursor-pointer"
                    >
                      Compare
                    </button>

                    {currentUser.role === 'admin' && (
                      <>
                        <button
                          onClick={() => setCompanyToEdit(company)}
                          className="text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors p-1.5 rounded-lg hover:bg-slate-200/60 cursor-pointer"
                          title="Edit company profile & financials"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => setCompanyToDelete(company)}
                          className="text-xs font-semibold text-slate-400 hover:text-rose-600 transition-colors p-1.5 rounded-lg hover:bg-rose-50 cursor-pointer"
                          title="Remove from coverage"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setActiveCompanyId(company.id);
                      setViewMode('workspace');
                    }}
                    className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-blue-600 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors shadow-xs cursor-pointer"
                  >
                    <span>Open Workspace</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Company Modal */}
      {showAddCompanyModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-base">Initiate New Company Coverage</h3>
              </div>
              <button 
                onClick={() => setShowAddCompanyModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCompany} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Company Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BSE Limited"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Ticker / Symbol</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BSE"
                    value={newTicker}
                    onChange={(e) => setNewTicker(e.target.value)}
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
                  onClick={() => setShowAddCompanyModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
                >
                  Initiate Coverage
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Company Modal */}
      {companyToEdit && (
        <EditCompanyModal
          isOpen={!!companyToEdit}
          onClose={() => setCompanyToEdit(null)}
          company={companyToEdit}
        />
      )}

      {/* Custom Confirmation Modal for Safe Deletion */}
      {companyToDelete && (
        <ConfirmDeleteModal
          isOpen={!!companyToDelete}
          onClose={() => setCompanyToDelete(null)}
          onConfirm={() => {
            deleteCompany(companyToDelete.id);
            setCompanyToDelete(null);
          }}
          companyName={companyToDelete.name}
          ticker={companyToDelete.ticker}
        />
      )}

    </div>
  );
};
