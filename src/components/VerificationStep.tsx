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
  const currentDoc = uploadedFiles[activeIdx];
  const currentFile = currentDoc ? currentDoc.file : null;


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
        {/* Multi-Doc Switcher (Top) */}
        {uploadedFiles.length > 1 && (
          <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
            {uploadedFiles.map((_, i) => (
              <Chip
                key={i}
                label={`Document ${i + 1}`}
                onClick={() => setActiveIdx(i)}
                color={activeIdx === i ? "primary" : "default"}
                variant={activeIdx === i ? "filled" : "outlined"}
                sx={{ cursor: 'pointer' }}
              />
            ))}
          </Stack>
        )}

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
            backgroundImage: currentDoc?.analyzedFileUrl 
              ? `url("${currentDoc.analyzedFileUrl}")` 
              : currentFile 
                ? `url("${URL.createObjectURL(currentFile)}")` 
                : 'url("https://via.placeholder.com/800x1200?text=Processing+Document...")',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
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
