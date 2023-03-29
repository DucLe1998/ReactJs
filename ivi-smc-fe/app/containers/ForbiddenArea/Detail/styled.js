import styled from 'styled-components';

export const ImageInfo = styled.div`
  display: flex;
  flex-direction: column;
  span {
    font-family: Roboto;
    font-style: normal;
    font-weight: normal;
    font-size: 18px;
    line-height: 22px;
    color: rgba(0, 0, 0, 0.6);
    padding-bottom: 10px;
  }
  img {
    border-radius: 4px;
    width: 100%;
    height: auto;
    max-height: 400px;
    object-fit: cover;
  }
`;

export const WhiteUserHeaderWrap = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 20px 0;
  .dx-button {
    width: 100px;
    height: 40px;
    background: #00554a;
    box-shadow: 0px 4px 10px rgba(16, 156, 241, 0.24);
    border-radius: 8px;
    border: none;
    font-family: Roboto;
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 16px;
    text-align: center;
    color: #fff;
  }
`;
export const WhiteUserHeaderTitle = styled.div`
  font-family: Roboto;
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 23px;
  letter-spacing: 0.38px;
  color: #2c2c2e;
`;
export const WhiteUserItemWrap = styled.div`
  width: 100%;
  height: 280px;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  position: relative;
  img {
    width: 100%;
    height: 186px;
    border-radius: 8px;
    object-fit: cover;
  }
  .name {
    font-family: Roboto;
    font-style: normal;
    font-weight: 500;
    font-size: 18px;
    line-height: 22px;
    color: #000000;
    margin-top: 15px;
    max-width: 100%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .code {
    font-family: Roboto;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 16px;
    color: #252525;
    opacity: 0.6;
    margin-top: 4px;
    max-width: 100%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .company {
    font-family: Roboto;
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    line-height: 14px;
    color: #252525;
    opacity: 0.6;
    margin-top: 12px;
    max-width: 100%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
`;

export const IconCloseWrap = styled.img`
  position: absolute;
  width: 20px !important;
  height: 20px !important;
  right: -8px;
  top: -8px;
  &:hover {
    cursor: pointer !important;
  }
`;
