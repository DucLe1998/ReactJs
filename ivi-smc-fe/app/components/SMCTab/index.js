import React, { useState } from 'react';
import styled from 'styled-components';
const Container = styled.div`
  && {
    display: flex;
    height: 44px;
    width: 576px;
    border-radius: 10px;
    background-color: rgba(0, 0, 0, 0.06);
  }
`;
const Item = styled.div`
  && {
    height: 100%;
    flex: 1 1 33.33%;
    border-radius: 10px;
    color: rgba(0, 0, 0, 0.48);
    display: flex;
    align-items: center;
    cursor: pointer;
    outline: none;
    justify-content: center;
    position: relative;
  }
  &&:focus {
    border: solid 2px var(--primary-color);
    z-index: 2;
  }
  &&.selected {
    background-color: #ffffff;
    color: var(--primary-color);
    z-index: 1;
  }
  &&:after {
    content: '';
    height: 20px;
    width: 1px;
    position: absolute;
    right: 0;
    top: 12px;
    background-color: rgba(0, 0, 0, 0.12);
  }
  &&:last-child:after {
    content: '';
    width: 0px;
  }
`;

function SMCTab({ items, onChange, selectedTabId, style }) {
  const [selectedItem, setSelectedItem] = useState(
    selectedTabId || items[0].id,
  );
  return (
    <Container style={style}>
      {items.map((item) => (
        <Item
          key={item.id}
          className={selectedItem === item.id ? 'selected' : ''}
          tabIndex={0}
          onClick={() => {
            setSelectedItem(item.id);
            onChange(item.id);
          }}
          onKeyUp={(e) => {
            if (e.which == 13) {
              setSelectedItem(item.id);
              onChange(item.id);
            }
          }}
        >
          {item.text}
        </Item>
      ))}
    </Container>
  );
}

SMCTab.propTypes = {};

export default SMCTab;
