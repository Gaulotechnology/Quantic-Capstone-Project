import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  CircularProgress,
  alpha,
} from '@mui/material';
import {
  Work as WorkIcon,
  People as PeopleIcon,
  Psychology as PsychologyIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../hooks/useAppStore';
import { fetchJobs } from '../../store/slices/jobSlice';
import { cvApi } from '../../api/cv';
import { shortlistApi } from '../../api/matching';
import type { CV } from '../../types';

const statGradients: Record<string, [string, string]> = {
  'Active Jobs': ['#7EC845', '#FF9A6C'],
  'Total Candidates': ['#1B2A4A', '#3D5A80'],
  'Shortlisted': ['#4CAF50', '#66BB6A'],
  'AI Matchings': ['#2196F3', '#64B5F6'],
};

export const RecruiterDashboard: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { jobs } = useAppSelector((state) => state.jobs);
  const [counts, setCounts] = useState({ candidates: '0', shortlisted: '0' });
  const [recentCvs, setRecentCvs] = useState<CV[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        await dispatch(fetchJobs({}) as any);
        const [cvs, shortlists] = await Promise.all([
          cvApi.getMyCVs(),
          shortlistApi.getShortlists()
        ]);
        setCounts({
          candidates: (cvs || []).length.toString(),
          shortlisted: (shortlists || []).reduce((acc, s) => acc + (s.candidates?.length || 0), 0).toString(),
        });
        setRecentCvs(cvs || []);
      } catch {
        // silent
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, [dispatch]);

  const activeJobsCount = (jobs || []).filter(j => j?.status === 'OPEN').length;

  const stats = [
    { label: 'Active Jobs', value: activeJobsCount.toString(), icon: <WorkIcon /> },
    { label: 'Total Candidates', value: counts.candidates, icon: <PeopleIcon /> },
    { label: 'Shortlisted', value: counts.shortlisted, icon: <PeopleIcon /> },
    { label: 'AI Matchings', value: counts.shortlisted, icon: <PsychologyIcon /> },
  ];

  return (
    <Box sx={{ animation: 'fadeInUp 0.4s ease-out' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5, letterSpacing: '-0.02em' }}>
          Recruiter Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome back, {user?.full_name || 'Recruiter'}. Manage your talent acquisition.
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => {
          const gradient = statGradients[stat.label] || ['#7EC845', '#FF9A6C'];
          return (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={stat.label}>
              <Card
                sx={{
                  position: 'relative',
                  overflow: 'hidden',
                  animation: `fadeInUp 0.4s ease-out ${index * 60}ms both`,
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 3,
                    background: `linear-gradient(90deg, ${gradient[0]}, ${gradient[1]})`,
                  },
                }}
              >
                <CardContent sx={{ pt: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5, gap: 1 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: `linear-gradient(135deg, ${alpha(gradient[0], 0.12)}, ${alpha(gradient[1], 0.08)})`,
                        color: gradient[0],
                      }}
                    >
                      {stat.icon}
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                      {stat.label}
                    </Typography>
                  </Box>
                  {isLoading ? (
                    <CircularProgress size={24} sx={{ ml: 1 }} />
                  ) : (
                    <Typography variant="h4" sx={{ fontWeight: 800 }}>
                      {stat.value}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ height: '100%', minHeight: 180 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                Recent Activity
              </Typography>
              {jobs.length > 0 ? (
                <Box>
                  {jobs.slice(0, 3).map(job => (
                    <Box key={job.id} sx={{ mb: 2 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{job.title}</Typography>
                      <Typography variant="body2" color="text.secondary">Status: {job.status}</Typography>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Box sx={{ py: 4, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    No recent activity found. Start by posting a job or searching for candidates.
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={3}>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2.5 }}>
                  Recently Uploaded CVs
                </Typography>
                {recentCvs.length > 0 ? (
                  <Box>
                    {/* Show up to 3 recent CVs */}
                    {recentCvs.slice(0, 3).map((cv, idx) => (
                      <Box key={cv.id || idx} sx={{ mb: 1.5 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{cv.file_name}</Typography>
                        <Typography variant="body2" color="text.secondary">Uploaded: {cv.uploaded_at ? new Date(cv.uploaded_at).toLocaleDateString() : ''}</Typography>
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">No CVs uploaded yet.</Typography>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2.5 }}>
                  Quick Actions
                </Typography>
                <Stack spacing={2}>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/recruiter/jobs')}
                    fullWidth
                    size="large"
                    sx={{ py: 1.5, borderRadius: 2.5 }}
                  >
                    Post New Job
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<PsychologyIcon />}
                    onClick={() => {
                      const firstOpenJob = jobs.find(j => j.status === 'OPEN');
                      navigate(`/recruiter/search${firstOpenJob ? `?jobId=${firstOpenJob.id}` : ''}`);
                    }}
                    fullWidth
                    size="large"
                    sx={{ py: 1.5, borderRadius: 2.5, borderWidth: 2, '&:hover': { borderWidth: 2 } }}
                  >
                    AI Talent Discovery
                  </Button>
                </Stack>
              </CardContent>
            </Card>

            <Card
              sx={{
                bgcolor: alpha('#1B2A4A', 0.95),
                color: 'white',
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>
                  💡 Pro Tip
                </Typography>
                <Typography variant="body2" sx={{ lineHeight: 1.7, opacity: 0.85 }}>
                  Use the Talent Discovery tool to find the best candidates based on semantic understanding — not just keyword matching.
                </Typography>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};
