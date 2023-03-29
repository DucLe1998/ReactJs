/* eslint-disable react/prop-types,no-param-reassign,no-unused-expressions,no-dupe-keys */
import React from 'react';
import { Popup } from 'devextreme-react/popup';
import IconX from '../IconX';
import Btn from '../Btn';

const PopupCustom = ({
  onClose,
  width,
  height,
  title,
  body,
  listBtnFooter,
  footer,
  closeOnOutsideClick,
}) => (
  <Popup
    visible
    showTitle={false}
    onHidden={() => onClose(false)}
    width={width || 'auto'}
    height={height || 'auto'}
    closeOnOutsideClick={!closeOnOutsideClick}
    className="no-padding cus-overlay-shader"
  >
    <div className="ct-root-popup">
      <IconX onClick={() => onClose(false)} />
      <div>
        <div
          style={{
            fontWeight: 500,
            fontSize: 20,
          }}
        >
          {title}
        </div>
        <div
          style={{
            marginTop: 20,
          }}
        >
          {body}
        </div>
      </div>

      <div
        style={{
          marginTop: 30,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-end',
        }}
      >
        {footer ||
          (listBtnFooter &&
            listBtnFooter.map((item, index) => (
              <Btn
                key={index.toString()}
                colorText={item.disabled ? '#FFF' : item.colorText}
                className={item.className}
                label={item.label}
                onClick={item.onClick}
                disabled={item.disabled}
              />
            )))}
      </div>
    </div>
  </Popup>
);

export default PopupCustom;
