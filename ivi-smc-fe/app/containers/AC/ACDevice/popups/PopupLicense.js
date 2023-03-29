/* eslint-disable react/style-prop-object */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-restricted-globals */
import {
  IconCopyLicence,
  IconUpdrageLicense,
} from 'components/Custom/Icon/ListIcon';
import LabelInput from 'components/TextInput/element/LabelInput';
// import { API_ROUTE } from 'containers/apiUrl';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { callApi, callApiWithConfig } from 'utils/requestUtils';
import utils from 'utils/utils';
import Loading from 'containers/Loading/Loadable';
import PopupCustom from 'components/Custom/popup/PopupCustom';

const PopupLicense = ({ onClose, data }) => {
  const intl = useIntl();
  const [countClickCopy, setCountClickCopy] = useState(0);
  const [fileLicense, setFileLicense] = useState('');
  const [loading, setLoading] = useState(false);

  const onSave = async () => {
    const file = fileLicense;
    const formData = new FormData();
    formData.append('file', file);
    setLoading(true);
    try {
      const res = await callApiWithConfig(
        // `${API_ROUTE.UPLOAD_API}`,
        'POST',
        formData,
        {
          headers: {
            'Content-Type': 'application/x-zip-compressed',
          },
        },
      );
      onUpload(res.data);
    } catch (error) {
      setLoading(false);
      utils.showToastErrorCallApi(error);
    }
  };

  const onUpload = async (v) => {
    const dto = {
      fileId: v.id,
      licenseVersion: '',
      modelCode: data.modelCode,
      name: v.name,
    };
    try {
      await callApi(
        // `${API_ROUTE.ACCESS_CONTROL_DEVICE}/devices/license/${data.id}`,
        'POST',
        dto,
      );
      onClose(false);
      utils.showToast('Thành công');
    } catch (error) {
      utils.showToastErrorCallApi(error);
    } finally {
      setLoading(false);
    }
  };

  const macAdd =
    data?.networkConfiguration?.macAddress.replace(/:/g, '_') || '';

  return (
    <PopupCustom
      onClose={onClose}
      title="Import License cho thiết bị"
      width="600px"
      height="400px"
      closeOnOutsideClick
      body={
        <>
          <div
            style={{
              width: '100%',
              marginTop: 20,
            }}
          >
            <LabelInput label="Bấm để tải file lên hệ thống" />
            <div
              style={{
                borderRadius: 6,
                border: '1px solid rgba(0, 0, 0, 0.24)',
                height: 40,
                width: '100%',
                cursor: 'pointer',
                paddingLeft: 8,
                justifyContent: 'space-between',
                paddingRight: 8,
              }}
              onClick={() => {
                document.getElementById('inp').click();
              }}
              className="ct-flex-row"
            >
              <input
                type="file"
                accept=".tar.xz"
                id="inp"
                style={{ display: 'none' }}
                onChange={(event) => {
                  if (event.target.files) {
                    setFileLicense(event.target.files[0]);
                  }
                }}
              />
              {fileLicense?.name || '*.tar.xz'}
              <IconUpdrageLicense />
            </div>
            <div
              style={{
                marginTop: 8,
              }}
            >
              Upload định dạng file .tar.xz, bản license mới được tải lên sẽ đè
              lên bản hiện tại.
            </div>
          </div>
          <div
            style={{
              width: '100%',
              marginTop: 40,
            }}
          >
            <LabelInput label="Mac Address" />
            <div
              style={{
                borderRadius: 6,
                border: '1px solid rgba(0, 0, 0, 0.24)',
                height: 40,
                width: '100%',
                paddingLeft: 8,
                justifyContent: 'space-between',
                paddingRight: 8,
              }}
              className="ct-flex-row"
            >
              {macAdd}
              <div
                style={{
                  cursor: 'pointer',
                }}
                onClick={() => {
                  navigator.clipboard.writeText(macAdd);
                  setCountClickCopy((v) => v + 1);
                }}
              >
                <IconCopyLicence />
              </div>
            </div>
            {countClickCopy > 0 && (
              <div
                style={{
                  color: 'green',
                  fontStyle: 'oblique',
                  marginTop: 8,
                  fontWeight: 300,
                  fontSize: 12,
                }}
              >
                Sao chép Mac Address thành công.
              </div>
            )}
          </div>
          {loading && <Loading />}
        </>
      }
      listBtnFooter={[
        {
          colorText: '#000',
          className: 'btn-cancel',
          label: intl.formatMessage({ id: 'app.button.cancel' }),
          onClick: () => onClose(false),
        },
        {
          className: 'btn-save',
          label: 'Thêm',
          onClick: onSave,
        },
      ]}
    />
  );
};

export default PopupLicense;
