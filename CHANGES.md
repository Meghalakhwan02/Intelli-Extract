# Intelli-Extract — Frontend Change Documentation

---

## 1. `raw_text` — Excluded from Table Rows, Only in Raw Output

### Problem
The backend API returns `raw_text` as a key inside `confidence_matrix` (along with other fields like `name`, `dob`, `address`). Since the extraction table renders a row for **every key** present in `confidence_matrix`, `raw_text` was unexpectedly showing up as a table row — which was wrong.

`raw_text` is raw OCR dump text (full unstructured text from the document). It should **never** appear as a structured field row in the table.

### Where `raw_text` comes from in the API response
```json
{
  "extractions": {
    "M1": {
      "raw_text": "REPUBLIC OF INDIA\nPassport No: Z1234567...",  ← used for Raw Output section
      "name": "John Doe",
      "dob": "01-01-1990"
    },
    "confidence_matrix": {
      "raw_text": { "consensus_score": 0.9 },  ← was becoming a table row (WRONG)
      "name": { "consensus_score": 0.95 },
      "dob":  { "consensus_score": 0.88 }
    }
  }
}
```

### Fix Applied

**Layer 1 — Data Transformation** [`src/services/api.ts` line 107–108]

When converting API response into table row objects, `raw_text` key is skipped:

```ts
// BEFORE
return Object.keys(confidence_matrix)
  .map(key => { ... });

// AFTER
return Object.keys(confidence_matrix)
  .filter(key => key !== 'raw_text')   // ← raw_text never becomes a row object
  .map(key => { ... });
```

**Layer 2 — UI Render Guard** [`src/components/ExtractionTable.tsx` line 104]

Even if `raw_text` somehow reaches the table component, it is blocked before rendering:

```tsx
// BEFORE
data.map((row, index) => ( ... ))

// AFTER
data.filter(row => row.attribute !== 'raw_text').map((row, index) => ( ... ))
```

### Where `raw_text` IS Displayed (correctly)

`raw_text` is taken **only from `extractions.M1.raw_text`** in `api.ts` line 79:

```ts
rawText: data.extractions?.M1?.raw_text || ''
```

It is passed as a separate prop down the component tree and displayed in the **Raw Output** section at the bottom of `ExtractionTable`:

```
App.tsx (state: rawText)
  └── DocumentUploadStep.tsx (prop: rawText)
        └── ExtractionTable.tsx → rendered in Raw Output box
```

### Summary

| Location | Before Fix | After Fix |
|---|---|---|
| Table rows | ✅ raw_text showing as row (WRONG) | ❌ raw_text never shows as row |
| Raw Output section | ✅ showing correctly | ✅ still showing correctly |

---

## 2. `doc_type` — Removed as Mandatory Dependency

### Problem
Previously, the user was **required to select a Document Type** (e.g., Passport, Aadhaar, PAN) from a dropdown before uploading a document. The selected `doc_type` was sent to the backend API as a form field.

This was a blocker — if the user didn't select a type first, the upload was rejected with an error.

### What Was Removed

**Validation block removed** [`src/App.tsx` lines 45–48]

```ts
// REMOVED — doc_type selection is no longer required before upload
// if (!selectedType) {
//   setError('Please select a Document Type from the dropdown before uploading.');
//   return;
// }
```

**API field removed** [`src/services/api.ts` line 47]

```ts
// REMOVED — doc_type no longer sent to backend
// formData.append('doc_type', docType);
```

The `analyzeDocument()` function signature also had `docType` param removed. Now it only sends:
```ts
formData.append('doc_file', file);      // the document image/file
formData.append('record_id', recordId); // the PAN record ID
```

### What Still Exists (UI only)
The `DocumentTypeSelector` component and `selectedType` state still exist in the frontend — they are used for:
- UI display/labeling purposes
- Storing `docType` per uploaded document (`UploadedDocument.docType`)
- Showing placeholder text in the extraction table (`"Select a document type at the top-left"`)

But `selectedType` is **no longer sent to the backend** and is **no longer required** before uploading.

### Summary

| | Before | After |
|---|---|---|
| Doc type required before upload | ✅ Yes — blocked upload if not selected | ❌ No — optional |
| `doc_type` sent to API | ✅ Yes — `formData.append('doc_type', ...)` | ❌ No — removed |
| Doc type selector in UI | ✅ Visible | ✅ Still visible (UI only) |
| Backend auto-detects doc type | ❌ No | ✅ Yes — backend detects on its own |

---

## Files Changed

| File | Change |
|---|---|
| `src/services/api.ts` | Removed `doc_type` from FormData; added `raw_text` filter in `transformExtractionBlock` |
| `src/components/ExtractionTable.tsx` | Added `raw_text` filter guard before rendering rows |
| `src/App.tsx` | Removed `selectedType` validation block before file upload |
