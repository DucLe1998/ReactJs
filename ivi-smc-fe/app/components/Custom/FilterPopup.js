/* eslint-disable react/button-has-type */
import React from 'react';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

import './styles.css';

const FilterPopup = ({ onClose, viewBtn, open, width, children, style }) => (
  <div>
    <ClickAwayListener onClickAway={() => onClose && onClose(false)}>
      <div style={{ position: 'relative' }}>
        {viewBtn}
        {open ? (
          <div
            style={
              style || {
                width: width || 200,
                top: 45,
                zIndex: 1,
                position: 'absolute',
                borderRadius: 10,
                backgroundColor: '#FFF',
                right: 0,
                padding: 8,
                boxShadow: '3px 3px 15px 0 rgba(0, 0, 0, 0.16)',
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

export default FilterPopup;
