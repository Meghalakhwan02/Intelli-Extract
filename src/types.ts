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
  [key: string]: any;
  raw_text?: string;
}

export interface VerificationData {
  M1: { name_match: boolean; dob_match: boolean; verified: boolean };
  M2: { name_match: boolean; dob_match: boolean; verified: boolean };
  M3: { name_match: boolean; dob_match: boolean; verified: boolean };
  overall: string;
  summary: string;
}

export interface UnifiedApiResponse {
  success: boolean;
  pan_filename: string;
  doc_filename: string;
  doc_type: string;
  pan_extractions: {
    M1: ExtractionValues;
    M2: ExtractionValues;
    M3: ExtractionValues;
    confidence_matrix: { [key: string]: ConfidenceScore };
  };
  doc_extractions: {
    M1: ExtractionValues;
    M2: ExtractionValues;
    M3: ExtractionValues;
    confidence_matrix: { [key: string]: ConfidenceScore };
  };
  verification: VerificationData;
}

export interface DocumentTypeSelectorProps {
  selectedType: string;
  onSelectType: (typeId: string) => void;
  selectedLanguage: string;
  onSelectLanguage: (lang: string) => void;
}

export interface UploadPreviewProps {
  title?: string;
  selectedType: string;
  onSelectType?: (typeId: string) => void;
  selectedLanguage: string;
  onSelectLanguage?: (lang: string) => void;
  uploadedFile: File | null;
  onFileUpload: (file: File | null) => void;
  isProcessing?: boolean;
  isFixed?: boolean;
}

export interface ExtractionTableProps {
  title?: string;
  selectedType: string;
  data?: ExtractionResult[];
  isLoading?: boolean;
  rawText?: string;
}
