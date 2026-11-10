import React from 'react';
import { useCampusPulseStore } from '../../store/useCampusPulseStore';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { 
  Radio, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  GitMerge, 
  Server, 
  ArrowRight, 
  Flame, 
  ShieldAlert, 
  Zap,
  Clock
} from 'lucide-react';

export const OverviewView: React.FC = () => {
  const {
    services,
    incidents,
    clusters,
    telemetry,
    activeScenario,
    stopScenario,
    setActiveTab,
    setSelectedIncidentId,
    resolveAllInCluster,
  } = useCampusPulseStore();

  const activeIncidents = incidents.filter((i) => i.status !== 'resolved');
  const activeClusters = clusters.filter((c) => !c.resolved);

  const currentTelemetry = telemetry[telemetry.length - 1] || {
    latencyMs: 14,
    packetLossPct: 0.05,
    throughputGbps: 41.2,
    jitterMs: 1.6,
  };

  const avgUptime = (
    services.reduce((acc, s) => acc + s.uptimePct, 0) / (services.length || 1)
  ).toFixed(2);

  const degradedCount = services.filter((s) => s.status === 'degraded' || s.status === 'outage').length;

  return (
    <div className="space-y-6">
      {/* Active Outage Scenario Banner */}
      {activeScenario && (
        <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/50 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-pulse">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-rose-600 rounded-xl text-white">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-white text-sm">ACTIVE CHAOS OUTAGE:</span>
                <span className="text-rose-400 font-mono font-bold text-xs">{activeScenario.name}</span>
              </div>
              <p className="text-xs text-rose-200/80 mt-0.5">{activeScenario.description}</p>
            </div>
          </div>
          <button
            onClick={stopScenario}
            className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold self-start sm:self-auto transition-colors"
          >
            End Simulation
          </button>
        </div>
      )}

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Availability */}
        <div className="bg-[#10172A] border border-slate-800 rounded-xl p-3.5">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-medium uppercase font-mono">Campus SLA</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">{avgUptime}%</div>
          <span className="text-[10px] text-emerald-400 font-mono mt-1 block">30-day Rolling SLA</span>
        </div>

        {/* Core Latency */}
        <div className="bg-[#10172A] border border-slate-800 rounded-xl p-3.5">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-medium uppercase font-mono">Core RTT</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className={`text-2xl font-bold font-mono ${currentTelemetry.latencyMs > 50 ? 'text-rose-400' : 'text-white'}`}>
            {currentTelemetry.latencyMs} <span className="text-xs text-slate-400">ms</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono mt-1 block">Jitter: {currentTelemetry.jitterMs}ms</span>
        </div>

        {/* Packet Loss */}
        <div className="bg-[#10172A] border border-slate-800 rounded-xl p-3.5">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-medium uppercase font-mono">Packet Loss</span>
            <Radio className="w-4 h-4 text-amber-400" />
          </div>
          <div className={`text-2xl font-bold font-mono ${currentTelemetry.packetLossPct > 2 ? 'text-rose-400' : 'text-white'}`}>
            {currentTelemetry.packetLossPct}%
          </div>
          <span className="text-[10px] text-slate-400 font-mono mt-1 block">Edge Switch Drops</span>
        </div>

        {/* Throughput */}
        <div className="bg-[#10172A] border border-slate-800 rounded-xl p-3.5">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-medium uppercase font-mono">Throughput</span>
            <Zap className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {currentTelemetry.throughputGbps} <span className="text-xs text-indigo-400 font-mono">Gbps</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono mt-1 block">100GbE Optical Ring</span>
        </div>

        {/* Active Incidents */}
        <div className="bg-[#10172A] border border-slate-800 rounded-xl p-3.5">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-medium uppercase font-mono">Active Incidents</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-rose-400">
            {activeIncidents.length}
          </div>
          <span className="text-[10px] text-slate-400 font-mono mt-1 block">
            {activeIncidents.filter((i) => i.severity === 'P1_CRITICAL').length} P1 Critical
          </span>
        </div>

        {/* Incident Clusters */}
        <div className="bg-[#10172A] border border-slate-800 rounded-xl p-3.5">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-medium uppercase font-mono">AI Clusters</span>
            <GitMerge className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {activeClusters.length}
          </div>
          <span className="text-[10px] text-cyan-400 font-mono mt-1 block">Explainable Root Causes</span>
        </div>
      </div>

      {/* Real-time Telemetry Stream Chart */}
      <div className="bg-[#10172A] border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <h3 className="font-bold text-white text-sm">Continuous Campus Telemetry Stream</h3>
            </div>
            <p className="text-xs text-slate-400">High-resolution ping probes, synthetic packet loss, and optical throughput</p>
          </div>
          <div className="flex items-center space-x-4 text-xs font-mono">
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-cyan-400" />
              <span className="text-slate-300">Latency (ms)</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-rose-400" />
              <span className="text-slate-300">Packet Loss (%)</span>
            </div>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={telemetry} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="latencyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="lossGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis yAxisId="left" stroke="#06b6d4" tick={{ fontSize: 11 }} unit="ms" />
              <YAxis yAxisId="right" orientation="right" stroke="#f43f5e" tick={{ fontSize: 11 }} unit="%" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontFamily: 'JetBrains Mono',
                }}
              />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="latencyMs"
                name="Latency (ms)"
                stroke="#06b6d4"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#latencyGrad)"
              />
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="packetLossPct"
                name="Packet Loss (%)"
                stroke="#f43f5e"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#lossGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Correlated AI Incident Clusters Banner */}
      {activeClusters.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <GitMerge className="w-4 h-4 text-cyan-400" />
              <span>Correlated Incident Clusters Detected</span>
            </h3>
            <button
              onClick={() => setActiveTab('clustering')}
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center space-x-1"
            >
              <span>Explain Root Causes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeClusters.map((cluster) => (
              <div
                key={cluster.id}
                className="p-4 rounded-xl bg-[#10172A] border border-cyan-500/40 shadow-lg space-y-3 text-left"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-cyan-400">{cluster.id}</span>
                  <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono">
                    {Math.round(cluster.confidenceScore * 100)}% Confidence
                  </span>
                </div>
                <h4 className="text-xs font-semibold text-white">{cluster.title}</h4>
                <p className="text-[11px] text-slate-300 leading-relaxed">{cluster.reason}</p>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-400 font-mono">
                  <strong className="text-slate-200">Suggested Action: </strong>
                  {cluster.suggestedRootCause}
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] font-mono text-slate-500">{cluster.incidentIds.length} correlated tickets</span>
                  <button
                    onClick={() => resolveAllInCluster(cluster.id)}
                    className="px-2.5 py-1 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 rounded text-xs font-medium"
                  >
                    Mitigate Cluster
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Services Grid & Active Incidents Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Core Services Status */}
        <div className="bg-[#10172A] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white flex items-center space-x-2">
              <Server className="w-4 h-4 text-emerald-400" />
              <span>Campus Services Operational Status</span>
            </h4>
            <button
              onClick={() => setActiveTab('services')}
              className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center space-x-1"
            >
              <span>Full Matrix</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2">
            {services.slice(0, 5).map((srv) => (
              <div
                key={srv.id}
                className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-semibold text-white">{srv.name}</span>
                  <p className="text-[11px] text-slate-400">{srv.location}</p>
                </div>
                <div className="text-right font-mono">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] border uppercase ${
                      srv.status === 'operational'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : srv.status === 'degraded'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                    }`}
                  >
                    {srv.status}
                  </span>
                  <div className="text-[10px] text-slate-500 mt-1">{srv.uptimePct}% uptime</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Incident Stream */}
        <div className="bg-[#10172A] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>Recent Incident Feed</span>
            </h4>
            <button
              onClick={() => setActiveTab('incidents')}
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center space-x-1"
            >
              <span>All Incidents</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2">
            {incidents.slice(0, 4).map((inc) => (
              <div
                key={inc.id}
                onClick={() => setSelectedIncidentId(inc.id)}
                className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors flex items-center justify-between text-xs"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-[10px] font-bold text-slate-300">{inc.id}</span>
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.2 rounded border ${
                        inc.severity === 'P1_CRITICAL'
                          ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 font-bold'
                          : inc.severity === 'P2_MAJOR'
                          ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      {inc.severity.replace('_', ' ')}
                    </span>
                  </div>
                  <h5 className="font-medium text-white truncate max-w-[260px]">{inc.title}</h5>
                  <p className="text-[10px] text-slate-400 truncate">{inc.location}</p>
                </div>

                <div className="text-right font-mono text-[10px]">
                  <span
                    className={`px-2 py-0.5 rounded border uppercase ${
                      inc.status === 'resolved'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30'
                    }`}
                  >
                    {inc.status}
                  </span>
                  <div className="text-slate-500 mt-1">{inc.reportedAt}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
