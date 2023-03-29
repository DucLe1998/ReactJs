import { createTheme } from '@material-ui/core/styles';

const root = document.documentElement;
const primaryColor = '#40A574';
const menuBackgroundColor = '#fff';
const pageBackgroundColor = '#f5f5fa';

root.style.setProperty('--primary-color', primaryColor);
root.style.setProperty('--main-bg-color', primaryColor);
root.style.setProperty('--menu-bg-color', menuBackgroundColor);
root.style.setProperty('--page-background-color', pageBackgroundColor);

const theme = createTheme({
  fontFamily: 'Roboto',
  palette: {
    primary: {
      main: primaryColor,
    },
    secondary: {
      main: '#ffc400',
    },
  },
  typography: {
    fontFamily: 'Roboto',
  },
  overrides: {
    MuiButton: {
      contained: {
        backgroundColor: '#E2E2E2',
        '&:hover': {
          backgroundColor: '#E2E2E2',
        },
      },
      containedPrimary: {
        backgroundColor: '#00554A',
        '&:hover': {
          backgroundColor: '#00554A',
        },
      },
    },
    MuiFormLabel: {
      root: {
        marginBottom: '5px',
      },
      asterisk: {
        color: '#f44336',
      },
    },
    MuiOutlinedInput: {
      root: {
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: primaryColor,
        },
      },
    },
  },
});
export default theme;
