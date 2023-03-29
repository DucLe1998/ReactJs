/* eslint-disable react/no-unstable-nested-components */
import React, { useEffect, useState } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Btn from 'components/Custom/Btn';
import utils from 'utils/utils';
import { callApi } from 'utils/requestUtils';
import { ACCESS_CONTROL_API_SRC } from 'containers/apiUrl';
import PopupCustom from 'components/Custom/popup/PopupCustom';
import CustomTable from 'components/Custom/table/CustomTable';
import Loading from 'containers/Loading/Loadable';

const PopupUpgradeFirm = ({ onClose, data }) => {
  const [listDevice, setListDevice] = useState([]);
  const [loading, setLoading] = useState(false);
  const [itemUpgrade, setItemUpgrade] = useState('');
  const [loadingData, setLoadingData] = useState(false);

  const onClickUpgradeFirm = async (v) => {
    setLoading(true);
    setItemUpgrade(v);
    // console.log('v------------------>', v);
    try {
      const dto = {
        deviceIds: [v.deviceId],
      };
      await callApi(
        `${ACCESS_CONTROL_API_SRC}/devices/upgrade-firmware`,
        'POST',
        dto,
      );
      setLoading(false);
      setItemUpgrade('');
      fetchData(data);
      utils.showToast('Nâng cấp thành công');
    } catch (error) {
      utils.showToast(error.response?.data?.message, 'error');
      setLoading(false);
      setItemUpgrade('');
    }
  };

  const renderManageUserCell = (item) => (
    <div>
      {loading && item.data.deviceId === itemUpgrade.deviceId ? (
        <CircularProgress size={16} />
      ) : (
        <Btn
          colorText="#117B5B"
          style={styles.btn2}
          label="Cập nhật"
          onClick={() => onClickUpgradeFirm(item.data)}
          disabled={item.data.isLatestFirmwareVersion}
        />
      )}
    </div>
  );

  const fetchData = async (v) => {
    const newData = v.map((v) => v.id);
    const dto = {
      deviceIds: newData,
    };
    setLoadingData(true);
    try {
      const res = await callApi(
        `${ACCESS_CONTROL_API_SRC}/devices/check-upgrade-firmware`,
        'POST',
        dto,
      );
      setListDevice(res.data);
    } catch (error) {
      utils.showToastErrorCallApi(error);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    fetchData(data);
  }, [data]);

  return (
    <PopupCustom
      onClose={onClose}
      title="Phiên bản app"
      width="70%"
      height="auto"
      body={
        <>
          {loadingData && <Loading />}
          <div
            style={{
              border: '1px solid rgba(60, 60, 67, 0.1)',
              marginTop: 18,
            }}
          >
            <CustomTable
              height={400}
              data={listDevice || []}
              row={[
                {
                  dataField: 'deviceCode',
                  caption: 'ID',
                  alignment: 'center',
                },
                {
                  dataField: 'deviceName',
                  caption: 'Tên thiết bị',
                  alignment: 'center',
                },
                {
                  caption: 'Vị trí',
                  alignment: 'center',
                  cellRender: (e) => (
                    <div>
                      {data.find((o) => o.id === e.data.deviceId)?.hostName ||
                        ''}
                    </div>
                  ),
                },
                {
                  dataField: 'modelCode',
                  caption: 'Model Code',
                  alignment: 'center',
                },
                {
                  dataField: 'firmwareVersion',
                  caption: 'Phiên bản App',
                  alignment: 'center',
                  cellRender: (i) => (
                    <div>
                      {i.value}
                      <span
                        style={{ fontSize: 12, marginLeft: 4, opacity: 0.6 }}
                      >
                        {i?.data?.isLatestFirmwareVersion
                          ? '(Phiên bản cao nhất)'
                          : ''}
                      </span>
                    </div>
                  ),
                },
                {
                  cellRender: renderManageUserCell,
                  alignment: 'center',
                  width: 150,
                },
              ]}
              disabledSelect
            />
          </div>
        </>
      }
      listBtnFooter={[
        {
          className: 'btn-save',
          label: 'Hủy bỏ',
          onClick: () => onClose(false),
        },
      ]}
    />
  );
};

const styles = {
  btn2: {
    width: 80,
    height: 40,
    border: '1px solid #117B5B',
    borderRadius: 8,
    marginLeft: 20,
  },
};

export default PopupUpgradeFirm;
