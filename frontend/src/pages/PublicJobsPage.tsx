import React, { useEffect, useState } from 'react';
import { 
  Box, Typography, Container, Grid, Card, CardContent, Chip, 
  Avatar, CircularProgress, alpha, Paper, Button, Stack, 
  TextField, InputAdornment, MenuItem, Pagination, Divider 
} from '@mui/material';
import { 
  LocationOn, ArrowForward, Work as WorkIcon, 
  Search as SearchIcon, FilterList as FilterIcon 
} from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { jobApi } from '../api/jobs';
import type { Job } from '../types';
import { LandingNav } from '../components/layout/LandingNav';
import { AppFooter } from '../components/layout/AppFooter';
import { useDebounce } from '../hooks/useDebounce';

const ACCENTS = ['#7EC845', '#1B2A4A', '#7EC845', '#1B2A4A'];

export const PublicJobsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [sector, setSector] = useState(searchParams.get('sector') || '');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const debouncedSearch = useDebounce(search, 500);

  const sectors = [
    'Engineering', 'Finance', 'IT', 'Medical', 'Mining', 
    'Supply Chain', 'Trade & Technical', 'Hospitality'
  ];

  const fetchJobs = async () => {
    setLoading(true);
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
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [debouncedSearch, sector, page]);

  useEffect(() => {
    const params: Record<string, string> = {};
    if (search) params.search = search;
    if (sector) params.sector = sector;
    setSearchParams(params, { replace: true });
  }, [search, sector]);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F8F9FC' }}>
      <LandingNav />
      <Box sx={{ pt: 18, pb: 12 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="overline" sx={{ color: '#7EC845', fontWeight: 700, letterSpacing: 2, display: 'block', mb: 1 }}>EXCEPTIONAL TALENT</Typography>
            <Typography variant="h2" sx={{ fontWeight: 900, mb: 2, color: '#1B2A4A', letterSpacing: '-0.02em' }}>Available Mandates</Typography>
            <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400, maxWidth: 600, mx: 'auto' }}>
              Explore high-impact positions managed by Africa's leading AI-native recruitment consultancy.
            </Typography>
          </Box>

          {/* ── Search & Filters ─────────────────────────────── */}
          <Card sx={{ mb: 6, borderRadius: 4, boxShadow: '0 12px 40px rgba(0,0,0,0.04)', border: 'none', overflow: 'visible' }}>
            <CardContent sx={{ p: 4 }}>
              <Grid container spacing={2} sx={{ alignItems: "center" }}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    placeholder="Search roles by title, location or keywords..."
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon sx={{ color: '#7EC845' }} />
                          </InputAdornment>
                        ),
                        sx: { borderRadius: 3, bgcolor: '#F8FAFC', height: 56 }
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
                        sx: { borderRadius: 3, bgcolor: '#F8FAFC', height: 56 }
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
                    sx={{ height: 56, borderRadius: 3, fontWeight: 800, fontSize: '1rem', bgcolor: '#7EC845', '&:hover': { bgcolor: '#5F9F2F' } }}
                  >
                    Search Now
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {loading ? (
            <Box sx={{ textAlign: 'center', py: 12 }}>
              <CircularProgress size={64} sx={{ color: '#7EC845', mb: 2 }} />
              <Typography color="text.secondary" sx={{ fontWeight: 500 }}>Scanning mandates...</Typography>
            </Box>
          ) : jobs.length === 0 ? (
            <Paper sx={{ textAlign: 'center', py: 12, borderRadius: 6, bgcolor: '#fff', border: '2px dashed', borderColor: 'divider' }}>
              <Box sx={{ width: 100, height: 100, borderRadius: '50%', bgcolor: alpha('#7EC845', 0.05), display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 4 }}>
                <WorkIcon sx={{ fontSize: 48, color: alpha('#7EC845', 0.3) }} />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>No active mandates found</Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>We couldn't find any roles matching your criteria. Please try again with different filters.</Typography>
              <Button variant="outlined" onClick={() => { setSearch(''); setSector(''); }} sx={{ borderRadius: 2.5, px: 4 }}>Clear All Filters</Button>
            </Paper>
          ) : (
            <>
              <Typography variant="subtitle2" sx={{ mb: 3, fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Currently Listing {total} Strategic Opportunities
              </Typography>
              <Grid container spacing={4}>
                {jobs.map((job, i) => { const a = ACCENTS[i%ACCENTS.length]; return (
                  <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={job.id}>
                    <Card sx={{ height:'100%', display:'flex', flexDirection:'column', borderRadius:5, border:'1px solid', borderColor:'divider', bgcolor:'#fff', transition:'all 400ms cubic-bezier(0.4, 0, 0.2, 1)', '&:hover':{ transform:'translateY(-8px)', boxShadow:'0 24px 60px rgba(0,0,0,0.08)', borderColor:'#7EC845' } }}>
                      <Box sx={{ height:6, background:`linear-gradient(90deg, ${a}, ${alpha(a,0.4)})` }} />
                      <CardContent sx={{ p:4, flex:1, display:'flex', flexDirection:'column' }}>
                        <Box sx={{ display:'flex', alignItems:'center', gap:2, mb:3 }}>
                          <Avatar sx={{ width:52, height:52, bgcolor:alpha(a,0.08), color:a, fontWeight:900, fontSize:'1.1rem', border:`1px solid ${alpha(a, 0.1)}` }}>{(job.client_name||job.title)[0]}</Avatar>
                          <Box>
                            {job.client_name && <Typography variant="caption" sx={{ color:a, fontWeight:800, display:'block', textTransform:'uppercase', letterSpacing:'0.02em' }}>{job.client_name}</Typography>}
                            <Box sx={{ display:'flex', alignItems:'center', gap:0.5, color:'text.secondary' }}><LocationOn sx={{ fontSize:15 }} /><Typography variant="caption" sx={{ fontWeight:600 }}>{job.location||'Remote'}</Typography></Box>
                          </Box>
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight:900, mb:2, color: '#1B2A4A', lineHeight: 1.3 }}>{job.title}</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb:3, lineHeight:1.8, display:'-webkit-box', WebkitLineClamp:3, WebkitBoxOrient:'vertical', overflow:'hidden', fontSize: '0.9rem' }}>{job.description}</Typography>
                        
                        <Stack direction="row" spacing={1} sx={{ mb:3, flexWrap: "wrap", gap: 1 }}>
                          <Chip label={job.sector} size="small" variant="outlined" sx={{ borderRadius:1.5, fontSize:'0.7rem', fontWeight: 700, height:26, borderColor:alpha(a,0.3), color:a }} />
                          <Chip label="Exclusive" size="small" sx={{ borderRadius:1.5, fontSize:'0.7rem', height:26, bgcolor:alpha('#7EC845',0.08), color:'#5F9F2F', fontWeight:700 }} />
                        </Stack>
                        
                        <Divider sx={{ mb: 3, opacity: 0.5 }} />
                        
                        <Box sx={{ mt:'auto' }}>
                          <Button fullWidth variant="contained" endIcon={<ArrowForward />} onClick={() => navigate('/register')} sx={{ borderRadius:3, py:1.5, fontSize: '0.95rem', fontWeight: 800, bgcolor:a, '&:hover':{ bgcolor:alpha(a,0.9), boxShadow: `0 8px 20px ${alpha(a, 0.25)}` } }}>Sign Up to Apply</Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                )})}
              </Grid>

              {total > 12 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                  <Pagination
                    count={Math.ceil(total / 12)}
                    page={page}
                    onChange={(_, p) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    color="primary"
                    size="large"
                    sx={{ '& .MuiPaginationItem-root': { fontWeight: 800, borderRadius: 2 } }}
                  />
                </Box>
              )}
            </>
          )}
        </Container>
      </Box>
      <AppFooter />
    </Box>
  );
};
