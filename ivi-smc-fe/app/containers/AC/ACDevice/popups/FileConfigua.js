/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import VAutocomplete from 'components/VAutocomplete';
import utils, { getUniqueArr } from 'utils/utils';
import { callApi, getApi } from 'utils/requestUtils';
import { ACCESS_CONTROL_API_SRC } from 'containers/apiUrl';
import PopupCustom from 'components/Custom/popup/PopupCustom';
import CustomTable from 'components/Custom/table/CustomTable';
import IconBtn from 'components/Custom/IconBtn';
import { IconDelete, IconPlus } from 'components/Custom/Icon/ListIcon';
import Loading from 'containers/Loading/Loadable';
import { DEVICE_TYPE_DEVICE } from '../constants';
import PopupListDevice from './PopupListDevice';

const FileConfigua = ({ onClose, data, valueFilter }) => {
  const [loadingData, setLoadingData] = useState(false);
  const [valueFileCfg, setValueFileCfg] = useState('');
  const [dataState, setDataState] = useState(data);
  const [openViewListDevice, setopenViewListDevice] = useState(false);

  const onSave = async () => {
    setLoadingData(true);
    try {
      const dto = dataState.map((e) => e.id);
      await callApi(
        `${ACCESS_CONTROL_API_SRC}/devices/file-config/${valueFileCfg.id}`,
        'PUT',
        dto,
      );
      utils.showToast('Cấu hình thành công');
      onClose(false);
    } catch (error) {
      utils.showToastErrorCallApi(error);
    } finally {
      setLoadingData(false);
    }
  };

  return (
    <PopupCustom
      onClose={onClose}
      title="Cài đặt file cấu hình"
      width="70%"
      height="auto"
      closeOnOutsideClick
      body={
        <>
          {loadingData && <Loading />}
          {openViewListDevice && (
            <PopupListDevice
              callback={(e) =>
                setDataState((v) => getUniqueArr([...v, ...e], 'id'))
              }
              valueFt={valueFilter}
              onClose={(v) => setopenViewListDevice(v)}
            />
          )}
          <div
            className="ct-flex-row"
            style={{ justifyContent: 'space-between' }}
          >
            <div style={{ marginBottom: 16, width: '50%' }}>
              <div className="custom-label-imput">Chọn file cấu hình</div>
              <VAutocomplete
                value={valueFileCfg}
                disableClearable
                firstIndex={1}
                loadData={(page, keyword) =>
                  new Promise((resolve, reject) => {
                    getApi(`${ACCESS_CONTROL_API_SRC}/file-config`, {
                      keyword,
                      limit: 50,
                      page,
                    })
                      .then((result) => {
                        resolve({
                          data: result.data?.rows,
                          totalCount: result.data?.count,
                        });
                      })
                      .catch((err) => reject(err));
                  })
                }
                getOptionLabel={(option) => option.name || ''}
                getOptionSelected={(option, selected) =>
                  option.id == selected.id
                }
                onChange={(e, newVal) => setValueFileCfg(newVal)}
              />
            </div>
            <div
              style={{ width: 135, marginRight: 10 }}
              onClick={() => {
                setopenViewListDevice(true);
              }}
              className="ct-div-btn-no-bg ct-flex-row"
            >
              <IconPlus />
              Thêm thiết bị
            </div>
          </div>

          <div
            style={{
              border: '1px solid rgba(60, 60, 67, 0.1)',
              marginTop: 18,
            }}
          >
            <CustomTable
              height={400}
              data={dataState || []}
              row={[
                {
                  dataField: 'code',
                  caption: 'ID thiết bị',
                  alignment: 'center',
                },
                {
                  dataField: 'name',
                  caption: 'Tên thiết bị',
                  alignment: 'center',
                },
                {
                  dataField: 'deviceType',
                  caption: 'Loại thiết bị',
                  key: 3,
                  id: 3,
                  cellRender: (v) => {
                    const found = DEVICE_TYPE_DEVICE.find(
                      (a) => a.value === v.value,
                    );
                    return <div>{found?.label || ''}</div>;
                  },
                  alignment: 'center',
                },
                {
                  dataField: 'hostName',
                  caption: 'Vị trí ',
                  alignment: 'center',
                },
                {
                  dataField: 'Hành động',
                  alignment: 'center',
                  cellRender: (v) => (
                    <IconBtn
                      icon={<IconDelete />}
                      onClick={() => {
                        setDataState(
                          dataState.filter((e) => e.id !== v.data.id),
                        );
                      }}
                    />
                  ),
                },
              ]}
              disabledSelect
            />
          </div>
        </>
      }
      listBtnFooter={[
        {
          className: 'btn-cancel',
          label: 'Hủy bỏ',
          colorText: '#333',
          onClick: () => onClose(false),
        },
        {
          className: 'btn-save',
          label: 'Áp dụng',
          onClick: onSave,
        },
      ]}
    />
  );
};

export default FileConfigua;
