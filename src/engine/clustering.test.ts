import { describe, it, expect } from 'vitest';
import { calculateIncidentSimilarity, clusterIncidents } from './clustering';
import { advanceNetworkTelemetry } from './telemetry';
import { CampusIncident, OutageScenario } from '../types';
import { OUTAGE_SCENARIOS, INITIAL_INCIDENTS } from '../data/seedData';

describe('CampusPulse SRE Intelligence & Telemetry', () => {
  const now = Date.now();

  const incidentA: CampusIncident = {
    id: 'INC-TEST-1',
    title: 'North Quad Switch Flap',
    severity: 'P2_MAJOR',
    status: 'investigating',
    serviceId: 'dorm-gigabit',
    serviceName: 'North Quad Residential Fiber',
    location: 'Hawking Residence Hall, Floor 2',
    category: 'network',
    description: 'Port flapping',
    reportedAt: '10 mins ago',
    reportedTimestamp: now - 10 * 60 * 1000,
    timeline: [],
  };

  const incidentB: CampusIncident = {
    id: 'INC-TEST-2',
    title: 'High Packet Loss in North Quad',
    severity: 'P2_MAJOR',
    status: 'investigating',
    serviceId: 'dorm-gigabit',
    serviceName: 'North Quad Residential Fiber',
    location: 'Hawking Residence Hall, Floor 3',
    category: 'network',
    description: 'Packet drop on VLAN 104',
    reportedAt: '5 mins ago',
    reportedTimestamp: now - 5 * 60 * 1000,
    timeline: [],
  };

  const unrelatedIncident: CampusIncident = {
    id: 'INC-TEST-3',
    title: 'Classroom Projector HDMI Failure',
    severity: 'P4_LOW',
    status: 'investigating',
    serviceId: 'classroom-av',
    serviceName: 'Classroom AV',
    location: 'Science Complex, Rm 401',
    category: 'hardware',
    description: 'Projector bulb blown',
    reportedAt: '2 hours ago',
    reportedTimestamp: now - 120 * 60 * 1000,
    timeline: [],
  };

  it('calculates high similarity for spatial, service, and temporal overlap', () => {
    const sim = calculateIncidentSimilarity(incidentA, incidentB);
    expect(sim).toBeGreaterThanOrEqual(0.70);
  });

  it('calculates low similarity for completely unrelated incidents', () => {
    const sim = calculateIncidentSimilarity(incidentA, unrelatedIncident);
    expect(sim).toBeLessThan(0.30);
  });

  it('groups related incidents into explainable clusters', () => {
    const clusters = clusterIncidents([incidentA, incidentB, unrelatedIncident]);
    expect(clusters.length).toBe(1);
    expect(clusters[0].incidentIds).toContain('INC-TEST-1');
    expect(clusters[0].incidentIds).toContain('INC-TEST-2');
    expect(clusters[0].incidentIds).not.toContain('INC-TEST-3');
    expect(clusters[0].reason).toContain('Hawking Residence Hall');
  });

  it('elevates latency and packet loss when a chaos outage scenario is active', () => {
    const initial = [{
      time: '12:00',
      timestamp: now,
      latencyMs: 14,
      packetLossPct: 0.05,
      throughputGbps: 42,
      jitterMs: 1.5,
    }];

    const scenario = OUTAGE_SCENARIOS[0]; // dorm fiber sever
    const updated = advanceNetworkTelemetry(initial, [], scenario);
    const latest = updated[updated.length - 1];

    expect(latest.latencyMs).toBeGreaterThan(100);
    expect(latest.packetLossPct).toBeGreaterThan(10);
    expect(latest.throughputGbps).toBeLessThan(initial[0].throughputGbps);
  });
});
