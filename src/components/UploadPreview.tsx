import { Box, Paper, Typography, Button } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import type { UploadPreviewProps } from '../types';
import { useRef } from 'react';

export default function UploadPreview({ selectedType, uploadedFile, onFileUpload, isProcessing = false }: UploadPreviewProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        onFileUpload(file);
        // Reset input value to allow re-uploading the same file
        event.target.value = '';
    };

    const handleUploadClick = () => {
        if (!isProcessing) {
            fileInputRef.current?.click();
        }
    };

    return (
        <Paper
            elevation={3}
            sx={{
                height: '100%',
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
            }}
        >
            <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
                Document Preview
            </Typography>

            {/* Preview Area */}
            <Box
                sx={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px dashed',
                    borderColor: uploadedFile ? 'primary.main' : 'rgba(255, 255, 255, 0.2)',
                    borderRadius: 3,
                    mb: 3,
                    overflow: 'hidden',
                    background: 'rgba(0, 0, 0, 0.2)',
                    position: 'relative',
                    opacity: isProcessing ? 0.7 : 1,
                    transition: 'opacity 0.3s ease',
                }}
            >
                <AnimatePresence mode="wait">
                    {uploadedFile ? (
                        <motion.div
                            key="preview"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3 }}
                            style={{
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <img
                                src={URL.createObjectURL(uploadedFile)}
                                alt="Uploaded document"
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: '100%',
                                    objectFit: 'contain',
                                    borderRadius: '8px',
                                }}
                            />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="placeholder"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{
                                textAlign: 'center',
                                padding: '40px',
                            }}
                        >
                            <CloudUploadIcon sx={{ fontSize: 80, color: 'rgba(255, 255, 255, 0.3)', mb: 2 }} />
                            <Typography variant="body1" color="text.secondary">
                                No document uploaded
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                Select a {selectedType || 'document type'} and upload
                            </Typography>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Box>

            {/* Upload Button */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
                disabled={isProcessing}
            />
            <motion.div whileHover={{ scale: isProcessing ? 1 : 1.02 }} whileTap={{ scale: isProcessing ? 1 : 0.98 }}>
                <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    startIcon={!isProcessing && <CloudUploadIcon />}
                    onClick={handleUploadClick}
                    disabled={!selectedType || isProcessing}
                    sx={{
                        py: 1.5,
                        fontSize: '1rem',
                        fontWeight: 600,
                    }}
                >
                    {isProcessing ? 'Processing Document...' : (uploadedFile ? 'Change Document' : 'Upload Document')}
                </Button>
            </motion.div>
        </Paper>
    );
}
