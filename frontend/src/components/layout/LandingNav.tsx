import React, { useState } from 'react';
import {
  AppBar, Box, Toolbar, Button, Container, IconButton, Typography,
  Drawer, List, ListItem, useScrollTrigger, alpha, Stack, Divider,
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export const LandingNav: React.FC = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 20 });

  const menuItems = [
    { text: 'Browse Jobs', path: '/jobs' },
    { text: 'About Us', path: '/about' },
    { text: 'Our Services', path: '/services' },
    { text: 'Consultancy Login', path: '/login' },
  ];

  return (
    <>
      <AppBar position="fixed" elevation={trigger ? 4 : 0}
        sx={{
          background: trigger ? 'rgba(255,255,255,0.85)' : 'transparent',
          backdropFilter: trigger ? 'blur(20px)' : 'none', 
          color: 'text.primary',
          transition: 'all 0.3s ease-in-out',
          boxShadow: trigger ? '0 4px 20px rgba(0,0,0,0.05)' : 'none',
          borderBottom: trigger ? '1px solid' : 'none',
          borderColor: 'divider',
        }}>
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between', minHeight: '70px !important' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: 1.5 }} onClick={() => navigate('/')}>
              <Box sx={{ width: 34, height: 34, borderRadius: 1.5, background: 'linear-gradient(135deg, #7EC845 0%, #98D36A 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography sx={{ color: '#fff', fontWeight: 900, fontSize: 20 }}>T</Typography>
              </Box>
              <Typography variant="h6" sx={{ color: 'inherit', fontWeight: 900, letterSpacing: '-0.02em' }}>Tumaini AI</Typography>
            </Box>
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
              {menuItems.map(item => (
                <Button key={item.text} onClick={() => navigate(item.path)}
                  sx={{ color: 'inherit', fontWeight: 600, px: 2, borderRadius: 2, '&:hover': { bgcolor: alpha('#7EC845', 0.06) } }}>
                  {item.text}
                </Button>
              ))}
              <Box sx={{ ml: 2, display: 'flex', gap: 1.5 }}>
                <Button variant="outlined" onClick={() => navigate('/login')}
                  sx={{ borderRadius: 2.5, px: 3, borderWidth: 2, '&:hover': { borderWidth: 2 } }}>
                  Partner with Us
                </Button>
                <Button variant="contained" onClick={() => navigate('/register')}
                  sx={{ borderRadius: 2.5, px: 3, fontWeight: 700, boxShadow: '0 4px 12px rgba(126,200,69,0.3)' }}>
                  Join Now
                </Button>
              </Box>
            </Box>
            <IconButton color="inherit" onClick={() => setMobileOpen(true)} sx={{ display: { md: 'none' } }}>
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer anchor="right" open={mobileOpen} onClose={() => setMobileOpen(false)} slotProps={{ paper: { sx: { width: 280 } } }}>
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 900, mb: 3 }}>Tumaini AI</Typography>
          <List>
            {menuItems.map(item => (
              <ListItem key={item.text} disablePadding onClick={() => { navigate(item.path); setMobileOpen(false); }}>
                <Button fullWidth sx={{ justifyContent: 'flex-start', py: 1.5, color: 'text.primary', fontWeight: 600, borderRadius: 2 }}>{item.text}</Button>
              </ListItem>
            ))}
          </List>
          <Divider sx={{ my: 2 }} />
          <Stack spacing={2}>
            <Button fullWidth variant="outlined" onClick={() => { navigate('/login'); setMobileOpen(false); }} sx={{ borderRadius: 2.5, py: 1.2 }}>Sign In</Button>
            <Button fullWidth variant="contained" onClick={() => { navigate('/register'); setMobileOpen(false); }} sx={{ borderRadius: 2.5, py: 1.2 }}>Get Started</Button>
          </Stack>
        </Box>
      </Drawer>
    </>
  );
};
