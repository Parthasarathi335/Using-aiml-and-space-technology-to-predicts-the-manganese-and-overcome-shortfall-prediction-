import React from 'react';
import { Card } from '../ui/Card';
import { Info } from 'lucide-react';

export function MapLegend({ hasPrediction = false }) {
  return (
    <Card 
      title="MANGANESE PROSPECTIVITY" 
      className="bg-[#FFFFFF]/95 backdrop-blur-md border border-[#D9D5CA] shadow-lg min-w-[250px] max-w-[280px]"
    >
      {hasPrediction ? (
        <div className="space-y-2 font-mono">
          <div className="flex justify-between text-[10px] text-[#687066] font-semibold">
            <span>0%</span>
            <span>100%</span>
          </div>
          
          <div className="h-3 w-full rounded-sm bg-gradient-to-r from-[#64748b] via-[#536B58] via-[#d97706] via-[#B56B32] to-[#b91c1c] border border-[#D9D5CA]" />
          
          <div className="grid grid-cols-5 gap-1 text-[9px] text-center text-[#20241F] mt-1 font-medium">
            <span className="text-slate-600">V. LOW</span>
            <span className="text-[#536B58]">LOW</span>
            <span className="text-amber-700">MOD</span>
            <span className="text-[#B56B32]">HIGH</span>
            <span className="text-rose-700 font-bold">V. HIGH</span>
          </div>

          <div className="pt-2 border-t border-[#D9D5CA] text-[9px] text-[#687066] leading-tight">
            Prospectivity values represent model predictions and are not direct measurements of manganese concentration.
          </div>
        </div>
      ) : (
        <div className="py-2 text-center space-y-1 font-mono">
          <div className="inline-flex items-center gap-1.5 text-[11px] text-[#B56B32] font-semibold">
            <Info className="w-3.5 h-3.5" />
            <span>NO PREDICTION AVAILABLE</span>
          </div>
          <p className="text-[10px] text-[#687066] leading-tight">
            Train a model in AI/ML Prediction to generate prospectivity heatmap.
          </p>
        </div>
      )}
    </Card>
  );
}
