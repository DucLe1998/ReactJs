/* eslint-disable no-unused-expressions */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/button-has-type */
import LabelInput from 'components/TextInput/element/LabelInput';
import React from 'react';
import { IconUpdrageLicense } from './Icon/ListIcon';

const SelectFile = ({ fileName, fileDes, callback, accept }) => (
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
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
      }}
      onClick={() => {
        document.getElementById('inp').click();
      }}
    >
      <input
        type="file"
        accept={accept || ''}
        id="inp"
        style={{ display: 'none' }}
        onChange={event => {
          if (event.target.files) {
            callback && callback(event.target.files[0]);
          }
        }}
      />
      {fileName || '*.xz'}
      <IconUpdrageLicense />
    </div>
    <div
      style={{
        marginTop: 8,
      }}
    >
      {fileDes || ''}
    </div>
  </div>
);

export default SelectFile;
