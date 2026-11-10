import React, { useEffect, useState } from 'react';
import { useCampusPulseStore } from '../../store/useCampusPulseStore';
import { IncidentStatus } from '../../types';
import { Sev } from '../term';

const STAGES: IncidentStatus[] = ['investigating', 'identified', 'mitigating', 'resolved'];

/** Ticket window docked to the right edge, like a second monitor. */
export const IncidentDetailModal: React.FC = () => {
  const { incidents, selectedIncidentId, setSelectedIncidentId, updateIncidentStatus, addTimelineEntry } = useCampusPulseStore();
  const [note, setNote] = useState('');
  const [cause, setCause] = useState('');
  const [resolving, setResolving] = useState(false);

  useEffect(() => {
    setResolving(false); setCause('');
    const k = (e: KeyboardEvent) => e.key === 'Escape' && setSelectedIncidentId(null);
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [selectedIncidentId, setSelectedIncidentId]);

  const inc = incidents.find((i) => i.id === selectedIncidentId);
  if (!inc) return null;
  const at = STAGES.indexOf(inc.status);

  return (
    <div className="fixed inset-0 z-40 flex justify-end" role="dialog" aria-modal="true" aria-label={`Ticket ${inc.id}`}>
      <button className="absolute inset-0 bg-black/60" onClick={() => setSelectedIncidentId(null)} aria-label="Close" />
      <aside className="relative w-full max-w-[560px] h-full overflow-y-auto bg-screen border-l border-amber">
        <div className="bar sticky top-0"><span>TICKET {inc.id}</span><button onClick={() => setSelectedIncidentId(null)} className="font-normal">ESC CLOSE</button></div>
        <div className="p-3 space-y-4">
          <div>
            <div className="flex items-center gap-2"><Sev s={inc.severity} /><span className="text-mute text-[11px] uppercase">{inc.category} · {inc.serviceName}</span></div>
            <h2 className="text-val text-[17px] font-semibold mt-1.5 leading-snug">{inc.title}</h2>
            <p className="text-mute text-[12px] mt-1">{inc.location} · opened {inc.reportedAt}</p>
          </div>

          <div>
            <div className="lbl mb-1">State · click to move</div>
            <div className="grid grid-cols-4 gap-px bg-grid border border-grid">
              {STAGES.map((s, i) => (
                <button key={s} onClick={() => (s === 'resolved' ? setResolving(true) : updateIncidentStatus(inc.id, s))} disabled={inc.status === 'resolved'}
                  className={`py-1.5 text-[10px] uppercase font-bold ${i === at ? 'bg-amber text-black' : i < at ? 'bg-[#1a1a1a] text-amberdim' : 'bg-pane text-mute hover:text-amber'} disabled:cursor-default`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {resolving && inc.status !== 'resolved' && (
            <form onSubmit={(e) => { e.preventDefault(); if (cause.trim()) { updateIncidentStatus(inc.id, 'resolved', cause.trim()); setResolving(false); } }} className="border border-up p-2 space-y-2">
              <div className="lbl !text-up">Root cause, required to close</div>
              <textarea className="tin" rows={2} value={cause} onChange={(e) => setCause(e.target.value)} placeholder="what broke and what fixed it" />
              <div className="flex justify-end gap-1.5"><button type="button" className="kbtn" onClick={() => setResolving(false)}>Cancel</button><button className="kbtn kbtn-go">Close ticket</button></div>
            </form>
          )}

          <div><div className="lbl mb-1">Diagnostic</div><p className="text-val text-[12.5px] leading-relaxed">{inc.description || 'No detail filed.'}</p></div>
          {inc.rootCause && <div className="border-l-2 border-up pl-2"><div className="lbl !text-up">Root cause</div><p className="text-val text-[12.5px] leading-relaxed">{inc.rootCause}</p>{inc.resolvedAt && <p className="text-mute text-[11px] mt-1">closed {inc.resolvedAt}</p>}</div>}

          <div>
            <div className="lbl mb-1">Log</div>
            <ol className="border border-grid">
              {inc.timeline.map((e, i) => (
                <li key={i} className="row px-2 py-1.5 grid grid-cols-[72px_1fr] gap-2 text-[12px]">
                  <span className="text-amber">{e.time}</span>
                  <span><span className="text-mute">{e.author}: </span><span className="text-val">{e.message}</span></span>
                </li>
              ))}
            </ol>
            <form onSubmit={(e) => { e.preventDefault(); if (note.trim()) { addTimelineEntry(inc.id, note.trim(), 'SRE on call'); setNote(''); } }} className="flex gap-1.5 mt-1.5">
              <input className="tin" value={note} onChange={(e) => setNote(e.target.value)} placeholder="append to log" aria-label="Log entry" />
              <button className="kbtn kbtn-go shrink-0" disabled={!note.trim()}>Post</button>
            </form>
          </div>
        </div>
      </aside>
    </div>
  );
};
