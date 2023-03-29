/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-expressions */
/* eslint-disable radix */
/* eslint-disable no-undef */
/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable react/button-has-type */
import React, { useEffect, useState } from 'react';
import {
  BsCaretLeftFill,
  BsFullscreen,
  BsPauseFill,
  BsPlayFill,
} from 'react-icons/bs';
// import moment from 'moment';

import { IconCamera, IconRecord } from '../Icon/ListIcon';
import IconBtn from '../IconBtn';
import './styles.css';
import useDebounce from '../useDebounce';
import { msToTime } from '../../../utils/utils';

function formatTime(timeInSeconds) {
  const result = new Date(timeInSeconds * 1000).toTimeString().substr(0, 8);
  return result;
}

const ViewVideo = ({
  broadcastId,
  onClickCapture,
  onClickCut,
  showControl,
  disabledActionRecord,
  isScreen,
  showCaptureImage,
  stopAndStartRecord,
  timeFilter,
  onChangeCurTimePlayback,
  defaultValueRange,
}) => {
  const [play, setPlay] = useState(true);
  const [fullScreen, setFullScreen] = useState(false);
  const [valueRange, setValueRange] = useState(0);
  const debouncedSearch = useDebounce(valueRange, 700);

  // const [timePause, setTimePause] = useState(0);

  const aaa = timeFilter && timeFilter.end_time - timeFilter.start_time;

  useEffect(() => fetchData(), [debouncedSearch]);

  useEffect(() => {
    const video = document.getElementById(broadcastId);
    if (video) {
      video.addEventListener('timeupdate', updateTimeElapsed);
    }
  }, [broadcastId]);

  useEffect(() => {
    if (fullScreen && (showCaptureImage || stopAndStartRecord)) {
      toggleFullScreen();
    }
  }, [showCaptureImage, stopAndStartRecord]);

  useEffect(() => {
    if (defaultValueRange !== 0) {
      onChangeRange(defaultValueRange);
    }
  }, [defaultValueRange]);

  const updateTimeElapsed = () => {
    const video = document.getElementById(broadcastId);
    if (showControl && !disabledActionRecord && video) {
      const timeElapsed = document.getElementById('time-elapsed');

      const time = formatTime(
        (timeFilter
          ? msToTime(timeFilter.start_time + parseInt(valueRange))
          : 0) + Math.round(video.currentTime),
      );

      if (timeElapsed) {
        timeElapsed.innerText = `${time}`;
      }
    }
  };

  const toggleFullScreen = () => {
    setFullScreen(!fullScreen);
    const videoContainer = document.getElementById('video-container');
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else if (document.webkitFullscreenElement) {
      // Need this to support Safari
      document.webkitExitFullscreen();
    } else if (videoContainer.webkitRequestFullscreen) {
      // Need this to support Safari
      videoContainer.webkitRequestFullscreen();
    } else {
      videoContainer.requestFullscreen();
    }
  };

  const onClickPlay = v => {
    const videoId = document.getElementById(broadcastId);
    setPlay(v);
    if (videoId) {
      if (!v) {
        videoId.pause();
        if (stopAndStartRecord) {
          onClickCut('pause');
        }
      } else {
        if (isScreen && isScreen === 'detail' && onChangeCurTimePlayback) {
          const acb = timeFilter.start_time + parseInt(valueRange) - 6000;
          onChangeCurTimePlayback(acb);
        }
        videoId.play();
      }
    }
  };

  const fetchData = () => {
    if (timeFilter && valueRange) {
      onChangeCurTimePlayback &&
        onChangeCurTimePlayback(
          timeFilter.start_time + parseInt(debouncedSearch),
        );
    }
  };

  const onChangeRange = v => {
    setValueRange(v);

    const rangeSlider = document.getElementById('myRange');
    const bulletPosition =
      ((v - rangeSlider.min) / (rangeSlider.max - rangeSlider.min)) * 100;
    rangeSlider.style.background = `linear-gradient(to right, #FF0000 0%, #FF0000 ${bulletPosition}%, #fff ${bulletPosition}%, white 100%)`;
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
      }}
      id="video-container"
    >
      <video
        id={broadcastId}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
        }}
        controls={false}
        playsInline
      />
      {showControl && (
        <div className="video-controls">
          {timeFilter && (
            <div
              style={{
                width: '100%',
              }}
            >
              <div className="slidecontainer-2">
                <input
                  type="range"
                  min="0"
                  max={aaa}
                  value={valueRange}
                  onChange={v => onChangeRange(v.target.value)}
                  className="slider-2"
                  id="myRange"
                />
              </div>
            </div>
          )}

          <div className="bottom-controls">
            {disabledActionRecord ? (
              <div />
            ) : (
              <div className="left-controls">
                {/* <IconBtn disabled style={{ padding: 5 }} icon={<IconPre />} /> */}
                {timeFilter && (
                  <IconBtn
                    style={{ padding: 5, margin: '0 0 0 8px' }}
                    icon={<BsCaretLeftFill color="#FFF" />}
                    onClick={() => {
                      onChangeRange(1);
                    }}
                  />
                )}

                {timeFilter && (
                  <IconBtn
                    onClick={() => onClickPlay(!play)}
                    style={{ padding: 5, margin: '0 8px 0 8px' }}
                    icon={
                      play ? (
                        <BsPauseFill size="1.2em" color="#FFF" />
                      ) : (
                        <BsPlayFill size="1.2em" color="#FFF" />
                      )
                    }
                  />
                )}

                {/* <IconBtn disabled style={{ padding: 5 }} icon={<IconNext />} /> */}

                {timeFilter && (
                  <div style={{ marginLeft: 10 }} className="time">
                    <time id="time-elapsed">00:00:00</time>
                    <span>
                      {timeFilter &&
                        `/${formatTime(msToTime(timeFilter.end_time))}`}
                    </span>
                  </div>
                )}
              </div>
            )}

            <div className="right-controls">
              <IconBtn
                style={{ padding: 5 }}
                onClick={onClickCapture}
                icon={<IconCamera />}
              />
              {!disabledActionRecord && timeFilter && (
                <IconBtn
                  onClick={onClickCut}
                  disabled={stopAndStartRecord}
                  style={{ padding: 5, marginLeft: 16 }}
                  icon={<IconRecord />}
                />
              )}
              <IconBtn
                onClick={toggleFullScreen}
                style={{ padding: 5, marginLeft: 16 }}
                icon={<BsFullscreen color="#FFF" />}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewVideo;
