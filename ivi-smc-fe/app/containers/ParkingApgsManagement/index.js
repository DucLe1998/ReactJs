import { Badge, Tooltip } from '@material-ui/core';
import axios from 'axios';
import { IconAdd, IconFilter, IconDelete, IconEdit } from 'constant/ListIcons';
import { ScrollView } from 'devextreme-react';
import { Popup } from 'devextreme-react/popup';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';
import { IconButtonHeader } from 'components/CommonComponent';
import IconBtn from 'components/Custom/IconBtn';
import PopupDelete from 'components/Custom/popup/PopupDelete';
import PageSearch from 'components/PageHeader';
import TableCustom from 'components/TableCustom';
import { getApi } from 'utils/requestUtils';
import { showError, showSuccess } from 'utils/toast-utils';
import { API_PARKING_LOT } from '../apiUrl';
import { getErrorMessage } from '../Common/function';
import Loading from '../Loading';
import AddLane from './creens/Add';
import Filter from './creens/Filter';
import { useStyles } from './styled';

const initialFilter = {
  keyword: null,
  pkLot: null,
  entrypt: null,
  lane: null,
  deviceTypeId: null,
  limit: 25,
  page: 1,
};

export function ParkingDevicesManagement({ location }) {
  const classes = useStyles();
  const [editId, setEditId] = useState(null);
  const state = location?.state || {};
  const [editName, setEditName] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState({});
  const [showPopupFilter, setShowPopupFilter] = useState(false);
  const [deleteId, setDeleteid] = useState(null);
  const [deleteName, setDeleteName] = useState(null);
  const [showPopupAdd, setShowPopupAdd] = useState(false);
  const [filter, setFilter] = useState(initialFilter);
  const [reload, setReload] = useState(0);
  const { search } = useLocation();
  const pkLotId = new URLSearchParams(search).get('pkLotId');
  const entryptId = new URLSearchParams(search).get('entryptId');
  const laneId = new URLSearchParams(search).get('laneId');
  const isFilter = (filterOp) => {
    const { keyword, limit, page, ...filter } = filterOp;
    return Object.values(filter).filter((v) => !!v && String(v).length).length;
  };
  const [showFilter, setShowFilter] = useState(isFilter(filter));
  const addFilter = async () => {
    if (pkLotId) {
      getApi(`${API_PARKING_LOT.PARKING_LOT}/${pkLotId}`)
        .then((response) => {
          const filterUpdate = filter;
          filterUpdate.pkLot = {
            id: response.data?.id,
            name: response.data?.name,
          };
          setFilter({ ...filter, ...filterUpdate });
        })
        .catch((err) => {
          showError(getErrorMessage(err));
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };
  const fetchDataSource = async () => {
    setLoading(true);

    const params = {
      keyword: filter.keyword || '',
      pkLotId: filter?.pkLot?.id || '',
      deviceTypeId: filter?.deviceType?.id || '',
      limit: filter.limit,
      page: filter.page,
    };
    await getApi(`${API_PARKING_LOT.PARKING_APGS}`, _.pickBy(params))
      .then((response) => {
        setDataSource(response);
        setShowFilter(isFilter(params));
      })
      .catch((err) => {
        showError(getErrorMessage(err));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    addFilter();
  }, [pkLotId]);

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
      <AddLane
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
      title="Thêm thiết bị"
      width="50%"
      height="auto"
      maxHeight="100%"
      className={classes.popup}
    >
      <ScrollView width="100%" height="100%">
        <AddLane
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
      .delete(`${API_PARKING_LOT.PARKING_APGS}/${deleteId}`)
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
      title="Lọc danh sách thiết bị"
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

  const stt = ({ data }) => <div className="center-content">{stt++}</div>;
  const renderActionCell = ({ data }) => (
    <div className="center-content">
      <IconBtn
        showTooltip="Sửa"
        icon={<img src={IconEdit} style={{ maxHeight: 18 }} />}
        onClick={() => {
          setEditId(data.id);
          setEditName(data.name);
        }}
        style={{ padding: 5 }}
      />
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
      caption: 'Tên thiết bị',
      alignment: 'left',
      minWidth: 140,
      width: 'auto',
    },
    {
      dataField: 'type',
      caption: 'Loại thiết bị',
      cellRender: ({ data }) => <div>{data?.deviceType?.value}</div>,
      alignment: 'left',
      minWidth: 140,
      width: 'auto',
    },
    {
      dataField: 'ip',
      caption: 'Địa chỉ IP thiết bị',
      minWidth: 140,
      width: 'auto',
    },
    {
      dataField: 'mac',
      caption: 'Địa chỉ MAC',
      minWidth: 140,
      width: 'auto',
    },
    {
      dataField: 'pkLotName',
      caption: 'Tên bãi xe',
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
      minWidth: 100,
      width: 'auto',
      fixedPosition: 'right',
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
          pageIndex={filter.page || 0}
          totalCount={dataSource?.count || 0}
          placeholderSearch="Nhập tên thiết bị, địa chỉ IP..."
          rowsPerPage={filter.limit || 0}
          handleChangePageIndex={onChangePage}
          handlePageSize={onChangeLimit}
          onSearchValueChange={(newVal) => {
            setFilter({ ...filter, keyword: newVal, page: 1 });
            setReload(reload + 1);
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
          Danh sách thiết bị dẫn đường
        </h3>
        <TableCustom data={dataSource?.data || []} columns={columns} style={{
          maxHeight: 'calc(100vh - 215px)',
          width: '100%',
        }}
        />
      </div>
    </>
  );
}
export default ParkingDevicesManagement;
