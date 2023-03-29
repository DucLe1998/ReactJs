/**
 *
 * SmchPagination
 *
 */

import React, { memo } from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';
import Pagination from '@material-ui/lab/Pagination';
// import PaginationItem from '@material-ui/lab/PaginationItem';
import SelectBox from 'devextreme-react/select-box';
import { useIntl } from 'react-intl';
import { SmchPaginationWrapper } from './styles';
function SmchPagination({
  totalPage,
  pageIndex,
  changePageIndex,
  pageSize = 25,
  changePageSize,
  optionsPageSize = [25, 50, 100],
}) {
  const intl = useIntl();
  const handleChangePageIndex = (e, value) => {
    changePageIndex(value);
  };
  const pageOptions = optionsPageSize.map(item => ({
    value: item,
    text: intl.formatMessage(
      {
        id: 'app.title.rows_per_page',
      },
      { number: item },
    ),
  }));

  return (
    <div
      style={{
        display: 'flex',
        flex: '1',
        alignItems: 'center',
        fontSize: '14px',
      }}
    >
      <SmchPaginationWrapper>
        {Boolean(totalPage) && (
          <React.Fragment>
            <SelectBox
              className="page-size"
              items={pageOptions}
              defaultValue={pageOptions[0].value}
              value={pageSize}
              width="140px"
              displayExpr={item => (item ? item.text : '')}
              valueExpr="value"
              onValueChanged={e => {
                changePageSize({ target: { value: e.value } });
              }}
            />
            <Pagination
              count={totalPage}
              showFirstButton
              showLastButton
              color="primary"
              page={pageIndex}
              onChange={handleChangePageIndex}
              // renderItem={item =>
              //   item.page - pageIndex > 3 ? null : <PaginationItem {...item} />
              // }
              siblingCount={0}
              boundaryCount={1}
            />
          </React.Fragment>
        )}
      </SmchPaginationWrapper>
    </div>
  );
}

SmchPagination.propTypes = {};

export default memo(SmchPagination);
