import { CampusIncident, IncidentCluster } from '../types';

/**
 * Computes an explainable similarity score between two incidents based on:
 * 1. Temporal Proximity (reported within 45 mins: +0.30)
 * 2. Spatial / Location Overlap (+0.35)
 * 3. Shared Affected Service (+0.25)
 * 4. Shared Technical Category (+0.10)
 */
export function calculateIncidentSimilarity(a: CampusIncident, b: CampusIncident): number {
  if (a.id === b.id) return 1.0;

  let score = 0;

  // 1. Time proximity
  const timeDiffMins = Math.abs(a.reportedTimestamp - b.reportedTimestamp) / (1000 * 60);
  if (timeDiffMins <= 45) {
    score += 0.30 * (1 - timeDiffMins / 45);
  }

  // 2. Location proximity (e.g. both in "Hawking Residence Hall" or "Library")
  const locA = a.location.toLowerCase();
  const locB = b.location.toLowerCase();
  const locPartsA = locA.split(/[,–-]/)[0].trim();
  const locPartsB = locB.split(/[,–-]/)[0].trim();

  if (locPartsA === locPartsB || locA.includes(locPartsB) || locB.includes(locPartsA)) {
    score += 0.35;
  }

  // 3. Shared Service
  if (a.serviceId === b.serviceId) {
    score += 0.25;
  }

  // 4. Shared Category
  if (a.category === b.category) {
    score += 0.10;
  }

  return parseFloat(score.toFixed(2));
}

/**
 * Groups active incidents into explainable clusters using greedy connected components
 * with similarity threshold >= 0.55.
 */
export function clusterIncidents(incidents: CampusIncident[]): IncidentCluster[] {
  const activeIncidents = incidents.filter((i) => i.status !== 'resolved');
  if (activeIncidents.length < 2) return [];

  const visited = new Set<string>();
  const clusters: IncidentCluster[] = [];

  for (let i = 0; i < activeIncidents.length; i++) {
    const incA = activeIncidents[i];
    if (visited.has(incA.id)) continue;

    const group: CampusIncident[] = [incA];
    visited.add(incA.id);

    for (let j = i + 1; j < activeIncidents.length; j++) {
      const incB = activeIncidents[j];
      if (visited.has(incB.id)) continue;

      const sim = calculateIncidentSimilarity(incA, incB);
      if (sim >= 0.55) {
        group.push(incB);
        visited.add(incB.id);
      }
    }

    if (group.length >= 2) {
      // Create an explainable cluster
      const primaryLoc = group[0].location.split(/[,–-]/)[0].trim();
      const primaryCategory = group[0].category;
      const serviceNames = Array.from(new Set(group.map((g) => g.serviceName))).join(', ');
      
      const avgConfidence = parseFloat(
        (0.75 + Math.min(0.20, (group.length - 1) * 0.08)).toFixed(2)
      );

      const clusterId = `CLS-${primaryLoc.replace(/\s+/g, '-').toUpperCase().slice(0, 10)}-${group.length}`;

      clusters.push({
        id: clusterId,
        title: `Correlated Infrastructure Degrade: ${primaryLoc}`,
        incidentIds: group.map((g) => g.id),
        reason: `${group.length} overlapping ${primaryCategory} incidents detected in close spatial proximity (${primaryLoc}) affecting ${serviceNames}.`,
        confidenceScore: avgConfidence,
        suggestedRootCause: `Common distribution layer failure or upstream optical link saturation near ${primaryLoc}. Recommend verifying core switch interconnects and power delivery.`,
        affectedLocation: primaryLoc,
        primaryCategory,
        createdAt: group[0].reportedAt,
        resolved: group.every((g) => g.status === 'resolved'),
      });
    }
  }

  return clusters;
}
