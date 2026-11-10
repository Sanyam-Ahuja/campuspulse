import { create } from 'zustand';
import { CampusService, CampusIncident, IncidentCluster, NetworkTelemetryPoint, OutageScenario, IncidentStatus, IncidentSeverity } from '../types';
import { CAMPUS_SERVICES, INITIAL_INCIDENTS, OUTAGE_SCENARIOS, generateInitialTelemetry } from '../data/seedData';
import { clusterIncidents } from '../engine/clustering';
import { advanceNetworkTelemetry } from '../engine/telemetry';

interface CampusPulseState {
  services: CampusService[];
  incidents: CampusIncident[];
  clusters: IncidentCluster[];
  telemetry: NetworkTelemetryPoint[];
  activeScenario: OutageScenario | null;
  activeTab: 'overview' | 'services' | 'network' | 'incidents' | 'clustering' | 'scenarios';
  selectedIncidentId: string | null;
  isSimulating: boolean;

  // Actions
  tickTelemetry: () => void;
  toggleSimulation: () => void;
  setActiveTab: (tab: CampusPulseState['activeTab']) => void;
  setSelectedIncidentId: (id: string | null) => void;
  
  triggerScenario: (scenarioId: string) => void;
  stopScenario: () => void;
  createIncident: (incident: Omit<CampusIncident, 'id' | 'reportedAt' | 'reportedTimestamp' | 'timeline'>) => void;
  updateIncidentStatus: (id: string, status: IncidentStatus, rootCause?: string) => void;
  addTimelineEntry: (id: string, message: string, author: string) => void;
  resolveAllInCluster: (clusterId: string) => void;
  resetToDemoData: () => void;
}

const STORAGE_KEY = 'campuspulse_state_v1';

function loadPersistedState(): {
  services: CampusService[];
  incidents: CampusIncident[];
} {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.services && parsed.incidents) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Failed to load persisted CampusPulse state:', err);
  }
  return {
    services: CAMPUS_SERVICES,
    incidents: INITIAL_INCIDENTS,
  };
}

function saveState(services: CampusService[], incidents: CampusIncident[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ services, incidents }));
  } catch (err) {
    console.warn('Failed to persist CampusPulse state:', err);
  }
}

const initialData = loadPersistedState();
const initialClusters = clusterIncidents(initialData.incidents);

export const useCampusPulseStore = create<CampusPulseState>((set, get) => ({
  services: initialData.services,
  incidents: initialData.incidents,
  clusters: initialClusters,
  telemetry: generateInitialTelemetry(),
  activeScenario: null,
  activeTab: 'overview',
  selectedIncidentId: null,
  isSimulating: true,

  tickTelemetry: () => {
    if (!get().isSimulating) return;
    set((state) => {
      const newTelemetry = advanceNetworkTelemetry(
        state.telemetry,
        state.incidents,
        state.activeScenario
      );

      // Dynamically update service statuses based on active incidents
      const updatedServices = state.services.map((srv) => {
        const related = state.incidents.filter(
          (inc) => inc.serviceId === srv.id && inc.status !== 'resolved'
        );
        let status = srv.status;
        if (related.some((i) => i.severity === 'P1_CRITICAL')) {
          status = 'outage';
        } else if (related.length > 0) {
          status = 'degraded';
        } else if (status === 'outage' || status === 'degraded') {
          status = 'operational';
        }
        return { ...srv, status };
      });

      return {
        telemetry: newTelemetry,
        services: updatedServices,
      };
    });
  },

  toggleSimulation: () => set((state) => ({ isSimulating: !state.isSimulating })),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedIncidentId: (id) => set({ selectedIncidentId: id }),

  triggerScenario: (scenarioId) => {
    const scenario = OUTAGE_SCENARIOS.find((s) => s.id === scenarioId);
    if (!scenario) return;

    set((state) => {
      // Inject scenario incidents
      const now = Date.now();
      const injected: CampusIncident[] = scenario.incidentTemplates.map((template, idx) => ({
        id: `INC-SIM-${Math.floor(200 + Math.random() * 800)}`,
        title: template.title,
        severity: template.severity,
        status: 'investigating',
        serviceId: template.serviceId,
        serviceName: state.services.find((s) => s.id === template.serviceId)?.name || 'Campus Infrastructure',
        location: template.location,
        category: template.category,
        description: template.description,
        reportedAt: 'Just now',
        reportedTimestamp: now - idx * 2000,
        timeline: [
          { time: 'Just now', message: `Incident automatically opened via scenario injection: ${scenario.name}`, author: 'NOC Auto-Monitor' },
        ],
      }));

      const newIncidents = [...injected, ...state.incidents];
      const newClusters = clusterIncidents(newIncidents);
      saveState(state.services, newIncidents);

      return {
        activeScenario: scenario,
        incidents: newIncidents,
        clusters: newClusters,
      };
    });
  },

  stopScenario: () => {
    set({ activeScenario: null });
  },

  createIncident: (data) => {
    const newInc: CampusIncident = {
      ...data,
      id: `INC-2026-${Math.floor(300 + Math.random() * 700)}`,
      reportedAt: 'Just now',
      reportedTimestamp: Date.now(),
      timeline: [
        { time: 'Just now', message: 'Incident manually created via SRE operator portal.', author: 'Operator' },
      ],
    };

    set((state) => {
      const updated = [newInc, ...state.incidents];
      const clusters = clusterIncidents(updated);
      saveState(state.services, updated);
      return { incidents: updated, clusters };
    });
  },

  updateIncidentStatus: (id, status, rootCause) => {
    set((state) => {
      const now = new Date().toLocaleTimeString();
      const updated = state.incidents.map((inc) => {
        if (inc.id === id) {
          const newTimeline = [
            ...inc.timeline,
            { time: 'Just now', message: `Status updated to ${status.toUpperCase()}${rootCause ? `. Resolution: ${rootCause}` : ''}`, author: 'SRE On-Call' },
          ];
          return {
            ...inc,
            status,
            rootCause: rootCause || inc.rootCause,
            resolvedAt: status === 'resolved' ? now : inc.resolvedAt,
            timeline: newTimeline,
          };
        }
        return inc;
      });

      const clusters = clusterIncidents(updated);
      saveState(state.services, updated);
      return { incidents: updated, clusters };
    });
  },

  addTimelineEntry: (id, message, author) => {
    set((state) => {
      const updated = state.incidents.map((inc) => {
        if (inc.id === id) {
          return {
            ...inc,
            timeline: [...inc.timeline, { time: 'Just now', message, author }],
          };
        }
        return inc;
      });
      saveState(state.services, updated);
      return { incidents: updated };
    });
  },

  resolveAllInCluster: (clusterId) => {
    set((state) => {
      const cluster = state.clusters.find((c) => c.id === clusterId);
      if (!cluster) return state;

      const now = new Date().toLocaleTimeString();
      const updatedIncidents = state.incidents.map((inc) => {
        if (cluster.incidentIds.includes(inc.id)) {
          return {
            ...inc,
            status: 'resolved' as const,
            resolvedAt: now,
            rootCause: cluster.suggestedRootCause,
            timeline: [
              ...inc.timeline,
              { time: 'Just now', message: `Batch resolved via Cluster Mitigation Action [${clusterId}]`, author: 'SRE Incident Commander' },
            ],
          };
        }
        return inc;
      });

      const updatedClusters = clusterIncidents(updatedIncidents);
      saveState(state.services, updatedIncidents);
      return { incidents: updatedIncidents, clusters: updatedClusters };
    });
  },

  resetToDemoData: () => {
    localStorage.removeItem(STORAGE_KEY);
    const freshServices = CAMPUS_SERVICES;
    const freshIncidents = INITIAL_INCIDENTS;
    const freshClusters = clusterIncidents(freshIncidents);
    saveState(freshServices, freshIncidents);
    set({
      services: freshServices,
      incidents: freshIncidents,
      clusters: freshClusters,
      telemetry: generateInitialTelemetry(),
      activeScenario: null,
      selectedIncidentId: null,
    });
  },
}));
