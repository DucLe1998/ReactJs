import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { TextBox, Button as TextBoxButton } from 'devextreme-react/text-box';
import SearchIcon from 'images/icon-button/Search.svg';
import SmchPagination from 'components/SmchPagination';
import { debounce } from 'lodash';
import { useIntl } from 'react-intl';
import { Icon, IconButton } from '@material-ui/core';
import IconBack from 'images/icon-button/ic_back.svg';
// import SvgIcon from '@material-ui/core/SvgIcon';
const Container = styled.div`
  display: flex;
  height: 60px;
  background: #ffffff;
  border-bottom: 1px solid #e0e0e0;
  padding: 12px 20px;
  .MuiPaginationItem-root {
    height: 27px;
    min-width: 27px;
    font-size: 12px;
  }
  .no-border-button {
    height: 36px;
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
    height: 36px;
    min-width: 150px;
    .dx-button {
      pointer-events: none;
    }
  }
`;
const ButtonSearch = styled.button`
  margin-left: auto;
  background: #007bff;
  border-radius: 0px 4px 4px 0px;
  width: 96px;
  height: 36px;
  cursor: pointer;
  display: flex;
  color: #fff;
  right: 0px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border: 1px solid #007bff;
  margin-left: -10px;
`;
const Left = styled.div`
  min-width: fit-content;
  max-width: 350px;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 5px;
  margin-right: 16px;
`;
const Title = styled.div`
  max-width: 350px;
  font-size: 20px;
  line-height: 1.2;
  font-weight: 600;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
const PageTotal = styled.div`
  width: 100%;
  overflow: hidden;
  text-overflow: ellipses;
  white-space: no-wrap;
`;
const Center = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  grid-gap: 8px;
  padding-left: 10%;
  && .no-border-button {
    max-width: 425px;
  }
  && input {
    max-width: 340px;
  }
`;
const ButtonGroup = styled.div`
  flex: 1;
  display: flex;
  grid-gap: 8px;
  align-items: center;
  place-content: flex-start;
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
`;
export default function PageSearch({
  children,
  title,
  showBackButton,
  showFilter,
  showSearch,
  showPager,
  pageIndex,
  totalCount,
  rowsPerPage,
  searchPlaceholderId = 'app.title.placeholder.search',
  placeholderSearch,
  onSearchValueChange,
  handleChangePageIndex,
  handlePageSize,
  disabled = false,
  onBack,
  defaultSearch = '',
  valueSearch = '',
  onSearchButtonClick,
}) {
  const debouncedSearch = debounce((value) => {
    valueSearch = value;
    onSearchValueChange(value);
  });
  const intl = useIntl();
  const totalPage = Math.ceil(totalCount / rowsPerPage) || 0;
  const startIndex = rowsPerPage * (pageIndex - 1) || 0;
  const endIndex =
    pageIndex == totalPage ? totalCount : startIndex + rowsPerPage;
  useEffect(() => {
    setTimeout(() => {
      const a = document.getElementById('tnpPager');
      if (a && a.clientWidth > 350) a.style.minWidth = `${a.clientWidth}px`;
    }, 1000);
  }, [totalCount]);
  return (
    <Container>
      <Left>
        {(showBackButton || showFilter) && (
          <IconButton onClick={() => onBack()} size="small" color="primary">
            <Icon>
              <img
                src={IconBack}
                height={24}
                width={24}
                alt="icon"
                style={{ marginTop: '-10px' }}
              />
            </Icon>
          </IconButton>
        )}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Title>
            {showFilter
              ? intl.formatMessage({ id: 'app.title.filterResult' })
              : title}
          </Title>
          {Boolean(showPager && totalCount) && (
            <PageTotal>
              {`(${startIndex + 1} - ${endIndex}/${intl.formatMessage(
                {
                  id: 'app.title.row',
                },
                { number: totalCount },
              )})`}
            </PageTotal>
          )}
        </div>
      </Left>
      <Center>
        {showSearch && (
          <>
            <TextBox
              maxLength="50"
              disabled={disabled}
              showClearButton
              width="100%"
              placeholder={
                placeholderSearch ||
                intl.formatMessage({
                  id: searchPlaceholderId,
                })
              }
              stylingMode="outlined"
              defaultValue={defaultSearch}
              className="no-border-button"
              onInput={(e) => {
                debouncedSearch(e.event.target.value.trim());
              }}
              style={{ borderRadius: '4px 0px 0px 4px' }}
            >
              <TextBoxButton
                style={{ pointerEvents: 'none' }}
                name="search"
                location="before"
                options={{
                  icon: SearchIcon,
                }}
              />
              <TextBoxButton name="clear" location="after" />
            </TextBox>
            <ButtonSearch onClick={() => onSearchButtonClick(valueSearch)}>
              Tim kiếm
            </ButtonSearch>
          </>
        )}
        <ButtonGroup
          style={{ placeContent: showSearch ? 'flex-start' : 'flex-end' }}
        >
          {children}
        </ButtonGroup>
      </Center>
      {showPager && (
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
      )}
    </Container>
  );
}
PageSearch.propTypes = {
  title: PropTypes.any,
  showFilter: PropTypes.bool,
  showBackButton: PropTypes.any,
  showSearch: PropTypes.bool,
  showPager: PropTypes.bool,
  pageIndex: PropTypes.any,
  totalCount: PropTypes.any,
  rowsPerPage: PropTypes.any,
};
