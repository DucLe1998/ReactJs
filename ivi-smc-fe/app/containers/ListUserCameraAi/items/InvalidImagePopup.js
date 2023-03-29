/* eslint-disable react/prop-types,no-param-reassign,no-unused-expressions,no-dupe-keys */
import React from 'react';
import { Popup } from 'devextreme-react/popup';
import { BsX } from 'react-icons/bs';

import IconBtn from 'components/Custom/IconBtn';
import Btn from 'components/Custom/Btn';

const InvaliteImagePopup = ({ onClose, title, content, txtButton }) => {
  return (
    <Popup
      visible
      showTitle={false}
      onHidden={() => onClose()}
      width="510px"
      height="auto"
      className="no-padding cus-overlay-shader"
    >
      <div style={styles.root}>
        <IconBtn
          onClick={() => onClose()}
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
            {content}
          </div>
        </div>
        <div style={styles.rootBtn}>
          <Btn
            style={styles.btnSave}
            colorText="#FFF"
            label={txtButton}
            onClick={() => onClose()}
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

export default InvaliteImagePopup;
