import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles({
  label: {
    height: '17px',
    lineHeight: '16px',
    fontSize: '14px',
    color: '#999999',
    margin: '5px 0',
  },
  input: {
    '& .MuiInputBase-input::placeholder': {
      color: 'rgba(0, 0, 0, 0.87)',
      opacity: '0.65',
    },
  },
  button: {
    padding: '12px 16px',
    border: 'none',
    outline: 'none',
    lineHeight: '16px',
    borderRadius: '8px',
    cursor: 'pointer',
    minWidth: '104px',
    boxSizing: 'border-box',
  },
  root: {
    '& .MuiInputBase-root': {
      height: '40px',
    },
    '& .MuiInputBase-input': {
      boxSizing: 'border-box',
      height: '100%',
    },
  },
  displayPosition: {
    '& .MuiTypography-root::selection ': {
      backgroundColor: 'transparent',
    },
  },
  configTitle: {
    color: '#000000',
    fontSize: '16px',
    margin: '0px',
  },
  title: {
    color: '#000000',
    fontWeight: '500',
    fontSize: '25px',
    margin: '0px',
  },
});
