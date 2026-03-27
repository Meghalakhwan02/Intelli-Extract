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
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [extractionResults, setExtractionResults] = useState<ExtractionResult[]>([]);
  const [rawText, setRawText] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleTypeSelect = (typeId: string) => {
    setSelectedType(typeId);
    setUploadedFile(null);
    setExtractionResults([]);
    setRawText('');
    setError(null);
  };

  const handleFileUpload = async (file: File | null) => {
    setUploadedFile(file);
    if (file && selectedType && selectedLanguage) {
      setIsProcessing(true);
      setError(null);
      setExtractionResults([]);
      setRawText('');
      try {
        const { results, rawText } = await uploadDocument(file, selectedType, selectedLanguage);
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

  const handleCloseError = () => setError(null);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          height: { xs: 'auto', md: '100vh' },
          overflow: { xs: 'auto', md: 'hidden' },
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
          display: 'flex',
          flexDirection: 'column',
          py: 3,
        }}
      >
        <Container 
          maxWidth="xl" 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            flex: 1, 
            overflow: { xs: 'visible', md: 'hidden' } 
          }}
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 0.5,
                }}
              >
                Intelli Extract
              </Typography>
              <Typography variant="body1" color="text.secondary">
                AI-Powered Document Extraction &amp; Verification
              </Typography>
            </Box>
          </motion.div>

          {/* Main Content - 3 panel flex layout, fills remaining height */}
          <Box
            sx={{
              display: 'flex',
              gap: 3,
              flex: 1,
              overflow: { xs: 'visible', md: 'hidden' },
              flexDirection: { xs: 'column', md: 'row' },
              pb: { xs: 4, md: 0 },
            }}
          >
            {/* Left Panel — Language + Document Type Selector */}
            <Box sx={{ flex: { xs: '1 1 auto', md: '0 0 22%' }, minWidth: 0, overflow: 'hidden', height: { xs: '450px', md: 'auto' } }}>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                style={{ height: '100%' }}
              >
                <DocumentTypeSelector
                  selectedType={selectedType}
                  onSelectType={handleTypeSelect}
                  selectedLanguage={selectedLanguage}
                  onSelectLanguage={setSelectedLanguage}
                />
              </motion.div>
            </Box>

            {/* Center Panel — Upload & Preview */}
            <Box sx={{ flex: { xs: '1 1 auto', md: '0 0 25%' }, minWidth: 0, overflow: 'hidden', minHeight: { xs: '350px', md: 'auto' } }}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                style={{ height: '100%' }}
              >
                <UploadPreview
                  selectedType={selectedType}
                  selectedLanguage={selectedLanguage}
                  uploadedFile={uploadedFile}
                  onFileUpload={handleFileUpload}
                  isProcessing={isProcessing}
                />
              </motion.div>
            </Box>

            {/* Right Panel — Extraction Table */}
            <Box sx={{ flex: { xs: '1 1 auto', md: '1 1 0%' }, minWidth: 0, overflow: 'hidden', minHeight: { xs: '400px', md: 'auto' } }}>
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
