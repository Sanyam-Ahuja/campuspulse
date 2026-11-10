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
import { Network, Activity, Radio, Zap, Clock, ShieldCheck } from 'lucide-react';

export const NetworkAnalytics: React.FC = () => {
  const { telemetry } = useCampusPulseStore();

  const latest = telemetry[telemetry.length - 1] || {
    latencyMs: 14,
    packetLossPct: 0.05,
    throughputGbps: 42.1,
    jitterMs: 1.8,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#10172A] border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2 text-cyan-400 mb-1">
              <Network className="w-5 h-5" />
              <h3 className="font-bold text-white text-lg">Campus Core Network Analytics</h3>
            </div>
            <p className="text-xs text-slate-400">
              High-frequency synthetic probes capturing BGP round-trip latency, transport packet loss, and optical switch throughput.
            </p>
          </div>
          <div className="flex items-center space-x-3 text-xs font-mono">
            <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
              Probing Rate: <strong className="text-cyan-400">4s interval</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Top 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-[#10172A] border border-slate-800">
          <div className="flex justify-between items-center text-slate-400 mb-1 text-xs">
            <span className="uppercase font-mono">Latency & Jitter</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">{latest.latencyMs} ms</div>
          <span className="text-xs text-cyan-400 font-mono">±{latest.jitterMs} ms jitter</span>
        </div>

        <div className="p-4 rounded-xl bg-[#10172A] border border-slate-800">
          <div className="flex justify-between items-center text-slate-400 mb-1 text-xs">
            <span className="uppercase font-mono">Packet Drop Rate</span>
            <Radio className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">{latest.packetLossPct}%</div>
          <span className="text-xs text-slate-400 font-mono">Threshold SLA: &lt; 1.0%</span>
        </div>

        <div className="p-4 rounded-xl bg-[#10172A] border border-slate-800">
          <div className="flex justify-between items-center text-slate-400 mb-1 text-xs">
            <span className="uppercase font-mono">Optical Core Aggregate</span>
            <Zap className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">{latest.throughputGbps} Gbps</div>
          <span className="text-xs text-indigo-400 font-mono">Bandwidth Utilization</span>
        </div>
      </div>

      {/* Chart 1: Latency & Jitter */}
      <div className="bg-[#10172A] border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-bold text-white flex items-center space-x-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>Round-Trip Latency (RTT) & Jitter History</span>
          </h4>
          <span className="text-xs text-slate-400 font-mono">Last 25 probe samples</span>
        </div>
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={telemetry} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} unit="ms" />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '11px' }} />
              <Line type="monotone" dataKey="latencyMs" stroke="#06b6d4" strokeWidth={2} dot={false} name="Latency (ms)" />
              <Line type="monotone" dataKey="jitterMs" stroke="#818cf8" strokeWidth={2} strokeDasharray="4 4" dot={false} name="Jitter (ms)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Optical Throughput */}
      <div className="bg-[#10172A] border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-bold text-white flex items-center space-x-2">
            <Zap className="w-4 h-4 text-indigo-400" />
            <span>Campus Optical Backbone Throughput (Gbps)</span>
          </h4>
          <span className="text-xs text-slate-400 font-mono">100GbE Capacity</span>
        </div>
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={telemetry} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="tpGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#818cf8" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#818cf8" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} unit="G" />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '11px' }} />
              <Area type="monotone" dataKey="throughputGbps" stroke="#818cf8" strokeWidth={2} fill="url(#tpGrad)" name="Throughput (Gbps)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
