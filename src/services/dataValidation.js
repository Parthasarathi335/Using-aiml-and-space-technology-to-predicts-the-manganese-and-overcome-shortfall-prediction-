/**
 * Data Ingestion & Validation Service for Manganese AI Intelligence
 */

export function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return { headers: [], rows: [] };
  
  const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, ''));
  const rows = [];
  
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const values = lines[i].split(',').map(v => v.trim().replace(/^["']|["']$/g, ''));
    const row = {};
    headers.forEach((h, idx) => {
      row[h] = values[idx] !== undefined ? values[idx] : '';
    });
    rows.push(row);
  }
  
  return { headers, rows };
}

export function validateAssayDataset(rows, columnMapping) {
  let validRows = 0;
  let invalidRows = 0;
  let duplicates = 0;
  let outliers = 0;
  const seenCoords = new Set();
  const parsedRecords = [];
  const errors = [];

  const latCol = columnMapping.latitude;
  const lonCol = columnMapping.longitude;
  const gradeCol = columnMapping.Mn_grade;
  const sampleIdCol = columnMapping.sample_id;
  const rockTypeCol = columnMapping.rock_type;

  if (!latCol || !lonCol || !gradeCol) {
    errors.push('Missing essential column mappings: latitude, longitude, and Mn_grade must be mapped.');
    return {
      isValid: false,
      totalRows: rows.length,
      validRows: 0,
      invalidRows: rows.length,
      duplicates: 0,
      outliers: 0,
      records: [],
      errors,
    };
  }

  rows.forEach((row, index) => {
    const rawLat = parseFloat(row[latCol]);
    const rawLon = parseFloat(row[lonCol]);
    const rawGrade = parseFloat(row[gradeCol]);
    const sampleId = sampleIdCol && row[sampleIdCol] ? row[sampleIdCol] : `SAMPLE-${index + 1}`;
    const rockType = rockTypeCol && row[rockTypeCol] ? row[rockTypeCol] : 'Unknown';

    // Validate coordinates
    const isLatValid = !isNaN(rawLat) && rawLat >= -90 && rawLat <= 90;
    const isLonValid = !isNaN(rawLon) && rawLon >= -180 && rawLon <= 180;
    const isGradeValid = !isNaN(rawGrade) && rawGrade >= 0 && rawGrade <= 100; // Mn grade %

    if (!isLatValid || !isLonValid || !isGradeValid) {
      invalidRows++;
      return;
    }

    // Check duplicate coords
    const coordKey = `${rawLat.toFixed(5)}_${rawLon.toFixed(5)}`;
    if (seenCoords.has(coordKey)) {
      duplicates++;
    } else {
      seenCoords.add(coordKey);
    }

    // Outlier heuristic (Mn ore grade typically 5% to 65% in commercial deposits, >65% is pure Mn metal)
    const isOutlier = rawGrade > 65;
    if (isOutlier) {
      outliers++;
    }

    validRows++;
    parsedRecords.push({
      sampleId,
      latitude: rawLat,
      longitude: rawLon,
      mnGrade: rawGrade,
      rockType,
      fe: row[columnMapping.Fe] ? parseFloat(row[columnMapping.Fe]) : null,
      sio2: row[columnMapping.SiO2] ? parseFloat(row[columnMapping.SiO2]) : null,
      isOutlier,
    });
  });

  return {
    isValid: validRows > 0,
    totalRows: rows.length,
    validRows,
    invalidRows,
    duplicates,
    outliers,
    records: parsedRecords,
    errors,
  };
}

export function validateGeoJSON(jsonObj) {
  if (!jsonObj || typeof jsonObj !== 'object') {
    return { isValid: false, error: 'Invalid JSON format.' };
  }
  if (jsonObj.type !== 'FeatureCollection' && jsonObj.type !== 'Feature') {
    return { isValid: false, error: 'GeoJSON must be FeatureCollection or Feature.' };
  }
  const features = jsonObj.type === 'FeatureCollection' ? jsonObj.features : [jsonObj];
  if (!Array.isArray(features) || features.length === 0) {
    return { isValid: false, error: 'GeoJSON contains no features.' };
  }
  return { isValid: true, featureCount: features.length, features };
}
