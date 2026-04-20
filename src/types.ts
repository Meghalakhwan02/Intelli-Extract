export interface DocumentType {
  id: string;
  name: string;
  icon: string;
}

export interface PanFormData {
  fullName: string;
  gender: string;
  dob: string;
  address: string;
  fatherName: string;
  recordId?: string;
}

export interface ExtractionResult {
  attribute: string;
  m1: string;
  m2: string;
  m3: string;
  score: string;
}

export interface UploadedDocument {
  id: string;
  file: File;
  extractionResults: ExtractionResult[];
  rawText: string;
  docType: string;
  analyzedFileUrl?: string; // Kept for backward compatibility
  m1_image?: string;
  m2_image?: string;
  m3_image?: string;
}

// API Response Types

export interface DocumentTypeSelectorProps {
  selectedType: string;
  onSelectType: (typeId: string) => void;
  selectedLanguage: string;
  onSelectLanguage: (lang: string) => void;
  showLanguage?: boolean;
}

export interface VerificationStepProps {
  uploadedFiles: UploadedDocument[];
  onSubmit: () => void;
}

export interface UploadPreviewProps {
  title?: string;
  selectedType: string;
  onSelectType?: (typeId: string) => void;
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
