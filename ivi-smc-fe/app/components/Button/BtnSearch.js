import React from 'react';
import styled from 'styled-components';
import { IconSearchWhite } from 'constant/ListIcons';
import { Button } from 'devextreme-react';

export default function BtnSearch(props) {
  return (
    <BtnSearchWrap>
      <Button icon={IconSearchWhite} {...props} />
    </BtnSearchWrap>
  );
}

const BtnSearchWrap = styled.div`
  .dx-button {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 58px;
    height: 40px;
    right: 1.44px;
    bottom: 0px;

    background: #00554a;
    box-shadow: 0px 4px 10px rgba(16, 156, 241, 0.24);
    border-radius: 8px;
    &:hover {
      opacity: 0.9;
      box-shadow: 0px 4px 10px rgba(16, 156, 241, 0.24);
      background: #00554a;
    }
  }
`;
