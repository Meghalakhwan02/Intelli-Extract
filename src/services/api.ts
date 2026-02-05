import type { ApiResponse, ExtractionResult } from '../types';

const API_BASE_URL = window.__ENV__?.VITE_API_BASE_URL || import.meta.env.VITE_API_BASE_URL || '';

export const uploadDocument = async (file: File, docType: string): Promise<ExtractionResult[]> => {
  console.log('uploadDocument called with:', { file: file.name, docType });
  const formData = new FormData();
  formData.append('file', file);
  formData.append('doc_type', docType);

  try {
    const response = await fetch(`${API_BASE_URL}`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data: ApiResponse = await response.json(); //Get the raw json
    return transformApiResponse(data); // Transform it for the UI
  } catch (error) {
    console.error('Extraction failed:', error);
    throw error;
  }
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

const transformApiResponse = (data: ApiResponse): ExtractionResult[] => {
  if (!data?.results?.confidence_matrix) return [];

  const { confidence_matrix, extractions } = data.results;

  return Object.keys(confidence_matrix)
    .filter(key => key !== 'raw_text') // Exclude raw_text from table
    .map(key => {
      const score = confidence_matrix[key].consensus_score;

      const m1Val = findValue(extractions.M1, key);
      const m2Val = findValue(extractions.M2, key);
      const m3Val = findValue(extractions.M3, key);

      return {
        attribute: key,
        m1: formatValue(m1Val),
        m2: formatValue(m2Val),
        m3: formatValue(m3Val),
        score: score
      };
    });
};
