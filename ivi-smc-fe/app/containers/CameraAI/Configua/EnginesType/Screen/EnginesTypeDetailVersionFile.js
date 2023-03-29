import { Button, IconButton, Link, Tooltip } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import useAxios from 'axios-hooks';
import Dialog from 'components/Dialog';
import Label from 'components/Label';
import PageHeader from 'components/PageHeader';
import TableCustom from 'components/TableCustom';
import { API_CAMERA_AI } from 'containers/apiUrl';
import Loading from 'containers/Loading/Loadable';
// import FileSaver from 'file-saver';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
// import { checkAuthority } from 'utils/functions';
import { showError, showSuccess } from 'utils/toast-utils';
import { buildUrlWithToken, showAlertConfirm } from 'utils/utils';
import PopupFormFullFile from './VersionFile/PopupFormFullFile';
const defaultNew = {
  defaultConfig: '{}',
  description: '',
  library: null,
  name: '',
  runFileName: '',
  setupFileName: '',
  version: '',
};
const EnginesTypeDetailVersionFile = ({
  // userAuthority,
  history,
}) => {
  // const resourceCode = 'cameraai/engine-types';
  // const scopes = checkAuthority(
  //   ['delete', 'create', 'update'],
  //   resourceCode,
  //   userAuthority,
  // );
  const { id } = useParams();
  const [needReload, setNeedReload] = useState(0);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  // table data
  const [{ data: getData, loading: getLoading, error: getError }, executeGet] =
    useAxios(API_CAMERA_AI.ENGINE_TYPE_DETAILS(id), {
      useCache: false,
      manual: true,
    });
  useEffect(() => {
    if (id) executeGet();
  }, [id, needReload]);
  useEffect(() => {
    if (getError) {
      showError(getError);
    }
  }, [getError]);
  // post
  const [
    { data: postData, loading: postLoading, error: postError },
    executePost,
  ] = useAxios(
    {
      url: API_CAMERA_AI.ENGINE_TYPE_ADD_VERSION(id),
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
      url: API_CAMERA_AI.ENGINE_TYPE_DELETE_VERSION,
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
      text: `Bạn có chắc chắn muốn xóa file version: ${data.name}`,
    }).then(({ value }) => {
      if (value) {
        executeDelete({
          params: {
            'version-file-id': data.id,
          },
        });
      }
    });
  };
  const actionRenderer = ({ data }) => (
    <>
      <Tooltip title="Sửa">
        <IconButton
          size="small"
          color="primary"
          // disabled={!scopes?.update}
          onClick={() => {
            const {
              id,
              libraryId,
              libraryName = 'File_data.zip',
              defaultConfig,
              description,
              name,
              nameFileRun,
              nameFileSetup,
              version,
            } = data;
            setOpenAddDialog({
              id,
              defaultConfig,
              description,
              name,
              runFileName: nameFileRun,
              setupFileName: nameFileSetup,
              version,
              library: {
                libraryId,
                file: {
                  path: libraryName,
                },
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
  const versionRender = ({ value }) => (
    <Label text={value} rounded color="blue" />
  );
  const urlRender = ({ value }) => (
    <Link
      // component="button"
      // onClick={() => {
      //   handleDownloadFile(value);
      // }}
      target="_blank"
      href={buildUrlWithToken(value)}
    >
      Link file
    </Link>
  );
  const columns = [
    {
      dataField: 'name',
      caption: 'Name',
    },
    {
      dataField: 'engineType.type',
      caption: 'Engine type',
    },
    {
      dataField: 'version',
      caption: 'Version',
      cellRender: versionRender,
    },
    {
      dataField: 'url',
      caption: 'Url',
      cellRender: urlRender,
    },
    {
      dataField: 'updatedAt',
      caption: 'Last update',
      dataType: 'datetime',
      format: 'HH:mm dd/MM/yyyy',
    },
    {
      caption: 'Hành động',
      cellRender: actionRenderer,
      alignment: 'center',
      minWidth: 100,
      width: 'auto',
    },
  ];
  const onCloseAddDialog = (ret) => {
    if (ret) {
      const isEdit = Boolean(ret?.id);
      executePost({
        data: ret,
        url: isEdit
          ? API_CAMERA_AI.ENGINE_TYPE_EDIT_VERSION(ret.id)
          : API_CAMERA_AI.ENGINE_TYPE_ADD_VERSION(id),
        method: isEdit ? 'PUT' : 'POST',
      });
    } else setOpenAddDialog(false);
  };
  const addDialog = Boolean(openAddDialog) && (
    <Dialog
      open={Boolean(openAddDialog)}
      onClose={() => onCloseAddDialog(0)}
      title={openAddDialog?.id ? 'Chỉnh sửa' : 'Thêm mới'}
      fullWidth
      maxWidth="sm"
    >
      <PopupFormFullFile onSubmit={onCloseAddDialog} data={openAddDialog} />
    </Dialog>
  );
  return (
    <>
      <Helmet>
        <title>Engines Type</title>
        <meta name="description" content="Engines Type" />
      </Helmet>
      {(getLoading || postLoading || deleteLoading) && <Loading />}
      {addDialog}
      <PageHeader
        title={`Chi tiết Engine Type: ${getData?.name || ''}`}
        showBackButton
        onBack={() => {
          history.push('/camera-ai/configs/engines-type');
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenAddDialog(defaultNew)}
        >
          Thêm mới Edge version file
        </Button>
      </PageHeader>
      <TableCustom data={getData?.versionFiles || []} columns={columns} />
    </>
  );
};

export default EnginesTypeDetailVersionFile;
