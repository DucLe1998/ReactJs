import styled from 'styled-components';

export const NotiContainerWrap = styled.div`
  padding-top: 10px;
  width: 326px;
`;
export const NotiItemWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
  border-bottom: 1px solid #dbdbdb;
  &:last-child {
    border-bottom: unset;
  }
  &:hover {
    background: #dbdbdb;
  }
  // width: 326px;
  height: 63px;
  padding: 5px 15px;
  overflow: hidden;
  cursor: pointer;
  .header {
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    width: 100%;
    margin-bottom: 4px;
    .title {
      font-family: Roboto;
      font-style: normal;
      font-weight: bold;
      font-size: 15px;
      line-height: 18px;
      color: #000000;
    }
    .time {
      font-size: 10px;
      line-height: 12px;
      font-style: normal;
      font-weight: normal;
      color: #000000;
      opacity: 0.6;
    }
  }
  .content {
    font-family: Roboto;
    font-style: normal;
    font-weight: normal;
    font-size: 13px;
    line-height: 15px;
    color: #000;
    opacity: 0.6;
    font-weight: normal;
    overflow: hidden;
  }
`;

export const ListNotiWrap = styled.div`
  overflow-y: scroll;
  max-height: 300px;
  // padding: 0 15px;
  &::-webkit-scrollbar {
    width: 3px !important;
  }
`;

export const ShowMoreItemWrap = styled.div`
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  font-size: 15px;
  line-height: 18px;
  color: #000000;
  display: grid;
  place-items: center;
  height: 40px;
  cursor: pointer;
  border-top: 1px solid #dbdbdb;
`;
