import { Badge, Tooltip } from '@material-ui/core';
import { IconButtonHeader } from 'components/CommonComponent';
import IconBtn from 'components/Custom/IconBtn';
import PageSearch from 'components/PageHeader';
import TableCustom from 'components/TableCustom';
import { IconEdit, IconFilter } from 'constant/ListIcons';
import { Popup } from 'devextreme-react/popup';
import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { getApi } from 'utils/requestUtils';
import { showError } from 'utils/toast-utils';
import ModalImage from '../../components/ModalImage';
import { buildUrlWithToken } from '../../utils/utils';
import { API_FILE, API_PARKING_LOT } from '../apiUrl';
import { getErrorMessage } from '../Common/function';
import Loading from '../Loading';
import AddLane from './creens/Add';
import Filter from './creens/Filter';
import { useStyles } from './styled';
const initialFilter = {
  keyword: null,
  alertType: null,
  limit: 25,
  page: 1,
};

export function ParkingAlertManagement() {
  const classes = useStyles();
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState({});
  const [showPopupFilter, setShowPopupFilter] = useState(false);
  const [filter, setFilter] = useState(initialFilter);
  const [reload, setReload] = useState(0);
  const [imageUrl, setImageUrl] = useState(null);
  const [currentCount, setCount] = useState(10);
  const timer = () => setCount(currentCount - 1);
  const isFilter = (filterOp) => {
    const { keyword, limit, page, ...filter } = filterOp;
    return Object.values(filter).filter((v) => !!v && String(v).length).length;
  };
  const [showFilter, setShowFilter] = useState(isFilter(filter));

  const fetchDataSource = async () => {
    const params = {
      keyword: filter.keyword || '',
      alertType: filter?.alertType?.code || '',
      limit: filter.limit,
      page: filter.page,
    };
    await getApi(`${API_PARKING_LOT.PARKING_ALERTS}`, params)
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
    fetchDataSource();
  }, [reload, filter, currentCount]);
  useEffect(() => {
    const id = setInterval(timer, 10000);
    return () => clearInterval(id);
  }, [currentCount]);
  const editPopup = () => (
    <Popup
      visible={editId !== null}
      onHiding={() => setEditId(null)}
      dragEnabled
      showTitle
      title="Chỉnh sửa trạng thái cảnh báo"
      width="510px"
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
      title="Lọc cảnh báo"
      dragEnabled
      showTitle
      maxWidth="550"
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
  const onRowPrepared = ({ data, rowElement, rowType }) => {
    if (rowType == 'data' && data?.state.id == 'pending') {
      rowElement.style.backgroundColor = 'rgba(255, 0, 0, 0.1)';
      rowElement.className = rowElement.className.replace('dx-row-alt', '');
    }
  };
  const renderActionCell = ({ data }) => (
    <IconBtn
      showTooltip="Sửa"
      icon={<img src={IconEdit} style={{ maxHeight: 18 }} />}
      style={{ padding: 5 }}
      onClick={() => {
        setEditId(data.id);
      }}
    />
  );
  const imageRender = ({ value }) => {
    if (!value) return null;
    const url = buildUrlWithToken(API_FILE.DOWNLOAD_FILE(value));
    return (
      <img
        src={url}
        alt="lane image"
        style={{ maxWidth: '100%', maxHeight: 100, cursor: 'pointer' }}
        onClick={() => setImageUrl(url)}
      />
    );
  };
  const columns = [
    {
      caption: 'STT',
      alignment: 'center',
      cellRender: (props) =>
        props.rowIndex + 1 + filter.limit * (filter.page - 1),
      minWidth: 40,
      width: 'auto',
    },
    {
      dataField: 'alertType',
      caption: 'Loại cảnh báo',
      alignment: 'left',
      minWidth: 140,
      width: 'auto',
    },
    {
      dataField: 'lpn',
      caption: 'Biển số',
      alignment: 'left',
      minWidth: 100,
      width: 'auto',
    },
    {
      dataField: 'alertTime',
      caption: 'Thời gian',
      alignment: 'left',
      dataType: 'date',
      format: 'HH:mm dd/MM/yyyy',
      minWidth: 140,
      width: 'auto',
    },
    {
      dataField: 'laneName',
      caption: 'Tên làn',
      alignment: 'left',
      minWidth: 140,
      width: 'auto',
    },
    {
      dataField: 'entryptName',
      caption: 'Tên entry point',
      alignment: 'left',
      minWidth: 140,
      width: 'auto',
    },
    {
      dataField: 'pkLotName',
      caption: 'Tên bãi xe',
      alignment: 'left',
      minWidth: 140,
      width: 'auto',
    },
    {
      dataField: 'laneImageId',
      caption: 'Hình ảnh',
      alignment: 'center',
      cellRender: imageRender,
      minWidth: 100,
      width: 150,
    },
    {
      dataField: 'state.value',
      caption: 'Trạng thái',
      alignment: 'left',
      minWidth: 140,
      width: 'auto',
    },
    {
      dataField: 'dscr',
      caption: 'Ghi chú',
      minWidth: 180,
      width: 'auto',
    },
    {
      caption: 'Hành động',
      cellRender: renderActionCell,
      alignment: 'center',
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
        <title>Quản lý bãi xe - Giám sát</title>
      </Helmet>
      <>
        {loading && <Loading />}
        {editId && editPopup()}
        {showPopupFilter && filterPopup()}
        {imageUrl && (
          <ModalImage
            onClose={() => {
              setImageUrl(null);
            }}
            imageUrl={imageUrl}
          />
        )}
        <PageSearch
          title="Giám sát"
          showSearch
          showPager
          defaultSearch={filter.keyword}
          pageIndex={filter.page || 0}
          totalCount={dataSource?.count || 0}
          placeholderSearch="Nhập biển số"
          rowsPerPage={filter.limit || 25}
          handleChangePageIndex={onChangePage}
          handlePageSize={onChangeLimit}
          onSearchValueChange={(newVal) => {
            setFilter({ ...filter, keyword: newVal, page: 1 });
            setReload(reload + 1);
          }}
          showFilter={Boolean(showFilter)}
          onBack={() => {
            setFilter({ ...initialFilter, page: 1 });
            setReload(reload + 1);
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
        </PageSearch>
      </>

      <div className={classes.tableContent}>
        <h3> Danh sách cảnh báo</h3>

        {useMemo(
          () => (
            <TableCustom
              onRowPrepared={onRowPrepared}
              data={dataSource?.data || []}
              columns={columns}
              style={{
                maxHeight: 'calc(100vh - 215px)',
                width: '100%',
              }}
            />
          ),
          [dataSource?.data],
        )}
      </div>
    </>
  );
}
export default ParkingAlertManagement;
