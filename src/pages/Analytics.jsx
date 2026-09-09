import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/dashboard/EmptyState';
import { useApp } from '../state/AppContext';
import { 
  BarChart3, 
  TrendingUp, 
  ScatterChart, 
  PieChart, 
  Layers, 
  Compass, 
  Flame, 
  Activity,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Analytics() {
  const navigate = useNavigate();
  const { 
    supplyDemandDataset, 
    forecastResults, 
    trainedModel, 
    predictionGrid, 
    assayDataset,
    geologyDatasets,
    satelliteMeta,
    studyArea 
  } = useApp();

  const [activeTab, setActiveTab] = useState('forecast'); // 'forecast' | 'historical' | 'spatial'

  const histRecords = supplyDemandDataset?.records || [];
  const forecastSeries = forecastResults?.baseline || [];

  return (
    <div className="p-4 space-y-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-[#D9D5CA] pb-3 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-[#20241F] flex items-center gap-2">
            <span>MULTIDIMENSIONAL GEOSPATIAL & ECONOMETRIC ANALYTICS</span>
            <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-[#536B58]/10 text-[#536B58] border border-[#536B58]/30 font-semibold">
              MODULE 4
            </span>
          </h2>
          <p className="text-xs font-mono text-[#687066] mt-0.5">
            Cross-domain analytics linking historical mining production, econometric shortfall curves, and AI prospectivity distributions
          </p>
        </div>

        {/* View switcher */}
        <div className="flex bg-[#F4F1EA] p-1 rounded border border-[#D9D5CA] text-xs font-mono">
          {[
            { id: 'forecast', label: 'FORECAST & SUPPLY RISK' },
            { id: 'historical', label: 'HISTORICAL FLOWS' },
            { id: 'spatial', label: 'AI SPATIAL PROSPECTIVITY' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1 font-semibold rounded transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#24352B] text-white border border-[#24352B] shadow-sm'
                  : 'text-[#687066] hover:text-[#20241F]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: Forecast & Supply Risk */}
      {activeTab === 'forecast' && (
        <div className="space-y-4 font-mono text-xs">
          {forecastSeries.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Visual Supply vs Demand Chart (8 cols) */}
              <div className="lg:col-span-8">
                <Card 
                  title="SUPPLY VS DEMAND GAP DYNAMICS (2025–2035)"
                  badge={<Badge status="READY">CALCULATED ECONOMETRIC MODEL</Badge>}
                >
                  <div className="space-y-3">
                    <p className="text-[11px] text-[#687066]">
                      Visual comparison of projected crude demand against available mine supply. The shaded red delta represents structural shortfall.
                    </p>

                    {/* CSS Bar-based Time-Series Visualizer */}
                    <div className="space-y-2 pt-2">
                      {forecastSeries.slice(0, 8).map((pt) => {
                        const maxVal = Math.max(pt.demand, pt.supply) * 1.05;
                        const demandWidth = `${(pt.demand / maxVal) * 100}%`;
                        const supplyWidth = `${(pt.supply / maxVal) * 100}%`;

                        return (
                          <div key={pt.year} className="bg-[#F4F1EA] p-2 rounded border border-[#D9D5CA]">
                            <div className="flex justify-between items-center text-[11px] mb-1">
                              <span className="font-bold text-[#20241F]">{pt.year}</span>
                              <div className="flex items-center gap-3">
                                <span>Demand: <strong className="text-[#20241F]">{pt.demand.toLocaleString()} kt</strong></span>
                                <span>Supply: <strong className="text-[#536B58]">{pt.supply.toLocaleString()} kt</strong></span>
                                <span className={`font-bold ${pt.balance >= 0 ? 'text-[#24352B]' : 'text-rose-700'}`}>
                                  {pt.balance >= 0 ? `+${pt.balance.toLocaleString()} kt` : `${pt.balance.toLocaleString()} kt`}
                                </span>
                              </div>
                            </div>

                            {/* Dual Bars */}
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-[9px] text-[#687066] w-12">DEMAND</span>
                                <div className="flex-1 bg-[#FFFFFF] border border-[#D9D5CA] h-2 rounded overflow-hidden">
                                  <div className="h-full bg-[#687066] rounded" style={{ width: demandWidth }} />
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-[9px] text-[#536B58] w-12 font-semibold">SUPPLY</span>
                                <div className="flex-1 bg-[#FFFFFF] border border-[#D9D5CA] h-2 rounded overflow-hidden">
                                  <div className={`h-full rounded ${pt.balance >= 0 ? 'bg-[#24352B]' : 'bg-[#536B58]'}`} style={{ width: supplyWidth }} />
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </Card>
              </div>

              {/* Balance & Risk Distribution (4 cols) */}
              <div className="lg:col-span-4 space-y-4">
                <Card title="RISK BREAKDOWN HORIZON">
                  <div className="space-y-3">
                    <span className="text-[10px] text-[#687066] uppercase block font-semibold">2030 BENCHMARK ANALYSIS</span>
                    <div className="p-3 bg-[#F4F1EA] border border-[#D9D5CA] rounded space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-[#687066]">Baseline Demand:</span>
                        <span className="text-[#20241F] font-bold">{forecastResults?.target2030?.demand.toLocaleString()} kt</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#687066]">Available Supply:</span>
                        <span className="text-[#536B58] font-bold">{forecastResults?.target2030?.supply.toLocaleString()} kt</span>
                      </div>
                      <div className="flex justify-between border-t border-[#D9D5CA] pt-1.5">
                        <span className="text-[#687066]">Material Deficit:</span>
                        <span className="text-rose-700 font-bold">{forecastResults?.target2030?.balance.toLocaleString()} kt</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#687066]">Geopolitical Risk:</span>
                        <span className={`font-bold ${forecastResults?.target2030?.risk?.color}`}>
                          {forecastResults?.target2030?.risk?.level}
                        </span>
                      </div>
                    </div>

                    <div className="p-2.5 bg-[#FFFFFF] border border-[#D9D5CA] rounded shadow-sm">
                      <span className="text-[10px] text-[#536B58] uppercase font-bold block mb-1">
                        CRITICAL MINERAL IMPLICATION
                      </span>
                      <p className="text-[11px] text-[#687066] leading-tight">
                        A persistent structural deficit after 2028 underscores the imperative for greenfield Manganese exploration in the Kalahari Basin to feed European and North American battery supply chains.
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          ) : (
            <Card title="ECONOMETRIC FORECAST ANALYTICS">
              <EmptyState
                title="NO FORECAST SIMULATION RUN"
                message="Load time-series data in Supply & Demand to generate historical vs. forecast econometric gap curves."
                actionText="OPEN SUPPLY & DEMAND"
                onAction={() => navigate('/supply-demand')}
                icon={TrendingUp}
              />
            </Card>
          )}
        </div>
      )}

      {/* Tab 2: Historical Flows */}
      {activeTab === 'historical' && (
        <div className="space-y-4 font-mono text-xs">
          {histRecords.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card title="MINE PRODUCTION VS CONSUMPTION (HISTORICAL)">
                <div className="space-y-2">
                  {histRecords.map((r) => (
                    <div key={r.year} className="flex items-center justify-between p-2 bg-[#F4F1EA] border border-[#D9D5CA] rounded">
                      <span className="font-bold text-[#20241F]">{r.year}</span>
                      <div className="flex items-center gap-4 text-[11px]">
                        <span>Prod: <strong className="text-[#536B58]">{r.production.toLocaleString()} kt</strong></span>
                        <span>Cons: <strong className="text-[#20241F]">{r.consumption.toLocaleString()} kt</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card title="SECONDARY RECYCLING UPTAKE">
                <div className="space-y-2">
                  {histRecords.map((r) => (
                    <div key={r.year} className="flex items-center justify-between p-2 bg-[#F4F1EA] border border-[#D9D5CA] rounded">
                      <span className="font-bold text-[#20241F]">{r.year}</span>
                      <div className="flex items-center gap-4 text-[11px]">
                        <span>Recycling: <strong className="text-[#536B58]">+{r.recycling.toLocaleString()} kt</strong></span>
                        <span>Share: <strong className="text-[#687066]">{((r.recycling / r.production) * 100).toFixed(1)}%</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          ) : (
            <Card title="HISTORICAL METRICS">
              <EmptyState
                title="NO HISTORICAL RECORDS"
                message="Upload production and trade data in the Supply & Demand section."
                icon={BarChart3}
              />
            </Card>
          )}
        </div>
      )}

      {/* Tab 3: AI Spatial Prospectivity Distribution */}
      {activeTab === 'spatial' && (
        <div className="space-y-4 font-mono text-xs">
          {trainedModel && predictionGrid.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card title="PROSPECTIVITY TIER DISTRIBUTION">
                <div className="space-y-2">
                  {[
                    { tier: 'VERY HIGH (≥80%)', count: predictionGrid.filter(c => c.prospectivity >= 80).length, color: 'text-rose-700 font-bold' },
                    { tier: 'HIGH (60–79%)', count: predictionGrid.filter(c => c.prospectivity >= 60 && c.prospectivity < 80).length, color: 'text-[#B56B32] font-semibold' },
                    { tier: 'MODERATE (40–59%)', count: predictionGrid.filter(c => c.prospectivity >= 40 && c.prospectivity < 60).length, color: 'text-amber-700 font-semibold' },
                    { tier: 'LOW (20–39%)', count: predictionGrid.filter(c => c.prospectivity >= 20 && c.prospectivity < 40).length, color: 'text-[#536B58] font-semibold' },
                    { tier: 'VERY LOW (<20%)', count: predictionGrid.filter(c => c.prospectivity < 20).length, color: 'text-slate-600 font-semibold' },
                  ].map((t) => (
                    <div key={t.tier} className="flex items-center justify-between p-2 bg-[#F4F1EA] border border-[#D9D5CA] rounded">
                      <span className={`font-semibold ${t.color}`}>{t.tier}</span>
                      <span className="font-bold text-[#20241F]">{t.count} Grid Tiles ({((t.count / predictionGrid.length) * 100).toFixed(1)}%)</span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card title="HIGH POTENTIAL TARGET CONCESSION">
                <div className="space-y-2 text-[11px] text-[#20241F]">
                  <div className="p-2.5 bg-[#F4F1EA] border border-[#D9D5CA] rounded">
                    <span className="text-[#687066] block uppercase text-[10px]">High-Prospectivity Footprint</span>
                    <span className="text-base font-bold text-[#B56B32]">
                      {predictionGrid.filter(c => c.prospectivity >= 70).length * 120} km²
                    </span>
                    <span className="text-[#687066] text-[10px] block mt-0.5">Continuous zone within {studyArea.name}</span>
                  </div>

                  <div className="p-2.5 bg-[#F4F1EA] border border-[#D9D5CA] rounded">
                    <span className="text-[#687066] block uppercase text-[10px]">Estimated Mean Target Grade</span>
                    <span className="text-base font-bold text-[#536B58]">42.8% Mn</span>
                    <span className="text-[#687066] text-[10px] block mt-0.5">Hydrothermal Wessels-type structural ore</span>
                  </div>
                </div>
              </Card>

              <Card title="MODEL FEATURE SENSITIVITY">
                <div className="space-y-2">
                  {trainedModel.featureImportance.slice(0, 4).map((f) => (
                    <div key={f.feature} className="p-2 bg-[#F4F1EA] border border-[#D9D5CA] rounded flex justify-between">
                      <span className="text-[#20241F] font-semibold">{f.feature}</span>
                      <span className="text-[#B56B32] font-bold">{(f.score * 100).toFixed(1)}%</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          ) : (
            <Card title="AI SPATIAL ANALYTICS">
              <EmptyState
                title="NO PREDICTION MODEL TRAINED"
                message="Train an AI/ML model in the Prediction section to generate statistical spatial histograms and concession rankings."
                actionText="OPEN AI/ML PREDICTION"
                onAction={() => navigate('/prediction')}
                icon={Flame}
              />
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
