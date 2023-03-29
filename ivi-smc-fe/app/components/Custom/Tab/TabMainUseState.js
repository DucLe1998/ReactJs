/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useEffect, useState } from 'react';

const defaultValue = [
  { label: 'Tab 1', key: '1' },
  { label: 'Tab 2', key: '2' },
];

export function TabMainUseState({ data, style = {}, callback, tab }) {
  const arrTab = data || defaultValue;

  const [state, setState] = useState({ tab: arrTab[0].key });

  useEffect(() => {
    if (tab) {
      setState({ tab });
    }
  }, [tab]);

  useEffect(() => {
    const found = arrTab.find((e) => e.key === state.tab);
    if (!found) {
      setState({ tab: arrTab[0].key });
    }
  }, [state]);

  return (
    <div
      style={{
        color: '#007BFF',
        fontSize: 18,
        ...style,
      }}
      className="ct-flex-row"
    >
      {arrTab.map((item, index) => (
        <div
          key={index.toString()}
          style={{
            cursor: 'pointer',
            height: 50,
            borderBottom: `${item.key == state.tab ? 2 : 0}px solid #007BFF`,
            color: item.key == state.tab ? '' : '#00000048',
            marginRight: 24,
            fontWeight: item.key == state.tab ? 700 : 400,
          }}
          className="ct-flex-row"
          onClick={() => {
            callback(item.key);
            setState({ tab: item.key });
          }}
        >
          {item.label}
        </div>
      ))}
    </div>
  );
}

export default TabMainUseState;
