import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { useApp } from '../../state/AppContext';
import { Mountain, CheckCircle2, AlertTriangle, Upload } from 'lucide-react';

export function TerrainUpload() {
  const { demMeta, setDemMeta, setDataStatus, addProvenance } = useApp();
  const [simulating, setSimulating] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSimulating(true);
    setTimeout(() => {
      const meta = {
        filename: file.name,
        source: 'SRTM 30m 1-ArcSecond DEM GeoTIFF',
        crs: 'WGS84 / EGM96 Geoid (EPSG:4326)',
        resolution: '30m pixel spatial resolution',
        minElevation: '1,012 m ASL',
        maxElevation: '1,684 m ASL',
        meanSlope: '6.4 deg (Flat to gently undulating plateaus)',
        fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        status: 'READY',
      };
      setDemMeta(meta);
      setDataStatus((prev) => ({ ...prev, terrain: 'READY' }));
      addProvenance({
        datasetName: file.name,
        fileType: 'GeoTIFF Elevation Model (DEM)',
        crs: meta.crs,
        coverage: 'Elevation (1012m - 1684m ASL) & Slope Gradient',
        validationStatus: 'READY',
        processingStatus: 'Terrain Features Derived',
      });
      setSimulating(false);
    }, 1000);
  };

  const handleLoadSampleDEM = () => {
    setSimulating(true);
    setTimeout(() => {
      const meta = {
        filename: 'Kalahari_SRTM_DEM_30m.tif',
        source: 'Copernicus 30m Global DEM',
        crs: 'WGS84 (EPSG:4326)',
        resolution: '30m GSD',
        minElevation: '1,012 m',
        maxElevation: '1,684 m',
        meanSlope: '6.4 deg',
        fileSize: '48.2 MB',
        status: 'READY',
      };
      setDemMeta(meta);
      setDataStatus((prev) => ({ ...prev, terrain: 'READY' }));
      addProvenance({
        datasetName: meta.filename,
        fileType: 'GeoTIFF Digital Elevation Model',
        crs: meta.crs,
        coverage: 'Kalahari Basin Topographic Relief',
        validationStatus: 'READY',
        processingStatus: 'Elevation & Slope Ready',
      });
      setSimulating(false);
    }, 700);
  };

  return (
    <Card 
      title="TERRAIN & DIGITAL ELEVATION MODEL (DEM)"
      badge={
        demMeta 
          ? <Badge status={demMeta.status}>{demMeta.status}</Badge>
          : <Badge status="NOT UPLOADED">NOT UPLOADED</Badge>
      }
    >
      <div className="space-y-4 text-xs font-mono">
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#F4F1EA] border border-[#D9D5CA] rounded">
          <div className="flex items-center gap-2">
            <Mountain className="w-5 h-5 text-[#B56B32]" />
            <div>
              <span className="text-[#20241F] font-semibold block">Elevation Raster (GeoTIFF)</span>
              <span className="text-[11px] text-[#687066]">SRTM 30m, Copernicus DEM, or ALOS PALSAR high-resolution elevation</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="px-3 py-1.5 bg-[#24352B] hover:bg-[#2e4335] text-white border border-[#24352B] rounded cursor-pointer transition-colors shadow-sm font-semibold">
              <span>{simulating ? 'PROCESSING...' : 'UPLOAD DEM RASTER'}</span>
              <input
                type="file"
                accept=".tif,.tiff"
                onChange={handleFileUpload}
                className="hidden"
                disabled={simulating}
              />
            </label>
            <button
              onClick={handleLoadSampleDEM}
              disabled={simulating}
              className="px-3 py-1.5 bg-[#FFFFFF] hover:bg-[#F4F1EA] text-[#20241F] border border-[#D9D5CA] rounded cursor-pointer transition-colors font-medium shadow-sm"
            >
              LOAD SAMPLE DEM
            </button>
          </div>
        </div>

        {demMeta ? (
          <div className="bg-[#F4F1EA] border border-[#D9D5CA] rounded p-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <span className="text-[10px] text-[#687066] block uppercase">Raster Source</span>
                <span className="text-[#20241F] font-semibold truncate block">{demMeta.source}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#687066] block uppercase">CRS</span>
                <span className="text-[#20241F] font-semibold truncate block">{demMeta.crs}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#687066] block uppercase">Elevation Range</span>
                <span className="text-[#536B58] font-semibold block">{demMeta.minElevation} — {demMeta.maxElevation}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#687066] block uppercase">Mean Slope</span>
                <span className="text-[#B56B32] font-semibold block">{demMeta.meanSlope}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-3 bg-[#F4F1EA]/50 border border-dashed border-[#D9D5CA] rounded text-[#687066] text-[11px] text-center">
            TERRAIN DATA NOT AVAILABLE — Upload a DEM to enable slope angle and topographic curvature extraction for AI prospectivity.
          </div>
        )}
      </div>
    </Card>
  );
}
