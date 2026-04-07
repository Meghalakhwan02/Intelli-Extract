import { Box, Paper, Typography, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import type { UploadPreviewProps } from '../types';
import { useRef } from 'react';
import { LANGUAGES, documentTypes } from './DocumentTypeSelector';

export default function UploadPreview({ 
    title, 
    selectedType, 
    onSelectType,
    selectedLanguage, 
    onSelectLanguage,
    uploadedFile, 
    onFileUpload, 
    isProcessing = false, 
    isFixed = false 
}: UploadPreviewProps) {
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
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
                boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
                backdropFilter: 'blur(4px)',
                borderRadius: 1.25,
            }}
        >
            <Typography variant="h6" gutterBottom sx={{ mb: 1.5, fontWeight: 700, fontSize: '1rem', color: 'primary.light' }}>
                {title || 'Document Preview'}
            </Typography>

            {/* Selection Dropdowns for non-fixed docs */}
            {!isFixed && (
                <Box sx={{ display: 'flex', gap: 1, mb: 1.5 }}>
                    <FormControl fullWidth size="small">
                        <InputLabel sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>Language</InputLabel>
                        <Select
                            value={selectedLanguage}
                            label="Language"
                            onChange={(e) => onSelectLanguage?.(e.target.value)}
                            sx={{
                                borderRadius: 1.5,
                                background: 'rgba(0,0,0,0.2)',
                                fontSize: '0.85rem',
                                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' }
                            }}
                        >
                            {LANGUAGES.map(lang => (
                                <MenuItem key={lang.value} value={lang.value} sx={{ fontSize: '0.85rem' }}>{lang.label}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth size="small">
                        <InputLabel sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>Doc Type</InputLabel>
                        <Select
                            value={selectedType}
                            label="Doc Type"
                            onChange={(e) => onSelectType?.(e.target.value)}
                            sx={{
                                borderRadius: 1.5,
                                background: 'rgba(0,0,0,0.2)',
                                fontSize: '0.85rem',
                            }}
                        >
                            {documentTypes.map(type => (
                                <MenuItem key={type.id} value={type.id} sx={{ fontSize: '0.85rem' }}>{type.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
            )}

            {/* Preview Area */}
            <Box
                sx={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px dashed',
                    borderColor: uploadedFile ? 'primary.main' : 'rgba(255, 255, 255, 0.1)',
                    borderRadius: 3,
                    mb: 1.5,
                    overflow: 'hidden',
                    background: 'rgba(0, 0, 0, 0.2)',
                    position: 'relative',
                    opacity: isProcessing ? 0.7 : 1,
                    transition: 'all 0.3s ease',
                    minHeight: 80,
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
                            style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '10px' }}
                        >
                            {uploadedFile.type.startsWith('image/') ? (
                                <img
                                    src={URL.createObjectURL(uploadedFile)}
                                    alt="Uploaded document"
                                    style={{
                                        maxWidth: '100%',
                                        maxHeight: '100%',
                                        objectFit: 'contain',
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                                    }}
                                />
                            ) : uploadedFile.type === 'application/pdf' || uploadedFile.name.toLowerCase().endsWith('.pdf') ? (
                                <Box sx={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
                                    <iframe
                                        src={`${URL.createObjectURL(uploadedFile)}#view=FitH&scrollbar=0&toolbar=0&navpanes=0`}
                                        title="PDF Preview"
                                        style={{
                                            width: '100%',
                                            height: 'calc(100% + 20px)',
                                            marginTop: '-10px',
                                            border: 'none',
                                            borderRadius: '8px',
                                        }}
                                    />
                                    {/* Overlay label */}
                                    <Box sx={{ 
                                        position: 'absolute', 
                                        top: 5, 
                                        right: 5, 
                                        background: 'rgba(239, 68, 68, 0.9)', 
                                        color: 'white', 
                                        px: 1, 
                                        py: 0.25, 
                                        borderRadius: 1,
                                        fontSize: '0.65rem',
                                        fontWeight: 800,
                                        pointerEvents: 'none'
                                    }}>
                                        PDF
                                    </Box>
                                </Box>
                            ) : (
                                <Box sx={{ textAlign: 'center' }}>
                                    <InsertDriveFileIcon sx={{ fontSize: 60, color: 'primary.light', mb: 1, filter: 'drop-shadow(0 2px 8px rgba(99, 102, 241, 0.4))' }} />
                                    <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary', fontWeight: 600, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {uploadedFile.name}
                                    </Typography>
                                </Box>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="placeholder"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{ textAlign: 'center', padding: '20px' }}
                        >
                            <CloudUploadIcon sx={{ fontSize: 60, color: 'rgba(255, 255, 255, 0.15)', mb: 1.5 }} />
                            <Typography variant="body2" color="text.secondary" sx={{ opacity: 0.8, fontSize: '0.85rem' }}>
                                {isFixed ? `Upload ${title}` : 'Drop file or click to select'}
                            </Typography>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Box>

            {/* Upload Button */}
            <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                style={{ display: 'none' }}
                disabled={isProcessing}
            />
            <motion.div 
                whileHover={{ scale: (isProcessing || (!isFixed && (!selectedType || !selectedLanguage))) ? 1 : 1.02 }} 
                whileTap={{ scale: (isProcessing || (!isFixed && (!selectedType || !selectedLanguage))) ? 1 : 0.98 }}
            >
                <Button
                    variant="contained"
                    fullWidth
                    startIcon={!isProcessing && <CloudUploadIcon />}
                    onClick={handleUploadClick}
                    disabled={(!isFixed && (!selectedType || !selectedLanguage)) || isProcessing}
                    sx={{
                        py: 1,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        boxShadow: '0 4px 14px 0 rgba(99, 102, 241, 0.39)',
                        background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                        '&:hover': {
                            background: 'linear-gradient(135deg, #4f46e5 0%, #db2777 100%)',
                        },
                        '&.Mui-disabled': {
                            background: 'rgba(255, 255, 255, 0.1)',
                            color: 'rgba(255, 255, 255, 0.3)',
                        }
                    }}
                >
                    {isProcessing ? 'Reading...' : (uploadedFile ? 'Change' : 'Upload')}
                </Button>
            </motion.div>
        </Paper>
    );
}
