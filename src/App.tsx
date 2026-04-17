import { useState } from 'react';
import { ThemeProvider, CssBaseline, Box, Container, Typography, Alert, Snackbar } from '@mui/material';
import { theme } from './theme';
import { AnimatePresence } from 'framer-motion';
import PanFormDetails from './components/PanFormDetails';
import DocumentUploadStep from './components/DocumentUploadStep';
import VerificationStep from './components/VerificationStep';
import type { ExtractionResult, PanFormData, UploadedDocument } from './types';
import { analyzeDocument } from './services/api';

function App() {
  // Wizard State
  const [step, setStep] = useState<number>(1);

  // Step 1: PAN Form Data
  const [panFormData, setPanFormData] = useState<PanFormData>({
    fullName: '',
    gender: 'Male',
    dob: '',
    address: '',
    fatherName: ''
  });

  // Step 2: Documents State
  const [selectedType, setSelectedType] = useState<string>('');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedDocument[]>([]);
  const [activeDocId, setActiveDocId] = useState<string | null>(null);
  const [extractionResults, setExtractionResults] = useState<ExtractionResult[]>([]);
  const [rawText, setRawText] = useState<string>('');

  // UI State
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Handlers
  const handlePanFormNext = () => setStep(2);
  const handleFileUpload = async (files: File[]) => {
    if (files.length === 0) return;
    if (!panFormData.recordId) {
      setError('Missing record ID from PAN details. Please complete step 1.');
      return;
    }
    if (!selectedType) {
      setError('Please select a Document Type from the dropdown before uploading.');
      return;
    }

    const newFile = files[files.length - 1];
    const newId = Math.random().toString(36).substr(2, 9);

    setIsProcessing(true);
    setError(null);
    
    try {
      const response = await analyzeDocument(newFile, selectedType, panFormData.recordId);
      
      const newDoc: UploadedDocument = {
        id: newId,
        file: newFile,
        extractionResults: response.results,
        rawText: response.rawText,
        docType: selectedType,
        analyzedFileUrl: response.analyzedFileUrl
      };

      setUploadedFiles(prev => [...prev, newDoc]);
      setActiveDocId(newId);
      setExtractionResults(response.results);
      setRawText(response.rawText);
    } catch (err: any) {
      setError(err.message || 'Failed to analyze document.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBackToStep1 = () => setStep(1);

  const handleUploadMore = () => {
    setActiveDocId(null);
    setExtractionResults([]);
    setRawText('');
    setSuccessMsg('You can now upload another document.');
  };

  const handleSelectDocument = (id: string) => {
    const doc = uploadedFiles.find(d => d.id === id);
    if (doc) {
      setActiveDocId(id);
      setExtractionResults(doc.extractionResults);
      setRawText(doc.rawText);
      setSelectedType(doc.docType);
    }
  };

  const handleDeleteDocument = (id: string) => {
    setUploadedFiles(prev => prev.filter(d => d.id !== id));
    if (activeDocId === id) {
      setActiveDocId(null);
      setExtractionResults([]);
      setRawText('');
    }
  };

  const handleGoToVerify = () => setStep(3);
  const handleBackToUpload = () => setStep(2);

  const resetWizard = () => {
    setStep(1);
    setPanFormData({
      fullName: '',
      gender: 'Male',
      dob: '',
      address: '',
      fatherName: ''
    });
    setUploadedFiles([]);
    setActiveDocId(null);
    setExtractionResults([]);
    setRawText('');
    setSelectedType('');
  };

  const handleSubmit = () => {
    setSuccessMsg('Documents verified and submitted successfully!');
    setTimeout(() => {
      resetWizard();
    }, 2000);
  };

  const handleReject = () => {
    setError('Document has been rejected. Starting fresh...');
    setTimeout(() => {
      resetWizard();
    }, 2000);
  };

  const handleCloseError = () => setError(null);
  const handleCloseSuccess = () => setSuccessMsg(null);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          height: '100vh',
          width: '100vw',
          overflowY: 'auto',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
          display: 'flex',
          flexDirection: 'column',
          p: 0,
          m: 0
        }}
      >
        <Container
          maxWidth={false}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            height: '100%',
            overflowY: 'auto',
            px: { xs: 2, lg: 4 },
            py: 2
          }}
        >
          {/* Header */}
          <Box sx={{ flexShrink: 0, textAlign: 'center', mb: 2 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                fontSize: { xs: '1.5rem', lg: '2rem' },
                background: 'linear-gradient(135deg, #c084fc 0%, #f472b6 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.02em'
              }}
            >
              TeamSync Intelli Extract
            </Typography>
            <Typography variant="caption" color="text.secondary">
              AI-Powered Multi-Step Verification System
            </Typography>
          </Box>

          {/* Main Content Area */}
          <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
            <AnimatePresence mode="wait">
              {step === 1 && (
                <PanFormDetails
                  data={panFormData}
                  onChange={setPanFormData}
                  onNext={handlePanFormNext}
                />
              )}
              {step === 2 && (
                <DocumentUploadStep
                  selectedType={selectedType}
                  setSelectedType={setSelectedType}
                  uploadedFiles={uploadedFiles}
                  activeDocId={activeDocId}
                  onSelectDocument={handleSelectDocument}
                  onDeleteDocument={handleDeleteDocument}
                  onFileUpload={handleFileUpload}
                  onBack={handleBackToStep1}
                  isProcessing={isProcessing}
                  extractionResults={extractionResults}
                  rawText={rawText}
                  onUploadNext={handleUploadMore}
                  onFinalNext={handleGoToVerify}
                />
              )}
              {step === 3 && (
                <VerificationStep
                  uploadedFiles={uploadedFiles}
                  onBack={handleBackToUpload}
                  onSubmit={handleSubmit}
                  onReject={handleReject}
                />
              )}
            </AnimatePresence>
          </Box>
        </Container>

        <Snackbar open={!!error} autoHideDuration={3000} onClose={handleCloseError} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
          <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%', borderRadius: 2 }}>
            {error}
          </Alert>
        </Snackbar>

        <Snackbar open={!!successMsg} autoHideDuration={3000} onClose={handleCloseSuccess} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
          <Alert onClose={handleCloseSuccess} severity="success" sx={{ width: '100%', borderRadius: 2 }}>
            {successMsg}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}

export default App;
