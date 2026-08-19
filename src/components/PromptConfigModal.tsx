import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SlidersHorizontal, Sparkles, Check, RotateCcw } from 'lucide-react';
import { INITIAL_PROMPT_CONFIG } from '../data/mockData';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const PromptConfigModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { promptConfig, setPromptConfig, logAction } = useApp();

  const [modeAPrompt, setModeAPrompt] = useState(promptConfig.modeAPrompt || INITIAL_PROMPT_CONFIG.modeAPrompt || '');
  const [thesisSystemPrompt, setThesisSystemPrompt] = useState(promptConfig.thesisSystemPrompt || INITIAL_PROMPT_CONFIG.thesisSystemPrompt || '');
  const [detailedAnalysisPrompt, setDetailedAnalysisPrompt] = useState(promptConfig.detailedAnalysisPrompt || INITIAL_PROMPT_CONFIG.detailedAnalysisPrompt || '');
  const [discrepancyCheckPrompt, setDiscrepancyCheckPrompt] = useState(promptConfig.discrepancyCheckPrompt || INITIAL_PROMPT_CONFIG.discrepancyCheckPrompt || '');
  const [temperature, setTemperature] = useState(promptConfig.temperature ?? 0.2);
  const [maxCitationDepth, setMaxCitationDepth] = useState(promptConfig.maxCitationDepth ?? 5);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    const newConfig = {
      ...promptConfig,
      modeAPrompt,
      thesisSystemPrompt,
      detailedAnalysisPrompt,
      discrepancyCheckPrompt,
      temperature,
      maxCitationDepth
    };
    setPromptConfig(newConfig);
    logAction('prompt_config_update', `Updated institutional synthesis prompts and temperature (${temperature}).`);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  const handleResetDefaults = () => {
    setModeAPrompt(INITIAL_PROMPT_CONFIG.modeAPrompt || '');
    setThesisSystemPrompt(INITIAL_PROMPT_CONFIG.thesisSystemPrompt || '');
    setDetailedAnalysisPrompt(INITIAL_PROMPT_CONFIG.detailedAnalysisPrompt || '');
    setDiscrepancyCheckPrompt(INITIAL_PROMPT_CONFIG.discrepancyCheckPrompt || '');
    setTemperature(INITIAL_PROMPT_CONFIG.temperature ?? 0.2);
    setMaxCitationDepth(INITIAL_PROMPT_CONFIG.maxCitationDepth ?? 5);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 border border-slate-200 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Pipeline Prompt & Model Configuration</h3>
              <p className="text-xs text-slate-500">Admin-level instructions and parameters governing Gemini analysis generation</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 font-bold"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Generation Temperature ({temperature})
            </label>
            <input
              type="range"
              min="0.0"
              max="1.0"
              step="0.05"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="w-full cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
              <span>0.0 (Deterministic / Strict Facts)</span>
              <span>1.0 (Creative)</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Max Inline Citation Depth
            </label>
            <input
              type="number"
              min="1"
              max="20"
              value={maxCitationDepth}
              onChange={(e) => setMaxCitationDepth(parseInt(e.target.value) || 5)}
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-800"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700">
                Mode A: Quick Memo Instructions (Turnaround Triggers, Risk Generator & Fund Bucket)
              </label>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Mode A Quick Memo
              </span>
            </div>
            <textarea
              rows={4}
              value={modeAPrompt}
              onChange={(e) => setModeAPrompt(e.target.value)}
              placeholder="Instructions for generating Turnaround points, Key Problems / Risks, Fund Bucket (Growth vs Wealth Mantra), and AI Suggested Rating..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <p className="text-[10px] text-slate-400 mt-0.5">Governs extraction of the 2-column turnaround triggers, problems/risks, and mantra rating.</p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700">
                Mode B: Investment Thesis Synthesis System Prompt
              </label>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                Mode B Deep Dive
              </span>
            </div>
            <textarea
              rows={4}
              value={thesisSystemPrompt}
              onChange={(e) => setThesisSystemPrompt(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Detailed Analysis Directive (Guidance vs Actuals & Tone)
            </label>
            <textarea
              rows={3}
              value={detailedAnalysisPrompt}
              onChange={(e) => setDetailedAnalysisPrompt(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Discrepancy Check & Multi-Source Audit Rules
            </label>
            <textarea
              rows={3}
              value={discrepancyCheckPrompt}
              onChange={(e) => setDiscrepancyCheckPrompt(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Defaults</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-sm transition-all"
            >
              {savedSuccess ? <Check className="w-4 h-4" /> : <Sparkles className="w-3.5 h-3.5" />}
              <span>{savedSuccess ? 'Config Saved!' : 'Save Pipeline Config'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
