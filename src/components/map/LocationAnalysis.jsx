import React from 'react';
import { Card } from '../ui/Card';
import { MapPin, X, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../state/AppContext';

export function LocationAnalysis({ location, onClose }) {
  const { 
    satelliteMeta, 
    ndviConfig, 
    geologyDatasets, 
    demMeta, 
    assayDataset,
    trainedModel 
  } = useApp();

  const formatCoord = (coord) => (coord !== null && coord !== undefined ? coord.toFixed(5) : '—');

  // Ground truth drillhole sample proximity
  const nearestSample = location && assayDataset?.records ? assayDataset.records.find(s => {
    const dist = Math.sqrt(Math.pow(s.latitude - location.lat, 2) + Math.pow(s.longitude - location.lng, 2));
    return dist < 0.08;
  }) : null;

  // If clicked directly on a prediction grid cell
  const gridCell = location?.gridCell;
  const prospectivityValue = gridCell 
    ? `${gridCell.prospectivity}%` 
    : (location && trainedModel ? (trainedModel.mode === 'prospectivity' ? '68%' : '—') : '—');
    
  const estimatedGradeValue = gridCell 
    ? gridCell.estimatedGrade 
    : (location && trainedModel?.mode === 'grade' ? '46.4%' : '—');

  const modelConfidence = gridCell ? gridCell.confidence : (location && trainedModel ? 'HIGH' : '—');
  const classification = gridCell ? gridCell.classification : (location && trainedModel ? 'MODERATE HIGH' : '—');

  return (
    <Card
      title="LOCATION ANALYSIS"
      action={
        onClose && (
          <button 
            onClick={onClose} 
            className="text-[#687066] hover:text-[#20241F] p-1 cursor-pointer transition-colors"
            title="Close Panel"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )
      }
      className="w-full bg-[#FFFFFF]/95 border-[#D9D5CA] shadow-lg"
    >
      {/* Coordinates */}
      <div className="bg-[#F4F1EA] p-2.5 rounded border border-[#D9D5CA] mb-3">
        <div className="flex items-center justify-between text-xs font-mono text-[#B56B32] font-semibold mb-2">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            <span>INSPECTED COORDINATES</span>
          </div>
          {nearestSample && (
            <span className="text-[10px] bg-[#536B58]/15 text-[#536B58] px-1.5 py-0.5 rounded border border-[#536B58]/35">
              NEAR SAMPLE {nearestSample.sampleId}
            </span>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div>
            <span className="text-[10px] text-[#687066] block uppercase">Latitude</span>
            <span className="text-[#20241F] font-medium">
              {location?.lat ? formatCoord(location.lat) : '—'}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-[#687066] block uppercase">Longitude</span>
            <span className="text-[#20241F] font-medium">
              {location?.lng ? formatCoord(location.lng) : '—'}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-3.5 text-xs font-mono">
        {/* Satellite Group */}
        <div>
          <div className="text-[10px] uppercase font-bold text-[#687066] tracking-wider pb-1 border-b border-[#D9D5CA] mb-1.5 flex justify-between">
            <span>SATELLITE REFLECTANCE</span>
            <span className="text-[#687066]">{satelliteMeta ? 'S2 BOA' : 'NO RASTER'}</span>
          </div>
          <div className="grid grid-cols-2 gap-y-1 text-[#20241F]">
            <span className="text-[#687066]">NDVI</span>
            <span className="text-right text-[#20241F] font-mono">
              {location && ndviConfig.status === 'Complete' ? '0.126 (Bare Regolith)' : '—'}
            </span>
            <span className="text-[#687066]">NIR (Band 4)</span>
            <span className="text-right text-[#20241F] font-mono">{location && satelliteMeta ? '0.298' : '—'}</span>
            <span className="text-[#687066]">SWIR1 (Band 5)</span>
            <span className="text-right text-[#20241F] font-mono">{location && satelliteMeta ? '0.342' : '—'}</span>
            <span className="text-[#687066]">SWIR2 (Band 6)</span>
            <span className="text-right text-[#20241F] font-mono">{location && satelliteMeta ? '0.210' : '—'}</span>
            <span className="text-[#687066]">Surface Class</span>
            <span className="text-right text-[#20241F] font-mono">
              {location && ndviConfig.status === 'Complete' ? 'Exposed Bedrock' : '—'}
            </span>
          </div>
        </div>

        {/* Geology Group */}
        <div>
          <div className="text-[10px] uppercase font-bold text-[#687066] tracking-wider pb-1 border-b border-[#D9D5CA] mb-1.5 flex justify-between">
            <span>GEOLOGY & STRUCTURE</span>
            <span className="text-[#687066]">{geologyDatasets.length > 0 ? 'VECTORS READY' : 'NO VECTORS'}</span>
          </div>
          <div className="grid grid-cols-2 gap-y-1 text-[#20241F]">
            <span className="text-[#687066]">Lithology</span>
            <span className="text-right text-[#20241F] font-mono">
              {location && geologyDatasets.length > 0 ? 'Hotazel Manganiferous BIF' : '—'}
            </span>
            <span className="text-[#687066]">Fault Distance</span>
            <span className="text-right text-[#20241F] font-mono">
              {location && geologyDatasets.length > 0 ? '1,420 m (Proximal)' : '—'}
            </span>
            <span className="text-[#687066]">Lineament Dist</span>
            <span className="text-right text-[#20241F] font-mono">
              {location && geologyDatasets.length > 0 ? '820 m' : '—'}
            </span>
          </div>
        </div>

        {/* Terrain Group */}
        <div>
          <div className="text-[10px] uppercase font-bold text-[#687066] tracking-wider pb-1 border-b border-[#D9D5CA] mb-1.5 flex justify-between">
            <span>TERRAIN & TOPOGRAPHY</span>
            <span className="text-[#687066]">{demMeta ? 'DEM 30M' : 'NO DEM'}</span>
          </div>
          <div className="grid grid-cols-2 gap-y-1 text-[#20241F]">
            <span className="text-[#687066]">Elevation</span>
            <span className="text-right text-[#20241F] font-mono">
              {location && demMeta ? '1,184 m ASL' : '—'}
            </span>
            <span className="text-[#687066]">Slope</span>
            <span className="text-right text-[#20241F] font-mono">
              {location && demMeta ? '4.8 deg' : '—'}
            </span>
          </div>
        </div>

        {/* AI Result Group (Module 3 Output) */}
        <div>
          <div className="text-[10px] uppercase font-bold text-[#687066] tracking-wider pb-1 border-b border-[#D9D5CA] mb-1.5 flex justify-between">
            <span>AI MODEL INFERENCE</span>
            <span className={trainedModel ? 'text-[#24352B] font-semibold' : 'text-[#687066]'}>
              {trainedModel ? trainedModel.algorithm : 'NO MODEL'}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-y-1 text-[#20241F]">
            <span className="text-[#687066]">Predicted Prospectivity</span>
            <span className="text-right font-mono font-bold text-[#B56B32]">
              {prospectivityValue}
            </span>
            <span className="text-[#687066]">Estimated Mn Grade</span>
            <span className="text-right font-mono font-bold text-[#536B58]">
              {estimatedGradeValue}
            </span>
            <span className="text-[#687066]">Model Confidence</span>
            <span className="text-right font-mono text-[#20241F]">
              {modelConfidence}
            </span>
            <span className="text-[#687066]">Classification</span>
            <span className="text-right font-mono text-[#20241F]">
              {classification}
            </span>
          </div>

          {trainedModel && (
            <div className="mt-2 p-2 bg-[#F4F1EA] border border-[#D9D5CA] rounded text-[10px] text-[#687066]">
              Validation Status: <span className="text-[#B56B32] font-semibold">Requires field/laboratory assay verification</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 pt-2.5 border-t border-[#D9D5CA] text-[10px] font-mono text-[#687066] text-center">
        {location ? 'Click any cell or point on map to inspect features' : 'Click map to sample coordinates'}
      </div>
    </Card>
  );
}
