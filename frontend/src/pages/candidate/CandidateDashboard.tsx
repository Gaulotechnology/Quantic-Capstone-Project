import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  LinearProgress,
  alpha,
} from '@mui/material';
import {
  Work as WorkIcon,
  Description as DescriptionIcon,
  CheckCircle as CheckCircleIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks/useAppStore';
import { jobApi } from '../../api/jobs';
import { cvApi } from '../../api/cv';

const statGradients: Record<string, [string, string]> = {
  'Applications Submitted': ['#7EC845', '#FF9A6C'],
  'CV Status': ['#4CAF50', '#66BB6A'],
  'Interviews Scheduled': ['#2196F3', '#64B5F6'],
  'Profile Completeness': ['#9C27B0', '#CE93D8'],
};

export const CandidateDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const [stats, setStats] = useState({
    applications: '0',
    cvStatus: 'Not Uploaded',
    interviews: '0',
    completeness: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [apps, cvs] = await Promise.all([jobApi.getApplications(), cvApi.getMyCVs()]);
        const cvsArr = Array.isArray(cvs) ? cvs : [];
        const hasCV = cvsArr.length > 0;
        const cv = cvsArr[0];
        let completeness = 20;
        if (hasCV) completeness += 30;
        if (cv?.status === 'PROCESSED') {
          completeness += 20;
          const skillsLen = (cv?.extracted_data?.skills || [])?.length ?? 0;
          if (skillsLen > 0) completeness += 10;
          const workLen = (cv?.extracted_data?.work_experiences || [])?.length ?? 0;
          if (workLen > 0) completeness += 20;
        }
        const appsArr = Array.isArray(apps) ? apps : [];
        setStats({
          applications: appsArr.length.toString(),
          cvStatus: hasCV ? (cv.status === 'PROCESSED' ? 'Ready' : 'Processing') : 'Missing',
          interviews: appsArr.filter(a => a?.status === 'INTERVIEW').length.toString(),
          completeness: Math.min(completeness, 100),
        });
      } catch { /* silent */ }
    };
    fetchStats();
  }, []);

  const statCards = [
    { label: 'Applications Submitted', value: stats.applications, icon: <WorkIcon /> },
    { label: 'CV Status', value: stats.cvStatus, icon: <DescriptionIcon /> },
    { label: 'Interviews Scheduled', value: stats.interviews, icon: <CheckCircleIcon /> },
    { label: 'Profile Completeness', value: `${stats.completeness}%`, icon: <TrendingUpIcon /> },
  ];

  return (
    <Box sx={{ animation: 'fadeInUp 0.4s ease-out' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5, letterSpacing: '-0.02em' }}>
          Welcome back, {user?.full_name?.split(' ')[0] || 'Candidate'}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's an overview of your job search activity
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((stat, index) => {
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
                  <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.01em' }}>
                    {stat.value}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2.5 }}>Quick Actions</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button variant="contained" startIcon={<DescriptionIcon />} onClick={() => navigate('/candidate/profile')} size="large">
                  {stats.cvStatus === 'Missing' ? 'Upload Your CV' : 'Manage Your CV'}
                </Button>
                <Button variant="outlined" startIcon={<WorkIcon />} onClick={() => navigate('/candidate/jobs')} size="large">
                  Browse Available Jobs
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ position: 'relative', overflow: 'hidden', '&::before': { content: '""', position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, #9C27B0, #CE93D8)' } }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2.5 }}>Profile Completeness</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <LinearProgress variant="determinate" value={stats.completeness} sx={{ height: 12, borderRadius: 6 }} />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.main' }}>{stats.completeness}%</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {stats.completeness === 100 ? "Your profile is fully complete! You're ready for top matches." : 'Complete your profile to get better job matches:'}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip label="Upload CV" size="small" color={stats.completeness > 20 ? 'success' : 'warning'} variant={stats.completeness > 20 ? 'filled' : 'outlined'} />
                <Chip label="AI Parsing" size="small" color={stats.completeness > 50 ? 'success' : 'warning'} variant={stats.completeness > 50 ? 'filled' : 'outlined'} />
                <Chip label="Skills & Experience" size="small" color={stats.completeness > 80 ? 'success' : 'warning'} variant={stats.completeness > 80 ? 'filled' : 'outlined'} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
