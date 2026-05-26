import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  IconButton,
  LinearProgress,
  Stack,
  Chip,
  Divider,
  Button,
  Alert,
  Grid,
  alpha,
} from '@mui/material';
import {
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  Psychology as PsychologyIcon,
} from '@mui/icons-material';
import type { SearchResult } from '../../types';

interface MatchExplanationModalProps {
  open: boolean;
  onClose: () => void;
  candidate: SearchResult | null;
}

export const MatchExplanationModal: React.FC<MatchExplanationModalProps> = ({
  open,
  onClose,
  candidate,
}) => {
  if (!candidate) return null;
  const score = Math.round(candidate.score);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleFeedback = (type: string) => {
    setFeedback(`Thanks! You rated this match as "${type}".`);
    setTimeout(() => setFeedback(null), 2500);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth slotProps={{ paper: { sx: { borderRadius: 4 } } }}>
      <DialogTitle
        sx={{
          m: 0,
          p: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <PsychologyIcon sx={{ color: 'primary.main' }} />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Match Explanation — {candidate.name}
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ borderRadius: 1.5 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Stack spacing={3.5}>
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Overall Match Score
              </Typography>
              <Typography variant="h5" color="primary.main" sx={{ fontWeight: 800 }}>
                {score}/100
              </Typography>
            </Box>
            <LinearProgress variant="determinate" value={score} sx={{ height: 14, borderRadius: 7 }} />
          </Box>

          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>
              AI Rationale
            </Typography>
            <Box
              sx={{
                p: 2.5,
                bgcolor: alpha('#7EC845', 0.04),
                borderRadius: 3,
                borderLeft: '4px solid',
                borderColor: 'primary.main',
              }}
            >
              <Typography variant="body2" sx={{ fontStyle: 'italic', lineHeight: 1.7, color: 'text.primary' }}>
                "{candidate.rationale}"
              </Typography>
            </Box>
          </Box>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 600,
                  mb: 1.5,
                  color: 'success.main',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                }}
              >
                <CheckCircleIcon sx={{ fontSize: 18 }} /> Matched Skills
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {candidate.matched_skills.map((skill) => (
                  <Chip key={skill} label={skill} size="small" color="success" variant="outlined" sx={{ borderRadius: 1.5 }} />
                ))}
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 600,
                  mb: 1.5,
                  color: 'error.main',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                }}
              >
                <CancelIcon sx={{ fontSize: 18 }} /> Missing Skills
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {candidate.missing_skills?.map((skill) => (
                  <Chip key={skill} label={skill} size="small" color="error" variant="outlined" sx={{ borderRadius: 1.5 }} />
                )) || <Typography variant="caption" color="text.secondary">None identified</Typography>}
              </Box>
            </Grid>
          </Grid>
          <Divider />

          <Box>
            <Typography variant="body2" sx={{ mb: 2.5, textAlign: 'center', color: 'text.secondary' }}>
              Was this AI score accurate?
            </Typography>
            {feedback && <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>{feedback}</Alert>}
            <Stack direction="row" spacing={2} sx={{ justifyContent: 'center' }}>
              <Button startIcon={<ThumbUpIcon />} variant="outlined" color="success" size="small" sx={{ borderRadius: 2 }} onClick={() => handleFeedback('Accurate')}>
                Accurate
              </Button>
              <Button startIcon={<ThumbDownIcon />} variant="outlined" color="warning" size="small" sx={{ borderRadius: 2 }} onClick={() => handleFeedback('Underrated')}>
                Underrated
              </Button>
              <Button startIcon={<ThumbDownIcon />} variant="outlined" color="error" size="small" sx={{ borderRadius: 2 }} onClick={() => handleFeedback('Overrated')}>
                Overrated
              </Button>
            </Stack>
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};
