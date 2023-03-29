/* eslint-disable camelcase */
/* eslint-disable consistent-return */
import React, { useState } from 'react';
import { BiX } from 'react-icons/bi';
import moment from 'moment';

import IconBtn from '../IconBtn';
import Btn from '../Btn';
import { callApiWithConfig } from '../../../utils/requestUtils';
import { API_ROUTE } from '../../../containers/apiUrl';
import utils from '../../../utils/utils';
import LoadingIcon from '../LoadingIcon';
import TextInput from '../../TextInput/TextInput';

const ViewCaptureCamera = ({ onClose, dataImage, bottom, right, dataItem }) => {
  const defaultValue = `${dataItem?.parent?.information?.ip}_${
    dataItem?.id
  }_${moment().format('YYYYMMDDHHmmSS')}`;
  const [nameImage, setNameImage] = useState(defaultValue);
  const [checkValidate, setCheckValidate] = useState(false);
  const [loading, setLoading] = useState(false);

  const onClickUpload = async () => {
    if (!nameImage) {
      return setCheckValidate(true);
    }
    if (dataImage) {
      // console.log('dataImage', dataImage);
      setLoading(true);
      const formData = new FormData();
      formData.append(
        'file',
        dataImage.blob,
        `${nameImage}.${dataImage.format}`,
      );
      const res = await callApiWithConfig(
        `${API_ROUTE.UPLOAD_FILE}`,
        'POST',
        formData,
        {
          header: {
            'Content-Type': 'application/multipart/form-data; charset=UTF-8',
          },
        },
      );
      if (res && res.code === 200) {
        utils.showToast('Lưu thành công');
        setLoading(false);
        onClose();
      }
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        bottom: bottom || 70,
        right: right || 50,
        borderRadius: 8,
        backgroundColor: '#FFF',
        padding: 12,
        width: 500,
        zIndex: 20,
      }}
    >
      <div>
        <div style={styles.header}>
          Camera
          <IconBtn onClick={onClose} icon={<BiX color="gray" />} />
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: 12,
            borderRadius: 4,
            overflow: 'hidden',
          }}
        >
          <img
            src={dataImage.dataUri || defaultImage}
            alt="Trulli"
            width="100%"
            height="240"
          />
        </div>
        <TextInput
          placeholder="Nhập tên hình ảnh"
          validate="Chưa nhập tên hình ảnh"
          checkValidate={checkValidate}
          defaultValue={defaultValue}
          onChange={e => {
            setNameImage(e);
            setCheckValidate(false);
          }}
        />
        <div style={styles.footer}>
          Hình ảnh sẽ được lưu về thư viện hình ảnh
          {loading ? (
            <LoadingIcon />
          ) : (
            <Btn
              label="Lưu"
              backgroundColor="rgba(116, 116, 128, 0.08)"
              colorText="#000"
              onClick={onClickUpload}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  root: {
    position: 'absolute',
    bottom: 70,
    right: 50,
    borderRadius: 8,
    backgroundColor: '#FFF',
    padding: 12,
    width: 500,
    zIndex: 20,
  },
  header: {
    height: 48,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 10,
    fontSize: 18,
    fontWeight: 500,
  },
  footer: {
    height: 48,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 14,
    marginTop: 6,
  },
};

const defaultImage =
  'https://img.wallpapersafari.com/desktop/1920/1080/60/19/FfWM9R.jpg';

export default ViewCaptureCamera;
