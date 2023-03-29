import { createTheme } from '@material-ui/core/styles';

const root = document.documentElement;
const primaryColor = '#673ab7';
const menuBackgroundColor = '#e3f2fd';
const pageBackgroundColor = '#e3f2fd';
const secondaryMain = '#5e35b1';

root.style.setProperty('--primary-color', primaryColor);
root.style.setProperty('--main-bg-color', primaryColor);
root.style.setProperty('--menu-bg-color', '#fff');
root.style.setProperty('--page-background-color', pageBackgroundColor);

const theme = createTheme({
  fontFamily: 'Roboto',
  palette: {
    primary: {
      main: primaryColor,
    },
    secondary: {
      main: '#5e35b1',
    },
  },
  typography: {
    fontFamily: 'Roboto',
  },
  overrides: {
    MuiButton: {
      contained: {
        backgroundColor: '#673ab7',
        '&:hover': {
          backgroundColor: '#5e35b1',
        },
      },
      containedPrimary: {
        backgroundColor: '#673ab7',
        '&:hover': {
          backgroundColor: '#5e35b1',
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
