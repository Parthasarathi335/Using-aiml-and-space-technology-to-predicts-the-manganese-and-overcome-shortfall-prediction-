import React from 'react';
import { Card } from '../ui/Card';

export function MetricCard({ title, value = '—', subtitle = 'Awaiting data', icon: Icon, trend }) {
  return (
    <Card className="min-w-[140px] flex-1">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[11px] font-mono uppercase text-[#687066] font-medium tracking-wider">
            {title}
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold font-mono text-[#20241F] tracking-tight">
              {value}
            </span>
            {trend && (
              <span className="text-[11px] font-mono text-[#687066]">
                {trend}
              </span>
            )}
          </div>
        </div>
        {Icon && (
          <div className="p-2 rounded bg-[#F4F1EA] border border-[#D9D5CA] text-[#B56B32]">
            <Icon className="w-4 h-4 text-[#B56B32]" />
          </div>
        )}
      </div>
      <div className="mt-2 text-[11px] font-mono text-[#687066]">
        {subtitle}
      </div>
    </Card>
  );
}
