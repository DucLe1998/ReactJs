/* eslint-disable no-unused-expressions */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import { IconTime } from '../Custom/Icon/ListIcon';
import LabelInput from './element/LabelInput';
import './styles.css';

const TextInput = ({
  defaultValue,
  label,
  showError,
  name,
  innerRef,
  disabled,
  onChange,
  width,
  height,
  type,
  placeholderHidden,
  placeholder,
  min,
  value,
  showInputWithValue,
  showClearValue,
}) => {
  const [checkValue, setCheckValue] = useState(false);
  const onChangeInput = (e) => {
    onChange && onChange(e.target.value);
    if (e.target.value) {
      setCheckValue(true);
    } else {
      setCheckValue(false);
    }
  };
  return (
    <div className="view-input" style={{ width: width || '100%' }}>
      <div style={{ position: 'relative' }}>
        <LabelInput label={label} />
        {showInputWithValue ? (
          <input
            style={{
              height: height || 40,
            }}
            className="custom-text-input"
            name={name}
            type={type}
            placeholder={
              !placeholderHidden && label
                ? `Nhập ${label.replaceAll('*', '').toLowerCase()}...`
                : placeholder || ''
            }
            value={value}
            ref={innerRef}
            onChange={onChange && onChangeInput}
            disabled={disabled}
            min={min}
            id={name}
          />
        ) : (
          <input
            style={{
              height: height || 40,
            }}
            className="custom-text-input"
            name={name}
            type={type}
            placeholder={
              !placeholderHidden && label
                ? `Nhập ${label.replaceAll('*', '').toLowerCase()}...`
                : placeholder || ''
            }
            defaultValue={defaultValue}
            ref={innerRef}
            onChange={onChange && onChangeInput}
            disabled={disabled}
            min={min}
            id={name}
          />
        )}
        {checkValue && showClearValue && (
          <div
            onClick={() => {
              document.getElementById(name).value = '';
              setCheckValue(false);
              onChange && onChange('');
            }}
            className="ct-icon-clear-value-text"
          >
            <IconTime />
          </div>
        )}
      </div>
      {showError && showError(label, name)}
    </div>
  );
};

export default TextInput;
