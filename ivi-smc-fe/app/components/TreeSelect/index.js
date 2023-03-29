/* eslint-disable no-unused-expressions */
import React, { useState, useRef, useEffect, useCallback } from 'react';
import DropDownBox from 'devextreme-react/drop-down-box';
import TreeView from 'devextreme-react/tree-view';
import { useIntl } from 'react-intl';

// selectionMode="multiple" || "single"
export default function TreeSelect({
  value,
  onValueChanged,
  selectionMode = 'single',
  keyExpr = 'id',
  parentIdExpr = 'parentId',
  displayExpr = 'name',
  hasItemsExpr = 'isParent',
  loadData,
  searchEnabled = false,
  error = false,
  disabledExpr,
  placeholder = '',
  showClearButton = true,
}) {
  const intl = useIntl();
  const treeViewRef = useRef(null);
  const getDS = (value) =>
    value ? (Array.isArray(value) ? value : [value]) : [];
  const [dataSource, setDataSource] = useState([]);
  const getValue = (value) =>
    value
      ? selectionMode === 'multiple'
        ? value.map((i) => i[keyExpr])
        : [value[keyExpr]]
      : [];
  const [isTreeBoxOpened, setIsTreeBoxOpened] = useState(false);
  const [treeBoxValue, setTreeBoxValue] = useState([]);
  useEffect(() => {
    setTreeBoxValue(getValue(value));
    if (value && dataSource.length <= 0) {
      setDataSource(getDS(value));
    }
  }, [value]);
  const treeViewRender = () => (
    <TreeView
      ref={treeViewRef}
      dataStructure="plain"
      keyExpr={keyExpr}
      parentIdExpr={parentIdExpr}
      selectionMode={selectionMode}
      showCheckBoxesMode="normal"
      selectNodesRecursive={false}
      displayExpr={displayExpr}
      hasItemsExpr="hasItems"
      selectByClick
      searchEnabled={searchEnabled}
      onContentReady={
        selectionMode === 'multiple' ? onContentReady : treeViewOnContentReady
      }
      onSelectionChanged={treeViewItemSelectionChanged}
      createChildren={async (node) => {
        try {
          const response = await loadData(node);
          const data = response.map((d) => ({
            ...d,
            selected: Array.isArray(treeBoxValue)
              ? treeBoxValue.includes(d[keyExpr])
              : d[keyExpr] == treeBoxValue,
            hasItems:
              typeof hasItemsExpr == 'function'
                ? hasItemsExpr(d)
                : d[hasItemsExpr],
          }));
          const cat = data.filter(
            (item) => !dataSource.find((d) => item[keyExpr] == d[keyExpr]),
          );
          setDataSource((prev) => [...prev, ...cat]);
          return data;
        } catch (ex) {
          return [];
        }
      }}
      onItemClick={onTreeItemClick}
      onItemRendered={onItemRendered}
      noDataText={intl.formatMessage({ id: 'app.no_data' })}
    />
  );
  const onItemRendered = ({ itemElement, itemData }) => {
    if (
      disabledExpr &&
      typeof disabledExpr == 'function' &&
      disabledExpr(itemData)
    ) {
      const cb =
        itemElement.parentElement.getElementsByClassName('dx-checkbox')[0];
      cb.style.display = 'none';
      const item =
        itemElement.parentElement.getElementsByClassName('dx-treeview-item')[0];
      item.style.color = '#ccc';
      item.style.cursor = 'not-allowed';
    }
  };
  const onTreeItemClick = () => {
    if (selectionMode == 'single') {
      setIsTreeBoxOpened(false);
    }
  };
  const onContentReady = (e) => {
    const treeView =
      (e.component.selectItem && e.component) ||
      (treeViewRef && treeViewRef.instance);

    if (treeView) {
      if (e.value === null) {
        treeView.unselectAll();
      } else {
        const values = e.value || treeBoxValue;
        values && values.forEach((value) => treeView.selectItem(value));
      }
    }

    if (e.value !== undefined) {
      setTreeBoxValue(e.value);
    }
  };

  const treeViewOnContentReady = (e) => {
    e.component.selectItem(treeBoxValue);
  };

  const treeViewItemSelectionChanged = (e) => {
    const selected = e.component
      .getSelectedNodes()
      .map((d) => d.itemData)
      .filter(
        (d) =>
          !(
            disabledExpr &&
            typeof disabledExpr == 'function' &&
            disabledExpr(d)
          ),
      );
    onValueChanged(
      selectionMode === 'multiple' ? selected : selected[0] || null,
    );
  };

  const syncTreeViewSelection = (e) => {
    const treeView =
      treeViewRef && treeViewRef.current && treeViewRef.current.instance;
    setTreeBoxValue(e.value);
    if (treeView) {
      if (!e.value) {
        treeView.unselectAll();
      } else {
        treeView.selectItem(e.value);
      }
    }
  };
  const onTreeBoxOpened = useCallback(
    (e) => {
      if (e.name === 'opened') {
        setIsTreeBoxOpened(e.value);
      }
    },
    [setIsTreeBoxOpened],
  );
  return (
    <div style={{ width: '100%' }}>
      <DropDownBox
        width="100%"
        placeholder={placeholder}
        value={treeBoxValue}
        valueExpr={keyExpr}
        displayExpr={displayExpr}
        opened={isTreeBoxOpened}
        onOptionChanged={onTreeBoxOpened}
        showClearButton={showClearButton}
        dataSource={dataSource}
        onValueChanged={(e) => {
          selectionMode === 'multiple'
            ? onContentReady(e)
            : syncTreeViewSelection(e);
        }}
        contentRender={treeViewRender}
        validationStatus={error ? 'invalid' : 'valid'}
      />
    </div>
  );
}
