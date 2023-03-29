import { Grid, makeStyles, Paper, TextField } from '@material-ui/core';
import { format } from 'date-fns';
import React from 'react';
import PropTypes from 'prop-types';

const useStyles = makeStyles({
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
  disabledInput: {
    backgroundColor: '#f4f4f4',
    outline: 'none',
  },
});

const RenderItem = ({ item }) => {
  const classes = useStyles();
  const width = item.width || 1;
  if (!item || item?.visible == false) return null;
  switch (item.type) {
    case 'date':
      return (
        <Grid item xs={width}>
          <Grid container direction="column">
            <p className={classes.label}>{item.field}</p>
            <TextField
              className={classes.disabledInput}
              value={format(new Date(item.content), 'dd/MM/yyyy')}
              variant="outlined"
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
        </Grid>
      );
    case 'empty':
      return <Grid item xs={width} />;
    case 'component':
      return (
        <Grid item xs={width}>
          <Grid container direction="column">
            <p className={classes.label}>{item.field}</p>
            {item.component}
          </Grid>
        </Grid>
      );
    default:
      return (
        <Grid item xs={width}>
          <Grid container direction="column">
            <p className={classes.label}>{item.field}</p>
            <TextField
              className={classes.disabledInput}
              value={item.content}
              variant="outlined"
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
        </Grid>
      );
  }
};

const RenderDetails = props => {
  const { title, data, nopaper = false } = props;
  const classes = useStyles();

  if (!data) return null;
  if (!data.length) return null;
  return (
    <div {...props} className={classes.root}>
      {nopaper ? (
        <>
          {title ? <h3 className={classes.h3}>{title}</h3> : null}
          <Grid container spacing={3}>
            {data.map(item => (
              <RenderItem item={item} key={Math.random()} />
            ))}
          </Grid>
        </>
      ) : (
        <Paper className={classes.paper}>
          {title ? <h3 className={classes.h3}>{title}</h3> : null}
          <Grid container spacing={3}>
            {data.map(item => (
              <RenderItem item={item} key={Math.random()} />
            ))}
          </Grid>
        </Paper>
      )}
    </div>
  );
};
RenderDetails.propTypes = {
  title: PropTypes.any,
  nopaper: PropTypes.bool,
  data: PropTypes.any,
};
export default RenderDetails;
