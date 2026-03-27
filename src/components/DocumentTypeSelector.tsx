import { Paper, Typography, List, ListItemButton, ListItemIcon, ListItemText, FormControl, InputLabel, Select, MenuItem, Divider, Box } from '@mui/material';
import { motion } from 'framer-motion';
import DescriptionIcon from '@mui/icons-material/Description';
import BadgeIcon from '@mui/icons-material/Badge';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import HomeIcon from '@mui/icons-material/Home';
import SchoolIcon from '@mui/icons-material/School';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import BoltIcon from '@mui/icons-material/Bolt';
import LanguageIcon from '@mui/icons-material/Language';
import type { DocumentTypeSelectorProps, DocumentType } from '../types';

const documentTypes: DocumentType[] = [
    { id: 'passport', name: 'Passport', icon: 'passport' },
    { id: 'voterid', name: 'Voter ID', icon: 'voterid' },
    { id: 'domicile', name: 'Domicile', icon: 'domicile' },
    { id: 'license', name: 'Driving License', icon: 'license' },
    { id: 'marksheet', name: 'Marksheet', icon: 'marksheet' },
    { id: 'waterbill', name: 'Water Bill', icon: 'waterbill' },
    { id: 'electricitybill', name: 'Electricity Bill', icon: 'electricitybill' },
];

const LANGUAGES = [
    { value: 'english', label: 'English' },
    { value: 'hindi', label: 'Hindi (हिन्दी)' },
    { value: 'bengali', label: 'Bengali (বাংলা)' },
    { value: 'telugu', label: 'Telugu (తెలుగు)' },
    { value: 'marathi', label: 'Marathi (मराठी)' },
    { value: 'tamil', label: 'Tamil (தமிழ்)' },
    { value: 'urdu', label: 'Urdu (اردو)' },
    { value: 'gujarati', label: 'Gujarati (ગુજરાતી)' },
    { value: 'kannada', label: 'Kannada (ಕನ್ನಡ)' },
    { value: 'odia', label: 'Odia (ଓଡ଼ିଆ)' },
    { value: 'malayalam', label: 'Malayalam (മലയാളം)' },
    { value: 'punjabi', label: 'Punjabi (ਪੰਜਾਬੀ)' },
];

const getIcon = (iconType: string) => {
    switch (iconType) {
        case 'passport': return <BadgeIcon />;
        case 'voterid': return <HowToVoteIcon />;
        case 'domicile': return <HomeIcon />;
        case 'license': return <DirectionsCarIcon />;
        case 'marksheet': return <SchoolIcon />;
        case 'waterbill': return <WaterDropIcon />;
        case 'electricitybill': return <BoltIcon />;
        default: return <DescriptionIcon />;
    }
};

export default function DocumentTypeSelector({
    selectedType, onSelectType, selectedLanguage, onSelectLanguage
}: DocumentTypeSelectorProps) {
    return (
        <Paper
            elevation={3}
            sx={{
                height: '100%',
                p: 2.5,
                display: 'flex',
                flexDirection: 'column',
                background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
                overflow: 'hidden',
            }}
        >
            {/* Language Selector */}
            <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                    <LanguageIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.7rem' }}>
                        Language
                    </Typography>
                </Box>
                <FormControl fullWidth size="small">
                    <InputLabel
                        id="lang-label"
                        sx={{ color: 'text.secondary', '&.Mui-focused': { color: 'primary.main' } }}
                    >
                        Select Language
                    </InputLabel>
                    <Select
                        labelId="lang-label"
                        value={selectedLanguage}
                        label="Select Language"
                        onChange={(e) => onSelectLanguage(e.target.value)}
                        sx={{
                            borderRadius: 2,
                            color: 'text.primary',
                            background: 'rgba(0,0,0,0.2)',
                            '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.12)' },
                            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.light' },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' },
                            '.MuiSvgIcon-root': { color: 'text.secondary' },
                        }}
                        MenuProps={{
                            PaperProps: {
                                sx: {
                                    background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.98) 0%, rgba(15, 23, 42, 0.98) 100%)',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    backdropFilter: 'blur(10px)',
                                    maxHeight: 260,
                                    '&::-webkit-scrollbar': { width: '2px' },
                                    '&::-webkit-scrollbar-track': { background: 'transparent' },
                                    '&::-webkit-scrollbar-thumb': { background: 'rgba(255,255,255,0.15)', borderRadius: '10px' },
                                    '& .MuiMenuItem-root': {
                                        fontSize: '0.875rem',
                                        color: 'text.secondary',
                                        '&:hover': { backgroundColor: 'rgba(99,102,241,0.12)', color: 'primary.main' },
                                        '&.Mui-selected': {
                                            backgroundColor: 'rgba(99,102,241,0.2)',
                                            color: 'primary.main',
                                            '&:hover': { backgroundColor: 'rgba(99,102,241,0.25)' },
                                        },
                                    },
                                },
                            },
                        }}
                    >
                        {LANGUAGES.map((lang) => (
                            <MenuItem key={lang.value} value={lang.value}>{lang.label}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            <Divider sx={{ borderColor: 'rgba(255,255,255,0.07)', mb: 2 }} />

            {/* Document Type Header */}
            <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 600, fontSize: '1rem', flexShrink: 0 }}>
                Document Type
            </Typography>

            {/* Scrollable List */}
            <List
                sx={{
                    p: 0,
                    flex: 1,
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    pr: 0.5, // slightly pad the right side
                    '&::-webkit-scrollbar': { width: '2px' }, // thinner scrollbar
                    '&::-webkit-scrollbar-track': { background: 'transparent' },
                    '&::-webkit-scrollbar-thumb': {
                        background: 'rgba(255,255,255,0.15)', // more classy, subtle color
                        borderRadius: '2px',
                        '&:hover': { background: 'rgba(255,255,255,0.3)' },
                    },
                }}
            >
                {documentTypes.map((type, index) => (
                    <motion.div
                        key={type.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.07 }}
                    >
                        <ListItemButton
                            selected={selectedType === type.id}
                            onClick={() => onSelectType(type.id)}
                            sx={{
                                mb: 1,
                                borderRadius: 2,
                                border: '1px solid',
                                borderColor: selectedType === type.id ? 'primary.main' : 'rgba(255,255,255,0.08)',
                                background: selectedType === type.id
                                    ? 'linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(236,72,153,0.2) 100%)'
                                    : 'transparent',
                                transition: 'all 0.25s ease',
                                py: 1,
                                '&:hover': {
                                    background: 'linear-gradient(135deg, rgba(99,102,241,0.13) 0%, rgba(236,72,153,0.13) 100%)',
                                    borderColor: 'primary.light',
                                    transform: 'translateX(5px)',
                                },
                                '&.Mui-selected': {
                                    background: 'linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(236,72,153,0.2) 100%)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, rgba(99,102,241,0.25) 0%, rgba(236,72,153,0.25) 100%)',
                                    },
                                },
                            }}
                        >
                            <ListItemIcon sx={{ color: selectedType === type.id ? 'primary.main' : 'text.secondary', minWidth: 36 }}>
                                {getIcon(type.icon)}
                            </ListItemIcon>
                            <ListItemText
                                primary={type.name}
                                primaryTypographyProps={{
                                    fontWeight: selectedType === type.id ? 600 : 400,
                                    color: selectedType === type.id ? 'primary.main' : 'text.primary',
                                    fontSize: '0.9rem',
                                }}
                            />
                        </ListItemButton>
                    </motion.div>
                ))}
            </List>
        </Paper>
    );
}
