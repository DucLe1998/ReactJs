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
    '& .MuiAutocomplete-popper': {
      minHeight: '160px',
    },
  },
  outerColumn: {
    borderBottom: '1px solid #D8D8D8',
    marginBottom: '15px',
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
    '& .dx-fileuploader-file-info': {
      display: 'none',
    },
    '& .dx-fileuploader-file-status-message': {
      display: 'none',
    },
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

export const useStyles = makeStyles(() => ({
  switch: {
    width: '100%',
    '& .MuiOutlinedInput-input': {
      color: '#333333',
      // background: '#E2E2E2',
      padding: '10px 14px',
    },
  },
  circularProgress: {
    '& .MuiCircularProgress-root': {
      width: '90px !important',
      height: '90px !important',
    },
    '& .MuiCircularProgress-colorPrimary': {
      color: '#5C5C5C !important',
    },
  },
  circularProgressExport: {
    '& .MuiCircularProgress-root': {
      width: '60px !important',
      height: '60px !important',
    },
    '& .MuiCircularProgress-colorPrimary': {
      color: '#5C5C5C !important',
    },
  },
  textFieldStyle: {
    '& .MuiFormControl-root': {
      width: '100%',
    },
    '& .MuiOutlinedInput-input': {
      padding: '10px 14px',
    },
  },
  fullWidth: {
    width: '100%',
    '& .MuiSwitch-root': {
      position: 'absolute',
      // top: 18,
      right: 5,
    },
    '& .MuiCheckbox-root': {
      position: 'absolute',
      left: 0,
      // padding: '10px 14px',
      // top: 18,
    },
    // '& .MuiCheckbox-colorPrimary.Mui-checked': {
    //   color: '#109CF1',
    // },
  },
  primaryColorButtonChange: {
    '& .MuiCheckbox-colorPrimary.Mui-checked': {
      color: '#109CF1',
    },
  },
  label: {
    marginTop: '0px !important',
  },
  button: {
    fontSize: 12,
    borderRadius: 8,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '10px 25px',
    textTransform: 'inherit',
  },
  buttonFilter: {
    background: '#00554A',
    color: 'white',
    boxShadow: '0px 4px 10px rgba(16, 156, 241, 0.24)',
    '&:hover': {
      background: '#00554A',
      color: 'white',
    },
  },
  buttonCancel: {
    background: '#E2E2E2',
    color: 'black',
    boxShadow: '0px 4px 10px rgba(16, 156, 241, 0.24)',
    '&:hover': {
      background: '#E2E2E2',
      color: 'black',
    },
  },
  card: {
    marginTop: 20,
  },
  gridMargin: {
    marginTop: 10,
  },
  titleHeader: {
    fontWeight: 700,
    fontSize: 20,
  },
  radio: {
    fontWeight: 500,
    fontSize: 16,
  },
  radioLabel: {
    '& .MuiTypography-body1': {
      width: '100%',
      borderBottom: '0.5px solid rgba(0, 0, 0, 0.12)',
      fontWeight: 500,
    },
  },
  tab: {
    textAlign: 'center',
    '& .MuiToggleButton-label': {
      textTransform: 'initial',
      fontSize: 16,
      fontWeight: 700,
    },
    '& .MuiToggleButton-root': {
      padding: '5px 30px',
      borderRadius: 8,
    },
    '& .MuiToggleButton-root.Mui-selected': {
      background: 'white',
      boxShadow: '0px 6px 18px rgba(0, 0, 0, 0.06)',
      borderRadius: 8,
    },
  },
  header: {
    width: '100%',
    display: 'flex',
  },
  leftHeader: {
    width: '50%',
  },
  rightHeader: {
    alignItems: 'center',
    width: '50%',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  headerAdd: {
    fontWeight: 500,
    fontSize: 14,
    textAlign: 'right',
    color: '#117B5B',
    marginRight: 5,
  },
  marginCard: {
    // margin: '0 20px',
  },
  fileUploadIcon: {
    position: 'absolute',
    top: '3px',
    right: 16,
    transform: 'translateY(50%)',
    fontSize: '18px',
    cursor: 'pointer',
  },
  placeholderUploadIcon: {
    color: '#109CF1',
    '&& .dx-texteditor-input': {
      fontWeight: 700,
      color: '#109CF1',
    },
  },
  textValidate: {
    color: 'red',
    marginTop: 1,
  },
  popupZIndex: {
    zIndex: '1299 !important',
  },
  optionAutocomplate: {
    padding: '0px !important',
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
}));
