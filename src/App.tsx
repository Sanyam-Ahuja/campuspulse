import React, { useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { OverviewView } from './components/dashboard/OverviewView';
import { ServiceMatrix } from './components/services/ServiceMatrix';
import { IncidentFeed } from './components/incidents/IncidentFeed';
import { ClusteringView } from './components/clustering/ClusteringView';
import { ScenarioStudio } from './components/scenarios/ScenarioStudio';
import { NetworkAnalytics } from './components/network/NetworkAnalytics';
import { IncidentDetailModal } from './components/incidents/IncidentDetailModal';
import { useCampusPulseStore } from './store/useCampusPulseStore';

export const App: React.FC = () => {
  const { activeTab, selectedIncidentId, isSimulating, tickTelemetry } = useCampusPulseStore();

  // probes: advance synthetic telemetry every 4 s while live
  useEffect(() => {
    if (!isSimulating) return;
    const t = setInterval(tickTelemetry, 4000);
    return () => clearInterval(t);
  }, [isSimulating, tickTelemetry]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 p-1.5 md:p-2">
        {activeTab === 'overview' && <OverviewView />}
        {activeTab === 'services' && <ServiceMatrix />}
        {activeTab === 'incidents' && <IncidentFeed />}
        {activeTab === 'clustering' && <ClusteringView />}
        {activeTab === 'scenarios' && <ScenarioStudio />}
        {activeTab === 'network' && <NetworkAnalytics />}
      </main>
      {selectedIncidentId && <IncidentDetailModal />}
      <footer className="border-t border-grid px-3 py-1.5 text-[11px] text-mute flex justify-between gap-2">
        <span>SYNTHETIC PROBES · ALL DATA SIMULATED IN BROWSER</span>
        <span className="hidden sm:inline">CLUSTERING: SPATIAL .35 TEMPORAL .30 SERVICE .25 CATEGORY .10</span>
      </footer>
    </div>
  );
};

export default App;
