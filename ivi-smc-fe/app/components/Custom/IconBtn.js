import React from 'react';
import { IconButton } from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';

const IconBtn = ({
  icon,
  onClick,
  size = 'small',
  style,
  disabled,
  showTooltip,
  className,
}) => (
  <Tooltip title={showTooltip || ''}>
    <div style={{ opacity: disabled ? 0.5 : 1 }}>
      <IconButton
        className={className}
        size={size}
        style={style || { padding: 3, marginLeft: 1, marginRight: 1 }}
        onClick={onClick}
        disabled={disabled || false}
      >
        {icon}
      </IconButton>
    </div>
  </Tooltip>
);

export default IconBtn;
