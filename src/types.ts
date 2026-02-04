export interface DocumentType {
  id: string;
  name: string;
  icon: string;
}

export interface ExtractionResult {
  attribute: string;
  m1: string;
  m2: string;
  m3: string;
  score: number;
}

// API Response Types
export interface ConfidenceScore {
  legacy_ocr_regex: number;
  llama_maverick_17b?: number;
  llama_11b?: number;
  Cumulative_Score: number;
}

export interface ExtractionValues {
  [key: string]: string | null | number;
}

export interface ApiResponse {
  success: boolean;
  filename: string;
  document_type: string;
  results: {
    confidence_matrix: {
      [key: string]: ConfidenceScore;
    };
    extractions: {
      legacy_ocr_regex: ExtractionValues;
      llama_maverick_17b: ExtractionValues;
      llama_11b: ExtractionValues;
    };
  };
}

export interface DocumentTypeSelectorProps {
  selectedType: string;
  onSelectType: (typeId: string) => void;
}

export interface UploadPreviewProps {
  selectedType: string;
  uploadedFile: File | null;
  onFileUpload: (file: File | null) => void;
  isProcessing?: boolean;
}

export interface ExtractionTableProps {
  selectedType: string;
  data?: ExtractionResult[];
  isLoading?: boolean;
}
