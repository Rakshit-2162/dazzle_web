import { createTheme, type PaletteMode } from '@mui/material'

export const tokens = (mode: 'light' | 'dark') => ({
  primary: {
    main: '#003FFF',
  },
  activeBlue: {
    main: '#007aff',
  },
  blueAccent: {
    main: '#448aff',
  },
  blueAccent13: {
    main: '#e3ecfb',
  },
  drawer: {
    main: '#66afff',
  },
  background: {
    default: mode === 'dark' ? '#0c101b' : '#fcfcfc',
    paper: mode === 'dark' ? '#141b2d' : '#ffffff',
  },
  text: {
    primary: mode === 'dark' ? '#ffffff' : '#111111',
    secondary: mode === 'dark' ? '#cbd5e1' : '#374151',
  },
  grey: mode === 'dark'
    ? {
        100: '#e0e0e0',
        200: '#c2c2c2',
        300: '#a3a3a3',
        400: '#858585',
        500: '#666666',
        600: '#525252',
        700: '#3d3d3d',
        800: '#292929',
        900: '#141414',
      }
    : {
        100: '#141414',
        200: '#292929',
        300: '#3d3d3d',
        400: '#525252',
        500: '#666666',
        600: '#858585',
        700: '#a3a3a3',
        800: '#c2c2c2',
        900: '#e0e0e0',
      },
})

const getDesignTokens = (mode: PaletteMode) => {
  const colors = tokens(mode)

  return {
    palette: {
      mode,
      primary: {
        main: colors.primary.main,
      },
      secondary: {
        main: colors.activeBlue.main,
      },
      background: {
        default: colors.background.default,
        paper: colors.background.paper,
      },
      text: {
        primary: colors.text.primary,
        secondary: colors.text.secondary,
      },
    },
    typography: {
      fontFamily: 'Poppins, sans-serif',
      fontSize: 12,
      h1: { fontFamily: 'Poppins, sans-serif', fontSize: 40, fontWeight: 700, lineHeight: 1.2 },
      h2: { fontFamily: 'Poppins, sans-serif', fontSize: 32, fontWeight: 600, lineHeight: 1.3 },
      h3: { fontFamily: 'Poppins, sans-serif', fontSize: 24, fontWeight: 600, lineHeight: 1.3 },
      h4: { fontFamily: 'Poppins, sans-serif', fontSize: 20, fontWeight: 500, lineHeight: 1.4 },
      h5: { fontFamily: 'Poppins, sans-serif', fontSize: 16, fontWeight: 500, lineHeight: 1.4 },
      h6: { fontFamily: 'Poppins, sans-serif', fontSize: 14, fontWeight: 400, lineHeight: 1.5 },
      subtitle1: { fontFamily: 'Poppins, sans-serif', fontSize: 14, fontWeight: 400, lineHeight: 1.5 },
      subtitle2: { fontFamily: 'Poppins, sans-serif', fontSize: 12, fontWeight: 500, lineHeight: 1.57 },
      body1: { fontFamily: 'Poppins, sans-serif', fontSize: 14, fontWeight: 400, lineHeight: 1.5 },
      body2: { fontFamily: 'Poppins, sans-serif', fontSize: 12, fontWeight: 300, lineHeight: 1.43 },
      button: { fontFamily: 'Poppins, sans-serif', fontSize: 14, fontWeight: 500, textTransform: 'none' as const },
      caption: { fontFamily: 'Poppins, sans-serif', fontSize: 12, fontWeight: 400, lineHeight: 1.66 },
      overline: { fontFamily: 'Poppins, sans-serif', fontSize: 12, fontWeight: 400, lineHeight: 2.66 },
    },
    shape: {
      borderRadius: 8,
    },
    spacing: 8,
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            fontFamily: 'Poppins, sans-serif',
            backgroundColor: colors.background.default,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: 'none',
            fontFamily: 'Poppins, sans-serif',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            fontFamily: 'Poppins, sans-serif',
          },
        },
      },
      MuiAlert: {
        styleOverrides: {
          message: {
            fontSize: 14,
            fontFamily: 'Poppins, sans-serif',
          },
        },
      },
    },
  }
}

export const getTheme = (mode: PaletteMode) =>
  createTheme(getDesignTokens(mode))