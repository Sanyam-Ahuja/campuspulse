import React, { useState } from 'react';
import { useCampusPulseStore } from '../../store/useCampusPulseStore';
import { 
  Activity, 
  ShieldAlert, 
  Radio, 
  Flame, 
  Network, 
  GitMerge, 
  RotateCcw, 
  Play, 
  Pause,
  AlertTriangle,
  Server,
  Siren
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    isSimulating,
    toggleSimulation,
    resetToDemoData,
    incidents,
    clusters,
    activeScenario,
  } = useCampusPulseStore();

  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const activeIncidents = incidents.filter((i) => i.status !== 'resolved');
  const p1Count = activeIncidents.filter((i) => i.severity === 'P1_CRITICAL').length;
  const activeClusters = clusters.filter((c) => !c.resolved).length;

  return (
    <header className="border-b border-rose-950 bg-[#09090b] sticky top-0 z-40">
      {/* Top SRE Alert Ticker */}
      <div className="bg-rose-950/40 border-b border-rose-900/30 px-4 py-1 text-[10px] font-mono flex items-center justify-between text-rose-300">
        <div className="flex items-center space-x-3">
          <span className="font-bold flex items-center space-x-1 text-rose-400">
            <Siren className="w-3.5 h-3.5 animate-pulse text-rose-500" />
            <span>SRE COMMAND: WAR ROOM ACTIVE</span>
          </span>
          <span className="hidden sm:inline text-rose-800">|</span>
          <span className="hidden sm:inline text-rose-400">OUTAGE PROBES: 8/8 ENGINES POLLING</span>
          {activeScenario && (
            <span className="hidden md:inline px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-200 border border-rose-500/40 font-bold">
              ACTIVE DRILL: {activeScenario.name}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-rose-400">P1 ALERTS: <b className="text-white">{p1Count}</b></span>
          <span className="text-rose-800">|</span>
          <span className="text-rose-400">CLUSTERS: <b className="text-white">{activeClusters}</b></span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('overview')}>
            <div className="w-8 h-8 rounded bg-rose-950 border border-rose-500/50 flex items-center justify-center shadow-lg shadow-rose-950/50">
              <Flame className="w-4 h-4 text-rose-500" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-base tracking-tight text-white font-mono">
                  CAMPUS<span className="text-rose-500">PULSE</span>
                </span>
                <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30 font-mono">
                  INCIDENT OPS
                </span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-1 text-xs font-mono font-medium">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-2.5 py-1 rounded transition-all ${
                activeTab === 'overview'
                  ? 'bg-rose-950/80 text-rose-300 border border-rose-600/60 font-bold'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              [ WAR ROOM ]
            </button>

            <button
              onClick={() => setActiveTab('incidents')}
              className={`px-2.5 py-1 rounded transition-all relative ${
                activeTab === 'incidents'
                  ? 'bg-rose-950/80 text-rose-300 border border-rose-600/60 font-bold'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <span>INCIDENTS</span>
              {activeIncidents.length > 0 && (
                <span className="ml-1.5 px-1 py-0.2 text-[9px] rounded bg-rose-600 text-white font-bold">
                  {activeIncidents.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('clustering')}
              className={`px-2.5 py-1 rounded transition-all ${
                activeTab === 'clustering'
                  ? 'bg-rose-950/80 text-rose-300 border border-rose-600/60 font-bold'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <span>CLUSTERS ({activeClusters})</span>
            </button>

            <button
              onClick={() => setActiveTab('scenarios')}
              className={`px-2.5 py-1 rounded transition-all ${
                activeTab === 'scenarios'
                  ? 'bg-rose-950/80 text-rose-300 border border-rose-600/60 font-bold'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <span>CHAOS DRILLS</span>
            </button>

            <button
              onClick={() => setActiveTab('network')}
              className={`px-2.5 py-1 rounded transition-all ${
                activeTab === 'network'
                  ? 'bg-rose-950/80 text-rose-300 border border-rose-600/60 font-bold'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <span>METRICS</span>
            </button>
          </nav>

          {/* Right Action */}
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleSimulation}
              className={`px-2.5 py-1 rounded text-xs font-mono font-bold flex items-center space-x-1.5 border transition-all ${
                isSimulating
                  ? 'bg-rose-950 text-rose-300 border-rose-600/50 hover:bg-rose-900'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-700'
              }`}
            >
              {isSimulating ? <Pause className="w-3 h-3 text-rose-400" /> : <Play className="w-3 h-3 text-emerald-400" />}
              <span className="hidden sm:inline">{isSimulating ? 'PAUSE' : 'LIVE'}</span>
            </button>

            <button
              onClick={() => setShowResetConfirm(true)}
              className="p-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition-all"
              title="Reset simulation"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#121215] border border-rose-800/80 p-5 max-w-sm w-full font-mono text-zinc-300 shadow-2xl">
            <h3 className="text-sm font-bold uppercase text-rose-400">&gt;&gt;&gt; FLUSH INCIDENT TELEMETRY?</h3>
            <p className="text-xs text-zinc-400 mt-2">
              All triggered chaos scenarios, open incidents, and clustering graphs will reset to initial state.
            </p>
            <div className="mt-4 flex justify-end space-x-2 text-xs">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-3 py-1 border border-zinc-700 text-zinc-400 hover:text-white"
              >
                ABORT
              </button>
              <button
                onClick={() => {
                  resetToDemoData();
                  setShowResetConfirm(false);
                }}
                className="px-3 py-1 bg-rose-600 text-white font-bold hover:bg-rose-500"
              >
                CONFIRM RESET
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
