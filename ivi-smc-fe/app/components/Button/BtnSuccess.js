import React from 'react';
import styled from 'styled-components';
import { Button } from 'devextreme-react';

export default function BtnSuccess(props) {
  return (
    <BtnSuccessWrap bgColor={props?.bgColor || ''}>
      <Button {...props} />
    </BtnSuccessWrap>
  );
}

const BtnSuccessWrap = styled.div`
  .dx-button {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 104px;
    height: 44px;
    background: ${props => props.bgColor || '#007BFF'};
    border-radius: 4px;
    color: #ffffff;
    &:hover {
      opacity: 0.9;
      box-shadow: 0px 4px 10px rgba(16, 156, 241, 0.24);
      background: #007BFF;
    }
  }
`;
