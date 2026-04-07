import type { UnifiedApiResponse, ExtractionResult } from '../types';


const API_BASE_URL = "http://172.168.1.205:31192/api/v1/verify"
// const API_BASE_URL = "http://11.0.0.37:8000/api/v1/verify";


export const verifyDocuments = async (
  panFile: File, 
  docFile: File, 
  docType: string, 
  language: string
): Promise<{ 
  panResults: ExtractionResult[], 
  docResults: ExtractionResult[], 
  panRawText: string,
  docRawText: string,
  summary: string 
}> => {
  const formData = new FormData();
  formData.append('pan_file', panFile);
  formData.append('doc_file', docFile);
  formData.append('doc_type', docType);
  formData.append('language', language);

  try {
    const response = await fetch(`${API_BASE_URL}`, {
      method: 'POST',
      headers: { 'accept': 'application/json' },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Verification failed: ${response.statusText}`);
    }

    const data: UnifiedApiResponse = await response.json();
    
    return {
      panResults: transformExtractionBlock(data.pan_extractions),
      docResults: transformExtractionBlock(data.doc_extractions),
      panRawText: data.pan_extractions?.M1?.raw_text || '',
      docRawText: data.doc_extractions?.M1?.raw_text || '',
      summary: data.verification?.summary || 'Verification Complete'
    };
  } catch (error) {
    console.error('Verification request failed:', error);
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
