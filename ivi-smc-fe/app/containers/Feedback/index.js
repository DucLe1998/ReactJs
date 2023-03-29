import { Badge, Box, IconButton, Tooltip } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/DeleteOutlineOutlined';
import EditIcon from '@material-ui/icons/InfoOutlined';
import useAxios from 'axios-hooks';
import { IconButtonSquare } from 'components/CommonComponent';
import Dialog from 'components/Dialog';
import Label from 'components/Label';
import PageHeader from 'components/PageHeader';
import { IconFilter } from 'constant/ListIcons';
import { FEEDBACK_API } from 'containers/apiUrl';
import Loading from 'containers/Loading/Loadable';
import { endOfDay, startOfDay } from 'date-fns';
import DataGrid, { Column, Paging } from 'devextreme-react/data-grid';
import { get } from 'lodash';
// import faker from 'faker';
import React, { Fragment, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { showError, showSuccess } from 'utils/toast-utils';
import { showAlertConfirm } from 'utils/utils';
import {
  key,
  DEFAULT_FILTER,
  STATUS_LIST_MAP,
  TYPE_LIST_MAP,
} from './constants';
import Filter from './filter';
import messages from './messages';

export default function Feedback(props) {
  const intl = useIntl();
  const { location, history } = props;
  const state = get(location, `state.${key}`, {});
  const { page = 1, limit = 25, keyword = '', ...other } = state;
  const [pageIndex, setPageIndex] = useState(page);
  const [pageSize, setPageSize] = useState(limit);
  const [search, setSearch] = useState(keyword);
  const [openFilterDialog, setOpenFilterDialog] = useState(false);
  const [filter, setFilter] = useState({ ...DEFAULT_FILTER, ...other });
  const [needReload, setNeedReload] = useState(0);
  // const data = new Array(25).fill().map((v, i) => ({
  //   id: i + 1,
  //   type: TYPE_LIST[Math.floor(Math.random() * 4)],
  //   title: faker.lorem.words(5),
  //   username: faker.name.firstName(),
  //   createdAt: faker.date.past(),
  //   status: STATUS_LIST[Math.floor(Math.random() * 3)],
  //   feedbackAt: faker.date.recent(),
  // }));
  // const [tableData, setTableData] = useState({
  //   rows: data,
  //   count: 100,
  // });
  useEffect(() => {
    if (Object.keys(state).length) {
      history.replace({ ...location?.state, [key]: undefined });
    }
  }, []);
  // table data
  const [
    { data: getTableData, loading: getTableLoading, error: getTableError },
    executeGetTable,
  ] = useAxios(FEEDBACK_API.LIST, {
    useCache: false,
    manual: true,
  });
  useEffect(() => {
    const params = {
      page: pageIndex,
      keyword: search,
      limit: pageSize,
      startDate: filter.startDate
        ? startOfDay(filter.startDate).getTime()
        : undefined,
      endDate: filter.endDate ? endOfDay(filter.endDate).getTime() : undefined,
      status: filter.status?.id || undefined,
      types: filter.types?.id || undefined,
    };
    executeGetTable({
      params,
    });
  }, [pageIndex, pageSize, filter, search, needReload]);
  useEffect(() => {
    if (getTableData) {
      if (getTableData.rows.length <= 0 && pageIndex > 1) {
        setPageIndex(pageIndex - 1);
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
      method: 'DELETE',
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
      showSuccess('Xóa thành công');
      setNeedReload(needReload + 1);
    }
  }, [deleteData]);
  const renderOrderCell = ({ rowIndex }) => (
    <span>{(pageIndex - 1) * pageSize + rowIndex + 1}</span>
  );
  const onDeleteBtnClick = data => {
    showAlertConfirm(
      {
        text: intl.formatMessage(messages.text_delete, {
          name: (data || {}).title,
        }),
        title: intl.formatMessage(messages.title_delete),
      },
      intl,
    ).then(result => {
      if (result.value) {
        executeDelete({
          url: FEEDBACK_API.DELETE(data.id),
        });
      }
    });
  };
  const actionRenderer = ({ data }) => (
    <Fragment>
      <Tooltip title={intl.formatMessage({ id: 'app.tooltip.info' })}>
        <IconButton
          color="primary"
          component={Link}
          to={{
            pathname: `/feedback/details/${data.id}`,
            state: {
              [key]: {
                page: pageIndex,
                keyword: search,
                limit: pageSize,
                ...filter,
              },
            },
          }}
        >
          <EditIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title={intl.formatMessage({ id: 'app.tooltip.delete' })}>
        <IconButton onClick={() => onDeleteBtnClick(data)}>
          <ClearIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Fragment>
  );
  const typeRenderer = ({ value }) => TYPE_LIST_MAP[value].name;
  const statusRenderer = ({ value }) => {
    const option = STATUS_LIST_MAP[value];
    return (
      <Box display="flex" justifyContent="center">
        <Label {...option} variant="ghost" />
      </Box>
    );
  };
  const userRenderer = ({ data }) => (
    <Link to={`/user/${data.userId}/detail`}>{data.username}</Link>
  );
  const columns = [
    {
      caption: intl.formatMessage({ id: 'app.column.order' }),
      width: 'auto',
      alignment: 'center',
      cellRender: renderOrderCell,
    },
    {
      dataField: 'type',
      caption: 'Phân loại',
      allowSorting: false,
      cssClass: 'valign-center',
      cellRender: typeRenderer,
      width: 'auto',
    },
    {
      dataField: 'title',
      caption: 'Tiêu đề',
      allowSorting: false,
      cssClass: 'valign-center',
      width: '50%',
    },
    {
      dataField: 'username',
      caption: 'Người gửi',
      allowSorting: false,
      cssClass: 'valign-center',
      width: 'auto',
      cellRender: userRenderer,
    },
    {
      dataField: 'createdAt',
      caption: 'Thời gian nhận',
      allowSorting: false,
      cssClass: 'valign-center',
      dataType: 'datetime',
      format: 'HH:mm dd/MM/yyyy',
      width: 'auto',
    },
    {
      dataField: 'status',
      caption: 'Trạng thái',
      allowSorting: false,
      cssClass: 'valign-center',
      alignment: 'center',
      cellRender: statusRenderer,
      width: 'auto',
    },
    {
      dataField: 'lastFeedbackAt',
      caption: 'Thời gian phản hồi',
      allowSorting: false,
      cssClass: 'valign-center',
      dataType: 'datetime',
      format: 'HH:mm dd/MM/yyyy',
    },
    {
      caption: intl.formatMessage({ id: 'app.column.action' }),
      cellRender: actionRenderer,
      width: 'auto',
      alignment: 'center',
    },
  ];
  function handlePageSize(e) {
    setPageSize(e.target.value);
    setPageIndex(1);
  }
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
  const onFilterPopoverClose = ret => {
    if (ret) {
      setFilter(ret);
      setPageIndex(1);
    }
    setOpenFilterDialog(false);
  };
  const filterDialog = (
    <Dialog
      open={openFilterDialog}
      onClose={() => onFilterPopoverClose(0)}
      title="Lọc danh sách góp ý"
      maxWidth="sm"
      fullWidth
    >
      <Filter initialState={filter} onSubmit={onFilterPopoverClose} />
    </Dialog>
  );
  return (
    <Fragment>
      <Helmet>
        <title>{intl.formatMessage(messages.header)}</title>
        <meta name="description" content="Description of Feedback" />
      </Helmet>
      {(getTableLoading || deleteLoading) && <Loading />}
      {filterDialog}
      <PageHeader
        title={intl.formatMessage(messages.header)}
        showSearch
        showFilter={Boolean(
          Object.values(filter).filter(v => !!v && String(v).length).length,
        )}
        onBack={() => {
          setFilter(DEFAULT_FILTER);
          setPageIndex(1);
        }}
        defaultSearch={search}
        placeholderSearch="Tìm kiếm theo tiêu đề"
        showPager
        totalCount={getTableData?.count || 0}
        pageIndex={pageIndex}
        rowsPerPage={pageSize}
        handleChangePageIndex={pageIndex => {
          setPageIndex(pageIndex);
        }}
        handlePageSize={handlePageSize}
        onSearchValueChange={newVal => {
          setSearch(newVal);
          setPageIndex(1);
        }}
      >
        <Tooltip title={intl.formatMessage({ id: 'app.tooltip.filter' })}>
          <Badge
            badgeContent={
              Object.values(filter).filter(v => !!v && String(v).length).length
            }
            color="primary"
            // variant="dot"
          >
            <IconButtonSquare icon={IconFilter} onClick={onFilterBtnClick} />
          </Badge>
        </Tooltip>
      </PageHeader>
      <DataGrid
        className="center-row-grid"
        dataSource={getTableData?.rows || []}
        keyExpr="id"
        noDataText={intl.formatMessage({ id: 'app.no_data' })}
        // onOptionChanged={handlePropertyChange}
        style={{
          height: '100%',
          maxHeight: `calc(100vh - ${50 + 84 + 25}px)`,
          minHeight: '270px',
          width: '100%',
          maxWidth: '100%',
        }}
        columnAutoWidth
        allowColumnResizing
        columnResizingMode="widget"
        showRowLines
        showColumnLines={false}
        rowAlternationEnabled
        sorting={{ mode: 'none' }}
      >
        <Paging enabled={false} />
        {React.Children.toArray(
          columns.map(defs => <Column {...defs} allowEditing={false} />),
        )}
      </DataGrid>
    </Fragment>
  );
}
