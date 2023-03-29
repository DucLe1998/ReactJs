import styled from 'styled-components';
import Button from '@material-ui/core/Button';

export const PopupNotiWrap = styled.div`
  background: #ffffff;
  border: 1px solid #f6f6f6;
  box-sizing: border-box;
  box-shadow: 5px 5px 25px rgba(0, 0, 0, 0.15);
  border-radius: 10px;
  padding: 15px;
  width: 326px;
  height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  z-index: 9999999;
`;

export const NotiHeaderWrap = styled.div`
  font-family: Roboto;
  font-style: normal;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  .title {
    font-weight: bold;
    font-size: 15px;
    line-height: 18px;
    color: #000000;
  }
  .time {
    font-family: Roboto;
    font-style: normal;
    font-weight: normal;
    font-size: 10px;
    line-height: 12px;
    color: #000000;
    opacity: 0.6;
  }
`;

export const NotiBodyWrap = styled.div`
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  font-size: 13px;
  line-height: 15px;
  color: #000000;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const NotiFooterWrap = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const BtnViewDetailWrap = styled(Button)`
  width: 140px !important;
  height: 30px !important;
  background: #00554a !important;
  border-radius: 100px !important;
  width: 140px !important;
  height: 30px !important;
  border: unset !important;
  font-family: Roboto !important;
  font-style: normal !important;
  font-weight: normal !important;
  font-size: 13px !important;
  line-height: 15px !important;
  color: #ffffff !important;
  text-transform: unset !important;
`;

export const BtnCancelWrap = styled(Button)`
  border-radius: 100px !important;
  width: 140px !important;
  height: 30px !important;
  border: unset !important;
  font-family: Roboto !important;
  font-style: normal !important;
  font-weight: normal !important;
  font-size: 13px !important;
  line-height: 15px !important;
  text-transform: unset !important;
  background: #f6f6f6 !important;
  color: #616161 !important;
`;
