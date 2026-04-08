import { useState } from 'react';
import { ThemeProvider, CssBaseline, Box, Container, Typography, Alert, Snackbar, Paper } from '@mui/material';
import { theme } from './theme';
import UploadPreview from './components/UploadPreview';
import ExtractionTable from './components/ExtractionTable';
import { motion } from 'framer-motion';
import { extractPan, verifySecondary } from './services/api';
import type { ExtractionResult } from './types';

function App() {
  // Selection State
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('English');

  // Documents State
  const [panFile, setPanFile] = useState<File | null>(null);
  const [docFile, setDocFile] = useState<File | null>(null);

  // Results State
  const [panResults, setPanResults] = useState<ExtractionResult[]>([]);
  const [docResults, setDocResults] = useState<ExtractionResult[]>([]);
  const [panRawText, setPanRawText] = useState<string>('');
  const [docRawText, setDocRawText] = useState<string>('');
  const [verificationSummary, setVerificationSummary] = useState<string>('');
  const [panExtractionsData, setPanExtractionsData] = useState<any>(null);

  // Processing State
  const [isPanProcessing, setIsPanProcessing] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  const [error, setError] = useState<string | null>(null);

  const handleTypeSelect = (typeId: string) => {
    setSelectedType(typeId);
    setDocFile(null);
    setDocResults([]);
    setDocRawText('');
    setVerificationSummary('');
    setError(null);
  };

  const handlePanFileSelect = async (file: File | null) => {
    setPanFile(file);
    if (!file) {
      setPanResults([]);
      setPanRawText('');
      setPanExtractionsData(null);
      return;
    }

    setIsPanProcessing(true);
    setError(null);
    try {
      const result = await extractPan(file);
      setPanResults(result.results);
      setPanRawText(result.rawText);
      setPanExtractionsData(result.rawExtractions);
    } catch (err) {
      console.error(err);
      setError('PAN extraction failed. Please try again.');
    } finally {
      setIsPanProcessing(false);
    }
  };

  const handleSecondaryFileSelect = async (file: File | null) => {
    setDocFile(file);
    if (!file) {
      setDocResults([]);
      setDocRawText('');
      setVerificationSummary('');
      return;
    }

    if (!panExtractionsData) {
      setError('Please upload and process the PAN form first.');
      return;
    }

    if (!selectedType) {
      setError('Please select a document type first.');
      return;
    }

    setIsVerifying(true);
    setError(null);
    try {
      const result = await verifySecondary(
        panExtractionsData,
        file,
        selectedType,
        selectedLanguage
      );
      setDocResults(result.results);
      setDocRawText(result.rawText);
      setVerificationSummary(result.summary);
    } catch (err) {
      console.error(err);
      setError('Verification failed. Please check the backend connection.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCloseError = () => setError(null);

  const isComparisonReady = panResults.length > 0 && docResults.length > 0;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          height: { xs: 'auto', lg: '100vh' },
          overflow: { xs: 'auto', lg: 'hidden' },
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
          display: 'flex',
          flexDirection: 'column',
          p: { xs: 1.5, sm: 2 },
        }}
      >
        <Container 
          maxWidth={false} 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            flex: 1, 
            height: '100%',
            overflow: { xs: 'visible', lg: 'hidden' },
            px: { xs: 1, sm: 2, lg: 4 }
          }}
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Box sx={{ textAlign: 'center', mb: { xs: 1.5, lg: 3 } }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '1.8rem', lg: '2.4rem' },
                  background: 'linear-gradient(135deg, #c084fc 0%, #f472b6 100%)', // Vibrant Purple to Pink
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '-0.02em',
                  textShadow: '0 0 25px rgba(192, 132, 252, 0.25)', // Matching purple glow
                  mb: 0.5
                }}
              >
              TeamSync Intelli Extract
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                AI-Powered Document Extraction &amp; Verification
              </Typography>
            </Box>
          </motion.div>

          {/* Main Content - 2 Column Layout */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', lg: 'row' },
              gap: 2.5,
              flex: 1,
              overflow: { xs: 'visible', lg: 'hidden' },
              minHeight: 0
            }}
          >
            {/* Left Column — Dual Uploads */}
            <Box sx={{ width: { xs: '100%', lg: 330 }, display: 'flex', flexDirection: 'column', gap: 1.5, flexShrink: { lg: 0 } }}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                style={{ flex: 0.85, minHeight: 0 }}
              >
                <UploadPreview
                  title="PAN FORM"
                  isFixed
                  selectedType="PAN"
                  selectedLanguage="English"
                  uploadedFile={panFile}
                  onFileUpload={handlePanFileSelect}
                  isProcessing={isPanProcessing}
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                style={{ flex: 1.15, minHeight: 0 }}
              >
                <UploadPreview
                  title="Secondary Document"
                  selectedType={selectedType}
                  onSelectType={handleTypeSelect}
                  selectedLanguage={selectedLanguage}
                  onSelectLanguage={setSelectedLanguage}
                  uploadedFile={docFile}
                  onFileUpload={handleSecondaryFileSelect}
                  isProcessing={isVerifying}
                />
              </motion.div>
            </Box>

            {/* Right Column — Results & Comparison */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2.5, overflow: { xs: 'visible', lg: 'hidden' } }}>
              {/* Extraction Tables */}
              <Box sx={{ flex: 1, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2.5, minHeight: 0 }}>
                <Box sx={{ flex: 1, minHeight: 0 }}>
                  <ExtractionTable
                    title="PAN Form Data"
                    selectedType="PAN"
                    data={panResults}
                    isLoading={isPanProcessing}
                    rawText={panRawText}
                  />
                </Box>
                <Box sx={{ flex: 1, minHeight: 0 }}>
                  <ExtractionTable
                    title="Secondary Doc Data"
                    selectedType={selectedType}
                    data={docResults}
                    isLoading={isVerifying}
                    rawText={docRawText}
                  />
                </Box>

              </Box>

              {/* Comparison Status Bar */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <Paper sx={{ 
                  p: 2, 
                  textAlign: 'center', 
                  borderRadius: 1.25,
                  border: '1px solid rgba(99, 102, 241, 0.5)',
                  background: isComparisonReady 
                    ? (verificationSummary.toLowerCase().match(/not matched/g) || []).length === 0
                      ? 'linear-gradient(90deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.3) 50%, rgba(16, 185, 129, 0.1) 100%)' // Full Success (Proper Green)
                      : (verificationSummary.toLowerCase().match(/not matched/g) || []).length === 1
                        ? 'linear-gradient(90deg, rgba(163, 230, 53, 0.1) 0%, rgba(163, 230, 53, 0.25) 50%, rgba(163, 230, 53, 0.1) 100%)' // Partial Match (Less Green/Lime)
                        : 'linear-gradient(90deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.25) 50%, rgba(239, 68, 68, 0.1) 100%)' // Failure (Red)
                    : 'rgba(255, 255, 255, 0.03)',
                  boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.5), 0 0 20px rgba(99, 102, 241, 0.3)',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    boxShadow: '0 12px 48px -12px rgba(0, 0, 0, 0.6), 0 0 25px rgba(99, 102, 241, 0.45)',
                  },
                  backdropFilter: 'blur(10px)',
                }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, letterSpacing: '0.02em', color: isComparisonReady ? 'inherit' : 'text.secondary' }}>
                      {isVerifying ? 'Verifying Documents...' : (verificationSummary || 'Ready for Comparison: Upload Documents')}
                    </Typography>
                </Paper>
              </motion.div>
            </Box>
          </Box>
        </Container>

        <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseError} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
          <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%', borderRadius: 2 }}>
            {error}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}

export default App;
