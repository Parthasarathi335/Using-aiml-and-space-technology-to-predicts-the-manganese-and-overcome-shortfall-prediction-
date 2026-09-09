import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useApp } from '../state/AppContext';
import { 
  FileText, 
  Download, 
  Printer, 
  ShieldAlert, 
  CheckCircle2, 
  Globe, 
  Layers, 
  Cpu, 
  TrendingDown, 
  Copy
} from 'lucide-react';

export function Reports() {
  const { 
    studyArea,
    satelliteMeta,
    geologyDatasets,
    demMeta,
    assayDataset,
    trainedModel,
    predictionGrid,
    supplyDemandDataset,
    forecastResults,
    provenanceLedger,
    demoMode
  } = useApp();

  const [copied, setCopied] = useState(false);

  const generateReportJSON = () => {
    const reportData = {
      project: {
        title: 'MANGANESE AI INTELLIGENCE — EXECUTIVE INTELLIGENCE BRIEFING',
        studyArea: studyArea.name,
        bounds: studyArea.bounds,
        exportDate: new Date().toISOString(),
        demoMode,
      },
      datasets: {
        satellite: satelliteMeta,
        geologicalVectorCount: geologyDatasets.length,
        assayDrillholeCount: assayDataset?.records?.length || 0,
        dem: demMeta,
        supplyDemandYears: supplyDemandDataset?.records?.length || 0,
      },
      model: trainedModel ? {
        algorithm: trainedModel.algorithm,
        mode: trainedModel.mode,
        metrics: trainedModel.metrics,
        featureImportance: trainedModel.featureImportance,
      } : 'UNINITIALIZED',
      spatialProspectivity: {
        gridCellCount: predictionGrid.length,
        highPotentialTiles: predictionGrid.filter(c => c.prospectivity >= 70).length,
      },
      supplyRisk: forecastResults ? {
        horizonYears: forecastResults.horizonYears,
        target2030: forecastResults.target2030,
      } : 'UNCOMPUTED',
      provenanceLedger,
      disclaimers: {
        prospectivity: 'AI-generated prospectivity is an analytical prediction based on the supplied datasets and model configuration. It does not constitute confirmation of mineralization, mineral reserves, or economic viability. Field investigation and laboratory validation are required.',
        grade: 'AI-estimated manganese grade requires field and laboratory validation and should not be treated as a substitute for laboratory assay results.',
      },
    };
    return JSON.stringify(reportData, null, 2);
  };

  const handleDownloadJSON = () => {
    const jsonStr = generateReportJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Manganese_AI_Intelligence_Report_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadCSV = () => {
    if (!predictionGrid || predictionGrid.length === 0) {
      alert('No prospectivity grid generated yet. Train an AI model first.');
      return;
    }
    const headers = ['Cell_ID', 'Center_Lat', 'Center_Lon', 'Prospectivity_Pct', 'Estimated_Mn_Grade', 'Confidence', 'Classification'];
    const rows = predictionGrid.map(c => [
      c.id,
      c.center[0].toFixed(5),
      c.center[1].toFixed(5),
      c.prospectivity,
      c.estimatedGrade,
      c.confidence,
      c.classification,
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Manganese_Prospectivity_Grid_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-4 space-y-4 max-w-5xl mx-auto">
      {/* Action Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#D9D5CA] pb-3">
        <div>
          <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-[#20241F] flex items-center gap-2">
            <span>SCIENTIFIC & EXECUTIVE INTELLIGENCE REPORT</span>
            <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-[#536B58]/10 text-[#536B58] border border-[#536B58]/30 font-semibold">
              MODULE 4
            </span>
          </h2>
          <p className="text-xs font-mono text-[#687066] mt-0.5">
            Comprehensive multi-disciplinary compilation across Earth Observation, structural geology, ML prospectivity, and supply security
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            onClick={handleDownloadCSV}
            className="px-3 py-1.5 bg-[#FFFFFF] hover:bg-[#F4F1EA] text-[#20241F] border border-[#D9D5CA] rounded cursor-pointer transition-colors flex items-center gap-1.5 shadow-sm font-medium"
            title="Download Prospectivity Grid CSV"
          >
            <Download className="w-3.5 h-3.5 text-[#B56B32]" />
            <span>EXPORT CSV</span>
          </button>
          <button
            onClick={handleDownloadJSON}
            className="px-3 py-1.5 bg-[#FFFFFF] hover:bg-[#F4F1EA] text-[#20241F] border border-[#D9D5CA] rounded cursor-pointer transition-colors flex items-center gap-1.5 shadow-sm font-medium"
            title="Download Full Analysis JSON"
          >
            <Download className="w-3.5 h-3.5 text-[#536B58]" />
            <span>EXPORT JSON</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-3 py-1.5 bg-[#24352B] hover:bg-[#2e4335] text-white border border-[#24352B] rounded cursor-pointer transition-colors flex items-center gap-1.5 font-semibold shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>PRINT / SAVE PDF</span>
          </button>
        </div>
      </div>

      {/* Main Report Document Container (Print styled) */}
      <div className="bg-[#FFFFFF] border border-[#D9D5CA] rounded p-6 shadow-sm space-y-6 font-mono text-xs text-[#20241F]">
        {/* Document Header */}
        <div className="border-b border-[#D9D5CA] pb-4 flex justify-between items-start">
          <div>
            <div className="text-[10px] text-[#B56B32] uppercase tracking-widest font-bold">
              EARTH OBSERVATION & GEOLOGICAL INTELLIGENCE PLATFORM
            </div>
            <h1 className="text-lg font-bold text-[#20241F] mt-1">
              MANGANESE PROSPECTIVITY & GLOBAL SUPPLY RISK ASSESSMENT
            </h1>
            <p className="text-[#687066] text-[11px] mt-0.5">
              Target Concession: {studyArea.name} • Report Compiled: {new Date().toLocaleString()}
            </p>
          </div>
          {demoMode && (
            <span className="px-2 py-1 bg-[#B56B32]/10 text-[#B56B32] border border-[#B56B32]/30 rounded text-[10px] font-bold uppercase">
              DEMO MODE — SIMULATED DATA
            </span>
          )}
        </div>

        {/* Section 1: Project Metadata */}
        <div>
          <h2 className="text-xs font-bold text-[#20241F] uppercase tracking-wider pb-1.5 border-b border-[#D9D5CA] mb-2 flex items-center gap-2">
            <span>1. PROJECT SPECIFICATIONS & BOUNDARY DEFINITIONS</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#F4F1EA] p-3 rounded border border-[#D9D5CA]">
            <div>
              <span className="text-[10px] text-[#687066] block uppercase">Study Area</span>
              <span className="text-[#20241F] font-bold block">{studyArea.name}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#687066] block uppercase">CRS Coordinate System</span>
              <span className="text-[#20241F] font-bold block">WGS84 / EPSG:4326</span>
            </div>
            <div>
              <span className="text-[10px] text-[#687066] block uppercase">Spatial Extent</span>
              <span className="text-[#20241F] block truncate">{studyArea.bounds.minLon}°E–{studyArea.bounds.maxLon}°E, {studyArea.bounds.minLat}°S–{studyArea.bounds.maxLat}°S</span>
            </div>
            <div>
              <span className="text-[10px] text-[#687066] block uppercase">Analysis Platform</span>
              <span className="text-[#536B58] font-bold block">Manganese AI v1.0</span>
            </div>
          </div>
        </div>

        {/* Section 2: Ingested Datasets */}
        <div>
          <h2 className="text-xs font-bold text-[#20241F] uppercase tracking-wider pb-1.5 border-b border-[#D9D5CA] mb-2">
            2. INGESTED DATA INVENTORY
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-2.5 bg-[#F4F1EA] border border-[#D9D5CA] rounded">
              <span className="text-[10px] text-[#687066] block uppercase">Multispectral Satellite</span>
              <span className="text-[#20241F] font-semibold block">{satelliteMeta ? satelliteMeta.filename : 'Not Uploaded'}</span>
              <span className="text-[10px] text-[#687066]">{satelliteMeta ? `${satelliteMeta.bandCount} Bands (10m GSD)` : '—'}</span>
            </div>
            <div className="p-2.5 bg-[#F4F1EA] border border-[#D9D5CA] rounded">
              <span className="text-[10px] text-[#687066] block uppercase">Geological Vectors</span>
              <span className="text-[#20241F] font-semibold block">{geologyDatasets.length} Vector Layers</span>
              <span className="text-[10px] text-[#687066]">{geologyDatasets.map(d => d.category).join(', ') || 'None'}</span>
            </div>
            <div className="p-2.5 bg-[#F4F1EA] border border-[#D9D5CA] rounded">
              <span className="text-[10px] text-[#687066] block uppercase">Ground Truth Drillholes</span>
              <span className="text-[#20241F] font-semibold block">{assayDataset?.records?.length || 0} Geocoded Assays</span>
              <span className="text-[10px] text-[#687066]">{assayDataset ? 'Validated & Audited' : '—'}</span>
            </div>
            <div className="p-2.5 bg-[#F4F1EA] border border-[#D9D5CA] rounded">
              <span className="text-[10px] text-[#687066] block uppercase">Terrain & DEM</span>
              <span className="text-[#20241F] font-semibold block">{demMeta ? demMeta.source : 'Not Uploaded'}</span>
              <span className="text-[10px] text-[#687066]">{demMeta ? `${demMeta.minElevation} - ${demMeta.maxElevation}` : '—'}</span>
            </div>
          </div>
        </div>

        {/* Section 3: AI / ML Prospectivity Assessment */}
        <div>
          <h2 className="text-xs font-bold text-[#20241F] uppercase tracking-wider pb-1.5 border-b border-[#D9D5CA] mb-2">
            3. AI / ML PROSPECTIVITY MODEL & INFERENCE
          </h2>
          {trainedModel ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#F4F1EA] p-3 rounded border border-[#D9D5CA]">
                <div>
                  <span className="text-[10px] text-[#687066] block uppercase">Trained Algorithm</span>
                  <span className="text-[#20241F] font-bold block">{trainedModel.algorithm}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#687066] block uppercase">Model Mode</span>
                  <span className="text-[#B56B32] font-bold block uppercase">{trainedModel.mode}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#687066] block uppercase">Validation Score</span>
                  <span className="text-[#536B58] font-bold block">
                    {trainedModel.metrics.accuracy ? `${(trainedModel.metrics.accuracy * 100).toFixed(1)}% Accuracy` : `${trainedModel.metrics.r2} R²`}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#687066] block uppercase">High-Prospectivity Cells</span>
                  <span className="text-[#B56B32] font-bold block">
                    {predictionGrid.filter(c => c.prospectivity >= 70).length} Cells (≥70%)
                  </span>
                </div>
              </div>

              {/* Feature Importance Summary */}
              <div className="p-3 bg-[#F4F1EA] border border-[#D9D5CA] rounded">
                <span className="text-[10px] text-[#687066] uppercase font-bold block mb-1">
                  Primary Predictive Covariates (Gini Importance)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                  {trainedModel.featureImportance.slice(0, 4).map(f => (
                    <div key={f.feature} className="flex justify-between py-0.5">
                      <span className="text-[#687066]">{f.feature}:</span>
                      <span className="text-[#536B58] font-bold">{(f.score * 100).toFixed(1)}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-[#F4F1EA]/50 border border-dashed border-[#D9D5CA] rounded text-[#687066] text-center">
              No AI model trained. Train a model in the Prediction section to include evaluation metrics and prospectivity distributions.
            </div>
          )}
        </div>

        {/* Section 4: Supply Security & Econometric Shortfall */}
        <div>
          <h2 className="text-xs font-bold text-[#20241F] uppercase tracking-wider pb-1.5 border-b border-[#D9D5CA] mb-2">
            4. GLOBAL SUPPLY / DEMAND HORIZON & SHORTFALL DEFICIT
          </h2>
          {forecastResults ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#F4F1EA] p-3 rounded border border-[#D9D5CA]">
              <div>
                <span className="text-[10px] text-[#687066] block uppercase">Projection Horizon</span>
                <span className="text-[#20241F] font-bold block">{forecastResults.horizonYears} Years ({forecastResults.startYear}–{forecastResults.endYear})</span>
              </div>
              <div>
                <span className="text-[10px] text-[#687066] block uppercase">2030 Baseline Demand</span>
                <span className="text-[#20241F] font-bold block">{forecastResults.target2030?.demand.toLocaleString()} kt</span>
              </div>
              <div>
                <span className="text-[10px] text-[#687066] block uppercase">2030 Available Supply</span>
                <span className="text-[#536B58] font-bold block">{forecastResults.target2030?.supply.toLocaleString()} kt</span>
              </div>
              <div>
                <span className="text-[10px] text-[#687066] block uppercase">2030 Structural Balance</span>
                <span className={`font-bold block ${forecastResults.target2030?.balance >= 0 ? 'text-[#24352B]' : 'text-rose-700'}`}>
                  {forecastResults.target2030?.balance >= 0 ? `+${forecastResults.target2030?.balance.toLocaleString()} kt` : `${forecastResults.target2030?.balance.toLocaleString()} kt (DEFICIT)`}
                </span>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-[#F4F1EA]/50 border border-dashed border-[#D9D5CA] rounded text-[#687066] text-center">
              No econometric forecast generated. Run shortfall simulations in Shortfall Forecast.
            </div>
          )}
        </div>

        {/* Section 5: Audited Provenance Ledger */}
        <div>
          <h2 className="text-xs font-bold text-[#20241F] uppercase tracking-wider pb-1.5 border-b border-[#D9D5CA] mb-2">
            5. SCIENTIFIC DATA PROVENANCE & AUDIT TRAIL
          </h2>
          <div className="overflow-x-auto border border-[#D9D5CA] rounded bg-[#FFFFFF]">
            <table className="w-full text-left text-[10px]">
              <thead className="bg-[#F4F1EA] text-[#687066] uppercase font-semibold border-b border-[#D9D5CA]">
                <tr>
                  <th className="py-1.5 px-2.5">Dataset / Activity</th>
                  <th className="py-1.5 px-2.5">Type</th>
                  <th className="py-1.5 px-2.5">Timestamp</th>
                  <th className="py-1.5 px-2.5">CRS</th>
                  <th className="py-1.5 px-2.5">Validation State</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D9D5CA] text-[#20241F]">
                {provenanceLedger.map((item) => (
                  <tr key={item.id} className="hover:bg-[#F4F1EA]/60">
                    <td className="py-1 px-2.5 font-semibold text-[#20241F]">{item.datasetName}</td>
                    <td className="py-1 px-2.5 text-[#687066]">{item.fileType}</td>
                    <td className="py-1 px-2.5 text-[#687066]">{item.uploadTime}</td>
                    <td className="py-1 px-2.5 text-[#536B58] font-medium">{item.crs}</td>
                    <td className="py-1 px-2.5">
                      <Badge status={item.validationStatus}>{item.validationStatus}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mandatory Scientific Disclaimers */}
        <div className="p-3 bg-[#F4F1EA] border border-[#D9D5CA] rounded space-y-2 text-[10px] text-[#687066] leading-relaxed">
          <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[#B56B32]">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>MANDATORY SCIENTIFIC & METALLURGICAL DISCLAIMERS</span>
          </div>
          <p>
            • <strong className="text-[#20241F]">Prospectivity Disclaimer:</strong> AI-generated prospectivity is an analytical prediction based on the supplied datasets and model configuration. It does not constitute confirmation of mineralization, mineral reserves, or economic viability. Field investigation and laboratory validation are required.
          </p>
          <p>
            • <strong className="text-[#20241F]">Ore Grade Disclaimer:</strong> AI-estimated manganese grade requires field and laboratory validation and should not be treated as a substitute for laboratory assay results.
          </p>
          <p>
            • <strong className="text-[#20241F]">Econometric Disclaimer:</strong> Econometric supply and shortfall forecasts are simulated projections conditioned on historical USGS/IMnI datasets and user-specified scenario growth parameters.
          </p>
        </div>
      </div>
    </div>
  );
}
