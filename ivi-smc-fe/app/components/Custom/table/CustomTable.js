/* eslint-disable import/no-named-as-default-member */
/* eslint-disable react/prop-types,no-param-reassign,no-unused-expressions,no-dupe-keys */
import React from 'react';

import DataGrid, {
  Column,
  Paging,
  Selection,
  // Sorting,
} from 'devextreme-react/data-grid';
import utils from '../../../utils/utils';
import '../styles.css';

const CustomTable = ({
  data,
  onSelectionChanged,
  height,
  row,
  disabledSelect,
  showBorders,
  width,
  showColumnLines,
  innerRef,
  style,
  maxHeight,
}) => (
  <DataGrid
    className="center-row-grid"
    style={{
      ...style,
      height: height || '100%',
      maxHeight: maxHeight || `calc(100vh - ${60 + 84 + 55 + 2}px)`,
      width: width || '100%',
      maxWidth: width || '100%',
    }}
    ref={innerRef}
    width="100%"
    dataSource={data}
    noDataText="Không có dữ liệu"
    onSelectionChanged={(e) => onSelectionChanged(e.selectedRowsData)}
    columnAutoWidth
    // showRowLines
    rowAlternationEnabled
    showColumnLines={showColumnLines || false}
    showBorders={showBorders || false}
    allowColumnResizing
    columnResizingMode="widget"
  >
    {/* <Sorting mode="single" /> */}
    {!disabledSelect && (
      <Selection
        mode="multiple"
        selectAllMode="page"
        showCheckBoxesMode="always"
      />
    )}
    <Paging enabled={false} />
    {row
      ?.map((i) => ({
        ...i,
        allowSorting: false,
      }))
      .map((item) => (
        <Column
          // allowSorting={true}
          cssClass="ct-dx-row ct-dx-datagrid-text-content"
          {...item}
          key={utils.makeid(32)}
        />
      ))}
  </DataGrid>
);
export default CustomTable;
