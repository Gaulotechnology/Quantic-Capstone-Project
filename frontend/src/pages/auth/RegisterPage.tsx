import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Link,
  InputAdornment,
  IconButton,
  CircularProgress,
  MenuItem,
  alpha,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Work as WorkIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppStore';
import { register, clearError } from '../../store/slices/authSlice';
import type { Role } from '../../types';
import { LandingNav } from '../../components/layout/LandingNav';

export const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<Role>('CANDIDATE');
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());
    if (password !== confirmPassword) return;
    const result = await dispatch(register({ email, password, full_name: fullName, role }));
    if (register.fulfilled.match(result)) {
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', p: 2, backgroundColor: '#1A1D2E' }}>
      <LandingNav />
      <Box sx={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse 70% 40% at 80% 20%, ${alpha('#7EC845', 0.12)} 0%, transparent 50%), radial-gradient(ellipse 50% 50% at 20% 80%, ${alpha('#1B2A4A', 0.18)} 0%, transparent 50%), linear-gradient(135deg, #1A1D2E 0%, #1B2A4A 50%, #7EC845 100%)`, backgroundSize: '400% 400%', zIndex: 0 }} />
      <Box sx={{ position: 'absolute', width: 350, height: 350, borderRadius: '50%', background: `radial-gradient(circle, ${alpha('#98D36A', 0.06)} 0%, transparent 70%)`, top: '15%', right: '-8%', zIndex: 0 }} />

      <Card sx={{ maxWidth: 480, width: '100%', position: 'relative', zIndex: 1, borderRadius: 4, boxShadow: '0 24px 48px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(12px)', animation: 'fadeInUp 0.5s ease-out' }}>
        <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Box component="img" src="/logo.png" alt="Tumaini AI" sx={{ height: 48, mx: 'auto', mb: 2.5, display: 'block' }} />
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, letterSpacing: '-0.02em' }}>Create Account</Typography>
            <Typography variant="body1" color="text.secondary">Join Tumaini AI Recruitment Platform</Typography>
          </Box>

          {success && <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>Registration successful! Redirecting to login...</Alert>}
          {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

          <form onSubmit={handleSubmit}>
            <TextField label="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} required sx={{ mb: 2.5 }} data-testid="full-name" slotProps={{ input: { startAdornment: <InputAdornment position="start"><PersonIcon sx={{ color: 'text.secondary', fontSize: 20 }} /></InputAdornment> } }} />
            <TextField label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required sx={{ mb: 2.5 }} data-testid="email" slotProps={{ input: { startAdornment: <InputAdornment position="start"><EmailIcon sx={{ color: 'text.secondary', fontSize: 20 }} /></InputAdornment> } }} />
            <TextField select label="I am a..." value={role} onChange={(e) => setRole(e.target.value as Role)} sx={{ mb: 2.5 }} data-testid="role-select" slotProps={{ input: { startAdornment: <InputAdornment position="start"><WorkIcon sx={{ color: 'text.secondary', fontSize: 20 }} /></InputAdornment> } }}>
              <MenuItem value="CANDIDATE">Candidate — Looking for jobs</MenuItem>
              <MenuItem value="RECRUITER">Recruiter — Hiring talent</MenuItem>
            </TextField>
            <TextField label="Password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required sx={{ mb: 2.5 }} helperText="Minimum 8 characters" data-testid="password"
              slotProps={{
                input: {
                  startAdornment: <InputAdornment position="start"><LockIcon sx={{ color: 'text.secondary', fontSize: 20 }} /></InputAdornment>,
                  endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShowPassword(!showPassword)} edge="end">{showPassword ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment>,
                },
              }}
            />
            <TextField label="Confirm Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required error={confirmPassword !== '' && password !== confirmPassword} helperText={confirmPassword !== '' && password !== confirmPassword ? 'Passwords do not match' : ''} sx={{ mb: 3 }} data-testid="confirm-password" slotProps={{ input: { startAdornment: <InputAdornment position="start"><LockIcon sx={{ color: 'text.secondary', fontSize: 20 }} /></InputAdornment> } }} />
            <Button type="submit" variant="contained" fullWidth size="large" disabled={isLoading || password !== confirmPassword} data-testid="register-submit" sx={{ py: 1.5 }}>
              {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
            </Button>
          </form>

          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account? <Link component={RouterLink} to="/login" sx={{ fontWeight: 600 }}>Sign in</Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};
