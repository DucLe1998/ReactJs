import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(() => ({
  root: {
  },
  modal: {
  },
  label: {
    fontWeight: '600',
    height: '17px',
    lineHeight: '18px',
    fontSize: '14px',
    color: '#232323',
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
  iconBtnHeader: {
    backgroundColor: 'rgba(116, 116, 128, 0.08)',
    height: 36,
    width: 36,
    borderRadius: 6,
  },
  popup: {
    zIndex: '1299 !important',
    '& .dx-popup-content': {
      padding: '0px 36px',
    },
    '& .title': {
      padding: '0px',
    },
  },
  uploadImageContainer: {
    width: '100%',
    borderRadius: '12px',
    height: '186px',
    display: 'flex',
    justifyContent: 'center',
  },
  tableContent: {
    height: '100%',
    padding: '6px 20px',
    margin: '20px 0px 0px 0px',
    borderRadius: '12px',
    background: '#FFFFFF',
    overflow: 'hidden',
    '& h3': {
      fontSize: '13px',
      fontWeight: 'bold',
    },
  },
}));

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
    minHeight: '80vh',
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