import React from 'react';
import LabelInput from './element/LabelInput';
import './styles.css';

const TextArea = ({
  defaultValue,
  label,
  showError,
  name,
  innerRef,
  disabled,
  onChange,
  width,
  placeholderHidden,
  placeholder,
  rows,
}) => (
  <div className="view-input" style={{ width: width || '100%' }}>
    <div>
      <LabelInput label={label} />
      <textarea
        className="custom-text-area"
        name={name}
        placeholder={
          !placeholderHidden && label
            ? `Nhập ${label.replaceAll('*', '').toLowerCase()}...`
            : placeholder || ''
        }
        defaultValue={defaultValue}
        ref={innerRef}
        onChange={onChange}
        disabled={disabled}
        rows={rows || '5'}
      />
    </div>
    {showError && showError(label, name)}
  </div>
);

export default TextArea;
