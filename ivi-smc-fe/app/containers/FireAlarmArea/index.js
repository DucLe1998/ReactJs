/**
 *
 * FireAlarmArea
 *
 */

import React, {
  Fragment,
  memo,
  useCallback,
  useEffect,
  useState,
  useRef,
} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
// import { checkAuthority } from 'utils/functions';
import {
  // callApiExportFile,
  // callApiWithConfig,
  delApi,
  getApi,
  // METHODS,
} from 'utils/requestUtils';
import { showError, showSuccess } from 'utils/toast-utils';
import { getErrorMessage } from 'containers/Common/function';
import Img from 'components/Imge';
import { buildUrlWithToken } from 'utils/utils';
import { Link } from 'react-router-dom';
import Loading from 'containers/Loading';
import { HiOutlineUpload } from 'react-icons/hi';
import { DataGrid, Popup } from 'devextreme-react';
import {
  Column,
  LoadPanel,
  Paging,
  Scrolling,
} from 'devextreme-react/data-grid';
import PopupDelete from 'components/Custom/popup/PopupDelete';
import { IconFilter, IconAdd, IconEdit, IconDelete } from 'constant/ListIcons';
import { FIRE_ALARM_API } from 'containers/apiUrl';
import _ from 'lodash';
import Tooltip from '@material-ui/core/Tooltip';
import PageHeader from '../../components/PageHeader';
import IconBtn from '../../components/Custom/IconBtn';
import saga from './saga';
import reducer from './reducer';
import makeSelectFireAlarmArea from './selectors';
import Filter from './components/Filter';
import { useStyles } from './styles';
import ImportPopup from './components/ImportPopup';

const key = 'fireAlarmArea';

const initParams = {
  locationName: '',
  limit: 25,
  page: 1,
  camera: null,
  device: null,
  floor: null,
};
export function FireAlarmArea({ userAuthority }) {
  // const classes = useStyles();
  const intl = useIntl();
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });
  const classes = useStyles();

  // const resourceCode = 'cameraai/data-users';
  // const scopes = checkAuthority(
  //   ['get', 'update', 'delete', 'create', 'list'],
  //   resourceCode,
  //   userAuthority,
  // );
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState(initParams);
  const [deleteData, setDeleteData] = useState(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [data, setData] = useState(null);
  const [showPopupFilter, setShowPopupFilter] = useState(false);
  const [openImportPopup, setOpenImportPopup] = useState(false);

  const loadData = useCallback(() => {
    const payload = {
      locationName: search.locationName || null,
      page: search.page,
      limit: search.limit,
      cameraId: search?.camera?.id || null,
      deviceId: search?.device?.deviceId || null,
      floorId: search?.floor?.id || null,
    };
    setLoading(true);
    getApi(FIRE_ALARM_API.LIST_FAS, _.pickBy(payload))
      .then(res => {
        setData(res.data);
      })
      .catch(err => {
        showError(getErrorMessage(err));
      })
      .finally(() => {
        setLoading(false);
      });
  });
  useEffect(() => {
    loadData();
  }, [search]);

  const renderImageCell = ({ value }) => (
    <Fragment>
      <Img
        src={buildUrlWithToken(value)}
        style={{ maxWidth: '91px', height: '56px', minWidth: '56px' }}
      />
    </Fragment>
  );

  const renderContent = ({ data }) => (
    <Fragment>
      <Tooltip title={data.locationName}>
        <Link to={{ pathname: `/fire-alarm-area/${data.locationId}/view` }}>
          <div
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              width: '350px',
            }}
          >
            {data?.locationName || ''}
          </div>
        </Link>
      </Tooltip>
    </Fragment>
  );

  const renderActionCell = ({ data }) => (
    <Fragment>
      <div className="center-content">
        <Link to={`/fire-alarm-area/${data.locationId}/edit`}>
          <IconBtn
            icon={
              <img src={IconEdit} alt="" style={{ width: 20, height: 20 }} />
            }
            showTooltip="Sửa"
          />
        </Link>
        <IconBtn
          icon={
            <img src={IconDelete} alt="" style={{ width: 20, height: 20 }} />
          }
          onClick={() => {
            setDeleteData(data);
            setShowDeletePopup(true);
          }}
          showTooltip="Xóa"
        />
      </div>
    </Fragment>
  );

  const renderCameraCell = ({ data }) => {
    const cameras = data?.cameras
      ?.filter(cam => cam.id !== null)
      .map(cam => cam.name)
      .join(', ');
    return (
      <Tooltip title={cameras}>
        <span>{cameras}</span>
      </Tooltip>
    );
  };

  const columns = [
    {
      caption: 'STT',
      cellRender: props =>
        props?.rowIndex + 1 + search.limit * (search.page - 1),
      alignment: 'center',
      width: 50,
    },
    {
      dataField: 'directionFileUrl',
      caption: 'Ảnh khu vực',
      cellRender: renderImageCell,
      cssClass: 'valign-center',
      allowSorting: false,
    },
    {
      // dataField: 'locationName',
      cellRender: renderContent,
      caption: 'Tên khu vực',
      alignment: 'left',
      width: '20%',
      allowSorting: false,
    },
    {
      dataField: 'floorName',
      caption: 'Tầng',
      cssClass: 'valign-center',
      allowSorting: false,
    },
    {
      caption: 'Camera',
      cellRender: renderCameraCell,
      cssClass: 'valign-center',
      width: '20%',
      allowSorting: false,
    },
    {
      dataField: 'deviceName',
      caption: 'Thiết bị',
      cssClass: 'valign-center',
      allowSorting: false,
    },
    {
      caption: 'Hành động',
      cellRender: renderActionCell,
      alignment: 'center',
      allowSorting: false,
    },
  ];

  function handlePageSize(e) {
    setSearch({ ...search, page: 1, limit: e.target.value });
  }

  const handleChangeFilter = data => {
    setSearch({ ...search, ...data, page: 1 });
  };

  const deletePopup = () => (
    <PopupDelete
      onClickSave={() => handleDelete()}
      textFollowTitle="Khu vực báo cháy này sẽ bị xóa và không thể hoàn tác."
      title="Xóa khu vực báo cháy?"
      onClose={() => {
        setDeleteData(null);
        setShowDeletePopup(false);
      }}
    />
  );

  const filterPopup = () => (
    <Popup
      visible
      onHiding={() => setShowPopupFilter(false)}
      title="Bộ lọc"
      dragEnabled
      showTitle
      width="40%"
      minWidth="768px"
      height="auto"
      className={classes.popup}
    >
      <Filter
        onClose={() => setShowPopupFilter(false)}
        handleChangeFilter={handleChangeFilter}
        initValues={search}
      />
    </Popup>
  );

  const handleDelete = () => {
    setLoading(true);
    delApi(FIRE_ALARM_API.FAS_INFOR(deleteData.locationId))
      .then(() => {
        setShowDeletePopup(false);
        setDeleteData(null);
        loadData();
        showSuccess('Xóa khu vực thành công');
      })
      .catch(err => {
        showError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleChangePageIndex = pageIndex => {
    setSearch({ ...search, page: pageIndex });
  };

  return (
    <Fragment>
      <Helmet>
        <title>Danh sách khu vực báo cháy</title>
        <meta name="description" content="Description of Fire alarm" />
      </Helmet>
      {loading && <Loading />}
      {showPopupFilter && filterPopup()}
      {showDeletePopup && deletePopup()}
      {openImportPopup && (
        <ImportPopup
          onClose={setOpenImportPopup}
          reload={loadData}
          setLoading={setLoading}
        />
      )}
      <Fragment>
        <PageHeader
          title="Danh sách khu vực báo cháy"
          showSearch
          showPager
          totalCount={data?.count || 0}
          pageIndex={search.page}
          rowsPerPage={search.limit}
          handleChangePageIndex={handleChangePageIndex}
          handlePageSize={handlePageSize}
          onSearchValueChange={newVal =>
            setSearch({ ...search, locationName: newVal, page: 1 })
          }
        >
          <IconBtn
            showTooltip="Lọc"
            style={{
              backgroundColor: 'rgba(116, 116, 128, 0.08)',
              height: 36,
              width: 36,
              borderRadius: 6,
            }}
            icon={
              <img src={IconFilter} alt="" style={{ width: 20, height: 20 }} />
            }
            onClick={() => {
              setShowPopupFilter(true);
            }}
          />
          <Link to="/fire-alarm-area/add">
            <IconBtn
              showTooltip="Thêm mới"
              style={styles.iconBtnHeader}
              icon={
                <img src={IconAdd} alt="" style={{ width: 20, height: 20 }} />
              }
            />
          </Link>

          <IconBtn
            showTooltip="Tải lên"
            style={styles.iconBtnHeader}
            icon={<HiOutlineUpload color="gray" />}
            onClick={() => {
              // onUploadBtnClick();
              setOpenImportPopup(true);
            }}
          />
        </PageHeader>
        <DataGrid
          className="center-row-grid"
          dataSource={data?.rows || []}
          style={{
            height: '100%',
            maxHeight: `calc(100vh - ${50 + 84 + 25}px)`,
            width: '100%',
            maxWidth: '100%',
          }}
          columnAutoWidth
          showColumnLines={false}
          rowAlternationEnabled
          allowColumnResizing
          // sorting={{ mode: 'none' }}
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
    </Fragment>
  );
}

const styles = {
  iconBtnHeader: {
    backgroundColor: 'rgba(116, 116, 128, 0.08)',
    height: 36,
    width: 36,
    borderRadius: 6,
  },
  iconDataCell: {
    height: 36,
    width: 36,
    borderRadius: 6,
  },
};

FireAlarmArea.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  fireAlarmArea: makeSelectFireAlarmArea(),
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

export default compose(
  withConnect,
  memo,
)(FireAlarmArea);
