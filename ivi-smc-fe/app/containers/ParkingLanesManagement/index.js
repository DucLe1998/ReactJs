/* eslint-disable no-unused-vars */

import { Badge, IconButton, Tooltip, Popover } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/DeleteOutlineOutlined';
import EditIcon from '@material-ui/icons/Edit';
import axios from 'axios';
import { IconAdd, IconFilter, IconDelete, IconEdit } from 'constant/ListIcons';
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
import { Link, useParams, useHistory, useLocation } from 'react-router-dom';
import A from '../../components/A';
import { IconButtonHeader } from '../../components/CommonComponent';
import IconBtn from '../../components/Custom/IconBtn';
import PopupDelete from '../../components/Custom/popup/PopupDelete';
import PageSearch from '../../components/PageHeader';
import TableCustom from '../../components/TableCustom';
import { getApi } from '../../utils/requestUtils';
import { showError, showSuccess } from '../../utils/toast-utils';
import { buildUrlWithToken } from '../../utils/utils';
import { API_PARKING_LOT } from '../apiUrl';
import { getErrorMessage } from '../Common/function';
import ModalImage from '../ListUserCameraAi/items/ModalImage';
import Loading from '../Loading';
import AddLanes from './creens/Add';
import Filter from './creens/Filter';
import reducer from './reducer';
import saga from './saga';
import makeSelectMapIndoorManagement from './selectors';
import { useStyles } from './styled';

const initialFilter = {
  keyword: null,
  pkLot: null,
  entrypt: null,
  limit: 25,
  page: 1,
};

export function ParkingLandesManagement({ location }) {
  const classes = useStyles();
  const state = location?.state || {};
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState({});
  const [showPopupFilter, setShowPopupFilter] = useState(false);
  const [deleteId, setDeleteid] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [showPopupAdd, setShowPopupAdd] = useState(false);
  const [filter, setFilter] = useState(initialFilter);
  const [reload, setReload] = useState(0);
  const { search } = useLocation();
  const history = useHistory();
  const isFilter = (filterOp) => {
    const { keyword, limit, page, ...filter } = filterOp;
    return Object.values(filter).filter((v) => !!v && String(v).length).length;
  };
  const [showFilter, setShowFilter] = useState(isFilter(filter));
  useEffect(() => {
    const filterUpdate = filter;
    if (state.pkLot || state.entrypt) {
      filterUpdate.pkLot = state.pkLot;
      filterUpdate.entrypt = state.entrypt;
      setFilter({ ...filterUpdate });
    }
  }, [state]);
  const fetchDataSource = async () => {
    setLoading(true);
    const params = {
      keyword: filter.keyword || '',
      pkLotId: filter?.pkLot?.id || '',
      entryptId: filter?.entrypt?.id || '',
      limit: filter.limit,
      page: filter.page,
    };
    await getApi(`${API_PARKING_LOT.PARKING_LANES}`, _.pickBy(params))
      .then((response) => {
        setDataSource(response);
      })
      .catch((err) => {
        showError(getErrorMessage(err));
      })
      .finally(() => {
        setLoading(false);
      });
    setShowFilter(isFilter(params));
  };
  useEffect(() => {
    fetchDataSource();
  }, [reload, filter]);
  const editPopup = () => (
    <Popup
      visible={editId !== null}
      onHiding={() => setEditId(null)}
      dragEnabled
      showTitle
      title="Sửa làn xe"
      width="50%"
      height="auto"
      className={classes.popup}
    >
      <AddLanes
        onClose={() => setEditId(false)}
        id={editId}
        setReload={() => setReload(reload + 1)}
      />
    </Popup>
  );
  const addPopup = () => (
    <Popup
      visible={showPopupAdd}
      onHiding={() => setShowPopupAdd(!showPopupAdd)}
      dragEnabled
      showTitle
      title="Thêm làn xe"
      width="50%"
      height="auto"
      maxHeight="100%"
      className={classes.popup}
    >
      <ScrollView width="100%" height="100%">
        <AddLanes
          onClose={() => setShowPopupAdd(false)}
          setReload={() => setReload(reload + 1)}
          filter={filter}
        />
      </ScrollView>
    </Popup>
  );
  const deletePopup = () => (
    <PopupDelete
      onClickSave={() => handlerDelete()}
      onClose={() => setDeleteid(null)}
      typeTxt="entry point"
    />
  );
  const onSuccessFilter = (values) => {
    const newParams = { ...filter, ...values, page: 1 };
    setFilter(newParams);
    setShowPopupFilter(false);
  };
  const filterPopup = () => (
    <Popup
      visible={showPopupFilter}
      onHiding={() => setShowPopupFilter(false)}
      title="Lọc danh sách làn"
      dragEnabled
      showTitle
      maxWidth="350"
      height="auto"
      className={classes.popup}
    >
      <Filter
        onSuccess={onSuccessFilter}
        handleCloseFilter={() => setShowPopupFilter(false)}
        initialValues={filter}
      />
    </Popup>
  );
  const handlerDelete = () => {
    const payload = {
      forceDelete: true,
      id: deleteId,
    };
    setLoading(true);
    axios
      .delete(`${API_PARKING_LOT.PARKING_LANES}/${deleteId}`)
      .then(() => {
        setDeleteid(null);
        showSuccess('Cập nhật thành công', {
          text: 'Dữ liệu đã được cập nhật',
        });
        setReload(reload + 1);
      })
      .catch((err) => {
        showError(getErrorMessage(err));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const stt = ({ data }) => <div className="center-content">{stt++}</div>;
  const renderActionCell = ({ data }) => (
    <div className="center-content">
      <IconBtn
        showTooltip="Sửa"
        icon={<img src={IconEdit} style={{ maxHeight: 18 }} />}
        onClick={() => {
          setEditId(data.id);
          //setEditName(data.name);
        }}
        style={{ padding: 5 }}
      />
      <IconBtn
        showTooltip="Xóa"
        icon={<img src={IconDelete} style={{ maxHeight: 18 }} />}
        onClick={() => {
          setDeleteid(data.id);
        }}
        style={{ padding: 5 }}
      />
    </div>
  );
  const renderLinkDevice = ({ data }) => (
    <Link
      to={{
        pathname: '/parking/devices',
        state: {
          pkLot: { id: data?.pkLotId, name: data?.pkLotName },
          entrypt: { id: data?.entryptId, name: data?.entryptName },
          lane: { id: data?.id, name: data?.name },
        },
      }}
    >
      {data.name}
    </Link>
  );
  const columns = [
    {
      caption: 'STT',
      alignment: 'center',
      cellRender: (props) =>
        props?.rowIndex + 1 + filter.limit * (filter.page - 1),
      minWidth: 40,
      width: 'auto',
    },
    {
      dataField: 'name',
      caption: 'Tên làn xe',
      cellRender: renderLinkDevice,
      minWidth: 140,
      width: 'auto',
      alignment: 'left',
    },
    {
      dataField: 'laneType.value',
      caption: 'Loại làn xe',
      minWidth: 140,
      width: 'auto',
      alignment: 'left',
    },
    {
      dataField: 'entryptName',
      caption: 'Tên entry point',
      minWidth: 140,
      width: 'auto',
      alignment: 'left',
    },
    {
      dataField: 'pkLotName',
      caption: 'Tên bãi xe',
      minWidth: 140,
      width: 'auto',
    },
    {
      dataField: 'state.value',
      caption: 'Trạng thái',
      minWidth: 120,
      width: 'auto',
    },
    {
      caption: 'Hành động',
      cellRender: renderActionCell,
      alignment: 'center',
      fixed: true,
      fixedPosition: 'right',
      minWidth: 100,
      width: 'auto',
    },
  ];
  const onChangePage = (e) => {
    if (!e) return;
    if (e !== filter.page) {
      setFilter({ ...filter, page: e });
      setReload(reload + 1);
    }
  };
  const onChangeLimit = (e) => {
    if (!e || !e.target) return;
    if (e.target.value !== filter.limit) {
      const lastPage = Math.ceil(dataSource?.count / e.target.value);
      setFilter({
        ...filter,
        page: filter.page > lastPage ? lastPage : filter.page,
        limit: e.target.value,
      });
      setReload(reload + 1);
    }
  };
  return (
    <>
      <Helmet>
        <title>Quản lý bãi xe</title>
      </Helmet>
      <>
        {loading && <Loading />}
        {editId && editPopup()}
        {deleteId && deletePopup()}
        {showPopupFilter && filterPopup()}
        {showPopupAdd && addPopup()}

        <PageSearch
          title="Quản lý bãi xe"
          showSearch
          showPager
          defaultSearch={filter.keyword}
          placeholderSearch="Nhập thông tin tìm kiếm"
          pageIndex={filter.page || 0}
          totalCount={dataSource?.count || 0}
          rowsPerPage={filter.limit || 0}
          handleChangePageIndex={onChangePage}
          handlePageSize={onChangeLimit}
          onSearchValueChange={(newVal) => {
            setFilter({ ...filter, keyword: newVal, page: 1 });
            setReload(reload + 1);
          }}
          showFilter={Boolean(showFilter)}
          onBack={() => {
            history.replace({
              pathname: '/parking/entry-points',
              state: location.state,
            });
          }}
        >
          <Tooltip title="Lọc">
            <Badge color="primary" badgeContent={showFilter}>
              <IconButtonHeader
                onClick={() => {
                  setShowPopupFilter(true);
                }}
              >
                <img
                  src={IconFilter}
                  alt=""
                  style={{ width: 14, height: 14 }}
                />
              </IconButtonHeader>
            </Badge>
          </Tooltip>
          <Tooltip title="Thêm mới">
            <Badge color="primary">
              <IconButtonHeader
                onClick={() => {
                  setShowPopupAdd(true);
                }}
              >
                <img src={IconAdd} alt="" style={{ width: 14, height: 14 }} />
              </IconButtonHeader>
            </Badge>
          </Tooltip>
        </PageSearch>
      </>

      <div className={classes.tableContent}>

        <h3> 
          <Link
            to={{
              pathname: '/parking/entry-points',
              state: {
                pkLot: { id: state?.pkLot?.id, name: state?.pkLot?.name },
                entrypt: { id: state?.entrypt?.id, name: state?.entrypt?.name },
              },
            }}
          >
            Quản lý entry points
          </Link>
           > Danh sách làn xe
        </h3>

        <TableCustom data={dataSource.data || []} columns={columns} style={{
          maxHeight: 'calc(100vh - 215px)',
          width: '100%',
        }} />
      </div>
    </>
  );
}
export default ParkingLandesManagement;
