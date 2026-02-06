import { useState } from 'react';
import { ThemeProvider, CssBaseline, Box, Container, Typography, Alert, Snackbar } from '@mui/material';
import { theme } from './theme';
import DocumentTypeSelector from './components/DocumentTypeSelector';
import UploadPreview from './components/UploadPreview';
import ExtractionTable from './components/ExtractionTable';
import { motion } from 'framer-motion';
import { uploadDocument } from './services/api';
import type { ExtractionResult } from './types';

function App() {
  const [selectedType, setSelectedType] = useState<string>('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [extractionResults, setExtractionResults] = useState<ExtractionResult[]>([]);
  const [rawText, setRawText] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleTypeSelect = (typeId: string) => {
    setSelectedType(typeId);
    // Clear uploaded file and results when changing document type
    setUploadedFile(null);
    setExtractionResults([]);
    setRawText('');
    setError(null);
  };

  const handleFileUpload = async (file: File | null) => {
    setUploadedFile(file);
    if (file && selectedType) {
      setIsProcessing(true);
      setError(null);
      setExtractionResults([]); // Clear previous results
      setRawText(''); // Clear previous raw text
      try {
        const { results, rawText } = await uploadDocument(file, selectedType);
        setExtractionResults(results);
        setRawText(rawText);
      } catch (err) {
        console.error(err);
        setError('Failed to process document. Please try again.');
        setExtractionResults([]);
        setRawText('');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleCloseError = () => {
    setError(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
          py: 4,
        }}
      >
        <Container maxWidth="xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1,
                }}
              >
                Intelli Extract
              </Typography>
              <Typography variant="body1" color="text.secondary">
                AI-Powered Document Extraction & Verification
              </Typography>
            </Box>
          </motion.div>

          {/* Main Content - Flexbox Layout */}
          <Box
            sx={{
              display: 'flex',
              gap: 3,
              // Responsive height: auto for mobile scrolling, fixed for desktop layout
              height: { xs: 'auto', md: 'calc(100vh - 180px)' },
              flexDirection: { xs: 'column', md: 'row' },
            }}
          >
            {/* Left Panel - Document Type Selector */}
            <Box sx={{ flex: { xs: '1 1 auto', md: '0 0 25%' } }}>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                style={{ height: '100%' }}
              >
                <DocumentTypeSelector selectedType={selectedType} onSelectType={handleTypeSelect} />
              </motion.div>
            </Box>

            {/* Center Panel - Upload & Preview */}
            <Box sx={{ flex: { xs: '1 1 auto', md: '0 0 30%' } }}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                style={{ height: '100%' }}
              >
                <UploadPreview
                  selectedType={selectedType}
                  uploadedFile={uploadedFile}
                  onFileUpload={handleFileUpload}
                  isProcessing={isProcessing}
                />
              </motion.div>
            </Box>

            {/* Right Panel - Extraction Table */}
            <Box sx={{ flex: { xs: '1 1 auto', md: '0 0 45%' } }}>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                style={{ height: '100%' }}
              >
                <ExtractionTable
                  selectedType={selectedType}
                  data={extractionResults}
                  isLoading={isProcessing}
                  rawText={rawText}
                />
              </motion.div>
            </Box>
          </Box>
        </Container>

        <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseError} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
          <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}

export default App;
