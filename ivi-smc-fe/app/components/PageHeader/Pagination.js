import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import SmchPagination from 'components/SmchPagination';

const Container = styled.div`
  display: flex;
  .MuiPaginationItem-root {
    height: 27px;
    min-width: 27px;
    font-size: 12px;
  }
  .page-size {
    border: 0px;
    border-radius: 4px;
    font-size: 12px;
    height: 30px;
    background: #fff;
    input {
      height: 30px;
      min-height: 30px;
    }
  }
  .header-search-box {
    height: 40px;
    min-width: 150px;
    .dx-button {
      pointer-events: none;
    }
  }
`;
const Pager = styled.div`
  && {
    nav {
      padding-left: 10px;
    }
    min-width: 350px;
    padding-left: 16px;
    overflow: auto;
    align-items: center;
    display: flex;
  }
  && .MuiPaginationItem-icon {
    color: #4b67e2;
  }
  && .Mui-disabled .MuiPaginationItem-icon {
    color: rgba(0, 0, 0, 0.6);
  }
`;
export default function Pagination({
  pageIndex,
  totalCount,
  rowsPerPage,
  handleChangePageIndex,
  handlePageSize,
}) {
  const totalPage = Math.ceil(totalCount / rowsPerPage) || 0;

  useEffect(() => {
    setTimeout(() => {
      const a = document.getElementById('tnpPager');
      if (a && a.clientWidth > 350) a.style.minWidth = `${a.clientWidth}px`;
    }, 1000);
  }, [totalCount]);

  return (
    <Container>
      <Pager id="tnpPager">
        <SmchPagination
          totalCount={totalCount}
          totalPage={totalPage}
          pageIndex={pageIndex}
          pageSize={rowsPerPage}
          changePageIndex={handleChangePageIndex}
          changePageSize={handlePageSize}
          optionsPageSize={[25, 50, 100]}
        />
      </Pager>
    </Container>
  );
}
Pagination.propTypes = {
  pageIndex: PropTypes.any,
  totalCount: PropTypes.any,
  rowsPerPage: PropTypes.any,
};
