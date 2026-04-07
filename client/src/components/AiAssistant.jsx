import React, { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { Sparkles, Send, Loader2, AlertCircle, Bot, CornerDownLeft, ClipboardCheck, Trash2 } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const AiAssistant = ({ patientHistory, currentVitals, onApplySuggestion, userToken }) => {
  const [symptoms, setSymptoms] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getAiSuggestion = async () => {
    if (!symptoms.trim()) return;
    
    setLoading(true);
    setError('');
    try {
      const { data } = await axios.post(`${API_URL}/ai/suggest`, {
        symptoms,
        history: patientHistory,
        vitals: currentVitals
      }, {
        headers: { Authorization: `Bearer ${userToken}` }
      });
      setSuggestion(data.suggestion);
    } catch (err) {
      setError('AI service is currently unavailable. Please check your Gemini API key.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl">
      <div className="p-8 border-b border-white/5 bg-white/5 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles className="text-white w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white leading-none">Saarthi AI</h3>
            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mt-1">Medical Co-pilot</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
        {!suggestion ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-4">
             <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                <Bot className="text-white/20 w-10 h-10" />
             </div>
             <p className="text-white/60 font-medium text-sm leading-relaxed">
               I'm here to help you analyze symptoms and draft prescriptions faster.
               Enter the patient's symptoms below to start.
             </p>
          </div>
        ) : (
          <div className="prose prose-invert prose-sm max-w-none">
             <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                <ReactMarkdown>{suggestion}</ReactMarkdown>
             </div>
             
             <div className="flex gap-4 mt-6">
               <button 
                onClick={() => onApplySuggestion(suggestion)}
                className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20"
               >
                 <ClipboardCheck size={16} />
                 Apply Draft
               </button>
               <button 
                onClick={() => setSuggestion('')}
                className="p-3 bg-white/5 text-white/40 rounded-xl hover:text-red-400 transition-colors"
                title="Clear"
               >
                 <Trash2 size={16} />
               </button>
             </div>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-xs font-bold flex items-center gap-3">
             <AlertCircle size={16} />
             {error}
          </div>
        )}
      </div>

      <div className="p-6 bg-white/5 border-t border-white/5">
        <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-3 ml-2">Current Symptoms</label>
        <div className="relative">
          <textarea 
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                getAiSuggestion();
              }
            }}
            placeholder="Describe symptoms..."
            className="w-full bg-white/5 border border-white/10 rounded-3xl p-5 pr-14 text-white font-bold placeholder:text-white/20 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none h-28"
          />
          <button 
            onClick={getAiSuggestion}
            disabled={loading || !symptoms.trim()}
            className="absolute bottom-4 right-4 w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <CornerDownLeft size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiAssistant;
