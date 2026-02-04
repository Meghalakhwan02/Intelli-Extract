# API Integration Guide

This document explains how the frontend connects to the AI extraction backend, specifically focusing on `src/services/api.ts` and the data flow.

## 1. Overview
The file `src/services/api.ts` acts as a dedicated service layer. Its job is to:
1.  Accept a file and document type from the UI.
2.  Format this data into a `FormData` object (so it works like a file upload form).
3.  Send it to the AI server (`http://11.0.0.33:8090/api/v1/compare`).
4.  Receive the complex JSON response.
5.  **Transform** that complex JSON into a simple list of rows that our table can display.

## 2. Code Breakdown: `src/services/api.ts`

### The Main Function: `uploadDocument`
This function is called by `App.tsx` when a user uploads a file.

```typescript
export const uploadDocument = async (file: File, docType: string): Promise<ExtractionResult[]> => {
  // 1. Prepare the payload
  // This is equivalent to curl -F "file=@..." -F "doc_type=..."
  const formData = new FormData();
  formData.append('file', file);
  formData.append('doc_type', docType);

  try {
    // 2. Send request to the API
    const response = await fetch(`${API_BASE_URL}/compare`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        // Note: We do NOT set Content-Type manually. 
        // Example: Content-Type: multipart/form-data; boundary=----WebKitFormBoundary...
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    // 3. Get the raw JSON
    const data: ApiResponse = await response.json();
    
    // 4. Transform it for the UI
    return transformApiResponse(data);
  } catch (error) {
    // Error handling (logged to console, re-thrown for App.tsx to catch)
    console.error('Extraction failed:', error);
    throw error;
  }
};
```

### The Helper: `transformApiResponse`
The API returns a nested structure where `extractions` and `confidence_matrix` are separate. This helper merges them into a single rows list.

```typescript
const transformApiResponse = (data: ApiResponse): ExtractionResult[] => {
  // Safety check
  if (!data?.results?.confidence_matrix) return [];

  const { confidence_matrix, extractions } = data.results;
  
  // We iterate over keys like "Name", "DOB", "Aadhaar No" found in confidence_matrix
  return Object.keys(confidence_matrix)
    .filter(key => key !== 'raw_text') // Exclude 'raw_text' as it's not a table row
    .map(key => {
      // 1. Get Score
      const score = confidence_matrix[key].Cumulative_Score;
      
      // 2. Get Values from each model
      // ?. syntax safely accesses the property even if it doesn't exist
      const m1Val = extractions.legacy_ocr_regex?.[key];     // M1 Column
      const m2Val = extractions.llama_maverick_17b?.[key];   // M2 Column
      const m3Val = extractions.llama_11b?.[key];            // M3 Column

      // 3. Return the clean row object
      return {
        attribute: key,
        m1: m1Val ? String(m1Val) : '-', // Show '-' if null/undefined
        m2: m2Val ? String(m2Val) : '-',
        m3: m3Val ? String(m3Val) : '-',
        score: score   // Return raw score (e.g. 0.95)
      };
    });
};
```

## 3. End-to-End Data Flow

1.  **User Uploads File**
    *   Component: `UploadPreview.tsx`
    *   Action: Calls `onFileUpload(file)`
2.  **App Trigger**
    *   Component: `App.tsx`
    *   Action: `handleFileUpload` sets `isProcessing = true` and calls `api.uploadDocument()`.
3.  **Network Request**
    *   Browser sends `POST` request to `http://11.0.0.33:8090...`
4.  **Processing**
    *   `transformApiResponse` converts the JSON.
    *   **Raw API**:
        ```json
        { "results": { "confidence_matrix": { "Name": { "Cumulative_Score": 0.9 } ... } } }
        ```
    *   **Transformed**:
        ```json
        [ { "attribute": "Name", "m1": "John", "m2": "John", "score": 0.9 } ]
        ```
5.  **Visualization**
    *   Component: `ExtractionTable.tsx`
    *   Action: Props `data` updates, so it re-renders the table rows with new data.

## 4. Troubleshooting
-   **CORS Error**: If you see a CORS error in the browser console, it means the API server (`11.0.0.33`) doesn't allow requests from `localhost`. To fix this, we would need to set up a **Proxy** in `vite.config.ts`.
-   **Network Error**: Ensure you are connected to the network where `11.0.0.33` is accessible.
