/**
 *
 * BlacklistCameraAi
 *
 */

import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import { useHistory, useParams, Link } from 'react-router-dom';
import Img from 'components/Imge';
import { buildUrlWithToken, getImageUrlFromMinio } from 'utils/utils';
import { showError } from 'utils/toast-utils';
import { format, startOfDay, endOfDay } from 'date-fns';
import { makeStyles } from '@material-ui/core/styles';
import Loading from 'containers/Loading';
import PageHeader from 'components/PageHeader';
import TableCustom from 'components/TableCustom';
import { DateBox, Button } from 'devextreme-react';
import {
  Grid,
  TextareaAutosize,
  TextField,
  Typography,
} from '@material-ui/core';
import axios from 'axios';

import { getApi, postApi } from 'utils/requestUtils';
import { CAMERA_AI_API_SRC } from 'containers/apiUrl';
import { Autocomplete } from '@material-ui/lab';
import _ from 'lodash';
import reducer from '../reducer';
import saga from '../saga';
import ModalImage from '../items/ModalImage';

const key = 'listUserCameraAi';
const now = new Date().getTime();

const initFilterValues = {
  isAcDevice: { id: null, name: 'Tất cả' },
  time: new Date(),
  limit: 25,
  page: 1,
};

export function DetailUser() {
  const t = useHistory();
  const { id } = useParams();
  const classes = useStyles();
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });
  const [modalImage, setModalImage] = useState(null);

  const [userInfor, setUserInfor] = useState(null);
  const [movHistories, setMovHistories] = useState(null);
  const [loading, setLoading] = useState(false);

  const [filterValues, setFilterValues] = useState(initFilterValues);

  const handleChangePageIndex = pageIndex => {
    setFilterValues({ ...filterValues, page: pageIndex });
  };

  const handlePageSize = e => {
    setFilterValues({ ...filterValues, page: 1, limit: e.target.value });
  };

  const handleDatebox = value => {
    setFilterValues({ ...filterValues, page: 1, time: value });
  };

  const onBack = () => {
    t.push('/camera-ai/list-user');
  };

  const listImg = useMemo(
    () => (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          height: '100px',
          overflow: 'auto',
        }}
      >
        {userInfor?.faceVectors?.length > 0 &&
          userInfor.faceVectors.map(face => (
            <Img
              key={Math.random()}
              src={buildUrlWithToken(face?.url || '')}
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '8px',
                marginRight: '20px',
                cursor: 'pointer',
              }}
              onClick={() => {
                setModalImage(buildUrlWithToken(face?.url || ''));
              }}
            />
          ))}
      </div>
    ),
    [userInfor],
  );

  const renderImageCell = ({ value }) => (
    <Fragment>
      <Img
        src={getImageUrlFromMinio(value)}
        style={{
          maxWidth: '91px',
          height: '56px',
          minWidth: '56px',
          cursor: 'pointer',
        }}
        onClick={() => {
          setModalImage(getImageUrlFromMinio(value));
        }}
      />
    </Fragment>
  );

  const renderTimeCell = ({ data }) => {
    // if (data?.acEvent) {
    //   if (data?.startTimeOccur) {
    //     return format(new Date(data.startTimeOccur), 'HH:mm:ss');
    //   }
    //   if (data?.endTimeOccur) {
    //     return format(new Date(data.endTimeOccur), 'HH:mm:ss');
    //   }
    //   return '--:--:--';
    // }
    return (
      <span>
        {data?.timeOccur
          ? format(new Date(data.timeOccur), 'HH:mm:ss')
          : '--:--:--'}
      </span>
    );
  };

  const renderInOutCell = ({ data }) => {
    if (!data.acEvent) {
      return null;
    }
    if (data.startTimeOccur) {
      return 'Vào';
    }
    return 'Ra';
  };

  // const renderDeviceCell = ({ data }) => {
  //   if (data?.acEvent) {
  //     return <span>{data?.accessDeviceName ? data.accessDeviceName : ''}</span>;
  //   }
  //   return <span>{data?.deviceName ? data.deviceName : ''}</span>;
  // };

  const renderPlaybackCell = ({ data }) => {
    const link = `/camera-ai/list-item/playback/${data.deviceId}/${
      data.timeOccur
    }`;
    const isDisabled = !!data?.acEvent;
    return (
      <Link
        to={{
          pathname: link,
        }}
        style={isDisabled ? { pointerEvents: 'none' } : null}
      >
        <Button
          type="success"
          text="Xem lại"
          className={classes.button}
          disabled={isDisabled}
        />
      </Link>
    );
  };

  const renderLiveCell = ({ data }) => {
    const isDisabled = !!data?.acEvent;
    return (
      <Link
        to={{
          pathname: `/camera-ai/list-item/live/${data.deviceId}/${
            data.timeOccur
          }`,
        }}
        style={isDisabled ? { pointerEvents: 'none' } : null}
      >
        <Button
          type="success"
          text="Xem trực tiếp"
          className={classes.button}
          disabled={isDisabled}
        />
      </Link>
    );
  };

  const columns = [
    {
      dataField: 'imageUrl',
      caption: 'Ảnh từ camera',
      cellRender: renderImageCell,
      cssClass: 'valign-center',
    },
    {
      caption: 'Thời gian ghi nhận',
      cellRender: renderTimeCell,
      allowSorting: true,
      cssClass: 'valign-center',
    },
    {
      caption: 'Loại',
      cellRender: renderInOutCell,
      allowSorting: true,
      cssClass: 'valign-center',
    },
    {
      dataField: 'areaName',
      caption: 'Khu vực',
      cssClass: 'valign-center',
    },
    {
      dataField: 'deviceName',
      caption: 'Tên thiết bị',
      // cellRender: renderDeviceCell,
      cssClass: 'valign-center',
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

  const fetchMovHistories = async () => {
    setLoading(true);
    try {
      const payload = {
        startTime: startOfDay(filterValues.time)
          .valueOf()
          .toString(),
        endTime: endOfDay(filterValues.time)
          .valueOf()
          .toString(),
        uuids: [id],
        isAcDevice: filterValues?.isAcDevice?.id || null,
      };
      const params = {
        limit: filterValues.limit,
        page: filterValues.page,
      };
      const his = await axios.post(
        `${CAMERA_AI_API_SRC}/events/user-detected/search`,
        _.pickBy(payload),
        { params },
      );
      setMovHistories(his.data);
    } catch (error) {
      showError(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const infor = await getApi(`${CAMERA_AI_API_SRC}/user-detected/${id}`);
      setUserInfor(infor.data);
      const payload = {
        startTime: startOfDay(new Date())
          .valueOf()
          .toString(),
        endTime: endOfDay(new Date())
          .valueOf()
          .toString(),
        uuids: [id],
      };

      const params = {
        limit: filterValues.limit,
        page: filterValues.page,
      };
      const his = await axios.post(
        `${CAMERA_AI_API_SRC}/events/user-detected/search`,
        payload,
        { params },
      );
      setMovHistories(his.data);
    } catch (error) {
      showError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, []);

  useEffect(() => {
    if (id) {
      fetchMovHistories();
    }
  }, [filterValues]);

  const renderTable = useMemo(
    () => (
      <TableCustom
        noDataText="Không có dữ liệu"
        data={movHistories?.rows || []}
        columns={columns}
        maxHeight="calc(100vh - 56px - 84px)"
      />
    ),
    [movHistories],
  );

  return (
    <Fragment>
      {loading && <Loading />}
      {modalImage && (
        <ModalImage
          imageUrl={modalImage}
          onClose={() => {
            setModalImage(null);
          }}
        />
      )}
      <PageHeader
        title="Chi tiết đối tượng"
        showBackButton
        onBack={() => {
          onBack();
        }}
      />
      <Grid container spacing={2}>
        <Grid item container sm={6} xs={12}>
          <Grid item xs={12}>
            Đối tượng
          </Grid>
          <Grid item xs={12} sm={4}>
            <Img
              src={buildUrlWithToken(userInfor?.imageUrl || '')}
              title="Avatar"
              style={{
                height: '125.88px',
                width: '125.88px',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
              onClick={() => {
                setModalImage(buildUrlWithToken(userInfor?.imageUrl || ''));
              }}
            />
          </Grid>
          <Grid item xs={12} sm={8}>
            <Typography variant="body2" component="h3">
              Tên: {userInfor?.userName || ''}
            </Typography>
            <Typography
              variant="body2"
              component="p"
              style={{ margin: ' 8px 0px' }}
            >
              ID: {userInfor?.code || ''}
            </Typography>
            <Typography
              variant="body2"
              component="p"
              style={{ margin: ' 8px 0px' }}
            >
              Công ty: {userInfor?.companyName || ''}
            </Typography>
          </Grid>
        </Grid>
        <Grid item container sm={6} xs={12}>
          <Grid item xs={12}>
            Thêm ghi chú
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
              value={userInfor?.note || ''}
              readOnly
            />
          </Grid>
        </Grid>
        <Grid item xs={12}>
          Ảnh đối tượng
        </Grid>
        <Grid item xs={12}>
          {listImg}
        </Grid>
      </Grid>
      <PageHeader
        title="Lộ trình di chuyển"
        // showSearch
        showPager
        totalCount={movHistories?.count || 0}
        pageIndex={filterValues.page}
        rowsPerPage={filterValues.limit}
        handleChangePageIndex={handleChangePageIndex}
        handlePageSize={handlePageSize}
      >
        <Autocomplete
          className={classes.autocomplete}
          onChange={(e, value) => {
            setFilterValues({ ...filterValues, page: 1, isAcDevice: value });
          }}
          options={[
            { id: null, name: 'Tất cả' },
            { id: 'false', name: 'Camera' },
            { id: 'true', name: 'Access Control' },
          ]}
          renderInput={params => (
            <TextField
              {...params}
              variant="outlined"
              InputProps={{
                ...params.InputProps,
                startAdornment: <React.Fragment>Thiết bị:</React.Fragment>,
              }}
            />
          )}
          getOptionLabel={option => option?.name || ''}
          getOptionSelected={(option, selected) => option.id === selected.id}
        />
        <DateBox
          type="date"
          showAnalogClock={false}
          value={filterValues?.time}
          useMaskBehavior
          onValueChanged={e => {
            handleDatebox(e.value);
          }}
          placeholder="Chọn ngày"
          displayFormat="dd/MM/yyyy"
          max={now}
        />
      </PageHeader>
      {renderTable}
    </Fragment>
  );
}

const useStyles = makeStyles({
  button: {
    backgroundColor: '#00554a !important',
    borderRadius: '10px',
  },
  autocomplete: {
    width: '250px',
    backgroundColor: 'white',
    '& .MuiAutocomplete-inputRoot': {
      height: '40px',
    },
    '& .MuiInputBase-input': {
      boxSizing: 'border-box',
      height: '100%',
    },
  },
});

DetailUser.propTypes = {};

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

export default compose(withConnect)(DetailUser);
