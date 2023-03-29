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
import { API_PARKING_LOT, API_FILE } from '../apiUrl';
import { getErrorMessage } from '../Common/function';
import ModalImage from '../ListUserCameraAi/items/ModalImage';
import Loading from '../Loading';
import AddHmi from './creens/Add';
import FilterHmi from './creens/Filter';
import reducer from './reducer';
import saga from './saga';
import makeSelectMapIndoorManagement from './selectors';
import { useStyles } from './styled';
import BtnSuccess from '../../components/Button/BtnSuccess';

const initialFilter = {
  keyword: null,
  pkLot: null,
  limit: 25,
  page: 1,
};

export function ParkingEntryPoints({ location }) {
  const classes = useStyles();
  const state = location?.state || {};
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState({});
  const [showPopupFilter, setShowPopupFilter] = useState(false);
  const [deleteId, setDeleteid] = useState(null);
  const [deleteName, setDeleteName] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [showPopupAdd, setShowPopupAdd] = useState(false);
  const [reload, setReload] = useState(0);
  const [filter, setFilter] = useState(initialFilter);
  const { id } = useParams();
  const { search } = useLocation();
  const history = useHistory();
  const isFilter = (filterOp) => {
    const { keyword, limit, page, ...filter } = filterOp;
    return Object.values(filter).filter((v) => !!v && String(v).length).length;
  };
  const [showFilter, setShowFilter] = useState(isFilter(filter));
  useEffect(() => {
    const filterUpdate = filter;
    if (state.pkLot) {
      filterUpdate.pkLot = state.pkLot;
      setFilter({ ...filterUpdate });
    }
  }, [state]);
  const fetchDataSource = async () => {
    setLoading(true);
    const params = {
      keyword: filter.keyword || '',
      pkLotId: filter?.pkLot?.id || '',
      limit: filter.limit,
      page: filter.page,
    };

    await getApi(`${API_PARKING_LOT.PARKING_ENTRY_POINTS}`, _.pickBy(params))
      .then((response) => {
        // setDataSource(dataRow);
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
      title={editName}
      width="50%"
      height="auto"
      className={classes.popup}
    >
      <AddHmi
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
      title="Thêm entry points"
      width="50%"
      height="auto"
      maxHeight="100%"
      className={classes.popup}
    >
      <ScrollView width="100%" height="100%">
        <AddHmi
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
      textFollowTitle={`Bạn chắc chắn muốn xóa ${deleteName}?`}
      title="Xác nhận xóa"
    />
  );

  const handlerDelete = () => {
    const payload = {
      forceDelete: true,
      id: deleteId,
    };
    setLoading(true);
    axios
      .delete(`${API_PARKING_LOT.PARKING_ENTRY_POINTS}/${deleteId}`)
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
  const onSuccessFilter = (values) => {
    const newParams = { ...filter, ...values, page: 1 };
    setFilter(newParams);
    setShowPopupFilter(false);
    setShowFilter(isFilter(newParams));
  };
  const filterPopup = () => (
    <Popup
      visible={showPopupFilter}
      onHiding={() => setShowPopupFilter(false)}
      title="Lọc danh sách entry point"
      dragEnabled
      showTitle
      width="30%"
      height="auto"
      className={classes.popup}
    >
      <FilterHmi
        onSuccess={onSuccessFilter}
        handleCloseFilter={() => setShowPopupFilter(false)}
        initialValues={filter}
      />
    </Popup>
  );

  const renderActionCell = ({ data }) => (
    <div className="center-content">
      <Tooltip title="Sửa">
        <Badge color="primary">
          <IconBtn
            icon={<img src={IconEdit} style={{ maxHeight: 18 }} />}
            onClick={() => {
              setEditId(data.id);
              setEditName(data.name);
            }}
            style={{ padding: 5 }}
          />
        </Badge>
      </Tooltip>
      <Tooltip title="Xóa">
        <Badge color="primary">
          <IconBtn
            icon={<img src={IconDelete} style={{ maxHeight: 18 }} />}
            onClick={() => {
              setDeleteid(data.id);
              setDeleteName(data.name);
            }}
            style={{ padding: 5 }}
          />
        </Badge>
      </Tooltip>
    </div>
  );
  const renderLinkLanes = ({ data }) => (
    <Link
      to={{
        pathname: '/parking/lanes',
        state: {
          pkLot: { id: data?.pkLotId, name: data?.pkLotName },
          entrypt: { id: data?.id, name: data?.name },
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
      caption: 'Tên entry point',
      cellRender: renderLinkLanes,
      minWidth: 140,
      width: 'auto',
    },
    {
      dataField: 'pkLotName',
      caption: 'Tên bãi gửi xe',
      alignment: 'left',
      minWidth: 140,
      width: 'auto',
    },
    {
      dataField: 'swVersionName',
      caption: 'Phiên bản phần mềm',
      cellRender: ({ data }) => {
        if (data?.fileId) {
          return (
            <a
              href={API_FILE.DOWNLOAD_PUBLIC_FILE(data.fileId)}
              target="_blank"
              download
            >
              {data.swVersionName}
            </a>
          );
        }
        return data.swVersionName;
      },
      alignment: 'left',
      minWidth: 140,
      width: 'auto',
    },
    {
      dataField: 'ip',
      caption: 'Địa chỉ IP',
      minWidth: 140,
      width: 'auto',
    },
    {
      dataField: 'status.value',
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
          placeholderSearch="Nhập tên entry point"
          pageIndex={filter.page || 0}
          totalCount={dataSource?.count || 0}
          rowsPerPage={filter.limit || 0}
          handleChangePageIndex={onChangePage}
          handlePageSize={onChangeLimit}
          onSearchValueChange={(newVal) => {
            setFilter({ ...filter, keyword: newVal, page: 1 });
            setReload(reload + 1);
          }}
          onBack={() => {
            history.replace({
              pathname: '/parking/pklots',
              state: location.state,
            });
          }}
          showFilter={Boolean(showFilter)}
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
              pathname: '/parking/pklots',
            }}
          >
            Quản lý bãi xe
          </Link>
          > Danh sách entry point
        </h3>
        <TableCustom
          data={dataSource?.data || []}
          columns={columns}
          style={{
            maxHeight: 'calc(100vh - 215px)',
            width: '100%',
          }}
        />
      </div>
    </>
  );
}
export default ParkingEntryPoints;
