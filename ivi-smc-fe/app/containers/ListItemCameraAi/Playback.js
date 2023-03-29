import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import PlayBack from 'containers/ListUserCameraAi/items/Playback';
import { ACTION } from '../ListUserCameraAi/constants';
import { showError } from '../../utils/toast-utils';
import { callApi, METHODS } from '../../utils/requestUtils';
import { DEVICE_API_SRC } from '../apiUrl';

export default function Playback() {
  const [device, setDevice] = useState(null);
  const history = useHistory();
  const { action, deviceId, timeOccur } = useParams();
  const fetchDetailDevice = async () => {
    try {
      const response = await callApi(
        `${DEVICE_API_SRC}/devices/${deviceId}`,
        METHODS.GET,
      );
      setDevice({
        ...response.data,
        action: action
          ? action === 'playback'
            ? ACTION.PLAYBACK
            : ACTION.LIVE
          : '',
        deviceId: +deviceId,
        deviceName: response.data?.name,
        timeOccur: +timeOccur,
      });
    } catch (error) {
      showError(error);
    }
  };
  useEffect(() => {
    if (deviceId && action) fetchDetailDevice();
  }, [deviceId]);
  return (
    <PlayBack
      device={device}
      onClose={() => (history.length !== 1 ? history.goBack() : window.close())}
      screen={`/camera-ai/list-item/${action}`}
    />
  );
}
