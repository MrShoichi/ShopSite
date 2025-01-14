import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#f44336',
    },
    secondary: {
      light: '#90caf9',
      main: '#90caf9',
      contrastText: '#90caf9',
    },
    custom: {
      light: '#ffa726',
      main: '#f57c00',
      dark: '#ef6c00',
      contrastText: 'rgba(0, 0, 0, 0.87)',
    },
    contrastThreshold: 3,
    tonalOffset: 0.2,
  },
  mixins: {
      toolbar: {
        minHeight: 60,
      },
    },
});
