/* eslint-disable react/prop-types,no-param-reassign,no-unused-expressions,no-dupe-keys */
import React from 'react';
import { Popup } from 'devextreme-react/popup';
import { BsX } from 'react-icons/bs';

import IconBtn from '../../components/Custom/IconBtn';
import Btn from '../../components/Custom/Btn';

const PopupDelete = ({
  onClose,
  onClickSave,
  //   typeTxt,
  noteTxt,
}) => {
  const onSave = () => {
    onClickSave();
  };

  return (
    <Popup
      visible
      showTitle={false}
      onHidden={() => onClose(false)}
      width="510px"
      height="auto"
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
            Xóa đối tượng
          </div>
          <div
            style={{
              fontSize: 14,
              marginTop: 20,
            }}
          >
            Bạn có chắc chắn muốn xóa những đối tượng này ra khỏi danh sách đen?
          </div>
          {noteTxt && noteTxt()}
        </div>
        <div style={styles.rootBtn}>
          <Btn
            colorText="#000"
            style={styles.btnCancel}
            label="Hủy"
            onClick={() => onClose(false)}
          />

          <Btn
            style={styles.btnSave}
            colorText="#FFF"
            label="Đồng ý"
            onClick={onSave}
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
    background: '#00554A',
    borderRadius: 8,
  },
};

export default PopupDelete;
