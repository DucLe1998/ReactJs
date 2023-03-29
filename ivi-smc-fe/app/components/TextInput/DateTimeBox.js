/* eslint-disable react/prop-types,no-param-reassign,no-unused-expressions,no-dupe-keys */
import React from 'react';
import { DateBox } from 'devextreme-react';

import { IconCalenda, IconClock } from '../Custom/Icon/ListIcon';
import IconBtn from '../Custom/IconBtn';
import LabelInput from './element/LabelInput';

const DateTimeBox = (props) => {
  const {
    title,
    // defaultValue,
    type,
    style,
    placeholder = '',
    ...other
  } = props;
  const checkType = type === 'time';
  const isPlaceHolder = placeholder !== '';
  const dropDownButtonRender = () => (
    <IconBtn
      style={{ padding: 0, marginTop: checkType ? 5 : 7 }}
      icon={checkType ? <IconClock /> : <IconCalenda />}
    />
  );
  return (
    <div className="view-input" style={{ width: '100%', ...style }}>
      {title ? <LabelInput label={title} /> : <div style={{ height: 23.5 }} />}
      <DateBox
        placeholder={
          isPlaceHolder ? placeholder : checkType ? 'h:mm s' : 'DD/MM/YYYY'
        }
        type={checkType ? 'time' : 'date'}
        style={{
          borderRadius: 8,
          height: 40,
        }}
        dropDownButtonRender={dropDownButtonRender}
        openOnFieldClick
        displayFormat={checkType ? '' : 'dd/MM/yyyy'}
        dateOutOfRangeMessage="Dữ liệu không hợp lệ"
        {...other}
      />
    </div>
  );
};

export default DateTimeBox;
