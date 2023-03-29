import { Badge, IconButton, Tooltip } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import ListIcon from '@material-ui/icons/List';
import useAxios from 'axios-hooks';
import { IconButtonSquare } from 'components/CommonComponent';
import Dialog from 'components/Dialog';
import Label from 'components/Label';
import PageHeader from 'components/PageHeader';
import TableCustom from 'components/TableCustom';
import { IconAdd } from 'constant/ListIcons';
import { CAM_AI_SERVER } from 'containers/apiUrl';
import Loading from 'containers/Loading/Loadable';
import DropDownButton from 'devextreme-react/drop-down-button';
import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl';
// import { checkAuthority } from 'utils/functions';
import { showError, showSuccess } from 'utils/toast-utils';
import { showAlertConfirm } from 'utils/utils';
import AddForm from './AddForm';
import Buckets from './buckets';
import { DEFAULT_FILTER, SERVER_TYPE, SERVER_TYPE_MAP } from './constants';
const defaultNew = {
  description: '',
  host: '',
  password: '',
  port: 0,
  serverType: SERVER_TYPE[0],
  useSSL: false,
  username: '',
};
const ServerInformation = () => {
  const intl = useIntl();
  // const resourceCode = 'cameraai/server-infor';
  // const scopes = checkAuthority(
  //   ['get', 'create', 'update'],
  //   resourceCode,
  //   userAuthority,
  // );
  const [needReload, setNeedReload] = useState(0);
  const [filter, setFilter] = useState(DEFAULT_FILTER);
  const [openAddDialog, setOpenAddDialog] = useState(null);
  const [openBucketDialog, setOpenBucketDialog] = useState(null);
  // table data
  const [
    { data: getTableData, loading: getTableLoading, error: getTableError },
    executeGetTable,
  ] = useAxios(CAM_AI_SERVER.LIST_SERVER, {
    useCache: false,
    manual: true,
  });
  useEffect(() => {
    executeGetTable({
      params: filter,
    });
  }, [filter, needReload]);
  // useEffect(() => {
  //   if (getTableData) {
  //     if (getTableData.rows.length <= 0 && filter.page > 1) {
  //       setFilter({ ...filter, page: filter.page - 1 });
  //     }
  //   }
  // }, [getTableData]);
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
      showSuccess('Thành công');
      setOpenAddDialog(false);
      setNeedReload(needReload + 1);
    }
  }, [postData]);
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
      text: `Bạn có chắc chắn muốn xóa server: ${data.host}`,
    }).then(({ value }) => {
      if (value) {
        executeDelete({
          url: CAM_AI_SERVER.DETAILS_SERVER(data.id),
        });
      }
    });
  };
  const typeRender = ({ value }) => {
    const obj = SERVER_TYPE_MAP[value] || SERVER_TYPE[0];
    return <Label text={obj?.name} color={obj?.color} variant="ghost" />;
  };
  // const renderOrderCell = ({ rowIndex }) => (
  //   <span>{(filter.page - 1) * filter.limit + rowIndex + 1}</span>
  // );
  const actionRender = ({ data }) => (
    <>
      <Tooltip title="Chỉnh sửa">
        <IconButton
          size="small"
          color="primary"
          // disabled={!scopes?.update}
          onClick={() => {
            const { type, ...other } = data;
            setOpenAddDialog({
              ...other,
              serverType: SERVER_TYPE_MAP[type],
            });
          }}
        >
          <EditIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Xóa">
        <IconButton
          size="small"
          color="secondary"
          // disabled={!scopes?.delete}
          onClick={() => {
            onDeleteBtnClick(data);
          }}
        >
          <DeleteIcon />
        </IconButton>
      </Tooltip>
      {data.type === 'MINIO' && (
        <Tooltip title="Show Minio’s buckets">
          <IconButton
            size="small"
            onClick={() => {
              setOpenBucketDialog(data);
            }}
          >
            <ListIcon />
          </IconButton>
        </Tooltip>
      )}
    </>
  );
  const columns = [
    // {
    //   caption: 'STT',
    //   cellRender: renderOrderCell,
    //   minWidth: 50,
    //   width: 'auto',
    // },
    {
      dataField: 'host',
      caption: 'Host',
    },
    {
      dataField: 'port',
      caption: 'Port',
    },
    {
      dataField: 'type',
      caption: 'Loại',
      cellRender: typeRender,
      alignment: 'center',
    },
    {
      dataField: 'useSSL',
      caption: 'SSL',
      alignment: 'center',
    },
    {
      dataField: 'updatedAt',
      caption: 'Thời gian cập nhật',
      dataType: 'datetime',
      format: 'HH:mm dd/MM/yyyy',
      width: 'auto',
      minWidth: 150,
    },
    {
      caption: 'Hành động',
      cellRender: actionRender,
      // alignment: 'center',
      minWidth: 100,
      width: 'auto',
    },
  ];

  // const handleChangePageIndex = (pageIndex) => {
  //   setFilter({ ...filter, page: pageIndex });
  // };

  // const handlePageSize = (e) => {
  //   const { value } = e.target;
  //   setFilter({
  //     limit: value,
  //     page: 1,
  //   });
  // };
  const onClickFilter = (val) => {
    setFilter({ ...filter, page: 1, type: val });
  };
  const onCloseAddDialog = (ret) => {
    if (ret) {
      const isEdit = Boolean(ret?.id);
      executePost({
        data: ret,
        url: isEdit
          ? CAM_AI_SERVER.DETAILS_SERVER(ret.id)
          : CAM_AI_SERVER.LIST_SERVER,
        method: isEdit ? 'PUT' : 'POST',
      });
    } else setOpenAddDialog(null);
  };
  const addDialog = Boolean(openAddDialog) && (
    <Dialog
      open={Boolean(openAddDialog)}
      onClose={() => onCloseAddDialog(0)}
      title={openAddDialog?.id ? 'Chỉnh sửa' : 'Thêm mới'}
      fullWidth
      maxWidth="sm"
    >
      <AddForm onSubmit={onCloseAddDialog} data={openAddDialog} />
    </Dialog>
  );
  const bucketDialog = Boolean(openBucketDialog) && (
    <Dialog
      open={Boolean(openBucketDialog)}
      onClose={() => setOpenBucketDialog(null)}
      title={`List of buckets: ${openBucketDialog.host}`}
      fullWidth
      maxWidth="md"
    >
      <Buckets id={openBucketDialog?.id} />
    </Dialog>
  );
  return (
    <>
      <Helmet>
        <title>Server infomation</title>
        <meta name="description" content="Server infomation" />
      </Helmet>
      {(getTableLoading || postLoading || deleteLoading) && <Loading />}
      {addDialog}
      {bucketDialog}
      <PageHeader
        title="Server Information"
        // showPager
        // pageIndex={filter.page}
        // totalCount={getTableData?.length || 0}
        // rowsPerPage={filter.limit}
        // handlePageSize={handlePageSize}
        // handleChangePageIndex={handleChangePageIndex}
        // showFilter={filter?.type?.length > 0}
        // onBack={() => {
        //   setFilter({ ...DEFAULT_FILTER, limit: filter.limit });
        // }}
      >
        <Tooltip title={intl.formatMessage({ id: 'app.tooltip.add' })}>
          <Badge>
            <IconButtonSquare
              icon={IconAdd}
              onClick={() => setOpenAddDialog(defaultNew)}
            />
          </Badge>
        </Tooltip>
        <DropDownButton
          icon="filter"
          displayExpr="name"
          keyExpr="id"
          dropDownOptions={{ width: 120 }}
          useSelectMode
          selectedItemKey={filter.type}
          items={[{ name: 'Tất cả', id: '' }, ...SERVER_TYPE]}
          onSelectionChanged={(e) => onClickFilter(e.item.id)}
        />
      </PageHeader>
      {useMemo(
        () => (
          <TableCustom data={getTableData} columns={columns} />
        ),
        [getTableData],
      )}
    </>
  );
};

export default ServerInformation;
