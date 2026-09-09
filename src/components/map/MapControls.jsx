import React from 'react';
import { Maximize2, Minimize2, ZoomIn, ZoomOut, Compass } from 'lucide-react';
import { useMap } from 'react-leaflet';

export function MapControls({ isFullscreen, onToggleFullscreen }) {
  const map = useMap();

  return (
    <div className="flex flex-col gap-1.5 shadow-sm">
      <button
        onClick={() => map.zoomIn()}
        className="w-8 h-8 flex items-center justify-center bg-[#FFFFFF] hover:bg-[#F4F1EA] border border-[#D9D5CA] text-[#20241F] hover:text-[#B56B32] rounded-sm cursor-pointer transition-colors shadow-sm"
        title="Zoom In"
      >
        <ZoomIn className="w-4 h-4" />
      </button>
      <button
        onClick={() => map.zoomOut()}
        className="w-8 h-8 flex items-center justify-center bg-[#FFFFFF] hover:bg-[#F4F1EA] border border-[#D9D5CA] text-[#20241F] hover:text-[#B56B32] rounded-sm cursor-pointer transition-colors shadow-sm"
        title="Zoom Out"
      >
        <ZoomOut className="w-4 h-4" />
      </button>
      <button
        onClick={() => map.setView([-27.5, 23.0], 6)} // Kalahari Manganese Field Default View
        className="w-8 h-8 flex items-center justify-center bg-[#FFFFFF] hover:bg-[#F4F1EA] border border-[#D9D5CA] text-[#20241F] hover:text-[#B56B32] rounded-sm cursor-pointer transition-colors shadow-sm"
        title="Reset to Study Area (Kalahari Basin)"
      >
        <Compass className="w-4 h-4" />
      </button>
      {onToggleFullscreen && (
        <button
          onClick={onToggleFullscreen}
          className="w-8 h-8 flex items-center justify-center bg-[#FFFFFF] hover:bg-[#F4F1EA] border border-[#D9D5CA] text-[#20241F] hover:text-[#B56B32] rounded-sm cursor-pointer transition-colors shadow-sm"
          title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Map"}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      )}
    </div>
  );
}
