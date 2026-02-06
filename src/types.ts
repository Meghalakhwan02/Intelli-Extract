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
  score: string;
}

// API Response Types
export interface ConfidenceScore {
  consensus_score: string;
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
      M1: ExtractionValues;
      M2: ExtractionValues;
      M3: ExtractionValues;
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
  rawText?: string;
}
