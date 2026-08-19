import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  TrendingUp, 
  TrendingDown, 
  RefreshCw, 
  Plus, 
  Sparkles, 
  Download, 
  Search, 
  Filter, 
  Newspaper, 
  AlertCircle, 
  CheckCircle2, 
  Calendar,
  ExternalLink,
  Tag
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  ReferenceLine,
  Dot
} from 'recharts';

export const SentimentTab: React.FC = () => {
  const { 
    activeCompany, 
    fetchLatestNews, 
    scoreCustomArticle, 
    isFetchingNews, 
    currentUser, 
    handleExportSentimentCsv 
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterLabel, setFilterLabel] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form for custom article
  const [customHeadline, setCustomHeadline] = useState('');
  const [customContent, setCustomContent] = useState('');
  const [customSource, setCustomSource] = useState('Analyst Note / Wire');
  const [isScoringCustom, setIsScoringCustom] = useState(false);

  if (!activeCompany) return null;

  const sentimentHistory = activeCompany.sentimentHistory || [];

  // Filter sentiment records
  const filteredRecords = sentimentHistory.filter(r => {
    const matchesSearch = r.headline.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          r.keyTopic.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.source.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLabel = filterLabel === 'all' || r.sentimentLabel === filterLabel;
    return matchesSearch && matchesLabel;
  });

  // Calculate stats
  const averageScore = sentimentHistory.length > 0 
    ? sentimentHistory.reduce((acc, curr) => acc + curr.sentimentScore, 0) / sentimentHistory.length 
    : 0;

  const bullishCount = sentimentHistory.filter(r => r.sentimentScore > 0.2).length;
  const bearishCount = sentimentHistory.filter(r => r.sentimentScore < -0.2).length;
  const neutralCount = sentimentHistory.length - bullishCount - bearishCount;

  // Chart data sorted by date
  const chartData = [...sentimentHistory]
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    .map(item => ({
      date: item.timestamp.split('T')[0] || item.timestamp,
      score: item.sentimentScore,
      headline: item.headline,
      label: item.sentimentLabel,
      topic: item.keyTopic,
      isMajor: item.isMajorEvent
    }));

  const handleScoreArticle = async () => {
    if (!customHeadline || !customContent) {
      alert('Please enter a headline and text.');
      return;
    }

    setIsScoringCustom(true);
    try {
      await scoreCustomArticle(activeCompany.id, customHeadline, customContent, customSource);
      setCustomHeadline('');
      setCustomContent('');
      setShowAddModal(false);
    } finally {
      setIsScoringCustom(false);
    }
  };

  const getScoreBadge = (score: number, label: string) => {
    if (score >= 0.5) return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    if (score > 0.1) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (score <= -0.5) return 'bg-rose-100 text-rose-800 border-rose-300';
    if (score < -0.1) return 'bg-rose-50 text-rose-700 border-rose-200';
    return 'bg-slate-100 text-slate-700 border-slate-200';
  };

  return (
    <div className="space-y-6">

      {/* Top Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Newspaper className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Real-Time News & Sentiment Engine</h2>
              <p className="text-xs text-slate-500">Gemini-scored market developments, event markers, and institutional impact analysis</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportSentimentCsv}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Sentiment CSV</span>
          </button>

          {currentUser.role !== 'viewer' && (
            <>
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Score Custom Article</span>
              </button>

              <button
                onClick={() => fetchLatestNews(activeCompany.id)}
                disabled={isFetchingNews}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isFetchingNews ? 'animate-spin' : ''}`} />
                <span>{isFetchingNews ? 'Pulling Feeds...' : 'Refresh Live News'}</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* KPI Metrics Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Composite Sentiment Score</div>
          <div className={`text-2xl font-black mt-1 ${averageScore >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            {averageScore > 0 ? `+${averageScore.toFixed(2)}` : averageScore.toFixed(2)}
          </div>
          <div className="text-xs text-slate-500 mt-1">Scale from -1.00 (Max Bearish) to +1.00 (Max Bullish)</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Bullish Catalysts</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            {bullishCount} <span className="text-xs font-normal text-slate-500">articles</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">Positive earnings beats, volume & expansions</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Bearish / Headwinds</div>
          <div className="text-2xl font-black text-rose-600 mt-1">
            {bearishCount} <span className="text-xs font-normal text-slate-500">articles</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">Regulatory circulars, margins, or cost surges</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Major Events Tracked</div>
          <div className="text-2xl font-black text-blue-600 mt-1">
            {sentimentHistory.filter(s => s.isMajorEvent).length}
          </div>
          <div className="text-xs text-slate-500 mt-1">Flagged with high market impact</div>
        </div>
      </div>

      {/* Sentiment Trend Timeline Chart */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Sentiment Score Trajectory & Event Overlay</h3>
            <p className="text-xs text-slate-500">Automated NLP timeline mapping positive vs negative news velocity</p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Bullish (&gt;0)</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Bearish (&lt;0)</span>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
              <YAxis domain={[-1, 1]} stroke="#94a3b8" fontSize={11} />
              <ReferenceLine y={0} stroke="#cbd5e1" strokeWidth={1.5} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '12px', maxWidth: '320px' }}
                formatter={(val: any) => [`Score: ${val}`, 'Sentiment']}
                labelFormatter={(label, payload) => {
                  const p = payload?.[0]?.payload;
                  return p ? `${p.date} • ${p.headline}` : label;
                }}
              />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="#2563eb" 
                strokeWidth={2.5} 
                dot={{ r: 4, stroke: '#1d4ed8', strokeWidth: 2, fill: '#60a5fa' }} 
                activeDot={{ r: 6 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* News Feed Filter & Feed Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        
        {/* Search & Filter bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search headline, topic or source..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600">Filter Label:</span>
            <select
              value={filterLabel}
              onChange={(e) => setFilterLabel(e.target.value)}
              className="bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="all">All Sentiment Labels</option>
              <option value="Very Bullish">Very Bullish</option>
              <option value="Bullish">Bullish</option>
              <option value="Neutral">Neutral</option>
              <option value="Bearish">Bearish</option>
              <option value="Very Bearish">Very Bearish</option>
            </select>
          </div>
        </div>

        {/* Article Feed Cards */}
        <div className="divide-y divide-slate-100">
          {filteredRecords.map((item) => (
            <div key={item.id} className="p-5 hover:bg-slate-50/70 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded">
                      {item.source}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      {item.timestamp.replace('T', ' ').slice(0, 16)}
                    </span>
                    {item.isMajorEvent && (
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300">
                        Major Event: {item.eventTag || 'Catalyst'}
                      </span>
                    )}
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                      Topic: {item.keyTopic}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm leading-snug">
                    {item.headline}
                  </h4>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.summary}
                  </p>

                  <div className="text-xs text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-200/60 mt-2">
                    <strong className="text-slate-900">Gemini Rationale: </strong>
                    <span className="italic">{item.rationale}</span>
                  </div>
                </div>

                <div className="flex sm:flex-col items-end justify-between sm:justify-start gap-1 flex-shrink-0">
                  <div className={`px-3 py-1 rounded-xl text-xs font-extrabold border text-center ${getScoreBadge(item.sentimentScore, item.sentimentLabel)}`}>
                    <div className="text-sm font-black">{item.sentimentScore > 0 ? `+${item.sentimentScore.toFixed(2)}` : item.sentimentScore.toFixed(2)}</div>
                    <div className="text-[10px] uppercase font-bold">{item.sentimentLabel}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredRecords.length === 0 && (
            <div className="p-8 text-center text-xs text-slate-500">
              No news records match the current search filters. Click "Refresh Live News" to fetch latest feeds.
            </div>
          )}
        </div>
      </div>

      {/* Custom Article Score Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-base">Score Custom News / Analyst Note</h3>
              </div>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Headline</label>
              <input
                type="text"
                placeholder="e.g. SEBI issues revised guidelines for commodity derivative contracts"
                value={customHeadline}
                onChange={(e) => setCustomHeadline(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Source / Publication</label>
              <input
                type="text"
                placeholder="e.g. Bloomberg / ET Now / Internal Note"
                value={customSource}
                onChange={(e) => setCustomSource(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Article Content / Summary Text</label>
              <textarea
                rows={4}
                placeholder="Paste the excerpt or commentary text to evaluate score and institutional impact..."
                value={customContent}
                onChange={(e) => setCustomContent(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleScoreArticle}
                disabled={isScoringCustom || !customHeadline || !customContent}
                className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-sm transition-all disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isScoringCustom ? 'Evaluating Sentiment...' : 'Score with Gemini'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
