import React, { useState } from 'react';
import { MetricCard } from '../components/dashboard/MetricCard';
import { DataStatus } from '../components/dashboard/DataStatus';
import { MapView } from '../components/map/MapView';
import { LocationAnalysis } from '../components/map/LocationAnalysis';
import { useApp } from '../state/AppContext';
import { 
  Globe2, 
  Database, 
  Layers, 
  Cpu, 
  Flame, 
  TrendingDown
} from 'lucide-react';

export function Dashboard() {
  const { 
    selectedLocation, 
    setSelectedLocation,
    studyArea,
    dataStatus,
    ndviConfig,
    assayDataset,
    trainedModel,
    predictionGrid,
    forecastResults
  } = useApp();

  const [mapFullscreen, setMapFullscreen] = useState(false);

  const readyDatasetsCount = Object.values(dataStatus).filter(v => v === 'READY').length;
  const target2030 = forecastResults?.target2030;

  return (
    <div className="p-3.5 space-y-3.5 max-w-[1920px] mx-auto min-h-full flex flex-col">
      {/* Top Analytical KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5">
        <MetricCard
          title="Study Area"
          value={studyArea.type === 'bounds' ? 'Kalahari Basin' : `${studyArea.radius.radiusKm}km Radius`}
          subtitle={`Lat ${studyArea.radius.centerLat.toFixed(1)}° / Lon ${studyArea.radius.centerLon.toFixed(1)}°`}
          icon={Globe2}
        />
        <MetricCard
          title="Uploaded Datasets"
          value={`${readyDatasetsCount} / 6`}
          subtitle={readyDatasetsCount > 0 ? `${readyDatasetsCount} layers validated` : 'Awaiting data'}
          icon={Database}
        />
        <MetricCard
          title="Usable Outcrop Area"
          value={ndviConfig.usableAreaKm2 ? '12,650 km²' : '—'}
          subtitle={ndviConfig.usableAreaKm2 ? '88.6% bare bedrock' : 'Requires NDVI mask'}
          icon={Layers}
        />
        <MetricCard
          title="Mn Occurrence Points"
          value={assayDataset?.records ? `${assayDataset.records.length} Points` : '—'}
          subtitle={assayDataset?.records ? 'Ground truth drillholes' : 'Awaiting assay CSV'}
          icon={Flame}
        />
        <MetricCard
          title="Model Status"
          value={trainedModel ? (trainedModel.isSimulated ? 'Demo Trained' : 'Active Model') : 'Uninitialized'}
          subtitle={trainedModel ? `${trainedModel.algorithm}` : 'No weights loaded'}
          icon={Cpu}
        />
        <MetricCard
          title="2030 Supply Risk"
          value={target2030 ? `${target2030.risk.level}` : '—'}
          subtitle={target2030 ? (target2030.balance < 0 ? `${Math.abs(target2030.balance).toLocaleString()} kt Deficit` : 'Surplus') : 'Forecast pending'}
          icon={TrendingDown}
        />
      </div>

      {/* Main Workspace: Central Map (~70%) + Side Intelligence Panels (~30%) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3.5 min-h-[580px]">
        {/* Central Interactive Leaflet Map (~70% = 8 or 9 cols on large screen) */}
        <div className={`lg:col-span-8 xl:col-span-9 flex flex-col border border-[#D9D5CA] rounded-sm bg-[#D7D0BF] overflow-hidden shadow-sm relative ${
          mapFullscreen ? 'fixed inset-0 z-50 p-0 m-0 rounded-none' : 'h-[620px] lg:h-auto'
        }`}>
          {/* Map Header ribbon */}
          <div className="h-9 px-3 bg-[#FFFFFF] border-b border-[#D9D5CA] flex items-center justify-between z-10 select-none">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#536B58] animate-pulse" />
              <span className="text-xs font-mono font-semibold text-[#20241F] uppercase tracking-wider">
                CENTRAL GIS EXPLORER — EARTH OBSERVATION & PROSPECTIVITY
              </span>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-mono text-[#687066]">
              <span>TARGET REGION: {studyArea.name}</span>
              {trainedModel && (
                <span className="text-[#B56B32] bg-[#B56B32]/10 px-2 py-0.5 rounded border border-[#B56B32]/30 font-semibold">
                  {trainedModel.algorithm} ACTIVE
                </span>
              )}
              {assayDataset?.records && (
                <span className="text-[#536B58] bg-[#536B58]/10 px-2 py-0.5 rounded border border-[#536B58]/30 font-semibold">
                  {assayDataset.records.length} ASSAY PINS ACTIVE
                </span>
              )}
            </div>
          </div>

          {/* Leaflet GIS Map */}
          <div className="flex-1 relative">
            <MapView 
              isFullscreen={mapFullscreen}
              onToggleFullscreen={() => setMapFullscreen(!mapFullscreen)}
            />
          </div>
        </div>

        {/* Right Side Intelligence & Status Stack (~30% = 4 or 3 cols) */}
        <div className="lg:col-span-4 xl:col-span-3 flex flex-col gap-3.5">
          {/* Data Status Panel */}
          <DataStatus />

          {/* Location Analysis Inspector */}
          <LocationAnalysis 
            location={selectedLocation}
            onClose={() => setSelectedLocation(null)}
          />
        </div>
      </div>
    </div>
  );
}
