import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { useApp } from '../../state/AppContext';
import { Database, Activity } from 'lucide-react';

export function DataStatus() {
  const { dataStatus, demoMode } = useApp();

  const items = [
    { label: 'Satellite Data', key: 'satellite', val: dataStatus.satellite },
    { label: 'Geological Data', key: 'geology', val: dataStatus.geology },
    { label: 'Terrain Data', key: 'terrain', val: dataStatus.terrain },
    { label: 'Mn Labels', key: 'mnLabels', val: dataStatus.mnLabels },
    { label: 'ML Model', key: 'mlModel', val: dataStatus.mlModel },
    { label: 'Supply/Demand', key: 'supplyDemand', val: dataStatus.supplyDemand || 'NOT UPLOADED' },
  ];

  const isAllReady = Object.values(dataStatus).every(v => v === 'READY');
  const isAnyUploaded = Object.values(dataStatus).some(v => v !== 'NOT UPLOADED');
  
  const overallStatus = isAllReady 
    ? 'READY' 
    : isAnyUploaded 
      ? 'VALIDATING' 
      : 'AWAITING DATA';

  return (
    <Card 
      title="DATA STATUS" 
      badge={<Badge status={overallStatus}>{overallStatus}</Badge>}
      className="w-full"
    >
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.key} className="flex items-center justify-between text-xs font-mono py-1 border-b border-[#D9D5CA] last:border-0">
            <span className="text-[#687066]">{item.label}</span>
            <div className="flex items-center gap-2">
              <Badge status={item.val}>{item.val}</Badge>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 pt-2.5 border-t border-[#D9D5CA] flex items-center justify-between">
        <div className="flex items-center gap-2 text-[11px] text-[#687066] font-mono">
          <Activity className="w-3.5 h-3.5 text-[#B56B32]" />
          <span>SYSTEM PIPELINE</span>
        </div>
        <span className="text-[11px] font-mono text-[#687066]">
          {demoMode ? 'SIMULATION MODE' : 'STANDBY'}
        </span>
      </div>
    </Card>
  );
}
