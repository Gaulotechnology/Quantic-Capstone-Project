import React from 'react';
import { 
  Box, Container, Grid, Typography, Stack, Divider 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const AppFooter: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <Box sx={{ bgcolor: '#0D1B2A', color: 'rgba(255,255,255,0.5)', py: { xs: 6, md: 10 }, mt: 'auto' }}>
      <Container maxWidth="lg">
        <Grid container spacing={8}>
          <Grid size={{ xs: 12, md: 5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
              <Box 
                component="img" 
                src="/logo.png" 
                alt="Tumaini AI" 
                sx={{ 
                  height: 42, 
                  display: 'block',
                  filter: 'brightness(0) invert(1)'
                }} 
              />
            </Box>
            <Typography variant="body2" sx={{ lineHeight: 1.8, maxWidth: 400 }}>
              Tumaini is Africa's leading recruitment consultancy, combining deep industry expertise with 
              proprietary AI to deliver unmatched talent solutions across the continent.
            </Typography>
          </Grid>
          <Grid size={{ xs: 6, md: 2.5 }}>
            <Typography variant="subtitle2" sx={{ color: '#fff', fontWeight: 800, mb: 3, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Consultancy</Typography>
            <Stack spacing={2}>
              {[
                { text: 'Exclusive Roles', path: '/jobs' },
                { text: 'Talent Mapping', path: '/talent-mapping' },
                { text: 'Partner with Us', path: '/partner' },
                { text: 'Executive Search', path: '/executive-search' }
              ].map(l => (
                <Typography 
                  key={l.text} 
                  variant="body2" 
                  onClick={() => navigate(l.path)}
                  sx={{ cursor: 'pointer', '&:hover': { color: '#7EC845' } }}
                >
                  {l.text}
                </Typography>
              ))}
            </Stack>
          </Grid>
          <Grid size={{ xs: 6, md: 2.5 }}>
            <Typography variant="subtitle2" sx={{ color: '#fff', fontWeight: 800, mb: 3, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Legal & Info</Typography>
            <Stack spacing={2}>
              {[
                { text: 'About Us', path: '/about' },
                { text: 'Hiring Guide', path: '/hiring-guide' },
                { text: 'Privacy Policy', path: '/privacy' },
                { text: 'Terms of Service', path: '/terms' }
              ].map(l => (
                <Typography 
                  key={l.text} 
                  variant="body2" 
                  onClick={() => navigate(l.path)}
                  sx={{ cursor: 'pointer', '&:hover': { color: '#7EC845' } }}
                >
                  {l.text}
                </Typography>
              ))}
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 2 }}>
            <Typography variant="subtitle2" sx={{ color: '#fff', fontWeight: 800, mb: 3, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Connect</Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>hello@tumaini.ai</Typography>
            <Typography variant="body2">Johannesburg, ZA</Typography>
          </Grid>
        </Grid>
        <Divider sx={{ my: 6, borderColor: 'rgba(255,255,255,0.05)' }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="caption">© 2026 Tumaini Recruitment Consultancy. All rights reserved.</Typography>
          <Typography variant="caption">Powering the African talent ecosystem.</Typography>
        </Box>
      </Container>
    </Box>
  );
};
