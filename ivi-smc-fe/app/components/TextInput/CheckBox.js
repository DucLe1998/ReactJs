import React from 'react';
import LabelInput from './element/LabelInput';
import './styles.css';

const CheckBox = ({
  label,
  name,
  innerRef,
  disabled,
  textInput,
  checked,
  onChange,
  onlyCheckbox,
}) => (
  <div className="view-input" style={{ width: '100%' }}>
    <div>
      <LabelInput label={label} />
      <div
        className="ct-flex-row"
        style={{
          height: 40,
        }}
        onChange={() => onChange && onChange()}
      >
        <input
          style={{
            height: 20,
            cursor: 'pointer',
            marginRight: 8,
          }}
          name={name}
          id={name}
          ref={innerRef}
          disabled={disabled}
          type="checkbox"
          defaultChecked={checked}
        />
        {!onlyCheckbox && (
          <label
            style={{
              cursor: 'pointer',
            }}
            htmlFor={name}
          >
            {textInput}
          </label>
        )}
      </div>
    </div>
  </div>
);

export default CheckBox;
