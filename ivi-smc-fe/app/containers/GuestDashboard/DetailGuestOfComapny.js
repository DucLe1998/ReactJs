/**
 *
 * DetailGuestOfCompany
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
import { pickBy } from 'lodash';
// import { format } from 'date-fns';

// import { checkAuthority } from 'utils/functions';
import Loading from 'containers/Loading';
import PageHeader from 'components/PageHeader';
import IconBtn from 'components/Custom/IconBtn';
import { IconFilter } from 'constant/ListIcons';

// import messages from './messages';
import { showError } from 'utils/toast-utils';
import { getApi } from 'utils/requestUtils';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import { GUEST_DASHBOARD } from 'containers/apiUrl';
import { Popup } from 'devextreme-react/popup';
import RenderDetails from 'components/RenderDetails';

import DataGrid, {
  Column,
  LoadPanel,
  Paging,
  Scrolling,
} from 'devextreme-react/data-grid';
import { makeStyles } from '@material-ui/core/styles';
import FilterGuestOfCompany from './FilterGuestOfCompany';

const initSearchValues = {
  limit: 25,
  page: 1,
  keyword: '',
  identificationStatus: { id: 'ALL', name: 'Tất cả' },
  status: { id: null, name: 'Tất cả' },
};

const AUTH_MODE = {
  FINGERPRINT: 'Vân tay',
  FACE: 'Khuôn mặt',
  CARD: 'Thẻ',
};

export function DetailGuestOfCompany({ userAuthority }) {
  //   const resourceCode = 'cameraai/blacklist-users';
  //   const scopes = checkAuthority(
  //     ['get', 'update', 'delete', 'create', 'list'],
  //     resourceCode,
  //     userAuthority,
  //   );
  const history = useHistory();
  const { companyId } = useParams();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState(initSearchValues);
  const [ListGuestOfCompany, setListGuestOfCompany] = useState(null);
  const [showPopupFilter, setShowPopupFilter] = useState(false);
  const classes = useStyles();

  const loadData = useCallback(async () => {
    if (!companyId) {
      return;
    }
    const payload = {
      limit: search.limit,
      page: search.page,
      keyword: search.keyword,
      startDate: location?.state?.startDate || null,
      endDate: location?.state?.endDate || null,
      authenticationMode: search.identificationStatus?.id,
      authenticationStatus: search.status?.id,
    };
    setLoading(true);
    try {
      const res = await getApi(
        GUEST_DASHBOARD.LIST_GUEST_OF_COMPANY(companyId),
        pickBy(payload),
      );
      setListGuestOfCompany(res.data);
    } catch (error) {
      showError(error);
    } finally {
      setLoading(false);
    }
  });

  useEffect(() => {
    loadData();
  }, [search]);

  function handlePageSize(e) {
    setSearch({ ...search, page: 1, limit: e.target.value });
  }

  const onBack = () => {
    history.goBack();
  };

  const handleChangePageIndex = pageIndex => {
    setSearch({ ...search, page: pageIndex });
  };

  const renderAuthenticationModes = ({ data }) =>
    data.authenticationModes?.length
      ? (data.authenticationModes || []).map(au => AUTH_MODE[au]).join(', ')
      : 'Không xác định';

  const renderAuthenticationStatus = ({ data }) => {
    if (data.authenticationStatus === 'IDENTIFIED') {
      return 'Đã định danh';
    }
    return 'Chưa định danh';
  };

  const columns = [
    {
      caption: 'STT',
      cellRender: props =>
        props?.rowIndex + 1 + search.limit * (search.page - 1),
      alignment: 'center',
      width: 50,
    },
    {
      dataField: 'fullName',
      caption: 'Tên khách',
      alignment: 'center',
      allowSorting: false,
    },
    {
      dataField: 'phoneNumber',
      caption: 'Số điện thoại',
      alignment: 'center',
      allowSorting: false,
    },
    {
      dataField: 'identityNumber',
      caption: 'Giấy tờ',
      alignment: 'center',
      allowSorting: false,
    },
    {
      caption: 'Phương thức định danh',
      cellRender: renderAuthenticationModes,
      alignment: 'center',
      allowSorting: false,
    },
    {
      // dataField: 'authenticationStatus',
      cellRender: renderAuthenticationStatus,
      caption: 'Trạng thái',
      alignment: 'center',
      allowSorting: false,
    },
    // {
    //   dataField: 'TODO',
    //   caption: 'Nhân viên đăng ký',
    //   alignment: 'center',
    //   allowSorting: false,
    // },
  ];

  const renderTable = useMemo(
    () => (
      <DataGrid
        className="center-row-grid"
        dataSource={ListGuestOfCompany?.rows || []}
        // keyExpr="id"
        // noDataText={intl.formatMessage({ id: 'app.no_data' })}
        style={{
          height: '100%',
          maxHeight: `calc(100vh - ${50 + 84 + 25}px)`,
          width: '100%',
          maxWidth: '100%',
        }}
        columnAutoWidth
        showRowLines
        showColumnLines={false}
        rowAlternationEnabled
        sorting={{ mode: 'none' }}
      >
        <Paging enabled={false} />
        <Scrolling mode="infinite" />
        <LoadPanel enabled={false} />
        {React.Children.toArray(columns.map(defs => <Column {...defs} />))}
      </DataGrid>
    ),
    [ListGuestOfCompany],
  );

  const handleChangeFilter = data => {
    setSearch({ ...search, ...data, page: 1 });
  };

  const filterPopup = () => (
    <Popup
      visible={showPopupFilter}
      onHiding={() => setShowPopupFilter(false)}
      title="Lọc thông tin khách"
      dragEnabled
      showTitle
      width="40%"
      minWidth="768px"
      height="auto"
      className={classes.popup}
    >
      <FilterGuestOfCompany
        onClose={() => setShowPopupFilter(false)}
        handleChangeFilter={handleChangeFilter}
        initValues={search}
      />
    </Popup>
  );

  const getDetailsData = data => {
    if (!data) return null;
    return [
      { field: 'Khách đã đến', width: 4, content: data.arrivedTotal || '' },
      { field: 'Khách còn hạn', width: 4, content: data.activeCount || '' },
      { field: 'Khách hết hạn', width: 4, content: data.inactiveCount || '' },
      { field: 'Tổng số khách', width: 4, content: data.totalCount || '' },
    ];
  };

  return (
    <Fragment>
      <Helmet>
        <title>Chi tiết khách của {location?.state?.orgUnitName}</title>
        <meta name="description" content="Description of Payment History" />
      </Helmet>
      {loading && <Loading />}
      {showPopupFilter && filterPopup()}

      <Fragment>
        <PageHeader
          title={`Chi tiết khách của ${location?.state?.orgUnitName}`}
          showBackButton
          onBack={() => onBack()}
        />
        <RenderDetails
          title="Thông tin chung"
          data={getDetailsData(location?.state)}
        />
        <PageHeader
          title="Danh sách khách"
          showPager
          totalCount={ListGuestOfCompany?.count || 0}
          pageIndex={search.page}
          rowsPerPage={search.limit}
          handleChangePageIndex={handleChangePageIndex}
          handlePageSize={handlePageSize}
          showSearch
          onSearchValueChange={newVal => {
            setSearch({ ...search, page: 1, keyword: newVal });
          }}
        >
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

const useStyles = makeStyles(() => ({
  popup: {
    zIndex: '1299 !important',
    '& .title': {
      padding: '0px',
    },
  },
}));

DetailGuestOfCompany.propTypes = {};

const mapStateToProps = createStructuredSelector({});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(DetailGuestOfCompany);
