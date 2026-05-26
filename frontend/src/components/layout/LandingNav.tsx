import React, { useState } from 'react';
import {
  AppBar, Box, Toolbar, Button, Container, IconButton,
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
    { text: 'Our Services', path: '/services' },
    { text: 'About Us', path: '/about' },
  ];

  return (
    <>
      <AppBar 
        position="fixed" 
        elevation={0}
        sx={{
          top: trigger ? 16 : 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: trigger ? 'calc(100% - 32px)' : '100%',
          maxWidth: trigger ? '1200px' : '100%',
          borderRadius: trigger ? 4 : 0,
          background: trigger ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.3)',
          backdropFilter: 'blur(20px)', 
          color: 'text.primary',
          transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: trigger ? '0 12px 30px -10px rgba(27, 42, 74, 0.08), 0 1px 3px rgba(27, 42, 74, 0.02)' : 'none',
          border: '1px solid',
          borderColor: trigger ? 'rgba(27, 42, 74, 0.06)' : 'rgba(255, 255, 255, 0.2)',
          zIndex: 1100,
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between', minHeight: '76px !important', px: trigger ? 2 : 0, transition: 'all 0.3s' }}>
            {/* Logo */}
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'scale(1.02)' }
              }} 
              onClick={() => navigate('/')}
            >
              <Box component="img" src="/logo.png" alt="Tumaini AI" sx={{ height: 48, display: 'block' }} />
            </Box>

            {/* Navigation Links */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
              {menuItems.map(item => (
                <Button 
                  key={item.text} 
                  onClick={() => navigate(item.path)}
                  sx={{ 
                    color: 'text.primary', 
                    fontWeight: 600, 
                    px: 2, 
                    py: 1,
                    borderRadius: 2, 
                    '&:hover': { 
                      bgcolor: alpha('#7EC845', 0.06), 
                      color: 'primary.main',
                      transform: 'translateY(0)' 
                    },
                    '&:active': {
                      transform: 'translateY(0)'
                    }
                  }}
                >
                  {item.text}
                </Button>
              ))}
              
              <Box sx={{ ml: 3, display: 'flex', gap: 1.5 }}>
                <Button 
                  variant="outlined" 
                  onClick={() => navigate('/login')}
                  sx={{ 
                    borderRadius: 2.5, 
                    px: 3, 
                    borderWidth: '1.5px', 
                    fontWeight: 600,
                    borderColor: 'secondary.main',
                    color: 'secondary.main',
                    '&:hover': { 
                      borderWidth: '1.5px', 
                      bgcolor: alpha('#1B2A4A', 0.04),
                      borderColor: 'secondary.main',
                    } 
                  }}
                >
                  Client Portal
                </Button>
                <Button 
                  variant="contained" 
                  onClick={() => navigate('/register')}
                  sx={{ 
                    borderRadius: 2.5, 
                    px: 3, 
                    fontWeight: 700, 
                    boxShadow: '0 4px 14px rgba(126,200,69,0.3)',
                    '&:hover': {
                      boxShadow: '0 6px 20px rgba(126,200,69,0.45)',
                      bgcolor: 'primary.light'
                    }
                  }}
                >
                  Join Our Pool
                </Button>
              </Box>
            </Box>

            {/* Mobile Menu Icon */}
            <IconButton 
              color="inherit" 
              onClick={() => setMobileOpen(true)} 
              sx={{ 
                display: { md: 'none' },
                bgcolor: trigger ? alpha('#7EC845', 0.06) : alpha('#ffffff', 0.5),
                '&:hover': { bgcolor: alpha('#7EC845', 0.1) }
              }}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer 
        anchor="right" 
        open={mobileOpen} 
        onClose={() => setMobileOpen(false)} 
        slotProps={{ 
          paper: { 
            sx: { 
              width: 290, 
              borderLeft: '1px solid rgba(27, 42, 74, 0.06)',
              backdropFilter: 'blur(20px)',
              background: 'rgba(255, 255, 255, 0.95)'
            } 
          } 
        }}
      >
        <Box sx={{ p: 4 }}>
          <Box component="img" src="/logo.png" alt="Tumaini AI" sx={{ height: 40, mb: 4, display: 'block' }} />
          <List sx={{ mb: 2 }}>
            {menuItems.map(item => (
              <ListItem key={item.text} disablePadding onClick={() => { navigate(item.path); setMobileOpen(false); }} sx={{ mb: 1 }}>
                <Button 
                  fullWidth 
                  sx={{ 
                    justifyContent: 'flex-start', 
                    py: 1.5, 
                    px: 2,
                    color: 'text.primary', 
                    fontWeight: 600, 
                    borderRadius: 2,
                    '&:hover': { bgcolor: alpha('#7EC845', 0.06), color: 'primary.main' }
                  }}
                >
                  {item.text}
                </Button>
              </ListItem>
            ))}
          </List>
          <Divider sx={{ my: 3 }} />
          <Stack spacing={2}>
            <Button 
              fullWidth 
              variant="outlined" 
              onClick={() => { navigate('/login'); setMobileOpen(false); }} 
              sx={{ 
                borderRadius: 2.5, 
                py: 1.5,
                borderWidth: '1.5px',
                borderColor: 'secondary.main',
                color: 'secondary.main',
                '&:hover': { borderWidth: '1.5px', bgcolor: alpha('#1B2A4A', 0.04), borderColor: 'secondary.main' }
              }}
            >
              Client Portal
            </Button>
            <Button 
              fullWidth 
              variant="contained" 
              onClick={() => { navigate('/register'); setMobileOpen(false); }} 
              sx={{ 
                borderRadius: 2.5, 
                py: 1.5, 
                fontWeight: 700,
                boxShadow: '0 4px 12px rgba(126,200,69,0.3)',
                '&:hover': { boxShadow: '0 6px 18px rgba(126,200,69,0.45)' }
              }}
            >
              Join Our Pool
            </Button>
          </Stack>
        </Box>
      </Drawer>
    </>
  );
};
