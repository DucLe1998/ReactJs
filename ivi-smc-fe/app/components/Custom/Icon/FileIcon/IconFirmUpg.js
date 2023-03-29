import React from 'react';

const IconFirmUpg = ({ disabled }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g opacity={disabled ? 0.5 : 1}>
      <path
        d="M19 12.8242V16.8242C19 17.3547 18.7893 17.8634 18.4142 18.2384C18.0391 18.6135 17.5304 18.8242 17 18.8242H3C2.46957 18.8242 1.96086 18.6135 1.58579 18.2384C1.21071 17.8634 1 17.3547 1 16.8242V12.8242"
        stroke="#117B5B"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 6.16309L10 1.04449L15 6.16309"
        stroke="#117B5B"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 1.04447V13.3291"
        stroke="#117B5B"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  </svg>
);

export default IconFirmUpg;
