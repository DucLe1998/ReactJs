/* eslint-disable no-case-declarations */
import React, { useState, memo } from 'react';
import { DialogActions, Button, Typography } from '@material-ui/core';
import List from 'devextreme-react/list';
import { TreeList, Column } from 'devextreme-react/tree-list';
import styled from 'styled-components';
const PopupWrapper = styled.div`
  width: 270px;
  padding: 16px;
  .dx-treelist-header-panel {
    border: none;
    background-color: transparent;
  }
`;
function ListRender(props) {
  const { item, data, setData } = props;
  const onSelectionChanged = (args) => {
    if (args.name === 'selectedItems') {
      const { value } = args;
      if (value) {
        if (item.props.selectionMode === 'single') {
          setData(value[0]);
        } else setData(value);
      }
    }
  };
  const defaultPropsList = {
    displayExpr: 'name',
    keyExpr: 'id',
    noDataText: 'Không có dữ liệu',
    showSelectionControls: true,
    selectionMode: 'multiple',
    searchEnabled: true,
    height: 236,
    pageLoadMode: 'scrollBottom',
    searchExpr: 'name',
    searchEditorOptions: { placeholder: 'Tìm kiếm' },
  };
  return (
    <List
      {...{ ...defaultPropsList, ...item.props }}
      selectedItems={Array.isArray(data) ? data : [data]}
      onOptionChanged={onSelectionChanged}
    />
  );
}
function TreeRender(props) {
  const { item, data, setData } = props;
  const selectedKeys = Array.isArray(data)
    ? data.map((d) => d[item.props.keyExpr])
    : [];
  const [selectedRowKeys, setSelectedRowKeys] = useState(selectedKeys);

  const defaultPropsTree = {
    showColumnHeaders: false,
    noDataText: 'Không có dữ liệu',
    selection: { mode: 'multiple', recursive: true },
    height: 230,
    rootValue: null,
    autoNavigateToFocusedRow: false,
    searchPanel: { visible: true, width: 238, placeholder: 'Tìm kiếm' },
  };
  const onSelectionTreeChanged = (e) => {
    setSelectedRowKeys(e.selectedRowKeys);
    const selectedData = e.component.getSelectedRowsData('excludeRecursive');
    setData(selectedData);
  };
  const { displayExpr, ...other } = item.props;
  const defaultExpandedRowKeys = data.map((d) => d[item.props.parentIdExpr]);
  return (
    <TreeList
      {...{ ...defaultPropsTree, ...other }}
      defaultExpandedRowKeys={defaultExpandedRowKeys}
      selectedRowKeys={selectedRowKeys}
      onSelectionChanged={onSelectionTreeChanged}
    >
      <Column dataField={displayExpr} />
    </TreeList>
  );
}
function SwitchRender(props) {
  switch (props.item.type) {
    case 'List':
      return <ListRender {...props} />;
    case 'Tree':
      return <TreeRender {...props} />;
    default:
      return null;
  }
}
function Popover(props) {
  const { item, value, onChange, popupState } = props;
  const [data, setData] = useState(value);

  return (
    <PopupWrapper>
      <Typography variant="h4" style={{ marginBottom: '5px' }}>
        {item.label}
      </Typography>
      <SwitchRender {...{ item, data, setData }} />
      <DialogActions style={{ justifyContent: 'space-evenly' }}>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            popupState.close();
            if (!item?.props?.closeOnlyWhenClickDefault)
              onChange(item.field, item.defaultValue);
          }}
        >
          {item?.props?.defaultButtonTitle || 'Mặc định'}
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            popupState.close();
            onChange(item.field, data);
          }}
        >
          {item?.props?.saveButtonTitle || 'Lọc'}
        </Button>
      </DialogActions>
    </PopupWrapper>
  );
}

export default memo(Popover);
