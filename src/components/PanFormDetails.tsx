import React from 'react';
import { Box, TextField, Typography, Button, Paper, Grid, MenuItem, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import type { PanFormData } from '../types';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import { recordPanDetails } from '../services/api';

interface PanFormDetailsProps {
  data: PanFormData;
  onChange: (data: PanFormData) => void;
  onNext: () => void;
}

const PanFormDetails: React.FC<PanFormDetailsProps> = ({ data, onChange, onNext }) => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange({ ...data, [name]: value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await recordPanDetails(data);
      if (response.success) {
        onChange({ ...data, recordId: response.record_id });
        onNext();
      } else {
        setError('Failed to record details. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while saving details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      sx={{
        minHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: { xs: 'flex-start', md: 'center' },
        p: { xs: 2, md: 3 },
        py: { xs: 4, md: 2 }
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: { xs: 2, lg: 3 },
          width: '100%',
          maxWidth: 850,
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.7) 100%)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          borderRadius: 4,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #6366f1, #ec4899)',
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <ContactPageIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, background: 'linear-gradient(90deg, #fff, #cbd5e1)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              PAN Form Details
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Ensure the entered details are accurate to enable precise AI extraction and validation.
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={2}>
          {error && (
            <Grid size={12}>
              <Typography color="error" variant="body2" sx={{ textAlign: 'center', mb: 1 }}>
                {error}
              </Typography>
            </Grid>
          )}
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Full Name"
              name="fullName"
              value={data.fullName}
              onChange={handleChange}
              variant="outlined"
              placeholder="e.g JOHN DOE"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              select
              label="Gender"
              name="gender"
              value={data.gender}
              onChange={handleChange}
              variant="outlined"
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Date of Birth"
              name="dob"
              type="date"
              value={data.dob}
              onChange={handleChange}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Father's Name"
              name="fatherName"
              value={data.fatherName}
              onChange={handleChange}
              variant="outlined"
              placeholder="e.g. SM J DOE"
            />
          </Grid>
          <Grid size={12}>
            <TextField
              fullWidth
              multiline
              rows={2}
              label="Permanent Address"
              name="address"
              value={data.address}
              onChange={handleChange}
              variant="outlined"
              placeholder="Enter complete address..."
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', pb: 0 }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleSubmit}
            disabled={!data.fullName || !data.dob || loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
            sx={{
              px: 5,
              py: 1.2,
              minWidth: 180,
              fontSize: '1.1rem',
              fontWeight: 700,
              boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)',
              borderRadius: 2
            }}
          >
            {loading ? 'Processing...' : 'Next Step'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default PanFormDetails;
