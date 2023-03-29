import { Button, IconButton, Link, Tooltip } from '@material-ui/core';
// import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { useDebounceFn } from 'ahooks';
import useAxios from 'axios-hooks';
import Dialog from 'components/Dialog';
import PageHeader from 'components/PageHeader';
import SMCTab from 'components/SMCTab';
import TableCustom from 'components/TableCustom';
import { CAM_AI_EDGE } from 'containers/apiUrl';
import Loading from 'containers/Loading/Loadable';
import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import SockJsClient from 'react-stomp';
// import { checkAuthority } from 'utils/functions';
import { showError, showSuccess } from 'utils/toast-utils';
import { buildUrlWithToken, showAlertConfirm } from 'utils/utils';
import DialogAddfiles from './DialogAddfiles';
const { SOCKET_HOST } = process.env;

const topic = '/topic/cameraai-versionfile';
export default function Files({
  // userAuthority,
  history,
}) {
  const { id } = useParams();
  // const resourceCode = 'cameraai/fpga-version-file';
  // const scopes = checkAuthority(
  //   ['get', 'update', 'delete', 'create'],
  //   resourceCode,
  //   userAuthority,
  // );
  const listTabs = [
    { id: 'info', text: 'Informations' },
    { id: 'processes', text: 'Processes' },
    { id: 'files', text: 'Files' },
  ];
  const wsUrl = buildUrlWithToken(SOCKET_HOST);
  const [needReload, setNeedReload] = useState(0);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  // table data
  const [
    { data, loading: getTableLoading, error: getTableError },
    executeGetTable,
  ] = useAxios(CAM_AI_EDGE.DETAILS_EDGE(id), {
    useCache: false,
    manual: true,
  });
  useEffect(() => {
    executeGetTable();
  }, [needReload]);
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
      showSuccess('Thành công');
      setNeedReload(needReload + 1);
    }
  }, [deleteData]);
  const onDeleteBtnClick = (data) => {
    showAlertConfirm({
      text: `Bạn có chắc chắn muốn xóa file: ${data.name}`,
    }).then(({ value }) => {
      if (value) {
        executeDelete({
          url: CAM_AI_EDGE.DELETE_FILE(id, data.id),
        });
      }
    });
  };
  // post
  const [
    { data: postData, loading: postLoading, error: postError },
    executePost,
  ] = useAxios(
    {
      url: CAM_AI_EDGE.ADD_MULTI_FILE,
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
  const renderActions = ({ data }) => (
    <>
      {/* <Tooltip title="Sửa">
      <IconButton
        disabled={!!(!scopes.update || item.tempStatus) || isFpgaOffline}
        onClick={() => updateFile(item)}
      >
        <EditIcon fontSize="small" />
      </IconButton>
    </Tooltip> */}
      <Tooltip title="Xóa">
        <IconButton
          // disabled={!!(!scopes.delete || item.tempStatus) || isFpgaOffline}
          onClick={() => {
            onDeleteBtnClick(data);
          }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </>
  );
  const renderStatus = ({ data }) => {
    switch (data?.status) {
      case 'DELETING':
        return <span style={{ color: 'rgb(255, 152, 0)' }}>Deleting...</span>;
      case 'DOWNLOADING':
        return <span style={{ color: '#40A574' }}>Downloading...</span>;
      default:
        return <span style={{ color: 'rgba(0, 0, 0, 0.8)' }}>Existed</span>;
    }
  };

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
      caption: 'Name',
      dataField: 'name',
    },
    {
      caption: 'Engine Type',
      dataField: 'engineType.name',
    },
    {
      caption: 'Version',
      dataField: 'version',
    },
    {
      caption: 'Url',
      dataField: 'url',
      cellRender: urlRender,
    },
    {
      caption: 'Last Updated',
      dataField: 'updatedAt',
      dataType: 'datetime',
      format: 'HH:mm dd/MM/yyyy',
    },
    {
      caption: 'Action',
      cellRender: renderActions,
    },
    {
      caption: 'Status',
      cellRender: renderStatus,
    },
  ];

  const goBack = () => {
    history.push('/camera-ai/configs/edge');
  };
  const { run: debounceReload } = useDebounceFn(() => {
    setNeedReload(needReload + 1);
  });
  const handleAdDialogClose = (ret) => {
    if (ret) {
      executePost({
        data: {
          fpgaManagerIds: [id],
          versionFileIds: ret.versionFiles.map((i) => i.id),
        },
      });
    } else setOpenAddDialog(false);
  };
  const addDialog = openAddDialog && (
    <Dialog
      title="Thêm mới phiên bản EDGE"
      open={openAddDialog}
      onClose={() => handleAdDialogClose(0)}
      fullWidth
      maxWidth="md"
    >
      <DialogAddfiles onSubmit={handleAdDialogClose} />
    </Dialog>
  );
  return (
    <>
      <Helmet>
        <title>Edge device</title>
        <meta name="description" content="Technopark" />
      </Helmet>
      {(getTableLoading || deleteLoading || postLoading) && <Loading />}
      {addDialog}
      <PageHeader
        title={`Edge details: ${data?.name || ''}`}
        showBackButton
        onBack={goBack}
      >
        {/* {scopes.create && !isFpgaOffline && ( */}
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenAddDialog(true)}
        >
          Add files
        </Button>
        {/* )} */}
      </PageHeader>
      <SMCTab
        items={listTabs}
        selectedTabId="files"
        onChange={(id) => {
          history.push(`${id}`);
        }}
      />
      {useMemo(
        () => (
          <TableCustom
            data={data?.versionFile}
            columns={columns}
            style={{ marginTop: 10, maxHeight: 'calc(100vh - 213px)' }}
          />
        ),
        [data],
      )}
      <SockJsClient
        url={wsUrl}
        topics={[topic]}
        onMessage={(message) => {
          if (message.fpgaManagerUuid === id) {
            debounceReload();
          }
        }}
        headers={{
          'Access-Control-Allow-Credentials': true,
        }}
      />
    </>
  );
}
