/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import LabelInput from 'components/TextInput/element/LabelInput';
import React from 'react';
import './styles.css';

const CheckBox = ({
  label,
  name,
  innerRef,
  disabled,
  textInput,
  checked,
  onChange,
}) => (
  <div className="view-input" style={{ width: '100%' }}>
    <div>
      <LabelInput label={label} />
      <div
        className="ct-flex-row"
        style={{
          height: 40,
          cursor: 'pointer',
        }}
        onClick={() => onChange && onChange()}
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
          checked={checked}
          onChange={() => {}}
        />
        <div
          style={{
            fontWeight: 400,
          }}
        >
          {textInput}
        </div>
      </div>
    </div>
  </div>
);

export default CheckBox;
