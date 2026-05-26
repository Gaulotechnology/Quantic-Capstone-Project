import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';

export const ScrollProgress: React.FC = () => {
  const [scroll, setScroll] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      setScroll(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: `${scroll}%`,
        height: 4,
        background: `linear-gradient(90deg, #7EC845 0%, #98D36A 100%)`,
        zIndex: 2000,
        transition: 'width 0.1s ease-out',
        borderRadius: '0 2px 2px 0',
        boxShadow: '0 0 10px rgba(126, 200, 69, 0.4)',
      }}
    />
  );
};
