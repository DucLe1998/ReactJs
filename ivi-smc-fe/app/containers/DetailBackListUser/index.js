/**
 *
 * DetailBackListUser
 *
 */

import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import NotFoundImage from 'images/NotFound.svg';
import styled from 'styled-components';
import MaskGroup from 'images/MaskGroup.svg';
// Ellipse 511.svg
// import AnchorIcon from 'images/Ellipse 511.svg';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import { checkAuthority } from 'utils/functions';
import {
  Box,
  Grid,
  Tooltip,
  IconButton,
  CardMedia,
  Drawer,
  Button,
  TextField,
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import Typography from '@material-ui/core/Typography';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import moment from 'moment';
import makeSelectDetailBackListUser from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';
import Loading from '../Loading';
import PageHeader from '../../components/PageHeader';
import {
  clearState,
  loadBlock,
  loadDetailEvent,
  loadFloor,
  loadListDevice,
  loadMovementHis,
  setFormType,
  setOpenDrawer,
  updateDescription,
} from './actions';
import { FORM_TYPE } from './constants';
import DetailCamera from './DetailCamera';
import ModalImage from './ModalImage';
import A from '../../components/A';
import { getErrorMessage } from '../Common/function';
import VAutocomplete from '../../components/VAutocomplete';
import { getApi } from '../../utils/requestUtils';
import { SAP_SRC } from '../apiUrl';

const key = 'detailBackListUser';

const searchParams = {
  block: null,
  floor: null,
};

export function DetailBackListUser({
  userAuthority,
  match,
  detailBackListUser,
  onLoadListDevice,
  setOpenDetailsDrawer,
  onLoadMovementHis,
  onLoadDetailEvent,
  onSetFormType,
  onUpdateDescription,
  onClearState,
}) {
  const intl = useIntl();
  const classes = useStyles();
  const {
    loading,
    devices,
    mapFloor,
    openDetailsDrawer,
    detailEvent,
    movementHistory,
    form,
    needReload,
  } = detailBackListUser;
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });
  const history = useHistory();

  const resourceCode = 'cameraai/events';
  const scopes = checkAuthority(['update'], resourceCode, userAuthority);

  // const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [search, setSearch] = useState(searchParams);
  const [viewDetailCameraPlayback, setViewDetailCameraPlayback] =
    useState(null);
  const [viewLiveCamera, setViewLiveCamera] = useState(null);
  const [description, setDescription] = useState();
  const [modalImage, setModalImage] = useState(null);
  const [submit, setSubmit] = useState(0);
  // const [listCamera, setListCamera] = useState([]);
  // const [cursorPostion, setCursorPostion] = useState(null);
  const refMap = useRef(null);

  useEffect(() => {
    if (detailEvent) {
      setDescription(detailEvent?.description || '');
    }
  }, [detailEvent]);

  useEffect(() => {
    onLoadDetailEvent(match.params.eventId);
  }, [needReload]);

  useEffect(() => {
    if (submit > 0) {
      const data = {
        id: match.params.eventId,
        description,
      };
      onUpdateDescription(data);
    }
  }, [submit]);

  useEffect(() => {
    if (viewDetailCameraPlayback) {
      onSetFormType(FORM_TYPE.DETAIL_CAMERA.FORM);
      setOpenDetailsDrawer(false);
    }
  }, [viewDetailCameraPlayback]);

  const handleOnClickCameraTitle = (data) => {
    const params = {
      deviceId: data.id,
      date: detailEvent.timeOccur,
      uuid: detailEvent.objectId,
    };
    const liveCameraDetail = {
      name: data.deviceName,
      id: data.id,
      timeOccur: '',
      type: FORM_TYPE.DETAIL_CAMERA.ACTION.LIVE,
    };
    setViewLiveCamera(liveCameraDetail);
    onLoadMovementHis(params);
  };

  const onCloseDetailCamera = () => {
    setViewDetailCameraPlayback(null);
    onSetFormType(FORM_TYPE.DETAIL);
  };

  const movementHis = (data) => (
    <Grid
      container
      direction="row"
      style={{
        padding: '10px 0px',
        borderBottom: '1px solid rgba(60, 60, 67, 0.1)',
      }}
      key={data.id}
    >
      <Grid item xs={3}>
        {data.imageUrl && (
          <CardMedia
            image={data.imageUrl}
            title="Avatar"
            className={classes.drawerImage}
            onClick={() => {
              setModalImage(data.imageUrl);
            }}
          />
        )}
      </Grid>
      <Grid item xs={6}>
        <Typography>
          {moment(data.timeOccur * 1000).format('DD-MM-yyyy')}
        </Typography>
        <Typography>{data.deviceName}</Typography>
        <Typography>{data.blockName}</Typography>
      </Grid>
      <Grid item xs={3} style={{ textAlign: 'center', alignSelf: 'center' }}>
        <A
          onClick={() => {
            const detail = {
              name: data.deviceName,
              id: data.deviceId,
              timeOccur: data.timeOccur,
              type: FORM_TYPE.DETAIL_CAMERA.ACTION.PLAYBACK,
            };
            setViewDetailCameraPlayback(detail);
          }}
        >
          {intl.formatMessage(messages.drawer_view_detail_title)}
        </A>
      </Grid>
    </Grid>
  );

  const detailsDrawer = openDetailsDrawer && (
    <Drawer
      anchor="right"
      open={openDetailsDrawer}
      onClose={() => {
        setOpenDetailsDrawer(false);
      }}
    >
      <Box>
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
          className={classes.drawerTitle}
        >
          <Grid item xs={6} style={{ textAlignLast: 'left' }}>
            <Typography variant="h4" align="center">
              {intl.formatMessage(messages.drawer_title)}
            </Typography>
          </Grid>
          {(Date.now() - detailEvent.timeOccur * 1000) / 3600000 <= 24 && (
            <Grid item xs={6} style={{ textAlign: 'right' }}>
              <Button
                style={{
                  width: '117px',
                  height: '40px',
                  background: '#00554A',
                  boxShadow: '0px 4px 10px rgba(16, 156, 241, 0.24)',
                  borderRadius: '8px',
                  color: '#fff',
                }}
                onClick={() => {
                  setViewDetailCameraPlayback(viewLiveCamera);
                }}
              >
                {intl.formatMessage(messages.drawer_live_view_btn)}
              </Button>
            </Grid>
          )}
        </Grid>
        <Box style={{ marginTop: '10px', padding: '0px 15.41px' }}>
          {movementHistory.length > 0 &&
            movementHistory.map((his) => movementHis(his))}
        </Box>
      </Box>
    </Drawer>
  );

  const getMarkerData = (data) => {
    const left = +data.coordinatesX;
    const top = +data.coordinatesY;
    const container = {
      height: 60,
      width: 100,
    };

    const mapProps = {
      width: refMap.current?.width || 0,
      height: refMap.current?.height || 0,
    };

    const color = data.hasDetectMovement ? 'yellow' : 'red';

    const markerProps = {
      bottom: {
        className: '',
        coordinatesY: top - container.height,
        coordinatesX: left - container.width / 2,
        color,
      },
      leftBottom: {
        className: 'left bottom',
        coordinatesY: top - container.height + 7,
        coordinatesX: left + 15,
        color,
      },
      leftMiddle: {
        className: 'left middle',
        coordinatesY: top - (container.height - 20) / 2,
        coordinatesX: left + 16,
        color,
      },
      leftTop: {
        className: 'left top',
        coordinatesY: top + 10,
        coordinatesX: left + 15,
        color,
      },
      reverse: {
        className: 'reverse',
        coordinatesY: top + 20,
        coordinatesX: left - container.width / 2,
        color,
      },
      rightBottom: {
        className: 'right bottom',
        coordinatesY: top - container.height + 7,
        coordinatesX: left - container.width - 18,
        color,
      },
      rightMiddle: {
        className: 'right middle',
        coordinatesY: top - (container.height - 20) / 2,
        coordinatesX: left - container.width - 16,
        color,
      },
      rightTop: {
        className: 'right top',
        coordinatesY: top + 18,
        coordinatesX: left - container.width - 14,
        color,
      },
    };

    if (
      mapProps.height < container.height ||
      mapProps.width < container.width
    ) {
      return { ...markerProps.bottom };
    }

    if (left - container.width / 2 < 0) {
      if (top + container.height / 2 > mapProps.height) {
        return { ...markerProps.leftBottom };
      }
      if (top - container.height / 2 < 0) {
        return { ...markerProps.leftTop };
      }
      return { ...markerProps.leftMiddle };
    }

    if (left + container.width / 2 > mapProps.width) {
      if (top + container.height / 2 > mapProps.height) {
        return { ...markerProps.rightBottom };
      }
      if (top - container.height / 2 < 0) {
        return { ...markerProps.rightTop };
      }
      return { ...markerProps.rightMiddle };
    }

    if (top - container.height / 2 - 30 < 0) {
      return { ...markerProps.reverse };
    }

    return { ...markerProps.bottom };
  };

  const detailDevice = (data, key) => {
    const marker = getMarkerData(data);
    return (
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions,jsx-a11y/click-events-have-key-events
      <div
        key={key}
        style={{
          left: `${marker.coordinatesX}px`,
          top: `${marker.coordinatesY}px`,
          position: 'absolute',
        }}
        onClick={() => {
          if (data.hasDetectMovement) {
            handleOnClickCameraTitle(data);
          }
        }}
      >
        <Tooltip title={data.deviceName}>
          <CameraContainer
            className={`marker ${marker.color} ${marker.className}`}
          >
            <div>{data.deviceName}</div>
          </CameraContainer>
        </Tooltip>
      </div>
    );
  };

  // const addCamera = (coordinatesX, coordinatesY) => {
  //   setListCamera([
  //     ...listCamera,
  //     {
  //       coordinatesY,
  //       coordinatesX,
  //       deviceName: 'asdasdasdasdasdasdadasdasdasd',
  //     },
  //   ]);
  // };

  return (
    <div style={{ height: '100%' }}>
      <Helmet>
        <title>{intl.formatMessage(messages.header)}</title>
        <meta name="description" content="Description of DetailBackListUser" />
      </Helmet>
      {loading && <Loading />}
      {detailsDrawer}
      {modalImage && (
        <ModalImage
          imageUrl={modalImage}
          onClose={() => {
            setModalImage(null);
          }}
        />
      )}
      {form === FORM_TYPE.DETAIL_CAMERA.FORM && (
        <DetailCamera
          device={viewDetailCameraPlayback}
          onClose={onCloseDetailCamera}
        />
      )}
      {form === FORM_TYPE.DETAIL && (
        <React.Fragment>
          <PageHeader
            title={intl.formatMessage(messages.header)}
            showBackButton
            onBack={() => {
              onClearState();
              history.push(`/camera-ai/list-event`);
            }}
          />
          <Box className={classes.detailContainer}>
            <Grid container direction="column" spacing={2}>
              <Grid item>
                <Typography style={{ fontWeight: 600, fontSize: '16px' }}>
                  {intl.formatMessage(messages.user_title)}
                </Typography>
              </Grid>
              <Grid item container style={{ marinTop: '5px' }}>
                <Grid item xs={2}>
                  <CardMedia
                    image={detailEvent?.imageUrl || MaskGroup}
                    title="Avatar"
                    className={classes.avatar}
                  />
                </Grid>
                <Grid item container xs={10} direction="row">
                  <Grid item xs={6}>
                    <Typography
                      style={{ fontSize: '24px', lineHeight: '28px' }}
                    >
                      {detailEvent.userDetectedName}
                    </Typography>
                  </Grid>
                  <Grid item container xs={6}>
                    <Typography
                      style={{ fontSize: '12px', lineHeight: '16px' }}
                    >
                      {intl.formatMessage(messages.edit_description_title)}{' '}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={3}
                    style={{
                      fontSize: '20px',
                      lineHeight: '23px',
                      opacity: '0.6',
                    }}
                  >
                    <Typography display="block">
                      {intl.formatMessage(messages.id_title)}
                    </Typography>
                    <Typography>
                      {intl.formatMessage(messages.time_occur_title)}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography>{detailEvent.objectId}</Typography>
                    <Typography>
                      {moment(detailEvent.timeOccur * 1000).format(
                        'DD-MM-YYYY',
                      )}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <TextareaAutosize
                      disabled={!scopes.update}
                      style={{
                        height: '100%',
                        width: '100%',
                        border: '0.5px solid #117B5B',
                        borderRadius: '8px',
                        padding: '8px 23px',
                        resize: 'none',
                      }}
                      rows={4}
                      value={description}
                      onChange={(e) => {
                        setDescription(e.target.value);
                      }}
                      onBlur={() => {
                        setSubmit(submit + 1);
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
          <Box style={{ marginTop: '26.31px' }}>
            <Grid container direction="row" justify="space-between">
              <Grid item xs={6}>
                <Typography style={{ fontWeight: 600, fontSize: '16px' }}>
                  {intl.formatMessage(messages.search_text_title)}
                </Typography>
                <Typography style={{ fontSize: '14px', opacity: 0.6 }}>
                  {intl.formatMessage(messages.search_text_description)}
                </Typography>
              </Grid>
              <Grid
                item
                container
                xs={6}
                direction="row"
                className={classes.flexEnd}
              >
                <Grid item xs={5}>
                  <VAutocomplete
                    value={search.block || ''}
                    fullWidth
                    virtual={false}
                    noOptionsText="Không có dữ liệu"
                    getOptionLabel={(option) => option?.blockName || ''}
                    firstIndex={1}
                    loadData={() =>
                      new Promise((resolve, reject) => {
                        getApi(`${SAP_SRC}/blocks`)
                          .then((result) => {
                            resolve({
                              data: [...result.rows],
                              totalCount: result?.count || 0,
                            });
                          })
                          .catch((err) => reject(getErrorMessage(err)));
                      })
                    }
                    getOptionSelected={(option, selected) =>
                      option.blockId === selected.blockId
                    }
                    onChange={(e, value) => {
                      setSearch({ floor: null, block: value });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        placeholder="Chọn tòa nhà"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={5}>
                  <VAutocomplete
                    value={search.floor || ''}
                    fullWidth
                    virtual={false}
                    noOptionsText="Không có dữ liệu"
                    getOptionLabel={(option) => option?.floorName || ''}
                    firstIndex={1}
                    loadData={() =>
                      new Promise((resolve, reject) => {
                        if (!search.block) {
                          resolve({
                            data: [],
                            totalCount: 0,
                          });
                          return;
                        }
                        getApi(`${SAP_SRC}/floors/search`, {
                          blockId: search.block.blockId,
                        })
                          .then((result) => {
                            resolve({
                              data: [...result],
                              totalCount: result?.length || 0,
                            });
                          })
                          .catch((err) => reject(getErrorMessage(err)));
                      })
                    }
                    getOptionSelected={(option, selected) =>
                      option.floorId === selected.floorId
                    }
                    onChange={(e, value) => {
                      setSearch({ ...search, floor: value });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        placeholder="Chọn tầng"
                      />
                    )}
                  />
                </Grid>
                <Grid item>
                  <Tooltip
                    title={
                      !search.block?.blockId || !search.floor?.floorId
                        ? intl.formatMessage(messages.user_title)
                        : ''
                    }
                  >
                    <IconButton
                      style={{
                        width: '58px',
                        height: '40px',
                        background: `${
                          !search.block?.blockId || !search.floor?.floorId
                            ? '#b5b5b5'
                            : '#00554A'
                        }`,
                        boxShadow: '0px 4px 10px rgba(16, 156, 241, 0.24)',
                        borderRadius: '8px',
                        padding: '2px 16px',
                      }}
                      onClick={() => {
                        if (search.block.blockId && search.floor.floorId) {
                          const params = {
                            blockId: search.block.blockId,
                            floorId: search.floor.floorId,
                            uuid: detailEvent.objectId,
                            date: detailEvent.timeOccur,
                          };
                          onLoadListDevice(params);
                        }
                      }}
                    >
                      <SearchIcon fontSize="small" style={{ color: '#fff' }} />
                    </IconButton>
                  </Tooltip>
                </Grid>
              </Grid>
            </Grid>
          </Box>
          {/* eslint-disable-next-line react/button-has-type */}
          {/* <button onClick={handleDemo}>demo map</button> */}
          {devices.length > 0 && mapFloor && (
            // eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
            <div
              style={{
                overflow: 'auto',
                position: 'relative',
                height: '480px',
              }}
            >
              <img src={mapFloor} alt="demo" ref={refMap} />
              {devices.map((data) => detailDevice(data, devices.indexOf(data)))}
              {/* {listCamera.map(data => */}
              {/*  detailDevice(data, listCamera.indexOf(data)), */}
              {/* )} */}
            </div>
          )}
          {(devices.length === 0 || !mapFloor) && NotFoundPage}
        </React.Fragment>
      )}
    </div>
  );
}

const useStyles = makeStyles({
  detailContainer: {
    width: '100%',
    height: '231.54px',
    background: '#ffffff',
    boxShadow: '0px 6px 18px rgba(0, 0, 0, 0.06)',
    borderRadius: '10px',
    padding: '26px 48px',
  },
  avatar: {
    display: 'inline-block',
    height: '125.88px',
    width: '125.88px',
    borderRadius: '8px',
  },
  flexEnd: {
    justifyContent: 'flex-end',
  },
  drawerTitle: {
    width: '427px',
    padding: '15.41px',
  },
  drawerImage: {
    display: 'inline-block',
    height: '56px',
    width: '56px',
  },
});

const CameraContainer = styled.div`
  font-size: 15px;
  display: inline-block;
  padding: 10px;
  width: 100px;
  height: 40px;
  text-align: center;
  border-radius: 4px;
  color: #fff;
  position: relative;

  & div {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &:hover {
    z-index: 1;
  }

  &:before {
    position: absolute;
    width: 2px;
    height: 14.58px;
    top: 100%;
    left: 50%;
    content: '';
    background: #999;
  }

  &:after {
    left: 50%;
    margin-left: -5px;
    top: calc(100% + 14.58px);
    position: absolute;
    width: 12px;
    height: 12px;
    content: '';
    background: #fff;
    border: 4px solid #999;
    border-radius: 50%;
  }

  &.left {
    &:before {
      top: calc(100% - 4px);
      left: -5px;
      height: 16px;
      transform: rotate(45deg);
    }
    &:after {
      left: -15px;
      top: calc(100% + 7px);
    }
    &.middle {
      &:before {
        height: 18px;
        top: calc(50% - 9px);
        transform: rotate(90deg);
      }
      &:after {
        top: calc(50% - 6px);
      }
    }
    &.top {
      &:before {
        top: auto;
        bottom: calc(100% - 4px);
        transform: rotate(-45deg);
      }
      &:after {
        top: auto;
        bottom: calc(100% + 7px);
      }
    }
  }
  &.reverse {
    &:before {
      height: 16px;
      top: -16px;
    }
    &:after {
      top: -26px;
    }
  }

  &.right {
    &:before {
      top: calc(100% - 4px);
      right: -6px;
      left: auto;
      height: 16px;
      transform: rotate(-45deg);
    }
    &:after {
      right: -22px;
      left: auto;
      top: calc(100% + 7px);
    }
    &.middle {
      &:before {
        height: 18px;
        top: calc(50% - 9px);
        transform: rotate(90deg);
      }
      &:after {
        top: calc(50% - 6px);
      }
    }
    &.top {
      &:before {
        top: auto;
        bottom: calc(100% - 4px);
        transform: rotate(45deg);
        height: 20px;
      }
      &:after {
        top: auto;
        bottom: calc(100% + 10px);
      }
    }
  }
  &.red {
    background: #e24545;
    &:before {
      background-color: #e24545;
    }
    &:after {
      background: #fff;
      border-color: #e24545;
    }
  }
  &.yellow {
    &:hover {
      background: #ffb84f;
    }
    background: #ff9800;
    &:before {
      background-color: #ff9800;
    }
    &:after {
      background: #fff;
      border-color: #ff9800;
    }
  }
`;
// Marker CSS

const NotFoundPage = (
  <div
    style={{
      height: '50%',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
    }}
  >
    <div
      style={{
        position: 'relative',
        top: '50%',
        transform: 'translateY(-50%)',
        alignSelf: 'baseline',
      }}
    >
      {NotFoundImage && (
        <CardMedia
          image={NotFoundImage}
          title="No content"
          style={{ width: '172.3px', height: '142.97px' }}
        />
      )}
      <p style={{ textAlign: 'center' }}>Không có dữ liệu</p>
    </div>
  </div>
);

DetailBackListUser.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  detailBackListUser: makeSelectDetailBackListUser(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onLoadListBlock: () => {
      dispatch(loadBlock());
    },
    onLoadListFloor: (evt) => {
      dispatch(loadFloor(evt));
    },
    onLoadListDevice: (evt) => {
      dispatch(loadListDevice(evt));
    },
    setOpenDetailsDrawer: (evt) => {
      dispatch(setOpenDrawer(evt));
    },
    onLoadMovementHis: (evt) => {
      dispatch(loadMovementHis(evt));
    },
    onLoadDetailEvent: (evt) => {
      dispatch(loadDetailEvent(evt));
    },
    onSetFormType: (evt) => {
      dispatch(setFormType(evt));
    },
    onUpdateDescription: (evt) => {
      dispatch(updateDescription(evt));
    },
    onClearState: () => {
      dispatch(clearState());
    },
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(DetailBackListUser);
