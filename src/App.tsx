import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { WorkspaceView } from './components/WorkspaceView';
import { CoverageUniverseView } from './components/CoverageUniverseView';
import { PeerCompareView } from './components/PeerCompareView';

const MainContent: React.FC = () => {
  const { viewMode } = useApp();

  return (
    <main className="min-h-[calc(100vh-64px)] pb-12">
      {viewMode === 'workspace' && <WorkspaceView />}
      {viewMode === 'coverage' && <CoverageUniverseView />}
      {viewMode === 'compare' && <PeerCompareView />}
    </main>
  );
};

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-slate-100 text-slate-900 font-sans antialiased selection:bg-blue-600 selection:text-white">
        <Header />
        <MainContent />
      </div>
    </AppProvider>
  );
}
