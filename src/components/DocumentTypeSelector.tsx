import { Paper, Typography, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { motion } from 'framer-motion';
import DescriptionIcon from '@mui/icons-material/Description';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import BadgeIcon from '@mui/icons-material/Badge';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import HomeIcon from '@mui/icons-material/Home';
import SchoolIcon from '@mui/icons-material/School';
import type { DocumentTypeSelectorProps, DocumentType } from '../types';

const documentTypes: DocumentType[] = [
    { id: 'passport', name: 'Passport', icon: 'passport' },
    { id: 'voterid', name: 'Voter ID', icon: 'voterid' },
    { id: 'domicile', name: 'Domicile', icon: 'domicile' },
    { id: 'license', name: 'Driving License', icon: 'license' },
    { id: 'marksheet', name: 'Marksheet', icon: 'marksheet' },
    { id: 'aadhaar', name: 'Aadhaar Card', icon: 'aadhaar' },
];

const getIcon = (iconType: string) => {
    switch (iconType) {
        case 'passport':
            return <BadgeIcon />;
        case 'voterid':
            return <HowToVoteIcon />;
        case 'domicile':
            return <HomeIcon />;
        case 'license':
            return <DirectionsCarIcon />;
        case 'marksheet':
            return <SchoolIcon />;
        case 'aadhaar':
            return <CreditCardIcon />;
        default:
            return <DescriptionIcon />;
    }
};

export default function DocumentTypeSelector({ selectedType, onSelectType }: DocumentTypeSelectorProps) {
    return (
        <Paper
            elevation={3}
            sx={{
                height: '100%',
                p: 3,
                background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
            }}
        >
            <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
                Document Type
            </Typography>
            <List sx={{ p: 0 }}>
                {documentTypes.map((type, index) => (
                    <motion.div
                        key={type.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <ListItemButton
                            selected={selectedType === type.id}
                            onClick={() => onSelectType(type.id)}
                            sx={{
                                mb: 1.5,
                                borderRadius: 2,
                                border: '1px solid',
                                borderColor: selectedType === type.id ? 'primary.main' : 'rgba(255, 255, 255, 0.1)',
                                background: selectedType === type.id
                                    ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(236, 72, 153, 0.2) 100%)'
                                    : 'transparent',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(236, 72, 153, 0.15) 100%)',
                                    borderColor: 'primary.light',
                                    transform: 'translateX(8px)',
                                },
                                '&.Mui-selected': {
                                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(236, 72, 153, 0.2) 100%)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(236, 72, 153, 0.25) 100%)',
                                    },
                                },
                            }}
                        >
                            <ListItemIcon sx={{ color: selectedType === type.id ? 'primary.main' : 'text.secondary' }}>
                                {getIcon(type.icon)}
                            </ListItemIcon>
                            <ListItemText
                                primary={type.name}
                                primaryTypographyProps={{
                                    fontWeight: selectedType === type.id ? 600 : 400,
                                    color: selectedType === type.id ? 'primary.main' : 'text.primary',
                                }}
                            />
                        </ListItemButton>
                    </motion.div>
                ))}
            </List>
        </Paper>
    );
}
