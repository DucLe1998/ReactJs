import React from 'react';

const IconUpload = ({ disabled }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g opacity={disabled ? 0.2 : 0.48}>
      <path
        d="M19 12.824V16.824C19 17.3544 18.7893 17.8631 18.4142 18.2382C18.0391 18.6133 17.5304 18.824 17 18.824H3C2.46957 18.824 1.96086 18.6133 1.58579 18.2382C1.21071 17.8631 1 17.3544 1 16.824V12.824"
        stroke="black"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 6.1626L10 1.044L15 6.1626"
        stroke="black"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 1.04398V13.3286"
        stroke="black"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  </svg>
);

export default IconUpload;
