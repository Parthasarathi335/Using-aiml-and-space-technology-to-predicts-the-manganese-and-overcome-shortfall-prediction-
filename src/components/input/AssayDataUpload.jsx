import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { useApp } from '../../state/AppContext';
import { FileSpreadsheet, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { parseCSV, validateAssayDataset } from '../../services/dataValidation';

const REQUIRED_VARS = [
  { key: 'latitude', label: 'Latitude (decimal degrees)', required: true },
  { key: 'longitude', label: 'Longitude (decimal degrees)', required: true },
  { key: 'Mn_grade', label: 'Mn Grade (%)', required: true },
  { key: 'rock_type', label: 'Rock Type / Lithology', required: false },
  { key: 'sample_id', label: 'Sample ID', required: false },
  { key: 'Fe', label: 'Fe (%) [Optional]', required: false },
  { key: 'SiO2', label: 'SiO2 (%) [Optional]', required: false },
];

export function AssayDataUpload() {
  const { 
    assayDataset, 
    setAssayDataset, 
    setDataStatus, 
    addProvenance 
  } = useApp();

  const [rawHeaders, setRawHeaders] = useState([]);
  const [rawRows, setRawRows] = useState([]);
  const [columnMapping, setColumnMapping] = useState({
    latitude: '',
    longitude: '',
    Mn_grade: '',
    rock_type: '',
    sample_id: '',
    Fe: '',
    SiO2: '',
  });

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const { headers, rows } = parseCSV(text);
      setRawHeaders(headers);
      setRawRows(rows);

      // Auto-suggest mapping
      const autoMap = {};
      headers.forEach((h) => {
        const lower = h.toLowerCase();
        if (lower.includes('lat')) autoMap.latitude = h;
        else if (lower.includes('lon') || lower.includes('lng')) autoMap.longitude = h;
        else if (lower.includes('mn') || lower.includes('grade') || lower.includes('target')) autoMap.Mn_grade = h;
        else if (lower.includes('rock') || lower.includes('lith')) autoMap.rock_type = h;
        else if (lower.includes('id') || lower.includes('sample')) autoMap.sample_id = h;
        else if (lower === 'fe' || lower.includes('iron')) autoMap.Fe = h;
        else if (lower.includes('sio2') || lower.includes('silica')) autoMap.SiO2 = h;
      });

      setColumnMapping((prev) => ({ ...prev, ...autoMap }));
      executeValidation(rows, { ...columnMapping, ...autoMap }, file.name);
    };
    reader.readAsText(file);
  };

  const executeValidation = (rows, mapping, filename = 'manganese_assays.csv') => {
    const report = validateAssayDataset(rows, mapping);
    const completeDataset = {
      filename,
      columnMapping: mapping,
      validationReport: report,
      records: report.records,
    };
    setAssayDataset(completeDataset);
    if (report.isValid) {
      setDataStatus((prev) => ({ ...prev, mnLabels: 'READY' }));
      addProvenance({
        datasetName: filename,
        fileType: 'CSV Georeferenced Mn Assay Records',
        crs: 'WGS84 (EPSG:4326)',
        coverage: `${report.validRows} Valid Drillhole / Deposit Samples`,
        validationStatus: 'READY',
        processingStatus: 'Ground Truth Validated',
      });
    } else {
      setDataStatus((prev) => ({ ...prev, mnLabels: 'ERROR' }));
    }
  };

  const handleLoadSampleCSV = () => {
    // Representative high-grade Manganese field samples (Kalahari Basin: Nchwaning, Wessels, Hotazel)
    const sampleHeaders = ['sample_id', 'latitude', 'longitude', 'Mn_grade_pct', 'lithology', 'Fe_pct', 'SiO2_pct'];
    const sampleRows = [
      { sample_id: 'NCH-DH-01', latitude: '-27.1245', longitude: '22.8412', Mn_grade_pct: '48.5', lithology: 'Hotazel Manganiferous BIF', Fe_pct: '8.2', SiO2_pct: '4.1' },
      { sample_id: 'NCH-DH-02', latitude: '-27.1350', longitude: '22.8550', Mn_grade_pct: '52.1', lithology: 'Braunite-Rich High Grade Ore', Fe_pct: '6.4', SiO2_pct: '3.8' },
      { sample_id: 'WES-DH-01', latitude: '-27.1890', longitude: '22.8901', Mn_grade_pct: '44.8', lithology: 'Carbonate-Rich Ore Bed', Fe_pct: '11.5', SiO2_pct: '5.2' },
      { sample_id: 'HOT-DH-03', latitude: '-27.2340', longitude: '22.9210', Mn_grade_pct: '37.2', lithology: 'Ferruginous Mn Ore', Fe_pct: '16.0', SiO2_pct: '7.4' },
      { sample_id: 'BLR-DH-09', latitude: '-27.0980', longitude: '22.8105', Mn_grade_pct: '55.3', lithology: 'Hausmannite Massive Ore', Fe_pct: '4.9', SiO2_pct: '2.9' },
      { sample_id: 'KUR-DH-14', latitude: '-27.4500', longitude: '23.4300', Mn_grade_pct: '24.1', lithology: 'Low-Grade Dolomitic Mn', Fe_pct: '19.2', SiO2_pct: '12.0' },
      { sample_id: 'SMT-DH-05', latitude: '-27.3100', longitude: '23.0150', Mn_grade_pct: '41.6', lithology: 'Hotazel Member 1', Fe_pct: '10.1', SiO2_pct: '6.2' },
      { sample_id: 'MAM-DH-02', latitude: '-27.3820', longitude: '23.1200', Mn_grade_pct: '39.8', lithology: 'Wessels-Type Hydrothermal Ore', Fe_pct: '9.3', SiO2_pct: '5.8' },
    ];

    setRawHeaders(sampleHeaders);
    setRawRows(sampleRows);

    const initialMap = {
      latitude: 'latitude',
      longitude: 'longitude',
      Mn_grade: 'Mn_grade_pct',
      rock_type: 'lithology',
      sample_id: 'sample_id',
      Fe: 'Fe_pct',
      SiO2: 'SiO2_pct',
    };
    setColumnMapping(initialMap);
    executeValidation(sampleRows, initialMap, 'Kalahari_Mn_Drillhole_Assays.csv');
  };

  const handleMapChange = (systemVar, rawCol) => {
    const updated = { ...columnMapping, [systemVar]: rawCol };
    setColumnMapping(updated);
    if (rawRows.length > 0) {
      executeValidation(rawRows, updated, assayDataset?.filename || 'custom_assays.csv');
    }
  };

  const report = assayDataset?.validationReport;

  return (
    <Card 
      title="MANGANESE GROUND TRUTH & DRILLHOLE ASSAYS"
      badge={
        assayDataset 
          ? <Badge status={report?.isValid ? 'READY' : 'ERROR'}>{report?.isValid ? 'VALIDATED' : 'ERROR'}</Badge>
          : <Badge status="NOT UPLOADED">NOT UPLOADED</Badge>
      }
    >
      <div className="space-y-4 text-xs font-mono">
        {/* Upload Action */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#F4F1EA] border border-[#D9D5CA] rounded">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-[#B56B32]" />
            <div>
              <span className="text-[#20241F] font-semibold block">Assay CSV File</span>
              <span className="text-[11px] text-[#687066]">Upload drillhole geochemistry with sample locations and Manganese grades</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="px-3 py-1.5 bg-[#24352B] hover:bg-[#2e4335] text-white border border-[#24352B] rounded cursor-pointer transition-colors shadow-sm font-semibold">
              <span>UPLOAD CSV</span>
              <input
                type="file"
                accept=".csv,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            <button
              onClick={handleLoadSampleCSV}
              className="px-3 py-1.5 bg-[#FFFFFF] hover:bg-[#F4F1EA] text-[#20241F] border border-[#D9D5CA] rounded cursor-pointer transition-colors font-medium shadow-sm"
            >
              LOAD SAMPLE ASSAYS
            </button>
          </div>
        </div>

        {/* Column Mapping Interface */}
        {rawHeaders.length > 0 && (
          <div className="bg-[#F4F1EA] border border-[#D9D5CA] rounded p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-[#687066] font-bold uppercase tracking-wider">
                INTELLIGENT COLUMN MAPPING (YOUR CSV → SYSTEM VARIABLES)
              </span>
              <span className="text-[10px] text-[#687066]">
                No manual column renaming required
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
              {REQUIRED_VARS.map((item) => (
                <div key={item.key} className="bg-[#FFFFFF] p-2 rounded border border-[#D9D5CA] shadow-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-[#20241F] font-semibold">
                      {item.label}
                    </span>
                    {item.required && (
                      <span className="text-[9px] text-rose-600 uppercase font-bold">*req</span>
                    )}
                  </div>
                  <select
                    value={columnMapping[item.key] || ''}
                    onChange={(e) => handleMapChange(item.key, e.target.value)}
                    className="w-full bg-[#FFFFFF] border border-[#D9D5CA] rounded px-1.5 py-1 text-[#20241F] font-mono text-xs focus:outline-none focus:border-[#536B58] cursor-pointer"
                  >
                    <option value="">[ Unmapped ]</option>
                    {rawHeaders.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Validation Summary Metrics */}
        {report && (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 bg-[#F4F1EA] border border-[#D9D5CA] rounded p-3">
            <div>
              <span className="text-[10px] text-[#687066] block uppercase">TOTAL ROWS</span>
              <span className="text-base font-bold text-[#20241F]">{report.totalRows}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#536B58] block uppercase font-semibold">VALID ROWS</span>
              <span className="text-base font-bold text-[#536B58]">{report.validRows}</span>
            </div>
            <div>
              <span className="text-[10px] text-rose-600 block uppercase font-semibold">INVALID ROWS</span>
              <span className="text-base font-bold text-rose-600">{report.invalidRows}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#B56B32] block uppercase font-semibold">DUPLICATES</span>
              <span className="text-base font-bold text-[#B56B32]">{report.duplicates}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#24352B] block uppercase font-semibold">OUTLIERS (&gt;65%)</span>
              <span className="text-base font-bold text-[#24352B]">{report.outliers}</span>
            </div>
          </div>
        )}

        {/* Preview Table */}
        {assayDataset?.records && assayDataset.records.length > 0 && (
          <div className="border border-[#D9D5CA] rounded bg-[#FFFFFF] overflow-hidden shadow-sm">
            <div className="px-3 py-1.5 bg-[#F4F1EA] border-b border-[#D9D5CA] flex items-center justify-between text-[11px] text-[#687066] font-semibold">
              <span>VALIDATED GROUND TRUTH PREVIEW (FIRST {Math.min(assayDataset.records.length, 6)} SAMPLES)</span>
              <span className="text-[#536B58]">{assayDataset.records.length} geocoded assay points ready for Leaflet Map</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px]">
                <thead className="text-[#687066] border-b border-[#D9D5CA] bg-[#F4F1EA]/60">
                  <tr>
                    <th className="py-2 px-3">Sample ID</th>
                    <th className="py-2 px-3">Latitude</th>
                    <th className="py-2 px-3">Longitude</th>
                    <th className="py-2 px-3">Mn Grade (%)</th>
                    <th className="py-2 px-3">Rock Type</th>
                    <th className="py-2 px-3">Fe (%)</th>
                    <th className="py-2 px-3">SiO2 (%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D9D5CA] text-[#20241F]">
                  {assayDataset.records.slice(0, 6).map((rec, i) => (
                    <tr key={i} className="hover:bg-[#F4F1EA]/60">
                      <td className="py-1.5 px-3 font-semibold text-[#20241F]">{rec.sampleId}</td>
                      <td className="py-1.5 px-3 font-mono text-[#687066]">{rec.latitude.toFixed(4)}</td>
                      <td className="py-1.5 px-3 font-mono text-[#687066]">{rec.longitude.toFixed(4)}</td>
                      <td className="py-1.5 px-3 font-mono text-[#B56B32] font-bold">{rec.mnGrade}%</td>
                      <td className="py-1.5 px-3 text-[#687066]">{rec.rockType}</td>
                      <td className="py-1.5 px-3 font-mono text-[#687066]">{rec.fe !== null ? `${rec.fe}%` : '—'}</td>
                      <td className="py-1.5 px-3 font-mono text-[#687066]">{rec.sio2 !== null ? `${rec.sio2}%` : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
