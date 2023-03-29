/* eslint-disable camelcase */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-undef */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useEffect, useState } from 'react';
import utils from 'utils/utils';
import IconBtn from 'components/Custom/IconBtn';
import { ViewLiveViewNotFound } from 'components/Custom/Icon/ViewLiveViewNotFound';
import {
  IconLock,
  IconOpenPopup,
  IconUnLock,
} from 'components/Custom/Icon/ListIcon';
import LiveStreamSub from 'components/Custom/camera/LiveStreamSub';
import { callApi } from 'utils/requestUtils';
import { API_ROUTE } from 'containers/apiUrl';

const ListCameraLive = ({
  squareType,
  listCamera,
  onClickOption,
  tokenOfCamera,
  screen,
  onClickItemCamera,
  itemCamera,
  listCameraHaveBroadCast,
  isOpenPopupDetail,
  isDisabled,
}) => {
  const [hightCamera, setHightCamera] = useState(`${100 / squareType}%`);

  useEffect(() => {
    setHightCamera(`${100 / squareType}%`);
  }, [squareType]);

  if (!listCamera || listCamera.length === 0) {
    return <ViewLiveViewNotFound />;
  }

  return (
    <div style={styles.root}>
      {listCamera.map((item, index) => (
        <ItemMap
          index={index}
          item={item}
          isOpenPopupDetail={isOpenPopupDetail}
          hightCamera={hightCamera}
          callback={onClickOption}
          onClickItemCamera={onClickItemCamera}
          screen={screen}
          itemCamera={itemCamera}
          listCameraHaveBroadCast={listCameraHaveBroadCast}
          tokenOfCamera={tokenOfCamera || []}
          key={item.id || index.toString()}
          isDisabled={isDisabled}
        />
      ))}
    </div>
  );
};

const ItemMap = ({
  hightCamera,
  item,
  callback,
  tokenOfCamera,
  screen,
  onClickItemCamera,
  itemCamera,
  listCameraHaveBroadCast,
  isOpenPopupDetail,
  isDisabled,
}) => {
  const [showIconPopupDetail, setShowIconPopupDetail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tokenSupport, setTokenSupport] = useState('');

  // const broadcastId = item?.information?.broadcast?.dataId || '';

  const foundBroadcastId =
    (listCameraHaveBroadCast &&
      listCameraHaveBroadCast.find(i => i.id === item.cameraId)?.information
        ?.broadcast?.dataId) ||
    '';

  const foundToken =
    foundBroadcastId &&
    tokenOfCamera &&
    tokenOfCamera.find(e => e && e?.streamId === foundBroadcastId);

  const loadingCallback = v => {
    setLoading(v);
  };

  const heightVideo =
    document.getElementById('id_view_video')?.offsetHeight || '';

  const checkItem = foundBroadcastId && itemCamera?.id === item.id;

  const callbackWhenUnauthorized = v => {
    fetchTokenViewCamera(v);
  };

  const fetchTokenViewCamera = async v => {
    const res = await callApi(
      `${API_ROUTE.LIVE_VIEW}/media-server-token?broadcast-ids=${v}`,
      'GET',
    );
    setTokenSupport(res?.data[0] || '');
  };

  return (
    <div
      style={{
        height: hightCamera,
        width: hightCamera,
        border: '6px solid transparent',
        position: 'relative',
        backgroundColor: checkItem ? 'rgba(147, 193, 152, 0.4)' : 'transparent',
        borderRadius: 12,
      }}
      onMouseEnter={() => {
        if (isDisabled) {
          return;
        }
        setShowIconPopupDetail(true);
      }}
      onMouseLeave={() => {
        if (isDisabled) {
          return;
        }
        setShowIconPopupDetail(false);
      }}
      onClick={() =>
        !loading && onClickItemCamera && !isDisabled && onClickItemCamera(item)
      }
      className="test-test-test"
      // onDrop={() => console.log('co vao day k the nhi ?')}
      // onDragOver={e => e.preventDefault()}
      // draggable={false}
    >
      <div
        style={{
          width: '100%',
          borderWidth: 0,
          height: '100%',
        }}
      >
        <div id="id_view_video" style={styles.viewCamera}>
          {!isOpenPopupDetail && (
            <LiveStreamSub
              dataItem={item}
              broadcastId={foundBroadcastId}
              token={foundToken}
              tokenSupport={tokenSupport}
              showControl={false}
              screen={screen}
              loadingCallback={loadingCallback}
              callbackWhenUnauthorized={callbackWhenUnauthorized}
            />
          )}
        </div>
        <div
          style={{
            fontSize: 14,
            fontWeight: 400,
            color: '#000000',
            marginTop: 10,
            height: 60,
            paddingLeft: 8,
          }}
        >
          <div style={styles.viewContentCamera}>
            {item?.name || 'Name'}
            <IconBtn
              style={{ padding: 2 }}
              icon={item.lock ? <IconLock /> : <IconUnLock />}
              onClick={() => {
                if (isDisabled) {
                  return;
                }
                callback(item, item.lock ? 'unlock' : 'lock');
              }}
            />
          </div>

          <div style={styles.viewStatusCamera}>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: utils.genStatusCamera(
                  item?.status_of_device || '',
                ).color,
                marginRight: 3,
              }}
            />
            {utils.genStatusCamera(item?.status_of_device || '').text}
          </div>
        </div>
      </div>

      {showIconPopupDetail && heightVideo >= 20 && (
        <div className="view-hover-open-camera">
          <IconBtn
            onClick={() => callback({ ...item, tokenOfCamera }, 'open_popup')}
            icon={<IconOpenPopup />}
          />
        </div>
      )}
    </div>
  );
};

const styles = {
  root: {
    height: '100%', // 'calc(100% - 128px - 48px)',
    overflow: 'none',
    width: '100%',
    display: 'flex',
    flexWrap: 'wrap',
    alignContent: 'flex-start',
    padding: 16,
    position: 'relative',
  },
  viewStatusCamera: {
    fontWeight: 'normal',
    color: 'rgba(0, 0, 0, 0.64)',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewContentCamera: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontWeight: 600,
  },
  viewCamera: {
    height: 'calc(100% - 70px)',
    width: '100%',
    backgroundColor: '#333',
    borderRadius: 10,
    overflow: 'hidden',
  },
};

export default ListCameraLive;
