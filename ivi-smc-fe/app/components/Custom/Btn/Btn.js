import React from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

export default function Btn({
  label,
  icon,
  onClick,
  endIcon,
  style,
  colorText,
  backgroundColor,
}) {
  const useStyles = makeStyles(() => ({
    button: {
      backgroundColor: backgroundColor || 'transparent',
      textTransform: 'none',
      borderWidth: 0,
      color: '#FFF',
      fontFamily: 'roboto',
      fontWeight: 450,
      width: '100%',
      height: '100%',
    },
  }));
  const classes = useStyles();

  return (
    <div style={style}>
      <Button
        size="small"
        className={classes.button}
        startIcon={icon}
        endIcon={endIcon}
        onClick={onClick}
      >
        <span style={{ color: colorText }}>{label}</span>
      </Button>
    </div>
  );
}
