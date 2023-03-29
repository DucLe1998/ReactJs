import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(() => ({
  root: {
    '& .MuiPaper-rounded': {
      borderRadius: '8px',
    },
    '& .MuiPaper-root': {
      padding: '16px 32px 32px 32px',
      minHeight: 'calc(100vh - 160px)',
    },
  },
  textField: {
    '& .MuiInputBase-root': {
      height: '40px',
    },
    '& .MuiInputBase-input': {
      boxSizing: 'border-box',
      height: '100%',
    },
    '& .MuiPaper-rounded': {
      borderRadius: '8px',
    },
    '& .MuiDialogActions-root': {
      padding: '32px',
    },
    '& .MuiOutlinedInput-adornedEnd.MuiOutlinedInput-adornedEnd': {
      padding: '0px 12px !important',
    },
    '& .MuiIconButton-sizeSmall': {
      padding: '0px !important',
    },
  },
  autocomplete: {
    '& .MuiAutocomplete-inputRoot': {
      height: '40px',
    },
    '& .MuiInputBase-input': {
      boxSizing: 'border-box',
      height: '100%',
    },
  },
  btnRawConfig: {
    background: '#00554a !important',
    borderRadius: '8px !important',
    color: '#ffffff !important',
    '&:hover': {
      opacity: '0.9 !important',
      boxShadow: '0px 4px 10px rgba(16, 156, 241, 0.24) !important',
      background: '#00554a !important',
    },
  },
  label: {
    margin: '0px',
  },
  textAreaContainer: {
    '& textarea': {
      borderRadius: '4px !important',
      borderColor: '#c4c4c4',
      '&:hover': {
        borderColor: '#40A574',
      },
      '&:focus-visible': {
        outline: 'none',
        border: '2px solid #40A574',
      },
    },
  },
}));
