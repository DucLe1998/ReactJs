/* eslint-disable consistent-return */
/* eslint-disable no-lonely-if */
/* eslint-disable camelcase */
/* eslint-disable react/button-has-type */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import { DateBox } from 'devextreme-react';
import { checkAuthority } from 'utils/functions';

import Loading from 'containers/Loading/Loadable';
import TitlePage from '../../../components/Custom/TitlePage';
import DetailLiveViewTreeCamera from '../../../components/Custom/camera/DetailLiveViewTreeCamera';
import gui from '../../../utils/gui';
import reducerCommon from '../../Common/reducer';
import sagaCommon from '../../Common/sagaCommon';
import saga from '../saga';
import reducer from '../reducer';
import { showLoading, loadData, addCamToView, changeField } from '../actions';
import {
  makeSelectData,
  makeSelectIsReloading,
  makeSelectLoading,
} from '../selectors';
import DetailLiveViewListCamera from '../../../components/Custom/camera/DetailLiveViewListCamera';
import ViewDetailCamera from '../../../components/Custom/camera/ViewDetailCamera';
import ViewLayout from '../../../components/Custom/camera/ViewLayout';
import '../../../components/Custom/camera/styles.css';
import { callApi } from '../../../utils/requestUtils';
import { API_ROUTE } from '../../apiUrl';
import ControlVideo from '../../../components/Custom/camera/ControlVideo';
import {
  StartRecording,
  StopRecording,
  UploadVideo,
  StopRecordingTypePause,
} from '../../../components/Custom/camera/record-video-frame';
import IconBtn from '../../../components/Custom/IconBtn';
import { IconCalendaGreen } from '../../../components/Custom/Icon/ListIcon';
import PopupDelete from '../../../components/Custom/popup/PopupDelete';

const key = 'playback';
const now = new Date();

const ViewPlaybackCamera = ({
  isReloading,
  onLoadData,
  data,
  addCamToView,
  loading,
  userAuthority,
}) => {
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });
  useInjectReducer({ key: 'common', reducer: reducerCommon });
  useInjectSaga({ key: 'common', saga: sagaCommon });

  // const resourceCode = 'cctv/live-views';
  const resourceCode = 'cctv/playback-camera';
  const scopes = checkAuthority(
    ['get', 'update', 'delete', 'create', 'list'],
    resourceCode,
    userAuthority,
  );

  const [isOpenPopupDetail, setIsOpenPopupDetail] = useState(false);
  const [listCamera, setListCamera] = useState([]);
  const [tokenOfCamera, setTokenOfCamera] = useState('');
  const [squareType, setSquareType] = useState(4);
  const [itemViewDetail, setItemViewDetail] = useState('');
  const [timeFilter, setTimeFilter] = useState('');
  const [timeFilterCallApi, setTimeFilterCallApi] = useState('');
  const [curTimePlayback, setCurTimePlayback] = useState('');
  const [itemCamera, setItemCamera] = useState('');
  const [itemCameraOnTree, setItemCameraOnTree] = useState('');
  const [loadingRecord, setLoadingRecord] = useState(false);
  const [stopAndStartRecord, setStopAndStartRecord] = useState(false);
  const [isOpenPopupDelete, setIsOpenPopupDelete] = useState(false);
  const [itemPlayback, setIdPlayback] = useState('');

  const fetchTokenViewCamera = async v => {
    if (v && v.length > 0) {
      const query = v
        .filter(e => e?.information?.broadcast?.dataId)
        .map(a => a.information.broadcast.dataId);
      const res = await callApi(
        `${API_ROUTE.LIVE_VIEW}/media-server-token?broadcast-ids=${query}`,
        'GET',
      );
      setTokenOfCamera(res.data);
    }
  };

  useEffect(() => {
    if (data && data.devices) {
      if (data.id) {
        setIdPlayback(data);
      }
      if (timeFilterCallApi) {
        const list = data.devices.slice(0, 64).map(item => ({
          ...item,
          information: {
            broadcast: {
              ...item.information.playback,
              dataId: item?.information?.playback?.streamId || '',
              type: 'playback',
            },
          },
        }));
        setListCamera(list);
        setTokenOfCamera(
          data.devices.slice(0, 64).map(item => ({
            ...item.information.playback,
          })),
        );
      } else {
        setListCamera(data.devices.slice(0, 64));
        fetchTokenViewCamera(data.devices);
      }
    } else {
      setListCamera([]);
    }
  }, [data]);

  useEffect(() => {
    if (isReloading) {
      fetchData();
      // setTimeFilterCallApi('');
      // setTimeFilter('');
      // setItemCamera('');
      // setCurTimePlayback('');
    }
  }, [isReloading]);

  useEffect(() => {
    fetchData();
  }, [timeFilterCallApi]);

  const fetchData = () => {
    if (timeFilterCallApi && listCamera.length > 0) {
      const dto = {
        ...timeFilterCallApi,
        lst_device_id: listCamera.map(item => item.id),
        action: 'start',
        speed_rate: 1,
      };
      onLoadData({ dto, type: 'filter' });
    } else {
      onLoadData();
    }
  };

  useEffect(() => {
    if (data) {
      const abc = data?.metadata?.layout;
      if (abc && abc * abc >= data?.devices?.length) {
        setSquareType(data?.metadata?.layout);
      } else {
        autoRenUiListCamera(data?.devices?.length || 0);
      }
    }
  }, [data]);

  const updateLiveView = async v => {
    const dto = {
      name: itemPlayback.name,
      type: itemPlayback.type,
      metadata: {
        layout: v,
        count_camera: itemPlayback?.metadata?.count_camera,
      },
    };
    await callApi(`${API_ROUTE.LIVE_VIEW}/${itemPlayback.id}`, 'PUT', dto);
  };

  const autoRenUiListCamera = v => {
    const abc = data?.metadata?.layout;

    if (!abc) {
      return setSquareType(squareType);
    }

    if (abc === 1 && v <= 4) {
      afterRenUiList(2);
    } else if (abc === 2 && v <= 9) {
      afterRenUiList(3);
    } else if (v <= 16) {
      setSquareType(4);
    } else if (v > 16 && v <= 25) {
      setSquareType(5);
    } else if (v > 25 && v <= 36) {
      setSquareType(6);
    } else if (v > 36 && v <= 36) {
      setSquareType(8);
    }
  };

  const afterRenUiList = v => {
    setSquareType(v);
    updateLiveView(v);
  };

  const onClosePopupDetail = () => {
    if (isOpenPopupDetail) {
      setIsOpenPopupDetail(false);
      setItemViewDetail('');
      setItemCamera('');
      if (timeFilterCallApi) {
        fetchData();
      } else {
        fetchTokenViewCamera(data.devices);
      }
    } else {
      setIsOpenPopupDetail(true);
    }
  };

  const onClickItemTreeCamera = (v, type) => {
    if (type === 'add') {
      setListCamera([...listCamera, { ...v, id: v.cameraId }]);
      addCamToView({ dto: { device_id_list: [v.cameraId] }, type: 'add' });
    } else if (type === 'delete') {
      setIsOpenPopupDelete(true);
      setItemViewDetail(v);
    } else if (type === 'open_popup') {
      onClosePopupDetail();
      setItemViewDetail(v);
    } else if (type === 'dragStart') {
      setItemCameraOnTree(v);
    }
  };

  const handlerDelete = () => {
    const foundCam = listCamera.find(i => i.id === itemViewDetail.cameraId);
    if (foundCam) {
      setItemCamera('');
    }
    setListCamera(listCamera.filter(i => i.id !== itemViewDetail.cameraId));
    addCamToView({
      dto: { device_id_list: [itemViewDetail.cameraId] },
      type: 'delete',
    });
    setIsOpenPopupDelete(false);
  };

  const onClickItemCamera = v => {
    setItemCamera(v);
    if (v.id !== itemCamera.id && stopAndStartRecord) {
      StopRecording(() => {
        setStopAndStartRecord(false);
        setLoadingRecord(false);
      });
    }
  };

  const onClickSquare = (v, t) => {
    setSquareType(v);
    if (!t) {
      updateLiveView(v);
    }
  };

  const onClickCut = (v, type) => {
    if (type === 'pause') {
      StopRecordingTypePause();
      setStopAndStartRecord(false);
      setLoadingRecord(false);
    } else {
      if (!stopAndStartRecord) {
        setStopAndStartRecord(true);
        StartRecording(v);
      } else {
        setLoadingRecord(true);
        StopRecording(e => {
          setStopAndStartRecord(false);
          UploadVideo(e, v, () => {
            setLoadingRecord(false);
          });
        });
      }
    }
  };

  const onValueChangedDateBox = v => {
    if (v.value) {
      const d = new Date(v.value);
      // const tzOffset = d.getTimezoneOffset() * 60 * 1000;

      const endTime = d.setHours(23, 59);
      const startTime = new Date(v.value).setHours(0);

      setTimeFilterCallApi({
        end_time: endTime,
        start_time: startTime,
      });

      setTimeFilter({
        end_time: new Date(d.getTime()).setHours(23, 59),
        start_time: new Date(d.getTime()).setHours(0),
      });

      setCurTimePlayback(startTime);
    } else {
      setTimeFilter('');
      setTimeFilterCallApi('');
    }
  };

  const onChangeCurTimePlayback = time => {
    if (time > 0) {
      setTimeFilterCallApi({
        end_time: timeFilterCallApi.end_time,
        start_time: time,
      });
      setCurTimePlayback(time);
    }
  };

  const onClickPreOrNext = (type, value) => {
    const findItem = listCamera.findIndex(e => e.id === value.id);
    const totalItem = listCamera.length;
    const next = findItem + 1 >= totalItem ? findItem : findItem + 1;
    const pre = findItem - 1 < 0 ? findItem : findItem - 1;
    if (type === 'next') {
      setItemCamera(listCamera[next]);
    } else {
      setItemCamera(listCamera[pre]);
    }
  };

  if (!scopes.list) return <div />;

  return (
    <>
      <div
        style={{
          height: gui.screenHeight - 75,
        }}
        className="root"
      >
        <div className="root-left">
          <div className="header-left">Camera</div>
          <div className="content-left">
            <DetailLiveViewTreeCamera
              listCamera={listCamera}
              callback={onClickItemTreeCamera}
              scopes={scopes}
            />
          </div>
        </div>

        <div className="root-right">
          <div className="header-right">
            <TitlePage hiddenIcon title="Xem lại" />
          </div>
          <div
            style={{
              height: `calc(100% - 66px)`,
              display: 'flex',
              flexDirection: 'column',
              // justifyContent: 'space-between',
            }}
          >
            <div className="title-right">
              <ViewLayout
                listCamera={listCamera}
                squareType={squareType}
                callback={onClickSquare}
              />
              <div className="ct-flex-row" style={{ color: '#FFF' }}>
                <DateBox
                  openOnFieldClick
                  showClearButton
                  placeholder="Chọn thời gian xem lại"
                  type="date"
                  className="ct-input-datebox"
                  color="#FFF"
                  style={{
                    borderRadius: 8,
                    background: 'rgba(0, 0, 0, 0.8)',
                    border: 'none',
                  }}
                  width={200}
                  // applyValueMode="useButtons"
                  onValueChanged={onValueChangedDateBox}
                  displayFormat="dd/MM/yyyy"
                  showDropDownButton={false}
                  acceptCustomValue={false}
                  max={now}
                />
                {!timeFilter && (
                  <div
                    style={{
                      position: 'absolute',
                      right: 24,
                    }}
                  >
                    <IconBtn
                      style={{ padding: 0, marginTop: 2, cursor: 'inherit' }}
                      icon={<IconCalendaGreen />}
                    />
                  </div>
                )}
              </div>
            </div>

            <div
              onDrop={() => onClickItemTreeCamera(itemCameraOnTree, 'add')}
              onDragOver={e => e.preventDefault()}
              draggable={false}
              style={{
                width: '100%',
                height:
                  gui.screenHeight - (timeFilter && itemCamera ? 269 : 179),
              }}
            >
              <DetailLiveViewListCamera
                listCamera={listCamera}
                onClickItemCamera={onClickItemCamera}
                squareType={squareType}
                onClickOption={onClickItemTreeCamera}
                tokenOfCamera={tokenOfCamera}
                screen="/playback-camera"
                isOpenPopupDetail={isOpenPopupDetail}
                itemCamera={itemCamera}
                loadingRecord={loadingRecord}
                stopAndStartRecord={stopAndStartRecord}
                scopes={scopes}
                onClickCut={onClickCut}
              />
            </div>
            {timeFilter && itemCamera && !isOpenPopupDetail && (
              <div
                style={{
                  bottom: 0,
                  width: '100%',
                  height: 90,
                }}
              >
                <ControlVideo
                  itemCamera={itemCamera}
                  onClickCut={onClickCut}
                  timeFilter={timeFilter}
                  curTimePlayback={curTimePlayback}
                  onChangeCurTimePlayback={onChangeCurTimePlayback}
                  onClickPreOrNext={onClickPreOrNext}
                  stopAndStartRecord={stopAndStartRecord}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {isOpenPopupDelete && (
        <PopupDelete
          onClickSave={handlerDelete}
          subTxt="khỏi xem lại"
          typeTxt="camera"
          onClose={v => {
            setIsOpenPopupDelete(v);
          }}
        />
      )}

      {isOpenPopupDetail && (
        <ViewDetailCamera
          data={itemViewDetail}
          timeFilter={timeFilter}
          tokenOfCamera={tokenOfCamera}
          onClosePopup={onClosePopupDetail}
          screen="/playback-camera"
        />
      )}
      {loading && <Loading />}
    </>
  );
};

const mapStateToProps = createStructuredSelector({
  data: makeSelectData(),
  isReloading: makeSelectIsReloading(),
  loading: makeSelectLoading(),
});

export function mapDispatchToProps(dispatch) {
  return {
    onLoadData: (evt, t) => {
      dispatch(loadData(evt, t));
    },
    onShowLoading: evt => {
      dispatch(showLoading(evt));
    },
    changeField: evt => {
      dispatch(changeField(evt));
    },
    addCamToView: evt => {
      dispatch(addCamToView(evt));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(ViewPlaybackCamera);
