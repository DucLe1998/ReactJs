import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  indeterminateColor: {
    color: '#40A574',
  },
  selectAllText: {
    fontWeight: 500,
  },
  select: {
    '&:focus': {
      backgroundColor: 'transparent',
    },
    paddingLeft: 10,
    borderRadius: 8,
  },
  selectedAll: {
    backgroundColor: '#F2F2F7',
    '&:hover': {
      backgroundColor: '#F2F2F7',
    },
  },
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
  getContentAnchorEl: null,
  anchorOrigin: {
    vertical: 'bottom',
    horizontal: 'center',
  },
  transformOrigin: {
    vertical: 'top',
    horizontal: 'center',
  },
  variant: 'menu',
};

export { useStyles, MenuProps };
