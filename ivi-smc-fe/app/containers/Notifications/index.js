import { Badge, Box, IconButton, Tooltip, Typography } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/ClearOutlined';
import EditIcon from '@material-ui/icons/InfoOutlined';
import useAxios from 'axios-hooks';
import { IconButtonSquare } from 'components/CommonComponent';
import Dialog from 'components/Dialog';
import Label from 'components/Label';
import PageHeader from 'components/PageHeader';
import TableCustom from 'components/TableCustom';
import { IconAdd, IconFilter } from 'constant/ListIcons';
import { NOTIFICATION_EVENT_API } from 'containers/apiUrl';
import Loading from 'containers/Loading/Loadable';
import { endOfDay, startOfDay } from 'date-fns';
import React, { Fragment, useEffect, useState, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { showError, showSuccess } from 'utils/toast-utils';
import { showAlertConfirm } from 'utils/utils';
import { DEFAULT_FILTER, key, STATUS_MAP, TYPE_LIST_MAP } from './constants';
import Filter from './filter';

export function Notifications({ history, location }) {
  const intl = useIntl();
  const state = location?.state || {};
  const [openFilterDialog, setOpenFilterDialog] = useState(false);
  const [filter, setFilter] = useState({
    ...DEFAULT_FILTER,
    ...(state[key] || {}),
  });
  const [needReload, setNeedReload] = useState(0);
  const isFilter = (filterOp) => {
    const { keyword, limit, page, eventSources, ...filter } = filterOp;
    return Object.values(filter).filter((v) => !!v && String(v).length).length;
  };
  const [showFilter, setShowFilter] = useState(isFilter(filter));
  useEffect(() => {
    if (Object.keys(state).length) {
      history.replace({ ...location?.state, [key]: undefined });
    }
  }, []);
  // table data
  const [
    { data: getTableData, loading: getTableLoading, error: getTableError },
    executeGetTable,
  ] = useAxios(NOTIFICATION_EVENT_API.LIST, {
    useCache: false,
    manual: true,
  });
  useEffect(() => {
    const { createAt = [], notificationAt = [], ...other } = filter;
    const [startCreateAt, endCreateAt] = createAt;
    const [startNotificationAt, endNotificationAt] = notificationAt;
    const params = {
      ...other,
      startCreateAt: startCreateAt
        ? startOfDay(startCreateAt).getTime()
        : undefined,
      endCreateAt: endCreateAt
        ? endOfDay(endCreateAt).getTime()
        : startCreateAt
        ? endOfDay(startCreateAt).getTime()
        : undefined,
      startNotificationAt: startNotificationAt
        ? startOfDay(startNotificationAt).getTime()
        : undefined,
      endNotificationAt: endNotificationAt
        ? endOfDay(endNotificationAt).getTime()
        : startNotificationAt
        ? endOfDay(startNotificationAt).getTime()
        : undefined,
      statuses: filter.statuses.map((s) => s.id),
      eventTypes: filter.eventTypes.map((s) => s.id),
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
  // delete
  const [
    { response: deleteData, loading: deleteLoading, error: deleteError },
    executeDelete,
  ] = useAxios(
    {
      method: 'PATCH',
    },
    {
      manual: true,
    },
  );
  useEffect(() => {
    if (deleteError) {
      showError(deleteError);
    }
  }, [deleteError]);

  useEffect(() => {
    if (deleteData) {
      showSuccess('Hủy thành công');
      setNeedReload(needReload + 1);
    }
  }, [deleteData]);
  const renderOrderCell = ({ rowIndex }) => (
    <span>{(filter.page - 1) * filter.limit + rowIndex + 1}</span>
  );
  const onDeleteBtnClick = (data) => {
    showAlertConfirm(
      {
        text: 'Bạn có chắc chắn muốn hủy thông báo này?',
        title: 'Hủy thông báo',
      },
      intl,
    ).then((result) => {
      if (result.value) {
        executeDelete({
          url: NOTIFICATION_EVENT_API.CANCEL(data.id),
        });
      }
    });
  };
  const actionRenderer = ({ data }) => (
    <>
      <Tooltip title={intl.formatMessage({ id: 'app.tooltip.info' })}>
        <IconButton
          color="primary"
          component={Link}
          to={{
            pathname: `/notification/details/${data.id}`,
            state: {
              [key]: filter,
            },
          }}
        >
          <EditIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      {data.status == 'WAITING' && (
        <Tooltip title="Hủy">
          <IconButton onClick={() => onDeleteBtnClick(data)}>
            <ClearIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
    </>
  );
  const typeRenderer = ({ value }) => TYPE_LIST_MAP[value]?.name || 'New Type';
  const statusRenderer = ({ value }) => {
    const option = STATUS_MAP[value];
    return (
      <Box display="flex" justifyContent="center">
        <Label {...option} variant="ghost" />
      </Box>
    );
  };
  const titleRenderer = ({ data }) => (
    <div>
      <Typography variant="body1" component="p" noWrap title={data.title}>
        {data.title}
      </Typography>
      <Typography
        variant="caption"
        component="p"
        color="textSecondary"
        noWrap
        title={data.content}
      >
        {data.content}
      </Typography>
    </div>
  );
  const columns = [
    {
      caption: intl.formatMessage({ id: 'app.column.order' }),
      width: 'auto',
      alignment: 'center',
      cellRender: renderOrderCell,
    },
    {
      dataField: 'title',
      caption: 'Thông báo',
      cellRender: titleRenderer,
      width: 500,
      minWidth: 500,
    },
    {
      dataField: 'status',
      caption: 'Trạng thái',
      cellRender: statusRenderer,
      // width: 'auto',
      alignment: 'center',
      minWidth: 134,
    },
    {
      caption: 'Thời gian tạo',
      dataField: 'createdAt',
      allowSorting: false,
      dataType: 'datetime',
      format: 'HH:mm dd/MM/yyyy',
      // width: 'auto',
      minWidth: 130,
    },
    {
      caption: 'Thời gian gửi',
      dataField: 'notificationAt',
      allowSorting: false,
      dataType: 'datetime',
      format: 'HH:mm dd/MM/yyyy',
      // width: 'auto',
      minWidth: 130,
    },
    {
      dataField: 'eventType',
      caption: 'Nhóm thông báo',
      cellRender: typeRenderer,
      // width: 'auto',
      minWidth: 120,
    },
    {
      caption: intl.formatMessage({ id: 'app.column.action' }),
      cellRender: actionRenderer,
      width: 'auto',
      minWidth: 103,
      alignment: 'center',
    },
  ];
  const handlePageSize = (e) => {
    setFilter({ ...filter, limit: e.target.value, page: 1 });
  };
  // const handlePropertyChange = e => {
  //   if (e.fullName.includes('sortOrder')) {
  //     if (e.value) {
  //       const direction = e.value == 'asc' ? '+' : '-';
  //       const key = columns[e.fullName.slice(8, -11)].dataField;
  //       setSort(direction + key);
  //     } else setSort(undefined);
  //   }
  // };
  const onFilterBtnClick = () => {
    setOpenFilterDialog(true);
  };
  const onFilterPopoverClose = (ret) => {
    if (ret) {
      const newState = {
        ...filter,
        ...ret,
        page: 1,
      };
      setFilter(newState);
      setShowFilter(isFilter(newState));
    }
    setOpenFilterDialog(false);
  };
  const filterDialog = (
    <Dialog
      open={openFilterDialog}
      onClose={() => onFilterPopoverClose(0)}
      title="Lọc thông báo"
      maxWidth="md"
      // fullWidth
    >
      <Filter initialState={filter} onSubmit={onFilterPopoverClose} />
    </Dialog>
  );
  const onAddBtnClick = () => {
    history.push({
      pathname: '/notification/create',
      state: {
        [key]: filter,
      },
    });
  };
  return (
    <>
      <Helmet>
        <title>Danh sách thông báo</title>
        <meta name="description" content="Danh sách thông báo" />
      </Helmet>
      {(getTableLoading || deleteLoading) && <Loading />}
      {filterDialog}
      <PageHeader
        title="Danh sách thông báo"
        showSearch
        showFilter={Boolean(showFilter)}
        onBack={() => {
          setFilter({
            ...DEFAULT_FILTER,
            keyword: filter.keyword,
            limit: filter.limit,
          });
          setShowFilter(0);
        }}
        defaultSearch={filter.keyword}
        placeholderSearch="Tìm kiếm theo tiêu đề, nội dung tóm tắt"
        showPager
        totalCount={getTableData?.count || 0}
        pageIndex={filter.page}
        rowsPerPage={filter.limit}
        handleChangePageIndex={(pageIndex) => {
          setFilter({ ...filter, page: pageIndex });
        }}
        handlePageSize={handlePageSize}
        onSearchValueChange={(newVal) => {
          setFilter({ ...filter, keyword: newVal, page: 1 });
        }}
      >
        <Tooltip title={intl.formatMessage({ id: 'app.tooltip.add' })}>
          <Badge>
            <IconButtonSquare icon={IconAdd} onClick={() => onAddBtnClick()} />
          </Badge>
        </Tooltip>
        <Tooltip title={intl.formatMessage({ id: 'app.tooltip.filter' })}>
          <Badge badgeContent={showFilter} color="primary">
            <IconButtonSquare icon={IconFilter} onClick={onFilterBtnClick} />
          </Badge>
        </Tooltip>
      </PageHeader>
      {useMemo(
        () => (
          <TableCustom
            data={getTableData?.rows || []}
            columns={columns}
            keyExpr="id"
          />
        ),
        [getTableData],
      )}
    </>
  );
}

export default Notifications;
