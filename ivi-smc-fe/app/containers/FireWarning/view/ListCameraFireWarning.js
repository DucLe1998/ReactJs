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
import ViewTreeCamera from './Component/ViewTreeCamera';
import ListCameraLive from './Component/ListCameraLive';

const ListCameraFireWarning = ({ loading, error, dataDetail }) => {
  const [itemCameraOnTree, setItemCameraOnTree] = useState('');

  const [isOpenPopupDetail, setIsOpenPopupDetail] = useState(false);
  const [listCamera, setListCamera] = useState([]);
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

  // const fetchBroadcast = async v => {
  //   if (v && v.length >= 4 && !isCheckCallApiGetBroadcast) {
  //     try {
  //       const dto = {
  //         device_id_list: v.map(e => e.cameraId),
  //         area_id: dataDetail?.areaId || 19,
  //         zone_id: dataDetail?.zoneId || 10001,
  //         block_id: dataDetail?.blockId,
  //         floor_id: dataDetail?.floorId,
  //       };
  //       const res = await callApi(
  //         `${API_ROUTE.LIST_NVR}/create-broadcast`,
  //         'PUT',
  //         dto,
  //       );
  //       fetchTokenViewCamera(res.data);
  //       setListCameraHaveBroadCast(res.data);
  //     } catch (error) {
  //       utils.showToast(error.response?.data?.message, 'error');
  //     }
  //   }
  // };

  const fetchBroadcastNew = async (v, v1, v2) => {
    if (v && v.length >= 4 && !isCheckCallApiGetBroadcast) {
      try {
        const dto1 = {
          device_id_list: v1.map(e => e.cameraId),
          area_id: dataDetail?.areaId,
          zone_id: dataDetail?.zoneId,
          block_id: dataDetail?.blockId1,
          floor_id: dataDetail?.floorId1,
        };
        const res1 = await callApi(
          `${API_ROUTE.LIST_NVR}/create-broadcast`,
          'PUT',
          dto1,
        );
        const dto2 = {
          device_id_list: v2.map(e => e.cameraId),
          area_id: dataDetail?.areaId,
          zone_id: dataDetail?.zoneId,
          block_id: dataDetail?.blockId2,
          floor_id: dataDetail?.floorId2,
        };
        const res2 = await callApi(
          `${API_ROUTE.LIST_NVR}/create-broadcast`,
          'PUT',
          dto2,
        );
        const res = await [...res1.data, ...res2.data];
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

  const fetchBroadcastNewForListCam = async v => {
    if (v && v.length >= 1 && !isCheckCallApiGetBroadcast) {
      try {
        const dto = {
          device_id_list: v.map(e => e.cameraId),
          area_id: v[0].area_id || null,
          zone_id: v[0].zone_id || null,
          block_id: v[0].block_id || null,
          floor_id: v[0].floor_id || null,
        };
        const res = await callApi(
          `${API_ROUTE.LIST_NVR}/create-broadcast`,
          'PUT',
          dto,
        );
        // console.log('res--------------->', res);
        await fetchTokenViewCamera(res.data);
        await setListCameraHaveBroadCast(res.data);
      } catch (error) {
        utils.showToast(
          'Bạn không thể xem Camera vì không có quyền tại khu vực này',
          'error',
        );
      }
    }
  };

  useEffect(() => {
    if (
      listCamera &&
      listCamera.length === 4 &&
      !dataDetail?.hasLocation &&
      setIsCheckCallApiGetBroadcast
    ) {
      const foundFloor1 = listCamera.filter(
        e => e.floor_id === dataDetail.floorId1,
      );
      const foundFloor2 = listCamera.filter(
        e => e.floor_id === dataDetail.floorId2,
      );
      fetchBroadcastNew(listCamera, foundFloor1, foundFloor2);
    }
    if (
      listCamera &&
      listCamera.length > 0 &&
      dataDetail?.hasLocation &&
      setIsCheckCallApiGetBroadcast
    ) {
      fetchBroadcastNewForListCam(listCamera);
    }
  }, [listCamera, setIsCheckCallApiGetBroadcast]);

  const onClosePopupDetail = () => {
    setIsOpenPopupDetail(v => {
      if (isOpenPopupDetail) {
        const foundFloor1 = listCamera.filter(
          e => e.floor_id === dataDetail.floorId1,
        );
        const foundFloor2 = listCamera.filter(
          e => e.floor_id === dataDetail.floorId2,
        );
        fetchBroadcastNew(listCamera, foundFloor1, foundFloor2);
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
        setListCamera(e => [...e, v]);
      }
    } else if (type === 'delete') {
      setListCamera(e => e.filter(c => c.id !== v.id));
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
        <div
          className="root-left"
          style={dataDetail?.hasLocation && { width: 0 }}
        >
          <div className="header-left">Camera</div>
          <div className="content-left-2">
            <ViewTreeCamera
              dataDetail={dataDetail}
              listCamera={listCamera}
              callback={onClickItemTreeCamera}
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
              screen="/fireWarning"
              listCameraHaveBroadCast={listCameraHaveBroadCast}
              isShowLockIcon={!dataDetail?.hasLocation}
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

export default ListCameraFireWarning;
