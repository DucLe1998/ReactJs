import React from 'react';
import styled from 'styled-components';
import { TextBox, Button as TextBoxButton } from 'devextreme-react/text-box';
import SearchIcon from 'images/icon-button/Search.svg';
import { debounce } from 'lodash';
import { useIntl } from 'react-intl';
import gui from 'utils/gui';

const Container = styled.div`
  display: flex;
  .MuiPaginationItem-root {
    height: 27px;
    min-width: 27px;
    font-size: 12px;
  }
  .page-size {
    border: 0px;
    border-radius: 4px;
    font-size: 12px;
    height: 30px;
    background: #fff;
    input {
      height: 30px;
      min-height: 30px;
    }
  }
  .header-search-box {
    height: 36px;
    min-width: ${gui.screenWidth / 4.5}px;
    .dx-button {
      pointer-events: none;
    }
  }
`;

export default function SearchHeader({
  searchPlaceholderId = 'app.title.placeholder.search',
  placeholderSearch,
  onSearchValueChange,
  defaultValue,
  disabled = false,
}) {
  const debouncedSearch = debounce((value) => {
    onSearchValueChange(value);
  }, 700);
  const intl = useIntl();

  return (
    <Container>
      <TextBox
        style={{
          backgroundColor: '#FFF',
          // border: 'none',
          border: '1px solid #E2E2E3',
          borderRadius: 4,
        }}
        maxLength="50"
        disabled={disabled}
        showClearButton
        width="100%"
        placeholder={
          placeholderSearch ||
          intl.formatMessage({
            id: searchPlaceholderId,
          })
        }
        value={defaultValue || ''}
        stylingMode="outlined"
        className="no-border-button header-search-box"
        onInput={(e) => {
          debouncedSearch(e.event.target.value.trim());
        }}
      >
        <TextBoxButton
          style={{ pointerEvents: 'none' }}
          name="search"
          location="before"
          options={{
            icon: SearchIcon,
          }}
        />
        {/* <TextBoxButton name="clear" /> */}
      </TextBox>
    </Container>
  );
}
