import { makeStyles } from '@material-ui/core/styles';

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
