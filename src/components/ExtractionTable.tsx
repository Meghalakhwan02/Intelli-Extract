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

    if (numericScore >= 0.90) return {
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
    };
    if (numericScore >= 0.60) return {
        background: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)',
        boxShadow: '0 2px 8px rgba(251, 191, 36, 0.3)',
    };
    if (numericScore >= 0.30) return {
        background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
        boxShadow: '0 2px 8px rgba(249, 115, 22, 0.3)',
    };
    return {
        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)',
    };
};

export default function ExtractionTable({ title, selectedType, data = [], isLoading = false, rawText = '' }: ExtractionTableProps) {
    return (
        <Paper
            elevation={3}
            sx={{
                height: { xs: 'auto', lg: '100%' },
                minHeight: { xs: 350, lg: '100%' },
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
                overflow: 'hidden',
                borderRadius: 1.25,
                boxShadow: '0 4px 20px 0 rgba(0, 0, 0, 0.3)',
            }}
        >
            <Typography variant="subtitle1" sx={{ mb: 1.5, fontWeight: 700, color: 'primary.light', px: 0.5 }}>
                {title || 'Extraction Results'}
            </Typography>

            <TableContainer sx={{ 
                flex: 1, 
                overflow: 'auto', 
                mb: rawText ? 2 : 0,
                '&::-webkit-scrollbar': { width: '4px' },
                '&::-webkit-scrollbar-track': { background: 'transparent' },
                '&::-webkit-scrollbar-thumb': { background: 'rgba(255,255,255,0.1)', borderRadius: '10px' },
                maxHeight: { xs: 400, lg: 'none' }
            }}>
                <Table stickyHeader size="small">
                    <TableHead>
                        <TableRow>
                            {['Attribute', 'OCR', 'V1', 'V2', 'Score'].map((head) => (
                                <TableCell
                                    key={head}
                                    sx={{
                                        fontWeight: 700,
                                        fontSize: '0.75rem',
                                        backgroundColor: '#1e293b',
                                        color: 'text.secondary',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em',
                                        py: 1,
                                        px: 1,
                                        borderBottom: '1px solid rgba(255,255,255,0.1)',
                                    }}
                                    align={head === 'Score' ? 'center' : 'left'}
                                >
                                    {head}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                                    <CircularProgress size={30} thickness={4} sx={{ mb: 1, color: '#ec4899' }} />
                                    <Typography variant="caption" display="block" color="text.secondary">
                                        Analyzing...
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : data && data.length > 0 ? (
                            data.map((row, index) => (
                                <TableRow
                                    key={row.attribute}
                                    component={motion.tr}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: index * 0.03 }}
                                    sx={{
                                        '&:hover': { background: 'rgba(99, 102, 241, 0.05)' },
                                        '& td': { borderBottom: '1px solid rgba(255,255,255,0.03)' }
                                    }}
                                >
                                    <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem', py: 0.75, px: 1 }}>{row.attribute}</TableCell>
                                    <TableCell sx={{ fontSize: '0.8rem', py: 0.75, px: 1 }}>{row.m1}</TableCell>
                                    <TableCell sx={{ fontSize: '0.8rem', py: 0.75, px: 1 }}>{row.m2}</TableCell>
                                    <TableCell sx={{ fontSize: '0.8rem', py: 0.75, px: 1 }}>{row.m3}</TableCell>
                                    <TableCell align="center" sx={{ py: 0.75, px: 1 }}>
                                        <Box
                                            sx={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                minWidth: 45,
                                                py: 0.25,
                                                px: 1,
                                                borderRadius: '12px',
                                                fontWeight: 800,
                                                color: '#ffffff',
                                                fontSize: '0.7rem',
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
                                <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                                    <Typography variant="caption" color="text.secondary" sx={{ opacity: 0.5 }}>
                                        {selectedType ? 'Upload document' : 'Select type and language'}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Raw Text Section - even more compact */}
            {rawText && (
                <Box
                    component={motion.div}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    sx={{
                        mt: 1,
                        p: 1.5,
                        borderRadius: 2,
                        background: 'rgba(0, 0, 0, 0.2)',
                        border: '1px solid rgba(99, 102, 241, 0.3)',
                        height: { xs: 150, lg: 120 },
                        flexShrink: 0,
                        overflow: 'auto',
                        '&::-webkit-scrollbar': { width: '4px' },
                        '&::-webkit-scrollbar-track': { background: 'transparent' },
                        '&::-webkit-scrollbar-thumb': { background: 'rgba(239, 68, 68, 0.4)', borderRadius: '10px' },
                    }}
                >
                    <Typography
                        variant="caption"
                        sx={{
                            mb: 0.5,
                            display: 'block',
                            fontWeight: 800,
                            color: '#ec4899',
                            textTransform: 'uppercase',
                        }}
                    >
                        Raw Output
                    </Typography>
                    <Typography
                        variant="caption"
                        sx={{
                            fontFamily: 'monospace',
                            fontSize: '0.75rem',
                            color: 'rgba(255, 255, 255, 0.7)',
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
