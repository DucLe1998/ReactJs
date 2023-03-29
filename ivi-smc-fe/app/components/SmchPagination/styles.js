import styled from 'styled-components';

export const SmchPaginationWrapper = styled.div`
  display: flex;
  flex: 1;
  justify-content: flex-end;
  align-items: center;
  .MuiSelect-selectMenu {
    font-size: 14px;
  }
  .smch-select {
    ::before {
      content: none;
    }
    ::after {
      content: none;
    }
    div {
      margin-top: 0;
      width: 50px;
      background: #fff;
      border: 1px solid #00000014;
      border-radius: 23px;
      text-align: center;
    }
    .MuiSelect-icon {
      right: 5px;
      fill: #4252ad;
    }
  }
  .MuiPaginationItem-textPrimary.Mui-selected {
    color: #fff;
  }
  .MuiPagination-ul {
    grid-gap: 5px;
  }
`;
