import React from 'react';
import { Box, Typography, Button, Paper, Chip, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import type { UploadedDocument } from '../types';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

interface VerificationStepProps {
  uploadedFiles: UploadedDocument[];
  onSubmit: () => void;
  onReject: () => void;
  onBack: () => void;
}

const VerificationStep: React.FC<VerificationStepProps> = ({
  uploadedFiles,
  onSubmit,
  onReject,
  onBack
}) => {
  const [activeIdx, setActiveIdx] = React.useState(0);
  const [activeModel, setActiveModel] = React.useState<'M1' | 'M2' | 'M3'>('M1');
  
  const currentDoc = uploadedFiles[activeIdx];
  const currentFile = currentDoc ? currentDoc.file : null;

  const getDocImageUrl = () => {
    if (!currentDoc) return '';
    let url = '';
    if (activeModel === 'M1') url = currentDoc.m1_image || currentDoc.analyzedFileUrl || '';
    else if (activeModel === 'M2') url = currentDoc.m2_image || '';
    else if (activeModel === 'M3') url = currentDoc.m3_image || '';

    if (url) return url;
    if (currentFile) return URL.createObjectURL(currentFile);
    return 'https://via.placeholder.com/800x1200?text=Processing+Document...';
  };

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        overflowY: 'auto'
      }}
    >
      {/* Header with Title */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.light' }}>
          Verification & Final Review
        </Typography>
      </Box>

      {/* Main Content: Immersive Document Preview */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, minHeight: 0, alignItems: 'center' }}>
        <Stack direction="row" spacing={2} sx={{ width: '100%', justifyContent: 'center', mb: 1 }}>
          {/* Multi-Doc Switcher (Left) */}
          {uploadedFiles.length > 1 && (
            <Stack direction="row" spacing={1} sx={{ p: 0.5, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
              {uploadedFiles.map((_, i) => (
                <Chip
                  key={i}
                  label={`Doc ${i + 1}`}
                  onClick={() => setActiveIdx(i)}
                  color={activeIdx === i ? "primary" : "default"}
                  variant={activeIdx === i ? "filled" : "outlined"}
                  sx={{ cursor: 'pointer', fontWeight: 600 }}
                />
              ))}
            </Stack>
          )}

          {/* Model Switcher (Right) */}
          <Stack direction="row" spacing={1} sx={{ p: 0.5, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
            {(['M1', 'M2', 'M3'] as const).map((model) => (
              <Chip
                key={model}
                label={model}
                onClick={() => setActiveModel(model)}
                color={activeModel === model ? "secondary" : "default"}
                variant={activeModel === model ? "filled" : "outlined"}
                sx={{ 
                  cursor: 'pointer', 
                  minWidth: 60,
                  fontWeight: 700,
                  transition: 'all 0.2s',
                  '&:hover': { transform: 'translateY(-1px)' }
                }}
              />
            ))}
          </Stack>
        </Stack>

        <Paper
          elevation={4}
          sx={{
            flex: 1,
            width: '100%',
            maxWidth: '1000px',
            position: 'relative',
            background: 'rgba(30, 41, 59, 0.7)',
            backdropFilter: 'blur(10px)',
            borderRadius: 4,
            overflow: 'hidden',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
          }}
        >
          {/* Badge indicator */}
          <Box sx={{ 
            position: 'absolute', 
            top: 20, 
            right: 15, 
            zIndex: 10,
            bgcolor: 'secondary.main',
            color: 'white',
            px: 1.5,
            py: 0.5,
            borderRadius: 1,
            fontSize: '0.75rem',
            fontWeight: 'bold',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
          }}>
            MODEL: {activeModel}
          </Box>

          {/* Enhanced Document Canvas */}
          <Box sx={{
            flex: 1,
            position: 'relative',
            m: 3,
            background: 'white',
            borderRadius: 2,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundImage: `url("${getDocImageUrl()}")`,
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            transition: 'background-image 0.3s ease-in-out'
          }}>
          </Box>
        </Paper>
      </Box>

      {/* Footer Navigation */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
        <Button variant="text" onClick={onBack} sx={{ color: 'text.secondary' }}>Back to Upload</Button>
        <Stack direction="row" spacing={3}>
          <Button
            variant="contained"
            color="error"
            startIcon={<ThumbDownIcon />}
            onClick={onReject}
            sx={{ px: 4, py: 1.5, borderRadius: 2 }}
          >
            Reject Document
          </Button>
          <Button
            variant="contained"
            color="success"
            startIcon={<ThumbUpIcon />}
            onClick={onSubmit}
            sx={{ px: 5, py: 1.5, borderRadius: 2, background: 'linear-gradient(90deg, #10b981, #059669)' }}
          >
            Submit & Verify
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default VerificationStep;
