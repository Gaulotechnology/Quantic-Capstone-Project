import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Card, CardContent, Grid, Chip, Stack, CircularProgress, Button, alpha } from '@mui/material';
import { Work as WorkIcon, LocationOn as LocationOnIcon, CalendarToday as CalendarIcon } from '@mui/icons-material';
import { jobApi } from '../../api/jobs';
import type { JobApplication } from '../../types';

const statusConfig: Record<string, { color: 'info' | 'success' | 'error' | 'primary' | 'secondary' | 'warning' | 'default', label: string }> = {
  SUBMITTED: { color: 'info', label: 'Submitted' },
  SHORTLISTED: { color: 'success', label: 'Shortlisted' },
  REJECTED: { color: 'error', label: 'Rejected' },
  INTERVIEW: { color: 'primary', label: 'Interview' },
  OFFERED: { color: 'secondary', label: 'Offered' },
};

export const CandidateApplications: React.FC = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    jobApi.getApplications().then(d => setApplications(Array.isArray(d) ? d : [])).catch(() => {}).finally(() => setIsLoading(false));
  }, []);

  return (
    <Box sx={{ animation: 'fadeInUp 0.4s ease-out' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5, letterSpacing: '-0.02em' }}>Your Applications</Typography>
        <Typography variant="body1" color="text.secondary">Track the status of your job applications</Typography>
      </Box>

      {isLoading ? <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>
      : applications.length === 0 ? (
        <Card sx={{ textAlign: 'center', py: 10 }}>
          <Box sx={{ width: 80, height: 80, borderRadius: '50%', mx: 'auto', mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `linear-gradient(135deg, ${alpha('#7EC845', 0.1)}, ${alpha('#FF9A6C', 0.05)})` }}>
            <WorkIcon sx={{ fontSize: 36, color: 'primary.main' }} />
          </Box>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>You haven't applied for any jobs yet</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Start browsing our job board to find your next opportunity!</Typography>
          <Button variant="contained" href="/candidate/jobs" sx={{ borderRadius: 2 }}>Browse Jobs</Button>
        </Card>
      ) : (
        <Stack spacing={2}>
          {applications.map((app) => {
            const config = statusConfig[app.status] || { color: 'default' as const, label: app.status };
            return (
              <Card key={app.id} variant="outlined" sx={{ borderColor: 'divider', '&:hover': { borderColor: 'primary.main', bgcolor: alpha('#7EC845', 0.02) } }}>
                <CardContent sx={{ p: 3 }}>
                  <Grid container spacing={2} sx={{ alignItems: 'center' }}>
                    <Grid size={{ xs: 12, md: 7 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>{app.job?.title || 'Unknown Position'}</Typography>
                      <Stack direction="row" spacing={2} sx={{ mt: 0.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                          <LocationOnIcon sx={{ fontSize: 16 }} />
                          <Typography variant="body2">{app.job?.location || 'Remote'}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                          <CalendarIcon sx={{ fontSize: 16 }} />
                          <Typography variant="body2">Applied on {new Date(app.applied_at).toLocaleDateString()}</Typography>
                        </Box>
                      </Stack>
                    </Grid>
                    <Grid size={{ xs: 12, md: 5 }}>
                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                        <Chip label={config.label} color={config.color} sx={{ fontWeight: 700, borderRadius: 1.5 }} />
                        <Button variant="outlined" size="small" sx={{ borderRadius: 2 }} onClick={() => navigate(`/candidate/jobs`)}>View Job</Button>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            );
          })}
        </Stack>
      )}
    </Box>
  );
};
