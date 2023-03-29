/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { Paper } from '@material-ui/core';
import PageHeader from 'components/PageHeader';
import SMCTab from 'components/SMCTab';
import Loading from 'containers/Loading/Loadable';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import { callApi } from 'utils/requestUtils';
import utils, { bytesToSize, cvMiliToHHMMSS } from 'utils/utils';
import { CAM_AI_EDGE } from '../apiUrl';
const DetailInfo = ({ history }) => {
  const { id } = useParams();
  const [data, setData] = useState('');
  const [loading, setLoading] = useState(false);
  const listTabs = [
    { id: 'info', text: 'Informations' },
    { id: 'processes', text: 'Processes' },
    { id: 'files', text: 'Files' },
  ];
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await callApi(CAM_AI_EDGE.DETAILS_EDGE(id), 'GET');
      setData(res.data);
      setLoading(false);
    } catch (error) {
      utils.showToast(error.response?.data?.message, 'error');
      setLoading(false);
    }
  };

  const goBack = () => {
    history.push('/camera-ai/configs/edge');
  };
  return (
    <>
      <Helmet>
        <title>Edge device</title>
        <meta name="description" content="Technopark" />
      </Helmet>
      <PageHeader
        title={`Edge details: ${data?.name || ''}`}
        showBackButton
        onBack={goBack}
      />
      <SMCTab
        items={listTabs}
        selectedTabId="info"
        onChange={(id) => {
          history.push(`${id}`);
        }}
      />
      {loading && <Loading />}
      <Paper style={{ marginTop: 10, padding: 32 }}>
        {[
          {
            name: 'Name',
            value: data?.name,
            style: {
              color: '#000000',
              fontWeight: 500,
            },
          },
          {
            name: 'Hostname',
            value: data?.info?.hostname,
          },
          {
            name: 'Mac',
            value: data?.mac,
          },
          {
            name: 'Version build',
            value: data?.info?.versionBuild,
          },
          {
            name: 'OS',
            value: `${data?.info?.os?.platform}/ ${data?.info?.os?.distro} ${data?.info?.os?.release}`,
          },
          {
            name: 'Date time',
            value: cvMiliToHHMMSS(data?.createdAt),
          },
          {
            name: 'Status',
            value: data?.status,
            style: {
              color: data?.status === 'online' ? '#2AC769' : 'rgb(251, 78, 78)',
            },
          },
          {
            name: 'CPU',
            value: `${data?.info?.cpus?.speed}GHz ${data?.info?.cpus?.cores} cores`,
          },
          {
            name: 'RAM',
            value: `${bytesToSize(
              data?.info?.mem?.total || 0,
            )} (used:${bytesToSize(
              data?.info?.mem?.used || 0,
            )}, free ${bytesToSize(data?.info?.mem?.free || 0)})`,
            style: {
              color: '#000000',
              fontWeight: 500,
            },
          },
          {
            name: 'Networks',
            style: {
              width: '100%',
            },
            value: (
              <div
                style={{
                  padding: '0 36px 0 10px',
                  overflow: 'auto',
                  maxHeight: 300,
                }}
              >
                <RowNetwork
                  item={{
                    title: true,
                    ifaceName: 'IFace',
                    ip4: 'IP4',
                    speed: 'Speed',
                    type: 'Type',
                    mac: 'mac',
                  }}
                />
                {data?.info?.network?.map((item, index) => (
                  <RowNetwork item={item} key={index.toString()} />
                ))}
              </div>
            ),
            type: 'view',
          },
          {
            name: 'Disk',
            style: {
              width: '100%',
              marginTop: -10,
            },
            value: (
              <div
                style={{
                  padding: '0 36px 0 10px',
                  overflow: 'auto',
                  // maxHeight: 600,
                }}
              >
                <RowDisk
                  item={{
                    title: true,
                    serial: 'Serial',
                    model: 'Model ',
                    size: 'Size',
                    type: 'Type',
                    physical: 'Physical',
                    protocol: 'Protocol',
                  }}
                />
                {data?.info?.hdds?.map((item, index) => (
                  <RowDisk item={item} key={index.toString()} />
                ))}
              </div>
            ),
            type: 'view',
          },
        ].map((item, index) => (
          <div
            style={{
              marginBottom: 10,
              // marginTop: item.type === 'view' ? 30 : 0,
            }}
            className="ct-flex-row"
            key={index.toString()}
          >
            <div
              style={{
                width: 120,
                color: '#000',
              }}
            >
              {item.name}:
            </div>
            <div
              style={{
                color: '#0000008A',
                ...item.style,
              }}
            >
              {item.value || 'Không có dữ liệu'}
            </div>
          </div>
        ))}
      </Paper>
    </>
  );
};
const RowNetwork = ({ item }) => (
  <div style={{ width: '80%' }}>
    <div
      style={{
        width: '100%',
        height: 40,
      }}
      className="ct-flex-row"
    >
      <div
        style={{
          width: `20%`,
        }}
      >
        {item?.ifaceName}
      </div>
      <div
        style={{
          width: `25%`,
          color: !item.title && '#0D74E4',
        }}
      >
        {item?.ip4}
      </div>
      <div
        style={{
          width: `25%`,
          color: !item.title && '#000',
        }}
      >
        {item?.mac}
      </div>
      <div
        style={{
          width: `15%`,
          color: !item.title && '#000',
        }}
      >
        {item?.speed}
      </div>
      <div
        style={{
          width: `15%`,
          color: !item.title && '#000',
        }}
      >
        {item?.type}
      </div>
    </div>
    <div
      style={{
        width: '100%',
        height: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.12)',
      }}
    />
  </div>
);

const RowDisk = ({ item }) => (
  <div style={{ width: '80%' }}>
    <div
      style={{
        width: '100%',
        height: 40,
      }}
      className="ct-flex-row"
    >
      <div
        style={{
          width: `20%`,
        }}
      >
        {item?.serial}
      </div>
      <div
        style={{
          width: `25%`,
        }}
      >
        {item?.model}
      </div>
      <div
        style={{
          width: `25%`,
          color: !item.title && '#000',
        }}
      >
        {item.title ? item?.size : bytesToSize(item?.size || 0)}
      </div>
      <div
        style={{
          width: `10%`,
        }}
      >
        {item?.type}
      </div>
      <div
        style={{
          width: `10%`,
        }}
      >
        {item?.physical}
      </div>
      <div
        style={{
          width: `10%`,
        }}
      >
        {item?.protocol}
      </div>
    </div>
    <div
      style={{
        width: '100%',
        height: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.12)',
      }}
    />
  </div>
);
export default DetailInfo;
