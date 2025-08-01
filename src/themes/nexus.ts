import { createTheme } from "@mui/material";
import { getAlertComponents } from "../utils/alert";

// NEXUS DESIGN THEME
// A modern, sophisticated design system for 2024
// Philosophy: Clean minimalism with purposeful sophistication

// ===== COLOR PALETTE =====
const nexusColors = {
  // Primary: Electric Blue - Modern, trustworthy, tech-forward
  primary: {
    50: '#e8f4ff',
    100: '#d1e9ff',
    200: '#a3d3ff',
    300: '#75bdff',
    400: '#47a7ff',
    500: '#1a91ff', // Main primary
    600: '#0066cc',
    700: '#004d99',
    800: '#003366',
    900: '#001a33',
  },
  
  // Secondary: Deep Slate - Professional, grounding
  secondary: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b', // Main secondary
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },
  
  // Accent: Vibrant Purple - Creative, premium
  accent: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7', // Main accent
    600: '#9333ea',
    700: '#7c3aed',
    800: '#6b21a8',
    900: '#581c87',
  },
  
  // Success: Emerald Green - Growth, positive actions
  success: {
    50: '#ecfdf5',
    100: '#d1fae5',
    200: '#a7f3d0',
    300: '#6ee7b7',
    400: '#34d399',
    500: '#10b981', // Main success
    600: '#059669',
    700: '#047857',
    800: '#065f46',
    900: '#064e3b',
  },
  
  // Warning: Amber - Attention, caution
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b', // Main warning
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  
  // Error: Rose Red - Errors, destructive actions
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444', // Main error
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
  
  // Neutral: Sophisticated grays
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0a0a0a',
  }
};

// ===== TYPOGRAPHY SYSTEM =====
const nexusTypography = {
  // Primary: Inter - Clean, modern, highly readable
  fontFamily: '"Inter", "Segoe UI", "Roboto", "Helvetica Neue", sans-serif',
  
  // Heading: Clash Display - Bold, distinctive for headlines
  headingFont: '"Clash Display", "Inter", sans-serif',
  
  // Accent: JetBrains Mono - Technical, modern for code/data
  monoFont: '"JetBrains Mono", "Fira Code", "Monaco", monospace',
  
  // Size Scale (1.25 ratio - Perfect Fourth)
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
    '6xl': '3.75rem', // 60px
    '7xl': '4.5rem',  // 72px
  },
  
  // Line Heights
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
  
  // Font Weights
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  }
};

// ===== SPACING SYSTEM =====
// 8px base unit for consistent spacing
const nexusSpacing = {
  0: '0',
  1: '0.25rem',  // 4px
  2: '0.5rem',   // 8px
  3: '0.75rem',  // 12px
  4: '1rem',     // 16px
  5: '1.25rem',  // 20px
  6: '1.5rem',   // 24px
  8: '2rem',     // 32px
  10: '2.5rem',  // 40px
  12: '3rem',    // 48px
  16: '4rem',    // 64px
  20: '5rem',    // 80px
  24: '6rem',    // 96px
  32: '8rem',    // 128px
};

// ===== BORDER RADIUS =====
const nexusBorderRadius = {
  none: '0',
  sm: '0.25rem',   // 4px
  base: '0.5rem',  // 8px
  md: '0.75rem',   // 12px
  lg: '1rem',      // 16px
  xl: '1.5rem',    // 24px
  '2xl': '2rem',   // 32px
  full: '9999px',
};

// ===== SHADOWS =====
const nexusShadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  glow: '0 0 20px rgb(26 145 255 / 0.3)',
};

// ===== LIGHT THEME =====
let nexusLightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: nexusColors.primary[500],
      light: nexusColors.primary[400],
      dark: nexusColors.primary[600],
      contrastText: '#ffffff',
    },
    secondary: {
      main: nexusColors.secondary[500],
      light: nexusColors.secondary[400],
      dark: nexusColors.secondary[600],
      contrastText: '#ffffff',
    },
    accent: {
      main: nexusColors.accent[500],
      light: nexusColors.accent[400],
      dark: nexusColors.accent[600],
      contrastText: '#ffffff',
    },
    success: {
      main: nexusColors.success[500],
      light: nexusColors.success[400],
      dark: nexusColors.success[600],
      contrastText: '#ffffff',
    },
    warning: {
      main: nexusColors.warning[500],
      light: nexusColors.warning[400],
      dark: nexusColors.warning[600],
      contrastText: '#ffffff',
    },
    error: {
      main: nexusColors.error[500],
      light: nexusColors.error[400],
      dark: nexusColors.error[600],
      contrastText: '#ffffff',
    },
    background: {
      default: nexusColors.neutral[50],
      paper: '#ffffff',
    },
    text: {
      primary: nexusColors.neutral[900],
      secondary: nexusColors.neutral[600],
      disabled: nexusColors.neutral[400],
    },
    divider: nexusColors.neutral[200],
    grey: nexusColors.neutral,
  },
  typography: {
    fontFamily: nexusTypography.fontFamily,
    h1: {
      fontFamily: nexusTypography.headingFont,
      fontSize: nexusTypography.fontSize['5xl'],
      fontWeight: nexusTypography.fontWeight.bold,
      lineHeight: nexusTypography.lineHeight.tight,
      letterSpacing: '-0.025em',
    },
    h2: {
      fontFamily: nexusTypography.headingFont,
      fontSize: nexusTypography.fontSize['4xl'],
      fontWeight: nexusTypography.fontWeight.bold,
      lineHeight: nexusTypography.lineHeight.tight,
      letterSpacing: '-0.025em',
    },
    h3: {
      fontFamily: nexusTypography.headingFont,
      fontSize: nexusTypography.fontSize['3xl'],
      fontWeight: nexusTypography.fontWeight.semibold,
      lineHeight: nexusTypography.lineHeight.tight,
    },
    h4: {
      fontFamily: nexusTypography.headingFont,
      fontSize: nexusTypography.fontSize['2xl'],
      fontWeight: nexusTypography.fontWeight.semibold,
      lineHeight: nexusTypography.lineHeight.normal,
    },
    h5: {
      fontFamily: nexusTypography.headingFont,
      fontSize: nexusTypography.fontSize.xl,
      fontWeight: nexusTypography.fontWeight.semibold,
      lineHeight: nexusTypography.lineHeight.normal,
    },
    h6: {
      fontFamily: nexusTypography.headingFont,
      fontSize: nexusTypography.fontSize.lg,
      fontWeight: nexusTypography.fontWeight.semibold,
      lineHeight: nexusTypography.lineHeight.normal,
    },
    body1: {
      fontSize: nexusTypography.fontSize.base,
      lineHeight: nexusTypography.lineHeight.relaxed,
      fontWeight: nexusTypography.fontWeight.normal,
    },
    body2: {
      fontSize: nexusTypography.fontSize.sm,
      lineHeight: nexusTypography.lineHeight.normal,
      fontWeight: nexusTypography.fontWeight.normal,
    },
    button: {
      fontSize: nexusTypography.fontSize.sm,
      fontWeight: nexusTypography.fontWeight.medium,
      textTransform: 'none',
      letterSpacing: '0.025em',
    },
    caption: {
      fontSize: nexusTypography.fontSize.xs,
      lineHeight: nexusTypography.lineHeight.normal,
      fontWeight: nexusTypography.fontWeight.normal,
    },
    overline: {
      fontSize: nexusTypography.fontSize.xs,
      fontWeight: nexusTypography.fontWeight.semibold,
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
    },
  },
  spacing: 8, // 8px base unit
  shape: {
    borderRadius: 8, // Default border radius
  },
});

// ===== DARK THEME =====
let nexusDarkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: nexusColors.primary[400],
      light: nexusColors.primary[300],
      dark: nexusColors.primary[500],
      contrastText: nexusColors.neutral[900],
    },
    secondary: {
      main: nexusColors.secondary[400],
      light: nexusColors.secondary[300],
      dark: nexusColors.secondary[500],
      contrastText: nexusColors.neutral[900],
    },
    accent: {
      main: nexusColors.accent[400],
      light: nexusColors.accent[300],
      dark: nexusColors.accent[500],
      contrastText: nexusColors.neutral[900],
    },
    success: {
      main: nexusColors.success[400],
      light: nexusColors.success[300],
      dark: nexusColors.success[500],
      contrastText: nexusColors.neutral[900],
    },
    warning: {
      main: nexusColors.warning[400],
      light: nexusColors.warning[300],
      dark: nexusColors.warning[500],
      contrastText: nexusColors.neutral[900],
    },
    error: {
      main: nexusColors.error[400],
      light: nexusColors.error[300],
      dark: nexusColors.error[500],
      contrastText: nexusColors.neutral[900],
    },
    background: {
      default: nexusColors.neutral[950],
      paper: nexusColors.neutral[900],
    },
    text: {
      primary: nexusColors.neutral[50],
      secondary: nexusColors.neutral[400],
      disabled: nexusColors.neutral[600],
    },
    divider: nexusColors.neutral[800],
    grey: nexusColors.neutral,
  },
  typography: nexusLightTheme.typography,
  spacing: nexusLightTheme.spacing,
  shape: nexusLightTheme.shape,
});

// ===== COMPONENT CUSTOMIZATIONS =====
const getComponentOverrides = (theme: any) => ({
  // Button Components
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: nexusBorderRadius.md,
        textTransform: 'none',
        fontWeight: nexusTypography.fontWeight.medium,
        padding: `${nexusSpacing[3]} ${nexusSpacing[6]}`,
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: 'none',
        '&:hover': {
          boxShadow: nexusShadows.md,
          transform: 'translateY(-1px)',
        },
        '&:active': {
          transform: 'translateY(0)',
        },
      },
      contained: {
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        '&:hover': {
          background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
        },
      },
      outlined: {
        borderWidth: '1.5px',
        '&:hover': {
          borderWidth: '1.5px',
          backgroundColor: `${theme.palette.primary.main}08`,
        },
      },
      text: {
        '&:hover': {
          backgroundColor: `${theme.palette.primary.main}08`,
        },
      },
      sizeSmall: {
        padding: `${nexusSpacing[2]} ${nexusSpacing[4]}`,
        fontSize: nexusTypography.fontSize.xs,
      },
      sizeLarge: {
        padding: `${nexusSpacing[4]} ${nexusSpacing[8]}`,
        fontSize: nexusTypography.fontSize.base,
      },
    },
  },

  // Card Components
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: nexusBorderRadius.xl,
        boxShadow: nexusShadows.base,
        border: `1px solid ${theme.palette.divider}`,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          boxShadow: nexusShadows.lg,
          transform: 'translateY(-2px)',
        },
      },
    },
  },

  // Paper Components
  MuiPaper: {
    styleOverrides: {
      root: {
        borderRadius: nexusBorderRadius.lg,
        backgroundImage: 'none',
      },
      elevation1: {
        boxShadow: nexusShadows.sm,
      },
      elevation2: {
        boxShadow: nexusShadows.base,
      },
      elevation3: {
        boxShadow: nexusShadows.md,
      },
      elevation4: {
        boxShadow: nexusShadows.lg,
      },
    },
  },

  // Input Components
  MuiTextField: {
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: nexusBorderRadius.md,
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: theme.palette.primary.main,
            },
          },
          '&.Mui-focused': {
            boxShadow: `0 0 0 3px ${theme.palette.primary.main}20`,
            '& .MuiOutlinedInput-notchedOutline': {
              borderWidth: '2px',
            },
          },
        },
      },
    },
  },

  // Chip Components
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: nexusBorderRadius.full,
        fontWeight: nexusTypography.fontWeight.medium,
      },
      filled: {
        backgroundColor: `${theme.palette.primary.main}15`,
        color: theme.palette.primary.main,
        '&:hover': {
          backgroundColor: `${theme.palette.primary.main}25`,
        },
      },
    },
  },

  // Tab Components
  MuiTabs: {
    styleOverrides: {
      root: {
        borderRadius: nexusBorderRadius.lg,
        backgroundColor: theme.palette.background.paper,
        padding: nexusSpacing[1],
        minHeight: 'auto',
      },
      indicator: {
        display: 'none',
      },
    },
  },

  MuiTab: {
    styleOverrides: {
      root: {
        borderRadius: nexusBorderRadius.base,
        textTransform: 'none',
        fontWeight: nexusTypography.fontWeight.medium,
        minHeight: 'auto',
        padding: `${nexusSpacing[2]} ${nexusSpacing[4]}`,
        margin: nexusSpacing[1],
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        '&.Mui-selected': {
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          boxShadow: nexusShadows.sm,
        },
        '&:hover': {
          backgroundColor: theme.palette.mode === 'light' 
            ? nexusColors.neutral[100] 
            : nexusColors.neutral[800],
        },
      },
    },
  },

  // Alert Components
  MuiAlert: {
    styleOverrides: {
      root: {
        borderRadius: nexusBorderRadius.md,
        border: 'none',
        boxShadow: nexusShadows.sm,
      },
      standardSuccess: {
        backgroundColor: `${nexusColors.success[500]}15`,
        color: nexusColors.success[700],
      },
      standardError: {
        backgroundColor: `${nexusColors.error[500]}15`,
        color: nexusColors.error[700],
      },
      standardWarning: {
        backgroundColor: `${nexusColors.warning[500]}15`,
        color: nexusColors.warning[700],
      },
      standardInfo: {
        backgroundColor: `${nexusColors.primary[500]}15`,
        color: nexusColors.primary[700],
      },
    },
  },

  // AppBar Components
  MuiAppBar: {
    styleOverrides: {
      root: {
        boxShadow: 'none',
        borderBottom: `1px solid ${theme.palette.divider}`,
        backgroundColor: `${theme.palette.background.paper}95`,
        backdropFilter: 'blur(20px)',
      },
    },
  },

  // Drawer Components
  MuiDrawer: {
    styleOverrides: {
      paper: {
        borderRadius: `0 ${nexusBorderRadius.xl} ${nexusBorderRadius.xl} 0`,
        border: 'none',
        boxShadow: nexusShadows.xl,
      },
    },
  },

  // Dialog Components
  MuiDialog: {
    styleOverrides: {
      paper: {
        borderRadius: nexusBorderRadius.xl,
        boxShadow: nexusShadows['2xl'],
      },
    },
  },

  // Menu Components
  MuiMenu: {
    styleOverrides: {
      paper: {
        borderRadius: nexusBorderRadius.lg,
        boxShadow: nexusShadows.lg,
        border: `1px solid ${theme.palette.divider}`,
        marginTop: nexusSpacing[2],
      },
    },
  },

  // Tooltip Components
  MuiTooltip: {
    styleOverrides: {
      tooltip: {
        borderRadius: nexusBorderRadius.base,
        backgroundColor: theme.palette.mode === 'light' 
          ? nexusColors.neutral[800] 
          : nexusColors.neutral[200],
        color: theme.palette.mode === 'light' 
          ? nexusColors.neutral[50] 
          : nexusColors.neutral[800],
        fontSize: nexusTypography.fontSize.xs,
        fontWeight: nexusTypography.fontWeight.medium,
        padding: `${nexusSpacing[2]} ${nexusSpacing[3]}`,
        boxShadow: nexusShadows.md,
      },
    },
  },
});

// Apply component overrides to both themes
nexusLightTheme = createTheme(nexusLightTheme, {
  components: getComponentOverrides(nexusLightTheme),
});

nexusDarkTheme = createTheme(nexusDarkTheme, {
  components: getComponentOverrides(nexusDarkTheme),
});

// Export themes and design tokens
export { 
  nexusLightTheme, 
  nexusDarkTheme, 
  nexusColors, 
  nexusTypography, 
  nexusSpacing, 
  nexusBorderRadius, 
  nexusShadows 
};

export default nexusLightTheme;