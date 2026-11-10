import React from 'react';
import { useCampusPulseStore } from '../../store/useCampusPulseStore';
import { OUTAGE_SCENARIOS } from '../../data/seedData';
import { Flame, Play, Square, AlertOctagon, Zap, ShieldAlert, ArrowRight } from 'lucide-react';

export const ScenarioStudio: React.FC = () => {
  const { activeScenario, triggerScenario, stopScenario, setActiveTab } = useCampusPulseStore();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#10172A] border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2 text-amber-400 mb-1">
              <Flame className="w-5 h-5" />
              <h3 className="font-bold text-white text-lg">Chaos Outage Simulation Studio</h3>
            </div>
            <p className="text-xs text-slate-400 max-w-2xl">
              Inject controlled infrastructure disruption scenarios into the campus network. Test how the SRE observability stack, synthetic telemetry probes, and AI clustering engines respond to cascading failures.
            </p>
          </div>
          {activeScenario && (
            <button
              onClick={stopScenario}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors shadow-lg shadow-rose-950/40"
            >
              <Square className="w-3.5 h-3.5" />
              <span>Stop Active Scenario</span>
            </button>
          )}
        </div>
      </div>

      {/* Scenarios Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {OUTAGE_SCENARIOS.map((sc) => {
          const isActive = activeScenario?.id === sc.id;

          return (
            <div
              key={sc.id}
              className={`p-5 rounded-2xl border transition-all text-left flex flex-col justify-between shadow-xl ${
                isActive
                  ? 'bg-rose-950/30 border-rose-500/80 shadow-rose-950/30 ring-1 ring-rose-500/50'
                  : 'bg-[#10172A] border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    DISRUPTION PROFILE
                  </span>
                  {isActive && (
                    <span className="text-[10px] font-mono text-rose-400 font-bold animate-pulse flex items-center space-x-1">
                      <span className="w-2 h-2 rounded-full bg-rose-400" />
                      <span>INJECTED</span>
                    </span>
                  )}
                </div>

                <h4 className="font-bold text-white text-sm">{sc.name}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{sc.description}</p>

                {/* Telemetry Impact Forecast */}
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1.5 font-mono text-[11px]">
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-400">Latency Surge:</span>
                    <span className="text-amber-400">+{sc.latencyBoost} ms</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-400">Packet Loss Spike:</span>
                    <span className="text-rose-400">+{sc.packetLossBoost}%</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-400">Throughput Impact:</span>
                    <span className="text-cyan-400">-{sc.throughputDrop}%</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800">
                {isActive ? (
                  <button
                    onClick={stopScenario}
                    className="w-full py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors"
                  >
                    <Square className="w-3.5 h-3.5" />
                    <span>Halt Scenario</span>
                  </button>
                ) : (
                  <button
                    onClick={() => triggerScenario(sc.id)}
                    className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors shadow-lg shadow-amber-500/20"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Inject Outage Scenario</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
