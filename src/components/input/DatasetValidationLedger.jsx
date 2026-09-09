import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { useApp } from '../../state/AppContext';
import { ShieldCheck, Database, History } from 'lucide-react';

export function DatasetValidationLedger() {
  const { provenanceLedger, dataStatus } = useApp();

  return (
    <Card 
      title="DATASET PROVENANCE & VALIDATION LEDGER"
      badge={<Badge status="READY">{provenanceLedger.length} AUDITED SOURCES</Badge>}
    >
      <div className="space-y-3 text-xs font-mono">
        <p className="text-[#687066] text-[11px]">
          Audited record of ingested layers, spatial CRS projections, verification timestamps, and validity checks. Future ML models cite this ledger for reproducibility.
        </p>

        <div className="overflow-x-auto border border-[#D9D5CA] rounded bg-[#FFFFFF] shadow-sm">
          <table className="w-full text-left text-[11px]">
            <thead className="bg-[#F4F1EA] text-[#687066] uppercase font-semibold border-b border-[#D9D5CA]">
              <tr>
                <th className="py-2 px-3">Dataset Name</th>
                <th className="py-2 px-3">File Type</th>
                <th className="py-2 px-3">Ingestion Time</th>
                <th className="py-2 px-3">Spatial CRS</th>
                <th className="py-2 px-3">Spatial Coverage / Extent</th>
                <th className="py-2 px-3">Validation Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D9D5CA] text-[#20241F]">
              {provenanceLedger.map((item) => (
                <tr key={item.id} className="hover:bg-[#F4F1EA]/60">
                  <td className="py-2 px-3 font-semibold text-[#20241F]">{item.datasetName}</td>
                  <td className="py-2 px-3 text-[#687066]">{item.fileType}</td>
                  <td className="py-2 px-3 text-[#687066]">{item.uploadTime}</td>
                  <td className="py-2 px-3 text-[#536B58] font-medium">{item.crs}</td>
                  <td className="py-2 px-3">{item.coverage}</td>
                  <td className="py-2 px-3">
                    <Badge status={item.validationStatus}>{item.validationStatus}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  );
}
