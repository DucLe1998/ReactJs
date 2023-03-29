import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(() => ({
  modal: {
    '& .dx-fileuploader-file-info': {
      display: 'none',
    },
    '& .dx-fileuploader-file-status-message': {
      display: 'none',
    },
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
