import React from 'react';
import { Badge } from '../ui/Badge';
import { useApp } from '../../state/AppContext';
import { Activity, ShieldAlert, Sparkles, Terminal } from 'lucide-react';

export function TopBar() {
  const { dataStatus, demoMode, setDemoMode } = useApp();

  const datasetCount = Object.values(dataStatus).filter(v => v === 'READY' || v === 'UPLOADED').length;
  const modelReady = dataStatus.mlModel === 'READY';

  return (
    <header className="h-14 bg-[#FFFFFF] border-b border-[#D9D5CA] px-4 flex items-center justify-between z-20 select-none">
      {/* Platform Title */}
      <div className="flex items-center gap-3">
        <div>
          <h1 className="text-sm font-bold tracking-wider font-mono text-[#20241F] flex items-center gap-2 m-0">
            <span>MANGANESE AI INTELLIGENCE</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded font-mono bg-[#536B58]/10 text-[#536B58] border border-[#536B58]/30 font-normal">
              v1.0-alpha
            </span>
          </h1>
          <p className="text-[10px] font-mono text-[#687066] tracking-tight hidden sm:block">
            Earth Observation • Geological Intelligence • AI Prospectivity • Supply Risk
          </p>
        </div>
      </div>

      {/* Global Status Indicators & Demo Mode Toggle */}
      <div className="flex items-center gap-3 font-mono">
        {/* Dataset Status */}
        <div className="hidden md:flex items-center gap-2 bg-[#F4F1EA] px-2.5 py-1 rounded border border-[#D9D5CA]">
          <span className="text-[10px] text-[#687066] uppercase font-semibold">DATASET:</span>
          <Badge status={datasetCount > 0 ? 'UPLOADED' : 'NOT UPLOADED'}>
            {datasetCount > 0 ? `${datasetCount} LOADED` : 'NO DATA'}
          </Badge>
        </div>

        {/* Model Status */}
        <div className="hidden md:flex items-center gap-2 bg-[#F4F1EA] px-2.5 py-1 rounded border border-[#D9D5CA]">
          <span className="text-[10px] text-[#687066] uppercase font-semibold">MODEL:</span>
          <Badge status={modelReady ? 'READY' : 'NOT UPLOADED'}>
            {modelReady ? 'ONLINE' : 'UNINITIALIZED'}
          </Badge>
        </div>

        {/* Demo Mode Indicator & Switch */}
        <button
          onClick={() => setDemoMode(!demoMode)}
          className={`flex items-center gap-2 px-2.5 py-1 rounded border text-xs cursor-pointer transition-all ${
            demoMode
              ? 'bg-[#B56B32]/10 text-[#B56B32] border-[#B56B32]/50 shadow-sm'
              : 'bg-[#F4F1EA] text-[#687066] border-[#D9D5CA] hover:text-[#20241F]'
          }`}
          title="Toggle Simulation/Demo Mode Notice"
        >
          <Terminal className="w-3.5 h-3.5" />
          <span className="text-[10px] font-bold tracking-wider uppercase">
            {demoMode ? 'DEMO MODE: ACTIVE' : 'DEMO MODE: OFF'}
          </span>
        </button>
      </div>
    </header>
  );
}
