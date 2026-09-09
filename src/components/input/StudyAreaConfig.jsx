import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { useApp } from '../../state/AppContext';
import { Globe, MapPin, Check } from 'lucide-react';

export function StudyAreaConfig() {
  const { studyArea, setStudyArea, addProvenance } = useApp();
  const [activeTab, setActiveTab] = useState(studyArea.type || 'bounds');

  // Local form state
  const [minLat, setMinLat] = useState(studyArea.bounds.minLat);
  const [maxLat, setMaxLat] = useState(studyArea.bounds.maxLat);
  const [minLon, setMinLon] = useState(studyArea.bounds.minLon);
  const [maxLon, setMaxLon] = useState(studyArea.bounds.maxLon);

  const [centerLat, setCenterLat] = useState(studyArea.radius.centerLat);
  const [centerLon, setCenterLon] = useState(studyArea.radius.centerLon);
  const [radiusKm, setRadiusKm] = useState(studyArea.radius.radiusKm);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveBounds = (e) => {
    e.preventDefault();
    const newBounds = {
      minLat: parseFloat(minLat),
      maxLat: parseFloat(maxLat),
      minLon: parseFloat(minLon),
      maxLon: parseFloat(maxLon),
    };

    setStudyArea((prev) => ({
      ...prev,
      type: 'bounds',
      bounds: newBounds,
    }));

    addProvenance({
      datasetName: 'Study Area Bounding Box Definition',
      fileType: 'Spatial Boundary (EPSG:4326)',
      crs: 'EPSG:4326',
      coverage: `${newBounds.minLon}E to ${newBounds.maxLon}E, ${newBounds.minLat}S to ${newBounds.maxLat}S`,
      validationStatus: 'READY',
      processingStatus: 'Active Study Mask',
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleSaveRadius = (e) => {
    e.preventDefault();
    const newRadius = {
      centerLat: parseFloat(centerLat),
      centerLon: parseFloat(centerLon),
      radiusKm: parseFloat(radiusKm),
    };

    setStudyArea((prev) => ({
      ...prev,
      type: 'radius',
      radius: newRadius,
    }));

    addProvenance({
      datasetName: `Study Area Buffer (${newRadius.radiusKm}km)`,
      fileType: 'Radial Buffer',
      crs: 'EPSG:4326',
      coverage: `Center: ${newRadius.centerLat}, ${newRadius.centerLon}`,
      validationStatus: 'READY',
      processingStatus: 'Active Radial Filter',
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <Card 
      title="STUDY AREA DELINEATION" 
      badge={<Badge status="READY">{studyArea.type.toUpperCase()}</Badge>}
    >
      <div className="space-y-4 text-xs font-mono">
        {/* Selection mode tabs */}
        <div className="flex border-b border-[#D9D5CA]">
          {[
            { id: 'bounds', label: 'BOUNDING BOX' },
            { id: 'radius', label: 'CENTER POINT + RADIUS' },
            { id: 'polygon', label: 'POLYGON ON MAP' },
            { id: 'geojson', label: 'UPLOAD BOUNDARY GEOJSON' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setStudyArea((prev) => ({ ...prev, type: tab.id }));
              }}
              className={`px-3 py-2 border-b-2 font-semibold transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? 'border-[#B56B32] text-[#20241F] bg-[#F4F1EA]'
                  : 'border-transparent text-[#687066] hover:text-[#20241F]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Bounds Mode */}
        {activeTab === 'bounds' && (
          <form onSubmit={handleSaveBounds} className="space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-[#F4F1EA] p-2.5 rounded border border-[#D9D5CA]">
                <label className="text-[10px] text-[#687066] block uppercase font-semibold mb-1">
                  Min Latitude (South)
                </label>
                <input
                  type="number"
                  step="any"
                  value={minLat}
                  onChange={(e) => setMinLat(e.target.value)}
                  className="w-full bg-[#FFFFFF] border border-[#D9D5CA] rounded px-2 py-1 text-[#20241F] font-mono focus:outline-none focus:border-[#536B58]"
                />
              </div>
              <div className="bg-[#F4F1EA] p-2.5 rounded border border-[#D9D5CA]">
                <label className="text-[10px] text-[#687066] block uppercase font-semibold mb-1">
                  Max Latitude (North)
                </label>
                <input
                  type="number"
                  step="any"
                  value={maxLat}
                  onChange={(e) => setMaxLat(e.target.value)}
                  className="w-full bg-[#FFFFFF] border border-[#D9D5CA] rounded px-2 py-1 text-[#20241F] font-mono focus:outline-none focus:border-[#536B58]"
                />
              </div>
              <div className="bg-[#F4F1EA] p-2.5 rounded border border-[#D9D5CA]">
                <label className="text-[10px] text-[#687066] block uppercase font-semibold mb-1">
                  Min Longitude (West)
                </label>
                <input
                  type="number"
                  step="any"
                  value={minLon}
                  onChange={(e) => setMinLon(e.target.value)}
                  className="w-full bg-[#FFFFFF] border border-[#D9D5CA] rounded px-2 py-1 text-[#20241F] font-mono focus:outline-none focus:border-[#536B58]"
                />
              </div>
              <div className="bg-[#F4F1EA] p-2.5 rounded border border-[#D9D5CA]">
                <label className="text-[10px] text-[#687066] block uppercase font-semibold mb-1">
                  Max Longitude (East)
                </label>
                <input
                  type="number"
                  step="any"
                  value={maxLon}
                  onChange={(e) => setMaxLon(e.target.value)}
                  className="w-full bg-[#FFFFFF] border border-[#D9D5CA] rounded px-2 py-1 text-[#20241F] font-mono focus:outline-none focus:border-[#536B58]"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-[#687066]">
                Current: {studyArea.bounds.minLon}°E to {studyArea.bounds.maxLon}°E, {studyArea.bounds.minLat}°S to {studyArea.bounds.maxLat}°S
              </span>
              <button
                type="submit"
                className="px-4 py-1.5 bg-[#24352B] hover:bg-[#2e4335] text-white border border-[#24352B] rounded cursor-pointer transition-colors font-semibold shadow-sm"
              >
                {savedSuccess ? 'SAVED TO GIS MAP ✓' : 'UPDATE STUDY BOUNDS'}
              </button>
            </div>
          </form>
        )}

        {/* Radius Mode */}
        {activeTab === 'radius' && (
          <form onSubmit={handleSaveRadius} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-[#F4F1EA] p-2.5 rounded border border-[#D9D5CA]">
                <label className="text-[10px] text-[#687066] block uppercase font-semibold mb-1">
                  Center Latitude
                </label>
                <input
                  type="number"
                  step="any"
                  value={centerLat}
                  onChange={(e) => setCenterLat(e.target.value)}
                  className="w-full bg-[#FFFFFF] border border-[#D9D5CA] rounded px-2 py-1 text-[#20241F] font-mono focus:outline-none focus:border-[#536B58]"
                />
              </div>
              <div className="bg-[#F4F1EA] p-2.5 rounded border border-[#D9D5CA]">
                <label className="text-[10px] text-[#687066] block uppercase font-semibold mb-1">
                  Center Longitude
                </label>
                <input
                  type="number"
                  step="any"
                  value={centerLon}
                  onChange={(e) => setCenterLon(e.target.value)}
                  className="w-full bg-[#FFFFFF] border border-[#D9D5CA] rounded px-2 py-1 text-[#20241F] font-mono focus:outline-none focus:border-[#536B58]"
                />
              </div>
              <div className="bg-[#F4F1EA] p-2.5 rounded border border-[#D9D5CA]">
                <label className="text-[10px] text-[#687066] block uppercase font-semibold mb-1">
                  Exploration Radius (km)
                </label>
                <input
                  type="number"
                  step="any"
                  value={radiusKm}
                  onChange={(e) => setRadiusKm(e.target.value)}
                  className="w-full bg-[#FFFFFF] border border-[#D9D5CA] rounded px-2 py-1 text-[#20241F] font-mono focus:outline-none focus:border-[#536B58]"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-[#687066]">
                Center: [{studyArea.radius.centerLat}, {studyArea.radius.centerLon}] • Radius: {studyArea.radius.radiusKm} km
              </span>
              <button
                type="submit"
                className="px-4 py-1.5 bg-[#24352B] hover:bg-[#2e4335] text-white border border-[#24352B] rounded cursor-pointer transition-colors font-semibold shadow-sm"
              >
                {savedSuccess ? 'SAVED TO GIS MAP ✓' : 'UPDATE RADIAL AREA'}
              </button>
            </div>
          </form>
        )}

        {/* Polygon & GeoJSON place info */}
        {(activeTab === 'polygon' || activeTab === 'geojson') && (
          <div className="p-4 bg-[#F4F1EA] border border-[#D9D5CA] rounded text-center text-[#687066]">
            <Globe className="w-6 h-6 mx-auto mb-2 text-[#B56B32]" />
            <p className="text-xs mb-2 text-[#20241F]">
              {activeTab === 'polygon'
                ? 'Interactive polygon tool active on the Central GIS Map. Click map vertices to enclose arbitrary target concessions.'
                : 'Upload an ESRI Shapefile or GeoJSON boundary polygon to mask all satellite and geological rasters to the concession limits.'}
            </p>
            <span className="text-[10px] font-mono text-[#536B58] uppercase bg-[#536B58]/10 px-2.5 py-1 rounded border border-[#536B58]/30 font-semibold">
              Module 2 Spatial Masking Connected
            </span>
          </div>
        )}
      </div>
    </Card>
  );
}
