import React, { useState } from 'react';
import { 
  MapContainer, 
  TileLayer, 
  ScaleControl, 
  useMapEvents, 
  Rectangle,
  Circle,
  CircleMarker,
  GeoJSON,
  Tooltip
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useApp } from '../../state/AppContext';
import { MapControls } from './MapControls';
import { LayerControl } from './LayerControl';
import { MapLegend } from './MapLegend';
import { Layers } from 'lucide-react';

const BASEMAP_TILES = {
  google: {
    url: `https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}&key=${import.meta.env.VITE_GOOGLE_MAPS_KEY}`,
    attribution: '&copy; <a href="https://maps.google.com">Google Maps</a>',
  },
  light: {
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>, OpenStreetMap',
  },
  dark: {
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>, OpenStreetMap',
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{x}/{y}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
  },
  osm: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  },
};

function MapEventListener({ onCursorMove, onMapClick }) {
  useMapEvents({
    mousemove: (e) => {
      onCursorMove(e.latlng);
    },
    click: (e) => {
      onMapClick(e.latlng);
    },
  });
  return null;
}

// Color mapper for prospectivity heatmap
function getProspectivityColor(pct) {
  if (pct >= 80) return '#b91c1c'; // Very High - Deep Red
  if (pct >= 60) return '#B56B32'; // High - Accent Amber-Orange
  if (pct >= 40) return '#d97706'; // Moderate - Amber
  if (pct >= 20) return '#536B58'; // Low - Secondary Forest Green
  return '#64748b'; // Very Low - Slate
}

export function MapView({ isFullscreen = false, onToggleFullscreen, className = '' }) {
  const { 
    activeBasemap, 
    selectedLocation, 
    setSelectedLocation,
    layers,
    studyArea,
    geologyDatasets,
    assayDataset,
    predictionGrid,
    trainedModel
  } = useApp();

  const [cursorPos, setCursorPos] = useState(null);
  const [showLayerPanel, setShowLayerPanel] = useState(false);

  const defaultCenter = [studyArea.radius.centerLat, studyArea.radius.centerLon];
  const defaultZoom = 7;

  const studyAreaBounds = [
    [studyArea.bounds.minLat, studyArea.bounds.minLon],
    [studyArea.bounds.maxLat, studyArea.bounds.maxLon],
  ];

  const handleMapClick = (latlng) => {
    setSelectedLocation({
      lat: latlng.lat,
      lng: latlng.lng,
    });
  };

  const tileConfig = BASEMAP_TILES[activeBasemap] || BASEMAP_TILES.google || BASEMAP_TILES.osm;

  return (
    <div className={`relative w-full h-full bg-[#D7D0BF] overflow-hidden select-none ${className}`}>
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        zoomControl={false}
        className="w-full h-full"
      >
        <TileLayer
          key={activeBasemap}
          url={tileConfig.url}
          attribution={tileConfig.attribution}
          maxZoom={19}
        />

        <ScaleControl position="bottomleft" imperial={false} />

        {/* Study Area Bounds */}
        {studyArea.type === 'bounds' && (
          <Rectangle
            bounds={studyAreaBounds}
            pathOptions={{
              color: '#536B58',
              weight: 2,
              fillColor: '#536B58',
              fillOpacity: 0.06,
              dashArray: '4, 4',
            }}
          >
            <Tooltip sticky className="font-mono text-xs">
              Study Area: {studyArea.name}
            </Tooltip>
          </Rectangle>
        )}

        {studyArea.type === 'radius' && (
          <Circle
            center={[studyArea.radius.centerLat, studyArea.radius.centerLon]}
            radius={studyArea.radius.radiusKm * 1000}
            pathOptions={{
              color: '#536B58',
              weight: 2,
              fillColor: '#536B58',
              fillOpacity: 0.06,
              dashArray: '4, 4',
            }}
          >
            <Tooltip sticky className="font-mono text-xs">
              Study Buffer: {studyArea.radius.radiusKm} km Radius
            </Tooltip>
          </Circle>
        )}

        {/* AI / ML Manganese Prospectivity Heatmap Cells */}
        {layers.prospectivity && predictionGrid.map((cell) => {
          const color = getProspectivityColor(cell.prospectivity);
          return (
            <Rectangle
              key={cell.id}
              bounds={cell.bounds}
              pathOptions={{
                color: color,
                weight: 0.8,
                fillColor: color,
                fillOpacity: 0.45,
              }}
              eventHandlers={{
                click: () => {
                  setSelectedLocation({
                    lat: cell.center[0],
                    lng: cell.center[1],
                    gridCell: cell,
                  });
                },
              }}
            >
              <Tooltip className="font-mono text-[11px]">
                <div>
                  <strong className="text-[#B56B32]">Predicted Prospectivity: {cell.prospectivity}%</strong>
                  <div className="text-[10px] text-[#20241F]">Classification: {cell.classification}</div>
                  <div className="text-[10px] text-[#536B58]">Est. Mn Grade: {cell.estimatedGrade}</div>
                </div>
              </Tooltip>
            </Rectangle>
          );
        })}

        {/* Uploaded Geological Vector Layers */}
        {geologyDatasets.map((d) => {
          if (!d.geoJson || !d.visibleOnMap) return null;
          return (
            <GeoJSON
              key={d.id}
              data={d.geoJson}
              style={(feature) => ({
                color: d.category === 'Faults' ? '#B56B32' : '#536B58',
                weight: d.category === 'Faults' ? 2.5 : 1.5,
                fillColor: '#536B58',
                fillOpacity: 0.25,
              })}
            />
          );
        })}

        {/* Manganese Assay Deposit Pins */}
        {layers.occurrences && assayDataset?.records && assayDataset.records.map((sample, i) => (
          <CircleMarker
            key={i}
            center={[sample.latitude, sample.longitude]}
            radius={sample.mnGrade > 45 ? 6.5 : 5}
            pathOptions={{
              color: '#FFFFFF',
              fillColor: sample.mnGrade > 45 ? '#B56B32' : '#536B58',
              fillOpacity: 0.95,
              weight: 2,
            }}
          >
            <Tooltip className="font-mono text-[11px]">
              <div>
                <strong>{sample.sampleId}</strong>: <span className="text-[#B56B32] font-bold">{sample.mnGrade}% Mn</span>
                <div className="text-[10px] text-[#687066]">{sample.rockType}</div>
              </div>
            </Tooltip>
          </CircleMarker>
        ))}

        {/* Inspected Click Target */}
        {selectedLocation && (
          <CircleMarker
            center={[selectedLocation.lat, selectedLocation.lng]}
            radius={7}
            pathOptions={{
              color: '#FFFFFF',
              fillColor: '#B56B32',
              fillOpacity: 0.9,
              weight: 2.5,
            }}
          >
            <Tooltip permanent className="font-mono text-[10px]">
              {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
            </Tooltip>
          </CircleMarker>
        )}

        <MapEventListener
          onCursorMove={(ll) => setCursorPos(ll)}
          onMapClick={handleMapClick}
        />

        <div className="absolute top-4 left-4 z-[1000]">
          <MapControls 
            isFullscreen={isFullscreen} 
            onToggleFullscreen={onToggleFullscreen} 
          />
        </div>
      </MapContainer>

      {/* Layer Toggle Button */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col items-end gap-2">
        <button
          onClick={() => setShowLayerPanel(!showLayerPanel)}
          className={`px-2.5 py-1.5 rounded text-xs font-mono font-semibold flex items-center gap-1.5 shadow-md border backdrop-blur-md transition-all cursor-pointer ${
            showLayerPanel 
              ? 'bg-[#24352B] text-white border-[#24352B]' 
              : 'bg-[#FFFFFF]/90 text-[#20241F] border-[#D9D5CA] hover:bg-[#F4F1EA]'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>LAYERS</span>
        </button>

        {showLayerPanel && <LayerControl />}
      </div>

      <div className="absolute bottom-4 right-4 z-[1000]">
        <MapLegend hasPrediction={layers.prospectivity && predictionGrid.length > 0} />
      </div>

      {/* Coordinate & Status Ribbon */}
      <div className="absolute bottom-2 left-28 z-[1000] hidden md:flex items-center gap-3 px-3 py-1 bg-[#FFFFFF]/90 border border-[#D9D5CA] rounded text-[10px] font-mono text-[#687066] backdrop-blur-sm shadow-sm">
        <div className="flex items-center gap-1.5">
          <span className="text-[#687066] uppercase">LAT:</span>
          <span className="text-[#20241F] font-semibold">{cursorPos ? cursorPos.lat.toFixed(5) : '—'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[#687066] uppercase">LON:</span>
          <span className="text-[#20241F] font-semibold">{cursorPos ? cursorPos.lng.toFixed(5) : '—'}</span>
        </div>
        <div className="text-[#D9D5CA]">|</div>
        <div>PROJECTION: <span className="text-[#20241F]">WGS84 / EPSG:4326</span></div>
        {trainedModel && (
          <>
            <div className="text-[#D9D5CA]">|</div>
            <div className="text-[#B56B32] font-semibold">
              HEATMAP: {trainedModel.algorithm} ({predictionGrid.length} CELLS)
            </div>
          </>
        )}
      </div>
    </div>
  );
}
