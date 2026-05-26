import React from 'react';
import { Fab, Zoom, useScrollTrigger } from '@mui/material';
import { KeyboardArrowUp as UpIcon } from '@mui/icons-material';

export const BackToTop: React.FC = () => {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 400,
  });

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Zoom in={trigger}>
      <Fab
        size="small"
        aria-label="scroll back to top"
        onClick={handleClick}
        sx={{
          position: 'fixed',
          bottom: 32,
          left: 32,
          bgcolor: 'background.paper',
          color: 'text.secondary',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          border: '1px solid',
          borderColor: 'divider',
          '&:hover': {
            bgcolor: '#1B2A4A',
            color: '#fff',
            transform: 'translateY(-4px)',
          },
          transition: 'all 0.3s ease',
          zIndex: 1000,
        }}
      >
        <UpIcon />
      </Fab>
    </Zoom>
  );
};
