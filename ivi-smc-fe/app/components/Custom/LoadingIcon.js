import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > * + *': {
      marginLeft: theme.spacing(2),
    },
  },
}));

const LoadingIcon = () => {
  const classes = useStyles();

  return (
    <div style={{ marginLeft: 10, marginRight: 10 }} className={classes.root}>
      <CircularProgress size={25} />
    </div>
  );
};
export default LoadingIcon;
