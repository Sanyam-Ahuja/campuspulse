import React from 'react';
import { useCampusPulseStore } from '../../store/useCampusPulseStore';
import { Pane, Sev } from '../term';

export const ClusteringView: React.FC = () => {
  const { clusters, incidents, resolveAllInCluster, setSelectedIncidentId } = useCampusPulseStore();
  const live = clusters.filter((c) => !c.resolved);
  const done = clusters.filter((c) => c.resolved);

  return (
    <div className="grid gap-1.5 md:gap-2">
      <Pane title="How alarms are grouped">
        <p className="p-3 text-[12.5px] text-val leading-relaxed">
          sim(A,B) = <span className="text-fkey">0.35</span>·same place + <span className="text-fkey">0.30</span>·opened within 45 min + <span className="text-fkey">0.25</span>·shared service + <span className="text-fkey">0.10</span>·same category.
          Two incidents join a cluster when sim ≥ <span className="text-fkey">0.55</span>. One cluster is one probable root cause, so one fix closes every ticket in it.
        </p>
      </Pane>

      {live.length === 0 && <Pane title="Active clusters · 0"><p className="p-3 text-up">NO CORRELATED ALARMS. RUN A DRILL (DRL) TO GENERATE SOME.</p></Pane>}
      <div className="grid xl:grid-cols-2 gap-1.5 md:gap-2">
        {live.map((c) => {
          const items = incidents.filter((i) => c.incidentIds.includes(i.id));
          return (
            <Pane key={c.id} title={`${c.id} · ${c.primaryCategory}`} right={<span className="text-fkey font-bold">{Math.round(c.confidenceScore * 100)}% CONF</span>}>
              <div className="p-3 space-y-3">
                <h2 className="text-val text-[15px] font-semibold">{c.title}</h2>
                <div><div className="lbl">Why grouped</div><p className="text-[12.5px] text-amber leading-relaxed">{c.reason}</p></div>
                <div><div className="lbl">Probable root cause</div><p className="text-[12.5px] text-val leading-relaxed">{c.suggestedRootCause}</p></div>
              </div>
              <div className="border-t border-grid">
                {items.map((i) => (
                  <button key={i.id} onClick={() => setSelectedIncidentId(i.id)} className="row w-full text-left px-3 py-1.5 grid grid-cols-[28px_110px_1fr] gap-2 text-[12px] items-baseline">
                    <Sev s={i.severity} /><span className="text-amber">{i.id}</span><span className="text-val truncate">{i.title}</span>
                  </button>
                ))}
              </div>
              <div className="p-2 border-t border-grid"><button className="kbtn kbtn-go w-full" onClick={() => resolveAllInCluster(c.id)}>Mitigate cluster · close {items.length} tickets</button></div>
            </Pane>
          );
        })}
      </div>

      {done.length > 0 && (
        <Pane title={`Closed clusters · ${done.length}`}>
          {done.map((c) => <div key={c.id} className="row px-3 py-1.5 text-[12px] text-mute">{c.id} · {c.title} · {c.incidentIds.length} tickets</div>)}
        </Pane>
      )}
    </div>
  );
};
