/* eslint-disable no-unused-vars */

import {
  Tooltip,
  DialogActions,
  DialogTitle,
  FormHelperText,
  Grid,
  TextField,
  Badge,
} from '@material-ui/core';
import ClearIcon from '@material-ui/icons/DeleteOutlineOutlined';
import EditIcon from '@material-ui/icons/Edit';
import axios from 'axios';
import {
  IconAdd,
  IconFilter,
  IconDelete,
  IconEdit,
  IconImport,
} from 'constant/ListIcons';
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
import AddLpn from './creens/AddLpn';
import ImportAddLpn from './creens/ImportBlackList';
import Filter from './creens/Filter';
import reducer from './reducer';
import saga from './saga';
import makeSelectMapIndoorManagement from './selectors';
import { useStyles } from './styled';

const initialFilter = {
  keyword: null,
  limit: 25,
  page: 1,
};

export function ParkingLpnManagement() {
  const classes = useStyles();
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState({});
  const [showPopupFilter, setShowPopupFilter] = useState(false);
  const [deleteId, setDeleteid] = useState(null);
  const [deleteName, setDeleteName] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [showPopupAdd, setShowPopupAdd] = useState(false);
  const [filter, setFilter] = useState(initialFilter);
  const [showPopupImport, setShowPopupImport] = useState(false);
  const [reload, setReload] = useState(0);
  const fetchDataSource = async () => {
    setLoading(true);
    const params = {
      keyword: filter.keyword || '',
      limit: filter.limit,
      page: filter.page,
    };
    getApi(`${API_PARKING_LOT.PARKING_LPNS}`, _.pickBy(params))
      .then((response) => {
        setDataSource(response);
      })
      .catch((err) => {
        showError(getErrorMessage(err));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleChangeFilter = (data) => {
    setFilter({ ...filter, ...data });
    setReload(reload + 1);
  };

  useEffect(() => {
    fetchDataSource();
  }, [reload]);

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
      <AddLpn
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
      title="Thêm biển số"
      width="50%"
      height="auto"
      maxHeight="100%"
      className={classes.popup}
    >
      <ScrollView width="100%" height="100%">
        <AddLpn
          onClose={() => setShowPopupAdd(false)}
          setReload={() => setReload(reload + 1)}
        />
      </ScrollView>
    </Popup>
  );
  const deletePopup = () => (
    <PopupDelete
      onClickSave={() => handlerDelete()}
      onClose={() => setDeleteid(null)}
      textFollowTitle={`Bạn chắc chắn muốn xóa xe ${deleteName}?`}
      title="Xác nhận xóa"
    />
  );
  const ImportPopup = () => (
    <Popup
      visible={showPopupImport}
      onHiding={() => setShowPopupImport(!showPopupImport)}
      dragEnabled
      showTitle
      title="Thêm vào danh biển số xe"
      width="340"
      height="auto"
      maxHeight="100%"
      className={classes.popup}
    >
      <ScrollView width="100%" height="100%">
        <ImportBlackList
          onClose={() => setShowPopupImport(false)}
          setReload={() => setReload(reload + 1)}
        />
      </ScrollView>
    </Popup>
  );
  const handlerDelete = () => {
    const payload = {
      forceDelete: true,
      id: deleteId,
    };
    setLoading(true);
    axios
      .delete(`${API_PARKING_LOT.PARKING_LPNS}/${deleteId}`)
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
        showTooltip="Xóa"
        icon={<img src={IconDelete} style={{ maxHeight: 18 }} />}
        onClick={() => {
          setDeleteid(data.id);
          setDeleteName(data.name);
        }}
        style={{ padding: 5 }}
      />
    </div>
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
      caption: 'Biển số xe',
      alignment: 'left',
      minWidth: 100,
      width: 'auto',
    },
    {
      dataField: 'vehName',
      caption: 'Hãng xe',
      minWidth: 100,
      width: 'auto',
    },
    {
      dataField: 'model',
      caption: 'Model xe',
      minWidth: 100,
      width: 'auto',
    },
    {
      dataField: 'color',
      caption: 'Màu xe',
      minWidth: 100,
      width: 'auto',
    },
    {
      dataField: 'dscr',
      caption: 'Thông tin khác',
      minWidth: 100,
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
        <title>Quản lý thuê bao</title>
      </Helmet>
      <>
        {loading && <Loading />}
        {editId && editPopup()}
        {deleteId && deletePopup()}
        {showPopupImport && ImportPopup()}
        {showPopupAdd && addPopup()}

        <PageSearch
          title="Quản lý thuê bao"
          showSearch
          showPager
          defaultSearch={filter.keyword}
          placeholderSearch="Nhập biển số..."
          pageIndex={filter.page || 0}
          totalCount={dataSource?.count || 0}
          rowsPerPage={filter.limit || 0}
          handleChangePageIndex={onChangePage}
          handlePageSize={onChangeLimit}
          onSearchValueChange={(newVal) => {
            setFilter({ ...filter, keyword: newVal, page: 1 });
            setReload(reload + 1);
          }}
        >
          <Tooltip title="Thêm mới">
            <IconButtonHeader
              onClick={() => {
                setShowPopupAdd(true);
              }}
            >
              <img src={IconAdd} alt="" style={{ width: 14, height: 14 }} />
            </IconButtonHeader>
          </Tooltip>
          <Tooltip title="Thêm nhiều biển số từ file">
            <IconButtonHeader
              style={{ padding: 0 }}
              onClick={() => {
                setShowPopupImport(true);
              }}
            >
              <img src={IconImport} alt="" />
            </IconButtonHeader>
          </Tooltip>
        </PageSearch>
      </>

      <div className={classes.tableContent}>
        <h3> Danh sách biển số xe theo hãng</h3>
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
export default ParkingLpnManagement;
