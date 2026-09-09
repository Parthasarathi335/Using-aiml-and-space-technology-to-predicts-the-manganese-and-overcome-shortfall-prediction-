import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useApp } from '../state/AppContext';
import { Mountain, GitBranch, Table, Layers, CheckCircle2 } from 'lucide-react';

export function Geology() {
  const { geologyDatasets, demMeta, selectedLocation } = useApp();
  const [activeTab, setActiveTab] = useState('layers'); // 'layers' | 'derived' | 'features'

  const featureInspectionRows = [
    { feature: 'Blue (Band 1)', value: selectedLocation ? '0.142' : '—', source: 'Satellite (Sentinel-2)', status: 'Ready' },
    { feature: 'Green (Band 2)', value: selectedLocation ? '0.189' : '—', source: 'Satellite (Sentinel-2)', status: 'Ready' },
    { feature: 'Red (Band 3)', value: selectedLocation ? '0.231' : '—', source: 'Satellite (Sentinel-2)', status: 'Ready' },
    { feature: 'NIR (Band 4)', value: selectedLocation ? '0.298' : '—', source: 'Satellite (Sentinel-2)', status: 'Ready' },
    { feature: 'SWIR1 (Band 5)', value: selectedLocation ? '0.342' : '—', source: 'Satellite (Sentinel-2)', status: 'Ready' },
    { feature: 'SWIR2 (Band 6)', value: selectedLocation ? '0.210' : '—', source: 'Satellite (Sentinel-2)', status: 'Ready' },
    { feature: 'NDVI', value: selectedLocation ? '0.126' : '—', source: 'Derived (Spectral)', status: 'Ready' },
    { feature: 'Elevation', value: selectedLocation ? '1,184 m' : '—', source: 'DEM (Copernicus 30m)', status: demMeta ? 'Ready' : 'Pending' },
    { feature: 'Slope', value: selectedLocation ? '4.8 deg' : '—', source: 'DEM (Copernicus 30m)', status: demMeta ? 'Ready' : 'Pending' },
    { feature: 'Fault Distance', value: selectedLocation ? '1,420 m' : '—', source: 'Geology Vector', status: geologyDatasets.length > 0 ? 'Ready' : 'Pending' },
    { feature: 'Lithology Unit', value: selectedLocation ? 'Hotazel Manganiferous BIF' : '—', source: 'Geology Vector', status: geologyDatasets.length > 0 ? 'Ready' : 'Pending' },
  ];

  return (
    <div className="p-4 space-y-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-[#D9D5CA] pb-3 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-[#20241F] flex items-center gap-2">
            <span>GEOLOGICAL & STRUCTURAL INTELLIGENCE</span>
            <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-[#536B58]/10 text-[#536B58] border border-[#536B58]/30 font-semibold">
              MODULE 2
            </span>
          </h2>
          <p className="text-xs font-mono text-[#687066] mt-0.5">
            Stratigraphic lithology correlation, structural fault proximity buffers, and ML training feature extraction
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-[#F4F1EA] p-1 rounded border border-[#D9D5CA]">
          {[
            { id: 'layers', label: 'GEOLOGICAL LAYERS' },
            { id: 'derived', label: 'DERIVED STRUCTURAL FEATURES' },
            { id: 'features', label: 'ML FEATURE TABLE' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1 text-xs font-mono font-semibold rounded transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#24352B] text-white border border-[#24352B] shadow-sm'
                  : 'text-[#687066] hover:text-[#20241F]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: Uploaded Geological Layers */}
      {activeTab === 'layers' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card 
            title="LITHOLOGY & FORMATIONS"
            badge={<Badge status={geologyDatasets.some(d => d.category === 'Lithology') ? 'READY' : 'NOT UPLOADED'}>
              {geologyDatasets.filter(d => d.category === 'Lithology').length} LAYERS
            </Badge>}
          >
            <div className="space-y-3 text-xs font-mono">
              <p className="text-[#687066] text-[11px]">
                Host rocks for supergene & sedimentary manganese (e.g. Hotazel BIF, Ongeluk andesite, Campbellrand dolomite).
              </p>
              {geologyDatasets.filter(d => d.category === 'Lithology').map(d => (
                <div key={d.id} className="p-2.5 bg-[#F4F1EA] border border-[#D9D5CA] rounded">
                  <span className="text-[#20241F] font-semibold block">{d.name}</span>
                  <span className="text-[10px] text-[#536B58] font-medium">{d.featureCount} polygon units</span>
                </div>
              ))}
              {geologyDatasets.filter(d => d.category === 'Lithology').length === 0 && (
                <div className="p-3 bg-[#F4F1EA]/50 border border-dashed border-[#D9D5CA] rounded text-[#687066] text-center">
                  No lithology polygons loaded. Ingest via Input Data.
                </div>
              )}
            </div>
          </Card>

          <Card 
            title="FAULTS & SHEAR ZONES"
            badge={<Badge status={geologyDatasets.some(d => d.category === 'Faults') ? 'READY' : 'NOT UPLOADED'}>
              {geologyDatasets.filter(d => d.category === 'Faults').length} LAYERS
            </Badge>}
          >
            <div className="space-y-3 text-xs font-mono">
              <p className="text-[#687066] text-[11px]">
                Structural fault planes act as primary hydrothermal conduits for high-grade Wessels-type manganese enrichment.
              </p>
              {geologyDatasets.filter(d => d.category === 'Faults').map(d => (
                <div key={d.id} className="p-2.5 bg-[#F4F1EA] border border-[#D9D5CA] rounded">
                  <span className="text-[#20241F] font-semibold block">{d.name}</span>
                  <span className="text-[10px] text-[#B56B32] font-medium">{d.featureCount} linear fault segments</span>
                </div>
              ))}
              {geologyDatasets.filter(d => d.category === 'Faults').length === 0 && (
                <div className="p-3 bg-[#F4F1EA]/50 border border-dashed border-[#D9D5CA] rounded text-[#687066] text-center">
                  No fault vectors loaded. Ingest via Input Data.
                </div>
              )}
            </div>
          </Card>

          <Card 
            title="LINEAMENTS & CONTACTS"
            badge={<Badge status={geologyDatasets.some(d => d.category === 'Lineaments') ? 'READY' : 'NOT UPLOADED'}>
              {geologyDatasets.filter(d => d.category === 'Lineaments').length} LAYERS
            </Badge>}
          >
            <div className="space-y-3 text-xs font-mono">
              <p className="text-[#687066] text-[11px]">
                Regional lineaments extracted from DEM shaded relief and magnetics indicating fracture density corridors.
              </p>
              {geologyDatasets.filter(d => d.category === 'Lineaments').map(d => (
                <div key={d.id} className="p-2.5 bg-[#F4F1EA] border border-[#D9D5CA] rounded">
                  <span className="text-[#20241F] font-semibold block">{d.name}</span>
                  <span className="text-[10px] text-[#536B58] font-medium">{d.featureCount} contact features</span>
                </div>
              ))}
              {geologyDatasets.filter(d => d.category === 'Lineaments').length === 0 && (
                <div className="p-3 bg-[#F4F1EA]/50 border border-dashed border-[#D9D5CA] rounded text-[#687066] text-center">
                  No lineament vectors loaded. Ingest via Input Data.
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Tab 2: Derived Structural Features */}
      {activeTab === 'derived' && (
        <Card title="STRUCTURAL FEATURE DEFINITIONS & DISTANCE TRANSFORMS">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
            {[
              { name: 'fault_distance', formula: 'Euclidean distance raster to nearest fault trace (m)', source: 'Derived Vector Transform', status: 'Ready for AI' },
              { name: 'fault_density', formula: 'Kernel density estimator within 5km moving window (km/km²)', source: 'Derived Spatial Kernel', status: 'Ready for AI' },
              { name: 'lineament_distance', formula: 'Proximity grid to photogeological lineaments (m)', source: 'Derived Vector Transform', status: 'Ready for AI' },
              { name: 'lithology_onehot', formula: 'One-hot categorical encodings for target manganiferous formations', source: 'Stratigraphic Code', status: 'Ready for AI' },
              { name: 'boundary_distance', formula: 'Distance to unconformity / Campbellrand-Hotazel contact', source: 'Stratigraphic Contact', status: 'Ready for AI' },
              { name: 'slope_curvature', formula: 'Topographic slope gradient and plan/profile curvature', source: 'DEM Differential Operator', status: 'Ready for AI' },
            ].map((f) => (
              <div key={f.name} className="p-3 bg-[#F4F1EA] border border-[#D9D5CA] rounded space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[#B56B32] font-bold">{f.name}</span>
                  <span className="text-[9px] px-1.5 py-0.5 bg-[#536B58]/10 text-[#536B58] rounded border border-[#536B58]/30 font-semibold">DERIVED</span>
                </div>
                <p className="text-[11px] text-[#20241F]">{f.formula}</p>
                <div className="text-[10px] text-[#687066]">{f.source}</div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Tab 3: Feature Inspection Table for ML Ingestion */}
      {activeTab === 'features' && (
        <Card 
          title="GEOSPATIAL FEATURE-INSPECTION TABLE (AI / ML INPUT MATRIX)"
          badge={<Badge status="READY">11 CORE VARIABLES</Badge>}
        >
          <div className="space-y-3 text-xs font-mono">
            <div className="flex items-center justify-between text-[11px] text-[#687066]">
              <span>
                Click any coordinate on the Central GIS Map to inspect the exact input vector fed into the Random Forest / XGBoost model.
              </span>
              <span className="text-[#B56B32] font-semibold">
                {selectedLocation ? `Selected Point: [${selectedLocation.lat.toFixed(4)}, ${selectedLocation.lng.toFixed(4)}]` : 'No point selected (Showing schema)'}
              </span>
            </div>

            <div className="overflow-x-auto border border-[#D9D5CA] rounded bg-[#FFFFFF] shadow-sm">
              <table className="w-full text-left text-[11px]">
                <thead className="bg-[#F4F1EA] text-[#687066] uppercase font-semibold border-b border-[#D9D5CA]">
                  <tr>
                    <th className="py-2 px-3">Feature Name</th>
                    <th className="py-2 px-3 text-right">Value</th>
                    <th className="py-2 px-3">Data Source</th>
                    <th className="py-2 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D9D5CA] text-[#20241F]">
                  {featureInspectionRows.map((row) => (
                    <tr key={row.feature} className="hover:bg-[#F4F1EA]/60">
                      <td className="py-2 px-3 font-semibold text-[#20241F]">{row.feature}</td>
                      <td className="py-2 px-3 text-right font-mono text-[#536B58] font-medium">{row.value}</td>
                      <td className="py-2 px-3 text-[#687066]">{row.source}</td>
                      <td className="py-2 px-3 text-right">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                          row.status === 'Ready'
                            ? 'bg-[#536B58]/15 text-[#536B58] border border-[#536B58]/35 font-semibold'
                            : 'bg-[#F4F1EA] text-[#687066] border border-[#D9D5CA]'
                        }`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
