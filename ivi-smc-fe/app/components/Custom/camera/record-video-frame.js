/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */

import moment from 'moment';
import { API_ROUTE } from '../../../containers/apiUrl';
import { callApiWithConfig } from '../../../utils/requestUtils';
import utils from '../../../utils/utils';

/* eslint-disable no-var */
var mediaRecorder;
var recordedBlobs;

function handleDataAvailable(event) {
  if (event.data && event.data.size > 0) {
    recordedBlobs.push(event.data);
  }
}

const StartRecording = broadcastId => {
  recordedBlobs = [];
  let options = { mimeType: 'video/webm;codecs=vp9,opus' };
  if (!MediaRecorder.isTypeSupported(options.mimeType)) {
    options = { mimeType: 'video/webm;codecs=vp8,opus' };
    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
      options = { mimeType: 'video/webm' };
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options = { mimeType: '' };
      }
    }
  }

  try {
    const videoTest = document.getElementById(broadcastId);
    const streamA = videoTest.captureStream();
    mediaRecorder = new MediaRecorder(streamA, options);
  } catch (e) {
    return;
  }

  mediaRecorder.ondataavailable = handleDataAvailable;
  mediaRecorder.start();
};

const StopRecording = callbackOnStop => {
  mediaRecorder.stop();
  mediaRecorder.onstop = () => {
    callbackOnStop && callbackOnStop(recordedBlobs);
  };
};

const StopRecordingTypePause = callbackOnStop => {
  mediaRecorder.stop();
  mediaRecorder.onstop = () => {};
};

const UploadVideo = async (e, broadcastId, callback) => {
  const blob = new Blob(e, { type: 'video/webm' });
  const formData = new FormData();
  formData.append(
    'file',
    blob,
    `record_${broadcastId}_${moment().format('HH:mm:ss-DD_MM_YYYY')}.webm`,
  );
  const res = await callApiWithConfig(
    `${API_ROUTE.UPLOAD_FILE}`,
    'POST',
    formData,
    {
      header: {
        'Content-Type': 'application/multipart/form-data; charset=UTF-8',
      },
    },
  );
  if (res && res.code === 200) {
    callback && callback();
    utils.showToast('Lưu thành công');
  }
};

function DownloadVideo() {
  const blob = new Blob(recordedBlobs, { type: 'video/webm;codecs=vp9,opus' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'testa.webm';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 100);
}

export { StopRecording, StartRecording, UploadVideo, StopRecordingTypePause };
