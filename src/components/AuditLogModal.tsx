import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Clock, ShieldCheck, Search, Filter, Download } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const AuditLogModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { auditLogs } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredLogs = auditLogs.filter(log => 
    log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (log.companyName && log.companyName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'analysis_run': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'document_upload': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'mapping_update': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'news_ingested': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'thesis_edited': return 'bg-sky-100 text-sky-800 border-sky-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full p-6 border border-slate-200 shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Institutional Compliance & Audit Trail</h3>
              <p className="text-xs text-slate-500">Immutable chronological log of all ingestion, synthesis, and prompt updates</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 font-bold text-lg"
          >
            ✕
          </button>
        </div>

        {/* Search */}
        <div className="flex-shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search audit trail by user, action, company or details..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Logs Table */}
        <div className="overflow-y-auto flex-1 border border-slate-200 rounded-2xl">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 text-slate-700 uppercase font-semibold border-b border-slate-200 sticky top-0">
              <tr>
                <th className="py-2.5 px-4">Timestamp</th>
                <th className="py-2.5 px-4">User & Role</th>
                <th className="py-2.5 px-4">Action</th>
                <th className="py-2.5 px-4">Target Company</th>
                <th className="py-2.5 px-4">Activity Summary</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-4 font-mono text-slate-500 whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="py-2.5 px-4">
                    <div className="font-bold text-slate-900">{log.userName}</div>
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">{log.userRole}</div>
                  </td>
                  <td className="py-2.5 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border ${getActionBadge(log.action)}`}>
                      {log.action.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 font-semibold text-slate-800">
                    {log.companyName || '-'}
                  </td>
                  <td className="py-2.5 px-4 text-slate-600 leading-relaxed max-w-sm">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 flex-shrink-0 text-xs text-slate-500">
          <span>Tracking {filteredLogs.length} activity records</span>
          <button
            onClick={onClose}
            className="bg-slate-900 text-white px-4 py-1.5 rounded-xl text-xs font-bold"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
