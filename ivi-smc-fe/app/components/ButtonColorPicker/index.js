import React, { useState } from 'react';
import { SketchPicker } from 'react-color';
import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles(() => ({
  color: {
    width: '36px',
    height: '14px',
    borderRadius: '2px',
  },
  swatch: {
    padding: '5px',
    background: '#fff',
    borderRadius: '1px',
    boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
    display: 'inline-block',
    cursor: 'pointer',
  },
  popover: {
    position: 'absolute',
    zIndex: '2',
  },
  cover: {
    position: 'fixed',
    top: '0px',
    right: '0px',
    bottom: '0px',
    left: '0px',
  },
}));
export default function ButtonColorPicker({ color, onChange }) {
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const classes = useStyles();
  function handleClick() {
    setDisplayColorPicker(!displayColorPicker);
  }
  function handleClose() {
    setDisplayColorPicker(false);
  }
  return (
    <div>
      <div
        className={classes.swatch}
        onClick={handleClick}
        onKeyPress={() => {}}
        role="presentation"
      >
        <div className={classes.color} style={{ backgroundColor: color }} />
      </div>
      {displayColorPicker ? (
        <div className={classes.popover}>
          <div
            className={classes.cover}
            onClick={handleClose}
            onKeyPress={() => {}}
            role="presentation"
          />
          <SketchPicker color={color} onChange={onChange} />
        </div>
      ) : null}
    </div>
  );
}
