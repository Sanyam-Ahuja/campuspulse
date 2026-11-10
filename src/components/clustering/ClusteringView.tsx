import React from 'react';
import { useCampusPulseStore } from '../../store/useCampusPulseStore';
import { GitMerge, CheckCircle2, ShieldAlert, Sparkles, MapPin, Layers, ArrowRight } from 'lucide-react';

export const ClusteringView: React.FC = () => {
  const { clusters, incidents, resolveAllInCluster, setSelectedIncidentId, setActiveTab } = useCampusPulseStore();

  const activeClusters = clusters.filter((c) => !c.resolved);
  const resolvedClusters = clusters.filter((c) => c.resolved);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#10172A] border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2 text-cyan-400 mb-1">
              <GitMerge className="w-5 h-5" />
              <h3 className="font-bold text-white text-lg">Explainable Incident Clustering</h3>
            </div>
            <p className="text-xs text-slate-400">
              Deterministic correlation engine grouping multiple independent alarms into singular systemic root causes using spatial proximity, service dependency trees, and temporal convergence.
            </p>
          </div>
          <div className="flex items-center space-x-2 text-xs font-mono">
            <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
              <strong className="text-cyan-400">{activeClusters.length}</strong> Active Root Clusters
            </span>
          </div>
        </div>
      </div>

      {/* Rationale Formula Box */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 space-y-1 font-mono">
        <span className="text-cyan-400 font-bold block text-[11px] uppercase">Clustering Decision Formula:</span>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Similarity(A, B) = 0.35 × Spatial_Overlap + 0.30 × Temporal_Convergence(&lt;45m) + 0.25 × Shared_Service_Graph + 0.10 × Category_Match.
          Clusters trigger when Similarity ≥ 0.55.
        </p>
      </div>

      {/* Active Clusters */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Active Root Cause Clusters ({activeClusters.length})
        </h4>

        {activeClusters.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500 font-mono border border-dashed border-slate-800 rounded-2xl bg-[#10172A]">
            No correlated systemic clusters currently identified. All active incidents represent isolated anomalies.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {activeClusters.map((cluster) => {
              const clusterIncidents = incidents.filter((i) =>
                cluster.incidentIds.includes(i.id)
              );

              return (
                <div
                  key={cluster.id}
                  className="p-5 rounded-2xl bg-[#10172A] border border-cyan-500/40 shadow-xl space-y-4 text-left"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div>
                      <span className="font-mono text-xs font-bold text-cyan-400">{cluster.id}</span>
                      <h4 className="font-bold text-white text-sm mt-0.5">{cluster.title}</h4>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-mono text-xs font-bold">
                      {Math.round(cluster.confidenceScore * 100)}% Confidence
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-slate-400">Correlation Logic:</span>
                      <p className="text-slate-200 mt-0.5 leading-relaxed">{cluster.reason}</p>
                    </div>

                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                      <span className="text-[10px] font-mono uppercase text-cyan-400 block mb-1">
                        Systemic Root Cause Hypothesis:
                      </span>
                      <p className="text-slate-300 font-mono text-[11px] leading-relaxed">
                        {cluster.suggestedRootCause}
                      </p>
                    </div>
                  </div>

                  {/* Grouped Incidents */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-800">
                    <span className="text-[10px] font-mono text-slate-400 uppercase">
                      Correlated Sub-incidents ({clusterIncidents.length}):
                    </span>
                    <div className="space-y-1">
                      {clusterIncidents.map((inc) => (
                        <div
                          key={inc.id}
                          onClick={() => {
                            setSelectedIncidentId(inc.id);
                            setActiveTab('incidents');
                          }}
                          className="p-2 rounded-lg bg-slate-900/60 hover:bg-slate-800 cursor-pointer flex items-center justify-between text-xs transition-colors"
                        >
                          <div className="flex items-center space-x-2 truncate">
                            <span className="font-mono text-[10px] text-cyan-400 font-bold">{inc.id}</span>
                            <span className="text-slate-300 truncate">{inc.title}</span>
                          </div>
                          <span className="font-mono text-[10px] text-slate-500 shrink-0 ml-2">{inc.location.split(',')[0]}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Batch Mitigation Button */}
                  <button
                    onClick={() => resolveAllInCluster(cluster.id)}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition-colors shadow-lg shadow-emerald-950/40"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Execute Batch Cluster Mitigation ({clusterIncidents.length} Tickets)</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
