import React, { useEffect, useState, useMemo } from 'react';
import PageHeader from 'components/PageHeader';
import { Link } from 'react-router-dom';
import { useIntl } from 'react-intl';
import Loading from 'containers/Loading/Loadable';
import { Tooltip, IconButton } from '@material-ui/core';
import TableCustom from 'components/TableCustom';
import useAxios from 'axios-hooks';
import DeleteIcon from '@material-ui/icons/Delete';
import { CAM_AI_EDGE } from 'containers/apiUrl';
import DropDownButton from 'devextreme-react/drop-down-button';
import { Helmet } from 'react-helmet';
import { showError, showSuccess } from 'utils/toast-utils';
import { showAlertConfirm } from 'utils/utils';
import { DEFAULT_FILTER, key } from './constants';
const EdgeManager = ({ history, location }) => {
  const intl = useIntl();
  const state = location?.state || {};
  const [filter, setFilter] = useState({
    ...DEFAULT_FILTER,
    ...(state[key] || {}),
  });
  const [needReload, setNeedReload] = useState(0);

  useEffect(() => {
    if (Object.keys(state).length) {
      history.replace({ ...location?.state, [key]: undefined });
    }
  }, []);
  // table data
  const [
    { data: getTableData, loading: getTableLoading, error: getTableError },
    executeGetTable,
  ] = useAxios(CAM_AI_EDGE.LIST_EDGE, {
    useCache: false,
    manual: true,
  });
  useEffect(() => {
    executeGetTable({
      params: filter,
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
  const onClearSearch = () => {
    setFilter({
      ...DEFAULT_FILTER,
      limit: filter.limit,
      keyword: filter.keyword,
    });
  };
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
      showSuccess('Thành công');
      setNeedReload(needReload + 1);
    }
  }, [deleteData]);

  const onDeleteBtnClick = (data) => {
    showAlertConfirm({
      text: `Bạn có chắc chắn muốn xóa edge device: ${data.name}`,
    }).then(({ value }) => {
      if (value) {
        executeDelete({
          url: CAM_AI_EDGE.DETAILS_EDGE(data.id),
        });
      }
    });
  };
  const onClickFilter = (val) => {
    setFilter({ ...filter, page: 1, status: val });
  };
  const renderOrderCell = ({ rowIndex }) => (
    <span>{(filter.page - 1) * filter.limit + rowIndex + 1}</span>
  );
  const nameRender = ({ data }) => {
    // NRV offline -> khong can show detail
    if (data?.status == 'offline') {
      return data.name;
    }
    return (
      <Link to={`/camera-ai/configs/edge/${data.id}/info`}>{data.name}</Link>
    );
  };
  const statusRender = ({ data }) => {
    const isOnline = data?.status === 'online';
    return (
      <span style={{ color: isOnline ? '#2AC769' : '#FB4E4E' }}>
        {data?.status}
      </span>
    );
  };
  const actionRender = ({ data }) => (
    <Tooltip title="Xóa">
      <IconButton size="small" onClick={() => onDeleteBtnClick(data)}>
        <DeleteIcon />
      </IconButton>
    </Tooltip>
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
      // dataField: 'name',
      caption: 'Tên',
      cellRender: nameRender,
      minWidth: 300,
    },
    {
      dataField: 'mac',
      caption: 'Mac',
    },
    {
      dataField: 'ip',
      caption: 'ip',
      alignment: 'center',
    },
    {
      dataField: 'countFPGAProcess',
      alignment: 'center',
      caption: 'Process',
    },
    {
      dataField: 'status',
      caption: 'Trạng thái',
      cellRender: statusRender,
      alignment: 'center',
    },
    {
      dataField: 'updatedAt',
      caption: 'Thời gian cập nhật',
      dataType: 'datetime',
      format: 'HH:mm dd/MM/yyyy',
    },
    {
      caption: 'Hành động',
      cellRender: actionRender,
      alignment: 'center',
    },
  ];
  return (
    <>
      <Helmet>
        <title>Edge device</title>
        <meta name="description" content="Edge device" />
      </Helmet>
      {(getTableLoading || deleteLoading) && <Loading />}
      <PageHeader
        title="Edge device"
        showSearch
        showPager
        defaultSearch={filter.keyword}
        pageIndex={filter.page || 0}
        totalCount={getTableData?.count || 0}
        rowsPerPage={filter.limit || 0}
        onSearchValueChange={onSearch}
        handleChangePageIndex={onChangePage}
        handlePageSize={onChangeLimit}
        showFilter={Boolean(filter.status.length)}
        onBack={onClearSearch}
      >
        <DropDownButton
          icon="filter"
          displayExpr="name"
          keyExpr="id"
          dropDownOptions={{ width: 120 }}
          useSelectMode
          selectedItemKey={filter.status}
          items={[
            { name: 'Tất cả', id: '' },
            {
              name: 'Online',
              id: 'online',
            },
            {
              name: 'Offline',
              id: 'offline',
            },
          ]}
          onSelectionChanged={(e) => onClickFilter(e.item.id)}
        />
      </PageHeader>
      {useMemo(
        () => (
          <TableCustom data={getTableData?.rows} columns={columns} />
        ),
        [getTableData],
      )}
    </>
  );
};

export default EdgeManager;
