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
  Server
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
    <header className="border-b border-slate-800 bg-[#090E1A]/90 backdrop-blur sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('overview')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-700 flex items-center justify-center shadow-lg shadow-cyan-500/20 border border-cyan-400/30">
              <Activity className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight text-white font-mono">
                  Campus<span className="text-cyan-400">Pulse</span>
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
                  SRE NOC
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Campus Infrastructure & Incident Observability</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-all ${
                activeTab === 'overview'
                  ? 'bg-slate-800 text-cyan-400 border border-slate-700 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>NOC HUD</span>
            </button>

            <button
              onClick={() => setActiveTab('services')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-all ${
                activeTab === 'services'
                  ? 'bg-slate-800 text-cyan-400 border border-slate-700 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Server className="w-3.5 h-3.5" />
              <span>Services Matrix</span>
            </button>

            <button
              onClick={() => setActiveTab('network')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-all ${
                activeTab === 'network'
                  ? 'bg-slate-800 text-cyan-400 border border-slate-700 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Network className="w-3.5 h-3.5" />
              <span>Network Telemetry</span>
            </button>

            <button
              onClick={() => setActiveTab('incidents')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-all relative ${
                activeTab === 'incidents'
                  ? 'bg-slate-800 text-cyan-400 border border-slate-700 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span>Incidents</span>
              {activeIncidents.length > 0 && (
                <span className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono border ${
                  p1Count > 0 ? 'bg-rose-500/20 text-rose-400 border-rose-500/30 font-bold animate-pulse' : 'bg-slate-700 text-slate-300 border-slate-600'
                }`}>
                  {activeIncidents.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('clustering')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-all relative ${
                activeTab === 'clustering'
                  ? 'bg-slate-800 text-cyan-400 border border-slate-700 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <GitMerge className="w-3.5 h-3.5 text-indigo-400" />
              <span>AI Clustering</span>
              {activeClusters > 0 && (
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping ml-1" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('scenarios')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-all relative ${
                activeTab === 'scenarios'
                  ? 'bg-slate-800 text-cyan-400 border border-slate-700 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Outage Simulator</span>
              {activeScenario && (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping ml-1" />
              )}
            </button>
          </nav>

          {/* Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleSimulation}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium flex items-center space-x-1.5 border transition-all ${
                isSimulating
                  ? 'bg-cyan-950/40 text-cyan-300 border-cyan-500/30 hover:bg-cyan-900/40'
                  : 'bg-amber-950/40 text-amber-300 border-amber-500/30 hover:bg-amber-900/40'
              }`}
            >
              {isSimulating ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span>NOC ACTIVE</span>
                  <Pause className="w-3 h-3 ml-1 opacity-70" />
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span>PAUSED</span>
                  <Play className="w-3 h-3 ml-1 opacity-70" />
                </>
              )}
            </button>

            <button
              onClick={() => setShowResetConfirm(true)}
              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg border border-slate-800 transition-colors"
              title="Reset Demo Data"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden overflow-x-auto py-2 space-x-1 border-t border-slate-800/80">
          {(['overview', 'services', 'network', 'incidents', 'clustering', 'scenarios'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-2.5 py-1 rounded text-xs whitespace-nowrap capitalize ${
                activeTab === tab ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-medium' : 'text-slate-400'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#10172A] border border-slate-700 rounded-2xl max-w-sm w-full p-5 shadow-2xl">
            <div className="flex items-center space-x-3 text-cyan-400 mb-3">
              <RotateCcw className="w-6 h-6" />
              <h3 className="font-semibold text-white text-base">Reset CampusPulse State?</h3>
            </div>
            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              This will restore the 8 campus services to nominal baseline, reset active incidents, clear simulation outages, and recompute initial clusters.
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetToDemoData();
                  setShowResetConfirm(false);
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-cyan-600 hover:bg-cyan-500 text-white font-semibold"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
