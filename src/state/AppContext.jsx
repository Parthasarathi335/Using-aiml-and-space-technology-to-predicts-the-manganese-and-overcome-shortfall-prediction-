import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const initialDataStatus = {
  satellite: 'NOT UPLOADED',
  geology: 'NOT UPLOADED',
  terrain: 'NOT UPLOADED',
  mnLabels: 'NOT UPLOADED',
  mlModel: 'NOT UPLOADED',
  supplyDemand: 'NOT UPLOADED',
};

export const initialLayers = {
  // Base
  osm: true,
  satelliteBasemap: false,
  
  // Satellite Bands
  trueColor: false,
  falseColor: false,
  nir: false,
  swir: false,

  // Processing
  ndvi: false,
  vegMask: false,
  waterMask: false,
  rockClassification: false,

  // Geology
  lithology: false,
  faults: false,
  lineaments: false,
  geologicalBoundaries: false,
  occurrences: true,

  // Terrain
  elevation: false,
  slope: false,

  // AI
  prospectivity: false,
  estimatedGrade: false,
};

export function AppProvider({ children }) {
  const [dataStatus, setDataStatus] = useState(initialDataStatus);
  const [layers, setLayers] = useState(initialLayers);
  const [activeBasemap, setActiveBasemap] = useState('google');
  const [demoMode, setDemoMode] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Study Area State
  const [studyArea, setStudyArea] = useState({
    type: 'bounds',
    name: 'Kalahari Manganese Field (Default Benchmark)',
    bounds: {
      minLat: -28.0,
      maxLat: -26.5,
      minLon: 22.2,
      maxLon: 23.8,
    },
    radius: {
      centerLat: -27.25,
      centerLon: 22.95,
      radiusKm: 50,
    },
    geoJson: null,
  });

  // Uploaded Datasets & Provenance
  const [satelliteMeta, setSatelliteMeta] = useState(null);
  const [bandMapping, setBandMapping] = useState({
    band1: 'Blue',
    band2: 'Green',
    band3: 'Red',
    band4: 'NIR',
    band5: 'SWIR1',
    band6: 'SWIR2',
  });

  const [geologyDatasets, setGeologyDatasets] = useState([]);
  const [assayDataset, setAssayDataset] = useState(null);
  const [demMeta, setDemMeta] = useState(null);

  // Satellite Processing Operations Status
  const [preprocessingStatus, setPreprocessingStatus] = useState({
    cloudMasking: 'Not Run',
    atmosphericCorrection: 'Not Run',
    radiometricCorrection: 'Not Run',
    geometricCorrection: 'Not Run',
  });

  const [maskingStatus, setMaskingStatus] = useState({
    vegetationMasking: 'Not Run',
    waterMasking: 'Not Run',
    builtUpMasking: 'Not Run',
  });

  const [ndviConfig, setNdviConfig] = useState({
    status: 'Not Run',
    threshold: 0.30,
    totalAreaKm2: null,
    vegetationAreaKm2: null,
    bareSurfaceAreaKm2: null,
    waterAreaKm2: null,
    usableAreaKm2: null,
  });

  // Module 3: AI / ML Trained Models & Prediction Grid
  const [trainedModel, setTrainedModel] = useState(null);
  const [predictionGrid, setPredictionGrid] = useState([]);

  // Module 4: Supply & Demand Econometrics & Forecast State
  const [supplyDemandDataset, setSupplyDemandDataset] = useState(null);
  const [forecastHorizon, setForecastHorizon] = useState(10); // 5 | 10 | 15 | 20
  const [forecastModelType, setForecastModelType] = useState('arima'); // 'arima' | 'xgboost' | 'random_forest' | 'lstm'
  const [scenarioModifiers, setScenarioModifiers] = useState({
    steelGrowthPct: 1.5,
    batteryGrowthPct: 14.0,
    capacityGrowthPct: 2.2,
    recyclingGrowthPct: 8.0,
    importAvailabilityPct: 0.0,
  });
  const [forecastResults, setForecastResults] = useState(null);

  // Data Provenance Ledger
  const [provenanceLedger, setProvenanceLedger] = useState([
    {
      id: 'prov-default-grid',
      datasetName: 'Kalahari Regional CRS Grid Definition',
      fileType: 'EPSG:4326',
      uploadTime: 'System Initialization',
      crs: 'WGS84 (EPSG:4326)',
      coverage: '22.2E to 23.8E, 28.0S to 26.5S',
      validationStatus: 'READY',
      processingStatus: 'Active Grid',
    }
  ]);

  const addProvenance = (entry) => {
    setProvenanceLedger(prev => [
      {
        id: `prov-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        uploadTime: new Date().toLocaleString(),
        ...entry,
      },
      ...prev,
    ]);
  };

  const toggleLayer = (layerKey) => {
    setLayers((prev) => ({
      ...prev,
      [layerKey]: !prev[layerKey],
    }));
  };

  const resetAllLayers = () => {
    setLayers(initialLayers);
  };

  return (
    <AppContext.Provider
      value={{
        dataStatus,
        setDataStatus,
        layers,
        setLayers,
        toggleLayer,
        resetAllLayers,
        activeBasemap,
        setActiveBasemap,
        demoMode,
        setDemoMode,
        studyArea,
        setStudyArea,
        selectedLocation,
        setSelectedLocation,
        sidebarCollapsed,
        setSidebarCollapsed,
        
        // Ingested States
        satelliteMeta,
        setSatelliteMeta,
        bandMapping,
        setBandMapping,
        geologyDatasets,
        setGeologyDatasets,
        assayDataset,
        setAssayDataset,
        demMeta,
        setDemMeta,
        preprocessingStatus,
        setPreprocessingStatus,
        maskingStatus,
        setMaskingStatus,
        ndviConfig,
        setNdviConfig,
        provenanceLedger,
        addProvenance,

        // AI/ML States
        trainedModel,
        setTrainedModel,
        predictionGrid,
        setPredictionGrid,

        // Supply & Demand / Forecasting States
        supplyDemandDataset,
        setSupplyDemandDataset,
        forecastHorizon,
        setForecastHorizon,
        forecastModelType,
        setForecastModelType,
        scenarioModifiers,
        setScenarioModifiers,
        forecastResults,
        setForecastResults,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
