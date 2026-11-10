import React from 'react';
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
  const { activeTab, selectedIncidentId } = useCampusPulseStore();

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col font-sans selection:bg-rose-900 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'overview' && <OverviewView />}
        {activeTab === 'services' && <ServiceMatrix />}
        {activeTab === 'incidents' && <IncidentFeed />}
        {activeTab === 'clustering' && <ClusteringView />}
        {activeTab === 'scenarios' && <ScenarioStudio />}
        {activeTab === 'network' && <NetworkAnalytics />}
      </main>

      {selectedIncidentId && <IncidentDetailModal />}

      <footer className="border-t border-rose-950/60 bg-[#050507] py-4 text-center text-xs text-zinc-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-rose-400/80 font-bold">&gt;&gt; CAMPUSPULSE // SRE ALERT OPS // REAL-TIME INCIDENT CLUSTERING</p>
          <p className="text-zinc-600">CLIENT-SIDE SYNTHETIC PROBES • DETERMINISTIC CLUSTERING ENGINE</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
