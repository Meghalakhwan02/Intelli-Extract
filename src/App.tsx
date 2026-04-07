import { useState, useEffect } from 'react';
import { ThemeProvider, CssBaseline, Box, Container, Typography, Alert, Snackbar, Paper } from '@mui/material';
import { theme } from './theme';
import UploadPreview from './components/UploadPreview';
import ExtractionTable from './components/ExtractionTable';
import { motion } from 'framer-motion';
import { verifyDocuments } from './services/api';
import type { ExtractionResult } from './types';

function App() {
  // Selection State
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');

  // Documents State
  const [panFile, setPanFile] = useState<File | null>(null);
  const [docFile, setDocFile] = useState<File | null>(null);

  // Results State
  const [panResults, setPanResults] = useState<ExtractionResult[]>([]);
  const [docResults, setDocResults] = useState<ExtractionResult[]>([]);
  const [panRawText, setPanRawText] = useState<string>('');
  const [docRawText, setDocRawText] = useState<string>('');
  const [verificationSummary, setVerificationSummary] = useState<string>('');

  // Processing State
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  const [error, setError] = useState<string | null>(null);

  const handleTypeSelect = (typeId: string) => {
    setSelectedType(typeId);
    setDocFile(null);
    setDocResults([]);
    setDocRawText('');
    setError(null);
  };

  useEffect(() => {
    if (panFile && docFile && selectedType && selectedLanguage) {
      triggerVerification(panFile, docFile);
    }
  }, [panFile, docFile, selectedType, selectedLanguage]);

  const triggerVerification = async (pfile: File, dfile: File) => {
    setIsVerifying(true);
    setError(null);
    try {
      const results = await verifyDocuments(pfile, dfile, selectedType, selectedLanguage);
      setPanResults(results.panResults);
      setDocResults(results.docResults);
      setPanRawText(results.panRawText);
      setDocRawText(results.docRawText);
      setVerificationSummary(results.summary);
    } catch (err) {
      console.error(err);
      setError('Verification failed. Please check the backend connection.');
      setVerificationSummary('Verification Failed');
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
                  onFileUpload={setPanFile}
                  isProcessing={isVerifying}
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
                  onFileUpload={setDocFile}
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
                    isLoading={isVerifying}
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
                    ? (verificationSummary.includes('not matched') && verificationSummary.includes(' matched'))
                      ? 'linear-gradient(90deg, rgba(163, 230, 53, 0.1) 0%, rgba(163, 230, 53, 0.25) 50%, rgba(163, 230, 53, 0.1) 100%)' // Partial Match (Yellow-Green/Lime)
                      : verificationSummary.includes('not matched')
                        ? 'linear-gradient(90deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.25) 50%, rgba(239, 68, 68, 0.1) 100%)' // Failure (Red)
                        : 'linear-gradient(90deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.3) 50%, rgba(16, 185, 129, 0.1) 100%)' // Full Success (Deep Green)
                    : 'rgba(255, 255, 255, 0.03)',
                  boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.5), 0 0 20px rgba(99, 102, 241, 0.3)',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    boxShadow: '0 12px 48px -12px rgba(0, 0, 0, 0.6), 0 0 25px rgba(99, 102, 241, 0.45)',
                  },
                  backdropFilter: 'blur(10px)',
                }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, letterSpacing: '0.02em', color: isComparisonReady ? 'inherit' : 'text.secondary' }}>
                    {isVerifying ? 'Verifying Documents...' : (verificationSummary || 'Awaiting Document Uploads...')}
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
