import React from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { useApp } from '../../state/AppContext';
import { AlertTriangle } from 'lucide-react';

export function AppShell({ children }) {
  const { demoMode } = useApp();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F4F1EA] text-[#20241F]">
      {/* Sidebar navigation */}
      <Sidebar />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header */}
        <TopBar />

        {/* Demo Mode Global Notice */}
        {demoMode && (
          <div className="bg-[#B56B32]/10 border-b border-[#B56B32]/30 px-4 py-1.5 flex items-center justify-between text-xs font-mono text-[#B56B32]">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-[#B56B32]" />
              <span className="font-semibold uppercase tracking-wider">DEMO MODE</span>
              <span className="text-[#20241F]/80">— No real dataset connected. Predictions & measurements disabled.</span>
            </div>
            <span className="text-[10px] text-[#B56B32]/80 uppercase">SIMULATION PREVIEW ONLY</span>
          </div>
        )}

        {/* Dynamic page content */}
        <main className="flex-1 overflow-y-auto min-w-0 relative">
          {children}
        </main>
      </div>
    </div>
  );
}
