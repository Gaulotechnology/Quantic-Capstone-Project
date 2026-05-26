import React, { useState, useEffect } from 'react';
import { 
  Paper, Typography, Button, Stack, Slide, Box 
} from '@mui/material';
import { Security as SecurityIcon } from '@mui/icons-material';

export const CookieConsent: React.FC = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setTimeout(() => setOpen(true), 2000);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'true');
    setOpen(false);
  };

  return (
    <Slide direction="up" in={open} mountOnEnter unmountOnExit>
      <Paper
        elevation={24}
        sx={{
          position: 'fixed',
          bottom: { xs: 0, sm: 24 },
          left: { xs: 0, sm: 24 },
          right: { xs: 0, sm: 'auto' },
          width: { xs: '100%', sm: 400 },
          p: 3,
          borderRadius: { xs: 0, sm: 4 },
          bgcolor: 'rgba(27, 42, 74, 0.95)',
          backdropFilter: 'blur(10px)',
          color: '#fff',
          zIndex: 3000,
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <SecurityIcon sx={{ color: '#7EC845' }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Privacy Preference</Typography>
          </Box>
          <Typography variant="body2" sx={{ opacity: 0.8, lineHeight: 1.6 }}>
            We use cookies to enhance your experience and analyze our traffic in accordance with our Privacy Policy.
          </Typography>
          <Stack direction="row" spacing={2} sx={{ pt: 1 }}>
            <Button 
              fullWidth 
              variant="contained" 
              onClick={handleAccept}
              sx={{ bgcolor: '#7EC845', color: '#fff', '&:hover': { bgcolor: '#5F9F2F' }, fontWeight: 700, borderRadius: 2 }}
            >
              Accept All
            </Button>
            <Button 
              fullWidth 
              variant="outlined" 
              onClick={() => setOpen(false)}
              sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)', '&:hover': { borderColor: '#fff' }, fontWeight: 700, borderRadius: 2 }}
            >
              Settings
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Slide>
  );
};
