/**
 *
 * BlacklistCameraAi
 *
 */

import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import { useIntl } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import moment from 'moment';
import { useHistory, useParams } from 'react-router-dom';

import DataGrid, {
  Column,
  LoadPanel,
  Paging,
  Scrolling,
} from 'devextreme-react/data-grid';
import { Grid } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Img from 'components/Imge';
import makeSelectBlacklistCameraAi from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';
import { deleteUser, loadBlackList } from './actions';
import PageHeader from '../../components/PageHeader';
import ModalImage from '../ListUserCameraAi/items/ModalImage';
import { buildUrlWithToken, getImageUrlFromMinio } from '../../utils/utils';
import { showError } from '../../utils/toast-utils';
import { getApi } from '../../utils/requestUtils';
import { API_CAMERA_AI, CAMERA_AI_API_SRC } from '../apiUrl';
import Loading from '../Loading';

const key = 'blacklistCameraAi';

export function MovementHistory() {
  const intl = useIntl();
  const t = useHistory();
  const { id, uuid } = useParams();
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });
  const [modalImage, setModalImage] = useState(null);

  const [userInfor, setUserInfor] = useState(null);
  const [movHistories, setMovHistories] = useState([]);
  const [loading, setLoading] = useState(false);

  const onBack = () => {
    t.goBack();
  };

  const renderImageCell = ({ value }) => (
    <Fragment>
      <Img
        src={getImageUrlFromMinio(value)}
        style={{ maxWidth: '91px', height: '56px', minWidth: '56px' }}
        onClick={() => {
          setModalImage(getImageUrlFromMinio(value));
        }}
      />
    </Fragment>
  );
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
        {userInfor?.detectedImageUrls?.length > 0 &&
          userInfor.detectedImageUrls.map(imgUrl => (
            <Img
              key={Math.random()}
              src={buildUrlWithToken(imgUrl)}
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '8px',
                marginRight: '20px',
              }}
              onClick={() => {
                setModalImage(buildUrlWithToken(imgUrl));
              }}
            />
          ))}
      </div>
    ),
    [userInfor],
  );
  const columns = [
    {
      dataField: 'timeOccur',
      caption: intl.formatMessage(messages.his_popup_column_time_title),
      dataType: 'datetime',
      allowSorting: true,
      format: 'dd/MM/yyyy HH:mm',
      cssClass: 'valign-center',
    },
    {
      dataField: 'deviceName',
      caption: intl.formatMessage(messages.his_popup_column_device_title),
      cssClass: 'valign-center',
    },
    {
      dataField: 'areaName',
      caption: intl.formatMessage(messages.his_popup_column_area_title),
      cssClass: 'valign-center',
    },
    {
      dataField: 'imageUrl',
      caption: intl.formatMessage(messages.his_popup_column_image_title),
      cellRender: renderImageCell,
      cssClass: 'valign-center',
    },
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const infor = await getApi(`${CAMERA_AI_API_SRC}/blacklist-users/${id}`);
      setUserInfor(infor.data);
      const his = await getApi(
        `${API_CAMERA_AI.MOVEMENT_DETECTED_HISTORY_3_6}/${uuid}`,
      );
      setMovHistories(his.data);
    } catch (error) {
      showError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id && uuid) {
      fetchData();
    }
  }, []);

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
        title={intl.formatMessage(messages.history_title)}
        showBackButton
        onBack={() => {
          onBack();
        }}
      />
      <Grid container>
        <Grid item xs={6} />
        <Grid item xs={6}>
          <span>Ảnh của đối tượng</span>
        </Grid>
      </Grid>
      <Grid container style={{ marginTop: '5px' }}>
        <Grid item xs={6} style={{ display: 'flex' }}>
          <Img
            src={buildUrlWithToken(userInfor?.imageUrl)}
            style={{
              alignSelf: 'center',
              maxWidth: '100px',
              maxHeight: '100px',
              borderRadius: '8px',
            }}
            onClick={() => {
              setModalImage(buildUrlWithToken(userInfor?.imageUrl));
            }}
          />
          <Grid style={{ alignSelf: 'center', marginLeft: '32px' }}>
            <Typography
              style={{
                fontWeight: '500',
                fontSize: '18px',
                lineHeight: '22px',
                color: '#000000',
              }}
            >
              {userInfor?.name}
            </Typography>
            <Typography
              style={{
                fontSize: '14px',
                lineHeight: '16px',
                color: '#252525',
                opacity: '0.6',
              }}
            >
              {userInfor?.updatedAt &&
                moment(userInfor.updatedAt).format('DD/MM/YYYY hh:mm')}
            </Typography>
            <Typography
              style={{
                fontSize: '15px',
                lineHeight: '18px',
                color: 'rgba(60, 60, 67, 0.6)',
              }}
            >
              {userInfor?.uuid}
            </Typography>
          </Grid>
        </Grid>
        <Grid item xs={6}>
          {listImg}
        </Grid>
      </Grid>

      <div style={{ width: '100%', margin: '23px 0px 12px 0px' }}>
        <span
          style={{
            fontSize: '16px',
            lineHeight: '22px',
            color: '#000000',
            opacity: '0.6',
          }}
        >
          {intl.formatMessage(messages.history_title)}
        </span>
      </div>
      <DataGrid
        className="center-row-grid"
        dataSource={movHistories}
        keyExpr="id"
        // noDataText={intl.formatMessage({ id: 'app.no_data' })}
        style={{
          height: '100%',
          maxHeight: `calc(100vh - ${50 + 84 + 25}px)`,
          width: '100%',
          maxWidth: '100%',
        }}
        columnAutoWidth
        showRowLines
        showColumnLines={false}
        rowAlternationEnabled
      >
        <Paging enabled={false} />
        <Scrolling mode="infinite" />
        <LoadPanel enabled={false} />
        {columns.map((defs, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <Column {...defs} key={index} />
        ))}
      </DataGrid>
    </Fragment>
  );
}

MovementHistory.propTypes = {};

// const styles = {
//   iconBtnHeader: {
//     backgroundColor: 'rgba(116, 116, 128, 0.08)',
//     height: 36,
//     width: 36,
//     borderRadius: 6,
//   },
// };

const mapStateToProps = createStructuredSelector({
  blacklistCameraAi: makeSelectBlacklistCameraAi(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onLoadBlacklist: evt => {
      dispatch(loadBlackList(evt));
    },
    onDeleteUser: evt => {
      dispatch(deleteUser(evt));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(MovementHistory);
