import React from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import CtToolTip from './CtToolTip';

export default function Btn({
  label,
  icon,
  onClick,
  endIcon,
  style,
  colorText,
  backgroundColor,
  disabled,
  className,
  textAlign,
  showTooltip,
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
      display: 'flex',
      flexDirection: 'row',
      justifyContent: textAlign || 'center',
    },
  }));
  const classes = useStyles();

  return (
    <CtToolTip text={showTooltip || ''}>
      <div
        className={className}
        style={{
          ...style,
          opacity: disabled ? 0.5 : 1,
        }}
      >
        <Button
          size="small"
          className={classes.button}
          startIcon={icon}
          endIcon={endIcon}
          onClick={onClick}
          disabled={disabled}
        >
          <span style={{ color: colorText, marginLeft: 10, marginRight: 10 }}>
            {label}
          </span>
        </Button>
      </div>
    </CtToolTip>
  );
}
