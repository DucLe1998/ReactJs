/**
 *
 * ListGuestStatistic
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
// import { format } from 'date-fns';

// import { checkAuthority } from 'utils/functions';
import Loading from 'containers/Loading';
import PageHeader from 'components/PageHeader';
import { HiOutlineDownload } from 'react-icons/hi';
import IconBtn from 'components/Custom/IconBtn';

// import messages from './messages';
import { showError } from 'utils/toast-utils';
import { callApiExportFile, getApi } from 'utils/requestUtils';
import FileSaver from 'file-saver';
import { useHistory, useLocation } from 'react-router-dom';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import { Tooltip, Badge, IconButton } from '@material-ui/core';

import { GUEST_DASHBOARD } from 'containers/apiUrl';
import DataGrid, {
  Column,
  LoadPanel,
  Paging,
  Scrolling,
  Selection,
} from 'devextreme-react/data-grid';
import { INIT_SEARCH_VALUE } from './constants';

export function ListGuestStatistic({ userAuthority }) {
  const location = useLocation();
  //   const resourceCode = 'cameraai/blacklist-users';
  //   const scopes = checkAuthority(
  //     ['get', 'update', 'delete', 'create', 'list'],
  //     resourceCode,
  //     userAuthority,
  //   );
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState(INIT_SEARCH_VALUE);
  const [listGuestStatistic, setListStatistic] = useState(null);
  const history = useHistory();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const loadData = useCallback(() => {
    const payload = {
      limit: search.limit,
      page: search.page,
      startDate: location?.state?.startDate || null,
      endDate: location?.state?.endDate || null,
    };
    setLoading(true);
    getApi(GUEST_DASHBOARD.LIST_STATISTIC, _.pickBy(payload))
      .then(res => {
        setListStatistic(res.data);
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
    setSelectedRowKeys([]);
  }, [search]);

  function handlePageSize(e) {
    setSearch({ ...search, page: 1, limit: e.target.value });
  }

  const onExportOrgUnitGuest = () => {
    setLoading(true);
    const payload = {
      ids: (selectedRowKeys || []).map(org => org.orgUnitId),
    };
    callApiExportFile(
      GUEST_DASHBOARD.EXPORT_ORGUNIT_STATISTIC,
      'POST',
      _.pickBy(payload),
      null,
      null,
      null,
    )
      .then(res => {
        FileSaver.saveAs(res, 'ExportData.xlsx');
      })
      .catch(err => {
        showError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onExportGuestByOrgUnit = data => {
    setLoading(true);
    const payload = {};
    callApiExportFile(
      GUEST_DASHBOARD.EXPORT_GUEST_BY_ORGUNIT(data),
      'GET',
      null,
      null,
      null,
      _.pickBy(payload),
    )
      .then(res => {
        FileSaver.saveAs(res, 'ExportData.xlsx');
      })
      .catch(err => {
        showError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onBack = () => {
    history.goBack();
  };

  const handleChangePageIndex = pageIndex => {
    setSearch({ ...search, page: pageIndex });
  };

  const onSelectionChanged = ({ selectedRowKeys }) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  const renderActionCell = ({ data }) => {
    const isDisabled =
      data.activeCount === 0 &&
      data.arrivedTotal === 0 &&
      data.inactiveCount === 0 &&
      data.totalCount === 0;
    return (
      <Fragment>
        <Tooltip title="Tải xuống">
          <IconButton
            // disabled={!scopes?.list}
            disabled={isDisabled}
            onClick={() => {
              onExportGuestByOrgUnit(data.orgUnitId);
            }}
          >
            <HiOutlineDownload
              color="gray"
              style={{
                opacity: isDisabled ? 0.5 : 1,
              }}
            />
          </IconButton>
        </Tooltip>
        <Tooltip title="Chi tiết">
          <IconButton
            // disabled={!scopes?.get}
            disabled={isDisabled}
            onClick={() => {
              history.push(`/guest/dashboard/statistic/${data.orgUnitId}`, {
                ...data,
                startDate: location?.state?.startDate || null,
                endDate: location?.state?.endDate || null,
              });
            }}
          >
            <InfoOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Fragment>
    );
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
      dataField: 'orgUnitName',
      caption: 'Đơn vị',
      alignment: 'center',
      allowSorting: false,
    },
    {
      dataField: 'totalCount',
      caption: 'Tổng số khách',
      alignment: 'center',
      allowSorting: false,
    },
    {
      dataField: 'arrivedTotal',
      caption: 'Khách đã đến',
      alignment: 'center',
      allowSorting: false,
    },
    {
      dataField: 'activeCount',
      caption: 'Khách còn hạn',
      alignment: 'center',
      allowSorting: false,
    },
    {
      dataField: 'inactiveCount',
      caption: 'Khách hết hạn',
      alignment: 'center',
      allowSorting: false,
    },
    {
      caption: 'Hành động',
      cellRender: renderActionCell,
      alignment: 'center',
      allowSorting: false,
    },
  ];

  const renderTable = useMemo(
    () => (
      <DataGrid
        className="center-row-grid"
        dataSource={listGuestStatistic?.rows || []}
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
        onSelectionChanged={onSelectionChanged}
        selectedRowKeys={selectedRowKeys}
        rowAlternationEnabled
        sorting={{ mode: 'none' }}
      >
        <Paging enabled={false} />
        <Scrolling mode="infinite" />
        <LoadPanel enabled={false} />
        <Selection mode="multiple" showCheckBoxesMode="always" />
        {React.Children.toArray(columns.map(defs => <Column {...defs} />))}
      </DataGrid>
    ),
    [listGuestStatistic, selectedRowKeys],
  );

  return (
    <Fragment>
      <Helmet>
        <title>Danh sách khách</title>
        <meta name="description" content="Description of Payment History" />
      </Helmet>
      {loading && <Loading />}
      <Fragment>
        <PageHeader
          title="Danh sách khách"
          showPager
          totalCount={listGuestStatistic?.count || 0}
          pageIndex={search.page}
          rowsPerPage={search.limit}
          handleChangePageIndex={handleChangePageIndex}
          handlePageSize={handlePageSize}
          showBackButton
          onBack={() => onBack()}
        >
          <Tooltip title="Tải xuống" badgeContent={selectedRowKeys.length}>
            <Badge color="primary">
              <IconBtn
                style={{
                  backgroundColor: 'rgba(116, 116, 128, 0.08)',
                  height: 36,
                  width: 36,
                  borderRadius: 6,
                }}
                disabled={selectedRowKeys.length <= 0}
                icon={<HiOutlineDownload color="gray" />}
                onClick={() => {
                  onExportOrgUnitGuest();
                }}
              />
            </Badge>
          </Tooltip>
        </PageHeader>
        {renderTable}
      </Fragment>
    </Fragment>
  );
}

ListGuestStatistic.propTypes = {};

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

export default compose(withConnect)(ListGuestStatistic);
