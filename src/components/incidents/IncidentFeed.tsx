import React, { useState } from 'react';
import { useCampusPulseStore } from '../../store/useCampusPulseStore';
import { CampusIncident, IncidentSeverity, IncidentStatus } from '../../types';
import { Pane, Sev } from '../term';

export const IncidentFeed: React.FC = () => {
  const { incidents, services, createIncident, setSelectedIncidentId } = useCampusPulseStore();
  const [q, setQ] = useState('');
  const [sev, setSev] = useState<'all' | IncidentSeverity>('all');
  const [st, setSt] = useState<'all' | IncidentStatus>('all');
  const [filing, setFiling] = useState(false);
  const [f, setF] = useState({ title: '', serviceId: services[0]?.id || '', severity: 'P2_MAJOR' as IncidentSeverity, category: 'network' as CampusIncident['category'], location: '', description: '' });

  const t = q.toLowerCase();
  const rows = incidents.filter((i) => (sev === 'all' || i.severity === sev) && (st === 'all' || i.status === st) && (!t || [i.id, i.title, i.location, i.serviceName].some((x) => x.toLowerCase().includes(t))));

  const file = (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.title.trim() || !f.location.trim()) return;
    const s = services.find((x) => x.id === f.serviceId);
    createIncident({ title: f.title.trim(), severity: f.severity, status: 'investigating', serviceId: f.serviceId, serviceName: s ? s.name : 'General infrastructure', location: f.location.trim(), category: f.category, description: f.description.trim() });
    setFiling(false);
    setF({ ...f, title: '', location: '', description: '' });
  };

  return (
    <div className="grid gap-1.5 md:gap-2">
      <Pane title="Incident blotter" right={<span>{rows.length} OF {incidents.length}</span>}>
        <div className="flex flex-wrap gap-1.5 p-2 border-b border-grid">
          <input className="tin flex-1 min-w-[200px]" value={q} onChange={(e) => setQ(e.target.value)} placeholder="ticket, building, service" aria-label="Search incidents" />
          <select className="tin !w-auto" value={sev} onChange={(e) => setSev(e.target.value as 'all' | IncidentSeverity)} aria-label="Severity">
            <option value="all">ALL SEV</option><option value="P1_CRITICAL">P1</option><option value="P2_MAJOR">P2</option><option value="P3_MINOR">P3</option><option value="P4_LOW">P4</option>
          </select>
          <select className="tin !w-auto" value={st} onChange={(e) => setSt(e.target.value as 'all' | IncidentStatus)} aria-label="Status">
            <option value="all">ALL STATE</option><option value="investigating">INVESTIGATING</option><option value="identified">IDENTIFIED</option><option value="mitigating">MITIGATING</option><option value="resolved">RESOLVED</option>
          </select>
          <button className="kbtn kbtn-go" onClick={() => setFiling(!filing)}>{filing ? 'Close' : 'New ticket'}</button>
        </div>

        {filing && (
          <form onSubmit={file} className="grid md:grid-cols-6 gap-2 p-2 border-b border-grid bg-[#0d0d0d]">
            <label className="md:col-span-3"><span className="lbl">Title</span><input className="tin mt-0.5" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} placeholder="Fibre loss between DC-A and library" required /></label>
            <label className="md:col-span-3"><span className="lbl">Location</span><input className="tin mt-0.5" value={f.location} onChange={(e) => setF({ ...f, location: e.target.value })} placeholder="Science Quad 2, vault B" required /></label>
            <label className="md:col-span-2"><span className="lbl">Service</span><select className="tin mt-0.5" value={f.serviceId} onChange={(e) => setF({ ...f, serviceId: e.target.value })}>{services.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select></label>
            <label><span className="lbl">Severity</span><select className="tin mt-0.5" value={f.severity} onChange={(e) => setF({ ...f, severity: e.target.value as IncidentSeverity })}><option value="P1_CRITICAL">P1 critical</option><option value="P2_MAJOR">P2 major</option><option value="P3_MINOR">P3 minor</option><option value="P4_LOW">P4 low</option></select></label>
            <label><span className="lbl">Category</span><select className="tin mt-0.5" value={f.category} onChange={(e) => setF({ ...f, category: e.target.value as CampusIncident['category'] })}>{['network', 'hardware', 'power', 'software', 'security'].map((c) => <option key={c}>{c}</option>)}</select></label>
            <label className="md:col-span-2"><span className="lbl">Detail</span><input className="tin mt-0.5" value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} placeholder="optical levels, error codes, users hit" /></label>
            <div className="md:col-span-6 flex justify-end"><button className="kbtn kbtn-go">File</button></div>
          </form>
        )}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-[12px]">
            <thead><tr className="text-mute text-left"><th className="px-2 py-1 font-normal w-8">SEV</th><th className="font-normal w-32">TICKET</th><th className="font-normal">TITLE</th><th className="font-normal">LOCATION</th><th className="font-normal">STATE</th><th className="font-normal text-right pr-2">OPENED</th></tr></thead>
            <tbody>
              {rows.length === 0 && <tr><td colSpan={6} className="p-6 text-center text-mute">NO TICKETS MATCH THIS FILTER</td></tr>}
              {rows.map((i) => (
                <tr key={i.id} onClick={() => setSelectedIncidentId(i.id)} className={`row cursor-pointer ${i.status === 'resolved' ? 'opacity-50' : ''}`}>
                  <td className="px-2 py-1.5"><Sev s={i.severity} /></td>
                  <td className="text-amber">{i.id}</td>
                  <td className="text-val pr-3">{i.title}</td>
                  <td className="text-mute pr-3">{i.location}</td>
                  <td className={`uppercase ${i.status === 'resolved' ? 'text-up' : ''}`}>{i.status}</td>
                  <td className="text-right pr-2 text-mute whitespace-nowrap">{i.reportedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Pane>
    </div>
  );
};
