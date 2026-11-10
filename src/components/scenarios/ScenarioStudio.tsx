import React from 'react';
import { useCampusPulseStore } from '../../store/useCampusPulseStore';
import { OUTAGE_SCENARIOS } from '../../data/seedData';
import { Pane, Sev } from '../term';

export const ScenarioStudio: React.FC = () => {
  const { activeScenario, triggerScenario, stopScenario, setActiveTab, services } = useCampusPulseStore();
  return (
    <div className="grid gap-1.5 md:gap-2">
      <Pane title="Fault drills">
        <p className="p-3 text-[12.5px] text-val leading-relaxed">
          Inject a scripted failure. The probes degrade, the drill files its incidents, and the clustering engine has to work out they share a cause.
          Watch it land on MON, then open CLU. Only one drill runs at a time.
        </p>
      </Pane>
      <div className="grid md:grid-cols-2 gap-1.5 md:gap-2">
        {OUTAGE_SCENARIOS.map((sc) => {
          const on = activeScenario?.id === sc.id;
          return (
            <Pane key={sc.id} title={sc.name} right={on ? <span className="bg-down text-black px-1 font-bold">RUNNING</span> : null} className={on ? '!border-down' : ''}>
              <div className="p-3 space-y-3">
                <p className="text-[12.5px] text-amber leading-relaxed">{sc.description}</p>
                <dl className="grid grid-cols-3 gap-px bg-grid border border-grid text-center">
                  <div className="bg-pane py-1.5"><dt className="lbl">RTT</dt><dd className="text-down">+{sc.latencyBoost}ms</dd></div>
                  <div className="bg-pane py-1.5"><dt className="lbl">LOSS</dt><dd className="text-down">+{sc.packetLossBoost}%</dd></div>
                  <div className="bg-pane py-1.5"><dt className="lbl">THRUPUT</dt><dd className="text-down">−{sc.throughputDrop}%</dd></div>
                </dl>
                <div>
                  <div className="lbl mb-1">Will file</div>
                  {sc.incidentTemplates.map((t, i) => (
                    <div key={i} className="flex gap-2 items-baseline text-[12px] py-0.5"><Sev s={t.severity} /><span className="text-val truncate">{t.title}</span></div>
                  ))}
                </div>
                <div className="text-[11px] text-mute">HITS {sc.targetServiceIds.map((id) => services.find((s) => s.id === id)?.id.toUpperCase() ?? id).join(' · ')}</div>
              </div>
              <div className="p-2 border-t border-grid flex gap-1.5">
                {on ? (
                  <>
                    <button className="kbtn kbtn-red flex-1" onClick={stopScenario}>Stop drill</button>
                    <button className="kbtn flex-1" onClick={() => setActiveTab('overview')}>Watch MON</button>
                  </>
                ) : (
                  <button className="kbtn kbtn-go flex-1" onClick={() => triggerScenario(sc.id)} disabled={!!activeScenario}>{activeScenario ? 'Another drill is running' : 'Inject fault'}</button>
                )}
              </div>
            </Pane>
          );
        })}
      </div>
    </div>
  );
};
