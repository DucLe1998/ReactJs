import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import DateBox from 'devextreme-react/date-box';
import IconBack from 'images/icon-button/ic_back.svg';
import { BsCalendar } from 'react-icons/bs';
import moment from 'moment';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { callApi, METHODS } from 'utils/requestUtils';
import LiveStream from 'components/Custom/camera/LiveStream';
import IconBtn from 'components/Custom/IconBtn';
import reducer from './reducer';
import saga from './saga';
import { API_ROUTE } from '../apiUrl';
import messages from '../ListUserCameraAi/messages';
import { ACTION } from '../ListItemCameraAi/constants';

const key = 'IntrusionCameraAi';

export function DetailCamera({ device, onClose }) {
  const intl = useIntl();
  // const intl = useIntl();
  const classes = useStyles();
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });

  const [broadcastId, setBroadcastId] = useState('');
  const [token, setToken] = useState('');
  const [timeFilter, setTimeFilter] = useState(device.timeOccur * 1000);

  const onValueChangedDateBox = v => {
    if (v.value) {
      const endTime = moment(v.value).valueOf();
      const aaa = new Date();
      aaa.setHours(0, 0, 0, 0);
      setTimeFilter({
        end_time: endTime / 1000,
        start_time: moment(aaa).valueOf() / 1000,
      });
    } else {
      setTimeFilter('');
    }
  };

  const fetchLiveDataDetail = async () => {
    const response = await callApi(
      `${API_ROUTE.LIST_NVR}/${device.deviceId}`,
      METHODS.GET,
    );
    setBroadcastId(response.data.information.broadcast.dataId);
    // setDataDetail(response.data);
  };

  // const fetchPlaybackDataDetail = async () => {
  //   const dto = {
  //     ...timeFilter,
  //     lst_device_id: [726],
  //     action: 'start',
  //     speed_rate: 1,
  //   };
  //   const response = await callApi(
  //     `${API_ROUTE.LIVE_VIEW}/playback/playback-action`,
  //     METHODS.POST,
  //     dto,
  //   );
  //   setBroadcastId(response.data.information?.broadcast.dataId);
  //   // setDataDetail(response.data);
  // };

  const fetchTokenViewCamera = async () => {
    const res = await callApi(
      `${API_ROUTE.LIVE_VIEW}/media-server-token?broadcast-ids=${broadcastId}`,
      'GET',
    );
    setToken(res.data[0]);
  };

  useEffect(() => {
    fetchLiveDataDetail();
    // if (device.deviceId && device.action === ACTION.LIVE) {
    //   fetchLiveDataDetail();
    // } else if (device.action === ACTION.PLAYBACK && timeFilter) {
    //   fetchPlaybackDataDetail();
    // }
  }, [device, timeFilter]);

  useEffect(() => {
    if (broadcastId) {
      fetchTokenViewCamera();
    }
  }, [broadcastId]);

  return (
    <Fragment>
      <div style={{ height: '100%', marginTop: '29.51px' }}>
        <div className="page-header">
          <div className="page-title">
            <button
              type="button"
              style={{
                backgroundColor: 'inherit',
                border: 'none',
                cursor: 'pointer',
              }}
              onClick={() => {
                onClose(null);
              }}
            >
              <img src={IconBack} alt="" />
            </button>
            <span
              style={{
                fontWeight: '500',
                fontSize: '20px',
                lineHeight: '23px',
                letterSpacing: '0.38px',
                color: '#2C2C2E',
                verticalAlign: 'middle',
              }}
            >
              {intl.formatMessage(messages.playback_text)}
              {/* Xem lại */}
            </span>
          </div>
        </div>
        <div
          style={{
            height: '100%',
            width: '70%',
            display: 'flex',
            flexDirection: 'column',
            margin: 'auto',
          }}
        >
          <div className="page-header">
            <div className="page-title">{device.name}</div>
            {device.action === ACTION.PLAYBACK && (
              <div className="page-action button-container">
                <DateBox
                  // value={timeFilter}
                  showClearButton
                  useMaskBehavior
                  showAnalogClock={false}
                  // placeholder="Chọn thời gian xem lại"
                  placeholder={intl.formatMessage(messages.datebox_placeholder)}
                  type="datetime"
                  style={{
                    borderRadius: 8,
                    background: 'rgba(0, 0, 0, 0.8)',
                    color: '#FFF',
                  }}
                  dropDownButtonRender={() => (
                    <IconBtn
                      style={{ padding: 0, marginTop: 6 }}
                      disabled
                      icon={<BsCalendar color="#93C198" />}
                    />
                  )}
                  onValueChanged={onValueChangedDateBox}
                  displayFormat="HH:mm dd/MM/yyyy"
                  className={classes.white}
                />
              </div>
            )}
          </div>
          <div style={styles.root}>
            {token && (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  position: 'relative',
                }}
              >
                <LiveStream
                  broadcastId={broadcastId}
                  token={token}
                  showControl={false}
                  callbackWhenUnauthorized={fetchTokenViewCamera}
                />
              </div>
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
    height: '50%',
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
const useStyles = makeStyles({
  white: {
    background: 'none !important',
  },
});

DetailCamera.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  loading: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(DetailCamera);
