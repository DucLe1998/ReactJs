/**
 *
 * ListUserCameraAi
 *
 */

import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import DateBox from 'devextreme-react/date-box';
import { endOfDay, startOfDay, isToday } from 'date-fns';
import { makeStyles } from '@material-ui/core/styles';
import { useIntl } from 'react-intl';
import { showError } from 'utils/toast-utils';
import reducer from '../reducer';
import saga from '../saga';
import makeSelectListUserCameraAi from '../selectors';
import { callApi, METHODS, putApi } from '../../../utils/requestUtils';
import LiveStream from '../../../components/Custom/camera/LiveStream';
import { DEVICE_API_SRC } from '../../apiUrl';
import { ACTION } from '../constants';
import messages from '../messages';
import PageHeader from '../../../components/PageHeader';

const key = 'listUserCameraAi';

export function Playback({ device, onClose, screen }) {
  const intl = useIntl();
  // const intl = useIntl();
  const classes = useStyles();
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });

  const [broadcastId, setBroadcastId] = useState('');
  const [token, setToken] = useState('');
  const [timeFilter, setTimeFilter] = useState(null);
  const [defaultValueRange, setDefaultValueRange] = useState(0);
  const [needLoadData, setNeedLoadData] = useState(0);
  const [reRenderLiveStream, setReRenderLiveStream] = useState(false); // reset time slider in livestream frame

  const setTimePlaybackData = timeValue => {
    const currentDate = new Date(timeValue);
    const current = currentDate.getTime();
    const endTime = isToday(currentDate)
      ? new Date().getTime()
      : endOfDay(currentDate).getTime();
    const startTime = startOfDay(currentDate).getTime();
    setDefaultValueRange(current - startTime);
    setTimeFilter({
      end_time: endTime,
      start_time: startTime,
    });
  };

  const onValueChangedDateBox = v => {
    if (v.value) {
      setReRenderLiveStream(true);
      setTimePlaybackData(v.value);
    } else {
      setTimeFilter('');
    }
    setReRenderLiveStream(false);
    setNeedLoadData(needLoadData + 1);
  };

  const fetchLiveDataDetail = async () => {
    try {
      setBroadcastId(null);
      setToken(null);
      const dto1 = {
        device_id_list: [device?.deviceId],
        area_id: device.area_id,
        zone_id: device.zone_id,
        block_id: device.block_id,
        floor_id: device.floor_id,
      };
      const response = await callApi(
        `${DEVICE_API_SRC}/devices/create-broadcast`,
        'PUT',
        dto1,
      );
      const query = response.data
        .filter(e => e?.information?.broadcast?.dataId)
        .map(a => a.information.broadcast.dataId);
      setBroadcastId(query[0] || '');
      const res = await callApi(
        `${DEVICE_API_SRC}/live-views/media-server-token?broadcast-ids=${query}`,
        'GET',
      );
      setToken(res?.data || '');
    } catch (error) {
      showError(error);
    }
  };

  const fetchPlaybackDataDetail = async v => {
    setBroadcastId(null);
    setToken(null);
    let time = { ...timeFilter };
    if (v) {
      time = { ...v };
    }
    const dto = {
      ...time,
      lst_device_id: [device?.deviceId],
      action: 'start',
      speed_rate: 1,
    };
    if (!time.start_time || !time.end_time) return;
    try {
      const response = await callApi(
        `${DEVICE_API_SRC}/live-views/playback/playback-action`,
        METHODS.POST,
        dto,
      );
      setBroadcastId(response.data[0]?.information?.playback.streamId);
      setToken(response.data[0]?.information?.playback);
    } catch (error) {
      showError(error);
    }
  };

  const fetchTokenViewCamera = async () => {
    try {
      const res = await callApi(
        `${
          DEVICE_API_SRC
        }live-views/media-server-token?broadcast-ids=${broadcastId}`,
        'GET',
      );
      setToken(res.data[0]);
    } catch (error) {
      showError(error);
    }
  };

  const onChangeCurTimePlayback = v => {
    if (needLoadData > 0) {
      const dto = {
        start_time: v,
        end_time: timeFilter.end_time,
      };
      fetchPlaybackDataDetail(dto);
    }
  };

  const addCamToView = async () => {
    await putApi(`${DEVICE_API_SRC}/live-views/playback/add-cam`, {
      device_id_list: [device?.deviceId],
    })
      .then(() => {
        setNeedLoadData(needLoadData + 1);
      })
      .catch(err => {
        if (
          (err.response.data.error === 'DR00108' || // playback
            err.response.data.error === 'DR0056') && // liveview
          err.response.status === 400
        ) {
          setNeedLoadData(needLoadData + 1);
        } else {
          showError(err);
        }
      });
  };

  useEffect(() => {
    if (device) {
      setTimePlaybackData(device?.timeOccur);
      addCamToView();
    }
  }, [device]);

  useEffect(() => {
    if (device) {
      if (device?.action === ACTION.LIVE) {
        fetchLiveDataDetail();
      } else if (device?.action === ACTION.PLAYBACK && timeFilter) {
        fetchPlaybackDataDetail();
      }
    }
  }, [needLoadData]);

  useEffect(() => {
    if (broadcastId) {
      fetchTokenViewCamera();
    }
  }, [broadcastId]);

  return (
    <Fragment>
      <PageHeader
        title={`${
          device
            ? device.action === ACTION.PLAYBACK
              ? ' Xem lại'
              : 'Xem Trực tiếp'
            : 'Quay lại'
        }`}
        showBackButton
        onBack={() => {
          onClose(null);
        }}
      />
      <div
        style={{
          height: 'calc(100vh - 50px - 84px - 25px)',
          width: '90%',
          margin: 'auto',
        }}
      >
        <PageHeader title={device?.deviceName || ''}>
          {device?.action === ACTION.PLAYBACK && (
            <div className="page-action button-container">
              <DateBox
                // placeholder="Chọn thời gian xem lại"
                defaultValue={device?.timeOccur}
                placeholder={intl.formatMessage(messages.datebox_placeholder)}
                type="datetime"
                style={{
                  borderRadius: 8,
                  background: 'rgba(0, 0, 0, 0.8)',
                  color: '#FFF',
                }}
                onValueChanged={onValueChangedDateBox}
                displayFormat="h:mm a - dd/MM/yyyy"
                className={classes.white}
                openOnFieldClick
                inputAttr={{
                  readOnly: true,
                }}
                showAnalogClock={false}
                max={new Date().getTime()}
              />
            </div>
          )}
        </PageHeader>
        <div style={styles.root}>
          <div
            style={{
              width: '100%',
              height: '100%',
            }}
          >
            {!reRenderLiveStream && device?.deviceId && (
              <LiveStream
                broadcastId={broadcastId}
                token={token}
                showControl={device?.action === ACTION.PLAYBACK}
                callbackWhenUnauthorized={fetchTokenViewCamera}
                timeFilter={timeFilter}
                onChangeCurTimePlayback={onChangeCurTimePlayback}
                defaultValueRange={
                  device?.action === ACTION.PLAYBACK ? defaultValueRange : 0
                }
                screen={screen}
              />
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
}

const styles = {
  root: {
    backgroundColor: '#000',
    width: '100%',
    height: 'calc(100% - 84px)',
  },
};
const useStyles = makeStyles({
  white: {
    background: 'none !important',
  },
});

Playback.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  loading: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({
  listUserCameraAI: makeSelectListUserCameraAi(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(Playback);
