import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { useApp } from '../../state/AppContext';
import { Mountain, Upload, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { validateGeoJSON } from '../../services/dataValidation';

const GEO_CATEGORIES = [
  'Lithology',
  'Faults',
  'Lineaments',
  'Geological Boundaries',
  'Mineral Occurrences',
  'Other',
];

export function GeologyUpload() {
  const { 
    geologyDatasets, 
    setGeologyDatasets, 
    setDataStatus, 
    addProvenance,
    toggleLayer
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState('Lithology');
  const [dragActive, setDragActive] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target.result;
        const jsonObj = JSON.parse(text);
        const res = validateGeoJSON(jsonObj);

        if (!res.isValid) {
          alert(`Validation Error: ${res.error}`);
          return;
        }

        const newDataset = {
          id: `geo-${Date.now()}`,
          name: file.name,
          category: selectedCategory,
          featureCount: res.featureCount,
          geoJson: jsonObj,
          fileSize: `${(file.size / 1024).toFixed(1)} KB`,
          status: 'READY',
          visibleOnMap: true,
        };

        setGeologyDatasets((prev) => [...prev, newDataset]);
        setDataStatus((prev) => ({ ...prev, geology: 'READY' }));
        addProvenance({
          datasetName: file.name,
          fileType: 'GeoJSON Vector Layer',
          crs: 'WGS84 (EPSG:4326)',
          coverage: `${res.featureCount} Features (${selectedCategory})`,
          validationStatus: 'READY',
          processingStatus: 'Active Vector',
        });
      } catch (err) {
        alert('Could not parse JSON. Please provide a valid GeoJSON vector file.');
      }
    };
    reader.readAsText(file);
  };

  const handleLoadSampleGeology = (category) => {
    // Generate representative geological vector feature for Kalahari basin
    const sampleFeatures = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {
            name: 'Hotazel Formation (Banded Iron Formation & Mn Member)',
            category: 'Lithology',
            age: 'Paleoproterozoic (2.4 Ga)',
            mn_content: 'High grade Mn ore zones',
          },
          geometry: {
            type: 'Polygon',
            coordinates: [[
              [22.8, -27.1],
              [23.1, -27.1],
              [23.2, -27.4],
              [22.8, -27.5],
              [22.8, -27.1],
            ]],
          },
        },
        {
          type: 'Feature',
          properties: {
            name: 'Black Rock Fault / Griqualand West Fault Corridor',
            category: 'Faults',
            dip: '75 deg NW',
          },
          geometry: {
            type: 'LineString',
            coordinates: [
              [22.7, -27.0],
              [23.0, -27.3],
              [23.3, -27.7],
            ],
          },
        },
      ],
    };

    const newDataset = {
      id: `geo-sample-${Date.now()}`,
      name: `Kalahari_${category}_Structural_Vectors.geojson`,
      category: category,
      featureCount: sampleFeatures.features.length,
      geoJson: sampleFeatures,
      fileSize: '18.4 KB',
      status: 'READY',
      visibleOnMap: true,
    };

    setGeologyDatasets((prev) => [...prev, newDataset]);
    setDataStatus((prev) => ({ ...prev, geology: 'READY' }));
    addProvenance({
      datasetName: newDataset.name,
      fileType: 'GeoJSON Structural Vector',
      crs: 'EPSG:4326',
      coverage: 'Hotazel & Griqualand Fault Corridors',
      validationStatus: 'READY',
      processingStatus: 'Active Vector',
    });
  };

  const removeDataset = (id) => {
    setGeologyDatasets((prev) => {
      const filtered = prev.filter((d) => d.id !== id);
      if (filtered.length === 0) {
        setDataStatus((s) => ({ ...s, geology: 'NOT UPLOADED' }));
      }
      return filtered;
    });
  };

  return (
    <Card 
      title="GEOLOGICAL & STRUCTURAL VECTOR INGESTION"
      badge={
        geologyDatasets.length > 0
          ? <Badge status="READY">{geologyDatasets.length} LAYERS READY</Badge>
          : <Badge status="NOT UPLOADED">NOT UPLOADED</Badge>
      }
    >
      <div className="space-y-4 text-xs font-mono">
        {/* Upload bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#F4F1EA] border border-[#D9D5CA] rounded">
          <div className="flex items-center gap-2">
            <Mountain className="w-5 h-5 text-[#B56B32]" />
            <div>
              <span className="text-[#20241F] font-semibold block">Geological Vector Layers</span>
              <span className="text-[11px] text-[#687066]">Supported: GeoJSON, Shapefile ZIP, GeoPackage (.gpkg), CSV lat/lon</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-[#FFFFFF] border border-[#D9D5CA] rounded px-2 py-1.5 text-[#20241F] font-mono text-xs focus:outline-none focus:border-[#536B58] cursor-pointer"
            >
              {GEO_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  Category: {cat}
                </option>
              ))}
            </select>

            <label className="px-3 py-1.5 bg-[#24352B] hover:bg-[#2e4335] text-white border border-[#24352B] rounded cursor-pointer transition-colors shadow-sm font-semibold">
              <span>UPLOAD GEOJSON</span>
              <input
                type="file"
                accept=".geojson,.json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            <button
              onClick={() => handleLoadSampleGeology(selectedCategory)}
              className="px-3 py-1.5 bg-[#FFFFFF] hover:bg-[#F4F1EA] text-[#20241F] border border-[#D9D5CA] rounded cursor-pointer transition-colors font-medium shadow-sm"
            >
              LOAD SAMPLE
            </button>
          </div>
        </div>

        {/* Ingested Geological Layers Table */}
        {geologyDatasets.length > 0 ? (
          <div className="overflow-x-auto border border-[#D9D5CA] rounded bg-[#FFFFFF]">
            <table className="w-full text-left text-[11px]">
              <thead className="bg-[#F4F1EA] text-[#687066] uppercase font-semibold border-b border-[#D9D5CA]">
                <tr>
                  <th className="py-2 px-3">Layer Name</th>
                  <th className="py-2 px-3">Category</th>
                  <th className="py-2 px-3">Features</th>
                  <th className="py-2 px-3">File Size</th>
                  <th className="py-2 px-3">Status</th>
                  <th className="py-2 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D9D5CA] text-[#20241F]">
                {geologyDatasets.map((d) => (
                  <tr key={d.id} className="hover:bg-[#F4F1EA]/60 transition-colors">
                    <td className="py-2 px-3 font-semibold text-[#20241F] flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#536B58]" />
                      {d.name}
                    </td>
                    <td className="py-2 px-3">
                      <span className="px-1.5 py-0.5 bg-[#536B58]/10 rounded text-[10px] text-[#536B58] border border-[#536B58]/30 font-medium">
                        {d.category}
                      </span>
                    </td>
                    <td className="py-2 px-3">{d.featureCount} objects</td>
                    <td className="py-2 px-3">{d.fileSize}</td>
                    <td className="py-2 px-3">
                      <Badge status={d.status}>{d.status}</Badge>
                    </td>
                    <td className="py-2 px-3 text-right">
                      <button
                        onClick={() => removeDataset(d.id)}
                        className="text-rose-600 hover:text-rose-800 p-1 cursor-pointer transition-colors"
                        title="Remove Layer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-4 text-center border border-dashed border-[#D9D5CA] rounded bg-[#F4F1EA]/50 text-[#687066] text-[11px]">
            No geological or structural vectors uploaded. Upload lithology polygons or fault line strings to display them on the central GIS map.
          </div>
        )}
      </div>
    </Card>
  );
}
