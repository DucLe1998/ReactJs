import { makeStyles } from '@material-ui/core/styles';

export const mainUseStyles = makeStyles({
  root: {
    '& .dx-pointer-events-none': {
      border: 'none !important',
    },
    '& td': {
      verticalAlign: 'middle !important',
    },
  },
  btnWrapper: {
    display: 'flex',
    justifyContent: 'flex-end',
    width: '60px',
  },
});

export const dialogAddguestStyles = makeStyles({
  root: {
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
  },
  label: {
    height: '17px',
    lineHeight: '16px',
    fontSize: '14px',
    color: '#999999',
    margin: '5px 0',
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
  warning: {
    '& .MuiFormHelperText-root': {
      color: 'rgba(246, 166, 9, 0.84)',
    },
    '& fieldset': {
      borderColor: 'rgba(246, 166, 9, 0.84) !important',
    },
  },
  disabledInput: {
    backgroundColor: '#f4f4f4',
    outline: 'none',
  },
  default: {},
});
export const addGuestStyles = makeStyles({
  root: {
    '& .MuiInputBase-root': {
      height: '40px',
    },
    '& .MuiInputBase-input': {
      boxSizing: 'border-box',
      height: '100%',
    },
  },
  label: {
    height: '17px',
    lineHeight: '16px',
    fontSize: '14px',
    color: '#999999',
    margin: '5px 0',
  },
  paper: {
    padding: '28px',
    borderRadius: '10px',
    marginBottom: '16px',
  },
  h3: {
    margin: '0',
    fontSize: '20px',
    fontWeight: 500,
    fontStyle: 'normal',
    marginBottom: '24px',
    lineHeight: '23px',
    letterSpacing: '0.38px',
  },
  table: {
    '& .MuiTableCell-head': {
      color: 'rgba(37, 37, 37, 0.4)',
      backgroundColor: '#fafbfd',
    },
  },
  tableRow: {
    fontSize: '14px',
    lineHeight: '21px',
    '&:nth-of-type(even)': {
      backgroundColor: '#f3f5f7',
    },
    '&:nth-of-type(odd)': {
      backgroundColor: '#ffffff',
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
  daysOfWeek: {
    '& .MuiInputBase-root': {
      height: 'unset',
    },
    '& .MuiAutocomplete-inputRoot': {
      padding: '1px 6px',
    },
    '& .MuiChip-root': {
      height: '26px',
      borderRadius: '10px',
      fontSize: '0.8rem',
    },
  },
});
export const detailStyles = makeStyles({
  root: {
    '& .MuiInputBase-root': {
      height: '40px',
    },
    '& .MuiInputBase-input': {
      boxSizing: 'border-box',
      height: '100%',
    },
  },
  label: {
    height: '17px',
    lineHeight: '16px',
    fontSize: '14px',
    color: '#999999',
    margin: '5px 0',
  },
  button: {
    margin: 'auto',
    borderRadius: '8px',
    boxSizing: 'border-box',
    cursor: 'pointer',
    border: 'none',
    outline: 'none',
    padding: '12px 16px',
    lineHeight: '16px',
    fontWeight: 500,
    minWidth: '104px',
    whiteSpace: 'nowrap',
  },
  h3: {
    margin: '0',
    fontSize: '20px',
    fontWeight: 500,
    fontStyle: 'normal',
    marginBottom: '24px',
  },
  paper: {
    padding: '28px',
    borderRadius: '10px',
    marginBottom: '16px',
  },
  disabledInput: {
    backgroundColor: '#f4f4f4',
    outline: 'none',
  },
  table: {
    '& .MuiTableCell-head': {
      color: 'rgba(37, 37, 37, 0.4)',
      backgroundColor: '#fafbfd',
    },
  },
  tableRow: {
    fontSize: '14px',
    lineHeight: '21px',
    '&:nth-of-type(even)': {
      backgroundColor: '#f3f5f7',
    },
    '&:nth-of-type(odd)': {
      backgroundColor: '#ffffff',
    },
  },
  daysOfWeek: {
    '& .MuiInputBase-root': {
      height: 'unset',
    },
    '& .MuiAutocomplete-inputRoot': {
      padding: '1px 6px',
    },
    '& .MuiChip-root': {
      height: '26px',
      borderRadius: '10px',
      fontSize: '0.8rem',
    },
  },
});
