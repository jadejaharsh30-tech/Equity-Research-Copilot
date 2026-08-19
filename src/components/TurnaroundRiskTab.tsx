import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { FundBucket, AssessmentRating, TurnaroundRiskTableData } from '../types';
import html2canvas from 'html2canvas';
import { 
  Sparkles, 
  UploadCloud, 
  Download, 
  RefreshCw, 
  FileText, 
  AlertCircle, 
  X, 
  Check, 
  Layers, 
  FileCheck2,
  Share2,
  Table as TableIcon
} from 'lucide-react';

interface UploadedFileInfo {
  name: string;
  size: number;
  type: string;
  base64: string;
}

export const TurnaroundRiskTab: React.FC = () => {
  const { activeCompany, updateTurnaroundRiskTable, currentUser } = useApp();

  // Form states
  const [companyName, setCompanyName] = useState<string>(activeCompany?.name || '');
  const [sector, setSector] = useState<string>(activeCompany?.sector || '');
  const [fundBucket, setFundBucket] = useState<FundBucket>('Growth Mantra');
  const [turnaroundCount, setTurnaroundCount] = useState<number>(4);
  const [riskCount, setRiskCount] = useState<number>(2);

  // Files state
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFileInfo[]>([]);
  const [useExistingDocs, setUseExistingDocs] = useState<boolean>(true);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generation state
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Table state (loaded from activeCompany or newly generated)
  const [tableData, setTableData] = useState<TurnaroundRiskTableData | null>(
    activeCompany?.turnaroundRiskTable || null
  );

  // Rating selection state ('AI Suggested' | 'Good' | 'Neutral' | 'Poor')
  const [selectedRatingChoice, setSelectedRatingChoice] = useState<'AI Suggested' | AssessmentRating>(
    (activeCompany?.turnaroundRiskTable?.selectedRating as any) || 'AI Suggested'
  );

  const tableRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  // Sync with active company when switching companies
  useEffect(() => {
    if (activeCompany) {
      setCompanyName(activeCompany.name);
      setSector(activeCompany.sector || '');
      if (activeCompany.turnaroundRiskTable) {
        setTableData(activeCompany.turnaroundRiskTable);
        setFundBucket(activeCompany.turnaroundRiskTable.fundBucket);
        setSelectedRatingChoice(
          (activeCompany.turnaroundRiskTable.selectedRating as any) || 'AI Suggested'
        );
      }
    }
  }, [activeCompany?.id]);

  // Handle file uploads (drag-drop and file input)
  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    Array.from(files).forEach(file => {
      // Validate file types: PDF, JPG, PNG, WEBP
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type) && !file.name.endsWith('.pdf')) {
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        setUploadedFiles(prev => {
          // Avoid duplicate files by name
          if (prev.some(f => f.name === file.name)) return prev;
          return [...prev, {
            name: file.name,
            size: file.size,
            type: file.type || 'application/pdf',
            base64
          }];
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (fileName: string) => {
    setUploadedFiles(prev => prev.filter(f => f.name !== fileName));
  };

  const totalBytes = uploadedFiles.reduce((sum, f) => sum + f.size, 0);
  const totalMb = totalBytes / (1024 * 1024);
  const isLarge = totalMb > 20;

  // Generate Table via Gemini API
  const handleGenerate = async () => {
    if (!companyName.trim()) {
      setErrorMsg('Please enter a company name.');
      return;
    }

    const availableDocsCount = activeCompany?.documents?.length || 0;
    if (uploadedFiles.length === 0 && (!useExistingDocs || availableDocsCount === 0)) {
      setErrorMsg('Please upload at least one document or image (PDF, JPG, PNG, WEBP) or enable indexed company files.');
      return;
    }

    setIsGenerating(true);
    setErrorMsg(null);

    try {
      // Gather text from existing indexed docs if enabled
      let existingDocsText = '';
      if (useExistingDocs && activeCompany?.documents) {
        existingDocsText = activeCompany.documents.map(d => 
          `DOCUMENT: ${d.title} (${d.fileType}, ${d.period})\nSUMMARY: ${d.summary}\nHIGHLIGHTS:\n- ${d.keyHighlights.join('\n- ')}\n${d.rawText ? `EXCERPTS: ${d.rawText.slice(0, 15000)}` : ''}`
        ).join('\n\n---\n\n');
      }

      const response = await fetch('/api/turnaround-risk/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: companyName.trim(),
          sector: sector.trim() || undefined,
          fundBucket,
          turnaroundCount,
          riskCount,
          files: uploadedFiles.map(f => ({
            name: f.name,
            mimeType: f.type,
            base64: f.base64
          })),
          documentsText: existingDocsText
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Couldn't generate the table — try again or reduce the number of documents");
      }

      const result = await response.json();
      
      const newTableData: TurnaroundRiskTableData = {
        companyName: companyName.trim(),
        sector: sector.trim() || activeCompany?.sector,
        fundBucket,
        aiSuggestedRating: result.aiSuggestedRating || 'Good',
        selectedRating: 'AI Suggested',
        turnarounds: result.turnarounds || [],
        risks: result.risks || [],
        generatedAt: new Date().toISOString().split('T')[0]
      };

      setTableData(newTableData);
      setSelectedRatingChoice('AI Suggested');

      if (activeCompany) {
        updateTurnaroundRiskTable(activeCompany.id, newTableData);
      }
    } catch (err: any) {
      console.error('Turnaround/Risk generation failed:', err);
      setErrorMsg(err.message || "Couldn't generate the table — try again or reduce the number of documents");
    } finally {
      setIsGenerating(false);
    }
  };

  // Live rating calculation for display
  const activeRatingValue: AssessmentRating = 
    selectedRatingChoice === 'AI Suggested' 
      ? (tableData?.aiSuggestedRating || 'Good')
      : selectedRatingChoice;

  // Handle rating switch
  const handleRatingChange = (choice: 'AI Suggested' | AssessmentRating) => {
    setSelectedRatingChoice(choice);
    if (tableData && activeCompany) {
      const updated: TurnaroundRiskTableData = {
        ...tableData,
        selectedRating: choice
      };
      setTableData(updated);
      updateTurnaroundRiskTable(activeCompany.id, updated);
    }
  };

  // Download table as high-resolution PNG
  const handleDownloadPng = async () => {
    if (!tableRef.current) return;
    setIsDownloading(true);

    try {
      const canvas = await html2canvas(tableRef.current, {
        scale: 2,
        backgroundColor: '#FFFFFF',
        useCORS: true,
        logging: false
      });

      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      const sanitizedName = (companyName || 'company')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '_')
        .replace(/_+/g, '_');
      link.download = `${sanitizedName}_turnaround_risk.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to download PNG:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  // Format file size
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6">

      {/* Generator Control Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
        
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-blue-50 text-blue-700 rounded-lg">
                <TableIcon className="w-4 h-4" />
              </span>
              <h2 className="text-base font-bold text-slate-900">
                Key Turnaround / Key Problem-Risk Generator
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Multimodal Gemini analysis producing structured institutional two-column summary tables.
            </p>
          </div>
          <span className="text-[11px] font-mono text-slate-400 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200 self-start sm:self-auto">
            Fixed-Format Export Engine
          </span>
        </div>

        {/* Input Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
          
          {/* Company Name */}
          <div className="md:col-span-4">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Company Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={companyName}
              onChange={e => setCompanyName(e.target.value)}
              placeholder="e.g. Shyam Metalics and Energy Ltd."
              className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden font-medium text-slate-900"
            />
          </div>

          {/* Sector (Optional) */}
          <div className="md:col-span-3">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Sector <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={sector}
              onChange={e => setSector(e.target.value)}
              placeholder="e.g. Metals & Mining (or infer)"
              className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden font-medium text-slate-900"
            />
          </div>

          {/* Fund / Bucket Label: Custom Radio Pills */}
          <div className="md:col-span-5">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Fund / Bucket Label
            </label>
            <div className="flex items-center gap-2">
              
              {/* Wealth Mantra Pill */}
              <button
                type="button"
                onClick={() => setFundBucket('Wealth Mantra')}
                style={{ backgroundColor: 'rgb(192, 0, 0)' }}
                className={`flex-1 text-white text-xs font-bold py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs ${
                  fundBucket === 'Wealth Mantra'
                    ? 'ring-2 ring-offset-2 ring-slate-900 opacity-100 font-extrabold'
                    : 'opacity-55 hover:opacity-85'
                }`}
              >
                {fundBucket === 'Wealth Mantra' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                <span>Wealth Mantra</span>
              </button>

              {/* Growth Mantra Pill */}
              <button
                type="button"
                onClick={() => setFundBucket('Growth Mantra')}
                style={{ backgroundColor: 'rgb(0, 128, 128)' }}
                className={`flex-1 text-white text-xs font-bold py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs ${
                  fundBucket === 'Growth Mantra'
                    ? 'ring-2 ring-offset-2 ring-slate-900 opacity-100 font-extrabold'
                    : 'opacity-55 hover:opacity-85'
                }`}
              >
                {fundBucket === 'Growth Mantra' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                <span>Growth Mantra</span>
              </button>

            </div>
          </div>

        </div>

        {/* Counts Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-800">Key Turnaround Themes</span>
              <span className="text-[11px] text-slate-500 block">Number of points to generate (max 8)</span>
            </div>
            <input
              type="number"
              min={1}
              max={8}
              value={turnaroundCount}
              onChange={e => {
                const val = parseInt(e.target.value) || 1;
                setTurnaroundCount(Math.min(8, Math.max(1, val)));
              }}
              onBlur={() => setTurnaroundCount(prev => Math.min(8, Math.max(1, prev)))}
              className="w-16 text-center text-xs font-bold py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-800">Key Problem / Key Risk Points</span>
              <span className="text-[11px] text-slate-500 block">Number of points to generate (max 5)</span>
            </div>
            <input
              type="number"
              min={1}
              max={5}
              value={riskCount}
              onChange={e => {
                const val = parseInt(e.target.value) || 1;
                setRiskCount(Math.min(5, Math.max(1, val)));
              }}
              onBlur={() => setRiskCount(prev => Math.min(5, Math.max(1, prev)))}
              className="w-16 text-center text-xs font-bold py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500"
            />
          </div>

        </div>

        {/* Source File Upload & Drag-and-Drop Area */}
        <div className="space-y-3 mb-4">
          
          <div
            onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={e => {
              e.preventDefault();
              setIsDragging(false);
              handleFiles(e.dataTransfer.files);
            }}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
              isDragging 
                ? 'border-blue-500 bg-blue-50/50' 
                : 'border-slate-300 hover:border-slate-400 bg-slate-50/50'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={e => handleFiles(e.target.files)}
              multiple
              accept=".pdf,application/pdf,image/jpeg,image/png,image/webp"
              className="hidden"
            />
            <div className="w-9 h-9 bg-white border border-slate-200 rounded-xl flex items-center justify-center mx-auto text-blue-600 mb-2 shadow-xs">
              <UploadCloud className="w-5 h-5" />
            </div>
            <p className="text-xs font-semibold text-slate-800">
              Drag and drop source documents or screenshots here, or <span className="text-blue-600 underline">browse</span>
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Supports broker reports, filings, transcripts, slides (PDF, JPG, PNG, WEBP)
            </p>
          </div>

          {/* Active Company Indexed Docs Quick Toggle */}
          {activeCompany?.documents && activeCompany.documents.length > 0 && (
            <div className="flex items-center justify-between bg-blue-50/70 border border-blue-200/80 rounded-xl px-3.5 py-2.5 text-xs">
              <div className="flex items-center gap-2 text-blue-900 font-medium">
                <FileCheck2 className="w-4 h-4 text-blue-600" />
                <span>Include {activeCompany.documents.length} workspace repository documents for {activeCompany.ticker}</span>
              </div>
              <label className="flex items-center gap-2 cursor-pointer font-semibold text-blue-700">
                <input
                  type="checkbox"
                  checked={useExistingDocs}
                  onChange={e => setUseExistingDocs(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span>Include in analysis</span>
              </label>
            </div>
          )}

          {/* Attached Files List */}
          {uploadedFiles.length > 0 && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
                <span>Attached Files ({uploadedFiles.length})</span>
                <span className={`font-mono ${isLarge ? 'text-amber-600 font-bold' : ''}`}>
                  Total: {totalMb.toFixed(1)} MB
                </span>
              </div>

              {isLarge && (
                <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg p-2 text-[11px]">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Total file size exceeds 20MB. Document generation may take longer.</span>
                </div>
              )}

              <div className="max-h-36 overflow-y-auto space-y-1 pr-1">
                {uploadedFiles.map(f => (
                  <div key={f.name} className="flex items-center justify-between bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs">
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-medium text-slate-800 truncate">{f.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">({formatSize(f.size)})</span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); removeFile(f.name); }}
                      className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                      title="Remove file"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl p-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Action Button Bar */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-slate-500">
            {uploadedFiles.length} files attached {useExistingDocs && activeCompany?.documents?.length ? `+ ${activeCompany.documents.length} repository docs` : ''}
          </span>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold text-xs shadow-xs transition-all disabled:opacity-50 cursor-pointer"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Reading documents and generating…</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate Summary Table</span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* Rendered Table Section */}
      {tableData && (
        <div className="space-y-4">
          
          {/* Post-Analysis Rating Selector & Export Controls Bar */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Rating Selector Segmented Group */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2.5">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Display Rating:
              </span>
              <div className="inline-flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                
                {/* AI Suggested Option */}
                <button
                  type="button"
                  onClick={() => handleRatingChange('AI Suggested')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                    selectedRatingChoice === 'AI Suggested'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-700 hover:text-slate-900'
                  }`}
                >
                  <Sparkles className="w-3 h-3" />
                  <span>AI Suggested: {tableData.aiSuggestedRating}</span>
                </button>

                {/* Good */}
                <button
                  type="button"
                  onClick={() => handleRatingChange('Good')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    selectedRatingChoice === 'Good'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-700 hover:text-slate-900'
                  }`}
                >
                  Good
                </button>

                {/* Neutral */}
                <button
                  type="button"
                  onClick={() => handleRatingChange('Neutral')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    selectedRatingChoice === 'Neutral'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-slate-700 hover:text-slate-900'
                  }`}
                >
                  Neutral
                </button>

                {/* Poor */}
                <button
                  type="button"
                  onClick={() => handleRatingChange('Poor')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    selectedRatingChoice === 'Poor'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'text-slate-700 hover:text-slate-900'
                  }`}
                >
                  Poor
                </button>

              </div>
            </div>

            {/* Export & Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-colors cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Regenerate</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadPng}
                disabled={isDownloading}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition-all cursor-pointer disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isDownloading ? 'Exporting...' : 'Download as PNG'}</span>
              </button>
            </div>

          </div>

          {/* Institutional Table Container */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 md:p-6 shadow-xs overflow-x-auto">
            <div ref={tableRef} className="bg-white p-2 min-w-[700px]">
              
              <table 
                className="w-full border-collapse rounded-xl overflow-hidden shadow-xs" 
                style={{ 
                  fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  border: '1px solid #E2E8F0'
                }}
              >
                <tbody>
                  
                  {/* Row 1: Company Name (Merged across both columns) */}
                  <tr>
                    <td 
                      colSpan={2}
                      style={{
                        backgroundColor: '#185FA5',
                        color: '#FFFFFF',
                        fontWeight: 700,
                        fontSize: '17px',
                        textAlign: 'center',
                        padding: '14px 16px',
                        borderBottom: '1px solid #144E88',
                        letterSpacing: '0.01em'
                      }}
                    >
                      {tableData.companyName}
                    </td>
                  </tr>

                  {/* Row 2: Metadata Banner with Dynamic Rating & Fund Label */}
                  <tr>
                    <td 
                      colSpan={2}
                      style={{
                        backgroundColor: '#F8FAFC',
                        color: '#334155',
                        fontSize: '13px',
                        textAlign: 'center',
                        padding: '9px 16px',
                        borderBottom: '1px solid #E2E8F0'
                      }}
                    >
                      <div className="inline-flex items-center justify-center gap-3 flex-wrap font-medium">
                        
                        {/* Rating Display */}
                        <span>
                          <strong className="font-bold text-slate-800">Rating:</strong>{' '}
                          <span className={`font-bold ${
                            activeRatingValue === 'Good' ? 'text-emerald-700' :
                            activeRatingValue === 'Neutral' ? 'text-amber-700' : 'text-rose-700'
                          }`}>
                            {activeRatingValue}
                          </span>
                        </span>

                        <span className="text-slate-300">|</span>

                        {/* Fund Badge Pill */}
                        <span 
                          style={{
                            backgroundColor: tableData.fundBucket === 'Wealth Mantra' ? 'rgb(192, 0, 0)' : 'rgb(0, 128, 128)',
                            color: '#FFFFFF',
                            padding: '2px 8px',
                            borderRadius: '12px',
                            fontSize: '11px',
                            fontWeight: 700
                          }}
                        >
                          {tableData.fundBucket}
                        </span>

                        {/* Sector (if available) */}
                        {tableData.sector && (
                          <>
                            <span className="text-slate-300">|</span>
                            <span>
                              <strong className="font-bold text-slate-800">Sector:</strong> {tableData.sector}
                            </span>
                          </>
                        )}

                      </div>
                    </td>
                  </tr>

                  {/* Row 3: Two Column Headers */}
                  <tr>
                    
                    {/* Left Column Header */}
                    <th 
                      style={{
                        backgroundColor: '#F1F5F9',
                        color: '#1E3A8A',
                        fontWeight: 700,
                        fontSize: '13px',
                        textAlign: 'left',
                        padding: '11px 16px',
                        borderRight: '1px solid #E2E8F0',
                        borderBottom: '1px solid #E2E8F0',
                        width: '50%',
                        letterSpacing: '0.02em',
                        textTransform: 'uppercase'
                      }}
                    >
                      Key Turnaround
                    </th>

                    {/* Right Column Header */}
                    <th 
                      style={{
                        backgroundColor: '#F1F5F9',
                        color: '#991B1B',
                        fontWeight: 700,
                        fontSize: '13px',
                        textAlign: 'left',
                        padding: '11px 16px',
                        borderBottom: '1px solid #E2E8F0',
                        width: '50%',
                        letterSpacing: '0.02em',
                        textTransform: 'uppercase'
                      }}
                    >
                      Key Problem / Key Risk
                    </th>

                  </tr>

                  {/* Content Rows */}
                  {Array.from({ length: Math.max(tableData.turnarounds.length, tableData.risks.length) }).map((_, idx, arr) => {
                    const turnaround = tableData.turnarounds[idx];
                    const risk = tableData.risks[idx];
                    const isLast = idx === arr.length - 1;

                    return (
                      <tr key={idx}>
                        
                        {/* Turnaround Cell */}
                        <td
                          style={{
                            padding: '14px 16px',
                            verticalAlign: 'top',
                            backgroundColor: turnaround ? '#FFFFFF' : '#F8FAFC',
                            borderRight: '1px solid #E2E8F0',
                            borderBottom: isLast ? 'none' : '1px solid #F1F5F9',
                            width: '50%'
                          }}
                        >
                          {turnaround ? (
                            <div className="space-y-1">
                              <div 
                                style={{ 
                                  fontWeight: 700, 
                                  fontSize: '13px', 
                                  color: '#0F172A',
                                  lineHeight: 1.4 
                                }}
                              >
                                {turnaround.title}:
                              </div>
                              <div 
                                style={{ 
                                  fontSize: '12px', 
                                  color: '#475569', 
                                  lineHeight: 1.6 
                                }}
                              >
                                {turnaround.text}
                              </div>
                            </div>
                          ) : null}
                        </td>

                        {/* Risk Cell */}
                        <td
                          style={{
                            padding: '14px 16px',
                            verticalAlign: 'top',
                            backgroundColor: risk ? '#FFFFFF' : '#F8FAFC',
                            borderBottom: isLast ? 'none' : '1px solid #F1F5F9',
                            width: '50%'
                          }}
                        >
                          {risk ? (
                            <div className="space-y-1">
                              <div 
                                style={{ 
                                  fontWeight: 700, 
                                  fontSize: '13px', 
                                  color: '#B91C1C',
                                  lineHeight: 1.4 
                                }}
                              >
                                {risk.title}:
                              </div>
                              <div 
                                style={{ 
                                  fontSize: '12px', 
                                  color: '#475569', 
                                  lineHeight: 1.6 
                                }}
                              >
                                {risk.text}
                              </div>
                            </div>
                          ) : null}
                        </td>

                      </tr>
                    );
                  })}

                </tbody>
              </table>

            </div>
          </div>

        </div>
      )}

    </div>
  );
};
