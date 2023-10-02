import { createTheme } from '@mui/material/styles';
export const theme = createTheme({
  palette: {
    primary: {
      main: '#2a3492',
    },
    red: {
      main: '#ef4423',
    },
    orange: {
      main: '#ff9526',
    },
    yellow: {
      main: '#f6eb14',
    },
    green: {
      main: '#4faf44',
    },
    white: {
      main: '#ffffff',
    }
  },
  typography: {
    fontFamily: ['"Electrolize"', 'sans-serif'].join(','),
    fontSize: 16,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
  },
});
