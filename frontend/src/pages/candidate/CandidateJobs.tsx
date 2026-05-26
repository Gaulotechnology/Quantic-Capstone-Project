import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Grid,
  InputAdornment,
  CircularProgress,
  Pagination,
  Alert,
  Snackbar,
  alpha,
  MenuItem,
  Stack,
  Divider,
  IconButton,
} from '@mui/material';
import { 
  Search as SearchIcon, 
  LocationOn, 
  Business, 
  FilterList as FilterIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import { jobApi } from '../../api/jobs';
import type { Job } from '../../types';
import { useDebounce } from '../../hooks/useDebounce';

export const CandidateJobs: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [search, setSearch] = useState('');
  const [sector, setSector] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [alert, setAlert] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [isApplying, setIsApplying] = useState<string | null>(null);
  const debouncedSearch = useDebounce(search, 500);

  const sectors = [
    'Engineering', 'Finance', 'IT', 'Medical', 'Mining', 
    'Supply Chain', 'Trade & Technical', 'Hospitality'
  ];

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const result = await jobApi.getJobs({ 
        search: debouncedSearch, 
        sector: sector || undefined,
        page, 
        limit: 12, 
        status: 'OPEN' 
      });
      setJobs(result?.jobs || []);
      setTotal(result?.total || 0);
    } catch {
      setJobs([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [debouncedSearch, sector, page]);

  const handleApply = async (jobId: string) => {
    setIsApplying(jobId);
    try {
      await jobApi.applyForJob(jobId);
      setAlert({ type: 'success', message: 'Application submitted successfully!' });
    } catch (err: any) {
      setAlert({
        type: 'error',
        message: err.response?.data?.detail || 'Failed to submit application. Have you uploaded your CV?'
      });
    } finally {
      setIsApplying(null);
    }
  };

  return (
    <Box sx={{ animation: 'fadeInUp 0.4s ease-out' }}>
      {/* ── Header ────────────────────────────────────────── */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5, letterSpacing: '-0.02em', color: '#1B2A4A' }}>
          Explore Opportunities
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Find exclusive roles managed by Tumaini Consultancy
        </Typography>
      </Box>

      {/* ── Search & Filters ─────────────────────────────── */}
      <Card sx={{ mb: 4, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: 'none' }}>
        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={2} sx={{ alignItems: "center" }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                placeholder="Search by title, location or keywords..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: 'primary.main' }} />
                      </InputAdornment>
                    ),
                    sx: { borderRadius: 2.5, bgcolor: '#F8FAFC' }
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField
                select
                fullWidth
                label="All Sectors"
                value={sector}
                onChange={(e) => { setSector(e.target.value); setPage(1); }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <FilterIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                      </InputAdornment>
                    ),
                    sx: { borderRadius: 2.5, bgcolor: '#F8FAFC' }
                  }
                }}
              >
                <MenuItem value="">All Sectors</MenuItem>
                {sectors.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Button 
                fullWidth 
                variant="contained" 
                size="large" 
                onClick={fetchJobs}
                sx={{ height: 56, borderRadius: 2.5, fontWeight: 700 }}
              >
                Find Jobs
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* ── Results ──────────────────────────────────────── */}
      {isLoading ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 10 }}>
          <CircularProgress size={48} sx={{ mb: 2 }} />
          <Typography color="text.secondary">Fetching latest mandates...</Typography>
        </Box>
      ) : jobs.length === 0 ? (
        <Card sx={{ textAlign: 'center', py: 12, borderRadius: 4, bgcolor: alpha('#7EC845', 0.02), border: '1px dashed', borderColor: alpha('#7EC845', 0.2) }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              mx: 'auto',
              mb: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: alpha('#7EC845', 0.1),
            }}
          >
            <SearchIcon sx={{ fontSize: 40, color: '#7EC845' }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>No positions found</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400, mx: 'auto' }}>
            We couldn't find any roles matching your current search criteria. Try adjusting your filters.
          </Typography>
          <Button sx={{ mt: 3 }} onClick={() => { setSearch(''); setSector(''); }}>Clear all filters</Button>
        </Card>
      ) : (
        <>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2, fontWeight: 600 }}>
            Showing {jobs.length} of {total} available positions
          </Typography>
          <Grid container spacing={3}>
            {jobs.map((job) => (
              <Grid size={{ xs: 12, md: 6, lg: 4 }} key={job.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 4,
                    border: '1px solid',
                    borderColor: 'divider',
                    transition: 'all 300ms ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 30px rgba(0,0,0,0.08)',
                      borderColor: '#7EC845'
                    },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Chip 
                        label={job.sector} 
                        size="small" 
                        sx={{ 
                          borderRadius: 1, 
                          fontWeight: 700, 
                          bgcolor: alpha('#7EC845', 0.1), 
                          color: '#5F9F2F',
                          fontSize: '0.65rem',
                          textTransform: 'uppercase'
                        }} 
                      />
                      <Typography variant="caption" color="text.disabled">
                        {new Date(job.created_at).toLocaleDateString()}
                      </Typography>
                    </Box>
                    
                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 1.5, color: '#1B2A4A', lineHeight: 1.3 }}>
                      {job.title}
                    </Typography>
                    
                    <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                        <LocationOn sx={{ fontSize: 16 }} />
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>{job.location || 'Remote'}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                        <Business sx={{ fontSize: 16 }} />
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>{job.client_name || 'Tumaini Client'}</Typography>
                      </Box>
                    </Stack>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.7, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {job.description}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 0.8, flexWrap: 'wrap' }}>
                      {(job.required_skills || []).slice(0, 3).map((skill) => (
                        <Chip
                          key={skill}
                          label={skill}
                          size="small"
                          variant="outlined"
                          sx={{ borderRadius: 1.5, fontSize: '0.7rem' }}
                        />
                      ))}
                    </Box>
                  </CardContent>
                  
                  <Divider sx={{ mx: 3, opacity: 0.5 }} />
                  
                  <CardActions sx={{ p: 3, gap: 1.5 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      disabled={isApplying === job.id}
                      onClick={() => handleApply(job.id)}
                      sx={{ borderRadius: 2, fontWeight: 700, py: 1 }}
                    >
                      {isApplying === job.id ? <CircularProgress size={20} color="inherit" /> : 'Apply Now'}
                    </Button>
                    <IconButton sx={{ borderRadius: 2, bgcolor: alpha('#000', 0.03) }}>
                      <ChevronRightIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          {total > 12 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
              <Pagination
                count={Math.ceil(total / 12)}
                page={page}
                onChange={(_, p) => {
                  setPage(p);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                color="primary"
                size="large"
                sx={{ 
                  '& .MuiPaginationItem-root': { fontWeight: 700, borderRadius: 2 },
                }}
              />
            </Box>
          )}
        </>
      )}

      <Snackbar
        open={!!alert}
        autoHideDuration={6000}
        onClose={() => setAlert(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        {alert ? (
          <Alert 
            onClose={() => setAlert(null)} 
            severity={alert.type} 
            variant="filled"
            sx={{ width: '100%', borderRadius: 3, boxShadow: '0 8px 30px rgba(0,0,0,0.2)' }}
          >
            {alert.message}
          </Alert>
        ) : undefined}
      </Snackbar>
    </Box>
  );
};
