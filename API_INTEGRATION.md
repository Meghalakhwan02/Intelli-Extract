# API Integration Guide (Two-Step Flow)

This document explains the distributed API approach used to improve processing time and UX.

## 1. Overview
Instead of waiting for a single long-running API call, we split the process into two stages:
1.  **Stage 1: PAN Extraction** - As soon as the PAN is uploaded, we immediately extract its data.
2.  **Stage 2: Verification** - After the secondary document is uploaded (and Stage 1 is complete), we send the PAN's extracted data along with the new document to get the final verification result.

## 2. API Endpoints

### Step 1: Extract PAN Data
*   **URL**: `http://11.0.0.37:8000/api/v2/extract`
*   **Method**: `POST`
*   **Payload**: `multipart/form-data`
    *   `file`: The PAN PDF/Image
    *   `doc_type`: "string"
    *   `language`: "english"
*   **Purpose**: Gets the base data from the PAN form immediately.

### Step 2: Verify with Secondary Document
*   **URL**: `http://11.0.0.37:8000/api/v2/verify`
*   **Method**: `POST`
*   **Payload**: `multipart/form-data`
    *   `pan_extractions`: A JSON string containing the `extractions` block from Stage 1.
    *   `doc_file`: The secondary document (Passport, Aadhaar, etc.)
    *   `doc_type`: The selected type
    *   `language`: "english"
*   **Purpose**: Performs cross-document verification and returns the final comparison summary.

## 3. Implementation in `src/services/api.ts`

### `extractPan`
Called as soon as a PAN file is uploaded. It stores the `rawExtractions` in the application state.

### `verifySecondary`
Called when the second document is uploaded. It takes the stored `panExtractions` and the new file.

## 4. UI Logic in `App.tsx`
The application maintains two separate loading states:
*   `isPanProcessing`: Controls loading indicators for the PAN preview and table.
*   `isVerifying`: Controls loading indicators for the Secondary Doc preview and the Comparison Status Bar.

This ensures the user gets immediate feedback after the first upload while the second one is being prepared.
