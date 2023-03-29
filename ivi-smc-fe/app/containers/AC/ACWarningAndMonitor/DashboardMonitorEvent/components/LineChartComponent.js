/* eslint-disable import/no-unresolved */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable no-unsafe-optional-chaining */
import React from 'react';
import {
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  ComposedChart,
} from 'recharts';
import gui from 'utils/gui';

function per(num, amount) {
  if (num === 0) {
    return 0;
  }
  const newData = (amount / num) * 100;
  return newData?.toFixed(0) || 0;
}

export default function LineChartComponent({
  listLine = [
    {
      label: 'Định danh khuôn mặt',
      color: '#4B67E2',
      dataKey: 'line1',
    },
    {
      label: 'Định danh vân tay',
      color: '#D3DBFF',
      dataKey: 'line2',
    },
    {
      label: 'Định danh thẻ',
      color: '#19D085',
      dataKey: 'line3',
    },
    {
      label: 'Số lượng cảnh báo',
      color: '#F98B21',
      dataKey: 'line4',
    },
  ],
  dataChart = data,
}) {
  return (
    <div>
      <ResponsiveContainer width="100%" height={gui.screenHeight / 3.2}>
        <ComposedChart
          width={200}
          height={60}
          data={dataChart}
          margin={{
            top: 20,
            right: 10,
            left: 0,
            bottom: 5,
          }}
        >
          <Bar
            // barSize={(timeType === 'WEEK' && 40) || null}
            barSize={40}
            dataKey="line1"
            stackId="a"
            fill="#4B67E2"
          />
          <Bar
            barSize={40}
            // barSize={(timeType === 'WEEK' && 40) || null}
            dataKey="line3"
            stackId="a"
            fill="#19D085"
          />
          <Bar
            barSize={40}
            // barSize={(timeType === 'WEEK' && 40) || null}
            dataKey="line2"
            stackId="a"
            fill="#D3DBFF"
          />

          <Line
            dataKey="line4" // value
            stroke="#F98B21"
            fill="#F98B21"
          />
          <XAxis
            stroke="#A3AED0"
            dataKey="name"
            tickLine={false}
            axisLine={false}
            dy={12}
          />
          <YAxis
            tickCount={5}
            dx={-20}
            stroke="#A3AED0"
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active) {
                return (
                  <div
                    style={{
                      borderRadius: 12,
                      backgroundColor: '#404040',
                      padding: '7px 10px 7px 10px',
                      boxShadow: '0px 12px 14px rgba(32, 30, 66, 0.506567)',
                      fontSize: 10,
                      width: 200,
                    }}
                  >
                    {payload?.map((item, index) => {
                      const found = listLine.find(
                        (i) => i.dataKey === item.dataKey,
                      );
                      const totalValue =
                        payload[0]?.value +
                        payload[1]?.value +
                        payload[2]?.value +
                        payload[3]?.value;
                      return (
                        <div
                          key={index.toString()}
                          style={{
                            color: found?.color,
                            marginTop: 2,
                            marginBottom: 2,
                            justifyContent: 'space-between',
                          }}
                          className="ct-flex-row"
                        >
                          <div className="ct-flex-row">
                            <div
                              style={{
                                width: 6,
                                height: 6,
                                borderRadius: 1,
                                backgroundColor: found?.color,
                                marginRight: 8,
                              }}
                            />
                            <div>{found.label}: </div>
                          </div>

                          <div>
                            {item?.value} | {per(totalValue, item.value) || 0}%
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              }
              return null;
            }}
          />
          <CartesianGrid stroke="#5E81F4" opacity={0.1} vertical={false} />
        </ComposedChart>
      </ResponsiveContainer>
      <div
        className="ct-flex-row"
        style={{ fontSize: 12, fontWeight: 400, marginTop: 15, marginLeft: 40 }}
      >
        {listLine.map((item, index) => (
          <div
            key={index.toString()}
            className="ct-flex-row"
            style={{ marginRight: 20, color: '#000000' }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                backgroundColor: item.color,
                marginRight: 8,
                borderRadius: 4,
              }}
            />
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
}

const data = [
  {
    name: 'Page A',
    line1: 0,
    line2: 0,
    line3: 0,
    line4: 0,
  },
  {
    name: 'Page B',
    line1: 0,
    line2: 0,
    line3: 0,
    line4: 0,
  },
  {
    name: 'Page C',
    line1: 0,
    line2: 0,
    line3: 0,
    line4: 0,
  },
  {
    name: 'Page D',
    line1: 0,
    line2: 0,
    line3: 0,
    line4: 0,
  },
  {
    name: 'Page E',
    line1: 0,
    line2: 0,
    line3: 0,
    line4: 0,
  },
  {
    name: 'Page F',
    line1: 0,
    line2: 0,
    line3: 0,
    line4: 0,
  },
  {
    name: 'Page G',
    line1: 0,
    line2: 0,
    line3: 0,
    line4: 0,
  },
];
