/* eslint-disable react/button-has-type */
import React, { useState, useEffect } from 'react';
import { IconSearch, IconTime } from './Icon/ListIcon';
import IconBtn from './IconBtn';
import './styles.css';
import useDebounce from './useDebounce';

const TextInputSearch = ({ onChange, placeholder, width, value }) => {
  const [valueInput, setValueInput] = useState('');
  const debouncedSearch = useDebounce(valueInput, 700);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (!value) return setValueInput('');
  }, [value]);

  useEffect(
    () =>
      onChange && onChange((debouncedSearch && debouncedSearch.trim()) || ''),
    [debouncedSearch],
  );

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <IconBtn
        icon={<IconSearch />}
        style={{ ...styles.btn, left: 14 }}
        // disabled
      />

      <input
        style={{
          width: `${width || '100%'}`,
          paddingLeft: 40,
        }}
        value={valueInput}
        placeholder={placeholder || 'Tìm kiếm'}
        onChange={(e) => {
          setValueInput(e.target.value || '');
        }}
        className="input-search"
      />
      {valueInput && (
        <IconBtn
          icon={<IconTime />}
          style={{ ...styles.btn, right: 14 }}
          onClick={() => setValueInput('')}
        />
      )}
    </div>
  );
};

const styles = {
  btn: { padding: 0, position: 'absolute', top: 14 },
};

export default TextInputSearch;
