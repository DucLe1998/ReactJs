/**
 *
 * DetailBackListUser
 *
 */

import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import MaskGroup from 'images/MaskGroup.svg';
import { differenceInDays } from 'date-fns';

// Ellipse 511.svg
// import AnchorIcon from 'images/Ellipse 511.svg';
import Img from 'components/Imge';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import { Box, Grid, CardMedia } from '@material-ui/core';
import { useHistory, Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import _ from 'lodash';
import { DataGrid, DateBox, Button } from 'devextreme-react';
import { Column, Paging } from 'devextreme-react/data-grid';
import Tooltip from '@material-ui/core/Tooltip';
import makeSelectDetailBackListUser from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';
import Loading from '../Loading';
import PageHeader from '../../components/PageHeader';
import { FORM_TYPE } from './constants';
import ModalImage from './ModalImage';
import { getErrorMessage } from '../Common/function';
import { getApi, putApi } from '../../utils/requestUtils';
import { API_CAMERA_AI } from '../apiUrl';
import { getImageUrlFromMinio } from '../../utils/utils';
import { showError, showSuccess } from '../../utils/toast-utils';
// import Playback from '../ListUserCameraAi/items/Playback';
// import { ACTION } from '../ListUserCameraAi/constants';

const key = 'detailBackListUser';

export function Detail({ match }) {
  const intl = useIntl();
  const classes = useStyles();
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });
  const history = useHistory();
  // const [viewDetailCameraPlayback, setViewDetailCameraPlayback] = useState(
  //   null,
  // );
  const [movementHistory, setMovementHistory] = useState([]);
  const [description, setDescription] = useState();
  const [modalImage, setModalImage] = useState(null);
  //   const [clickSearchBtn, setClickSearchBtn] = useState(0); // search cam detected
  const [submit, setSubmit] = useState(0); // update description
  const [reload, setReload] = useState(0); // get detail
  const [loading, setLoading] = useState(false);
  const [detailEvent, setDetailEvent] = useState(null);
  const [form, setForm] = useState(FORM_TYPE.DETAIL);
  const [dateBoxVal, setDateboxVal] = useState(null);
  const now = new Date().getTime();

  const fetchDetailEvent = () => {
    setLoading(true);
    getApi(API_CAMERA_AI.DETAIL_EVENT_API_3_2(match.params.eventId))
      .then(res => {
        setDetailEvent(res.data);
      })
      .catch(err => {
        showError(getErrorMessage(err));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleUpdateDescription = () => {
    if (!_.isEqual(detailEvent?.description, description)) {
      setLoading(true);
      putApi(API_CAMERA_AI.EDIT_DESCRIPTION_3_2(match.params.eventId), {
        description,
      })
        .then(() => {
          showSuccess('cập nhật thành công');
          setReload(reload + 1);
        })
        .catch(err => {
          showError(getErrorMessage(err));
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const loadMovementHistory = () => {
    const param = {
      uuid: detailEvent?.objectId,
      date: dateBoxVal,
    };
    setLoading(true);
    getApi(API_CAMERA_AI.MOVEMENT_HISTORY_3_2, param)
      .then(res => {
        setMovementHistory(res.data);
      })
      .catch(err => {
        showError(getErrorMessage(err));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (detailEvent) {
      setDescription(detailEvent?.description || '');
      setDateboxVal(detailEvent?.timeOccur || null);
    }
  }, [detailEvent]);

  useEffect(() => {
    if (match.params.eventId) fetchDetailEvent();
  }, [match.params.eventId, reload]);

  useEffect(() => {
    if (submit > 0) {
      handleUpdateDescription();
    }
  }, [submit]);

  useEffect(() => {
    if (dateBoxVal) {
      loadMovementHistory();
    } else {
      setMovementHistory([]);
    }
  }, [dateBoxVal]);

  // const onCloseDetailCamera = () => {
  //   setViewDetailCameraPlayback(null);
  //   setForm(FORM_TYPE.DETAIL);
  // };

  const renderImageCell = ({ value }) => (
    <Fragment>
      <Img
        src={getImageUrlFromMinio(value)}
        style={{ maxWidth: '91px', height: '56px', minWidth: '56px' }}
      />
    </Fragment>
  );

  const renderTimeOccurCell = ({ value }) => (
    <span>{new Date(value).toTimeString().substr(0, 8) || ''}</span>
  );

  const renderZoneCell = ({ data }) => (
    <span>{`${data?.zoneName || ''} - ${data?.blockName ||
      ''} - ${data?.floorName || ''} `}</span>
  );

  const renderPlaybackCell = ({ data }) => {
    const link = `/camera-ai/list-item/playback/${data.deviceId}/${
      data.timeOccur
    }`;
    return (
      <Link
        to={{
          pathname: link,
          // state: {
          //   deviceName: data.deviceName,
          //   deviceId: data.deviceId,
          //   timeOccur: data.timeOccur,
          //   action: ACTION.PLAYBACK,
          // },
        }}
      >
        <Button type="success" text="Xem lại" className={classes.button} />
      </Link>
    );
  };

  const renderLiveCell = ({ data }) => {
    const dateDiff = differenceInDays(now, data.timeOccur);
    return (
      <Link
        to={{
          pathname: `/camera-ai/list-item/live/${data.deviceId}/${
            data.timeOccur
          }`,
          // state: {
          //   deviceName: data.deviceName,
          //   deviceId: data.deviceId,
          //   timeOccur: data.timeOccur,
          //   action: ACTION.LIVE,
          // },
        }}
        style={dateDiff != 0 ? { pointerEvents: 'none' } : null}
      >
        <Button
          type="success"
          text="Xem trực tiếp"
          className={classes.button}
          disabled={dateDiff != 0}
        />
      </Link>
    );
  };

  const columns = [
    {
      dataField: 'imageUrl',
      caption: 'Ảnh từ camera',
      cellRender: renderImageCell,
      alignment: 'center',
    },
    {
      dataField: 'timeOccur',
      caption: 'Thời gian',
      cellRender: renderTimeOccurCell,
      alignment: 'center',
    },
    {
      caption: 'khu vực',
      alignment: 'center',
      cellRender: renderZoneCell,
    },
    {
      dataField: 'deviceName',
      caption: 'Tên camera',
      alignment: 'center',
    },
    {
      caption: 'Xem lại',
      alignment: 'center',
      cellRender: renderPlaybackCell,
    },
    {
      caption: 'Xem trực tiếp',
      alignment: 'center',
      cellRender: renderLiveCell,
    },
  ];

  return (
    <div style={{ height: '100%' }}>
      <Helmet>
        <title>{intl.formatMessage(messages.header)}</title>
        <meta name="description" content="Description of DetailBackListUser" />
      </Helmet>
      {loading && <Loading />}
      {modalImage && (
        <ModalImage
          imageUrl={modalImage}
          onClose={() => {
            setModalImage(null);
          }}
        />
      )}
      {/* {form === FORM_TYPE.DETAIL_CAMERA.FORM && (
        <Playback
          device={viewDetailCameraPlayback}
          onClose={onCloseDetailCamera}
          screen="/camera-ai/list-event/black-list-user/"
        />
      )} */}
      {form === FORM_TYPE.DETAIL && (
        <React.Fragment>
          <PageHeader
            title={intl.formatMessage(messages.header)}
            showBackButton
            onBack={() => {
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
              <Grid item container>
                <Grid item xs={2}>
                  <Img
                    src={getImageUrlFromMinio(detailEvent?.imageUrl)}
                    title="Avatar"
                    style={{
                      height: '125.88px',
                      width: '125.88px',
                      borderRadius: '8px',
                    }}
                  />
                </Grid>
                <Grid item container xs={10} direction="row">
                  <Grid item xs={6} container alignItems="center" spacing="0">
                    <Grid item xs={12}>
                      <Tooltip title={detailEvent?.objectName || ''}>
                        <div className={classes.overtext}>
                          {detailEvent?.objectName || ''}
                        </div>
                      </Tooltip>
                      <Tooltip title={detailEvent?.objectId}>
                        <div
                          className={classes.overtext}
                          style={{
                            color: 'rgba(60, 60, 67, 0.6)',
                          }}
                        >
                          Mã đối tượng: {detailEvent?.objectId}
                        </div>
                      </Tooltip>
                    </Grid>
                  </Grid>
                  <Grid item container xs={6}>
                    <Grid item xs={12}>
                      <Typography
                        style={{ fontSize: '12px', lineHeight: '16px' }}
                      >
                        {intl.formatMessage(messages.edit_description_title)}{' '}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <TextareaAutosize
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
                        onChange={e => {
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
            </Grid>
          </Box>
          <PageHeader title="Lộ trình di chuyển của đối tượng">
            <DateBox
              openOnFieldClick
              type="date"
              color="#FFF"
              width={200}
              onValueChanged={e => {
                if (e?.value) setDateboxVal(new Date(e.value).getTime());
              }}
              inputAttr={{
                readonly: true,
              }}
              acceptCustomValue={false}
              displayFormat="dd/MM/yyyy"
              max={now}
              value={dateBoxVal}
              showClearButton={false}
            />
          </PageHeader>
          <DataGrid
            dataSource={movementHistory}
            noDataText="Không có dữ liệu"
            className={classes.dataGrid}
            style={{
              minHeight: movementHistory?.length > 0 ? '' : '300px',
            }}
            allowColumnResizing
            showRowLines
            showBorders
            showColumnLines={false}
            rowAlternationEnabled
            sorting={{ mode: 'none' }}
          >
            <Paging enabled={false} />
            {columns.map((defs, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <Column {...defs} key={index} />
            ))}
          </DataGrid>
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
  dataGrid: {
    width: '100%',
    '& .dx-datagrid-content .dx-datagrid-table tbody td': {
      verticalAlign: 'middle',
      height: '50px',
    },
  },
  button: {
    backgroundColor: '#00554a !important',
    borderRadius: '10px',
  },
  overtext: {
    maxWidth: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontSize: '15px',
    whiteSpace: 'nowrap',
  },
});

Detail.propTypes = {};

const mapStateToProps = createStructuredSelector({
  detailBackListUser: makeSelectDetailBackListUser(),
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

export default compose(withConnect)(Detail);
