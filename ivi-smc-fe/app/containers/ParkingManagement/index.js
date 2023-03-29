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
import { Link } from 'react-router-dom';
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
import ModalImage from '../../components/ModalImage';
import Loading from '../Loading';
import AddParking from './creens/Add';
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
export function ParkingManagement() {
  const classes = useStyles();
  const [filter, setFilter] = useState(initialFilter);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState({});
  const [showPopupFilter, setShowPopupFilter] = useState(false);
  const [deleteId, setDeleteid] = useState(null);
  const [deleteName, setDeleteName] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [showPopupAdd, setShowPopupAdd] = useState(false);
  const [reload, setReload] = useState(0);
  const fetchDataSource = () => {
    setLoading(true);
    const params = {
      keyword: filter.keyword || null,
      limit: filter.limit,
      page: filter.page,
    };
    getApi(`${API_PARKING_LOT.PARKING_LOT}`, _.pickBy(params))
      .then((response) => {
        console.log(response);
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

  const addPopup = () => (
    <Popup
      visible={showPopupAdd}
      onHiding={() => setShowPopupAdd(!showPopupAdd)}
      dragEnabled
      showTitle
      title="Thêm bãi gửi xe"
      width="90%"
      height="auto"
      maxHeight="100%"
      className={classes.popup}
    >
      <ScrollView width="100%" height="100%">
        <AddParking
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
      <AddParking
        onClose={() => setEditId(false)}
        id={editId}
        setReload={() => setReload(reload + 1)}
      />
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
      .delete(`${API_PARKING_LOT.PARKING_LOT}/${deleteId}`)
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
  const handleChangePageIndex = (pageIndex) => {
    setFilter({ ...filter, page: pageIndex });
    setReload(reload + 1);
  };
  const handlePageSize = (e) => {
    setFilter({ ...filter, page: 1, limit: e.target.value });
    setReload(reload + 1);
  };

  const renderLinkHmi = ({ data }) => (
    <Link
      to={{
        pathname: '/parking/entry-points',
        state: { pkLot: { id: data?.id, name: data?.name } },
      }}
    >
      {data.name}
    </Link>
  );
  const renderActionCell = ({ data }) => (
    <div className="center-content">
      <Link to={`/parking/pklots/edit/${data.id}`}>
        <IconBtn
          showTooltip="Sửa"
          icon={<img src={IconEdit} style={{ maxHeight: 18 }} />}
          style={{ padding: 5 }}
        />
      </Link>
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
  const renderDataFloor = ({ data }) => (
    <div>
      {data.floors.map((col) => (
        <div className={classes.dataMerge}>{col.name}</div>
      ))}
    </div>
  );
  const renderDataType = ({ data }) => (
    <div>
      {data.floors.map((col) => (
        <div className={classes.dataMerge}>{col?.floorType?.value}</div>
      ))}
    </div>
  );
  const renderDataFreeSpot = ({ data }) => (
    <div>
      {data.floors.map((col) => (
        <div className={classes.dataMerge}>
          {col.freeSpot}/{data.freeSpot}
        </div>
      ))}
    </div>
  );
  const renderLayoutCell = ({ data }) => (
    <div>
      {data.floors.map((col) => (
        <div className={classes.dataMerge}>
          <Tooltip title={col.layoutName || ''}>
            <A
              onClick={() =>
                setImageUrl(
                  buildUrlWithToken(
                    API_FILE.DOWNLOAD_PUBLIC_FILE(col?.layoutUrl),
                  ),
                )
              }
              style={{ cursor: 'pointer' }}
            >
              {col.layoutName}
            </A>
          </Tooltip>
        </div>
      ))}
    </div>
  );
  const renderDataCell = ({ data }) => (
    <div>
      {data.floors.map((col) => (
        <div className={classes.dataMerge}>
          <Tooltip title={col.dataName || ''}>
            <a
              href={API_FILE.DOWNLOAD_PUBLIC_FILE(col?.dataUrl)}
              target="_blank"
              download
            >
              {col?.dataName}
            </a>
          </Tooltip>
        </div>
      ))}
    </div>
  );
  const renderDataVersion = ({ data }) => (
    <div>
      {data.floors.map((col) => (
        <div className={classes.dataMerge}>{col.version}</div>
      ))}
    </div>
  );
  const renderDataFloorState = ({ data }) => (
    <div>
      {data.floors.map((col) => (
        <div className={classes.dataMerge}>{col?.floorState?.value}</div>
      ))}
    </div>
  );
  const renderDataZipFile = ({ data }) => (
    <div>
      {data.floors.map((col) => (
        <div className={classes.dataMerge}>
          <Tooltip title={col.dataName || ''}>
            <A
              onClick={() => setImageUrl(col.layoutUrl)}
              style={{ cursor: 'pointer' }}
            >
              {col.dataName}
            </A>
          </Tooltip>
        </div>
      ))}
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
      caption: 'Tên bãi gửi xe',
      cellRender: renderLinkHmi,
      minWidth: 140,
      width: 'auto',
    },
    {
      dataField: 'state.value',
      caption: 'Trạng thái bãi xe',
      minWidth: 140,
      width: 'auto',
    },
    {
      caption: 'Tầng',
      cellRender: renderDataFloor,
      minWidth: 60,
      width: 'auto',
    },
    {
      caption: 'Loại bãi xe',
      cellRender: renderDataType,
      minWidth: 140,
      width: 'auto',
    },
    {
      caption: 'Số chỗ trống/Tổng',
      alignment: 'center',
      minWidth: 120,
      width: 'auto',
      cellRender: renderDataFreeSpot,
    },
    {
      caption: 'Layout hầm',
      cellRender: renderLayoutCell,
      minWidth: 140,
      width: 'auto',
      alignment: 'left',
    },
    {
      dataField: 'floors.dataName',
      caption: 'Dữ liệu',
      minWidth: 140,
      width: 'auto',
      cellRender: renderDataCell,
    },
    {
      caption: 'Version',
      alignment: 'center',
      cellRender: renderDataVersion,
      minWidth: 140,
      width: 'auto',
    },
    {
      caption: 'Trạng thái tầng',
      cellRender: renderDataFloorState,
      minWidth: 100,
      width: 'auto',
      alignment: 'left',
    },
    {
      caption: 'Thao tác',
      cellRender: renderActionCell,
      alignment: 'center',
      minWidth: 100,
      width: 'auto',
      // fixed: true,
      // fixedPosition: 'right',
    },
  ];

  const onSearch = (e) => {
    setFilter({ ...filter, keyword: e, page: 1 });
  };
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
        {/* {showPopupAdd && addPopup()} */}
        {deleteId && deletePopup()}
        {/* {editId && editPopup()} */}
        {imageUrl && (
          <ModalImage
            onClose={() => {
              setImageUrl(null);
            }}
            imageUrl={buildUrlWithToken(imageUrl)}
          />
        )}
        <PageSearch
          title="Quản lý bãi xe"
          showSearch
          showPager
          defaultSearch={filter.keyword}
          placeholderSearch="Nhập tên bãi xe"
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
          {/* <Tooltip title="Lọc">
            <Badge color="primary">
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
          </Tooltip> */}
          <Link to="/parking/pklots/add">
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
          </Link>
        </PageSearch>
      </>

      <div className={classes.tableContent}>
        <h3> Danh sách bãi xe</h3>
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
export default ParkingManagement;
