import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppProvider } from './state/AppContext';
import { AppShell } from './components/layout/AppShell';

// Pages
import { Dashboard } from './pages/Dashboard';
import { InputData } from './pages/InputData';
import { SatelliteProcessing } from './pages/Satellite';
import { Geology } from './pages/Geology';
import { Prediction } from './pages/Prediction';
import { InteractiveMap } from './pages/InteractiveMap';
import { SupplyDemand } from './pages/SupplyDemand';
import { ShortfallForecast } from './pages/ShortfallForecast';
import { Analytics } from './pages/Analytics';
import { Reports } from './pages/Reports';

export default function App() {
  return (
    <AppProvider>
      <AppShell>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/input-data" element={<InputData />} />
          <Route path="/satellite" element={<SatelliteProcessing />} />
          <Route path="/geology" element={<Geology />} />
          <Route path="/prediction" element={<Prediction />} />
          <Route path="/map" element={<InteractiveMap />} />
          <Route path="/supply-demand" element={<SupplyDemand />} />
          <Route path="/shortfall-forecast" element={<ShortfallForecast />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </AppShell>
    </AppProvider>
  );
}
