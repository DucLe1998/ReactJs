/* eslint-disable no-lonely-if */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-var */
/* eslint-disable prefer-const */
import React, { useState, useEffect } from 'react';

import { URL_LIVE_STREAM_DETAIL } from '../../../containers/apiUrl';
import ViewCaptureCamera from './ViewCaptureCamera';
import CaptureVideo from './capture-video-frame';
import { WebRTCAdaptor } from './js/webrtc_adaptor';
import { tryToPlay } from './js/fetch.stream';
import './css/external/video-js.css';
import './styles.css';
import ViewVideo from './ViewVideo';
import {
  StartRecording,
  StopRecording,
  StopRecordingTypePause,
  UploadVideo,
} from './record-video-frame';
import ViewRecording from './ViewRecording';
import LoadingIcon from '../LoadingIcon';

const defTxtVideoInfo = 'Luồng sẽ tự động bắt đầu khi nó được phát trực tiếp!';

const LiveStream = ({
  broadcastId,
  token,
  disabledActionRecord,
  callbackWhenUnauthorized,
  showControl,
  screen,
  loadingCallback,
  dataItem,
  timeFilter,
  onChangeCurTimePlayback,
  isScreen,
  defaultValueRange = 0,
}) => {
  const [showCaptureImage, setShowCaptureImage] = useState(false);
  const [imageCapture, setImageCapture] = useState('');
  const [loadingCutVideo, setLoadingCutVideo] = useState(false);
  const [loadingCamera, setLoadingCamera] = useState(false);
  const [stopAndStartRecord, setStopAndStartRecord] = useState(false);
  const [txtVideoInfo, setTxtVideoInfo] = useState('');

  let webRTCAdaptor = null;
  let mute = true;
  let playOrder = ['webrtc'];
  let autoPlay = true;

  // const urlStreamIp = dataItem?.information?.broadcast?.streamIp || '';

  const genericCallback = currentTech => {
    setTimeout(() => {
      let index = playOrder.indexOf(currentTech);
      if (index == -1 || index == playOrder.length - 1) {
        index = 0;
      } else {
        index++;
      }

      let tech = playOrder[index];

      if (tech == 'webrtc' && broadcastId) {
        // It means there is no HLS stream, so try to play WebRTC stream
        if (webRTCAdaptor == null) {
          initializeWebRTCPlayer(broadcastId, token, webrtcNoStreamCallback);
        } else {
          webRTCAdaptor.getStreamInfo(broadcastId);
        }
      }
    }, 3000);
  };

  const webrtcNoStreamCallback = () => {
    genericCallback('webrtc');
  };

  useEffect(() => {
    if (token && broadcastId) {
      initializeWebRTCPlayer(
        broadcastId,
        token?.tokenId || '',
        webrtcNoStreamCallback,
      );
    } else {
      if (!token) {
        setTxtVideoInfo('Token xem camera lỗi. F5 để thử lại');
      }
      if (!broadcastId) {
        setTxtVideoInfo('Camera không hoạt động!');
      }
    }
  }, [token, broadcastId]);

  const setWebRTCElementsVisibility = show => {
    const videoId = document.getElementById(broadcastId);
    videoId.style.display = show == true ? 'block' : 'none';
  };

  // const setPlaceHolderVisibility = show => {
  // const placeHolder = document.getElementById('video_info');
  // placeHolder.style.display = show == true ? 'block' : 'none';
  // };

  function playWebRTCVideo() {
    const videoId = document.getElementById(broadcastId);
    if (mute) {
      videoId.muted = true;
    } else {
      videoId.muted = false;
    }
    if (autoPlay) {
      document
        .getElementById(broadcastId)
        .play()
        .then(() => {})
        .catch(() => {});
    }
  }

  const initializeWebRTCPlayer = (streamId, token, noStreamCallback) => {
    const pcConfig = {
      iceServers: [
        {
          urls: 'stun:stun1.l.google.com:19302',
        },
      ],
    };

    // const placeHolder = document.getElementById('video_info');
    // console.log('begin -------------------------->');
    let websocketURL;
    // placeHolder.innerHTML = 'begin';
    loadingCallback && loadingCallback(true);
    setLoadingCamera(true);
    setTxtVideoInfo(defTxtVideoInfo);
    const sdpConstraints = {
      OfferToReceiveAudio: true,
      OfferToReceiveVideo: true,
    };
    const mediaConstraints = {
      video: false,
      audio: false,
    };
    const path = URL_LIVE_STREAM_DETAIL;
    websocketURL = `wss://${path}`;

    // eslint-disable-next-line no-restricted-globals
    if (location.protocol.startsWith('https')) {
      websocketURL = `wss://${path}`;
    }

    webRTCAdaptor = new WebRTCAdaptor({
      websocket_url: websocketURL,
      mediaConstraints,
      peerconnection_config: pcConfig,
      sdp_constraints: sdpConstraints,
      remoteVideoId: streamId,
      isPlayMode: true,
      debug: true,
      callback: (info, description) => {
        if (info == 'initialized') {
          webRTCAdaptor.getStreamInfo(streamId);
        } else if (info == 'streamInformation') {
          webRTCAdaptor.play(streamId, token);
        } else if (info == 'play_started') {
          // console.log('play_started------>', info);
          loadingCallback && loadingCallback(false);
          setWebRTCElementsVisibility(true);
          // setPlaceHolderVisibility(false);
          setLoadingCamera(false);
          setTxtVideoInfo('');
          // placeHolder.innerHTML = '';
          playWebRTCVideo();
        } else if (info == 'play_finished') {
          // console.log('play_finished------>', info);
          loadingCallback && loadingCallback(false);
          setWebRTCElementsVisibility(false);
          setLoadingCamera(false);
          setTxtVideoInfo('');
          // setPlaceHolderVisibility(true);
          setTimeout(() => {
            webRTCAdaptor.getStreamInfo(streamId);
          }, 3000);
        } else if (info == 'closed') {
          if (typeof description != 'undefined') {
            // console.log(`Connecton closed: ${JSON.stringify(description)}`);
          }
        } else if (info == 'bitrateMeasurement') {
          // console.log('description', description);
        }
      },
      callbackError: error => {
        const checkScreen = window.location.pathname.search(screen);
        // console.log(`error callback: ${JSON.stringify(error)}`);
        if (checkScreen === -1) {
          webRTCAdaptor.closePeerConnection(streamId);
          webRTCAdaptor.closeWebSocket();
          return;
        }
        if (error == 'no_stream_exist') {
          if (typeof noStreamCallback != 'undefined') {
            if (streamId && token) {
              noStreamCallback();
            } else {
              loadingCallback && loadingCallback(false);
              setLoadingCamera(false);
              setTxtVideoInfo(defTxtVideoInfo);
              webRTCAdaptor.closeWebSocket();
            }
          }
        }
        if (error == 'notSetRemoteDescription') {
          if (streamId && token) {
            tryToPlay(streamId, token);
          }
        }
        if (error == 'unauthorized_access') {
          callbackWhenUnauthorized && callbackWhenUnauthorized(broadcastId);
        }
      },
    });
  };

  const onClickCut = t => {
    if (t === 'pause') {
      StopRecordingTypePause();
      setStopAndStartRecord(false);
    } else {
      if (!stopAndStartRecord) {
        setStopAndStartRecord(true);
        StartRecording(broadcastId);
      } else {
        setLoadingCutVideo(true);
        StopRecording(e => {
          setStopAndStartRecord(false);
          UploadVideo(e, broadcastId, () => {
            setLoadingCutVideo(false);
          });
        });
      }
    }
  };

  const onClickCapture = () => {
    const videoTest = document.getElementById(broadcastId);
    const frame = CaptureVideo(videoTest, 'png');
    if (frame) {
      setShowCaptureImage(true);
      setImageCapture(frame);
    }
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
      }}
    >
      <div style={styles.video_info} id="video_info">
        <div
          style={{
            width: '100%',
          }}
        >
          {txtVideoInfo}
        </div>
      </div>

      {loadingCamera && broadcastId && (
        <div className="view-loading-open-camera">
          <LoadingIcon />
        </div>
      )}

      <ViewVideo
        loadingCutVideo={loadingCutVideo}
        broadcastId={broadcastId}
        showControl={showControl}
        onClickCapture={onClickCapture}
        onClickCut={onClickCut}
        disabledActionRecord={disabledActionRecord}
        showCaptureImage={showCaptureImage}
        stopAndStartRecord={stopAndStartRecord}
        timeFilter={timeFilter}
        isScreen={isScreen}
        onChangeCurTimePlayback={onChangeCurTimePlayback}
        defaultValueRange={defaultValueRange}
      />

      <ViewRecording
        stopAndStartRecord={stopAndStartRecord}
        loadingCutVideo={loadingCutVideo}
        onClickCut={onClickCut}
      />

      {showCaptureImage && (
        <ViewCaptureCamera
          dataImage={imageCapture}
          dataItem={dataItem}
          onClose={() => setShowCaptureImage(false)}
        />
      )}
    </div>
  );
};

const styles = {
  video_info: {
    position: 'absolute',
    color: '#fff',
    justifyContent: 'center',
    display: 'flex',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    textAlign: 'center',
    fontSize: 14,
  },
};

export default LiveStream;
