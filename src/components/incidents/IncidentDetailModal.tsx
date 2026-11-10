import React, { useState } from 'react';
import { useCampusPulseStore } from '../../store/useCampusPulseStore';
import { IncidentStatus } from '../../types';
import { X, Clock, CheckCircle2, ShieldAlert, ArrowRight, Send, MessageSquare } from 'lucide-react';

export const IncidentDetailModal: React.FC = () => {
  const { incidents, selectedIncidentId, setSelectedIncidentId, updateIncidentStatus, addTimelineEntry } = useCampusPulseStore();

  const [newComment, setNewComment] = useState('');
  const [rootCauseText, setRootCauseText] = useState('');
  const [showResolveForm, setShowResolveForm] = useState(false);

  if (!selectedIncidentId) return null;
  const inc = incidents.find((i) => i.id === selectedIncidentId);
  if (!inc) return null;

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    addTimelineEntry(inc.id, newComment, 'SRE Operator');
    setNewComment('');
  };

  const handleResolve = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rootCauseText.trim()) return;
    updateIncidentStatus(inc.id, 'resolved', rootCauseText);
    setShowResolveForm(false);
  };

  const stages: IncidentStatus[] = ['investigating', 'identified', 'mitigating', 'resolved'];
  const currentStageIdx = stages.indexOf(inc.status);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#10172A] border border-slate-700 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative my-8 text-left">
        {/* Close Button */}
        <button
          onClick={() => setSelectedIncidentId(null)}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="pb-4 mb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2 mb-1">
            <span className="font-mono text-xs font-bold text-cyan-400">{inc.id}</span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-mono border uppercase font-bold ${
                inc.severity === 'P1_CRITICAL'
                  ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                  : inc.severity === 'P2_MAJOR'
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                  : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}
            >
              {inc.severity.replace('_', ' ')}
            </span>
          </div>
          <h3 className="font-bold text-white text-base">{inc.title}</h3>
          <p className="text-xs text-slate-400 mt-0.5">{inc.serviceName} • {inc.location}</p>
        </div>

        {/* Lifecycle Status Stepper */}
        <div className="mb-6 p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] font-mono uppercase text-slate-400 block mb-3">Incident SRE Lifecycle</span>
          <div className="grid grid-cols-4 gap-2">
            {stages.map((stage, idx) => {
              const isPast = idx < currentStageIdx;
              const isCurrent = idx === currentStageIdx;
              return (
                <button
                  key={stage}
                  onClick={() => {
                    if (stage === 'resolved') {
                      setShowResolveForm(true);
                    } else {
                      updateIncidentStatus(inc.id, stage);
                    }
                  }}
                  className={`py-2 px-1 rounded-lg text-[11px] font-mono uppercase font-semibold text-center border transition-all ${
                    isCurrent
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500 shadow-md shadow-cyan-950/40'
                      : isPast
                      ? 'bg-emerald-950/30 text-emerald-400 border-emerald-500/40'
                      : 'bg-slate-950 text-slate-500 border-slate-800 hover:text-slate-300'
                  }`}
                >
                  {stage}
                </button>
              );
            })}
          </div>
        </div>

        {/* Incident Details Summary */}
        <div className="mb-6 space-y-2 text-xs">
          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Diagnostic Report</span>
            <p className="text-slate-200 leading-relaxed">{inc.description}</p>
          </div>

          {inc.rootCause && (
            <div className="p-3 bg-emerald-950/20 border border-emerald-500/40 rounded-xl">
              <span className="text-[10px] font-mono text-emerald-400 uppercase block mb-1">Root Cause & Resolution</span>
              <p className="text-slate-200 leading-relaxed">{inc.rootCause}</p>
              {inc.resolvedAt && (
                <span className="text-[10px] font-mono text-slate-400 mt-1 block">Resolved at {inc.resolvedAt}</span>
              )}
            </div>
          )}
        </div>

        {/* Resolution Prompt Form */}
        {showResolveForm && inc.status !== 'resolved' && (
          <form onSubmit={handleResolve} className="mb-6 p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-emerald-400">Document Root Cause & Mark Resolved</span>
              <button
                type="button"
                onClick={() => setShowResolveForm(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                Cancel
              </button>
            </div>
            <textarea
              value={rootCauseText}
              onChange={(e) => setRootCauseText(e.target.value)}
              placeholder="Explain how the incident was mitigated and root cause remediated..."
              rows={2}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              required
            />
            <button
              type="submit"
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold"
            >
              Confirm Resolution
            </button>
          </form>
        )}

        {/* Timeline Log */}
        <div className="space-y-3">
          <span className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Incident Investigation Timeline</span>
          </span>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {inc.timeline.map((entry, idx) => (
              <div key={idx} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
                  <span className="text-cyan-400 font-semibold">{entry.author}</span>
                  <span>{entry.time}</span>
                </div>
                <p className="text-slate-200">{entry.message}</p>
              </div>
            ))}
          </div>

          {/* Add Update Comment */}
          <form onSubmit={handleAddComment} className="flex gap-2 pt-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Post timeline update note..."
              className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-1"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Post</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
