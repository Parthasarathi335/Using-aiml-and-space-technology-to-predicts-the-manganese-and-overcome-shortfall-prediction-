import React from 'react';
import { MapView } from '../components/map/MapView';
import { LocationAnalysis } from '../components/map/LocationAnalysis';
import { useApp } from '../state/AppContext';

export function InteractiveMap() {
  const { selectedLocation, setSelectedLocation } = useApp();

  return (
    <div className="h-full w-full relative flex">
      <div className="flex-1 h-full relative">
        <MapView isFullscreen={true} />
      </div>

      {selectedLocation && (
        <div className="absolute top-4 right-20 z-[1000] w-72 max-h-[90%] overflow-y-auto">
          <LocationAnalysis
            location={selectedLocation}
            onClose={() => setSelectedLocation(null)}
          />
        </div>
      )}
    </div>
  );
}
