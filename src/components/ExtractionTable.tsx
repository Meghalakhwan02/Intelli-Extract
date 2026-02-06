import {
    Paper,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Box,
    CircularProgress,
} from '@mui/material';
import { motion } from 'framer-motion';
import type { ExtractionTableProps } from '../types';

const getScoreStyle = (score: any) => {
    let numericScore = score;
    if (typeof score === 'string' && score.includes('%')) {
        numericScore = parseFloat(score) / 100;
    }

    if (numericScore >= 0.95) return {
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', // Emerald
        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)',
    };
    if (numericScore >= 0.85) return {
        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', // Amber
        boxShadow: '0 4px 12px rgba(245, 158, 11, 0.4)',
    };
    return {
        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', // Red
        boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)',
    };
};

export default function ExtractionTable({ selectedType, data = [], isLoading = false, rawText = '' }: ExtractionTableProps) {
    return (
        <Paper
            elevation={3}
            sx={{
                height: '100%',
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
                overflow: 'auto',
            }}
        >
            <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
                Extraction Results
            </Typography>

            <TableContainer sx={{ flex: 1, overflow: 'auto', maxHeight: '60%', mb: rawText ? 3 : 0 }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell
                                sx={{
                                    fontWeight: 700,
                                    fontSize: '0.95rem',
                                    backgroundColor: 'rgba(30, 41, 59, 0.98)',
                                    zIndex: 2,
                                    position: 'sticky',
                                    top: 0,
                                }}
                            >
                                Attribute
                            </TableCell>
                            <TableCell
                                sx={{
                                    fontWeight: 700,
                                    fontSize: '0.95rem',
                                    backgroundColor: 'rgba(30, 41, 59, 0.98)',
                                    zIndex: 2,
                                    position: 'sticky',
                                    top: 0,
                                }}
                            >
                                M1
                            </TableCell>
                            <TableCell
                                sx={{
                                    fontWeight: 700,
                                    fontSize: '0.95rem',
                                    backgroundColor: 'rgba(30, 41, 59, 0.98)',
                                    zIndex: 2,
                                    position: 'sticky',
                                    top: 0,
                                }}
                            >
                                M2
                            </TableCell>
                            <TableCell
                                sx={{
                                    fontWeight: 700,
                                    fontSize: '0.95rem',
                                    backgroundColor: 'rgba(30, 41, 59, 0.98)',
                                    zIndex: 2,
                                    position: 'sticky',
                                    top: 0,
                                }}
                            >
                                M3
                            </TableCell>
                            <TableCell
                                align="center"
                                sx={{
                                    fontWeight: 700,
                                    fontSize: '0.95rem',
                                    backgroundColor: 'rgba(30, 41, 59, 0.98)',
                                    zIndex: 2,
                                    position: 'sticky',
                                    top: 0,
                                }}
                            >
                                Score
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 10 }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <CircularProgress size={40} thickness={4} sx={{ mb: 2, color: '#ec4899' }} />
                                        <Typography variant="body1" color="text.secondary">
                                            Extracting data using AI models...
                                        </Typography>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ) : data && data.length > 0 ? (
                            data.map((row, index) => (
                                <TableRow
                                    key={row.attribute}
                                    component={motion.tr}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    sx={{
                                        '&:hover': {
                                            background: 'rgba(99, 102, 241, 0.08)',
                                            transition: 'background 0.2s ease',
                                        },
                                    }}
                                >
                                    <TableCell sx={{ fontWeight: 600 }}>{row.attribute}</TableCell>
                                    <TableCell>{row.m1}</TableCell>
                                    <TableCell>{row.m2}</TableCell>
                                    <TableCell>{row.m3}</TableCell>
                                    <TableCell align="center">
                                        <Box
                                            className="shine-effect"
                                            component={motion.div}
                                            whileHover={{ scale: 1.05 }}
                                            sx={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                minWidth: 60, // Reduced from 80
                                                py: 0.5,      // Reduced from 0.75
                                                px: 1.5,      // Reduced from 2
                                                borderRadius: '16px', // Reduced from 20px
                                                fontWeight: 700,      // Reduced from 800
                                                color: '#ffffff',
                                                fontSize: '0.85rem',  // Reduced from 0.9rem
                                                letterSpacing: '0.01em',
                                                cursor: 'default',
                                                transition: 'transform 0.2s',
                                                ...getScoreStyle(row.score)
                                            }}
                                        >
                                            {row.score}
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: 0.5 }}>
                                        <Typography variant="body1" color="text.secondary">
                                            {selectedType ? 'Upload a document to see extracted data' : 'Select a document type to begin'}
                                        </Typography>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Raw Text Section */}
            {rawText && (
                <Box
                    component={motion.div}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    sx={{
                        mt: 2,
                        p: 2,
                        borderRadius: 2,
                        background: 'rgba(15, 23, 42, 0.6)',
                        border: '1px solid rgba(99, 102, 241, 0.3)',
                        maxHeight: '35%',
                        overflow: 'auto',
                    }}
                >
                    <Typography
                        variant="subtitle2"
                        sx={{
                            mb: 1.5,
                            fontWeight: 700,
                            color: '#ec4899',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            fontSize: '0.75rem',
                        }}
                    >
                        Raw Text (M1)
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            fontFamily: 'monospace',
                            fontSize: '0.85rem',
                            lineHeight: 1.6,
                            color: 'rgba(255, 255, 255, 0.85)',
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word',
                        }}
                    >
                        {rawText}
                    </Typography>
                </Box>
            )}
        </Paper>
    );
}
