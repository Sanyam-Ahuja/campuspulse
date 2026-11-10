import { NetworkTelemetryPoint, CampusIncident, OutageScenario } from '../types';

export function advanceNetworkTelemetry(
  currentHistory: NetworkTelemetryPoint[],
  activeIncidents: CampusIncident[],
  activeScenario: OutageScenario | null
): NetworkTelemetryPoint[] {
  const now = new Date();
  const timeStr = `${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

  let baseLatency = 14;
  let baseLoss = 0.04;
  let baseThroughput = 42.5;
  let baseJitter = 1.6;

  // Add impact of active incidents
  const unresolved = activeIncidents.filter((i) => i.status !== 'resolved');
  unresolved.forEach((inc) => {
    if (inc.severity === 'P1_CRITICAL') {
      baseLatency += 45;
      baseLoss += 4.5;
      baseThroughput -= 12;
      baseJitter += 6.5;
    } else if (inc.severity === 'P2_MAJOR') {
      baseLatency += 18;
      baseLoss += 1.8;
      baseThroughput -= 5;
      baseJitter += 2.8;
    } else if (inc.severity === 'P3_MINOR') {
      baseLatency += 6;
      baseLoss += 0.4;
      baseJitter += 0.9;
    }
  });

  // Add impact of simulated outage scenario if triggered
  if (activeScenario) {
    baseLatency += activeScenario.latencyBoost;
    baseLoss += activeScenario.packetLossBoost;
    baseThroughput = Math.max(2, baseThroughput * (1 - activeScenario.throughputDrop / 100));
    baseJitter += 8.2;
  }

  // Jitter
  const jitterLat = (Math.random() - 0.5) * 4;
  const jitterLoss = (Math.random() - 0.5) * 0.15;
  const jitterThroughput = (Math.random() - 0.5) * 3;

  const newPoint: NetworkTelemetryPoint = {
    time: timeStr,
    timestamp: now.getTime(),
    latencyMs: Math.max(1, Math.round(baseLatency + jitterLat)),
    packetLossPct: parseFloat(Math.max(0, baseLoss + jitterLoss).toFixed(2)),
    throughputGbps: parseFloat(Math.max(1, baseThroughput + jitterThroughput).toFixed(1)),
    jitterMs: parseFloat(Math.max(0.5, baseJitter + (Math.random() - 0.5) * 0.8).toFixed(1)),
  };

  return [...currentHistory.slice(-24), newPoint];
}
