/* eslint-disable react/prop-types,no-param-reassign,no-unused-expressions,no-dupe-keys */
import React from 'react';
import { Popup } from 'devextreme-react/popup';
import { BsX } from 'react-icons/bs';

import IconBtn from '../IconBtn';
import Btn from '../Btn';

const PopupCancel = ({
  onClose,
  onClickSave,
  typeTxt,
  noteTxt,
  subTxt,
  title,
  textFollowTitle,
  closeTxt,
  saveTxt,
}) => {
  const onCancel = () => {
    onClickSave(undefined);
  };

  return (
    <Popup
      visible
      showTitle={false}
      onHidden={() => onClose(false)}
      width="510px"
      height="auto"
      closeOnOutsideClick
      className="no-padding cus-overlay-shader"
    >
      <div style={styles.root}>
        <IconBtn
          onClick={() => onClose(false)}
          style={{ padding: 6, position: 'absolute', top: 6, right: 6 }}
          icon={<BsX color="gray" />}
        />
        <div style={{ fontWeight: 500 }}>
          <div
            style={{
              fontSize: 20,
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 14,
              marginTop: 20,
            }}
          >
            {textFollowTitle ||
              `Các thông tin vừa ${
                typeTxt || ''
              } sẽ không được lưu, bạn có chắc chắn muốn hủy bỏ ${
                subTxt || ''
              }?`}
          </div>
          {noteTxt && noteTxt()}
        </div>
        <div style={styles.rootBtn}>
          <Btn
            colorText="#000"
            style={styles.btnCancel}
            label={closeTxt || 'Ở lại'}
            onClick={() => onClose(false)}
          />

          <Btn
            style={styles.btnSave}
            colorText="#FFF"
            label={saveTxt || 'Đồng ý'}
            onClick={onCancel}
          />
        </div>
      </div>
    </Popup>
  );
};

const styles = {
  root: {
    padding: 36,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    flex: 1,
    height: '100%',
  },
  rootBtn: {
    marginTop: 30,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  btnCancel: {
    borderRadius: 8,
    width: 116,
    height: 40,
    background: '#E2E2E2',
    marginRight: 36,
  },
  btnSave: {
    width: 116,
    height: 40,
    background: '#4B67E2',
    borderRadius: 8,
  },
};

export default PopupCancel;
