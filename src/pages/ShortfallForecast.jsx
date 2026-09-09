import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/dashboard/EmptyState';
import { useApp } from '../state/AppContext';
import { generateSupplyForecast } from '../services/forecastingService';
import { 
  AlertOctagon, 
  TrendingDown, 
  TrendingUp, 
  Calendar, 
  Sliders, 
  Compass, 
  ShieldAlert,
  ArrowRight,
  Cpu
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function ShortfallForecast() {
  const navigate = useNavigate();
  const { 
    supplyDemandDataset, 
    forecastHorizon, 
    setForecastHorizon,
    forecastModelType, 
    setForecastModelType,
    scenarioModifiers, 
    setScenarioModifiers,
    forecastResults, 
    setForecastResults,
    addProvenance 
  } = useApp();

  const [selectedScenarioTab, setSelectedScenarioTab] = useState('baseline'); // 'baseline' | 'conservative' | 'highDemand' | 'comparison'

  const records = supplyDemandDataset?.records || [];

  const handleRunForecast = (newHorizon = forecastHorizon, newModifiers = scenarioModifiers) => {
    if (records.length < 3) return;
    const res = generateSupplyForecast(records, newHorizon, newModifiers);
    setForecastResults(res);
    addProvenance({
      datasetName: `Econometric Supply Forecast (${newHorizon} Years, ${forecastModelType.toUpperCase()})`,
      fileType: 'Forecast Simulation Matrix',
      crs: 'Temporal Global Outlook',
      coverage: `Projection Years: ${res.startYear} to ${res.endYear}`,
      validationStatus: 'READY',
      processingStatus: 'Forecast Generated',
    });
  };

  const handleModifierChange = (key, value) => {
    const updated = { ...scenarioModifiers, [key]: parseFloat(value) || 0 };
    setScenarioModifiers(updated);
    handleRunForecast(forecastHorizon, updated);
  };

  const target2030 = forecastResults?.target2030;
  const currentSeries = forecastResults ? forecastResults[selectedScenarioTab] || forecastResults.baseline : [];

  return (
    <div className="p-4 space-y-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-[#D9D5CA] pb-3 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-[#20241F] flex items-center gap-2">
            <span>MANGANESE SUPPLY DEFICIT & SHORTFALL FORECAST</span>
            <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-[#536B58]/10 text-[#536B58] border border-[#536B58]/30 font-semibold">
              MODULE 4
            </span>
          </h2>
          <p className="text-xs font-mono text-[#687066] mt-0.5">
            Econometric projections across 5, 10, 15, and 20-year horizons with multilateral EV and steel scenario stress-testing
          </p>
        </div>

        {/* Horizon Selector */}
        <div className="flex bg-[#F4F1EA] p-1 rounded border border-[#D9D5CA] font-mono text-xs">
          {[5, 10, 15, 20].map((h) => (
            <button
              key={h}
              onClick={() => {
                setForecastHorizon(h);
                handleRunForecast(h, scenarioModifiers);
              }}
              className={`px-3 py-1 font-semibold rounded transition-colors cursor-pointer ${
                forecastHorizon === h
                  ? 'bg-[#24352B] text-white border border-[#24352B] shadow-sm'
                  : 'text-[#687066] hover:text-[#20241F]'
              }`}
            >
              {h} YEARS
            </button>
          ))}
        </div>
      </div>

      {/* No Dataset Warning */}
      {records.length === 0 && (
        <Card title="FORECAST ENGINE STANDBY">
          <EmptyState
            title="NO HISTORICAL SUPPLY DATA LOADED"
            message="Ingest historical production and consumption time series in Supply & Demand to compute econometric shortfall trajectories."
            actionText="GO TO SUPPLY & DEMAND"
            onAction={() => navigate('/supply-demand')}
            icon={Calendar}
          />
        </Card>
      )}

      {records.length > 0 && (
        <>
          {/* Key Horizon Snapshot (2030 Benchmark) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono">
            <Card className="bg-[#FFFFFF] border border-[#D9D5CA] shadow-sm">
              <span className="text-[10px] text-[#687066] block uppercase">2030 FORECAST DEMAND</span>
              <span className="text-xl font-bold text-[#20241F] mt-1 block">
                {target2030 ? `${target2030.demand.toLocaleString()} kt` : '—'}
              </span>
              <span className="text-[10px] text-[#687066] mt-1 block">Steelmaking + EV Battery HPMSM</span>
            </Card>

            <Card className="bg-[#FFFFFF] border border-[#D9D5CA] shadow-sm">
              <span className="text-[10px] text-[#687066] block uppercase">2030 AVAILABLE SUPPLY</span>
              <span className="text-xl font-bold text-[#536B58] mt-1 block">
                {target2030 ? `${target2030.supply.toLocaleString()} kt` : '—'}
              </span>
              <span className="text-[10px] text-[#687066] mt-1 block">Production + Net Trade + Recycling</span>
            </Card>

            <Card className="bg-[#FFFFFF] border border-[#D9D5CA] shadow-sm">
              <span className="text-[10px] text-[#687066] block uppercase">2030 MATERIAL BALANCE</span>
              <span className={`text-xl font-bold mt-1 block ${target2030?.balance >= 0 ? 'text-[#24352B]' : 'text-rose-700'}`}>
                {target2030 ? (target2030.balance >= 0 ? `+${target2030.balance.toLocaleString()} kt (SURPLUS)` : `${target2030.balance.toLocaleString()} kt (DEFICIT)`) : '—'}
              </span>
              <span className="text-[10px] text-[#687066] mt-1 block">Shortfall = Demand - Available Supply</span>
            </Card>

            <Card className="bg-[#FFFFFF] border border-[#D9D5CA] shadow-sm">
              <span className="text-[10px] text-[#687066] block uppercase">2030 GEOPOLITICAL RISK</span>
              <div className="mt-1 flex items-center gap-2">
                {target2030 ? (
                  <span className={`text-xl font-bold ${target2030.risk.color}`}>
                    {target2030.risk.level} RISK
                  </span>
                ) : '—'}
              </div>
              <span className="text-[10px] text-[#687066] mt-1 block">Deficit Severity Index (Explainable)</span>
            </Card>
          </div>

          {/* Scenario Parameters & Engine Controls */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left: Scenario Modifiers (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              <Card 
                title="SCENARIO STRESS TEST PARAMETERS" 
                badge={<Badge status="READY">CONFIGURABLE</Badge>}
              >
                <div className="space-y-3.5 text-xs font-mono">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-[#20241F] font-semibold">Crude Steel Demand Growth</span>
                      <span className="text-[#B56B32] font-bold">{scenarioModifiers.steelGrowthPct}% / yr</span>
                    </div>
                    <input
                      type="range"
                      min="0.0"
                      max="4.0"
                      step="0.1"
                      value={scenarioModifiers.steelGrowthPct}
                      onChange={(e) => handleModifierChange('steelGrowthPct', e.target.value)}
                      className="w-full accent-[#B56B32] cursor-pointer"
                    />
                    <div className="flex justify-between text-[9px] text-[#687066]">
                      <span>0.0% (Stagnant)</span>
                      <span>1.5% (Baseline)</span>
                      <span>4.0% (Boom)</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-[#20241F] font-semibold">HPMSM EV Battery Demand Growth</span>
                      <span className="text-[#B56B32] font-bold">{scenarioModifiers.batteryGrowthPct}% / yr</span>
                    </div>
                    <input
                      type="range"
                      min="5.0"
                      max="30.0"
                      step="1.0"
                      value={scenarioModifiers.batteryGrowthPct}
                      onChange={(e) => handleModifierChange('batteryGrowthPct', e.target.value)}
                      className="w-full accent-[#B56B32] cursor-pointer"
                    />
                    <div className="flex justify-between text-[9px] text-[#687066]">
                      <span>5% (Slow Transition)</span>
                      <span>14% (Base IEA)</span>
                      <span>30% (High LMFP)</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-[#20241F] font-semibold">Mine Expansion Capacity Growth</span>
                      <span className="text-[#B56B32] font-bold">{scenarioModifiers.capacityGrowthPct}% / yr</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="6.0"
                      step="0.1"
                      value={scenarioModifiers.capacityGrowthPct}
                      onChange={(e) => handleModifierChange('capacityGrowthPct', e.target.value)}
                      className="w-full accent-[#B56B32] cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-[#20241F] font-semibold">Secondary Recycling Growth</span>
                      <span className="text-[#B56B32] font-bold">{scenarioModifiers.recyclingGrowthPct}% / yr</span>
                    </div>
                    <input
                      type="range"
                      min="2.0"
                      max="15.0"
                      step="0.5"
                      value={scenarioModifiers.recyclingGrowthPct}
                      onChange={(e) => handleModifierChange('recyclingGrowthPct', e.target.value)}
                      className="w-full accent-[#B56B32] cursor-pointer"
                    />
                  </div>

                  {/* Risk Methodology Explanation */}
                  <div className="p-2.5 bg-[#F4F1EA] border border-[#D9D5CA] rounded space-y-1">
                    <span className="text-[10px] text-[#20241F] uppercase font-bold block">
                      EXPLAINABLE RISK CLASSIFICATION METHODOLOGY
                    </span>
                    <p className="text-[10px] text-[#687066] leading-tight">
                      • <strong className="text-[#24352B]">LOW:</strong> Supply meets or exceeds demand.<br />
                      • <strong className="text-[#536B58]">MODERATE:</strong> Structural shortfall &le; 7% of demand.<br />
                      • <strong className="text-[#B56B32]">HIGH:</strong> Deficit between 7% and 18% of demand.<br />
                      • <strong className="text-rose-700">CRITICAL:</strong> Severe deficit &gt; 18% of demand with acute supply risk.
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Right: Scenario Multi-Curve Table & Outlook (8 cols) */}
            <div className="lg:col-span-8 space-y-4">
              <Card
                title="ECONOMETRIC TRAJECTORY & TIME-SERIES FORECAST"
                badge={<Badge status="READY">{forecastHorizon} YEARS HORIZON</Badge>}
              >
                <div className="space-y-3 text-xs font-mono">
                  {/* Scenario switcher */}
                  <div className="flex bg-[#F4F1EA] p-1 rounded border border-[#D9D5CA] text-xs">
                    {[
                      { id: 'baseline', label: '1. BASELINE SCENARIO' },
                      { id: 'conservative', label: '2. CONSERVATIVE SCENARIO' },
                      { id: 'highDemand', label: '3. HIGH DEMAND SCENARIO' },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setSelectedScenarioTab(tab.id)}
                        className={`px-3 py-1.5 font-semibold rounded transition-colors cursor-pointer ${
                          selectedScenarioTab === tab.id
                            ? 'bg-[#24352B] text-white border border-[#24352B] shadow-sm'
                            : 'text-[#687066] hover:text-[#20241F]'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Trajectory Table */}
                  <div className="overflow-x-auto border border-[#D9D5CA] rounded bg-[#FFFFFF] shadow-sm">
                    <table className="w-full text-left text-[11px]">
                      <thead className="bg-[#F4F1EA] text-[#687066] uppercase font-semibold border-b border-[#D9D5CA]">
                        <tr>
                          <th className="py-2 px-3">Forecast Year</th>
                          <th className="py-2 px-3 text-right">Forecast Demand (kt)</th>
                          <th className="py-2 px-3 text-right font-bold text-[#536B58]">Available Supply (kt)</th>
                          <th className="py-2 px-3 text-right font-bold">Balance (kt)</th>
                          <th className="py-2 px-3 text-right">Shortfall (kt)</th>
                          <th className="py-2 px-3 text-center">Risk Level</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#D9D5CA] text-[#20241F]">
                        {currentSeries.map((row) => (
                          <tr key={row.year} className="hover:bg-[#F4F1EA]/60">
                            <td className="py-1.5 px-3 font-bold text-[#20241F]">{row.year}</td>
                            <td className="py-1.5 px-3 text-right">{row.demand.toLocaleString()}</td>
                            <td className="py-1.5 px-3 text-right text-[#536B58] font-bold">{row.supply.toLocaleString()}</td>
                            <td className={`py-1.5 px-3 text-right font-bold ${row.balance >= 0 ? 'text-[#24352B]' : 'text-rose-700'}`}>
                              {row.balance >= 0 ? `+${row.balance.toLocaleString()}` : row.balance.toLocaleString()}
                            </td>
                            <td className="py-1.5 px-3 text-right font-bold text-rose-700">
                              {row.shortfall > 0 ? `${row.shortfall.toLocaleString()} kt` : '—'}
                            </td>
                            <td className="py-1.5 px-3 text-center">
                              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${row.risk.bg} ${row.risk.color}`}>
                                {row.risk.level}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
