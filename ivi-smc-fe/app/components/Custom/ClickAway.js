/* eslint-disable react/button-has-type */
import React from 'react';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

import './styles.css';

const ClickAway = ({
  onClose,
  viewBtn,
  open,
  width,
  children,
  style,
  noPadding,
}) => (
  <div>
    <ClickAwayListener onClickAway={() => onClose && onClose(false)}>
      <div style={{ position: 'relative' }}>
        {viewBtn}
        {open ? (
          <div
            style={
              style || {
                width: width || 100,
                top: 45,
                zIndex: 1,
                position: 'absolute',
                borderRadius: 10,
                backgroundColor: '#FFF',
                right: 0,
                padding: noPadding ? 0 : 8,
                boxShadow: '3px 3px 15px 0 rgba(0, 0, 0, 0.16)',
                overflow: 'hidden',
              }
            }
          >
            {children || 'children'}
          </div>
        ) : null}
      </div>
    </ClickAwayListener>
  </div>
);

export default ClickAway;
