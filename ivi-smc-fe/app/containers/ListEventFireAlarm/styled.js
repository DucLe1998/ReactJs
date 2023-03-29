import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(() => ({
  root: {},
  popup: {
    zIndex: '1299 !important',
  },
  label: {
    height: '17px',
    lineHeight: '16px',
    fontSize: '14px',
    color: '#999999',
    margin: '5px 0',
  },
  dataGrid: {
    '& .dx-datagrid-content .dx-datagrid-table tbody td': {
      verticalAlign: 'middle',
    },
  },
}));
