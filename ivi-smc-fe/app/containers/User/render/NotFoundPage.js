import React from 'react';
import NotFoundImage from 'images/NotFound.svg';

export const NotFoundPage = () => (
  <div
    style={{
      height: 'calc(70vh - 250px)',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
    }}
  >
    <div
      style={{
        position: 'relative',
        top: '50%',
        transform: 'translateY(-50%)',
        alignSelf: 'baseline',
      }}
    >
      <img alt="edit" src={NotFoundImage} />
      <p>Không có dữ liệu</p>
    </div>
  </div>
);
