import { Badge, IconButton, Tooltip } from '@material-ui/core';
import NotificationsOffIcon from '@material-ui/icons/NotificationsOffOutlined';
import useAxios from 'axios-hooks';
import { IconButtonSquare } from 'components/CommonComponent';
import Dialog from 'components/Dialog';
import Label from 'components/Label';
import PageHeader from 'components/PageHeader';
import TableCustom from 'components/TableCustom';
import { IconFilter } from 'constant/ListIcons';
import Loading from 'containers/Loading';
import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
// import { checkAuthority } from 'utils/functions';
import { showError, showSuccess } from 'utils/toast-utils';
import { API_EVENTS } from '../apiUrl';
import { DEFAULT_FILTER, key, STATUS_MAP } from './constants';
import FilterEvents from './FilterEvents';
const getUrlRedirect = (data) => `/camera-ai/list-event/${data?.id}`;

function ListEvent({
  // userAuthority,
  history,
  location,
}) {
  const intl = useIntl();
  const state = location?.state || {};
  const [showPopupFilter, setShowPopupFilter] = useState(false);
  const [filter, setFilter] = useState({
    ...DEFAULT_FILTER,
    ...(state[key] || {}),
  });
  const [needReload, setNeedReload] = useState(0);

  const isFilter = (filterOp) => {
    const { keyword, limit, page, ...filter } = filterOp;
    return Object.values(filter).filter((v) => v != null && String(v).length)
      .length;
  };
  const [showFilter, setShowFilter] = useState(isFilter(filter));
  useEffect(() => {
    if (Object.keys(state).length) {
      history.replace({ ...location?.state, [key]: undefined });
    }
  }, []);
  // const resourceCode = 'cameraai/events';
  // const scopes = checkAuthority(['get', 'update'], resourceCode, userAuthority);

  // table data
  const [
    { data: getTableData, loading: getTableLoading, error: getTableError },
    executeGetTable,
  ] = useAxios(API_EVENTS.LIST_EVENTS_FILTER, {
    useCache: false,
    manual: true,
  });
  useEffect(() => {
    const { eventType, device, area, ...other } = filter;
    const params = {
      ...other,
      eventType: eventType?.code || undefined,
      deviceId: device?.id || undefined,
      areaId: area?.id || undefined,
      startTime: filter.startTime ? filter.startTime.getTime() : undefined,
      endTime: filter.endTime ? filter.endTime.getTime() : undefined,
    };
    executeGetTable({
      params,
    });
  }, [filter, needReload]);
  useEffect(() => {
    if (getTableData) {
      if (getTableData.rows.length <= 0 && filter.page > 1) {
        setFilter({ ...filter, page: filter.page - 1 });
      }
    }
  }, [getTableData]);
  useEffect(() => {
    if (getTableError) {
      showError(getTableError);
    }
  }, [getTableError]);
  // put
  const [
    { response: putData, loading: putLoading, error: putError },
    executePut,
  ] = useAxios(
    {
      method: 'PUT',
    },
    {
      manual: true,
    },
  );
  useEffect(() => {
    if (putError) {
      showError(putError);
    }
  }, [putError]);

  useEffect(() => {
    if (putData) {
      showSuccess('Cập nhật trạng thái thành công');
      setNeedReload(needReload + 1);
    }
  }, [putData]);
  const renderOrderCell = ({ rowIndex }) => (
    <span>{(filter.page - 1) * filter.limit + rowIndex + 1}</span>
  );
  const updateStatus = ({ id, status }) => {
    executePut({
      url: API_EVENTS.UPDATE_STATUS_EVENT(id),
      data: { status },
    });
  };

  const onSearch = (e) => {
    if (e !== filter.keyword) {
      setFilter({ ...filter, keyword: e, page: 1 });
    }
  };

  const onChangeLimit = (e) => {
    if (!e || !e.target) return;
    if (e.target.value !== filter.limit) {
      setFilter({ ...filter, page: 1, limit: e.target.value });
    }
  };

  const onChangePage = (e) => {
    if (!e) return;
    if (e !== filter.page) {
      setFilter({ ...filter, page: e });
    }
  };

  const onFilter = (ret) => {
    if (ret) {
      const newParams = { ...filter, ...ret, page: 1 };
      setShowPopupFilter(false);
      setFilter(newParams);
      setShowFilter(isFilter(newParams));
    } else setShowPopupFilter(false);
  };

  const onClearSearch = () => {
    setFilter({
      ...DEFAULT_FILTER,
      limit: filter.limit,
      keyword: filter.keyword,
    });
    setShowFilter(0);
  };

  const onAlarmBtnClick = (rowData) => {
    if (rowData?.id) {
      updateStatus({
        id: rowData?.id,
        status: rowData?.notificationStatus == 0 ? 1 : 0,
      });
    }
  };

  const renderEventType = ({ data }) => (
    <Link
      to={{
        pathname: getUrlRedirect(data),
        state: {
          [key]: filter,
        },
      }}
    >
      {data?.eventName}
    </Link>
  );

  const renderStatus = ({ value }) => {
    const props = STATUS_MAP.get(value || 'NEW');
    return <Label {...props} variant="ghost" />;
  };

  const actionRender = ({ data }) => (
    <Tooltip title="Tắt còi">
      <span>
        <IconButton
          color="primary"
          size="small"
          disabled={data?.sirensStatus != 'ON'}
          onClick={() => onAlarmBtnClick(data)}
        >
          <NotificationsOffIcon />
        </IconButton>
      </span>
    </Tooltip>
  );
  const renderHeader = () => (
    <PageHeader
      title="Danh sách sự kiện AI"
      showSearch
      showPager
      defaultSearch={filter.keyword}
      pageIndex={filter.page || 0}
      totalCount={getTableData?.count || 0}
      rowsPerPage={filter.limit || 0}
      onSearchValueChange={onSearch}
      handleChangePageIndex={onChangePage}
      handlePageSize={onChangeLimit}
      showFilter={Boolean(showFilter)}
      onBack={onClearSearch}
    >
      <Tooltip title={intl.formatMessage({ id: 'app.tooltip.filter' })}>
        <Badge badgeContent={showFilter} color="primary">
          <IconButtonSquare
            onClick={() => setShowPopupFilter(!showPopupFilter)}
            icon={IconFilter}
          />
        </Badge>
      </Tooltip>
    </PageHeader>
  );

  const columns = [
    {
      caption: intl.formatMessage({ id: 'app.column.order' }),
      width: 'auto',
      alignment: 'center',
      cellRender: renderOrderCell,
      minWidth: 50,
    },
    {
      // dataField: 'eventName',
      caption: 'Loại sự kiện',
      cellRender: renderEventType,
      // width: 300,
      minWidth: 300,
    },
    {
      dataField: 'timeOccur',
      caption: 'Thời gian',
      alignment: 'left',
      dataType: 'datetime',
      format: 'HH:mm dd/MM/yyyy',
    },
    {
      dataField: 'deviceName',
      caption: 'Thiết bị',
      minWith: 110,
    },
    {
      dataField: 'areaName',
      caption: 'Khu vực',
      minWidth: 120,
    },
    {
      dataField: 'status',
      caption: 'Trạng thái',
      cellRender: renderStatus,
      alignment: 'center',
      minWidth: 105,
    },
    {
      caption: intl.formatMessage({ id: 'app.column.action' }),
      cellRender: actionRender,
      alignment: 'center',
      minWidth: 80,
    },
  ];
  // const onRowPrepared = ({ data, rowElement, rowType }) => {
  //   if (rowType == 'data' && data?.notificationStatus == 1) {
  //     rowElement.style.backgroundColor = '#FB4E4E33';
  //     rowElement.className = rowElement.className.replace('dx-row-alt', '');
  //   }
  // };
  const popupFilter = showPopupFilter && (
    <Dialog
      title="Lọc danh sách sự kiện"
      open={showPopupFilter}
      onClose={() => onFilter(0)}
      fullWidth
      maxWidth="sm"
    >
      <FilterEvents initialState={filter} onSubmit={onFilter} />
    </Dialog>
  );

  return (
    <>
      <Helmet>
        <title>Danh sách sự kiện AI</title>
        <meta name="description" content="Danh sách sự kiện" />
      </Helmet>
      {renderHeader()}
      {popupFilter}
      {(getTableLoading || putLoading) && <Loading />}
      {useMemo(
        () => (
          <TableCustom
            data={getTableData?.rows}
            columns={columns}
            // onRowPrepared={onRowPrepared}
          />
        ),
        [getTableData],
      )}
    </>
  );
}

export default ListEvent;
