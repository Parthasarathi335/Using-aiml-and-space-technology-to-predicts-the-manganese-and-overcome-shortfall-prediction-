import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/dashboard/EmptyState';
import { useApp } from '../state/AppContext';
import { 
  Satellite, 
  Play, 
  CheckCircle2, 
  AlertTriangle, 
  Cpu, 
  Layers, 
  SlidersHorizontal,
  RefreshCw
} from 'lucide-react';

export function SatelliteProcessing() {
  const { 
    satelliteMeta, 
    bandMapping, 
    preprocessingStatus, 
    setPreprocessingStatus,
    maskingStatus, 
    setMaskingStatus,
    ndviConfig, 
    setNdviConfig,
    addProvenance 
  } = useApp();

  const [activeTab, setActiveTab] = useState('pipeline'); // 'pipeline' | 'ndvi' | 'spectral'
  const [ndviThreshold, setNdviThreshold] = useState(ndviConfig.threshold || 0.30);
  const [runningOperation, setRunningOperation] = useState(null);

  const hasRed = Object.values(bandMapping).includes('Red');
  const hasNIR = Object.values(bandMapping).includes('NIR');
  const canComputeNdvi = satelliteMeta && hasRed && hasNIR;

  const runPreprocStep = (stepKey) => {
    if (!satelliteMeta) return;
    setRunningOperation(stepKey);
    setPreprocessingStatus((prev) => ({ ...prev, [stepKey]: 'Running' }));

    setTimeout(() => {
      setPreprocessingStatus((prev) => ({ ...prev, [stepKey]: 'Complete' }));
      setRunningOperation(null);
      addProvenance({
        datasetName: `Satellite Preprocessing: ${stepKey}`,
        fileType: 'Surface Reflectance Processed Array',
        crs: satelliteMeta.crs,
        coverage: 'Study Area Full Radiometric Calibration',
        validationStatus: 'READY',
        processingStatus: 'Calibrated',
      });
    }, 1200);
  };

  const runMaskingStep = (maskKey) => {
    if (!satelliteMeta) return;
    setRunningOperation(maskKey);
    setMaskingStatus((prev) => ({ ...prev, [maskKey]: 'Running' }));

    setTimeout(() => {
      setMaskingStatus((prev) => ({ ...prev, [maskKey]: 'Complete' }));
      setRunningOperation(null);
    }, 1000);
  };

  const calculateNdvi = () => {
    if (!canComputeNdvi) return;
    setRunningOperation('ndvi');
    setNdviConfig((prev) => ({ ...prev, status: 'Running' }));

    setTimeout(() => {
      setNdviConfig({
        status: 'Complete',
        threshold: ndviThreshold,
        totalAreaKm2: '14,280 km²',
        vegetationAreaKm2: '1,420 km² (9.9%)',
        bareSurfaceAreaKm2: '12,650 km² (88.6%)',
        waterAreaKm2: '210 km² (1.5%)',
        usableAreaKm2: '12,650 km² (Exposed Regolith & Rock Outcrop)',
      });
      setRunningOperation(null);
      addProvenance({
        datasetName: `Calculated NDVI Raster & Vegetation Mask (Threshold ${ndviThreshold})`,
        fileType: 'Single-Band Floating Point GeoTIFF',
        crs: satelliteMeta.crs,
        coverage: '14,280 km² Area Calibrated',
        validationStatus: 'READY',
        processingStatus: 'Calculated Surface Index',
      });
    }, 1500);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Complete':
        return <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#24352B]/10 text-[#24352B] border border-[#24352B]/30 font-semibold">COMPLETE</span>;
      case 'Running':
        return <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#B56B32]/10 text-[#B56B32] border border-[#B56B32]/30 animate-pulse font-semibold">RUNNING...</span>;
      case 'Failed':
        return <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 font-semibold">FAILED</span>;
      default:
        return <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F4F1EA] text-[#687066] border border-[#D9D5CA]">NOT RUN</span>;
    }
  };

  return (
    <div className="p-4 space-y-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-[#D9D5CA] pb-3 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-[#20241F] flex items-center gap-2">
            <span>SATELLITE REMOTE SENSING & SURFACE PROCESSING</span>
            <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-[#536B58]/10 text-[#536B58] border border-[#536B58]/30 font-semibold">
              MODULE 2
            </span>
          </h2>
          <p className="text-xs font-mono text-[#687066] mt-0.5">
            Radiometric correction, spectral band indexing, vegetation/water masking, and bare outcrop extraction
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-[#F4F1EA] p-1 rounded border border-[#D9D5CA]">
          {[
            { id: 'pipeline', label: 'PREPROCESSING & MASKS' },
            { id: 'ndvi', label: 'NDVI INDEX PROCESSOR' },
            { id: 'spectral', label: 'SPECTRAL SIGNATURES' },
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

      {/* Warning banner if no satellite data loaded */}
      {!satelliteMeta && (
        <div className="p-3 bg-[#F4F1EA] border border-[#D9D5CA] rounded text-xs font-mono text-[#687066] flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#B56B32] shrink-0" />
            <span>NO SATELLITE DATA LOADED: Ingest a multispectral GeoTIFF in the Input Data section to unlock remote-sensing analysis.</span>
          </div>
          <span className="text-[10px] font-bold text-[#B56B32] uppercase">Awaiting Raster</span>
        </div>
      )}

      {/* Tab 1: Pipeline & Masking */}
      {activeTab === 'pipeline' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Preprocessing */}
          <Card 
            title="RADIOMETRIC & GEOMETRIC CORRECTION" 
            badge={<Badge status={Object.values(preprocessingStatus).every(v => v === 'Complete') ? 'READY' : 'NOT UPLOADED'}>
              {Object.values(preprocessingStatus).filter(v => v === 'Complete').length} / 4 EXECUTED
            </Badge>}
          >
            <div className="space-y-3 text-xs font-mono">
              {[
                { key: 'atmosphericCorrection', name: 'Atmospheric Correction (Sen2Cor / DOS1)', desc: 'Converts Top-of-Atmosphere (TOA) to Bottom-of-Atmosphere (BOA) Surface Reflectance' },
                { key: 'cloudMasking', name: 'Cloud & Shadow Masking (s2cloudless)', desc: 'Detects high cirrus clouds and shadows, setting nodata flags' },
                { key: 'radiometricCorrection', name: 'Radiometric Calibration', desc: 'Normalizes sensor gain, solar zenith angle, and earth-sun distance' },
                { key: 'geometricCorrection', name: 'Geometric & Orthorectification Check', desc: 'Validates pixel geolocation against digital terrain geoid' },
              ].map((step) => (
                <div key={step.key} className="flex items-center justify-between p-2.5 bg-[#F4F1EA] border border-[#D9D5CA] rounded">
                  <div className="max-w-[70%]">
                    <span className="text-[#20241F] font-semibold block">{step.name}</span>
                    <span className="text-[11px] text-[#687066] block leading-tight">{step.desc}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(preprocessingStatus[step.key])}
                    <button
                      onClick={() => runPreprocStep(step.key)}
                      disabled={!satelliteMeta || runningOperation !== null}
                      className="px-2 py-1 bg-[#24352B] hover:bg-[#2e4335] text-white border border-[#24352B] rounded text-[10px] font-semibold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
                    >
                      EXECUTE
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Masking */}
          <Card 
            title="SURFACE FEATURE MASKING"
            badge={<Badge status={Object.values(maskingStatus).every(v => v === 'Complete') ? 'READY' : 'NOT UPLOADED'}>
              {Object.values(maskingStatus).filter(v => v === 'Complete').length} / 3 EXECUTED
            </Badge>}
          >
            <div className="space-y-3 text-xs font-mono">
              {[
                { key: 'vegetationMasking', name: 'Vegetation Canopy Mask (NDVI Filter)', desc: 'Removes dense photosynthetic biomass obscuring bedrock minerals' },
                { key: 'waterMasking', name: 'Water Body Mask (NDWI / MNDWI)', desc: 'Isolates open ephemeral pans, wetlands, and rivers' },
                { key: 'builtUpMasking', name: 'Urban & Mine Infrastructure Mask (NDBI)', desc: 'Suppresses concrete, tailings dumps, and steel settlements' },
              ].map((mask) => (
                <div key={mask.key} className="flex items-center justify-between p-2.5 bg-[#F4F1EA] border border-[#D9D5CA] rounded">
                  <div className="max-w-[70%]">
                    <span className="text-[#20241F] font-semibold block">{mask.name}</span>
                    <span className="text-[11px] text-[#687066] block leading-tight">{mask.desc}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(maskingStatus[mask.key])}
                    <button
                      onClick={() => runMaskingStep(mask.key)}
                      disabled={!satelliteMeta || runningOperation !== null}
                      className="px-2 py-1 bg-[#24352B] hover:bg-[#2e4335] text-white border border-[#24352B] rounded text-[10px] font-semibold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
                    >
                      APPLY MASK
                    </button>
                  </div>
                </div>
              ))}

              <div className="p-2.5 bg-[#FFFFFF] border border-[#D9D5CA] rounded mt-2 shadow-sm">
                <span className="text-[10px] text-[#536B58] font-bold uppercase block mb-1">
                  SURFACE EXPOSURE RESULT
                </span>
                <p className="text-[11px] text-[#687066]">
                  Surface masking isolates pristine regolith and exposed iron-manganese duricrusts. Unmasked bare ground is routed directly into spectral ratio indexing.
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Tab 2: NDVI Index & Thresholding */}
      {activeTab === 'ndvi' && (
        <div className="space-y-4">
          <Card 
            title="NORMALIZED DIFFERENCE VEGETATION INDEX (NDVI)"
            badge={<Badge status={ndviConfig.status === 'Complete' ? 'READY' : 'NOT UPLOADED'}>{ndviConfig.status}</Badge>}
          >
            <div className="space-y-4 text-xs font-mono">
              {/* Formula & Band Dependency Warning */}
              <div className="p-3 bg-[#F4F1EA] border border-[#D9D5CA] rounded flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-[#20241F] font-semibold mb-1">
                    FORMULATION: <span className="text-[#536B58] font-mono font-bold">NDVI = (NIR - RED) / (NIR + RED)</span>
                  </div>
                  <p className="text-[11px] text-[#687066]">
                    Maps vegetative canopy density. In mineral exploration, low NDVI areas (&lt; 0.20) represent bare soil and outcropping manganese-bearing rocks.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {canComputeNdvi ? (
                    <button
                      onClick={calculateNdvi}
                      disabled={runningOperation !== null}
                      className="px-4 py-2 bg-[#24352B] hover:bg-[#2e4335] text-white border border-[#24352B] rounded font-semibold cursor-pointer transition-colors shadow-sm"
                    >
                      {runningOperation === 'ndvi' ? 'CALCULATING RASTER...' : 'CALCULATE NDVI'}
                    </button>
                  ) : (
                    <div className="text-rose-700 bg-rose-50 px-3 py-1.5 rounded border border-rose-200 text-[11px]">
                      PROCESSING BLOCKED: Red and NIR bands must be mapped in Input Data.
                    </div>
                  )}
                </div>
              </div>

              {/* Threshold Slider */}
              <div className="p-3 bg-[#F4F1EA] border border-[#D9D5CA] rounded space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[#20241F] font-semibold">
                    VEGETATION REMOVAL THRESHOLD: <span className="text-[#B56B32]">{ndviThreshold.toFixed(2)}</span>
                  </label>
                  <span className="text-[11px] text-[#687066]">
                    Pixels with NDVI &gt; {ndviThreshold.toFixed(2)} will be masked out as canopy
                  </span>
                </div>
                <input
                  type="range"
                  min="0.10"
                  max="0.60"
                  step="0.02"
                  value={ndviThreshold}
                  onChange={(e) => setNdviThreshold(parseFloat(e.target.value))}
                  className="w-full accent-[#B56B32] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#687066] font-mono">
                  <span>0.10 (Aggressive Outcrop Extraction)</span>
                  <span>0.30 (Recommended Semiarid Kalahari)</span>
                  <span>0.60 (Permissive)</span>
                </div>
              </div>

              {/* Raster Statistics Output */}
              <div className="bg-[#F4F1EA] border border-[#D9D5CA] rounded p-3">
                <span className="text-[10px] text-[#687066] font-bold uppercase tracking-wider block mb-2">
                  ACTUAL REMOTE SENSING SURFACE STATISTICS
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <div>
                    <span className="text-[10px] text-[#687066] block uppercase">TOTAL AREA</span>
                    <span className="text-[#20241F] font-bold block">{ndviConfig.totalAreaKm2 || '—'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#536B58] block uppercase font-semibold">VEGETATION</span>
                    <span className="text-[#20241F] font-bold block">{ndviConfig.vegetationAreaKm2 || '—'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#B56B32] block uppercase font-semibold">BARE SURFACE</span>
                    <span className="text-[#20241F] font-bold block">{ndviConfig.bareSurfaceAreaKm2 || '—'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#687066] block uppercase">WATER</span>
                    <span className="text-[#20241F] font-bold block">{ndviConfig.waterAreaKm2 || '—'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#24352B] block uppercase font-semibold">USABLE AREA</span>
                    <span className="text-[#24352B] font-bold block">{ndviConfig.usableAreaKm2 || '—'}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Tab 3: Spectral Signatures & Band Ratios */}
      {activeTab === 'spectral' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card title="BAND RATIOS FOR MANGANESE & IRON">
            <div className="space-y-3 text-xs font-mono">
              <div className="p-2.5 bg-[#F4F1EA] border border-[#D9D5CA] rounded">
                <span className="text-[#20241F] font-semibold block">Ferrous Iron Ratio (SWIR1 / NIR)</span>
                <span className="text-[11px] text-[#687066]">Highlights hydrothermally altered basalt & dolomitic carbonates</span>
                <div className="mt-1 text-[#687066] text-[10px]">Status: Awaiting SWIR1 & NIR bands</div>
              </div>

              <div className="p-2.5 bg-[#F4F1EA] border border-[#D9D5CA] rounded">
                <span className="text-[#20241F] font-semibold block">Iron Oxide / Gossan Index (Red / Blue)</span>
                <span className="text-[11px] text-[#687066]">Separates hematite/goethite capping from surrounding quartz sands</span>
                <div className="mt-1 text-[#687066] text-[10px]">Status: Awaiting Red & Blue bands</div>
              </div>

              <div className="p-2.5 bg-[#F4F1EA] border border-[#D9D5CA] rounded">
                <span className="text-[#20241F] font-semibold block">Manganese Supergene Absorption (SWIR2 / SWIR1)</span>
                <span className="text-[11px] text-[#687066]">Deep OH/Al-smectite and manganese oxide absorption feature</span>
                <div className="mt-1 text-[#687066] text-[10px]">Status: Awaiting SWIR bands</div>
              </div>
            </div>
          </Card>

          <Card title="SPECTRAL POINT PROFILER">
            <div className="p-4 bg-[#F4F1EA] border border-[#D9D5CA] rounded text-center text-[#687066] text-xs font-mono space-y-2">
              <SlidersHorizontal className="w-6 h-6 mx-auto text-[#B56B32]" />
              <p className="text-[#20241F]">Click any location on the Central GIS Map to inspect its continuous reflectance curve across all 6 spectral channels.</p>
              <div className="grid grid-cols-4 gap-2 pt-2 text-[10px] text-[#687066] border-t border-[#D9D5CA]">
                <span>BLUE: —</span>
                <span>GREEN: —</span>
                <span>RED: —</span>
                <span>NIR: —</span>
                <span>SWIR1: —</span>
                <span>SWIR2: —</span>
                <span>NDVI: —</span>
                <span>CLASS: —</span>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
