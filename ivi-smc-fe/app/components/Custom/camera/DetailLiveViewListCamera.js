/* eslint-disable camelcase */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-undef */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useEffect, useState } from 'react';
import { AiOutlineMore } from 'react-icons/ai';
import IconBtn from '../IconBtn';
import Btn from '../Btn';
import ClickAway from '../ClickAway';
import utils from '../../../utils/utils';
import { IconOpenPopup } from '../Icon/ListIcon';
import { ViewPlaybackNotFound } from '../Icon/ViewPlaybackNotFound';
// import ViewRecording from './ViewRecording';
import { ViewLiveViewNotFound } from '../Icon/ViewLiveViewNotFound';
import ViewRecording from './ViewRecording';
import LiveStreamSub from './LiveStreamSub';
import { callApi } from '../../../utils/requestUtils';
import { API_ROUTE } from '../../../containers/apiUrl';

const DetailLiveViewListCamera = ({
  squareType,
  listCamera,
  onClickOption,
  tokenOfCamera,
  isOpenPopupDetail,
  screen,
  onClickItemCamera,
  itemCamera,
  loadingRecord,
  stopAndStartRecord,
  scopes,
  onClickCut,
}) => {
  const [hightCamera, setHightCamera] = useState(`${100 / squareType}%`);
  const checkScreen = window.location.pathname.search('list-live-view/detail');

  useEffect(() => {
    setHightCamera(`${100 / squareType}%`);
  }, [squareType]);

  if (!listCamera || listCamera.length === 0) {
    return checkScreen !== -1 ? (
      <ViewLiveViewNotFound />
    ) : (
      <ViewPlaybackNotFound />
    );
  }

  return (
    <div style={styles.root}>
      {listCamera.map((item, index) => (
        <ItemMap
          index={index}
          isOpenPopupDetail={isOpenPopupDetail}
          item={item}
          hightCamera={hightCamera}
          callback={onClickOption}
          onClickItemCamera={onClickItemCamera}
          screen={screen}
          scopes={scopes}
          itemCamera={itemCamera}
          loadingRecord={loadingRecord}
          stopAndStartRecord={stopAndStartRecord}
          onClickCut={onClickCut}
          tokenOfCamera={tokenOfCamera || []}
          key={item.id || index.toString()}
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
  isOpenPopupDetail,
  screen,
  onClickItemCamera,
  itemCamera,
  stopAndStartRecord,
  loadingRecord,
  onClickCut,
  scopes,
}) => {
  const [open, setOpen] = useState(false);
  const [showIconPopupDetail, setShowIconPopupDetail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tokenSupport, setTokenSupport] = useState('');

  const handleClickAway = () => {
    setOpen(false);
  };

  const broadcastId = item?.information?.broadcast?.dataId || '';

  const foundToken =
    broadcastId &&
    tokenOfCamera &&
    tokenOfCamera.find(e => e && e?.streamId === broadcastId);

  const loadingCallback = v => {
    setLoading(v);
  };

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

  const heightVideo =
    document.getElementById('id_view_video')?.offsetHeight || '';

  // console.log('heightVideo----------------->', heightVideo);

  const checkItem = broadcastId && itemCamera?.id === item.id;

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
      onMouseEnter={() => setShowIconPopupDetail(true)}
      onMouseLeave={() => setShowIconPopupDetail(false)}
      onClick={() => !loading && onClickItemCamera && onClickItemCamera(item)}
      className="test-test-test"
    >
      {broadcastId && itemCamera?.id === item.id && (
        <ViewRecording
          stopAndStartRecord={stopAndStartRecord}
          loadingCutVideo={loadingRecord}
          onClickCut={onClickCut}
          broadcastId={broadcastId}
        />
      )}

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
              broadcastId={broadcastId}
              token={foundToken}
              showControl={false}
              screen={screen}
              loadingCallback={loadingCallback}
              tokenSupport={tokenSupport}
              callbackWhenUnauthorized={callbackWhenUnauthorized}
            />
          )}
          {/* <iframe
              width="100%"
              height="100%"
              src={`${URL_LIVE_STREAM}?name=${broadcastId ||
                ''}&token=${(foundToken && foundToken.tokenId) || ''}`}
              allowFullScreen
              frameBorder="0"
            /> */}
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
            {scopes?.update && (
              <ClickAway
                open={open}
                onClose={handleClickAway}
                style={styles.viewClickAway}
                viewBtn={
                  <IconBtn
                    style={{ padding: 2 }}
                    icon={<AiOutlineMore color="#606060" />}
                    onClick={() => setOpen(!open)}
                  />
                }
              >
                <div>
                  <Btn
                    colorText="#333"
                    label="Xóa camera"
                    textAlign="left"
                    onClick={() => {
                      callback({ cameraId: item?.id || '' }, 'delete');
                      handleClickAway();
                    }}
                  />
                  {heightVideo <= 20 ? (
                    <Btn
                      colorText="#333"
                      label="Xem chi tiết"
                      textAlign="left"
                      onClick={() =>
                        callback({ ...item, tokenOfCamera }, 'open_popup')
                      }
                    />
                  ) : null}
                </div>
              </ClickAway>
            )}
          </div>
          <div style={{ fontWeight: 'normal', color: 'rgba(0, 0, 0, 0.8)' }}>
            {item?.zone?.zoneName}
            {item?.block?.blockName ? ` - ${item.block.blockName}` : ''}
            {item?.floor?.floorName ? ` - ${item.floor.floorName}` : ''}
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

      {!stopAndStartRecord && showIconPopupDetail && heightVideo >= 20 && (
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
  viewClickAway: {
    position: 'absolute',
    bottom: 20,
    right: 8,
    zIndex: 200,
    border: 'none',
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: '#fff',
    boxShadow: '3px 3px 15px 0 rgba(0, 0, 0, 0.16)',
    borderRadius: 10,
    width: 100,
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

export default DetailLiveViewListCamera;
