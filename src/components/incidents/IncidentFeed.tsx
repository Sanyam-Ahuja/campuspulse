import React, { useState } from 'react';
import { useCampusPulseStore } from '../../store/useCampusPulseStore';
import { CampusIncident, IncidentSeverity, IncidentStatus } from '../../types';
import { AlertTriangle, Plus, Search, Filter, ShieldAlert, CheckCircle2, Clock } from 'lucide-react';

export const IncidentFeed: React.FC = () => {
  const { incidents, services, createIncident, setSelectedIncidentId } = useCampusPulseStore();

  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState<'all' | IncidentSeverity>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | IncidentStatus>('all');
  const [showModal, setShowModal] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [serviceId, setServiceId] = useState(services[0]?.id || '');
  const [severity, setSeverity] = useState<IncidentSeverity>('P2_MAJOR');
  const [category, setCategory] = useState<CampusIncident['category']>('network');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');

  const filtered = incidents.filter((inc) => {
    if (severityFilter !== 'all' && inc.severity !== severityFilter) return false;
    if (statusFilter !== 'all' && inc.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const match =
        inc.id.toLowerCase().includes(q) ||
        inc.title.toLowerCase().includes(q) ||
        inc.location.toLowerCase().includes(q) ||
        inc.serviceName.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !location.trim()) return;
    const srv = services.find((s) => s.id === serviceId);

    createIncident({
      title,
      severity,
      status: 'investigating',
      serviceId,
      serviceName: srv ? srv.name : 'General Infrastructure',
      location,
      category,
      description,
    });

    setShowModal(false);
    setTitle('');
    setLocation('');
    setDescription('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#10172A] border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-rose-400 mb-1">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="font-bold text-white text-lg">SRE Incident Management</h3>
          </div>
          <p className="text-xs text-slate-400">
            Lifecycle tracking from automated detection to root cause investigation, mitigation, and post-mortem.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors shadow-lg shadow-rose-600/20 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>File Incident Report</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-[#10172A] border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by ticket ID, building, title, or service..."
              className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value as any)}
              className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
            >
              <option value="all">All Severities</option>
              <option value="P1_CRITICAL">P1 Critical</option>
              <option value="P2_MAJOR">P2 Major</option>
              <option value="P3_MINOR">P3 Minor</option>
              <option value="P4_LOW">P4 Low</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
            >
              <option value="all">All Statuses</option>
              <option value="investigating">Investigating</option>
              <option value="identified">Identified</option>
              <option value="mitigating">Mitigating</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-slate-400">
          Showing <strong className="text-white font-mono">{filtered.length}</strong> incident tickets
        </div>
      </div>

      {/* Incidents List */}
      <div className="space-y-3">
        {filtered.map((inc) => (
          <div
            key={inc.id}
            onClick={() => setSelectedIncidentId(inc.id)}
            className="p-5 rounded-2xl bg-[#10172A] border border-slate-800 hover:border-slate-700 transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 text-left group"
          >
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs font-bold text-slate-300 group-hover:text-cyan-400 transition-colors">
                  {inc.id}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono border uppercase font-bold ${
                    inc.severity === 'P1_CRITICAL'
                      ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                      : inc.severity === 'P2_MAJOR'
                      ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                      : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  {inc.severity.replace('_', ' ')}
                </span>
                <span className="text-[11px] font-mono text-slate-500">• Reported {inc.reportedAt}</span>
              </div>
              <h4 className="text-sm font-semibold text-white">{inc.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{inc.description}</p>
              <div className="flex items-center space-x-3 text-[11px] font-mono text-slate-400 pt-1">
                <span>Location: <strong className="text-slate-300">{inc.location}</strong></span>
                <span>•</span>
                <span>Service: <strong className="text-cyan-400">{inc.serviceName}</strong></span>
              </div>
            </div>

            <div className="flex items-center space-x-3 self-start md:self-center font-mono text-xs">
              <span
                className={`px-2.5 py-1 rounded-lg border uppercase font-semibold ${
                  inc.status === 'resolved'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : inc.status === 'mitigating'
                    ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                }`}
              >
                {inc.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* New Incident Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#10172A] border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <h3 className="font-bold text-white text-base mb-4 flex items-center space-x-2 text-rose-400">
              <ShieldAlert className="w-5 h-5" />
              <span>Create Infrastructure Incident</span>
            </h3>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Incident Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Fiber link degradation between DC-A and Library"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">Affected Service</label>
                  <select
                    value={serviceId}
                    onChange={(e) => setServiceId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-rose-500"
                  >
                    {services.map((srv) => (
                      <option key={srv.id} value={srv.id}>
                        {srv.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">Severity Level</label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-rose-500"
                  >
                    <option value="P1_CRITICAL">P1 - Critical Campus Outage</option>
                    <option value="P2_MAJOR">P2 - Major Facility Degradation</option>
                    <option value="P3_MINOR">P3 - Minor Subsystem Fault</option>
                    <option value="P4_LOW">P4 - Low / Cosmetic Anomaly</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Science Quad 2, Vault B"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-rose-500"
                  >
                    <option value="network">Network & Routing</option>
                    <option value="hardware">Hardware & Transceivers</option>
                    <option value="power">Power & Facilities</option>
                    <option value="software">Software & Services</option>
                    <option value="security">Security & DDoS</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Diagnostic Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Include error codes, optical levels, or affected user count..."
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold"
                >
                  File Incident
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
