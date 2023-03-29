import React from 'react';

const IconClock = ({ disabled }) => (
  <svg
    width="16"
    height="19"
    viewBox="0 0 16 19"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g opacity={disabled ? 0.3 : 0.6}>
      <path
        d="M7.9572 7.60283V11.1528M6.6 1.65283L9.47143 1.65283M13.4644 6.83287L14.6516 5.64569M14.8214 11.0743C14.8214 14.8219 11.7834 17.86 8.03571 17.86C4.28807 17.86 1.25 14.8219 1.25 11.0743C1.25 7.32661 4.28807 4.28854 8.03571 4.28854C11.7834 4.28854 14.8214 7.32661 14.8214 11.0743Z"
        stroke="black"
        strokeOpacity="0.48"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  </svg>
);

export default IconClock;
