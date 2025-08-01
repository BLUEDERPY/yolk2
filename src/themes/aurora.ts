import { createTheme } from "@mui/material";

// ===== AURORA DESIGN SYSTEM =====
// The most beautiful theme a human could imagine
// Philosophy: Digital poetry through color, motion, and light

// ===== AURORA COLOR PALETTE =====
// Inspired by the Northern Lights, cosmic phenomena, and premium luxury brands
const auroraColors = {
  // Primary: Aurora Violet - Mystical, premium, otherworldly
  primary: {
    50: '#f0f4ff',
    100: '#e0e7ff',
    200: '#c7d2fe',
    300: '#a5b4fc',
    400: '#818cf8',
    500: '#6366f1', // Main primary - Aurora Violet
    600: '#4f46e5',
    700: '#4338ca',
    800: '#3730a3',
    900: '#312e81',
    950: '#1e1b4b',
  },
  
  // Secondary: Cosmic Teal - Sophisticated, calming, infinite
  secondary: {
    50: '#f0fdfa',
    100: '#ccfbf1',
    200: '#99f6e4',
    300: '#5eead4',
    400: '#2dd4bf',
    500: '#14b8a6', // Main secondary - Cosmic Teal
    600: '#0d9488',
    700: '#0f766e',
    800: '#115e59',
    900: '#134e4a',
    950: '#042f2e',
  },
  
  // Accent: Sunset Gold - Warm, luxurious, energizing
  accent: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b', // Main accent - Sunset Gold
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
    950: '#451a03',
  },
  
  // Success: Aurora Green - Growth, harmony, nature
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
    950: '#022c22',
  },
  
  // Warning: Cosmic Orange - Energy, creativity, warmth
  warning: {
    50: '#fff7ed',
    100: '#ffedd5',
    200: '#fed7aa',
    300: '#fdba74',
    400: '#fb923c',
    500: '#f97316', // Main warning
    600: '#ea580c',
    700: '#c2410c',
    800: '#9a3412',
    900: '#7c2d12',
    950: '#431407',
  },
  
  // Error: Aurora Rose - Elegant, attention-grabbing
  error: {
    50: '#fdf2f8',
    100: '#fce7f3',
    200: '#fbcfe8',
    300: '#f9a8d4',
    400: '#f472b6',
    500: '#ec4899', // Main error
    600: '#db2777',
    700: '#be185d',
    800: '#9d174d',
    900: '#831843',
    950: '#500724',
  },
  
  // Neutral: Sophisticated Space Grays
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
  },
  
  // Special: Holographic effects
  holographic: {
    gradient1: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    gradient2: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    gradient3: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    gradient4: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    rainbow: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)',
  }
};

// ===== AURORA TYPOGRAPHY =====
const auroraTypography = {
  // Primary: Geist - Ultra-modern, clean, perfect readability
  fontFamily: '"Geist", "Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  
  // Heading: Clash Display - Bold, distinctive, premium feel
  headingFont: '"Clash Display", "Geist", "Inter", sans-serif',
  
  // Accent: JetBrains Mono - Technical precision
  monoFont: '"JetBrains Mono", "SF Mono", "Monaco", "Cascadia Code", monospace',
  
  // Display: For hero text and major headings
  displayFont: '"Satoshi", "Clash Display", sans-serif',
  
  // Golden Ratio Typography Scale (1.618)
  fontSize: {
    xs: '0.618rem',    // 9.89px
    sm: '0.75rem',     // 12px
    base: '1rem',      // 16px
    lg: '1.125rem',    // 18px
    xl: '1.25rem',     // 20px
    '2xl': '1.618rem', // 25.89px
    '3xl': '2.058rem', // 32.93px
    '4xl': '2.618rem', // 41.89px
    '5xl': '4.236rem', // 67.78px
    '6xl': '6.854rem', // 109.66px
    '7xl': '11.089rem', // 177.42px
  },
  
  // Perfect line heights
  lineHeight: {
    tight: 1.2,
    normal: 1.618, // Golden ratio
    relaxed: 1.8,
  },
  
  // Sophisticated font weights
  fontWeight: {
    thin: 100,
    extralight: 200,
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  }
};

// ===== AURORA SPACING =====
// Based on 4px grid with golden ratio multipliers
const auroraSpacing = {
  0: '0',
  px: '1px',
  0.5: '0.125rem',  // 2px
  1: '0.25rem',     // 4px
  1.5: '0.375rem',  // 6px
  2: '0.5rem',      // 8px
  2.5: '0.625rem',  // 10px
  3: '0.75rem',     // 12px
  3.5: '0.875rem',  // 14px
  4: '1rem',        // 16px
  5: '1.25rem',     // 20px
  6: '1.5rem',      // 24px
  7: '1.75rem',     // 28px
  8: '2rem',        // 32px
  9: '2.25rem',     // 36px
  10: '2.5rem',     // 40px
  11: '2.75rem',    // 44px
  12: '3rem',       // 48px
  14: '3.5rem',     // 56px
  16: '4rem',       // 64px
  20: '5rem',       // 80px
  24: '6rem',       // 96px
  28: '7rem',       // 112px
  32: '8rem',       // 128px
  36: '9rem',       // 144px
  40: '10rem',      // 160px
  44: '11rem',      // 176px
  48: '12rem',      // 192px
  52: '13rem',      // 208px
  56: '14rem',      // 224px
  60: '15rem',      // 240px
  64: '16rem',      // 256px
  72: '18rem',      // 288px
  80: '20rem',      // 320px
  96: '24rem',      // 384px
};

// ===== AURORA BORDER RADIUS =====
const auroraBorderRadius = {
  none: '0',
  xs: '0.125rem',   // 2px
  sm: '0.25rem',    // 4px
  base: '0.375rem', // 6px
  md: '0.5rem',     // 8px
  lg: '0.75rem',    // 12px
  xl: '1rem',       // 16px
  '2xl': '1.5rem',  // 24px
  '3xl': '2rem',    // 32px
  '4xl': '3rem',    // 48px
  full: '9999px',
  blob: '30% 70% 70% 30% / 30% 30% 70% 70%', // Organic shapes
};

// ===== AURORA SHADOWS =====
const auroraShadows = {
  xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  base: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  md: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  lg: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  xl: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  '2xl': '0 50px 100px -20px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  
  // Aurora special effects
  glow: '0 0 20px rgb(99 102 241 / 0.4)',
  glowLg: '0 0 40px rgb(99 102 241 / 0.3)',
  glowXl: '0 0 60px rgb(99 102 241 / 0.2)',
  aurora: '0 0 80px rgb(99 102 241 / 0.15), 0 0 40px rgb(20 184 166 / 0.15), 0 0 20px rgb(245 158 11 / 0.15)',
  cosmic: '0 8px 32px rgb(99 102 241 / 0.12), 0 4px 16px rgb(20 184 166 / 0.08), 0 2px 8px rgb(245 158 11 / 0.04)',
  holographic: '0 8px 32px rgb(102 126 234 / 0.15), 0 4px 16px rgb(240 147 251 / 0.1), 0 2px 8px rgb(79 172 254 / 0.05)',
  
  // New sophisticated card shadows
  cardRest: '0 4px 12px -2px rgb(0 0 0 / 0.08), 0 2px 6px -1px rgb(0 0 0 / 0.05)',
  cardHover: '0 20px 40px -8px rgb(99 102 241 / 0.25), 0 8px 24px -4px rgb(20 184 166 / 0.15), 0 4px 12px -2px rgb(0 0 0 / 0.1)',
  cardActive: '0 8px 16px -4px rgb(99 102 241 / 0.3), 0 4px 8px -2px rgb(20 184 166 / 0.2)',
  floating: '0 32px 64px -12px rgb(99 102 241 / 0.4), 0 16px 32px -8px rgb(20 184 166 / 0.25), 0 8px 16px -4px rgb(245 158 11 / 0.15)',
};

// ===== AURORA ANIMATIONS =====
const auroraAnimations = {
  // Smooth, organic easing
  easing: {
    smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    elastic: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    organic: 'cubic-bezier(0.23, 1, 0.32, 1)',
  },
  
  // Perfect timing
  duration: {
    fast: '150ms',
    normal: '250ms',
    slow: '350ms',
    slower: '500ms',
    slowest: '750ms',
  }
};

// ===== LIGHT THEME =====
let auroraLightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: auroraColors.primary[500],
      light: auroraColors.primary[400],
      dark: auroraColors.primary[600],
      contrastText: '#ffffff',
    },
    secondary: {
      main: auroraColors.secondary[500],
      light: auroraColors.secondary[400],
      dark: auroraColors.secondary[600],
      contrastText: '#ffffff',
    },
    accent: {
      main: auroraColors.accent[500],
      light: auroraColors.accent[400],
      dark: auroraColors.accent[600],
      contrastText: '#ffffff',
    },
    success: {
      main: auroraColors.success[500],
      light: auroraColors.success[400],
      dark: auroraColors.success[600],
      contrastText: '#ffffff',
    },
    warning: {
      main: auroraColors.warning[500],
      light: auroraColors.warning[400],
      dark: auroraColors.warning[600],
      contrastText: '#ffffff',
    },
    error: {
      main: auroraColors.error[500],
      light: auroraColors.error[400],
      dark: auroraColors.error[600],
      contrastText: '#ffffff',
    },
    background: {
      default: '#FFEBCD',
      paper: '#FFF8E7',
    },
    text: {
      primary: auroraColors.neutral[900],
      secondary: auroraColors.neutral[700],
      disabled: auroraColors.neutral[500],
    },
    divider: 'rgba(0, 0, 0, 0.12)',
    grey: auroraColors.neutral,
  },
  typography: {
    fontFamily: auroraTypography.fontFamily,
    h1: {
      fontFamily: auroraTypography.displayFont,
      fontSize: auroraTypography.fontSize['6xl'],
      fontWeight: auroraTypography.fontWeight.black,
      lineHeight: auroraTypography.lineHeight.tight,
      letterSpacing: '-0.04em',
      color: auroraColors.neutral[900],
      background: 'none',
    },
    h2: {
      fontFamily: auroraTypography.headingFont,
      fontSize: auroraTypography.fontSize['5xl'],
      fontWeight: auroraTypography.fontWeight.extrabold,
      lineHeight: auroraTypography.lineHeight.tight,
      letterSpacing: '-0.03em',
    },
    h3: {
      fontFamily: auroraTypography.headingFont,
      fontSize: auroraTypography.fontSize['4xl'],
      fontWeight: auroraTypography.fontWeight.bold,
      lineHeight: auroraTypography.lineHeight.tight,
      letterSpacing: '-0.02em',
    },
    h4: {
      fontFamily: auroraTypography.headingFont,
      fontSize: auroraTypography.fontSize['3xl'],
      fontWeight: auroraTypography.fontWeight.bold,
      lineHeight: auroraTypography.lineHeight.normal,
      letterSpacing: '-0.01em',
    },
    h5: {
      fontFamily: auroraTypography.headingFont,
      fontSize: auroraTypography.fontSize['2xl'],
      fontWeight: auroraTypography.fontWeight.semibold,
      lineHeight: auroraTypography.lineHeight.normal,
    },
    h6: {
      fontFamily: auroraTypography.headingFont,
      fontSize: auroraTypography.fontSize.xl,
      fontWeight: auroraTypography.fontWeight.semibold,
      lineHeight: auroraTypography.lineHeight.normal,
    },
    body1: {
      fontSize: auroraTypography.fontSize.base,
      lineHeight: auroraTypography.lineHeight.relaxed,
      fontWeight: auroraTypography.fontWeight.normal,
    },
    body2: {
      fontSize: auroraTypography.fontSize.sm,
      lineHeight: auroraTypography.lineHeight.normal,
      fontWeight: auroraTypography.fontWeight.normal,
    },
    button: {
      fontSize: auroraTypography.fontSize.sm,
      fontWeight: auroraTypography.fontWeight.semibold,
      textTransform: 'none',
      letterSpacing: '0.025em',
    },
    caption: {
      fontSize: auroraTypography.fontSize.xs,
      lineHeight: auroraTypography.lineHeight.normal,
      fontWeight: auroraTypography.fontWeight.medium,
    },
    overline: {
      fontSize: auroraTypography.fontSize.xs,
      fontWeight: auroraTypography.fontWeight.bold,
      textTransform: 'uppercase',
      letterSpacing: '0.15em',
    },
  },
  spacing: 4, // 4px base unit
  shape: {
    borderRadius: 12, // Default border radius
  },
});

// ===== DARK THEME =====
let auroraDarkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: auroraColors.primary[400],
      light: auroraColors.primary[300],
      dark: auroraColors.primary[500],
      contrastText: auroraColors.neutral[900],
    },
    secondary: {
      main: auroraColors.secondary[400],
      light: auroraColors.secondary[300],
      dark: auroraColors.secondary[500],
      contrastText: auroraColors.neutral[900],
    },
    accent: {
      main: auroraColors.accent[400],
      light: auroraColors.accent[300],
      dark: auroraColors.accent[500],
      contrastText: auroraColors.neutral[900],
    },
    success: {
      main: auroraColors.success[400],
      light: auroraColors.success[300],
      dark: auroraColors.success[500],
      contrastText: auroraColors.neutral[900],
    },
    warning: {
      main: auroraColors.warning[400],
      light: auroraColors.warning[300],
      dark: auroraColors.warning[500],
      contrastText: auroraColors.neutral[900],
    },
    error: {
      main: auroraColors.error[400],
      light: auroraColors.error[300],
      dark: auroraColors.error[500],
      contrastText: auroraColors.neutral[900],
    },
    background: {
      default: '#222237',
      paper: '#111111',
    },
    text: {
      primary: auroraColors.neutral[50],
      secondary: auroraColors.neutral[400],
      disabled: auroraColors.neutral[600],
    },
    divider: auroraColors.neutral[800],
    grey: auroraColors.neutral,
  },
  typography: auroraLightTheme.typography,
  spacing: auroraLightTheme.spacing,
  shape: auroraLightTheme.shape,
});

// ===== COMPONENT CUSTOMIZATIONS =====
const getAuroraComponents = (theme: any) => ({
  // Button Components - Absolutely stunning
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: auroraBorderRadius['2xl'],
        textTransform: 'none',
        fontWeight: auroraTypography.fontWeight.semibold,
        padding: `${auroraSpacing[3]} ${auroraSpacing[8]}`,
        transition: `all ${auroraAnimations.duration.normal} ${auroraAnimations.easing.organic}`,
        boxShadow: 'none',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: '-100%',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
          transition: `left ${auroraAnimations.duration.slow} ${auroraAnimations.easing.organic}`,
        },
        '&:hover': {
          transform: 'translateY(-2px) scale(1.02)',
          boxShadow: auroraShadows.cosmic,
          '&::before': {
            left: '100%',
          },
        },
        '&:active': {
          transform: 'translateY(-1px) scale(1.01)',
        },
      },
      contained: {
        background: auroraColors.holographic.gradient1,
        color: theme.palette.mode === 'light' ? '#ffffff !important' : '#ffffff !important',
        '&:hover': {
          background: auroraColors.holographic.gradient2,
          color: '#ffffff !important',
          boxShadow: auroraShadows.glowLg,
        },
      },
      outlined: {
        borderWidth: '2px',
        borderColor: theme.palette.primary.main,
        background: `${theme.palette.primary.main}08`,
        backdropFilter: 'blur(20px)',
        color: theme.palette.mode === 'light' ? theme.palette.primary.dark : theme.palette.primary.light,
        '&:hover': {
          borderWidth: '2px',
          background: `${theme.palette.primary.main}15`,
          boxShadow: auroraShadows.glow,
          color: theme.palette.mode === 'light' ? theme.palette.primary.dark : theme.palette.primary.light,
        },
      },
      text: {
        color: theme.palette.mode === 'light' ? theme.palette.primary.dark : theme.palette.primary.light,
        '&:hover': {
          background: `${theme.palette.primary.main}10`,
          backdropFilter: 'blur(10px)',
          color: theme.palette.mode === 'light' ? theme.palette.primary.dark : theme.palette.primary.light,
        },
      },
      sizeSmall: {
        padding: `${auroraSpacing[2]} ${auroraSpacing[6]}`,
        fontSize: auroraTypography.fontSize.xs,
        borderRadius: auroraBorderRadius.xl,
      },
      sizeLarge: {
        padding: `${auroraSpacing[4]} ${auroraSpacing[12]}`,
        fontSize: auroraTypography.fontSize.lg,
        borderRadius: auroraBorderRadius['3xl'],
      },
    },
  },

  // Card Components - Floating glass morphism
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: auroraBorderRadius['3xl'],
        background: theme.palette.mode === 'light' 
          ? 'rgba(255, 255, 255, 0.8)'
          : 'rgba(17, 17, 17, 0.8)',
        backdropFilter: 'blur(20px)',
        border: `1px solid ${theme.palette.mode === 'light' 
          ? 'rgba(255, 255, 255, 0.2)'
          : 'rgba(255, 255, 255, 0.1)'}`,
        boxShadow: auroraShadows.cardRest,
        transition: `border ${auroraAnimations.duration.normal} ${auroraAnimations.easing.organic}`,
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          border: '1px solid transparent !important',
          maxWidth: 'calc(100% - 2px) !important',
          maxHeight: 'calc(100% - 2px) !important',
          backgroundImage: `linear-gradient(${theme.palette.mode === 'light' 
            ? 'rgba(255, 255, 255, 0.8)'
            : 'rgba(17, 17, 17, 0.8)'}, ${theme.palette.mode === 'light' 
            ? 'rgba(255, 255, 255, 0.8)'
            : 'rgba(17, 17, 17, 0.8)'}), linear-gradient(45deg, #667eea, #764ba2, #f093fb, #f5576c, #4facfe, #00f2fe, #43e97b, #38f9d7, #667eea) !important`,
          backgroundOrigin: 'border-box !important',
          backgroundClip: 'content-box, border-box !important',
          backgroundSize: '100% 100%, 100% 100% !important',
          boxSizing: 'border-box !important',
        },
      },
    },
  },

  // Paper Components - Elegant surfaces
  MuiPaper: {
    styleOverrides: {
      root: {
        borderRadius: auroraBorderRadius['2xl'],
        backgroundImage: 'none',
        background: theme.palette.mode === 'light' 
          ? 'rgba(255, 255, 255, 0.9)'
          : 'rgba(17, 17, 17, 0.9)',
        backdropFilter: 'blur(20px)',
        border: `1px solid ${theme.palette.divider}`,
      },
      elevation1: {
        boxShadow: auroraShadows.sm,
      },
      elevation2: {
        boxShadow: auroraShadows.base,
      },
      elevation3: {
        boxShadow: auroraShadows.md,
      },
      elevation4: {
        boxShadow: auroraShadows.lg,
      },
    },
  },

  // Input Components - Futuristic forms
  MuiTextField: {
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: auroraBorderRadius.xl,
          background: theme.palette.mode === 'light' 
            ? 'rgba(255, 255, 255, 0.8)'
            : 'rgba(17, 17, 17, 0.8)',
          backdropFilter: 'blur(10px)',
          transition: `all ${auroraAnimations.duration.normal} ${auroraAnimations.easing.organic}`,
          '&:hover': {
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: theme.palette.primary.main,
              borderWidth: '2px',
            },
            transform: 'translateY(-1px)',
            boxShadow: auroraShadows.glow,
          },
          '&.Mui-focused': {
            transform: 'translateY(-2px)',
            boxShadow: auroraShadows.glowLg,
            '& .MuiOutlinedInput-notchedOutline': {
              borderWidth: '2px',
              borderColor: theme.palette.primary.main,
            },
          },
        },
      },
    },
  },

  // Chip Components - Floating pills
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: auroraBorderRadius.full,
        fontWeight: auroraTypography.fontWeight.semibold,
        backdropFilter: 'blur(10px)',
        transition: `all ${auroraAnimations.duration.normal} ${auroraAnimations.easing.organic}`,
        '&:hover': {
          transform: 'translateY(-1px) scale(1.05)',
          boxShadow: auroraShadows.glow,
        },
      },
      filled: {
        background: `${theme.palette.primary.main}20`,
        color: theme.palette.primary.main,
        '&:hover': {
          background: `${theme.palette.primary.main}30`,
          color: theme.palette.primary.dark,
        },
      },
    },
  },

  // Tab Components - Floating navigation
  MuiTabs: {
    styleOverrides: {
      root: {
        borderRadius: auroraBorderRadius['2xl'],
        background: theme.palette.mode === 'light' 
          ? 'rgba(255, 255, 255, 0.8)'
          : 'rgba(17, 17, 17, 0.8)',
        backdropFilter: 'blur(20px)',
        padding: auroraSpacing[2],
        minHeight: 'auto',
        border: `1px solid ${theme.palette.divider}`,
      },
      indicator: {
        display: 'none',
      },
    },
  },

  MuiTab: {
    styleOverrides: {
      root: {
        borderRadius: auroraBorderRadius.xl,
        textTransform: 'none',
        fontWeight: auroraTypography.fontWeight.semibold,
        minHeight: 'auto',
        padding: `${auroraSpacing[3]} ${auroraSpacing[6]}`,
        margin: auroraSpacing[1],
        transition: `all ${auroraAnimations.duration.normal} ${auroraAnimations.easing.organic}`,
        '&.Mui-selected': {
          background: theme.palette.primary.main,
          color: '#ffffff !important',
          boxShadow: auroraShadows.glow,
          transform: 'translateY(-1px)',
        },
        '&:hover': {
          background: theme.palette.mode === 'light' 
            ? auroraColors.neutral[100] 
            : auroraColors.neutral[800],
          transform: 'translateY(-1px)',
        },
      },
    },
  },

  // Alert Components - Elegant notifications
  MuiAlert: {
    styleOverrides: {
      root: {
        borderRadius: auroraBorderRadius.xl,
        border: 'none',
        backdropFilter: 'blur(20px)',
        boxShadow: auroraShadows.md,
      },
      standardSuccess: {
        background: `${auroraColors.success[500]}20`,
        color: auroraColors.success[700],
        '& .MuiAlert-icon': {
          color: auroraColors.success[500],
        },
      },
      standardError: {
        background: `${auroraColors.error[500]}20`,
        color: auroraColors.error[700],
        '& .MuiAlert-icon': {
          color: auroraColors.error[500],
        },
      },
      standardWarning: {
        background: `${auroraColors.warning[500]}20`,
        color: auroraColors.warning[700],
        '& .MuiAlert-icon': {
          color: auroraColors.warning[500],
        },
      },
      standardInfo: {
        background: `${auroraColors.primary[500]}20`,
        color: auroraColors.primary[700],
        '& .MuiAlert-icon': {
          color: auroraColors.primary[500],
        },
      },
    },
  },

  // AppBar Components - Floating header
  MuiAppBar: {
    styleOverrides: {
      root: {
        boxShadow: 'none',
        background: theme.palette.mode === 'light' 
          ? 'rgba(255, 255, 255, 0.8)'
          : 'rgba(10, 10, 10, 0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${theme.palette.divider}`,
      },
    },
  },

  // Drawer Components
  MuiDrawer: {
    styleOverrides: {
      paper: {
        borderRadius: `0 ${auroraBorderRadius['3xl']} ${auroraBorderRadius['3xl']} 0`,
        border: 'none',
        background: theme.palette.mode === 'light' 
          ? 'rgba(255, 255, 255, 0.9)'
          : 'rgba(17, 17, 17, 0.9)',
        backdropFilter: 'blur(20px)',
        boxShadow: auroraShadows.xl,
      },
    },
  },

  // Dialog Components
  MuiDialog: {
    styleOverrides: {
      paper: {
        borderRadius: auroraBorderRadius['3xl'],
        background: theme.palette.mode === 'light' 
          ? 'rgba(255, 255, 255, 0.95)'
          : 'rgba(17, 17, 17, 0.95)',
        backdropFilter: 'blur(20px)',
        boxShadow: auroraShadows['2xl'],
        border: `1px solid ${theme.palette.divider}`,
      },
    },
  },

  // Menu Components
  MuiMenu: {
    styleOverrides: {
      paper: {
        borderRadius: auroraBorderRadius.xl,
        background: theme.palette.mode === 'light' 
          ? 'rgba(255, 255, 255, 0.9)'
          : 'rgba(17, 17, 17, 0.9)',
        backdropFilter: 'blur(20px)',
        boxShadow: auroraShadows.lg,
        border: `1px solid ${theme.palette.divider}`,
        marginTop: auroraSpacing[2],
      },
    },
  },

  // Tooltip Components
  MuiTooltip: {
    styleOverrides: {
      tooltip: {
        borderRadius: auroraBorderRadius.lg,
        background: theme.palette.mode === 'light' 
          ? 'rgba(0, 0, 0, 0.9)'
          : 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        color: theme.palette.mode === 'light' 
          ? 'white'
          : 'black',
        fontSize: auroraTypography.fontSize.xs,
        fontWeight: auroraTypography.fontWeight.semibold,
        padding: `${auroraSpacing[2]} ${auroraSpacing[4]}`,
        boxShadow: auroraShadows.lg,
        border: `1px solid ${theme.palette.divider}`,
      },
    },
  },

  // Slider Components - Holographic sliders
  MuiSlider: {
    styleOverrides: {
      root: {
        '& .MuiSlider-track': {
          background: auroraColors.holographic.gradient1,
          border: 'none',
          height: 6,
        },
        '& .MuiSlider-thumb': {
          background: auroraColors.holographic.gradient2,
          boxShadow: auroraShadows.glow,
          '&:hover': {
            boxShadow: auroraShadows.glowLg,
          },
        },
        '& .MuiSlider-rail': {
          background: theme.palette.divider,
          height: 6,
        },
      },
    },
  },

  // Progress Components
  MuiLinearProgress: {
    styleOverrides: {
      root: {
        borderRadius: auroraBorderRadius.full,
        height: 8,
        background: theme.palette.divider,
      },
      bar: {
        borderRadius: auroraBorderRadius.full,
        background: auroraColors.holographic.gradient1,
      },
    },
  },
});

// Apply component overrides to both themes
auroraLightTheme = createTheme(auroraLightTheme, {
  components: getAuroraComponents(auroraLightTheme),
});

auroraDarkTheme = createTheme(auroraDarkTheme, {
  components: getAuroraComponents(auroraDarkTheme),
});

// Export themes and design tokens
export { 
  auroraLightTheme, 
  auroraDarkTheme, 
  auroraColors, 
  auroraTypography, 
  auroraSpacing, 
  auroraBorderRadius, 
  auroraShadows,
  auroraAnimations
};

export default auroraLightTheme;