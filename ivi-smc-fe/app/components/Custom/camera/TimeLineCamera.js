/* eslint-disable no-unused-expressions */
/* eslint-disable radix */
import React, { useEffect, useState } from 'react';
import moment from 'moment';

import utils from '../../../utils/utils';
import './styles.css';
import useDebounce from '../useDebounce';

const TimeLineCamera = ({
  timeFilter,
  onChangeCurTimePlayback,
  checkClickWatchBack,
  play,
  callbackActions,
}) => {
  const [valueRange, setValue] = useState(0);
  const debouncedSearch = useDebounce(valueRange, 700);

  // console.log('timeFilter', timeFilter);
  useEffect(
    () =>
      onChangeCurTimePlayback(
        valueRange === 0
          ? 0
          : timeFilter.start_time + parseInt(debouncedSearch),
      ),
    [debouncedSearch],
  );

  useEffect(() => {
    callbackActions && callbackActions(valueRange, play);
  }, [play]);

  useEffect(() => {
    if (checkClickWatchBack > 0) {
      onChangeRange(0);
    }
  }, [checkClickWatchBack]);

  if (!timeFilter) return <div className="view-hover-open-time-line" />;

  const aaa = timeFilter.end_time - timeFilter.start_time;
  const bbb = aaa / 12;

  const onChangeRange = v => {
    setValue(v);
    // console.log('v', v);
    const rangeBullet = document.getElementById('rs-bullet');
    const rangeSlider = document.getElementById('myRange');
    const bulletPosition = (v / rangeSlider.max) * 100;
    rangeBullet.style.left = `${bulletPosition}%`;
  };

  return (
    <div className="view-hover-open-time-line">
      <div className="slidecontainer2">
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexWrap: 'wrap',
          }}
        >
          {utils
            .createFakeData(12)
            .list.map((it, id) => ({
              time: timeFilter.start_time + id * bbb,
            }))
            .map((item, index) => (
              <div
                style={{
                  width: `calc(${100 / 12}%)`,
                  position: 'relative',
                }}
                key={index.toString()}
              >
                {index === 0 && (
                  <div
                    style={{
                      position: 'absolute',
                      top: -20,
                      fontSize: 14,
                      color: '#FFF',
                      fontWeight: 400,
                    }}
                  >
                    00:00
                  </div>
                )}
                {index !== 0 && (
                  <div
                    style={{
                      position: 'absolute',
                      top: -20,
                      fontSize: 14,
                      color: '#FFF',
                      fontWeight: 400,
                      left: -16,
                    }}
                  >
                    {moment(item.time).format('HH:mm')}
                  </div>
                )}
                {index === 11 && (
                  <div
                    style={{
                      position: 'absolute',
                      top: -20,
                      fontSize: 14,
                      color: '#FFF',
                      fontWeight: 400,
                      right: 2,
                    }}
                  >
                    {moment(timeFilter.end_time).format('HH:mm')}
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
      <div className="slidecontainer">
        <div id="rs-bullet" className="rs-label">
          {valueRange === 0
            ? '00:00:00'
            : moment(
                parseInt(timeFilter.start_time) + parseInt(valueRange),
              ).format('HH:mm:ss')}
        </div>
        <input
          type="range"
          min="0"
          max={aaa}
          value={valueRange}
          onChange={v => onChangeRange(v.target.value)}
          className="slider1"
          id="myRange"
        />
      </div>
    </div>
  );
};

export default TimeLineCamera;
