import styled from 'styled-components';

export const SearchTopWrap = styled.div`
  display: flex;
`;
export const CardItemBox = styled.div`
  background: #ffffff;
  border: 1px solid rgba(60, 60, 67, 0.1);
  box-sizing: border-box;
  border-radius: 8px;
  padding: 18px 15px;
`;

export const Image = styled.div`
  img {
    border-radius: 4px;
    width: 100%;
    height: 150px;
    object-fit: fill;
  }
`;
export const Name = styled.div`
  margin-top: 12px;
  font-family: Roboto;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 22px;
  display: flex;
  align-items: center;
  max-width: calc(100% - 30px);
  text-overflow: ellipsis;
`;
export const Description = styled.div`
  margin-top: 9px;
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 16px;
  color: rgba(37, 37, 37, 0.6);
`;
export const BtnViewDetail = styled.div`
  font-family: Roboto;
  font-style: italic;
  font-weight: normal;
  font-size: 13px;
  line-height: 15px;
  text-align: right;
  color: #40a574;
  &:hover {
    cursor: pointer;
  }
`;
