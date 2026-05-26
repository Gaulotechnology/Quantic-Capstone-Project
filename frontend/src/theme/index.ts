import { createTheme, alpha } from '@mui/material/styles';

// ── Brand colours (from tumaini.co) ──────────────────────────────
const PRIMARY = '#7EC845';
const PRIMARY_LIGHT = '#98D36A';
const PRIMARY_DARK = '#5F9F2F';

const SECONDARY = '#1B2A4A';
const SECONDARY_LIGHT = '#2D4A6F';
const SECONDARY_DARK = '#0D1B2A';

const SUCCESS = '#7EC845';
const WARNING = '#FF9800';
const ERROR = '#F44336';
const INFO = '#2196F3';

const theme = createTheme({
  // ── Palette ────────────────────────────────────────────────
  palette: {
    primary: {
      main: PRIMARY,
      light: PRIMARY_LIGHT,
      dark: PRIMARY_DARK,
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: SECONDARY,
      light: SECONDARY_LIGHT,
      dark: SECONDARY_DARK,
      contrastText: '#FFFFFF',
    },
    success: {
      main: SUCCESS,
    },
    warning: {
      main: WARNING,
    },
    error: {
      main: ERROR,
    },
    info: {
      main: INFO,
    },
    background: {
      default: '#F5F7FA',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1A1D2E',
      secondary: '#64748B',
      disabled: '#94A3B8',
    },
    divider: 'rgba(0, 0, 0, 0.06)',
  },

  // ── Typography ─────────────────────────────────────────────
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica Neue", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 800,
      lineHeight: 1.2,
      letterSpacing: '-0.03em',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
      lineHeight: 1.25,
      letterSpacing: '-0.02em',
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 700,
      lineHeight: 1.3,
      letterSpacing: '-0.02em',
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 700,
      lineHeight: 1.35,
      letterSpacing: '-0.01em',
    },
    h5: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.45,
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 600,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
    caption: {
      fontSize: '0.75rem',
      lineHeight: 1.5,
    },
    button: {
      fontWeight: 600,
      fontSize: '0.875rem',
      textTransform: 'none' as const,
    },
  },

  // ── Shape ──────────────────────────────────────────────────
  shape: {
    borderRadius: 8,
  },

  // ── Component overrides ────────────────────────────────────
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(0,0,0,0.15) transparent',
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
          padding: '10px 24px',
          transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-1px)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        contained: {
          boxShadow: `0 4px 14px ${alpha(PRIMARY, 0.35)}`,
          '&:hover': {
            boxShadow: `0 6px 20px ${alpha(PRIMARY, 0.45)}`,
          },
        },
        outlined: {
          borderWidth: '2px',
          '&:hover': {
            borderWidth: '2px',
          },
        },
        sizeLarge: {
          padding: '12px 32px',
          fontSize: '1rem',
        },
        sizeSmall: {
          padding: '6px 16px',
          fontSize: '0.8125rem',
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          border: '1px solid rgba(0,0,0,0.04)',
          transition: 'transform 250ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
          },
        },
      },
    },

    MuiCardContent: {
      styleOverrides: {
        root: {
          '&:last-child': {
            paddingBottom: 24,
          },
        },
      },
    },

    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        fullWidth: true,
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
            '&.Mui-focused': {
              boxShadow: `0 0 0 3px ${alpha(PRIMARY, 0.15)}`,
            },
          },
        },
      },
    },

    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          borderRadius: 6,
          transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'scale(1.03)',
          },
        },
        outlined: {
          borderWidth: '1.5px',
        },
      },
    },

    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          alignItems: 'center',
        },
      },
    },

    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          boxShadow: '0 24px 48px rgba(0,0,0,0.12)',
        },
      },
    },

    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontSize: '1.25rem',
          fontWeight: 700,
        },
      },
    },

    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(0,0,0,0.06)',
        },
      },
    },

    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          height: 8,
          backgroundColor: 'rgba(0,0,0,0.06)',
        },
        bar: {
          borderRadius: 8,
          background: `linear-gradient(90deg, ${PRIMARY} 0%, ${PRIMARY_LIGHT} 100%)`,
        },
      },
    },

    MuiCircularProgress: {
      styleOverrides: {
        root: {
          color: PRIMARY,
        },
      },
    },

    MuiTableContainer: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
        },
      },
    },

    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            fontWeight: 600,
            fontSize: '0.8125rem',
            color: '#64748B',
            backgroundColor: alpha(SECONDARY, 0.03),
            borderBottom: `2px solid ${alpha(SECONDARY, 0.08)}`,
          },
        },
      },
    },

    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: alpha(PRIMARY, 0.02),
          },
        },
      },
    },

    MuiPaginationItem: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },

    MuiAvatar: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
      },
    },

    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          borderRadius: 6,
          fontSize: '0.75rem',
          padding: '6px 12px',
        },
      },
    },

    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: '1px solid rgba(0,0,0,0.06)',
        },
      },
    },

    MuiBadge: {
      styleOverrides: {
        badge: {
          fontWeight: 600,
          fontSize: '0.6875rem',
        },
      },
    },

    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '0 8px 2px',
          transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            backgroundColor: alpha(PRIMARY, 0.06),
          },
        },
      },
    },
  },
});

export default theme;
