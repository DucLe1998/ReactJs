/* eslint-disable jsx-a11y/mouse-events-have-key-events */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-unresolved */
import React, { useState } from 'react';
import {
  IconFingerDashboardEvent,
  IconFaceDashboardEvent,
  IconCardDashboardEvent,
} from 'components/Custom/Icon/ListIcon';

import './style.css';

const ViewListIdentity = ({ dataChart = [] }) => {
  const listIcon = [
    <IconFingerDashboardEvent />,
    <IconFaceDashboardEvent />,
    <IconCardDashboardEvent />,
  ];
  const data =
    dataChart && dataChart.length > 0
      ? dataChart?.map((e, index) => ({
          ...e,
          icon: listIcon[index],
        }))
      : [
          {
            title: 'Vân tay',
            value: 202,
            per: 20,
            icon: <IconFingerDashboardEvent />,
          },
          {
            title: 'Khuôn mặt',
            value: 700,
            per: 70,
            icon: <IconFaceDashboardEvent />,
          },
          {
            title: 'Thẻ',
            value: 102,
            per: 10,
            icon: <IconCardDashboardEvent />,
          },
        ];

  return (
    <div
      style={{
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        marginTop: 10,
        color: '#11194C',
        height: '100%',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          marginBottom: 20,
          fontSize: 12,
          fontWeight: 400,
          width: '80%',
          opacity: 0.68,
        }}
      >
        Số người đã định danh theo loại định danh
      </div>
      <div
        style={{
          color: '#11194C',
        }}
      >
        {data.map((item, index) => (
          <div
            key={index.toString()}
            className="ct-flex-row"
            style={{
              border: '1.5px solid rgba(75, 103, 226, 0.2)',
              padding: '6px 16px 6px 16px',
              borderRadius: 8,
              marginBottom: 8,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '100%',
                justifyContent: 'center',
                backgroundColor: '#EFF2FF',
                marginRight: 13,
              }}
              className="ct-flex-row"
            >
              {item.icon}
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div
                style={{
                  opacity: 0.68,
                  fontSize: 12,
                  fontWeight: 400,
                }}
              >
                {item.title}
              </div>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 500,
                }}
              >
                {item.value} | {item.per}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewListIdentity;
