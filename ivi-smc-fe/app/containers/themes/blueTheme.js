import { createTheme } from '@material-ui/core/styles';

const root = document.documentElement;
const primaryColor = '#007BFF';
const menuBackgroundColor = '#fff';
const pageBackgroundColor = '#f5f5fa';
// const brandColor = '#115293';
const bgHeaderColor = '#fff';
const selectedColor = '#cce5ff';

root.style.setProperty('--bg-header-color', bgHeaderColor);
// root.style.setProperty('--brand-color', brandColor);
root.style.setProperty('--primary-color', primaryColor);
root.style.setProperty('--main-bg-color', primaryColor);
root.style.setProperty('--menu-bg-color', menuBackgroundColor);
root.style.setProperty('--page-background-color', pageBackgroundColor);
root.style.setProperty('--main-second-color', selectedColor);

const theme = createTheme({
  fontFamily: 'Roboto',
  palette: {
    primary: {
      main: primaryColor,
    },
  },
  typography: {
    fontFamily: 'Roboto',
  },
  overrides: {
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
    MuiPaginationItem: {
      icon: {
        color: primaryColor,
      },
    },
  },
});
export default theme;
