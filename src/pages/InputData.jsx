import React from 'react';
import { SatelliteUpload } from '../components/input/SatelliteUpload';
import { GeologyUpload } from '../components/input/GeologyUpload';
import { AssayDataUpload } from '../components/input/AssayDataUpload';
import { TerrainUpload } from '../components/input/TerrainUpload';
import { StudyAreaConfig } from '../components/input/StudyAreaConfig';
import { DatasetValidationLedger } from '../components/input/DatasetValidationLedger';

export function InputData() {
  return (
    <div className="p-4 space-y-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-[#D9D5CA] pb-3 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-[#20241F] flex items-center gap-2">
            <span>INPUT DATA INGESTION WORKSPACE</span>
            <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-[#536B58]/10 text-[#536B58] border border-[#536B58]/30 font-semibold">
              MODULE 2
            </span>
          </h2>
          <p className="text-xs font-mono text-[#687066] mt-0.5">
            Ingest and validate Earth Observation multispectral rasters, geological vectors, terrain DEMs, and ground truth drillhole assays
          </p>
        </div>
      </div>

      {/* Ingestion Modules Stack */}
      <div className="space-y-4">
        <StudyAreaConfig />
        <SatelliteUpload />
        <GeologyUpload />
        <AssayDataUpload />
        <TerrainUpload />
        <DatasetValidationLedger />
      </div>
    </div>
  );
}
