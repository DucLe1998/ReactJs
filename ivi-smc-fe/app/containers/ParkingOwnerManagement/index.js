/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable no-unused-vars */

import { Badge, IconButton, Tooltip, Popover, Switch } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/DeleteOutlineOutlined';
import EditIcon from '@material-ui/icons/Edit';
import axios from 'axios';
import {
  IconAdd,
  IconFilter,
  IconDelete,
  IconEdit,
  IconImport,
  IconExport,
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
import { BsX } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import A from 'components/A';
import { IconButtonHeader } from 'components/CommonComponent';
import IconBtn from 'components/Custom/IconBtn';
import PopupDelete from 'components/Custom/popup/PopupDelete';
import PageSearch from 'components/PageHeader';
import TableCustom from 'components/TableCustom';
import { getApi, putApi } from 'utils/requestUtils';
import { showError, showSuccess } from 'utils/toast-utils';
import { buildUrlWithToken } from 'utils/utils';
import ModalImage from 'components/ModalImage';
import Btn from 'components/Custom/Btn';
import { API_PARKING, API_PARKING_LOT } from '../apiUrl';
import { getErrorMessage } from '../Common/function';
import Loading from '../Loading';
import ImportOwner from './creens/ImportOwner';
import FilterMap from './creens/Filter';
import reducer from './reducer';
import saga from './saga';
import makeSelectMapIndoorManagement from './selectors';
import { useStyles } from './styled';
const initialFilter = {
  keyword: null,
  limit: 25,
  page: 1,
};
export function ParkingOwnerManagement() {
  const classes = useStyles();
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState({});
  const [exUsersCount, setExUsersCount] = useState(0);
  const [filter, setFilter] = useState(initialFilter);
  const [showPopupFilter, setShowPopupFilter] = useState(false);
  const [deleteId, setDeleteid] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [showPopupAdd, setShowPopupAdd] = useState(false);
  const [showPopupImport, setShowPopupImport] = useState(false);
  const [reload, setReload] = useState(0);

  const fetchDataSource = () => {
    setLoading(true);
    const params = {
      keyword: filter.keyword || null,
      limit: filter.limit,
      page: filter.page,
    };
    getApi(`${API_PARKING_LOT.PARKING_SUBSCRIBERS}`, _.pickBy(params))
      .then((response) => {
        setDataSource(response);
        if (response.data) {
          let maxCount = 0;
          response.data.map((x) => {
            maxCount =
              maxCount < x.exUsers.length ? x.exUsers.length : maxCount;
          });
          setExUsersCount(maxCount);
        }
      })
      .catch((err) => {
        showError(getErrorMessage(err));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleChangeFilter = (data) => {
    // setFilter({ ...filter, ...data });
    setReload(reload + 1);
  };

  useEffect(() => {
    fetchDataSource();
  }, [reload, filter]);

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
        <ImportOwner
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
      <ImportOwner
        onClose={() => setEditId(false)}
        id={editId}
        setReload={() => setReload(reload + 1)}
      />
    </Popup>
  );
  const ImportPopup = () => (
    <Popup
      visible={showPopupImport}
      onHiding={() => setShowPopupImport(!showPopupImport)}
      dragEnabled
      showTitle
      title="Thêm thuê bao"
      width="340"
      height="auto"
      maxHeight="100%"
      className={classes.popup}
    >
      <ScrollView width="100%" height="100%">
        <ImportOwner
          onClose={() => setShowPopupImport(false)}
          setReload={() => setReload(reload + 1)}
        />
      </ScrollView>
    </Popup>
  );
  const deletePopup = () => (
    <PopupDelete
      onClickSave={() => handlerDelete()}
      onClose={() => setDeleteid(null)}
      textFollowTitle="Bạn chắc chắn muốn xóa thuê bao này?"
      title="Xác nhận xóa"
    />
  );

  const handlerDelete = () => {
    const payload = {
      forceDelete: true,
      id: deleteId,
    };
    // setLoading(true);`${API_PARKING_LOT.PARKING_SUBSCRIBERS}/${deleteId}`
    axios
      .delete(`${API_PARKING_LOT.PARKING_SUBSCRIBERS}/${deleteId}`)
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

  const renderLayoutCell = ({ data }) => (
    <Tooltip title={data?.layout.fileName || ''}>
      <A
        onClick={() => setImageUrl(data.layout.fileUrl)}
        style={{ cursor: 'pointer' }}
      >
        {data.layout.fileName}
      </A>
    </Tooltip>
  );
  const exportIcon = (icon) => <img src={icon} style={{ maxHeight: 18 }} />;
  const renderActionCell = ({ data }) => (
    <div className="center-content">
      <Link to={`/parking/owner/edit/${data.id}`}>
        <IconBtn
          howTooltip="Sửa"
          icon={<img src={IconEdit} style={{ maxHeight: 18 }} />}
          style={{ padding: 5 }}
        />
      </Link>
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
  const data_users = () => {
    const dataObj = [];
    for (let i = 1; i <= exUsersCount; i++) {
      dataObj.push({
        caption: `Chủ xe ${i}`,
        cellRender: ({ data }) => (
          <div>{data.exUsers[i - 1] ? data.exUsers[i - 1].fullName : ''}</div>
        ),
      });
    }
    return dataObj;
  };
  const onSwitchBtnClick = (data) => {
    const params = {
      state:
        data.state.id == 'active'
          ? { id: 'inActive', value: 'Không hoạt động' }
          : { id: 'active', value: 'Hoạt động' },
    };
    putApi(`${API_PARKING_LOT.PARKING_SUBSCRIBERS}/${data.id}/state`, params)
      .then(() => {
        showSuccess('Thay đổi trạng thái thành công');
        setReload(reload + 1);
      })
      .catch((err) => {
        showError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const statusRenderer = ({ value, data }) => (
    <Switch
      checked={value?.id == 'active'}
      color="primary"
      onClick={() => onSwitchBtnClick(data)}
    />
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
      dataField: 'cardCsn',
      caption: 'Mã thẻ',
      alignment: 'left',
      minWidth: 140,
      width: 'auto',
    },
    {
      dataField: 'serviceName',
      caption: 'Loại vé',
      alignment: 'left',
      minWidth: 140,
      width: 'auto',
    },
    {
      dataField: 'lpn',
      caption: 'Biển số xe',
      minWidth: 140,
      width: 'auto',
    },
    {
      dataField: 'dscr',
      caption: 'Mô tả xe',
      minWidth: 140,
      width: 'auto',
    },
    ...data_users(),
    {
      dataField: 'state',
      caption: 'Trạng thái',
      cellRender: statusRenderer,
      fixed: true,
      fixedPosition: 'right',
      minWidth: 120,
      width: 'auto',
    },
    {
      caption: 'Hành động',
      cellRender: renderActionCell,
      fixed: true,
      fixedPosition: 'right',
      minWidth: 100,
      alignment: 'center',
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
        {showPopupAdd && addPopup()}
        {showPopupImport && ImportPopup()}
        {deleteId && deletePopup()}
        {editId && editPopup()}
        {imageUrl && (
          <ModalImage
            onClose={() => {
              setImageUrl(null);
            }}
            imageUrl={buildUrlWithToken(imageUrl)}
          />
        )}
        <PageSearch
          title="Quản lý thuê bao"
          showSearch
          showPager
          defaultSearch={filter.keyword}
          placeholderSearch="Nhập tên chủ xe, SĐT, biển số...."
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
          <Link to="/parking/owner/add">
            <Tooltip title="Thêm mới">
              <Badge color="primary">
                <IconButtonHeader>
                  <img src={IconAdd} alt="" style={{ width: 14, height: 14 }} />
                </IconButtonHeader>
              </Badge>
            </Tooltip>
          </Link>
          <Tooltip title="Tải xuống">
            <Badge color="primary">
              <IconButtonHeader
                style={{ padding: 0 }}
                onClick={() => {
                  // setShowPopupAdd(true);
                }}
              >
                <img src={IconExport} alt="" />
              </IconButtonHeader>
            </Badge>
          </Tooltip>
          <Tooltip title="Nhập thuê bao">
            <Badge color="primary">
              <IconButtonHeader
                style={{ padding: 0 }}
                onClick={() => {
                  setShowPopupImport(true);
                }}
              >
                <img src={IconImport} alt="" />
              </IconButtonHeader>
            </Badge>
          </Tooltip>
        </PageSearch>
      </>

      <div className={classes.tableContent}>
        <h3> Danh sách thuê bao</h3>
        {/* {useMemo(
          () => (
            <TableCustom data={dataSource?.rows || []} columns={columns}  pushClass={'table-grid center-row-grid'}/>
          ),
          [dataSource],
        )} */}
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
export default ParkingOwnerManagement;
