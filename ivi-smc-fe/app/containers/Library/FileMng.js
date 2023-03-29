import React, { useState } from 'react';
import { Box } from '@material-ui/core';
import Item from './Item';
export default function FileMng({
  keyExpr,
  dataSource,
  noDataText,
  selectedRowKeys,
  onSelectionChanged,
  onItemClick,
}) {
  const [selectedFields, setSelectedFields] = useState([]);
  const [lastSelectedIndex, setLastSelectedIndex] = useState(-1);

  const clearItemSelection = () => {
    setSelectedFields([]);
    setLastSelectedIndex(-1);
    onSelectionChanged({ selectedRowKeys: [] });
  };

  function handleItemSelection(event, index) {
    event.stopPropagation();
    let selFields;
    const field = index < 0 ? '' : dataSource[index];
    const lastSelIndex = index;
    const { ctrlKey, shiftKey } = event;
    if (!ctrlKey && !shiftKey) {
      selFields = [field];
    } else if (shiftKey) {
      if (lastSelectedIndex >= index) {
        selFields = [].concat.apply(
          selectedFields,
          dataSource.slice(index, lastSelectedIndex),
        );
      } else {
        selFields = [].concat.apply(
          selectedFields,
          dataSource.slice(lastSelectedIndex + 1, index + 1),
        );
      }
    } else if (ctrlKey) {
      const foundIndex = selectedFields.findIndex(f => f === field);
      // If found remove it to unselect it.
      if (foundIndex >= 0) {
        selFields = [
          ...selectedFields.slice(0, foundIndex),
          ...selectedFields.slice(foundIndex + 1),
        ];
      } else {
        selFields = [...selectedFields, field];
      }
    }
    const finalList = dataSource
      ? dataSource.filter(f => selFields.find(a => a === f))
      : [];
    setSelectedFields(finalList);
    setLastSelectedIndex(lastSelIndex);
    onSelectionChanged({ selectedRowKeys: finalList.map(d => d[keyExpr]) });
  }
  return (
    <Box display="flex" flexWrap="wrap" onClick={clearItemSelection}>
      {dataSource.length ? (
        dataSource.map((item, index) => (
          <Item
            key={item.id}
            keyExpr={keyExpr}
            index={index}
            data={item}
            selectedItemKeys={selectedRowKeys}
            handleSelection={handleItemSelection}
            onClick={onItemClick}
          />
        ))
      ) : (
        <Box textAlign="center" p={2} width="100%">
          {noDataText}
        </Box>
      )}
    </Box>
  );
}
