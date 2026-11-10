import React from 'react';
import { useCampusPulseStore } from '../../store/useCampusPulseStore';
import { Delta, Pane, Sev, STAT, chartAxis, chartTip } from '../term';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export const OverviewView: React.FC = () => {
  const { services, incidents, clusters, telemetry, setActiveTab, setSelectedIncidentId, resolveAllInCluster } = useCampusPulseStore();
  const now = telemetry[telemetry.length - 1];
  const prev = telemetry[telemetry.length - 2];
  const open = incidents.filter((i) => i.status !== 'resolved').sort((a, b) => a.severity.localeCompare(b.severity));
  const live = clusters.filter((c) => !c.resolved);
  const sla = (services.reduce((a, s) => a + s.uptimePct, 0) / (services.length || 1)).toFixed(2);

  const quotes: [string, React.ReactNode, React.ReactNode][] = [
    ['CORE RTT', `${now?.latencyMs ?? '—'} ms`, <Delta now={now?.latencyMs ?? 0} prev={prev?.latencyMs} goodWhenDown />],
    ['PKT LOSS', `${now?.packetLossPct ?? '—'} %`, <Delta now={now?.packetLossPct ?? 0} prev={prev?.packetLossPct} goodWhenDown digits={2} />],
    ['THROUGHPUT', `${now?.throughputGbps ?? '—'} G`, <Delta now={now?.throughputGbps ?? 0} prev={prev?.throughputGbps} />],
    ['JITTER', `${now?.jitterMs ?? '—'} ms`, <Delta now={now?.jitterMs ?? 0} prev={prev?.jitterMs} goodWhenDown />],
    ['30D SLA', `${sla} %`, null],
    ['OPEN INC', `${open.length}`, <span className="text-down">{open.filter((i) => i.severity === 'P1_CRITICAL').length} P1</span>],
  ];

  return (
    <div className="grid gap-1.5 md:gap-2">
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-px bg-grid border border-grid">
        {quotes.map(([k, v, d]) => (
          <div key={k} className="bg-pane px-3 py-2">
            <div className="lbl">{k}</div>
            <div className="flex items-baseline gap-2 mt-0.5"><span className="text-val text-[22px] font-semibold">{v}</span><span className="text-[12px]">{d}</span></div>
          </div>
        ))}
      </div>

      <div className="grid xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-1.5 md:gap-2">
        <Pane title="Core network · last 25 probes" right={<span><span className="text-amber">━</span> RTT ms  <span className="text-down">━</span> LOSS %</span>}>
          <div className="h-[280px] p-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={telemetry} margin={{ top: 6, right: 6, left: -18, bottom: 0 }}>
                <CartesianGrid stroke="#1a1a1a" />
                <XAxis dataKey="time" {...chartAxis} />
                <YAxis yAxisId="l" {...chartAxis} />
                <YAxis yAxisId="r" orientation="right" {...chartAxis} />
                <Tooltip {...chartTip} />
                <Line yAxisId="l" type="linear" dataKey="latencyMs" name="RTT ms" stroke="#ffa028" strokeWidth={1.75} dot={false} isAnimationActive={false} />
                <Line yAxisId="r" type="stepAfter" dataKey="packetLossPct" name="Loss %" stroke="#ff4d4d" strokeWidth={1.5} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Pane>

        <Pane title={`Open incidents · ${open.length}`} right={<button className="underline" onClick={() => setActiveTab('incidents')}>INC</button>} bodyClass="overflow-y-auto max-h-[300px]">
          {open.length === 0 && <p className="p-3 text-up">NO OPEN INCIDENTS</p>}
          {open.map((i) => (
            <button key={i.id} onClick={() => setSelectedIncidentId(i.id)} className="row w-full text-left grid grid-cols-[28px_1fr_auto] gap-2 px-2 py-1.5 items-baseline">
              <Sev s={i.severity} />
              <span className="min-w-0"><span className="text-val block truncate">{i.title}</span><span className="text-mute text-[11px] truncate block">{i.id} · {i.location}</span></span>
              <span className="text-[11px] uppercase">{i.status.slice(0, 5)}</span>
            </button>
          ))}
        </Pane>
      </div>

      <div className="grid xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-1.5 md:gap-2">
        <Pane title="Services" right={<button className="underline" onClick={() => setActiveTab('services')}>SVC</button>} bodyClass="overflow-x-auto">
          <table className="w-full min-w-[560px] text-[12px]">
            <thead><tr className="text-mute text-left"><th className="px-2 py-1 font-normal">SERVICE</th><th className="font-normal">STAT</th><th className="font-normal text-right">LAT</th><th className="font-normal text-right">LOSS</th><th className="font-normal text-right pr-2">UPTIME</th></tr></thead>
            <tbody>
              {services.map((s) => (
                <tr key={s.id} className="row">
                  <td className="px-2 py-1.5"><span className="text-val">{s.name}</span></td>
                  <td className={`font-bold ${STAT[s.status].c}`}>{STAT[s.status].t}</td>
                  <td className={`text-right ${s.latencyMs > 30 ? 'text-down' : 'text-val'}`}>{s.latencyMs}ms</td>
                  <td className={`text-right ${s.packetLossPct > 1 ? 'text-down' : 'text-val'}`}>{s.packetLossPct}%</td>
                  <td className="text-right pr-2 text-val">{s.uptimePct}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Pane>

        <Pane title={`Correlated clusters · ${live.length}`} right={<button className="underline" onClick={() => setActiveTab('clustering')}>CLU</button>}>
          {live.length === 0 && <p className="p-3 text-mute">NO CORRELATED ALARMS. OPEN INCIDENTS LOOK INDEPENDENT.</p>}
          {live.map((c) => (
            <div key={c.id} className="row p-2">
              <div className="flex justify-between gap-2"><span className="text-val">{c.title}</span><span className="text-fkey shrink-0">{Math.round(c.confidenceScore * 100)}%</span></div>
              <p className="text-mute text-[11px] mt-0.5">{c.incidentIds.length} TICKETS · {c.affectedLocation}</p>
              <button className="kbtn mt-1.5 !py-0.5 text-[11px]" onClick={() => resolveAllInCluster(c.id)}>Mitigate all {c.incidentIds.length}</button>
            </div>
          ))}
        </Pane>
      </div>
    </div>
  );
};
