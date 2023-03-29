import { Button, IconButton, Tooltip } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import PlayArrowRoundedIcon from '@material-ui/icons/PlayArrowRounded';
import StopIcon from '@material-ui/icons/Stop';
import { useDebounceFn } from 'ahooks';
import useAxios from 'axios-hooks';
import PageHeader from 'components/PageHeader';
import SMCTab from 'components/SMCTab';
import TableCustom from 'components/TableCustom';
import { CAM_AI_EDGE } from 'containers/apiUrl';
import Loading from 'containers/Loading/Loadable';
import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
// import { checkAuthority } from 'utils/functions';
import SockJsClient from 'react-stomp';
import { showError, showSuccess } from 'utils/toast-utils';
import { buildUrlWithToken, showAlertConfirm } from 'utils/utils';
// import DialogCreate from './DialogCreate';
const { SOCKET_HOST } = process.env;

const topic = '/topic/cameraai-process';
export default function Processes({
  history,
  // userAuthority
}) {
  const { id } = useParams();
  // const resourceCode = 'cameraai/fpga-process';
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

  const handleRouteEditProcess = (item) => {
    history.push(`/camera-ai/configs/edge/${id}/processes/${item.id}`);
  };
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
      text: `Bạn có chắc chắn muốn xóa process: ${data.name}`,
    }).then(({ value }) => {
      if (value) {
        executeDelete({
          url: CAM_AI_EDGE.DETAILS_PROCESS(data.id),
        });
      }
    });
  };
  // status
  const [
    { data: statusData, loading: statusLoading, error: statusError },
    executeStatus,
  ] = useAxios(
    { method: 'PUT' },
    {
      manual: true,
    },
  );
  useEffect(() => {
    if (statusError) {
      showError(statusError);
    }
  }, [statusError]);

  useEffect(() => {
    if (statusData) {
      showSuccess('Thành công');
    }
  }, [statusData]);
  const onStatusBtnClick = (item) => {
    executeStatus({
      url: CAM_AI_EDGE.STATUS_PROCESS(item.id),
      data: {
        status: item.status == 'stop' ? 'start' : 'stop',
      },
    });
  };
  const renderActions = ({ data }) => (
    <>
      {data.status == 'stop' ? (
        <Tooltip title="Start" color="primary">
          <IconButton
            // disabled={!scopes.update || isFpgaOffline}
            onClick={() => onStatusBtnClick(data)}
          >
            <PlayArrowRoundedIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Stop" color="secondary">
          <IconButton
            // disabled={!scopes.update || isFpgaOffline}
            onClick={() => onStatusBtnClick(data)}
          >
            <StopIcon />
          </IconButton>
        </Tooltip>
      )}
      <Tooltip title="Sửa">
        <IconButton
          // disabled={!scopes.update || isFpgaOffline}
          onClick={() => {
            handleRouteEditProcess(data);
          }}
        >
          <EditIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Xóa">
        <IconButton
          // disabled={!scopes.delete || isFpgaOffline}
          onClick={() => {
            onDeleteBtnClick(data);
          }}
        >
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </>
  );

  const columns = [
    {
      caption: 'Process name',
      dataField: 'name',
    },
    {
      caption: 'Module',
      dataField: 'typeProcess',
    },
    {
      caption: 'Version file',
      dataField: 'versionFile.name',
    },
    {
      caption: 'Process',
      dataField: 'process',
    },
    {
      caption: 'CPU usage',
      dataField: 'cpu',
    },
    {
      caption: 'Memory usage',
      dataField: 'memory',
    },
    {
      caption: 'Elapsed',
      dataField: 'elapsed',
    },
    {
      caption: 'Actions',
      cellRender: renderActions,
      alignment: 'center',
    },
  ];
  const goBack = () => {
    history.push('/camera-ai/configs/edge');
  };
  const { run: debounceReload } = useDebounceFn(() => {
    setNeedReload(needReload + 1);
  });
  const onAddBtnClick = () => {
    history.push(`/camera-ai/configs/edge/${id}/processes/new`);
  };
  return (
    <>
      <Helmet>
        <title>Edge device</title>
        <meta name="description" content="Technopark" />
      </Helmet>
      {(getTableLoading || deleteLoading || statusLoading) && <Loading />}
      <PageHeader
        title={`Edge details: ${data?.name || ''}`}
        showBackButton
        onBack={goBack}
      >
        {/* {scopes.create && !isFpgaOffline && ( */}
        <Button variant="contained" color="primary" onClick={onAddBtnClick}>
          Create a new process
        </Button>
        {/* )} */}
      </PageHeader>
      <SMCTab
        items={listTabs}
        selectedTabId="processes"
        onChange={(id) => {
          history.push(`${id}`);
        }}
      />
      {useMemo(
        () => (
          <TableCustom
            data={data?.fpgaProcess}
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
