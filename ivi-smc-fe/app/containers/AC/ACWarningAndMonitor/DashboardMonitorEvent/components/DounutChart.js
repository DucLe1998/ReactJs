/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable jsx-a11y/mouse-events-have-key-events */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-unresolved */
import React, { useState } from 'react';
import { PieChart } from 'react-minimal-pie-chart';
import ReactTooltip from 'react-tooltip';
import './style.css';

const DounutChart = ({
  lineWidth = 25,
  hightAndWidth = 176,
  background = '',
  content = undefined,
  contentTooltip,
  dataChart = [],
  listColor = null,
  title,
  vertical,
  dataDetail,
}) => {
  const [hovered, setHovered] = useState(null);
  const listColorState = listColor || ['#4B67E2', '#E4E9FF', '#FE902D'];

  const data =
    dataChart && dataChart.length > 0
      ? dataChart?.map((e, index) => ({
          ...e,
          color: listColorState[index],
        }))
      : [
          {
            color: '#E4E9FF',
            title: 'Info 1',
            value: 20,
          },
          {
            color: '#4B67E2',
            title: 'Info 2',
            value: 80,
          },
        ];

  return (
    <div
      style={{
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        marginTop: title ? 10 : 30,
        color: '#11194C',
      }}
    >
      {title ? (
        <div
          style={{
            textAlign: 'center',
            marginBottom: 20,
            fontSize: 14,
            fontWeight: 500,
            color: '#11194C',
            width: '80%',
          }}
        >
          {title || ''}
        </div>
      ) : null}
      <div
        style={{ marginTop: 20, flexDirection: vertical ? 'row' : 'column' }}
        className="ct-flex-row"
      >
        <div
          style={{
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              height: hightAndWidth - lineWidth * 2 - 20,
              width: hightAndWidth - lineWidth * 2 - 20,
              top: lineWidth + 10,
              left: lineWidth + 10,
              borderRadius: '100%',
              backgroundColor: 'red',
              textAlign: 'center',
              background:
                background ||
                'linear-gradient(180deg, rgba(225, 228, 236, 0.12) 0%, rgba(226, 234, 255, 0.8) 100%)',
              justifyContent: 'center',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {(content && content()) || 'Tổng số'}
          </div>
          <div
            data-tip=""
            data-for="chart"
            style={{ height: hightAndWidth, width: hightAndWidth }}
          >
            <PieChart
              onMouseOver={(_, index) => setHovered(index)}
              onMouseOut={() => setHovered(null)}
              data={data}
              lineWidth={lineWidth}
              rounded
              animate
              startAngle={-90}
              totalValue={100}
              lengthAngle={360}
              // segmentsTabIndex={2}
            />
            <ReactTooltip
              id="chart"
              getContent={() =>
                typeof hovered === 'number' ? (
                  <div style={{ fontSize: 9, fontWeight: 400 }}>
                    {(contentTooltip && contentTooltip()) || (
                      <div style={{ textAlign: 'center' }}>
                        <div>{data[hovered]?.title}</div>
                        <div style={{ fontSize: 11, fontWeight: 500 }}>
                          {data[hovered]?.total || 0} |{' '}
                          {data[hovered]?.value || 0}%
                        </div>
                      </div>
                    )}
                  </div>
                ) : null
              }
            />
          </div>
        </div>

        <div
          style={{
            flexWrap: 'wrap',
            marginLeft: 20,
            marginTop: !vertical ? 10 : 0,
            fontSize: 12,
            fontWeight: 400,
          }}
          className={!vertical ? 'ct-flex-row' : ''}
        >
          {vertical ? (
            <div style={{ marginBottom: 10, fontWeight: 900 }}>
              Tổng số: {dataDetail?.total || 0}
            </div>
          ) : null}

          {data.map((item, index) => (
            <div
              style={{
                marginBottom: 15,
                marginTop: 15,
              }}
              className="ct-flex-row"
              key={index.toString()}
            >
              <div
                style={{
                  height: 8,
                  width: 8,
                  borderRadius: '100%',
                  backgroundColor: item.color,
                  marginRight: 8,
                }}
              />
              <div style={{ maxWidth: 84 }}>
                {item.title} :
                <span style={{ fontWeight: 900 }}>{item.total || 0}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DounutChart;
