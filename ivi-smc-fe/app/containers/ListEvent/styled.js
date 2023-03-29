import styled from 'styled-components';

export const EventTypeWrap = styled.div`
font-weight: bold;
text-overflow: ellipsis;
width: 100%;
&:hover {
  cursor: pointer;
}
}
`;

export const EventStatusWrap = styled.img`
  &:hover {
    cursor: pointer;
  }
`;

export const FooterPopupFilterWrap = styled.div`
  display: flex;
  flex-direction: row;
  grid-gap: 20px;
  justify-content: flex-end;
`;

export const FormFilterWrap = styled.div`
  .dx-toolbar-before {
    font-family: Roboto;
    font-style: normal;
    font-weight: 500;
    font-size: 20px;
    line-height: 151.19%;
    text-align: center;
    color: #000000;
  }
  .dx-field-item-label-text,
  .dx-form-group-caption {
    font-family: Roboto;
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 16px;
    color: #999999;
  }
  .dx-form-group-content {
    padding-top: unset;
    margin-top: 6px;
    border-top: unset;
    padding-bottom: 20px;
  }
`;
