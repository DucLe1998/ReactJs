/* eslint-disable no-unused-expressions */
import React, { useState } from 'react';
import CtToolTip from '../Custom/CtToolTip';
import LabelInput from './element/LabelInput';
import './styles.css';

const ToggleSwitch = ({
  label,
  name,
  innerRef,
  checked,
  height,
  disabledTextValue,
  disabled,
  onChange,
  showTooltip,
}) => {
  const [valueSwitch, setValueSwitch] = useState(checked);

  return (
    <div className="view-input">
      <LabelInput label={label} />
      <CtToolTip text={showTooltip || ''}>
        <div
          style={{
            height: height || 40,
            paddingTop: 10,
          }}
        >
          <label className="ct-switch">
            <input
              disabled={disabled}
              name={name}
              id={name}
              ref={innerRef}
              onChange={() => {
                setValueSwitch(!valueSwitch);
                onChange && onChange(!valueSwitch);
              }}
              type="checkbox"
              defaultChecked={checked}
            />
            <span className="ct-slider ct-round" />
          </label>
          {!disabledTextValue && (
            <label style={{ marginLeft: 10 }} htmlFor={name}>
              {valueSwitch ? 'Được kích hoạt' : 'Vô hiệu hóa'}
            </label>
          )}
        </div>
      </CtToolTip>
    </div>
  );
};

export default ToggleSwitch;
