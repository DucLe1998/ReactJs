import { makeStyles } from '@material-ui/core';
export const useStyles = makeStyles((theme) => ({
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  chipArray: {
    display: 'flex',
    gap: 10,
  },
  avartar: {
    backgroundColor: theme.palette.primary.main,
  },
  itemContent: {
    flex: 1,
    padding: '6px 0',
    minWidth: 0,
  },
  itemSelected: {
    backgroundColor: 'rgba(0, 123, 255, 0.05) !important',
  },
  empty: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  iconEmpty: {
    fontSize: 100,
    color: theme.palette.primary.light,
  },
  badge: {
    width: 'max-content',
  },
  popupContainer: {
    width: 480,
  },
  popupHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 16px',
    alignItems: 'center',
  },
  badgeIcon: {
    color: 'white',
    borderRadius: 24,
    fontSize: 18,
  },
}));
