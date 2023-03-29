/**
 *
 * Label
 *
 */
import * as colors from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import React from 'react';
const useStyles = makeStyles((theme) => ({
  main: {
    display: 'flex',
    alignItems: 'baseline',
  },
  bp: {
    borderRadius: '24px',
    padding: '4px 16px',
  },
  rounded: {
    borderRadius: '4px',
    padding: '4px 8px',
  },
  text: ({ textVariant }) => ({
    ...theme.typography[textVariant],
  }),
  filled: ({ hue }) => {
    const color = hue[500];
    return {
      backgroundColor: color,
      color: theme.palette.getContrastText(color),
    };
  },
  outlined: ({ hue }) => ({
    color: hue[500],
    borderColor: hue[500],
    border: '1px solid',
  }),
  ghost: ({ hue }) => ({
    color: hue[900],
    backgroundColor: hue[100],
  }),
  dot: ({ hue }) => ({
    color: hue[500],
  }),
  circle: ({ hue }) => ({
    backgroundColor: hue[500],
    width: '8px',
    height: '8px',
    borderRadius: '100%',
    marginRight: '5px',
  }),
}));

function Label({
  color,
  text,
  variant = 'filled',
  rounded = false,
  textVariant = 'subtitle2',
}) {
  const hue = colors[color];
  const classes = useStyles({ hue, textVariant });
  if (variant == 'dot') {
    return (
      <div className={classes.main}>
        <div className={classes.circle} />
        <span className={clsx(classes.dot, classes.text)}>{text}</span>
      </div>
    );
  }
  return (
    <span
      className={clsx(
        classes.text,
        rounded ? classes.rounded : classes.bp,
        classes[variant],
      )}
    >
      {text}
    </span>
  );
}

Label.propTypes = {};

export default Label;
