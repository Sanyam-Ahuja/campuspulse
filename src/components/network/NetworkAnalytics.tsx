import React from 'react';
import { useCampusPulseStore } from '../../store/useCampusPulseStore';
import { Delta, Pane, chartAxis, chartTip } from '../term';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts';

export const NetworkAnalytics: React.FC = () => {
  const { telemetry } = useCampusPulseStore();
  const now = telemetry[telemetry.length - 1];
  const prev = telemetry[telemetry.length - 2];
  const col = (k: 'latencyMs' | 'packetLossPct' | 'throughputGbps' | 'jitterMs') => telemetry.map((t) => t[k]);
  const stats = (xs: number[]) => ({ lo: Math.min(...xs), hi: Math.max(...xs), avg: xs.reduce((a, b) => a + b, 0) / (xs.length || 1) });

  const rows = [
    { k: 'latencyMs' as const, label: 'RTT', unit: 'ms', down: true },
    { k: 'jitterMs' as const, label: 'JITTER', unit: 'ms', down: true },
    { k: 'packetLossPct' as const, label: 'LOSS', unit: '%', down: true },
    { k: 'throughputGbps' as const, label: 'THRUPUT', unit: 'G', down: false },
  ];

  return (
    <div className="grid gap-1.5 md:gap-2">
      <Pane title="Probe statistics · window of 25" bodyClass="overflow-x-auto">
        <table className="w-full min-w-[560px] text-[12.5px]">
          <thead><tr className="text-mute text-left"><th className="px-2 py-1 font-normal">METRIC</th><th className="font-normal text-right">LAST</th><th className="font-normal text-right">CHG</th><th className="font-normal text-right">LOW</th><th className="font-normal text-right">HIGH</th><th className="font-normal text-right pr-2">AVG</th></tr></thead>
          <tbody>
            {rows.map((r) => {
              const s = stats(col(r.k));
              return (
                <tr key={r.k} className="row">
                  <td className="px-2 py-1.5 text-amber font-bold">{r.label}</td>
                  <td className="text-right text-val text-[15px]">{now?.[r.k]}{r.unit}</td>
                  <td className="text-right"><Delta now={now?.[r.k] ?? 0} prev={prev?.[r.k]} goodWhenDown={r.down} digits={2} /></td>
                  <td className="text-right text-val">{s.lo.toFixed(2)}</td>
                  <td className="text-right text-val">{s.hi.toFixed(2)}</td>
                  <td className="text-right pr-2 text-val">{s.avg.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Pane>
      <div className="grid xl:grid-cols-2 gap-1.5 md:gap-2">
        <Pane title="RTT & jitter · ms" right={<span><span className="text-amber">━</span> RTT  <span className="text-val">┅</span> JITTER</span>}>
          <div className="h-[300px] p-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={telemetry} margin={{ top: 6, right: 6, left: -18, bottom: 0 }}>
                <CartesianGrid stroke="#1a1a1a" />
                <XAxis dataKey="time" {...chartAxis} />
                <YAxis {...chartAxis} />
                <Tooltip {...chartTip} />
                <Line dataKey="latencyMs" name="RTT" stroke="#ffa028" strokeWidth={1.75} dot={false} isAnimationActive={false} />
                <Line dataKey="jitterMs" name="Jitter" stroke="#f2f2f2" strokeWidth={1.25} strokeDasharray="3 3" dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Pane>
        <Pane title="Backbone throughput · Gbps" right="100GbE ring">
          <div className="h-[300px] p-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={telemetry} margin={{ top: 6, right: 6, left: -18, bottom: 0 }}>
                <CartesianGrid stroke="#1a1a1a" />
                <XAxis dataKey="time" {...chartAxis} />
                <YAxis {...chartAxis} />
                <Tooltip {...chartTip} />
                <ReferenceLine y={stats(col('throughputGbps')).avg} stroke="#5a5a5a" strokeDasharray="4 4" />
                <Line dataKey="throughputGbps" name="Gbps" stroke="#3ddc84" strokeWidth={1.75} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Pane>
      </div>
    </div>
  );
};
