import React from 'react';
import { Fab, Tooltip, Zoom, useTheme } from '@mui/material';
import { WhatsApp as WhatsAppIcon } from '@mui/icons-material';

export const WhatsAppButton: React.FC = () => {
  const theme = useTheme();
  
  // Replace with actual Tumaini WhatsApp number
  const phoneNumber = "27123456789"; 
  const message = encodeURIComponent("Hello Tumaini Consultancy, I'm interested in learning more about your talent solutions.");
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <Tooltip title="Chat with a Consultant" placement="left" arrow>
      <Zoom in style={{ transitionDelay: '1000ms' }}>
        <Fab
          color="primary"
          aria-label="whatsapp"
          onClick={() => window.open(whatsappUrl, '_blank')}
          sx={{
            position: 'fixed',
            bottom: { xs: 20, md: 32 },
            right: { xs: 20, md: 32 },
            bgcolor: '#25D366', // Official WhatsApp Green
            color: '#fff',
            width: { xs: 56, md: 64 },
            height: { xs: 56, md: 64 },
            zIndex: theme.zIndex.tooltip + 1,
            boxShadow: '0 8px 24px rgba(37, 211, 102, 0.35)',
            '&:hover': {
              bgcolor: '#128C7E', // Darker WhatsApp Green
              transform: 'scale(1.1) rotate(5deg)',
              boxShadow: '0 12px 32px rgba(37, 211, 102, 0.45)',
            },
            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          }}
        >
          <WhatsAppIcon sx={{ fontSize: { xs: 30, md: 36 } }} />
        </Fab>
      </Zoom>
    </Tooltip>
  );
};
