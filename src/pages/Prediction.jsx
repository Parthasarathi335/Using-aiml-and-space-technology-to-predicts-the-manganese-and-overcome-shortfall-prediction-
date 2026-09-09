import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/dashboard/EmptyState';
import { useApp } from '../state/AppContext';
import { 
  MODEL_CATALOG, 
  trainModel, 
  generatePredictionGrid 
} from '../services/mlService';
import { 
  Cpu, 
  Play, 
  Layers, 
  BarChart3, 
  CheckCircle2, 
  AlertTriangle, 
  Sliders, 
  TrendingUp, 
  ShieldCheck,
  Compass
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Prediction() {
  const navigate = useNavigate();
  const { 
    assayDataset, 
    satelliteMeta, 
    geologyDatasets, 
    demMeta, 
    studyArea,
    demoMode, 
    trainedModel, 
    setTrainedModel, 
    setPredictionGrid,
    setDataStatus,
    setLayers,
    addProvenance 
  } = useApp();

  // Model Config Form State
  const [selectedMode, setSelectedMode] = useState('prospectivity'); // 'prospectivity' (Mode A) | 'grade' (Mode B)
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('random_forest');
  const [trainSplit, setTrainSplit] = useState(80);
  const [cvFolds, setCvFolds] = useState(5);

  // Training state
  const [isTraining, setIsTraining] = useState(false);
  const [trainingError, setTrainingError] = useState(null);

  const sampleCount = assayDataset?.records?.length || 0;
  const isDataSufficient = sampleCount >= 4 || demoMode;

  const handleAlgorithmChange = (algoId) => {
    setSelectedAlgorithm(algoId);
  };

  const handleModeSwitch = (mode) => {
    setSelectedMode(mode);
    if (mode === 'prospectivity') {
      setSelectedAlgorithm('random_forest');
    } else {
      setSelectedAlgorithm('rf_regressor');
    }
  };

  const handleTrainModel = async () => {
    setIsTraining(true);
    setTrainingError(null);

    const config = {
      mode: selectedMode,
      algorithm: selectedAlgorithm,
      trainSplit,
      cvFolds,
    };

    const datasetContext = {
      assayDataset,
      satelliteMeta,
      geologyDatasets,
      demMeta,
    };

    try {
      const result = await trainModel(config, datasetContext, demoMode);
      setTrainedModel(result);
      setDataStatus((prev) => ({ ...prev, mlModel: 'READY' }));

      // Automatically generate spatial prediction grid
      const grid = generatePredictionGrid(studyArea.bounds, result);
      setPredictionGrid(grid);
      setLayers((prev) => ({ ...prev, prospectivity: true }));

      // Audit into Provenance Ledger
      addProvenance({
        datasetName: `Trained ${result.algorithm} (${result.mode.toUpperCase()})`,
        fileType: 'Spatial ML Model Weights & Grid',
        crs: 'WGS84 (EPSG:4326)',
        coverage: `${grid.length} Prospectivity Grid Tiles (${studyArea.name})`,
        validationStatus: 'READY',
        processingStatus: result.isSimulated ? 'Demo Simulation Model' : 'Active Calibrated Model',
      });
    } catch (err) {
      setTrainingError(err.message);
    } finally {
      setIsTraining(false);
    }
  };

  const algorithms = selectedMode === 'prospectivity' 
    ? MODEL_CATALOG.classification 
    : MODEL_CATALOG.regression;

  return (
    <div className="p-4 space-y-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-[#D9D5CA] pb-3 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-[#20241F] flex items-center gap-2">
            <span>AI / ML PREDICTION & PROSPECTIVITY ENGINE</span>
            <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-[#536B58]/10 text-[#536B58] border border-[#536B58]/30 font-semibold">
              MODULE 3
            </span>
          </h2>
          <p className="text-xs font-mono text-[#687066] mt-0.5">
            Train Supervised Classifiers for Manganese Prospectivity or Regressors for Ore Grade (%)
          </p>
        </div>

        {/* Mode Selector (Mode A vs Mode B) */}
        <div className="flex bg-[#F4F1EA] p-1 rounded border border-[#D9D5CA]">
          <button
            onClick={() => handleModeSwitch('prospectivity')}
            className={`px-3 py-1.5 text-xs font-mono font-semibold rounded transition-colors cursor-pointer ${
              selectedMode === 'prospectivity'
                ? 'bg-[#24352B] text-white border border-[#24352B] shadow-sm'
                : 'text-[#687066] hover:text-[#20241F]'
            }`}
          >
            MODE A: MN PROSPECTIVITY
          </button>
          <button
            onClick={() => handleModeSwitch('grade')}
            className={`px-3 py-1.5 text-xs font-mono font-semibold rounded transition-colors cursor-pointer ${
              selectedMode === 'grade'
                ? 'bg-[#24352B] text-white border border-[#24352B] shadow-sm'
                : 'text-[#687066] hover:text-[#20241F]'
            }`}
          >
            MODE B: MN GRADE PREDICTION
          </button>
        </div>
      </div>

      {/* Scientific Distinction Notice */}
      <div className="p-3 bg-[#FFFFFF] border border-[#D9D5CA] rounded text-xs font-mono flex items-start gap-3 shadow-sm">
        <Compass className="w-4 h-4 text-[#B56B32] shrink-0 mt-0.5" />
        <div>
          {selectedMode === 'prospectivity' ? (
            <div>
              <span className="text-[#536B58] font-bold uppercase">MODE A — MANGANESE PROSPECTIVITY: </span>
              <span className="text-[#687066]">
                Predicts a continuous spatial probability (0% to 100%) indicating likelihood of deposit presence based on multi-criteria Earth Observation & structural geology. 
                <strong className="text-[#20241F]"> This is a prospectivity score, NOT manganese concentration.</strong>
              </span>
            </div>
          ) : (
            <div>
              <span className="text-[#B56B32] font-bold uppercase">MODE B — MANGANESE GRADE PREDICTION: </span>
              <span className="text-[#687066]">
                Predicts continuous % Mn metallurgical concentration from geochemical assay ground truth and spectral absorption depths.
                <strong className="text-[#20241F]"> Requires field/laboratory validation and calibrated drillhole assays.</strong>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Insufficient Data Warning */}
      {!isDataSufficient && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded text-xs font-mono text-rose-800 space-y-2">
          <div className="flex items-center gap-2 font-bold text-rose-900">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>INSUFFICIENT DATA FOR RELIABLE MODEL TRAINING</span>
          </div>
          <p className="text-rose-700 leading-relaxed">
            Reliable model training cannot be performed with the current dataset (Found {sampleCount} valid georeferenced assay records).
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-1 text-[11px] text-rose-600">
            <div>• Valid Labels: <span className="text-rose-800 font-semibold">{sampleCount} (Need &ge; 4)</span></div>
            <div>• Satellite Bands: <span className={satelliteMeta ? 'text-[#536B58]' : 'text-rose-800'}>{satelliteMeta ? '6 Channels' : 'Missing'}</span></div>
            <div>• Geology Vectors: <span className={geologyDatasets.length > 0 ? 'text-[#536B58]' : 'text-rose-800'}>{geologyDatasets.length} Loaded</span></div>
            <div>• Terrain DEM: <span className={demMeta ? 'text-[#536B58]' : 'text-[#B56B32]'}>{demMeta ? 'Ready' : 'Unloaded'}</span></div>
          </div>
          <div className="pt-2">
            <button
              onClick={() => navigate('/input-data')}
              className="px-3 py-1 bg-rose-700 hover:bg-rose-800 text-white border border-rose-800 rounded text-xs font-semibold cursor-pointer transition-colors shadow-sm"
            >
              GO TO INPUT DATA TO INGEST SAMPLES
            </button>
          </div>
        </div>
      )}

      {/* Main Configuration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Configuration Form (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <Card 
            title="MODEL SPECIFICATION" 
            badge={
              demoMode ? <Badge status="VALIDATING">DEMO ADAPTER</Badge> : <Badge status="READY">ACTIVE</Badge>
            }
          >
            <div className="space-y-4 text-xs font-mono">
              {/* Algorithm selector */}
              <div>
                <label className="text-[10px] text-[#687066] block uppercase font-semibold mb-1.5">
                  Select Algorithm
                </label>
                <div className="space-y-1.5">
                  {algorithms.map((algo) => (
                    <label 
                      key={algo.id}
                      className={`flex items-start gap-2.5 p-2 rounded border cursor-pointer transition-colors ${
                        selectedAlgorithm === algo.id
                          ? 'bg-[#F4F1EA] border-[#B56B32] text-[#20241F]'
                          : 'bg-[#FFFFFF] border-[#D9D5CA] text-[#687066] hover:border-[#536B58]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="algorithm"
                        checked={selectedAlgorithm === algo.id}
                        onChange={() => handleAlgorithmChange(algo.id)}
                        className="accent-[#B56B32] mt-0.5 cursor-pointer"
                      />
                      <div>
                        <span className="font-semibold block text-[#20241F]">{algo.name}</span>
                        <span className="text-[10px] text-[#687066] block leading-tight">{algo.description}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Training Parameters */}
              <div className="grid grid-cols-2 gap-3 bg-[#F4F1EA] p-2.5 rounded border border-[#D9D5CA]">
                <div>
                  <label className="text-[10px] text-[#687066] block uppercase font-semibold mb-1">
                    Train / Test Split
                  </label>
                  <select
                    value={trainSplit}
                    onChange={(e) => setTrainSplit(parseInt(e.target.value))}
                    className="w-full bg-[#FFFFFF] border border-[#D9D5CA] rounded px-2 py-1 text-[#20241F] font-mono text-xs focus:outline-none focus:border-[#536B58] cursor-pointer"
                  >
                    <option value={80}>80% Train / 20% Test</option>
                    <option value={75}>75% Train / 25% Test</option>
                    <option value={70}>70% Train / 30% Test</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-[#687066] block uppercase font-semibold mb-1">
                    Cross Validation
                  </label>
                  <select
                    value={cvFolds}
                    onChange={(e) => setCvFolds(parseInt(e.target.value))}
                    className="w-full bg-[#FFFFFF] border border-[#D9D5CA] rounded px-2 py-1 text-[#20241F] font-mono text-xs focus:outline-none focus:border-[#536B58] cursor-pointer"
                  >
                    <option value={5}>5-Fold Stratified</option>
                    <option value={10}>10-Fold Stratified</option>
                    <option value={3}>3-Fold Fast</option>
                  </select>
                </div>
              </div>

              {/* Ingested Samples Summary */}
              <div className="bg-[#F4F1EA] p-2.5 rounded border border-[#D9D5CA] space-y-1">
                <span className="text-[10px] text-[#687066] uppercase block font-semibold">DATASET SAMPLE INVENTORY</span>
                <div className="grid grid-cols-3 gap-2 text-[11px]">
                  <div>Samples: <span className="text-[#20241F] font-bold">{sampleCount > 0 ? sampleCount : (demoMode ? '24 (Demo)' : '—')}</span></div>
                  <div>Features: <span className="text-[#20241F] font-bold">11 Core</span></div>
                  <div>Target: <span className="text-[#B56B32] font-bold">{selectedMode === 'prospectivity' ? 'Binary' : '% Grade'}</span></div>
                </div>
              </div>

              {/* Train Button */}
              <button
                onClick={handleTrainModel}
                disabled={isTraining || (!isDataSufficient && !demoMode)}
                className="w-full py-2.5 bg-[#24352B] hover:bg-[#2e4335] text-white border border-[#24352B] rounded font-semibold font-mono tracking-wider uppercase cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>{isTraining ? 'TRAINING ML MODEL & BUILDING GRID...' : `TRAIN ${selectedMode.toUpperCase()} MODEL`}</span>
              </button>

              {trainingError && (
                <div className="p-2 bg-rose-50 border border-rose-200 rounded text-rose-800 text-[11px]">
                  {trainingError}
                </div>
              )}
            </div>
          </Card>

          {/* Model Traceability & Provenance */}
          {trainedModel && (
            <Card title="MODEL PROVENANCE & AUDIT" badge={<Badge status="READY">AUTHENTICATED</Badge>}>
              <div className="space-y-1.5 text-[11px] font-mono text-[#20241F]">
                <div className="flex justify-between py-1 border-b border-[#D9D5CA]">
                  <span className="text-[#687066]">ALGORITHM</span>
                  <span className="text-[#20241F] font-semibold">{trainedModel.algorithm}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#D9D5CA]">
                  <span className="text-[#687066]">PREDICTION MODE</span>
                  <span className="text-[#B56B32] uppercase font-semibold">{trainedModel.mode}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#D9D5CA]">
                  <span className="text-[#687066]">TRAINING TIMESTAMP</span>
                  <span className="text-[#687066]">{trainedModel.trainedAt}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#687066]">EXECUTION TYPE</span>
                  <span className={trainedModel.isSimulated ? 'text-[#B56B32] font-semibold' : 'text-[#536B58] font-semibold'}>
                    {trainedModel.isSimulated ? 'SIMULATED DEMO ADAPTER' : 'CALIBRATED ESTIMATOR'}
                  </span>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Right: Model Evaluation & Feature Importance (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {trainedModel ? (
            <>
              {/* Evaluation Metrics */}
              <Card 
                title={selectedMode === 'prospectivity' ? 'CLASSIFICATION EVALUATION METRICS' : 'REGRESSION METRICS (MN GRADE %)'}
                badge={<Badge status="READY">EVALUATED</Badge>}
              >
                <div className="space-y-4 font-mono text-xs">
                  {selectedMode === 'prospectivity' ? (
                    <div>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                        <div className="bg-[#F4F1EA] p-2.5 rounded border border-[#D9D5CA]">
                          <span className="text-[10px] text-[#687066] block uppercase">Accuracy</span>
                          <span className="text-lg font-bold text-[#536B58]">{(trainedModel.metrics.accuracy * 100).toFixed(1)}%</span>
                        </div>
                        <div className="bg-[#F4F1EA] p-2.5 rounded border border-[#D9D5CA]">
                          <span className="text-[10px] text-[#687066] block uppercase">Precision</span>
                          <span className="text-lg font-bold text-[#20241F]">{(trainedModel.metrics.precision * 100).toFixed(1)}%</span>
                        </div>
                        <div className="bg-[#F4F1EA] p-2.5 rounded border border-[#D9D5CA]">
                          <span className="text-[10px] text-[#687066] block uppercase">Recall</span>
                          <span className="text-lg font-bold text-[#20241F]">{(trainedModel.metrics.recall * 100).toFixed(1)}%</span>
                        </div>
                        <div className="bg-[#F4F1EA] p-2.5 rounded border border-[#D9D5CA]">
                          <span className="text-[10px] text-[#687066] block uppercase">F1-Score</span>
                          <span className="text-lg font-bold text-[#20241F]">{(trainedModel.metrics.f1 * 100).toFixed(1)}%</span>
                        </div>
                        <div className="bg-[#F4F1EA] p-2.5 rounded border border-[#D9D5CA]">
                          <span className="text-[10px] text-[#687066] block uppercase">ROC-AUC</span>
                          <span className="text-lg font-bold text-[#536B58]">{trainedModel.metrics.rocAuc.toFixed(3)}</span>
                        </div>
                      </div>

                      {/* Confusion Matrix */}
                      <div className="mt-3 p-3 bg-[#F4F1EA] border border-[#D9D5CA] rounded">
                        <span className="text-[10px] text-[#687066] uppercase font-semibold block mb-2">
                          CONFUSION MATRIX (TEST SET)
                        </span>
                        <div className="grid grid-cols-2 gap-2 text-center text-xs">
                          <div className="p-2 bg-[#FFFFFF] border border-[#D9D5CA] rounded shadow-sm">
                            <span className="text-[10px] text-[#687066] block">True Negative (Barren)</span>
                            <span className="text-base font-bold text-[#20241F]">{trainedModel.metrics.confusionMatrix[0][0]}</span>
                          </div>
                          <div className="p-2 bg-[#FFFFFF] border border-[#D9D5CA] rounded shadow-sm">
                            <span className="text-[10px] text-[#687066] block">False Positive</span>
                            <span className="text-base font-bold text-[#B56B32]">{trainedModel.metrics.confusionMatrix[0][1]}</span>
                          </div>
                          <div className="p-2 bg-[#FFFFFF] border border-[#D9D5CA] rounded shadow-sm">
                            <span className="text-[10px] text-[#687066] block">False Negative</span>
                            <span className="text-base font-bold text-[#B56B32]">{trainedModel.metrics.confusionMatrix[1][0]}</span>
                          </div>
                          <div className="p-2 bg-[#FFFFFF] border border-[#D9D5CA] rounded shadow-sm">
                            <span className="text-[10px] text-[#687066] block">True Positive (Mn Ore)</span>
                            <span className="text-base font-bold text-[#536B58]">{trainedModel.metrics.confusionMatrix[1][1]}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="bg-[#F4F1EA] p-2.5 rounded border border-[#D9D5CA]">
                          <span className="text-[10px] text-[#687066] block uppercase">Mean Abs Error (MAE)</span>
                          <span className="text-lg font-bold text-[#B56B32]">{trainedModel.metrics.mae}</span>
                        </div>
                        <div className="bg-[#F4F1EA] p-2.5 rounded border border-[#D9D5CA]">
                          <span className="text-[10px] text-[#687066] block uppercase">Root Mean Sq Error</span>
                          <span className="text-lg font-bold text-[#B56B32]">{trainedModel.metrics.rmse}</span>
                        </div>
                        <div className="bg-[#F4F1EA] p-2.5 rounded border border-[#D9D5CA]">
                          <span className="text-[10px] text-[#687066] block uppercase">Coefficient of Det (R²)</span>
                          <span className="text-lg font-bold text-[#536B58]">{trainedModel.metrics.r2.toFixed(3)}</span>
                        </div>
                      </div>

                      {/* Predicted vs Actual Table */}
                      <div className="mt-3 overflow-x-auto border border-[#D9D5CA] rounded bg-[#FFFFFF] shadow-sm">
                        <table className="w-full text-left text-[11px]">
                          <thead className="bg-[#F4F1EA] text-[#687066] uppercase font-semibold border-b border-[#D9D5CA]">
                            <tr>
                              <th className="py-2 px-3">Test Drillhole Sample</th>
                              <th className="py-2 px-3 text-right">Actual Assay Grade</th>
                              <th className="py-2 px-3 text-right">Model Predicted Grade</th>
                              <th className="py-2 px-3 text-right">Residual Error</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#D9D5CA] text-[#20241F]">
                            {trainedModel.metrics.predictedVsActual.map((item, i) => (
                              <tr key={i} className="hover:bg-[#F4F1EA]/60">
                                <td className="py-1.5 px-3">Test Assay #{i + 1}</td>
                                <td className="py-1.5 px-3 text-right font-bold text-[#20241F]">{item.actual}% Mn</td>
                                <td className="py-1.5 px-3 text-right font-bold text-[#B56B32]">{item.predicted}% Mn</td>
                                <td className="py-1.5 px-3 text-right text-[#687066]">
                                  {(item.predicted - item.actual).toFixed(1)}%
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </Card>

              {/* Feature Importance */}
              <Card title="MODEL FEATURE IMPORTANCE RANKINGS" badge={<Badge status="READY">DERIVED</Badge>}>
                <div className="space-y-2 text-xs font-mono">
                  <p className="text-[11px] text-[#687066] mb-3">
                    Relative Gini impurity reduction / permutation importance across geological and remote sensing covariates.
                  </p>
                  {trainedModel.featureImportance.map((f) => (
                    <div key={f.feature} className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-[#20241F] font-semibold">{f.feature}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-[#687066] uppercase">{f.category}</span>
                          <span className="text-[#B56B32] font-bold">{(f.score * 100).toFixed(1)}%</span>
                        </div>
                      </div>
                      <div className="h-1.5 w-full bg-[#F4F1EA] rounded-full overflow-hidden border border-[#D9D5CA]">
                        <div 
                          className="h-full bg-gradient-to-r from-[#536B58] to-[#B56B32] rounded-full"
                          style={{ width: `${f.score * 100 * 2.8}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Action Ribbon */}
              <div className="p-3 bg-[#FFFFFF] border border-[#D9D5CA] rounded flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2 text-xs font-mono text-[#536B58] font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Prospectivity Heatmap Layer activated on Central GIS Map.</span>
                </div>
                <button
                  onClick={() => navigate('/map')}
                  className="px-3 py-1.5 bg-[#24352B] hover:bg-[#2e4335] text-white border border-[#24352B] rounded font-mono text-xs font-semibold cursor-pointer transition-colors shadow-sm"
                >
                  VIEW SPATIAL HEATMAP
                </button>
              </div>
            </>
          ) : (
            <Card title="MODEL EVALUATION & PREDICTION HEATMAP">
              <EmptyState
                title="NO MODEL TRAINED"
                message="Select an algorithm and train the model using your georeferenced manganese assay data to view evaluation curves, confusion matrices, and spatial prospectivity heatmaps."
                icon={Cpu}
              />
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
