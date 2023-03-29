/**
 *
 * ListPaymentHistory
 *
 */

import React, {
  Fragment,
  useCallback,
  useEffect,
  useState,
  useMemo,
} from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import _ from 'lodash';
import { format } from 'date-fns';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import { checkAuthority } from 'utils/functions';
import Loading from 'containers/Loading';
import PageHeader from 'components/PageHeader';
import { HiOutlineDownload } from 'react-icons/hi';
import IconBtn from 'components/Custom/IconBtn';
import { Popup } from 'devextreme-react/popup';

// import messages from './messages';
import { showError } from 'utils/toast-utils';
import { callApiExportFile, getApi } from 'utils/requestUtils';
import FileSaver from 'file-saver';

import { API_PARKING } from 'containers/apiUrl';
import { IconFilter } from 'constant/ListIcons';
import TableCustom from 'components/TableCustom';
import saga from './saga';
import reducer from './reducer';
import makeSelectListPaymentHistory from './selectors';
import FilterPayment from './components/Filter';
import { useStyles } from './styles';
import { INIT_SEARCH_VALUE } from './constants';

export function ListPaymentHistory({ userAuthority }) {
  useInjectReducer({ key: 'listPaymentHistory', reducer });
  useInjectSaga({ key: 'listPaymentHistory', saga });
  const classes = useStyles();

  const resourceCode = 'cameraai/blacklist-users';
  const scopes = checkAuthority(
    ['get', 'update', 'delete', 'create', 'list'],
    resourceCode,
    userAuthority,
  );
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState(INIT_SEARCH_VALUE);
  const [listPaymentHistory, setListPaymentHistory] = useState(null);
  const [showPopupFilter, setShowPopupFilter] = useState(false);

  const loadData = useCallback(() => {
    const payload = {
      areaId: search.areaId,
      buildingId: search.buildingId,
      limit: search.limit,
      page: search.page,
      startTime: search.fromDate ? new Date(search.fromDate).getTime() : null,
      endTime: search.toDate ? new Date(search.toDate).getTime() : null,
      minAmount: search.from * 1000,
      maxAmount: search.to * 1000,
      vinIdStatus: search.paymentVinIDStatus.id,
      tisStatus: search.paymentParkingStatus.id,
    };
    setLoading(true);
    getApi(API_PARKING.LIST_PAYMENT, _.pickBy(payload))
      .then(res => {
        setListPaymentHistory(res.data);
      })
      .catch(err => {
        showError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  });

  useEffect(() => {
    loadData();
  }, [search]);

  const renderHeaderCell = (param1, param2) => (
    <p>
      {param1} <br /> {param2}
    </p>
  );

  const renderCreateTimeCell = ({ data }) => (
    <span>
      {data?.createTime
        ? format(data.createTime, 'HH:mm:ss - dd/MM/yyyy')
        : null}
    </span>
  );

  const renderOrderAmountCell = ({ data }) => {
    const amount = (data && +data.order_amount) || 0;
    return <span>{amount.toLocaleString('vi-VN')}</span>;
  };

  const renderPaymenVinIDStatusCell = ({ data }) => {
    if (data.payStatus === 'NEED_CHECK' || data.payStatus === 'VINID_FAILED') {
      return <span style={{ color: '#FB4E4E' }}>Thất bại</span>;
    }
    return <span style={{ color: '#0D74E4' }}>Thành công</span>;
  };

  const renderPaymenParingStatusCell = ({ data }) => {
    if (data.payStatus === 'TIS_SUCCESS') {
      return <span style={{ color: '#0D74E4' }}>Thành công</span>;
    }
    return <span style={{ color: '#FB4E4E' }}>Thất bại</span>;
  };

  const columns = [
    {
      dataField: 'plateNumber',
      caption: 'Biển số xe',
      alignment: 'center',
      allowSorting: false,
    },
    {
      dataField: 'tisOrderId',
      caption: 'Mã UID',
      alignment: 'center',
      allowSorting: false,
    },
    {
      dataField: 'vinIdOrderId',
      headerCellRender: () => renderHeaderCell('Mã hóa đơn', '(Order ID)'),
      alignment: 'center',
      allowSorting: false,
    },
    {
      dataField: 'transaction_id',
      headerCellRender: () =>
        renderHeaderCell('Mã giao dịch ví', '(TransactionID)'),
      alignment: 'center',
      allowSorting: false,
    },
    {
      dataField: 'createTime',
      caption: 'Thời gian',
      cellRender: renderCreateTimeCell,
      alignment: 'center',
      allowSorting: false,
    },
    {
      dataField: 'order_amount',
      headerCellRender: () => renderHeaderCell('Số tiền', '(VNĐ)'),
      cellRender: renderOrderAmountCell,
      alignment: 'center',
      allowSorting: false,
    },
    {
      caption: 'Thanh toán VinID',
      cellRender: renderPaymenVinIDStatusCell,
      alignment: 'center',
      allowSorting: false,
    },
    {
      caption: 'Thanh toán Parking',
      cellRender: renderPaymenParingStatusCell,
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

  const filterPopup = () => (
    <Popup
      visible={showPopupFilter}
      onHiding={() => setShowPopupFilter(false)}
      title="Lọc lịch sử thanh toán"
      dragEnabled
      showTitle
      width="40%"
      minWidth="768px"
      height="auto"
      className={classes.popup}
    >
      <FilterPayment
        onClose={() => setShowPopupFilter(false)}
        handleChangeFilter={handleChangeFilter}
        initValues={search}
      />
    </Popup>
  );

  const onDownloadBtnClick = () => {
    setLoading(true);
    const payload = {
      areaId: search.areaId,
      buildingId: search.buildingId,
      startTime: search.fromDate ? new Date(search.fromDate).getTime() : null,
      endTime: search.toDate ? new Date(search.toDate).getTime() : null,
      minAmount: search.from * 1000,
      maxAmount: search.to * 1000,
      vinIdStatus: search.paymentVinIDStatus.id,
      tisStatus: search.paymentParkingStatus.id,
    };
    callApiExportFile(
      API_PARKING.EXPORT_CSV,
      'GET',
      null,
      null,
      null,
      _.pickBy(payload),
    )
      .then(res => {
        FileSaver.saveAs(res, 'ExportData.csv');
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

  const renderTable = useMemo(
    () => (
      <TableCustom
        noDataText="Không có lịch sử thanh toán nào"
        data={listPaymentHistory?.rows || []}
        columns={columns}
      />
    ),
    [listPaymentHistory],
  );

  return (
    <Fragment>
      <Helmet>
        <title>Lịch sử thanh toán online</title>
        <meta name="description" content="Description of Payment History" />
      </Helmet>
      {loading && <Loading />}
      {showPopupFilter && filterPopup()}
      <Fragment>
        <PageHeader
          title="Lịch sử thanh toán online"
          // showSearch
          showPager
          totalCount={listPaymentHistory?.totalElements || 0}
          pageIndex={search.page}
          rowsPerPage={search.limit}
          handleChangePageIndex={handleChangePageIndex}
          handlePageSize={handlePageSize}
          // onSearchValueChange={newVal =>
          //   setSearch({ ...search, keyword: newVal, page: 1 })
          // }
        >
          {scopes.list && (
            <IconBtn
              showTooltip="Tải xuống"
              style={{
                backgroundColor: 'rgba(116, 116, 128, 0.08)',
                height: 36,
                width: 36,
                borderRadius: 6,
              }}
              icon={<HiOutlineDownload color="gray" />}
              onClick={() => {
                onDownloadBtnClick();
              }}
            />
          )}
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
        </PageHeader>
        {renderTable}
      </Fragment>
    </Fragment>
  );
}

ListPaymentHistory.propTypes = {};

const mapStateToProps = createStructuredSelector({
  listPaymentHistory: makeSelectListPaymentHistory(),
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

export default compose(withConnect)(ListPaymentHistory);
