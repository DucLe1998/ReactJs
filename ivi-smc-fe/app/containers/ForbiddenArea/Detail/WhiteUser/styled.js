import styled from 'styled-components';

export const PopupAddWhiteUserWrap = styled.div`
  .dx-popup-content {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .MuiGrid-container {
    max-height: 400px;
    overflow-y: scroll;
  }
`;

export const AddWhiteUserTitileWrap = styled.div`
  font-family: Roboto;
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 151.19%;
  text-align: center;
  color: #000000;
  display: flex;
  margin-bottom: 10px;
`;

export const AddWhiteUserContentWrap = styled.div`
  div[class^='NoData'] {
    margin-top: 20px;
  }
`;

export const WhiteUserItemWrap = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  height: 100px;
  overflow: hidden;
  background: #fff;
  &:hover {
    background: linear-gradient(0deg, #f2f5f7, #f2f5f7), #ffffff;
    cursor: pointer;
  }
`;

export const IconCloseWrap = styled.img`
  width: 20px;
  height: 20px;
  &:hover {
    cursor: pointer;
  }
`;
export const AvatarUser = styled.img`
  width: 68px;
  height: 68px;
  margin: auto 16px;
  border-radius: 8px;
`;
export const InfoUser = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  .name {
    font-family: Roboto;
    font-style: normal;
    font-weight: 500;
    font-size: 17px;
    line-height: 22px;
    display: flex;
    align-items: center;
    color: #2c2c2e;
  }
  .code {
    font-family: Roboto;
    font-style: normal;
    font-weight: normal;
    font-size: 15px;
    line-height: 18px;
    display: flex;
    align-items: center;
    color: rgba(60, 60, 67, 0.6);
  }
  .company {
    font-family: Roboto;
    font-style: normal;
    font-weight: normal;
    font-size: 13px;
    line-height: 15px;
    display: flex;
    align-items: center;
    color: rgba(60, 60, 67, 0.6);
  }
`;
export const AddWhiteUserFooterWrap = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  grid-gap: 20px;
  position: absolute;
  bottom: 30px;
  right: 20px;
`;
