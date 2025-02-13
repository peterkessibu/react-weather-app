import { Box, Typography } from '@mui/material';

const Footer = () => {
    return (
        <Box 
            component="footer" 
            sx={{ 
                py: 3, 
                px: 2, 
                width: '100%',
                backgroundColor: (theme) => 
                    theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[800],
            }}
        >
            <Typography variant="body1">
                My weather app footer
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
                {'Copyright © '}
                {new Date().getFullYear()}
                {'.'}
            </Typography>
        </Box>
    );
};

export default Footer;