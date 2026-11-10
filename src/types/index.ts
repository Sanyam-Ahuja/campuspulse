export type ServiceStatus = 'operational' | 'degraded' | 'outage' | 'maintenance';
export type IncidentSeverity = 'P1_CRITICAL' | 'P2_MAJOR' | 'P3_MINOR' | 'P4_LOW';
export type IncidentStatus = 'investigating' | 'identified' | 'mitigating' | 'resolved';

export interface CampusService {
  id: string;
  name: string;
  category: 'connectivity' | 'infrastructure' | 'identity' | 'facilities';
  status: ServiceStatus;
  uptimePct: number;
  latencyMs: number;
  packetLossPct: number;
  location: string;
  description: string;
  lastUpdated: string;
}

export interface IncidentTimelineEntry {
  time: string;
  message: string;
  author: string;
}

export interface CampusIncident {
  id: string;
  title: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  serviceId: string;
  serviceName: string;
  location: string;
  category: 'network' | 'hardware' | 'power' | 'software' | 'security';
  description: string;
  reportedAt: string;
  reportedTimestamp: number;
  resolvedAt?: string;
  rootCause?: string;
  timeline: IncidentTimelineEntry[];
  clusterId?: string;
}

export interface IncidentCluster {
  id: string;
  title: string;
  incidentIds: string[];
  reason: string;
  confidenceScore: number;
  suggestedRootCause: string;
  affectedLocation: string;
  primaryCategory: string;
  createdAt: string;
  resolved: boolean;
}

export interface NetworkTelemetryPoint {
  time: string;
  timestamp: number;
  latencyMs: number;
  packetLossPct: number;
  throughputGbps: number;
  jitterMs: number;
}

export interface OutageScenario {
  id: string;
  name: string;
  description: string;
  targetServiceIds: string[];
  latencyBoost: number;
  packetLossBoost: number;
  throughputDrop: number;
  incidentTemplates: {
    title: string;
    severity: IncidentSeverity;
    category: CampusIncident['category'];
    location: string;
    description: string;
    serviceId: string;
  }[];
}
