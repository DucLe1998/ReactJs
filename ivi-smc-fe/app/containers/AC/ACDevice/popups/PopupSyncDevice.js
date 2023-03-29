import React, { useState } from 'react';
import RadioGroup from 'devextreme-react/radio-group';
import PopupCustom from 'components/Custom/popup/PopupCustom';
import { callApi } from 'utils/requestUtils';
import utils from 'utils/utils';
import { API_AC_ADAPTER, LIST_COMMAND } from '../constants';

const PopupSyncDevice = ({ onClose, selectedRows }) => {
  const [type, setType] = useState(LIST_COMMAND.SYNC_ALL);

  const onSave = async () => {
    if (selectedRows && selectedRows.length > 0) {
      const dto = {
        deviceIds: selectedRows.map((i) => i.id),
        command: type,
      };
      try {
        callApi(`${API_AC_ADAPTER}/devices/command`, 'POST', dto);
        utils.showToast('Thành công');
        onClose(false);
      } catch (err) {
        utils.showToastErrorCallApi(err);
      }
    }
  };

  return (
    <PopupCustom
      onClose={onClose}
      title="Đồng bộ thiết bị"
      width="510px"
      height="auto"
      body={
        <RadioGroup
          className="custom-dx-radiogroup"
          style={{
            marginTop: 20,
          }}
          displayExpr="name"
          valueExpr="value"
          defaultValue={LIST_COMMAND.SYNC_ALL}
          items={[
            {
              name: 'Đồng bộ tất cả',
              value: LIST_COMMAND.SYNC_ALL,
            },
            {
              name: 'Đồng bộ cấu hình',
              value: LIST_COMMAND.SYNC_CONFIG,
            },
            {
              name: 'Đồng bộ data User',
              value: LIST_COMMAND.SYNC_USER_DATA,
            },
          ]}
          onValueChanged={(v) => setType(v.value)}
        />
      }
      listBtnFooter={[
        {
          colorText: '#000',
          className: 'btn-cancel',
          label: 'Hủy bỏ',
          onClick: () => onClose(false),
        },
        {
          className: 'btn-save',
          label: 'Đồng ý',
          onClick: onSave,
          disabled: !type,
        },
      ]}
    />
  );
};

export default PopupSyncDevice;
