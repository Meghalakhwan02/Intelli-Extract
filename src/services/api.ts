import type { ExtractionResult, PanFormData } from '../types';


const API_BASE_URL = "http://172.168.1.205:31192/api/v3"
// const API_BASE_URL = "http://11.0.0.37:8090/api/v3"
// const API_BASE_URL_V3 = "http://11.0.0.37:8090/api/v3"

export const recordPanDetails = async (
  data: PanFormData
): Promise<{ success: boolean; record_id: string }> => {
  const params = new URLSearchParams();
  params.append('fullName', data.fullName);
  params.append('gender', data.gender);
  params.append('dob', data.dob);
  params.append('address', data.address);
  params.append('fatherName', data.fatherName);

  const response = await fetch(`${API_BASE_URL}/record`, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  if (!response.ok) {
    throw new Error(`Record creation failed: ${response.statusText}`);
  }

  return await response.json();
};

export const analyzeDocument = async (
  file: File,
  docType: string,
  recordId: string
): Promise<{ 
  results: ExtractionResult[], 
  rawText: string,
  analyzedFileUrl: string,
  m1_image: string,
  m2_image: string,
  m3_image: string
}> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('doc_type', docType);
  formData.append('record_id', recordId);

  const response = await fetch(`${API_BASE_URL}/analyze`, {
    method: 'POST',
    headers: { 'accept': 'application/json' },
    body: formData,
  });

  if (!response.ok) {
    let errorMessage = `Analysis failed: ${response.statusText}`;
    try {
      const errorData = await response.json();
      if (errorData.detail) {
        // detail can be a string or an array of objects for validation errors
        errorMessage = typeof errorData.detail === 'string' 
          ? errorData.detail 
          : JSON.stringify(errorData.detail);
      }
    } catch (e) {
      // ignore parsing error if it's not JSON
    }
    throw new Error(errorMessage);
  }

  const data = await response.json();
  
  // Transform the response according to the provided JSON structure
  const annotatedImages = data.annotated_images || {};
  
  return {
    results: transformExtractionBlock(data.extractions),
    rawText: data.extractions?.M1?.raw_text || '',
    // Use M1 as default analyzedFileUrl
    analyzedFileUrl: annotatedImages.M1 ? `data:image/png;base64,${annotatedImages.M1}` : '',
    m1_image: annotatedImages.M1 ? `data:image/png;base64,${annotatedImages.M1}` : '',
    m2_image: annotatedImages.M2 ? `data:image/png;base64,${annotatedImages.M2}` : '',
    m3_image: annotatedImages.M3 ? `data:image/png;base64,${annotatedImages.M3}` : ''
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

