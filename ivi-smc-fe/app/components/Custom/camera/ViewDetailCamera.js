/* eslint-disable camelcase */
import React, { useState, useEffect } from 'react';
import { BiX } from 'react-icons/bi';
import { Popup } from 'devextreme-react/popup';

import { API_ROUTE } from '../../../containers/apiUrl';
import IconBtn from '../IconBtn';
import { callApi } from '../../../utils/requestUtils';
import './css/external/video-js.css';
import './styles.css';
import LiveStream from './LiveStream';
import utils from '../../../utils/utils';

const ViewDetailCamera = ({
  onClosePopup,
  data,
  screen,
  timeFilter,
  disabledActionRecord,
}) => {
  const [token, setToken] = useState('');
  const [broadcastId, setBroadcastId] = useState('');

  const fetchTokenViewCamera = async v => {
    const res = await callApi(
      `${API_ROUTE.LIVE_VIEW}/media-server-token?broadcast-ids=${v}`,
      'GET',
    );
    if (res.code === 200) {
      setToken(res.data[0]);
    } else {
      utils.showToast('Lấy token của camera không thành công!', 'error');
    }
  };

  const fetchPlaybackCamera = async v => {
    const res = await callApi(
      `${API_ROUTE.LIVE_VIEW}/playback/playback-action`,
      'POST',
      {
        ...v,
        lst_device_id: [data.id],
        action: 'start',
        speed_rate: 1,
      },
    );
    if (res?.code === 200) {
      const aaa = res.data[0];

      setToken(aaa?.information?.playback);
      setBroadcastId(aaa?.information?.playback?.streamId || '');
    }
  };

  useEffect(() => {
    if (data) {
      if (timeFilter) {
        fetchPlaybackCamera(timeFilter);
        // setToken(data?.information?.playback?.tokenId);
      } else {
        const broadCastId = data?.information?.broadcast?.dataId || '';
        fetchTokenViewCamera(broadCastId);
        setBroadcastId(broadCastId);
      }
    }
  }, [data]);

  const onChangeCurTimePlayback = v => {
    const dto = {
      start_time: v,
      end_time: timeFilter.end_time,
    };
    fetchPlaybackCamera(dto);
  };

  return (
    <Popup
      visible
      showTitle={false}
      onHidden={() => {
        onClosePopup(false);
      }}
      closeOnOutsideClick
      dragEnabled={false}
      height="80%"
      width="70%"
      className="no-padding cus-overlay-shader"
    >
      <div style={styles.root}>
        <Header onClick={() => onClosePopup(false)} name={data.name} />
        {token && (
          <div
            style={{
              width: '100%',
              height: 'calc(100% - 64px)',
              position: 'relative',
            }}
          >
            <LiveStream
              dataItem={data}
              broadcastId={broadcastId}
              disabledActionRecord={disabledActionRecord}
              token={token}
              screen={screen}
              timeFilter={timeFilter}
              isScreen="detail"
              showControl
              callbackWhenUnauthorized={() => {
                if (timeFilter) {
                  fetchPlaybackCamera(timeFilter);
                } else {
                  const broadCastId =
                    data?.information?.broadcast?.dataId || '';
                  if (broadCastId) {
                    fetchTokenViewCamera(broadCastId);
                    setBroadcastId(broadCastId);
                  }
                }
              }}
              onChangeCurTimePlayback={onChangeCurTimePlayback}
            />

            <div style={styles.viewStatus}>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: utils.genStatusCamera(
                    data?.status_of_device || '',
                  ).color,
                  marginRight: 6,
                }}
              />
              {utils.genStatusCamera(data?.status_of_device || '').text}
            </div>
          </div>
        )}
      </div>
    </Popup>
  );
};

const Header = ({ onClick, name = 'Name' }) => (
  <div style={styles.header}>
    {name}
    <IconBtn onClick={onClick} icon={<BiX size="1.5em" color="gray" />} />
  </div>
);

const styles = {
  root: {
    backgroundColor: '#000',
    width: '100%',
    height: '100%',
  },
  header: {
    height: 64,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 24,
    paddingRight: 4,
    backgroundColor: '#FFF',
    fontSize: 18,
    fontWeight: 500,
  },
  viewStatus: {
    fontWeight: 'normal',
    color: '#FFF',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    bottom: 70,
    left: 20,
    fontSize: 13,
  },
};

export default ViewDetailCamera;
