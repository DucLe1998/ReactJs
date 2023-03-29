/* eslint-disable func-names */
/* eslint-disable react/button-has-type */
import React, { useEffect, Fragment, useState } from 'react';

import Loading from 'containers/Loading/Loadable';

import gui from '../../../utils/gui';
import utils, { showAlertError } from '../../../utils/utils';

import { callApi } from '../../../utils/requestUtils';
import { API_ROUTE } from '../../apiUrl';
import ViewDetailCamera from '../../../components/Custom/camera/ViewDetailCamera';

import '../../../components/Custom/camera/styles.css';
import ViewTreeCamera from './ViewTreeCamera';
import ListCameraLive from './ListCameraLive';

const ListCamera = ({
  loading,
  error,
  dataDetail,
  listCamera,
  setListCamera,
  screen,
  isDisabled,
}) => {
  const [itemCameraOnTree, setItemCameraOnTree] = useState('');

  const [isOpenPopupDetail, setIsOpenPopupDetail] = useState(false);
  // const [listCamera, setListCamera] = useState([]);
  const [tokenOfCamera, setTokenOfCamera] = useState('');
  const [itemViewDetail, setItemViewDetail] = useState('');
  const [isCheckCallApiGetBroadcast, setIsCheckCallApiGetBroadcast] = useState(
    false,
  );
  const [listCameraHaveBroadCast, setListCameraHaveBroadCast] = useState([]);

  const fetchTokenViewCamera = async v => {
    if (v && v.length > 0) {
      const query = v
        .filter(e => e?.information?.broadcast?.dataId)
        .map(a => a.information.broadcast.dataId);
      const res = await callApi(
        `${API_ROUTE.LIVE_VIEW}/media-server-token?broadcast-ids=${query}`,
        'GET',
      );
      setTokenOfCamera(res?.data || '');
    }
  };

  const fetchBroadcastNew = async (v, v1) => {
    if (v && v.length >= 1 && !isCheckCallApiGetBroadcast) {
      try {
        const dto1 = {
          device_id_list: v1
            .filter(e => e.cameraId !== null)
            .map(e => e.cameraId),
          area_id: dataDetail?.areaId,
          zone_id: dataDetail?.zoneId,
          block_id: dataDetail?.blockId,
          floor_id: dataDetail?.floorId,
        };
        const res1 = await callApi(
          `${API_ROUTE.LIST_NVR}/create-broadcast`,
          'PUT',
          dto1,
        );
        const res = await [...res1.data];
        // console.log('res--------------->', res);
        await fetchTokenViewCamera(res);
        await setListCameraHaveBroadCast(res);
      } catch (error) {
        utils.showToast(
          'Bạn không thể xem Camera vì không có quyền tại khu vực này',
          'error',
        );
      }
    }
  };

  useEffect(() => {
    if (listCamera && listCamera.length >= 1 && setIsCheckCallApiGetBroadcast) {
      const foundFloor = listCamera.filter(
        e => e.floor_id === dataDetail.floorId,
      );
      fetchBroadcastNew(listCamera, foundFloor);
    }
  }, [listCamera, setIsCheckCallApiGetBroadcast]);

  const onClosePopupDetail = () => {
    setIsOpenPopupDetail(v => {
      if (isOpenPopupDetail) {
        const foundFloor1 = listCamera.filter(
          e => e.floor_id === dataDetail.floorId,
        );
        fetchBroadcastNew(listCamera, foundFloor1);
      }
      setItemViewDetail('');
      return !v;
    });
  };

  const onClickItemTreeCamera = (v, type) => {
    if (type === 'add') {
      const countCamera = listCamera.length;
      const foundCameraLock = listCamera.filter(i => i.lock);
      setIsCheckCallApiGetBroadcast(false);
      if (foundCameraLock?.length === 4) {
        utils.showToast(
          'Vui lòng gỡ bỏ ghim khung xem video để xem camera này',
          'error',
        );
      } else if (countCamera >= 4) {
        const abc = listCamera;
        const min = Math.min.apply(
          null,
          listCamera
            .filter(x => !x.lock)
            .map(function(item) {
              return item.timeAddToView;
            }),
        );
        const foundIndex = listCamera.findIndex(
          x => x.timeAddToView !== null && x.timeAddToView == min && !x.lock,
        );

        abc[foundIndex] = v;
        setListCamera([...abc]);
      } else {
        setListCamera([...listCamera, v]);
      }
    } else if (type === 'delete') {
      setListCamera(listCamera.filter(c => c.id !== v.id));
    } else if (type === 'open_popup') {
      onClosePopupDetail();
      setItemViewDetail(v);
    } else if (type === 'dragStart') {
      setItemCameraOnTree(v);
    } else if (type === 'lock') {
      afterLockAndUnlock({
        ...v,
        lock: true,
        timeAddToView: new Date().getTime(),
      });
    } else if (type === 'unlock') {
      afterLockAndUnlock({
        ...v,
        lock: false,
      });
    } else if (type === 'removeAll') {
      setListCamera([]);
    } else if (type === 'addMulti') {
      setListCamera([...v]);
    }
  };

  const afterLockAndUnlock = v => {
    const abc = listCamera;
    const foundIndex = listCamera.findIndex(x => x.id == v.id);
    abc[foundIndex] = v;
    setListCamera([...abc]);
    setIsCheckCallApiGetBroadcast(true);
  };

  if (error) showAlertError();

  return (
    <Fragment>
      <div
        style={{
          height: gui.screenHeight - 75,
          padding: '27px 36px 30px 26px',
        }}
        className="root"
      >
        <div className="root-left">
          <div className="header-left">Camera</div>
          <div className="content-left-2">
            <ViewTreeCamera
              dataDetail={dataDetail}
              listCamera={listCamera}
              callback={onClickItemTreeCamera}
              isDisabled={isDisabled}
            />
          </div>
        </div>

        <div className="root-right">
          <div
            onDrop={() =>
              onClickItemTreeCamera(
                { ...itemCameraOnTree, timeAddToView: new Date().getTime() },
                'add',
              )
            }
            onDragOver={e => e.preventDefault()}
            draggable={false}
            style={{
              width: '100%',
              height: gui.screenHeight - 80,
            }}
          >
            <ListCameraLive
              listCamera={listCamera}
              onClickOption={onClickItemTreeCamera}
              tokenOfCamera={tokenOfCamera}
              isOpenPopupDetail={isOpenPopupDetail}
              squareType={2}
              screen={screen}
              listCameraHaveBroadCast={listCameraHaveBroadCast}
              isDisabled={isDisabled}
            />
          </div>
        </div>
      </div>

      {loading && <Loading />}

      {isOpenPopupDetail && (
        <ViewDetailCamera
          data={itemViewDetail}
          tokenOfCamera={tokenOfCamera}
          onClosePopup={onClosePopupDetail}
          screen="/fire-warning"
          disabledActionRecord
        />
      )}
    </Fragment>
  );
};

export default ListCamera;
