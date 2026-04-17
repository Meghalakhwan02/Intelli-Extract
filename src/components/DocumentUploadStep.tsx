import { Box, Button, Paper, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import UploadPreview from './UploadPreview';
import ExtractionTable from './ExtractionTable';
import type { ExtractionResult, UploadedDocument } from '../types';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CloseIcon from '@mui/icons-material/Close';

interface DocumentUploadStepProps {
  selectedType: string;
  setSelectedType: (type: string) => void;
  uploadedFiles: UploadedDocument[];
  activeDocId: string | null;
  onSelectDocument: (id: string) => void;
  onDeleteDocument: (id: string) => void;
  onFileUpload: (files: File[]) => void;
  onBack: () => void;
  isProcessing: boolean;
  extractionResults: ExtractionResult[];
  rawText: string;
  onUploadNext: () => void; // "Upload" button logic (stay on page)
  onFinalNext: () => void;   // "Next" button logic (go to step 3)
}

const DocumentUploadStep: React.FC<DocumentUploadStepProps> = ({
  selectedType,
  setSelectedType,
  uploadedFiles,
  activeDocId,
  onSelectDocument,
  onDeleteDocument,
  onFileUpload,
  onBack,
  isProcessing,
  extractionResults,
  rawText,
  onUploadNext,
  onFinalNext
}) => {
  const handleNewUpload = (file: File | null) => {
    if (file) {
      // App.tsx handleFileUpload expects an array of Files for consistency, 
      // but we append logically there.
      onFileUpload([file]);
    }
  };

  const currentDoc = uploadedFiles.find(d => d.id === activeDocId);
  const currentFile = currentDoc ? currentDoc.file : null;
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        overflowY: 'auto'
      }}
    >
      {/* Upper Content Area */}
      <Box sx={{ flex: 1, display: 'flex', gap: 2, minHeight: 0 }}>
        {/* Middle Area - Upload Preview (Slightly narrower) */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, minHeight: 0 }}>
          <Box sx={{ flex: 1, minHeight: 0 }}>
            <UploadPreview
              title="Upload Document"
              selectedType={selectedType}
              onSelectType={setSelectedType}
              uploadedFile={currentFile}
              onFileUpload={handleNewUpload}
              isProcessing={isProcessing}
            />
          </Box>

          {/* Multi-File Gallery */}
          {uploadedFiles.length > 0 && (
            <Paper sx={{ p: 1, background: 'rgba(0,0,0,0.2)', borderRadius: 2, display: 'flex', gap: 1, overflowX: 'auto', '&::-webkit-scrollbar': { height: '4px' } }}>
              {uploadedFiles.map((doc) => (
                <Box
                  key={doc.id}
                  sx={{ position: 'relative', flexShrink: 0 }}
                >
                  <Box
                    onClick={() => onSelectDocument(doc.id)}
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: 1,
                      border: activeDocId === doc.id ? '2px solid #6366f1' : '1px solid rgba(255,255,255,0.1)',
                      cursor: 'pointer',
                      overflow: 'hidden',
                      opacity: activeDocId === doc.id ? 1 : 0.6,
                      transition: 'all 0.2s',
                      '&:hover': { opacity: 1 }
                    }}
                  >
                    {doc.file.type.startsWith('image/') ? (
                      <img src={URL.createObjectURL(doc.file)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1e293b', fontSize: '10px', color: 'text.secondary' }}>PDF</Box>
                    )}
                  </Box>
                  
                  {/* Delete Button */}
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteDocument(doc.id);
                    }}
                    sx={{
                      position: 'absolute',
                      top: -8,
                      right: -8,
                      background: 'rgba(239, 68, 68, 0.9)',
                      color: 'white',
                      padding: '2px',
                      '&:hover': { background: '#ef4444', scale: 1.1 },
                      boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                      zIndex: 1
                    }}
                  >
                    <CloseIcon sx={{ fontSize: 12, fontWeight: 'bold' }} />
                  </IconButton>
                </Box>
              ))}
            </Paper>
          )}
        </Box>

        {/* Right Area - Extraction Results (Wider) */}
        <Box sx={{ flex: 1.3, display: 'flex', flexDirection: 'column', gap: 2, minHeight: 0 }}>
          {/* Extraction Table takes full sidebar */}
          <Box sx={{ flex: 1, minHeight: 0 }}>
            <ExtractionTable
              title="Extraction Results"
              selectedType={selectedType}
              data={extractionResults}
              isLoading={isProcessing}
              rawText={rawText}
            />
          </Box>
        </Box>
      </Box>

      {/* Bottom Navigation */}
      <Paper
        elevation={4}
        sx={{
          p: 2,
          display: 'flex',
          justifyContent: 'center',
          gap: 4,
          background: 'rgba(30, 41, 59, 0.5)',
          backdropFilter: 'blur(10px)',
          borderTop: '1px solid rgba(99, 102, 241, 0.2)',
          borderRadius: 2
        }}
      >
        <Button
          variant="text"
          onClick={onBack}
          sx={{ color: 'text.secondary', fontWeight: 600 }}
        >
          Back to PAN Details
        </Button>
        <Box sx={{ flex: 1 }} />
        <Button
          variant="outlined"
          size="large"
          startIcon={<CloudUploadIcon />}
          onClick={onUploadNext}
          sx={{
            px: 4,
            borderColor: 'primary.main',
            color: 'primary.main',
            '&:hover': {
              borderColor: 'primary.light',
              background: 'rgba(99, 102, 241, 0.1)'
            }
          }}
        >
          Upload
        </Button>
        <Button
          variant="contained"
          size="large"
          endIcon={<ArrowForwardIosIcon />}
          onClick={onFinalNext}
          disabled={uploadedFiles.length === 0}
          sx={{
            px: 6,
            background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
            boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)'
          }}
        >
          Next Step (Verify)
        </Button>
      </Paper>
    </Box>
  );
};

export default DocumentUploadStep;
