import React, { useState } from 'react';
import { useCampusPulseStore } from '../../store/useCampusPulseStore';
import { STAT } from '../term';

type Tab = ReturnType<typeof useCampusPulseStore.getState>['activeTab'];
export const SCREENS: { id: Tab; code: string; label: string }[] = [
  { id: 'overview', code: 'MON', label: 'Monitor' },
  { id: 'services', code: 'SVC', label: 'Services' },
  { id: 'incidents', code: 'INC', label: 'Incidents' },
  { id: 'clustering', code: 'CLU', label: 'Clusters' },
  { id: 'network', code: 'NET', label: 'Network' },
  { id: 'scenarios', code: 'DRL', label: 'Drills' },
];

export const Navbar: React.FC = () => {
  const { activeTab, setActiveTab, isSimulating, toggleSimulation, resetToDemoData, services, incidents, activeScenario } = useCampusPulseStore();
  const [cmd, setCmd] = useState('');
  const [msg, setMsg] = useState('');
  const [confirm, setConfirm] = useState(false);
  const open = incidents.filter((i) => i.status !== 'resolved');

  const run = (e: React.FormEvent) => {
    e.preventDefault();
    const c = cmd.trim().toUpperCase();
    const hit = SCREENS.find((s) => s.code === c || s.label.toUpperCase() === c);
    if (hit) { setActiveTab(hit.id); setMsg(''); }
    else if (c === 'LIVE' || c === 'PAUSE') { if ((c === 'LIVE') !== isSimulating) toggleSimulation(); setMsg(''); }
    else if (c === 'RESET') setConfirm(true);
    else if (c) setMsg(`UNKNOWN COMMAND "${c}". TRY ${SCREENS.map((s) => s.code).join(' ')} LIVE PAUSE RESET`);
    setCmd('');
  };

  const tape = [...services, ...services];
  return (
    <header className="sticky top-0 z-30 bg-screen border-b border-grid">
      {/* command line */}
      <form onSubmit={run} className="flex items-center gap-3 px-3 py-1.5 border-b border-grid">
        <span className="text-val font-bold tracking-tight shrink-0">CAMPUSPULSE</span>
        <label className="flex items-center gap-2 flex-1 min-w-0 bg-[#111] px-2 py-1">
          <span className="text-fkey shrink-0">&gt;</span>
          <input value={cmd} onChange={(e) => setCmd(e.target.value)} aria-label="Command" placeholder="type INC, SVC, NET… and press GO"
            className="bg-transparent outline-none text-val uppercase flex-1 min-w-0 placeholder:normal-case placeholder:text-[#555]" spellCheck={false} autoComplete="off" />
          <span className="cursor text-amber hidden sm:inline">█</span>
        </label>
        <button className="fkey shrink-0">GO</button>
        <span className="hidden md:flex items-center gap-3 shrink-0 text-[12px]">
          <span className={isSimulating ? 'text-up' : 'text-amber'}>{isSimulating ? '● LIVE 4s' : '❚❚ PAUSED'}</span>
          <span>OPEN <b className="text-val">{open.length}</b></span>
          <span>P1 <b className={open.some((i) => i.severity === 'P1_CRITICAL') ? 'text-down' : 'text-val'}>{open.filter((i) => i.severity === 'P1_CRITICAL').length}</b></span>
        </span>
      </form>
      {msg && <div className="px-3 py-1 text-down text-[12px] border-b border-grid">{msg}</div>}
      {confirm && (
        <div className="px-3 py-1.5 bg-down text-black text-[12px] flex gap-3 items-center">
          RESET ALL INCIDENTS, DRILLS AND TELEMETRY?
          <button className="underline font-bold" onClick={() => { resetToDemoData(); setConfirm(false); }}>CONFIRM</button>
          <button className="underline" onClick={() => setConfirm(false)}>CANCEL</button>
        </div>
      )}

      {/* function keys */}
      <nav className="flex flex-wrap items-center gap-x-1 gap-y-1 px-3 py-1.5" aria-label="Screens">
        {SCREENS.map((s, i) => {
          const on = s.id === activeTab;
          return (
            <button key={s.id} onClick={() => setActiveTab(s.id)} aria-current={on ? 'page' : undefined}
              className={`flex items-center gap-1.5 pr-2 ${on ? 'bg-amber text-black' : 'hover:bg-[#1a1a1a]'}`}>
              <span className="fkey">{i + 1}</span>
              <span className="font-bold">{s.code}</span>
              <span className={`hidden lg:inline ${on ? '' : 'text-amberdim'}`}>{s.label}</span>
            </button>
          );
        })}
        <span className="ml-auto flex gap-1">
          <button className="kbtn !py-0.5" onClick={toggleSimulation}>{isSimulating ? 'Pause' : 'Live'}</button>
          <button className="kbtn !py-0.5" onClick={() => setConfirm(true)}>Reset</button>
        </span>
      </nav>

      {activeScenario && (
        <div className="bg-down text-black px-3 py-1 font-bold text-[12px] flex justify-between gap-3">
          <span className="truncate">DRILL IN PROGRESS · {activeScenario.name.toUpperCase()} · SYNTHETIC FAULTS INJECTED</span>
          <button className="underline shrink-0" onClick={() => setActiveTab('scenarios')}>DRL</button>
        </div>
      )}

      {/* ticker tape */}
      <div className="overflow-hidden border-t border-grid bg-[#050505]" aria-label="Service ticker">
        <div className="ticker flex w-max whitespace-nowrap py-1 text-[12px]">
          {tape.map((s, i) => (
            <span key={i} className="px-4 border-r border-grid">
              <span className="text-amber">{s.id.toUpperCase()}</span>{' '}
              <span className="text-val">{s.latencyMs}ms</span>{' '}
              <span className={STAT[s.status].c}>{STAT[s.status].t}</span>{' '}
              <span className="text-mute">{s.uptimePct}%</span>
            </span>
          ))}
        </div>
      </div>
    </header>
  );
};
