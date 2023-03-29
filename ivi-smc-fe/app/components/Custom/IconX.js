/* eslint-disable react/prop-types,no-param-reassign,no-unused-expressions,no-dupe-keys */
import React from 'react';
import { IconTime } from './Icon/ListIcon';
import IconBtn from './IconBtn';

const IconX = ({ onClick, style, padding }) => (
  <div
    style={
      style || {
        position: 'absolute',
        top: 6,
        right: 6,
      }
    }
  >
    <IconBtn
      onClick={onClick}
      style={{ padding: padding || 6 }}
      icon={<IconTime />}
    />
  </div>
);

export default IconX;
