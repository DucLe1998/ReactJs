import { Badge, IconButton, Tooltip } from '@material-ui/core';
import DownloadIcon from '@material-ui/icons/GetApp';
import useAxios from 'axios-hooks';
import { IconButtonSquare } from 'components/CommonComponent';
import Dialog from 'components/Dialog';
import PageHeader from 'components/PageHeader';
import { IconFilter } from 'constant/ListIcons';
import { API_IAM } from 'containers/apiUrl';
import Loading from 'containers/Loading/Loadable';
import { endOfDay, startOfDay } from 'date-fns';
import DataGrid, { Column, Paging } from 'devextreme-react/data-grid';
import React, { Fragment, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl';
import { showError } from 'utils/toast-utils';
import { buildUrlWithToken } from 'utils/utils';
import FilterPopover from './filter';
const DEFAULT_FILTER = {
  startCreatedAt: null,
  endCreatedAt: null,
};
export default function Details() {
  const intl = useIntl();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [filter, setFilter] = useState(DEFAULT_FILTER);
  const [anchorEl, setAnchorEl] = useState(null);
  // table data
  const [
    {
      data: getStatisticData,
      loading: getStatisticLoading,
      error: getStatisticError,
    },
    executeGetStatistic,
  ] = useAxios(API_IAM.IMPORT_HISTORY, {
    useCache: false,
    manual: true,
  });
  useEffect(() => {
    executeGetStatistic({
      params: {
        page,
        limit: pageSize,
        startCreatedAt: filter.startCreatedAt
          ? startOfDay(filter.startCreatedAt).getTime()
          : undefined,
        endCreatedAt: filter.endCreatedAt
          ? endOfDay(filter.endCreatedAt).getTime()
          : undefined,
      },
    });
  }, [page, pageSize, filter]);
  useEffect(() => {
    if (getStatisticError) {
      showError(getStatisticError);
    }
  }, [getStatisticError]);

  const renderOrderCell = ({ rowIndex }) => (
    <span>{(page - 1) * pageSize + rowIndex + 1}</span>
  );
  const actionRenderer = ({ data }) => (
    <Fragment>
      <Tooltip title="Xuất thống kê chi tiết">
        <IconButton
          href={buildUrlWithToken(data.fileUrl)}
          color="primary"
          target="_blank"
          download
          rel="noreferrer"
        >
          <DownloadIcon />
        </IconButton>
      </Tooltip>
    </Fragment>
  );
  const columns = [
    {
      caption: intl.formatMessage({ id: 'app.column.order' }),
      width: 'auto',
      alignment: 'center',
      cellRender: renderOrderCell,
    },
    {
      dataField: 'fileName',
      caption: 'Tên tệp',
      allowSorting: false,
      cssClass: 'valign-center',
    },
    {
      dataField: 'createdAt',
      caption: 'Ngày nhập',
      allowSorting: false,
      cssClass: 'valign-center',
      dataType: 'date',
      format: 'dd/MM/yyyy',
    },
    // {
    //   dataField: 'status',
    //   caption: 'Trạng thái',
    //   allowSorting: false,
    //   cssClass: 'valign-center',
    //   alignment: 'center',
    // },
    {
      dataField: 'totalUser',
      caption: 'Số lượng nhập',
      allowSorting: false,
      alignment: 'center',
      cssClass: 'valign-center',
    },
    {
      dataField: 'totalImportedUser',
      caption: 'Số lượng nhập thành công',
      allowSorting: false,
      alignment: 'center',
      cssClass: 'valign-center',
    },
    {
      dataField: 'totalErrorUser',
      caption: 'Số lượng nhập thất bại',
      allowSorting: false,
      alignment: 'center',
      cssClass: 'valign-center',
    },
    {
      dataField: 'note',
      caption: 'Ghi chú',
      allowSorting: false,
      alignment: 'center',
      cssClass: 'valign-center',
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
    setPage(1);
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
  const onFilterBtnClick = ({ event }) => {
    setAnchorEl(event.currentTarget);
  };
  const onFilterPopoverClose = ret => {
    setAnchorEl(null);
    if (ret) {
      setFilter(ret);
      setPage(1);
    }
  };
  const popover = (
    <Dialog
      open={Boolean(anchorEl)}
      onClose={() => onFilterPopoverClose(0)}
      title="Lọc"
      maxWidth="xs"
      fullWidth
    >
      <FilterPopover initialState={filter} onSubmit={onFilterPopoverClose} />
    </Dialog>
  );
  return (
    <Fragment>
      <Helmet>
        <title>Lịch sử nhập dữ liệu</title>
        <meta name="description" content="Description of AcConfigLevel" />
      </Helmet>
      {getStatisticLoading && <Loading />}
      {popover}
      <PageHeader
        title="Lịch sử nhập dữ liệu"
        // showSearch
        // placeholderSearch="Tìm kiếm theo tên, mã đơn vị"
        showFilter={Boolean(
          Object.values(filter).filter(v => !!v && String(v).length).length,
        )}
        onBack={() => {
          setFilter(DEFAULT_FILTER);
          setPage(1);
        }}
        showPager
        totalCount={getStatisticData?.count || 0}
        pageIndex={page}
        rowsPerPage={pageSize}
        handleChangePageIndex={pageIndex => {
          setPage(pageIndex);
        }}
        handlePageSize={handlePageSize}
        // onSearchValueChange={newVal => {
        //   setSearch(newVal);
        //   setPage(1);
        // }}
      >
        <Tooltip title={intl.formatMessage({ id: 'app.tooltip.filter' })}>
          <Badge
            badgeContent={
              Object.values(filter).filter(v => !!v && String(v).length).length
            }
            color="primary"
          >
            <IconButtonSquare icon={IconFilter} onClick={onFilterBtnClick} />
          </Badge>
        </Tooltip>
      </PageHeader>
      <DataGrid
        className="center-row-grid"
        dataSource={getStatisticData?.rows || []}
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
