import styled from 'styled-components';

export const ChangePasswordForm = styled.div`
  .dx-button-mode-contained {
    background-color: inherit;
    border: none;
  }
  ,
  .dx-button-mode-contained.dx-state-hover {
    background-color: inherit;
  }
`;

export const Label = styled.div`
  & {
    margin-top: 24px;
    height: 18px;
    font-family: Roboto;
    font-style: normal;
    font-weight: 500;
    font-size: 15px;
    line-height: 18px;
    color: #999999;
  }
`;

export const ErrorText = styled.span`
  margin-top: 6px;
  font-family: Roboto;
  font-style: italic;
  font-weight: normal;
  font-size: 13px;
  line-height: 15px;
  color: #ff0000;
`;
