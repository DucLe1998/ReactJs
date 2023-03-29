/* eslint-disable radix */
/* eslint-disable no-unused-expressions */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-return-assign */
import React, { useEffect, useState } from 'react';
import { BsCaretLeftFill, BsPauseFill, BsPlayFill } from 'react-icons/bs';

import IconBtn from '../IconBtn';
import { IconCamera, IconRecord } from '../Icon/ListIcon';
import ViewCaptureCamera from './ViewCaptureCamera';
import CaptureVideo from './capture-video-frame';
import TimeLineCamera from './TimeLineCamera';

// const watchBackTime = 60 * 1000;

const ControlVideo = ({
  itemCamera,
  onClickCut,
  timeFilter,
  onChangeCurTimePlayback,
  curTimePlayback,
  stopAndStartRecord,
}) => {
  // const [itemChoice, setItemChoice] = useState(1);
  const [play, setPlay] = useState(true);
  const [showCaptureImage, setShowCaptureImage] = useState(false);
  const [imageCapture, setImageCapture] = useState('');
  const [checkClickWatchBack, setCheckClickWatchBack] = useState(0);

  const [curTimeLine, setCurTimeLine] = useState(0);

  const broadcastId = itemCamera?.information?.broadcast?.dataId || '';
  const videoId = document.getElementById(broadcastId);

  useEffect(() => {
    if (videoId) {
      if (videoId.paused || videoId.ended) {
        setPlay(false);
      } else {
        setPlay(true);
      }
    }
    return () => setPlay(true);
  }, [videoId]);

  const onClickPlay = v => {
    setPlay(v);
    if (videoId) {
      if (!v) {
        console.log('vao day k the ? ---------- pause');
        videoId.pause();
        if (stopAndStartRecord) {
          onClickCut(broadcastId, 'pause');
        }
      } else {
        console.log('vao day k the ? ---------- play');

        if (timeFilter) {
          onChangeCurTimePlayback(
            timeFilter.start_time + parseInt(curTimeLine) - 6000,
          );
        }
        videoId.play();
      }
    }
  };

  const callbackActions = value => {
    setCurTimeLine(value);
  };

  const onClickWatchBack = () => {
    // if (curTimePlayback + watchBackTime > timeFilter.start_time) {
    // const abc = curTimePlayback - watchBackTime;
    onChangeCurTimePlayback(timeFilter.start_time);
    setCheckClickWatchBack(checkClickWatchBack + 1);
    // }
  };

  const onClickCapture = () => {
    const frame = CaptureVideo(videoId, 'png');
    if (frame) {
      setShowCaptureImage(true);
      setImageCapture(frame);
    }
  };

  return (
    <>
      <TimeLineCamera
        onChangeCurTimePlayback={onChangeCurTimePlayback}
        timeFilter={timeFilter}
        curTimePlayback={curTimePlayback}
        broadcastId={broadcastId}
        checkClickWatchBack={checkClickWatchBack}
        play={play}
        callbackActions={callbackActions}
      />
      <div
        className="ct-flex-row"
        style={{
          height: 40,
          width: '100%',
          backgroundColor: '#000',
          justifyContent: 'space-between',
          padding: '0 16px 0 20px',
        }}
      >
        <div className="ct-flex-row">
          <>
            {/* <IconBtn
              // disabled
              onClick={() => onClickPreOrNext('pre', itemCamera)}
              icon={<IconPre />}
            /> */}
            <IconBtn
              onClick={onClickWatchBack}
              icon={<BsCaretLeftFill color="#FFF" />}
            />
            <IconBtn
              onClick={() => onClickPlay(!play)}
              style={{ padding: 5, margin: '0 8px 0 8px' }}
              // disabled={!videoId}
              icon={
                play ? (
                  <BsPauseFill size="1.2em" color="#FFF" />
                ) : (
                  <BsPlayFill size="1.2em" color="#FFF" />
                )
              }
            />
            {/* <IconBtn
              // disabled
              onClick={() => onClickPreOrNext('next', itemCamera)}
              icon={<IconNext />}
            /> */}
          </>
        </div>
        <div className="ct-flex-row">
          <IconBtn
            onClick={onClickCapture}
            disabled={!videoId}
            icon={<IconCamera />}
          />
          <IconBtn
            disabled={!videoId}
            onClick={() => onClickCut && onClickCut(broadcastId)}
            icon={<IconRecord />}
          />
          {/* <div style={{ opacity: timeFilter ? 1 : 0.5 }}>
            {timeFilter ? (
              <ViewFastForward
                callback={v => onClickItem(v)}
                itemChoice={itemChoice}
              />
            ) : (
              <IconBtn
                showTooltip="Chọn thời gian để có thể chọn tốc độ"
                icon={<div className="ct-txt-btn">x1</div>}
              />
            )}
          </div> */}
        </div>
      </div>
      {showCaptureImage && (
        <ViewCaptureCamera
          dataImage={imageCapture}
          onClose={() => setShowCaptureImage(false)}
          bottom={90}
          right={20}
          dataItem={itemCamera}
        />
      )}
    </>
  );
};

export default ControlVideo;
