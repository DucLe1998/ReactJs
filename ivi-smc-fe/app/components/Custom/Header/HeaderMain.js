/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useEffect } from 'react';

import useUrlState from '@ahooksjs/use-url-state';
import SearchHeader from 'components/PageHeader/SearchHeader';
import gui from 'utils/gui';

const defaultValue = [
  { label: 'Tab 1', key: '1' },
  { label: 'Tab 2', key: '2' },
];

export function HeaderMain({
  data,
  onSearchValueChange,
  onClickTab,
  ViewLeft,
  defaultValueSearch,
  viewSearch,
  placeholderSearch = '',
  buttonRight,
}) {
  const arrTab = data || defaultValue;

  const [state, setState] = useUrlState({ tab: arrTab[0].key });

  useEffect(() => {
    const found = arrTab.find((e) => e.key === state.tab);
    if (!found) {
      setState({ tab: arrTab[0].key });
    }
  }, [state]);

  const abc = viewSearch && viewSearch();

  return (
    <div style={styles.mainHeader} className="ct-flex-row">
      <div
        style={{
          color: '#007BFF',
          fontSize: 18,
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
              setState({
                tab: item.key,
                limit: gui.optionsPageSize[0],
                page: null,
              });
              onClickTab && onClickTab(item.key);
            }}
          >
            {item.label}
          </div>
        ))}
      </div>
      <div
        style={{ justifyContent: 'space-between', marginBottom: 8 }}
        className="ct-flex-row"
      >
        <div className="ct-flex-row">{ViewLeft && ViewLeft()}</div>
        {!abc ? (
          <div className="ct-flex-row">
            <div style={{ marginRight: 20 }}>
              {buttonRight && buttonRight()}
            </div>
            <SearchHeader
              defaultValue={defaultValueSearch}
              onSearchValueChange={(e) => onSearchValueChange(e)}
              placeholderSearch={placeholderSearch || 'Tìm kiếm theo tên'}
            />
          </div>
        ) : (
          viewSearch()
        )}
      </div>
    </div>
  );
}

const styles = {
  mainHeader: {
    justifyContent: 'space-between',
    padding: '8px 16px 0 16px',
    marginTop: 8,
    marginRight: 0,
    border: `1px solid rgba(216, 216, 216, 0.36)`,
    backgroundColor: '#FFF',
    borderRadius: 5,
  },
};

export default HeaderMain;
