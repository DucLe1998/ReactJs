import React, {
  useEffect,
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react';
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
  min-height: 60px;
  height: 84px;
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
  grid-gap: 10px;
`;
const ButtonGroup = styled.div`
  flex: 1;
  display: flex;
  grid-gap: 10px;
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
const PageHeader = forwardRef((props, ref) => {
  const {
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
  } = props;
  const inputRef = useRef();
  const debouncedSearch = debounce((value) => {
    onSearchValueChange(value);
  }, 700);
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
  const resetSearch = () => {
    if (inputRef && inputRef.current) {
      inputRef.current.reset();
    }
  };
  useImperativeHandle(ref, () => ({
    resetSearch,
  }));
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
            className="no-border-button header-search-box"
            onInput={(e) => {
              debouncedSearch(e.event.target.value.trim());
            }}
            onInitialized={({ component }) => {
              inputRef.current = component;
            }}
          >
            <TextBoxButton
              style={{ pointerEvents: 'none' }}
              name="search"
              location="before"
              options={{
                icon: SearchIcon,
              }}
            />
            <TextBoxButton name="clear" />
          </TextBox>
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
});
PageHeader.propTypes = {
  title: PropTypes.any,
  showFilter: PropTypes.bool,
  showBackButton: PropTypes.any,
  showSearch: PropTypes.bool,
  showPager: PropTypes.bool,
  pageIndex: PropTypes.any,
  totalCount: PropTypes.any,
  rowsPerPage: PropTypes.any,
};
export default PageHeader;
