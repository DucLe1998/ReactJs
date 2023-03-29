import { Badge, IconButton, Tooltip } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import useAxios from 'axios-hooks';
import { IconButtonSquare } from 'components/CommonComponent';
import Dialog from 'components/Dialog';
import PageHeader from 'components/PageHeader';
import TableCustom from 'components/TableCustom';
import { IconAdd } from 'constant/ListIcons';
import { CAM_AI_DEVICE } from 'containers/apiUrl';
import Loading from 'containers/Loading/Loadable';
import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { showError, showSuccess } from 'utils/toast-utils';
import { showAlertConfirm } from 'utils/utils';
import AddForm from './AddForm';
const defaultNew = {
  area: null,
  ip: '',
  name: '',
  port: '',
  sirens: [],
};
export default function EnginesType() {
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [needReload, setNeedReload] = useState(0);
  const [filter, setFilter] = useState({
    // limit: 25,
    // page: 1,
    keyword: '',
  });
  // table data
  const [
    { data: getTableData, loading: getTableLoading, error: getTableError },
    executeGetTable,
  ] = useAxios(CAM_AI_DEVICE.LIST, {
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

  // const renderOrderCell = ({ rowIndex }) => (
  //   <span>{(filter.page - 1) * filter.limit + rowIndex + 1}</span>
  // );
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
      text: `Bạn có chắc chắn muốn xóa còi: ${data.deviceName}`,
    }).then(({ value }) => {
      if (value) {
        executeDelete({
          url: CAM_AI_DEVICE.DETAILS(data.id),
        });
      }
    });
  };
  const actionRender = ({ data }) => (
    <>
      <Tooltip title="Chỉnh sửa">
        <IconButton
          size="small"
          color="primary"
          // disabled={!scopes?.update}
          onClick={() => {
            const { areaId, areaName, deviceName, ...other } = data;
            setOpenAddDialog({
              ...other,
              name: deviceName,
              area: {
                id: areaId,
                areaName,
              },
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
    </>
  );
  const sirenRender = ({ value }) => value.map((i) => i.name).join(', ');
  const columns = [
    // {
    //   caption: 'STT',
    //   cellRender: renderOrderCell,
    //   minWidth: 50,
    // },
    {
      caption: 'Tên',
      dataField: 'deviceName',
      // minWidth: 300,
    },
    {
      dataField: 'ip',
      caption: 'IP',
    },
    // {
    //   dataField: 'port',
    //   caption: 'Port',
    // },
    {
      dataField: 'areaName',
      caption: 'Khu vực',
    },
    {
      caption: 'Còi',
      dataField: 'sirens',
      cellRender: sirenRender,
    },
    // {
    //   dataField: 'updatedAt',
    //   caption: 'Last update',
    //   dataType: 'date',
    //   format: 'HH:mm dd/MM/yyyy',
    // },
    {
      caption: 'Hành động',
      cellRender: actionRender,
      alignment: 'center',
      minWidth: 100,
      width: 'auto',
    },
  ];
  const onCloseAddDialog = (ret) => {
    if (ret) {
      const isEdit = Boolean(ret?.id);
      const { area, sirens, ...other } = ret;
      executePost({
        data: {
          ...other,
          areaId: area.id,
          areaName: area.areaName,
          sirenIds: sirens.map((i) => i.id),
        },
        url: isEdit ? CAM_AI_DEVICE.DETAILS(ret.id) : CAM_AI_DEVICE.LIST,
        method: isEdit ? 'PUT' : 'POST',
      });
    } else setOpenAddDialog(false);
  };
  const addDialog = openAddDialog && (
    <Dialog
      title={`${openAddDialog.id ? 'Chỉnh sửa' : 'Thêm mới'} camera`}
      open={Boolean(openAddDialog)}
      fullWidth
      maxWidth="md"
      onClose={() => onCloseAddDialog(0)}
    >
      <AddForm onSubmit={onCloseAddDialog} data={openAddDialog} />
    </Dialog>
  );
  return (
    <>
      <Helmet>
        <title>Danh sách camera</title>
        <meta name="description" content="Danh sách camera" />
      </Helmet>
      <PageHeader
        title="Danh sách camera"
        showSearch
        onSearchValueChange={(e) => {
          setFilter({ keyword: e });
        }}
        // showPager
        // pageIndex={filter.page}
        // totalCount={getTableData?.count || 0}
        // rowsPerPage={filter.limit}
        // handlePageSize={handlePageSize}
        // handleChangePageIndex={handleChangePageIndex}
      >
        <Tooltip title="Thêm mới">
          <Badge>
            <IconButtonSquare
              icon={IconAdd}
              onClick={() => setOpenAddDialog(defaultNew)}
            />
          </Badge>
        </Tooltip>
      </PageHeader>
      {(getTableLoading || postLoading || deleteLoading) && <Loading />}
      {addDialog}
      {useMemo(
        () => (
          <TableCustom data={getTableData || []} columns={columns} />
        ),
        [getTableData],
      )}
    </>
  );
}
