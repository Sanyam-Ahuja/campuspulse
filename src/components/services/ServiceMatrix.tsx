import React from 'react';
import { useCampusPulseStore } from '../../store/useCampusPulseStore';
import { Pane, Sev, STAT } from '../term';

export const ServiceMatrix: React.FC = () => {
  const { services, incidents, setSelectedIncidentId } = useCampusPulseStore();
  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-1.5 md:gap-2">
      {services.map((s) => {
        const inc = incidents.filter((i) => i.serviceId === s.id && i.status !== 'resolved');
        return (
          <Pane key={s.id} title={s.id} right={<span className={`font-bold ${STAT[s.status].c}`}>{STAT[s.status].t}</span>} className={s.status === 'outage' ? '!border-down' : ''}>
            <div className="p-3">
              <div className="text-val text-[14px] font-semibold leading-snug">{s.name}</div>
              <div className="text-mute text-[11px] mt-0.5">{s.category.toUpperCase()} · {s.location}</div>
              <p className="text-amberdim text-[11.5px] mt-2 leading-relaxed">{s.description}</p>
              <dl className="grid grid-cols-3 gap-2 mt-3">
                <div><dt className="lbl">Uptime</dt><dd className="text-val text-[15px]">{s.uptimePct}%</dd></div>
                <div><dt className="lbl">Latency</dt><dd className={`text-[15px] ${s.latencyMs > 30 ? 'text-down' : 'text-val'}`}>{s.latencyMs}ms</dd></div>
                <div><dt className="lbl">Loss</dt><dd className={`text-[15px] ${s.packetLossPct > 1 ? 'text-down' : 'text-val'}`}>{s.packetLossPct}%</dd></div>
              </dl>
            </div>
            <div className="border-t border-grid">
              {inc.length === 0 ? <p className="px-3 py-2 text-up text-[11.5px]">NO OPEN INCIDENTS</p> : inc.map((i) => (
                <button key={i.id} onClick={() => setSelectedIncidentId(i.id)} className="row w-full text-left px-3 py-1.5 flex gap-2 items-baseline text-[12px]">
                  <Sev s={i.severity} /><span className="text-val truncate">{i.title}</span>
                </button>
              ))}
            </div>
          </Pane>
        );
      })}
    </div>
  );
};
