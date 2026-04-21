import React from 'react';
import { Box, Typography, Button, Paper, Chip, Stack, Grid} from '@mui/material';
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

  const models = [
    { 
      id: 'M1', 
      label: 'Model OCR', 
      image: currentDoc?.m1_image || currentDoc?.analyzedFileUrl || (currentFile ? URL.createObjectURL(currentFile) : null), 
      color: '#3b82f6' 
    },
    { 
      id: 'M2', 
      label: 'Model V1', 
      image: currentDoc?.m2_image || (currentFile ? URL.createObjectURL(currentFile) : null), 
      color: '#8b5cf6' 
    },
    { 
      id: 'M3', 
      label: 'Model V2', 
      image: currentDoc?.m3_image || (currentFile ? URL.createObjectURL(currentFile) : null), 
      color: '#ec4899' 
    },
  ];

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        p: 1,
        pb: 6
      }}
    >
      {/* Header with Title */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ 
          fontWeight: 900, 
          background: 'linear-gradient(45deg, #6366f1, #a855f7)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-0.02em'
        }}>
          Verification & Final Review
        </Typography>
        
        {/* Multi-Doc Switcher */}
        {uploadedFiles.length > 1 && (
          <Stack direction="row" spacing={1} sx={{ p: 0.75, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 3, border: '1px solid rgba(255,255,255,0.1)' }}>
            {uploadedFiles.map((_, i) => (
              <Chip
                key={i}
                label={`Document ${i + 1}`}
                onClick={() => setActiveIdx(i)}
                color={activeIdx === i ? "primary" : "default"}
                variant={activeIdx === i ? "filled" : "outlined"}
                sx={{ 
                  cursor: 'pointer', 
                  fontWeight: 700,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': { transform: 'scale(1.05)' }
                }}
              />
            ))}
          </Stack>
        )}
      </Box>

      {/* Main Content: Side-by-Side Modern Comparison */}
      <Box sx={{ minHeight: 0 }}>
        <Grid container spacing={3}>
          {models.map((model, idx) => (
            <Grid size={{ xs: 12, md: 4 }} key={model.id}>
              <Box
                component={motion.div}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                sx={{ height: '100%' }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    height: '100%',
                    minHeight: '450px',
                    display: 'flex',
                    flexDirection: 'column',
                    background: 'rgba(30, 41, 59, 0.4)',
                    backdropFilter: 'blur(12px)',
                    borderRadius: 5,
                    overflow: 'hidden',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      border: `1px solid ${model.color}44`,
                      boxShadow: `0 12px 40px ${model.color}22`
                    }
                  }}
                >
                  {/* Model Header */}
                  <Box sx={{ 
                    p: 2, 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    background: `linear-gradient(to right, ${model.color}15, transparent)`
                  }}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: model.color, boxShadow: `0 0 10px ${model.color}` }} />
                      <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'white', letterSpacing: '0.05em' }}>
                        {model.label}
                      </Typography>
                    </Stack>
                  </Box>

                  {/* Document Canvas */}
                  <Box sx={{
                    flex: 1,
                    position: 'relative',
                    m: 2,
                    mt: 0,
                    background: 'white',
                    borderRadius: 3,
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'inset 0 0 20px rgba(0,0,0,0.1)'
                  }}>
                    {model.image ? (
                      <Box
                        component="img"
                        src={model.image}
                        alt={model.label}
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                          p: 1,
                          transition: 'transform 0.5s ease',
                          '&:hover': { transform: 'scale(1.02)' }
                        }}
                      />
                    ) : (
                      <Box sx={{ textAlign: 'center', p: 3 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                          No annotation data available for this model
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Paper>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Footer Navigation */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mt: 'auto',
        pt: 4,
        borderTop: '1px solid rgba(255,255,255,0.1)'
      }}>
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
