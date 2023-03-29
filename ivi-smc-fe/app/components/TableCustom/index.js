import React from 'react';
import DataGrid, { Column, Paging } from 'devextreme-react/data-grid';
import NoData from 'components/NoData';

function TableCustom(props) {
  const {
    data = [],
    columns = [],
    pushClass,
    noDataText = 'Không có dữ liệu',
    maxHeight,
    maxWidth = '100%',
    children,
    pagingProps = {},
    hideTable = true,
    style = {},
    ...other
  } = props;
  if (!data.length && hideTable) return <NoData text={noDataText} />;
  const defaultProps = {
    className: pushClass || 'center-row-grid',
    columnAutoWidth: true,
    allowColumnResizing: true,
    columnResizingMode: 'widget',
    showRowLines: true,
    showColumnLines: false,
    rowAlternationEnabled: true,
    sorting: { mode: 'none' },
    // onRowPrepared: (e) => {
    //   if (e?.data?.isFieldError) {
    //     e.rowElement.style.color = '#FF0000';
    //   }
    // },
  };
  const mProps = { ...defaultProps, ...other };
  const mPagingProps = { enabled: false, ...pagingProps };
  const defaultStyle = {
    height: '100%',
    maxHeight: maxHeight || `calc(100vh - ${50 + 84 + 25}px)`,
    minHeight: '350px',
    width: '100%',
    maxWidth,
  };
  const mStyle = { ...defaultStyle, ...style };
  return (
    <DataGrid
      dataSource={data}
      noDataText={noDataText}
      style={mStyle}
      {...mProps}
    >
      <Paging {...mPagingProps} />
      {React.Children.toArray(columns.map((defs) => <Column {...defs} />))}
      {children}
    </DataGrid>
  );
}
export default React.memo(TableCustom);
