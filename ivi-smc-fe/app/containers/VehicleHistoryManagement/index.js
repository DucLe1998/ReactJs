import { Badge, Tooltip } from '@material-ui/core';
import { IconButtonHeader } from 'components/CommonComponent';
import PageSearch from 'components/PageHeader';
import TableCustom from 'components/TableCustom';
import { IconFilter } from 'constant/ListIcons';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { ScrollView } from 'devextreme-react';
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
import DialogDiscount from './creens/DialogDiscount';
import DialogPayment from './creens/DialogPayment';
import Filter from './creens/Filter';
import { useStyles } from './styled';
const initialFilter = {
  keyword: null,
  pkLot: null,
  direction: null,
  service: null,
  fromTime: null,
  toTime: null,
  limit: 25,
  page: 1,
};

export function ParkingDevicesManagement() {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState({});
  const [showPopupFilter, setShowPopupFilter] = useState(false);
  const [paymentId, setPaymentId] = useState(null);
  const [discountId, setDiscountId] = useState(null);
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
      pkLotId: filter?.pkLot?.id || '',
      serviceId: filter?.service?.id || '',
      direction: filter?.direction?.id || '',
      fromTime: filter?.fromTime ? filter?.fromTime.getTime() : '',
      toTime: filter?.toTime ? filter?.toTime.getTime() : '',
      limit: filter.limit,
      page: filter.page,
    };
    await getApi(`${API_PARKING_LOT.PARKING_HISTORIES}`, params)
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
      title="Lọc lịch sử xe vào ra"
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
  const updateRender = ({ data }) => {
    const timeAlert1 = new Date(data.checkInAt);
    const timeAlert2 = new Date(data.checkOutAt);
    const timeAlert = timeAlert2 > timeAlert1 ? timeAlert2 : timeAlert1;
    return formatDistanceToNow(timeAlert, { locale: vi, addSuffix: true });
  };
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
      dataField: 'cardCsn',
      caption: 'Mã thẻ',
      minWidth: 80,
    },
    {
      dataField: 'serviceName',
      caption: 'Loại vé',
      minWidth: 100,
    },
    {
      dataField: 'lpn',
      caption: 'Biển số',
      minWidth: 80,
    },
    {
      dataField: 'vehName',
      caption: 'Loại xe',
      minWidth: 80,
    },
    {
      dataField: 'usrName',
      caption: 'Tên chủ thuê bao',
      minWidth: 150,
    },
    {
      dataField: 'checkInAt',
      caption: 'Thời gian vào',
      dataType: 'date',
      format: 'HH:mm dd/MM/yyyy',
    },
    {
      dataField: 'checkOutAt',
      caption: 'Thời gian ra',
      dataType: 'date',
      format: 'HH:mm dd/MM/yyyy',
    },
    {
      dataField: 'pkLotName',
      caption: 'Bãi xe',
      alignment: 'left',
    },
    {
      dataField: 'laneName',
      caption: 'Làn xe',
      alignment: 'left',
    },
    {
      dataField: 'discountPack',
      caption: 'Khuyến mãi',
      minWidth: 100,
      alignment: 'right',
      dataType: 'number',
      format: {
        type: 'currency',
        currency: 'VND',
      },
      cssClass: 'cell-clickable',
    },
    {
      dataField: 'totalPaidAmount',
      caption: 'Số tiền',
      minWidth: 100,
      alignment: 'right',
      dataType: 'number',
      format: {
        type: 'currency',
        currency: 'VND',
      },
      cssClass: 'cell-clickable',
    },
    {
      dataField: 'checkInLaneImageId',
      caption: 'Hình ảnh',
      alignment: 'center',
      cellRender: imageRender,
      minWidth: 100,
      width: 150,
    },
    {
      dataField: 'checkOutLaneImageId',
      caption: 'Hình ảnh',
      alignment: 'center',
      cellRender: imageRender,
      minWidth: 100,
      width: 150,
    },
    {
      caption: 'Cập nhật',
      cellRender: updateRender,
      alignment: 'left',
      minWidth: 100,
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
      const lastPage = Math.ceil(dataSource.count / e.target.value);
      setFilter({
        ...filter,
        page: filter.page > lastPage ? lastPage : filter.page,
        limit: e.target.value,
      });
      setReload(reload + 1);
    }
  };
  const paymentDialog = () => (
    <Popup
      visible={paymentId}
      onHiding={() => setPaymentId(false)}
      dragEnabled
      showTitle
      title="Số tiền"
      width="70%"
      height="auto"
      maxHeight="100%"
      className={classes.popup}
    >
      <ScrollView width="100%" height="100%">
        <DialogPayment
          id={paymentId}
          onClose={() => setPaymentId(false)}
          setReload={() => setReload(reload + 1)}
        />
      </ScrollView>
    </Popup>
  );
  const discountDialog = () => (
    <Popup
      visible={discountId}
      onHiding={() => setDiscountId(false)}
      dragEnabled
      showTitle
      title="Khuyến mại"
      width="70%"
      height="auto"
      maxHeight="100%"
      className={classes.popup}
    >
      <ScrollView width="100%" height="100%">
        <DialogDiscount
          id={discountId}
          onClose={() => setDiscountId(false)}
          setReload={() => setReload(reload + 1)}
        />
      </ScrollView>
    </Popup>
  );
  const onCellClick = ({ column, data }) => {
    switch (column.dataField) {
      case 'discountPack':
        setDiscountId(data.id);
        break;
      case 'totalPaidAmount':
        setPaymentId(data.id);
        break;
      default:
        break;
    }
  };
  return (
    <>
      <Helmet>
        <title>Quản lý bãi xe - Giám sát</title>
      </Helmet>
      <>
        {loading && <Loading />}
        {showPopupFilter && filterPopup()}
        {discountId && discountDialog()}
        {paymentId && paymentDialog()}
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
          placeholderSearch="Nhập biển số, tên chủ xe, mã thẻ..."
          rowsPerPage={filter.limit || 0}
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
        <h3> Lịch sử xe vào ra</h3>

        {useMemo(
          () => (
            <TableCustom
              data={dataSource?.data || []}
              columns={columns}
              onCellClick={onCellClick}
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
export default ParkingDevicesManagement;
