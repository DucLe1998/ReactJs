import { Badge, Tooltip } from '@material-ui/core';
import useAxios from 'axios-hooks';
import { IconButtonSquare } from 'components/CommonComponent';
import Dialog from 'components/Dialog';
import PageHeader from 'components/PageHeader';
import TableCustom from 'components/TableCustom';
import { IconAdd } from 'constant/ListIcons';
import { API_CAMERA_AI } from 'containers/apiUrl';
import Loading from 'containers/Loading/Loadable';
import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { showError, showSuccess } from 'utils/toast-utils';
import AddForm from './AddForm';

export default function EnginesType() {
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [needReload, setNeedReload] = useState(0);
  const [filter, setFilter] = useState({
    limit: 25,
    page: 1,
  });
  // table data
  const [
    { data: getTableData, loading: getTableLoading, error: getTableError },
    executeGetTable,
  ] = useAxios(API_CAMERA_AI.ENGINE_TYPE, {
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
  // post
  const [
    { data: postData, loading: postLoading, error: postError },
    executePost,
  ] = useAxios(
    {
      url: API_CAMERA_AI.ENGINE_TYPE,
      method: 'POST',
    },
    {
      manual: true,
    },
  );
  useEffect(() => {
    if (postError) {
      showError(postError);
    }
  }, [postError]);

  useEffect(() => {
    if (postData) {
      showSuccess('Thêm mới thành công');
      setOpenAddDialog(false);
      setNeedReload(needReload + 1);
    }
  }, [postData]);
  const handleChangePageIndex = (pageIndex) => {
    setFilter({ ...filter, page: pageIndex });
  };

  const handlePageSize = (e) => {
    const { value } = e.target;
    setFilter({
      limit: value,
      page: 1,
    });
  };

  const getDetailUrl = (e) =>
    `/camera-ai/configs/engines-type/${e.id}/file-version`;
  const renderOrderCell = ({ rowIndex }) => (
    <span>{(filter.page - 1) * filter.limit + rowIndex + 1}</span>
  );
  const renderNameCell = ({ data }) => (
    <Link to={getDetailUrl(data)}>{data.name}</Link>
  );

  const columns = [
    {
      caption: 'STT',
      cellRender: renderOrderCell,
      minWidth: 50,
    },
    {
      caption: 'Name',
      cellRender: renderNameCell,
      minWidth: 300,
    },
    {
      dataField: 'type',
      caption: 'Type',
    },
    {
      dataField: 'code',
      caption: 'Code',
    },
    {
      dataField: 'countFPGAVersionFiles',
      caption: 'File versions',
    },
    {
      dataField: 'updatedAt',
      caption: 'Last update',
      dataType: 'date',
      format: 'HH:mm dd/MM/yyyy',
    },
  ];
  const onCloseAddDialog = (ret) => {
    if (ret) {
      executePost({
        data: ret,
      });
    } else setOpenAddDialog(false);
  };
  const addDialog = openAddDialog && (
    <Dialog
      title="Thêm mới Engine Type"
      open={openAddDialog}
      fullWidth
      maxWidth="sm"
      onClose={() => onCloseAddDialog(0)}
    >
      <AddForm onSubmit={onCloseAddDialog} />
    </Dialog>
  );
  return (
    <>
      <Helmet>
        <title>Engines Type</title>
        <meta name="description" content="Engines Type" />
      </Helmet>
      <PageHeader
        title="Engines Type"
        showPager
        pageIndex={filter.page}
        totalCount={getTableData?.count || 0}
        rowsPerPage={filter.limit}
        handlePageSize={handlePageSize}
        handleChangePageIndex={handleChangePageIndex}
      >
        <Tooltip title="Thêm mới">
          <Badge>
            <IconButtonSquare
              icon={IconAdd}
              onClick={() => setOpenAddDialog(true)}
            />
          </Badge>
        </Tooltip>
      </PageHeader>
      {(getTableLoading || postLoading) && <Loading />}
      {addDialog}
      {useMemo(
        () => (
          <TableCustom data={getTableData?.rows || []} columns={columns} />
        ),
        [getTableData],
      )}
    </>
  );
}
