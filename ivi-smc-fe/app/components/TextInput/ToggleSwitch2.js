/* eslint-disable no-unused-expressions */
import React from 'react';
import CtToolTip from '../Custom/CtToolTip';
import LabelInput from './element/LabelInput';
import './styles.css';

const ToggleSwitch2 = ({ label, name, height, showTooltip }) => (
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
            disabled
            name="test"
            id={name}
            type="checkbox"
            defaultChecked={false}
          />
          <span className="ct-slider ct-round" />
        </label>
        <label style={{ marginLeft: 10 }} htmlFor={name}>
          Vô hiệu hóa
        </label>
      </div>
    </CtToolTip>
  </div>
);

export default ToggleSwitch2;
