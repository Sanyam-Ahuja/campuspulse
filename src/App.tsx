import React, { useEffect } from 'react';
import { useCampusPulseStore } from './store/useCampusPulseStore';
import { Navbar } from './components/layout/Navbar';
import { OverviewView } from './components/dashboard/OverviewView';
import { ServiceMatrix } from './components/services/ServiceMatrix';
import { NetworkAnalytics } from './components/network/NetworkAnalytics';
import { IncidentFeed } from './components/incidents/IncidentFeed';
import { ClusteringView } from './components/clustering/ClusteringView';
import { ScenarioStudio } from './components/scenarios/ScenarioStudio';
import { IncidentDetailModal } from './components/incidents/IncidentDetailModal';

export const App: React.FC = () => {
  const { activeTab, tickTelemetry, isSimulating } = useCampusPulseStore();

  useEffect(() => {
    if (!isSimulating) return;
    const interval = setInterval(() => {
      tickTelemetry();
    }, 3500);
    return () => clearInterval(interval);
  }, [isSimulating, tickTelemetry]);

  return (
    <div className="min-h-screen bg-[#070A13] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-300">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'overview' && <OverviewView />}
        {activeTab === 'services' && <ServiceMatrix />}
        {activeTab === 'network' && <NetworkAnalytics />}
        {activeTab === 'incidents' && <IncidentFeed />}
        {activeTab === 'clustering' && <ClusteringView />}
        {activeTab === 'scenarios' && <ScenarioStudio />}
      </main>

      <IncidentDetailModal />

      <footer className="border-t border-slate-800/80 bg-[#090E1A] py-4 text-center text-xs text-slate-500 font-mono">
        <p>CampusPulse SRE NOC Platform • Smart Campus & Student Life • Standalone Observability Simulation</p>
      </footer>
    </div>
  );
};

export default App;
