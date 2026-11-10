import React from 'react';
import { useCampusPulseStore } from '../../store/useCampusPulseStore';
import { Server, CheckCircle2, AlertOctagon, ShieldAlert, Radio, Activity, ArrowUpRight } from 'lucide-react';

export const ServiceMatrix: React.FC = () => {
  const { services, incidents, setActiveTab, setSelectedIncidentId } = useCampusPulseStore();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#10172A] border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2 text-emerald-400 mb-1">
              <Server className="w-5 h-5" />
              <h3 className="font-bold text-white text-lg">Campus Services Reliability Matrix</h3>
            </div>
            <p className="text-xs text-slate-400">
              Live operational health, latency SLA, packet drop rates, and incident linkages across all campus IT domains.
            </p>
          </div>
          <div className="flex items-center space-x-2 text-xs font-mono">
            <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
              8 Core Campus Services Monitored
            </span>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {services.map((srv) => {
          const srvIncidents = incidents.filter(
            (i) => i.serviceId === srv.id && i.status !== 'resolved'
          );

          const isOperational = srv.status === 'operational';
          const isDegraded = srv.status === 'degraded';
          const isOutage = srv.status === 'outage';

          return (
            <div
              key={srv.id}
              className={`p-5 rounded-2xl border transition-all text-left shadow-lg ${
                isOutage
                  ? 'bg-rose-950/20 border-rose-500/60 shadow-rose-950/30'
                  : isDegraded
                  ? 'bg-amber-950/20 border-amber-500/60 shadow-amber-950/30'
                  : 'bg-[#10172A] border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                  {srv.category}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono border uppercase font-semibold ${
                    isOperational
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : isDegraded
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 animate-pulse'
                      : 'bg-rose-500/20 text-rose-400 border-rose-500/40 font-bold animate-pulse'
                  }`}
                >
                  {srv.status}
                </span>
              </div>

              <h4 className="font-bold text-white text-sm mb-1">{srv.name}</h4>
              <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed mb-4">
                {srv.description}
              </p>

              <div className="space-y-2 pt-3 border-t border-slate-800/80 font-mono text-xs">
                <div className="flex justify-between items-center text-slate-300">
                  <span className="text-slate-400 text-[11px]">30-Day SLA:</span>
                  <span className="font-bold text-emerald-400">{srv.uptimePct}%</span>
                </div>

                <div className="flex justify-between items-center text-slate-300">
                  <span className="text-slate-400 text-[11px]">Core Latency:</span>
                  <span className={srv.latencyMs > 30 ? 'text-amber-400 font-bold' : 'text-slate-200'}>
                    {srv.latencyMs} ms
                  </span>
                </div>

                <div className="flex justify-between items-center text-slate-300">
                  <span className="text-slate-400 text-[11px]">Packet Loss:</span>
                  <span className={srv.packetLossPct > 1 ? 'text-rose-400 font-bold' : 'text-slate-200'}>
                    {srv.packetLossPct}%
                  </span>
                </div>
              </div>

              {/* Incidents Linked */}
              <div className="mt-4 pt-3 border-t border-slate-800/80">
                {srvIncidents.length > 0 ? (
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-rose-400 font-bold block">
                      {srvIncidents.length} Active Incident{srvIncidents.length > 1 ? 's' : ''}:
                    </span>
                    {srvIncidents.map((inc) => (
                      <button
                        key={inc.id}
                        onClick={() => {
                          setSelectedIncidentId(inc.id);
                          setActiveTab('incidents');
                        }}
                        className="text-[10px] text-slate-300 hover:text-white truncate block w-full text-left font-mono"
                      >
                        • {inc.id}: {inc.title}
                      </button>
                    ))}
                  </div>
                ) : (
                  <span className="text-[11px] text-slate-500 font-mono flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>No active incidents</span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
