import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Layers, ChevronDown, ChevronRight } from 'lucide-react';
import { useApp } from '../../state/AppContext';

export function LayerControl() {
  const { 
    layers, 
    toggleLayer, 
    activeBasemap, 
    setActiveBasemap,
    satelliteMeta,
    geologyDatasets,
    assayDataset,
    demMeta,
    trainedModel,
    predictionGrid
  } = useApp();

  const [openSections, setOpenSections] = useState({
    base: true,
    satellite: false,
    processing: false,
    geology: true,
    terrain: false,
    ai: true,
  });

  const toggleSection = (section) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const layerCategories = [
    {
      id: 'satellite',
      name: 'SATELLITE',
      items: [
        { id: 'trueColor', label: 'True Color (RGB)', ready: !!satelliteMeta },
        { id: 'falseColor', label: 'False Color (NIR/R/G)', ready: !!satelliteMeta },
        { id: 'nir', label: 'NIR Band', ready: !!satelliteMeta },
        { id: 'swir', label: 'SWIR Band', ready: !!satelliteMeta },
      ],
    },
    {
      id: 'processing',
      name: 'PROCESSING',
      items: [
        { id: 'ndvi', label: 'NDVI Index', ready: !!satelliteMeta },
        { id: 'vegMask', label: 'Vegetation Mask', ready: !!satelliteMeta },
        { id: 'waterMask', label: 'Water Mask', ready: !!satelliteMeta },
        { id: 'rockClassification', label: 'Rock Classification', ready: false },
      ],
    },
    {
      id: 'geology',
      name: 'GEOLOGY',
      items: [
        { id: 'lithology', label: 'Lithology Map', ready: geologyDatasets.some(d => d.category === 'Lithology') },
        { id: 'faults', label: 'Structural Faults', ready: geologyDatasets.some(d => d.category === 'Faults') },
        { id: 'lineaments', label: 'Lineaments', ready: geologyDatasets.some(d => d.category === 'Lineaments') },
        { id: 'geologicalBoundaries', label: 'Geological Boundaries', ready: false },
        { id: 'occurrences', label: 'Mn Deposit Samples', ready: !!(assayDataset?.records?.length) },
      ],
    },
    {
      id: 'terrain',
      name: 'TERRAIN',
      items: [
        { id: 'elevation', label: 'Elevation (DEM)', ready: !!demMeta },
        { id: 'slope', label: 'Slope Angle', ready: !!demMeta },
      ],
    },
    {
      id: 'ai',
      name: 'AI / ML',
      items: [
        { id: 'prospectivity', label: 'Mn Prospectivity Heatmap', ready: !!(trainedModel && predictionGrid.length > 0) },
        { id: 'estimatedGrade', label: 'Estimated Mn Grade', ready: !!(trainedModel?.mode === 'grade') },
      ],
    },
  ];

  return (
    <Card 
      title="MAP LAYERS" 
      className="bg-[#FFFFFF]/95 backdrop-blur-md border border-[#D9D5CA] shadow-lg w-64 max-h-[460px] overflow-y-auto"
    >
      <div className="space-y-2">
        {/* BASEMAP CHOOSER */}
        <div className="border-b border-[#D9D5CA] pb-2">
          <div 
            onClick={() => toggleSection('base')}
            className="flex items-center justify-between text-[11px] font-mono font-bold text-[#20241F] uppercase cursor-pointer hover:text-[#B56B32] py-1"
          >
            <span>BASEMAP</span>
            {openSections.base ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </div>
          {openSections.base && (
            <div className="mt-1.5 space-y-1 pl-1">
              {[
                { id: 'light', label: 'Carto Light / Positron' },
                { id: 'satellite', label: 'Esri Satellite' },
                { id: 'osm', label: 'OpenStreetMap' },
                { id: 'dark', label: 'Carto Dark Matter' },
              ].map((bm) => (
                <label 
                  key={bm.id} 
                  className="flex items-center gap-2 text-xs font-mono text-[#687066] hover:text-[#20241F] cursor-pointer"
                >
                  <input
                    type="radio"
                    name="basemap"
                    checked={activeBasemap === bm.id}
                    onChange={() => setActiveBasemap(bm.id)}
                    className="accent-[#B56B32] w-3 h-3 cursor-pointer"
                  />
                  <span>{bm.label}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* LAYER GROUPS */}
        {layerCategories.map((category) => (
          <div key={category.id} className="border-b border-[#D9D5CA] last:border-0 pb-1.5">
            <div
              onClick={() => toggleSection(category.id)}
              className="flex items-center justify-between text-[11px] font-mono font-bold text-[#20241F] uppercase cursor-pointer hover:text-[#B56B32] py-1"
            >
              <span>{category.name}</span>
              <div className="flex items-center gap-1">
                <span className="text-[9px] text-[#687066] font-normal">
                  {category.items.filter(i => layers[i.id]).length}/{category.items.length}
                </span>
                {openSections[category.id] ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </div>
            </div>

            {openSections[category.id] && (
              <div className="mt-1 space-y-1.5 pl-1">
                {category.items.map((item) => (
                  <div 
                    key={item.id}
                    className="flex items-center justify-between text-xs font-mono text-[#687066] hover:text-[#20241F]"
                  >
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={layers[item.id] || false}
                        onChange={() => toggleLayer(item.id)}
                        className="accent-[#B56B32] w-3 h-3 rounded-none cursor-pointer"
                      />
                      <span className={layers[item.id] ? 'text-[#20241F] font-medium' : 'text-[#687066]'}>
                        {item.label}
                      </span>
                    </label>

                    {item.ready ? (
                      <span className="text-[9px] font-mono text-[#24352B] px-1 py-0.2 bg-[#24352B]/10 rounded border border-[#24352B]/30 font-semibold">
                        ACTIVE
                      </span>
                    ) : (
                      <span className="text-[9px] font-mono text-[#687066] px-1 py-0.2 bg-[#F4F1EA] rounded border border-[#D9D5CA]">
                        PENDING
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
