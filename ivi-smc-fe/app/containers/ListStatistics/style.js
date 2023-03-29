import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(() => ({
  root: {
    '& .MuiButton-root': {
      textTransform: 'none',
    },
    '& .MuiOutlinedInput-input': {
      padding: '10.5px 14px',
    },
    '& .MuiTextField-root': {
      width: '100%',
    },
    '& .MuiOutlinedInput-multiline': {
      padding: '18px 0px',
    },
    '& .Component-root': {
      height: 400,
    },
    '& .dxc-legend': {
      display: 'none',
    },
    '& .dxc-title > text': {
      fontSize: '16px !important',
      fontWeight: '100 !important',
      fill: 'rgba(0, 0, 0, 0.6) !important',
    },
    '& .MuiTypography-root': {
      fontSize: 16,
      fontWeight: '100 !important',
      color: 'rgba(0, 0, 0, 0.6)',
    },
    '& .dx-visibility-change-handler > svg': {
      position: 'relative',
      top: 10,
    },
  },
  pieDoughnut: {
    '& .dxc-legend': {
      display: 'none',
    },
  },
  card: {
    marginTop: 20,
    padding: 20,
    borderRadius: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 500,
    marginTop: 0,
  },
  titleChart: {
    color: 'rgba(0, 0, 0, 0.6)',
    fontSize: 14,
  },
  label: {
    marginBottom: 5,
    marginTop: '0px !important',
  },
  headerLeft: {
    width: '50%',
  },
  headerRight: {
    textAlign: 'right',
    width: '50%',
  },
  btnSecondary: {
    marginRight: 50,
    background: '#F6F6F6',
    borderRadius: 4,
    fontWeight: 700,
    fontSize: 14,
    '&:hover': {
      background: '#F6F6F6',
    },
  },
  timeOut: {
    color: 'rgba(0, 0, 0, 0.6)',
    fontWeight: 700,
    fontSize: 22,
  },
  numberValue: {
    color: 'rgba(0, 0, 0, 0.6)',
    fontWeight: 700,
    fontSize: 46,
    marginTop: 0,
    marginBottom: 0,
  },
  labelInOut: {
    color: 'rgba(0, 0, 0, 0.6)',
    fontWeight: 500,
    fontSize: 16,
  },
  secondaryColor: {
    color: 'rgba(0, 0, 0, 0.6)',
  },
}));
