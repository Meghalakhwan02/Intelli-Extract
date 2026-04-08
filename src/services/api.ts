import type { ExtractionResult } from '../types';


const API_BASE_URL = "http://172.168.1.205:31192/api/v2"

// const API_BASE_URL_V2 = "http://11.0.0.37:8000/api/v2";

export const extractPan = async (
  file: File
): Promise<{ 
  results: ExtractionResult[], 
  rawText: string,
  rawExtractions: any 
}> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/extract`, {
    method: 'POST',
    headers: { 'accept': 'application/json' },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`PAN Extraction failed: ${response.statusText}`);
  }

  const data = await response.json();
  return {
    results: transformExtractionBlock(data.extractions),
    rawText: data.extractions?.M1?.raw_text || '',
    rawExtractions: data.extractions
  };
};

export const verifySecondary = async (
  panExtractions: any,
  docFile: File,
  docType: string,
  language: string
): Promise<{ 
  results: ExtractionResult[], 
  rawText: string,
  summary: string 
}> => {
  const formData = new FormData();
  formData.append('pan_extractions', JSON.stringify({ extractions: panExtractions }));
  formData.append('doc_file', docFile);
  formData.append('doc_type', docType);
  formData.append('language', language);

  const response = await fetch(`${API_BASE_URL}/verify`, {
    method: 'POST',
    headers: { 'accept': 'application/json' },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Verification failed: ${response.statusText}`);
  }

  const data = await response.json();
  
  return {
    results: transformExtractionBlock(data.doc_extractions),
    rawText: data.doc_extractions?.M1?.raw_text || '',
    summary: data.verification?.summary || 'Verification Complete'
  };
};


const findValue = (obj: any, key: string) => {
  if (!obj) return undefined;
  if (obj[key] !== undefined) return obj[key];
  const foundKey = Object.keys(obj).find(k => k.toLowerCase() === key.toLowerCase());
  return foundKey ? obj[foundKey] : undefined;
};

const formatValue = (val: any) => {
  if (val === null) return 'null';
  if (val === undefined) return '-';
  return String(val);
};

const transformExtractionBlock = (block: any): ExtractionResult[] => {
  if (!block?.confidence_matrix) return [];

  const { confidence_matrix, M1, M2, M3 } = block;

  return Object.keys(confidence_matrix)
    .map(key => {
      const score = confidence_matrix[key].consensus_score;

      const m1Val = findValue(M1, key);
      const m2Val = findValue(M2, key);
      const m3Val = findValue(M3, key);

      return {
        attribute: key,
        m1: formatValue(m1Val),
        m2: formatValue(m2Val),
        m3: formatValue(m3Val),
        score: score
      };
    });
};

