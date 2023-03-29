/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable func-names */
import React, { useEffect, useState } from 'react';

import { IconCopy, IconEraser } from 'components/Custom/Icon/ListIcon';
import IconBtn from 'components/Custom/IconBtn';
import { convertTimeToMinute } from 'utils/utils';

const Daily = ({ dataDailyProps, callbackOfDaily }) => {
  const [dataDaily, setDataDaily] = useState(dataDailyProps || []);

  useEffect(() => {
    callbackOfDaily(dataDaily);
  }, [dataDaily]);

  useEffect(() => {
    if (dataDailyProps) {
      setDataDaily(dataDailyProps);
    }
  }, [dataDailyProps]);

  const onClickChoiceItem = (data, type) => {
    const foundDate = dataDaily.find((e) => e.value === type);
    if (foundDate) {
      const newTime = [...(foundDate?.times || []), data];
      setDataDaily([
        ...dataDaily.filter((e) => e.value !== type),
        { ...foundDate, times: newTime || [] },
      ]);
    }
  };

  const onClickDeleteItem = (date, time) => {
    const newTime = date.times.filter((i) => i.type !== time.type);
    setDataDaily([
      ...dataDaily.filter((e) => e.value !== date.value),
      { ...date, times: newTime || [] },
    ]);
  };

  const onClickIconClear = (item) => {
    const foundClearItem = dataDaily.find((e) => e.value === item.value);
    if (foundClearItem) {
      setDataDaily([
        ...dataDaily.filter((e) => e.value !== item.value),
        {
          label: foundClearItem.label,
          value: foundClearItem.value,
          StringValue: foundClearItem.StringValue,
        },
      ]);
    }
  };

  const onClickIconCopy = (item) => {
    const abc = dataDaily.sort(function (a, b) {
      return a.value - b.value;
    });
    const found = abc.find((e) => e.value === item.value - 1);
    const dto = {
      label: item.label,
      value: item.value,
      StringValue: item.StringValue,
      times: found.times || [],
    };
    setDataDaily([...abc.filter((e) => e.value !== item.value), dto]);
  };

  return (
    <div
      style={{
        width: '100%',
      }}
    >
      {dataDaily
        .sort(function (a, b) {
          return a.value - b.value;
        })
        .map((item, index) => {
          if (item.value === 1) {
            return (
              <div
                key={index.toString()}
                style={{
                  marginLeft: 93,
                  width: 'calc(100% - 150px)',
                  position: 'relative',
                  color: 'rgba(0, 0, 0, 0.6)',
                  fontSize: 14,
                }}
                className="ct-flex-row"
              >
                {['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'].map(
                  (a, b) => (
                    <div
                      key={b.toString()}
                      style={{
                        width: `${100 / 6}%`,
                      }}
                    >
                      {a}
                    </div>
                  ),
                )}
                <div
                  style={{
                    position: 'absolute',
                    right: -33,
                  }}
                >
                  24:00
                </div>
              </div>
            );
          }
          return (
            <div
              key={index.toString()}
              className="ct-flex-row"
              style={{
                width: '100%',
                marginTop: 6,
                fontSize: 14,
                fontWeight: 400,
                color: 'rgba(0, 0, 0, 0.6)',
              }}
            >
              <div style={{ minWidth: 80 }}>{item.label}</div>
              {index === 1 ? (
                <div style={{ width: 35 }} />
              ) : (
                <IconBtn
                  style={{ padding: 1, marginRight: 8, width: 22 }}
                  icon={<IconCopy />}
                  onClick={() => onClickIconCopy(item)}
                />
              )}
              <div
                className="ct-flex-row"
                style={{
                  width: '100%',
                  height: 36,
                  borderRadius: 4,
                  position: 'relative',
                  border: '1px solid rgba(0, 0, 0, 0.06)',
                  // justifyContent: 'space-around',
                }}
              >
                {[
                  {
                    end: 240,
                    start: 0,
                    type: 1,
                  },
                  {
                    end: 240 + 240,
                    start: 240,
                    type: 2,
                  },
                  {
                    end: 240 + 240 + 240,
                    start: 240 + 240,
                    type: 3,
                  },
                  {
                    end: 240 + 240 + 240 + 240,
                    start: 240 + 240 + 240,
                    type: 4,
                  },
                  {
                    end: 240 + 240 + 240 + 240 + 240,
                    start: 240 + 240 + 240 + 240,
                    type: 5,
                  },
                  {
                    end: 240 + 240 + 240 + 240 + 240 + 240,
                    start: 240 + 240 + 240 + 240 + 240,
                    type: 5,
                  },
                ].map((a, b) => (
                  <div
                    style={{
                      width: `${100 / 6}%`,
                      // backgroundColor: b === 1 || b === 2 ? '#7EBBFC' : '',
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      onClickChoiceItem(a, item.value);
                    }}
                    key={b.toString()}
                  >
                    <div
                      style={{
                        width: b === 0 ? 0 : 1,
                        height: 36,
                        backgroundColor: 'rgba(0, 0, 0, 0.12)',
                      }}
                    />
                  </div>
                ))}
                {item.times?.map((a, b) => (
                  <div
                    key={b.toString()}
                    onClick={() => {
                      onClickDeleteItem(item, a);
                    }}
                    style={{
                      position: 'absolute',
                      left: `${convertTimeToMinute(a.start)}%`,
                      height: 36,
                      background: '#7EBBFC',
                      // borderRadius: 4,
                      cursor: 'pointer',
                      opacity: 0.8,
                      width: `${convertTimeToMinute(a.end - a.start)}%`,
                    }}
                  />
                ))}
              </div>
              <IconBtn
                style={{ padding: 1, marginLeft: 16, width: 22 }}
                icon={<IconEraser />}
                onClick={() => onClickIconClear(item)}
              />
            </div>
          );
        })}
    </div>
  );
};

export default Daily;
