import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { useApp } from '../../state/AppContext';
import { Satellite, CheckCircle, AlertTriangle, Layers } from 'lucide-react';

const BAND_OPTIONS = [
  'Select',
  'Blue',
  'Green',
  'Red',
  'NIR',
  'SWIR1',
  'SWIR2',
  'Red Edge',
  'Thermal',
  'Other',
];

export function SatelliteUpload() {
  const { 
    satelliteMeta, 
    setSatelliteMeta, 
    bandMapping, 
    setBandMapping, 
    setDataStatus,
    addProvenance 
  } = useApp();

  const [simulating, setSimulating] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Simulate reading raster header
    const mockMeta = {
      filename: file.name,
      acquisitionDate: '2024-05-18 (Sentinel-2 L2A)',
      crs: 'WGS84 / UTM Zone 34S (EPSG:32734)',
      resolution: '10m / 20m pixel GSD',
      bandCount: 6,
      coverage: '100% of defined Study Area',
      fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      validationStatus: 'VALIDATING',
    };

    setSatelliteMeta(mockMeta);
    setSimulating(true);

    setTimeout(() => {
      setSatelliteMeta((prev) => ({
        ...prev,
        validationStatus: 'READY',
      }));
      setDataStatus((prev) => ({ ...prev, satellite: 'READY' }));
      addProvenance({
        datasetName: file.name,
        fileType: 'GeoTIFF / COG Multispectral Raster',
        crs: 'EPSG:32734',
        coverage: 'Kalahari Basin Focus (100%)',
        validationStatus: 'READY',
        processingStatus: 'Ingested (Raw)',
      });
      setSimulating(false);
    }, 1200);
  };

  const handleLoadSample = () => {
    setSimulating(true);
    setTimeout(() => {
      const sample = {
        filename: 'S2B_MSIL2A_20240518_Kalahari_Bands.tif',
        acquisitionDate: '2024-05-18T08:16:09Z',
        crs: 'WGS84 / UTM Zone 34S (EPSG:32734)',
        resolution: '10m GSD',
        bandCount: 6,
        coverage: 'Full Kalahari Manganese Basin (100%)',
        fileSize: '142.8 MB',
        validationStatus: 'READY',
      };
      setSatelliteMeta(sample);
      setDataStatus((prev) => ({ ...prev, satellite: 'READY' }));
      addProvenance({
        datasetName: sample.filename,
        fileType: 'GeoTIFF Multispectral Surface Reflectance',
        crs: sample.crs,
        coverage: sample.coverage,
        validationStatus: 'READY',
        processingStatus: 'Ingested (Ready)',
      });
      setSimulating(false);
    }, 800);
  };

  const handleBandChange = (bandKey, value) => {
    setBandMapping((prev) => ({
      ...prev,
      [bandKey]: value,
    }));
  };

  const hasRed = Object.values(bandMapping).includes('Red');
  const hasNIR = Object.values(bandMapping).includes('NIR');
  const isNdviReady = hasRed && hasNIR;

  return (
    <Card 
      title="SATELLITE DATA INGESTION" 
      badge={
        satelliteMeta 
          ? <Badge status={satelliteMeta.validationStatus}>{satelliteMeta.validationStatus}</Badge>
          : <Badge status="NOT UPLOADED">NOT UPLOADED</Badge>
      }
    >
      <div className="space-y-4 text-xs font-mono">
        {/* Upload Button Strip */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-[#F4F1EA] border border-[#D9D5CA] rounded">
          <div className="flex items-center gap-2">
            <Satellite className="w-5 h-5 text-[#B56B32]" />
            <div>
              <span className="text-[#20241F] font-semibold block">Multispectral Raster File</span>
              <span className="text-[11px] text-[#687066]">Supported formats: GeoTIFF (.tif, .tiff), Cloud Optimized GeoTIFF (COG)</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="px-3 py-1.5 bg-[#24352B] hover:bg-[#2e4335] text-white border border-[#24352B] rounded cursor-pointer transition-colors shadow-sm font-semibold">
              <span>{simulating ? 'PARSING...' : 'CHOOSE GEOTIFF'}</span>
              <input 
                type="file" 
                accept=".tif,.tiff,.cog" 
                onChange={handleFileUpload} 
                className="hidden" 
                disabled={simulating}
              />
            </label>
            <button
              onClick={handleLoadSample}
              disabled={simulating}
              className="px-3 py-1.5 bg-[#FFFFFF] hover:bg-[#F4F1EA] text-[#20241F] border border-[#D9D5CA] rounded cursor-pointer transition-colors font-medium shadow-sm"
            >
              LOAD SAMPLE S2
            </button>
          </div>
        </div>

        {/* Raster Header Information */}
        {satelliteMeta && (
          <div className="bg-[#F4F1EA] border border-[#D9D5CA] rounded p-3">
            <span className="text-[10px] text-[#687066] font-bold uppercase tracking-wider block mb-2">
              RASTER HEADER METADATA
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <span className="text-[10px] text-[#687066] block uppercase">Filename</span>
                <span className="text-[#20241F] font-medium truncate block">{satelliteMeta.filename}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#687066] block uppercase">Acquisition</span>
                <span className="text-[#20241F] font-medium truncate block">{satelliteMeta.acquisitionDate}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#687066] block uppercase">CRS</span>
                <span className="text-[#20241F] font-medium truncate block">{satelliteMeta.crs}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#687066] block uppercase">Resolution</span>
                <span className="text-[#20241F] font-medium truncate block">{satelliteMeta.resolution}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#687066] block uppercase">Bands</span>
                <span className="text-[#20241F] font-medium truncate block">{satelliteMeta.bandCount} Channels</span>
              </div>
              <div>
                <span className="text-[10px] text-[#687066] block uppercase">Coverage</span>
                <span className="text-[#20241F] font-medium truncate block">{satelliteMeta.coverage}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#687066] block uppercase">File Size</span>
                <span className="text-[#20241F] font-medium truncate block">{satelliteMeta.fileSize}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#687066] block uppercase">Status</span>
                <Badge status={satelliteMeta.validationStatus}>{satelliteMeta.validationStatus}</Badge>
              </div>
            </div>
          </div>
        )}

        {/* Band Mapping Section */}
        <div className="bg-[#F4F1EA] border border-[#D9D5CA] rounded p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-[#687066] font-bold uppercase tracking-wider">
              BAND MAPPING ARCHITECTURE (SYSTEM MEANING)
            </span>
            <div className="flex items-center gap-2">
              {isNdviReady ? (
                <span className="inline-flex items-center gap-1 text-[10px] text-[#536B58] bg-[#536B58]/15 px-2 py-0.5 rounded border border-[#536B58]/35 font-semibold">
                  <CheckCircle className="w-3 h-3" /> NDVI VALIDATED (RED + NIR)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[10px] text-[#B56B32] bg-[#B56B32]/15 px-2 py-0.5 rounded border border-[#B56B32]/40 font-semibold">
                  <AlertTriangle className="w-3 h-3" /> NDVI BLOCKED (REQUIRES RED & NIR)
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {[1, 2, 3, 4, 5, 6].map((bandNum) => {
              const bandKey = `band${bandNum}`;
              return (
                <div key={bandKey} className="bg-[#FFFFFF] p-2 rounded border border-[#D9D5CA] shadow-sm">
                  <span className="text-[10px] text-[#687066] block uppercase font-semibold mb-1">
                    Band {bandNum}
                  </span>
                  <select
                    value={bandMapping[bandKey] || 'Select'}
                    onChange={(e) => handleBandChange(bandKey, e.target.value)}
                    className="w-full bg-[#FFFFFF] border border-[#D9D5CA] rounded px-1.5 py-1 text-[#20241F] font-mono text-xs focus:outline-none focus:border-[#536B58] cursor-pointer"
                  >
                    {BAND_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
}
