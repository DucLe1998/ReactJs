import { SelectBox } from 'devextreme-react';
import React from 'react';
import { BiChevronDown } from 'react-icons/bi';
import IconBtn from '../Custom/IconBtn';
import LabelInput from './element/LabelInput';

const SelectInput = ({
  data,
  onValueChanged,
  label,
  defaultValue,
  width,
  marginBottom,
}) => (
  <div style={{ width: '100%', marginBottom: marginBottom || 16 }}>
    <LabelInput label={label} />
    <SelectBox
      dataSource={data}
      defaultValue={defaultValue || data[0].key}
      valueExpr="key"
      displayExpr="name"
      height={40}
      width={width || '100%'}
      dropDownButtonRender={() => (
        <IconBtn
          style={{ padding: 4 }}
          disabled
          icon={<BiChevronDown color="#00554A" />}
        />
      )}
      groupRender={v => <div>{v}</div>}
      style={{
        borderRadius: 6,
        border: '1px solid rgba(0, 0, 0, 0.12)',
        fontSize: 14,
        color: 'rgba(0, 0, 0, 0.84)',
      }}
      onValueChanged={i => onValueChanged && onValueChanged(i.value)}
    />
  </div>
);

export default SelectInput;
