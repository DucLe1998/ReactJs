/**
 *
 * MapIndoorManagement
 *
 */

import { Tooltip } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/DeleteOutlineOutlined';
import EditIcon from '@material-ui/icons/Edit';
import axios from 'axios';
import { IconAdd, IconFilter } from 'constant/ListIcons';
import { ScrollView } from 'devextreme-react';
import { Popup } from 'devextreme-react/popup';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import A from '../../components/A';
import { IconButtonSquare } from '../../components/CommonComponent';
import IconBtn from '../../components/Custom/IconBtn';
import PopupDelete from '../../components/Custom/popup/PopupDelete';
import PageHeader from '../../components/PageHeader';
import TableCustom from '../../components/TableCustom';
import { getApi } from '../../utils/requestUtils';
import { showError, showSuccess } from '../../utils/toast-utils';
import { buildUrlWithToken } from '../../utils/utils';
import { API_PARKING } from '../apiUrl';
import { getErrorMessage } from '../Common/function';
import ModalImage from '../ListUserCameraAi/items/ModalImage';
import Loading from '../Loading';
import AddMap from './creens/Add';
import FilterMap from './creens/Filter';
import reducer from './reducer';
import saga from './saga';
import makeSelectMapIndoorManagement from './selectors';
import { useStyles } from './styled';

const key = 'mapIndoorManagement';
const initialFilter = {
  area: null,
  zone: null,
  block: null,
  floor: null,
  limit: 25,
  page: 1,
  areaId: 19,
};

export function MapIndoorManagement() {
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });
  const intl = useIntl();

  const [filter, setFilter] = useState(initialFilter);
  const classes = useStyles();

  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState({});
  const [showPopupAdd, setShowPopupAdd] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showPopupFilter, setShowPopupFilter] = useState(false);
  const [deleteId, setDeleteid] = useState(null);
  const [reload, setReload] = useState(0);
  const [imageUrl, setImageUrl] = useState(null);

  const fetchDataSource = () => {
    setLoading(true);
    const params = {
      areaId: filter.area?.areaId || 19,
      buildingId: filter.block?.id || '',
      parkingId: filter.floor?.id || '',
      zoneId: filter.zone?.zoneId || '',
      limit: filter.limit,
      page: filter.page,
    };
    getApi(`${API_PARKING.ADD_MAP_INDOOR}`, _.pickBy(params))
      .then(response => {
        setDataSource(response.data);
      })
      .catch(err => {
        showError(getErrorMessage(err));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleChangeFilter = data => {
    setFilter({ ...filter, ...data });
    setReload(reload + 1);
  };

  useEffect(() => {
    fetchDataSource();
  }, [reload]);

  const addPopup = () => (
    <Popup
      visible={showPopupAdd}
      onHiding={() => setShowPopupAdd(!showPopupAdd)}
      dragEnabled
      showTitle
      width="50%"
      height="auto"
      maxHeight="100%"
      className={classes.popup}
    >
      <ScrollView width="100%" height="100%">
        <AddMap
          onClose={() => setShowPopupAdd(false)}
          setReload={() => setReload(reload + 1)}
        />
      </ScrollView>
    </Popup>
  );

  const editPopup = () => (
    <Popup
      visible={editId !== null}
      onHiding={() => setEditId(null)}
      dragEnabled
      showTitle
      width="50%"
      height="auto"
      className={classes.popup}
    >
      <AddMap
        onClose={() => setEditId(null)}
        id={editId}
        setReload={() => setReload(reload + 1)}
      />
    </Popup>
  );

  const filterPopup = () => (
    <Popup
      visible={showPopupFilter}
      onHiding={() => setShowPopupFilter(false)}
      title="Lọc bản đồ"
      dragEnabled
      showTitle
      width="40%"
      height="auto"
      className={classes.popup}
    >
      <FilterMap
        onClose={() => setShowPopupFilter(false)}
        handleChangeFilter={handleChangeFilter}
        initValues={filter}
      />
    </Popup>
  );

  const deletePopup = () => (
    <PopupDelete
      onClickSave={() => handlerDelete()}
      typeTxt="Bản đồ"
      onClose={() => setDeleteid(null)}
    />
  );

  const handlerDelete = () => {
    const payload = {
      forceDelete: true,
      id: deleteId,
    };
    setLoading(true);
    axios
      .delete(API_PARKING.ADD_MAP_INDOOR, {
        data: payload,
      })
      .then(() => {
        setDeleteid(null);
        showSuccess('Xóa bản đồ thành công');
        setReload(reload + 1);
      })
      .catch(err => {
        showError(getErrorMessage(err));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleChangePageIndex = pageIndex => {
    setFilter({ ...filter, page: pageIndex });
    setReload(reload + 1);
  };
  const handlePageSize = e => {
    setFilter({ ...filter, page: 1, limit: e.target.value });
    setReload(reload + 1);
  };

  // const handeDownloadFile = async (url, fileName) => {
  //   try {
  //     const res = await callApiExportFile(url, 'GET', null);
  //     FileSaver.saveAs(res, fileName);
  //   } catch (error) {
  //     showError(error);
  //   }
  // };

  const renderMapCell = ({ data }) => (
    <Fragment>
      <Tooltip title={data?.fileMapName || ''}>
        <A
          onClick={() => setImageUrl(data.fileMapUrl)}
          style={{ cursor: 'pointer' }}
        >
          {data.fileMapName}
        </A>
      </Tooltip>
    </Fragment>
  );
  const renderDataCell = ({ data }) => (
    <Fragment>
      <Tooltip title={data?.fileDataName || ''}>
        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
        <A
          href={buildUrlWithToken(data.fileDataUrl)}
          style={{ cursor: 'pointer' }}
          // onClick={() => handeDownloadFile(data.fileDataUrl, data.fileDataName)}
        >
          {data.fileDataName}
        </A>
      </Tooltip>
    </Fragment>
  );

  const renderActionCell = ({ data }) => (
    <Fragment>
      <div className="center-content">
        <IconBtn
          icon={<EditIcon fontSize="small" />}
          onClick={() => {
            setEditId(data.id);
          }}
          showTooltip={intl.formatMessage({ id: 'app.tooltip.edit' })}
        />
        <IconBtn
          icon={<ClearIcon fontSize="small" />}
          onClick={() => setDeleteid(data.id)}
          showTooltip={intl.formatMessage({ id: 'app.tooltip.delete' })}
        />
      </div>
    </Fragment>
  );

  const columns = [
    {
      caption: 'STT',
      allowSorting: false,
      cellRender: props => props?.rowIndex * filter.page + 1,
      width: '5%',
    },
    // {
    //   dataField: 'areaName',
    //   caption: 'Khu đô thị',
    //   width: '13%',
    // },
    // {
    //   dataField: 'zoneName',
    //   caption: 'Phân khu',
    //   width: '13%',
    // },
    // {
    //   dataField: 'buildingName',
    //   caption: 'Tòa nhà',
    //   width: '13%',
    // },
    {
      dataField: 'parkingName',
      caption: 'Tầng',
    },
    {
      dataField: 'version',
      caption: 'Version',
      alignment: 'left',
    },
    {
      dataField: 'fileMapName',
      caption: 'Ảnh bản đồ',
      cellRender: renderMapCell,
    },
    {
      dataField: 'fileDataName',
      caption: 'Dữ liệu',
      cellRender: renderDataCell,
    },
    {
      caption: 'Hành động',
      cellRender: renderActionCell,
      alignment: 'center',
    },
  ];

  return (
    <Fragment>
      <Helmet>
        <title>Thông tin bản đồ</title>
        <meta name="description" content="Description of MapIndoorManagement" />
      </Helmet>
      <Fragment>
        {loading && <Loading />}
        {showPopupAdd && addPopup()}
        {deleteId && deletePopup()}
        {editId && editPopup()}
        {showPopupFilter && filterPopup()}
        {imageUrl && (
          <ModalImage
            onClose={() => {
              setImageUrl(null);
            }}
            imageUrl={buildUrlWithToken(imageUrl)}
          />
        )}
        <PageHeader
          title="Thông tin bản đồ"
          // showSearch
          showPager
          totalCount={dataSource?.count ? dataSource?.count : 0}
          pageIndex={filter.page}
          rowsPerPage={filter.limit}
          handleChangePageIndex={pageIndex => {
            handleChangePageIndex(pageIndex);
          }}
          handlePageSize={handlePageSize}
          // onSearchValueChange={newVal => {
          //   setFilter({ ...filter, keyword: newVal });
          // }}
        >
          <Tooltip title="Lọc">
            <IconButtonSquare
              onClick={() => {
                setShowPopupFilter(true);
              }}
            >
              <img src={IconFilter} alt="" style={{ width: 20, height: 20 }} />
            </IconButtonSquare>
          </Tooltip>
          <Tooltip title="Thêm mới">
            <IconButtonSquare
              onClick={() => {
                setShowPopupAdd(true);
              }}
            >
              <img src={IconAdd} alt="" style={{ width: 20, height: 20 }} />
            </IconButtonSquare>
          </Tooltip>
        </PageHeader>
        {useMemo(
          () => (
            <TableCustom data={dataSource?.rows || []} columns={columns} />
          ),
          [dataSource],
        )}
      </Fragment>
    </Fragment>
  );
}

MapIndoorManagement.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  mapIndoorManagement: makeSelectMapIndoorManagement(),
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

export default compose(withConnect)(MapIndoorManagement);
