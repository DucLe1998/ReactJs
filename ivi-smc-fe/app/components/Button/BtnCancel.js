import React from 'react';
import styled from 'styled-components';
import { Button } from 'devextreme-react';

export default function BtnCancel(props) {
  return (
    <BtnCancelWrap {...props}>
      <Button {...props} />
    </BtnCancelWrap>
  );
}

const BtnCancelWrap = styled.div`
  .dx-button {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 104px;
    height: 44px;
    background: ${props => props?.bgColor || '#dddddd'};
    border: 1px solid #dddddd;
    box-sizing: border-box;
    border-radius: 4px;
    font-weight: bold;
    color: ${props => props.color || 'rgba(0, 0, 0, 0.8)'};
    &:hover {
      opacity: 0.9;
      box-shadow: 0px 4px 10px ${props => props?.bgColor || '#dddddd'};
      background: ${props => props?.bgColor || '#dddddd'};
    }
  }
`;
