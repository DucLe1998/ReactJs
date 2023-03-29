/* eslint-disable no-unused-expressions */
import React, { useState, useRef, useEffect } from 'react';
// import PropTypes from 'prop-types';
import DropDownBox from 'devextreme-react/drop-down-box';
import TreeView from 'devextreme-react/tree-view';
import { callApi, METHODS } from 'utils/requestUtils';
import { AC_GROUP_ELEVATOR_API } from 'containers/apiUrl';
import { useIntl } from 'react-intl';

// selectionMode="multiple" || "single"
export function ElevatorTree({
  value,
  onValueChanged,
  selectionMode = 'single',
}) {
  const intl = useIntl();
  const treeViewRef = useRef(null);
  const [dataSource, setDataSource] = useState(
    value ? (Array.isArray(value) ? value : [value]) : [],
  );
  const [treeBoxValue, setTreeBoxValue] = useState([]);
  const [isTreeBoxOpened, setIsTreeBoxOpened] = useState(false);
  useEffect(() => {
    setTreeBoxValue(
      value
        ? selectionMode === 'multiple'
          ? value.map(i => i.id)
          : [value.id]
        : [],
    );
  }, [value]);
  const treeViewRender = () => (
    <TreeView
      ref={treeViewRef}
      dataStructure="plain"
      keyExpr="id"
      parentIdExpr="parentId"
      selectionMode={selectionMode}
      showCheckBoxesMode="normal"
      selectNodesRecursive={false}
      displayExpr="name"
      hasItemsExpr="isParent"
      selectByClick
      searchEnabled={false}
      onContentReady={
        selectionMode === 'multiple' ? onContentReady : treeViewOnContentReady
      }
      onItemSelectionChanged={treeViewItemSelectionChanged}
      createChildren={async parent => {
        const parentId = parent ? parent.itemData.id : '';
        try {
          const response = await callApi(
            `${AC_GROUP_ELEVATOR_API.GET_CHILD}?parentId=${parentId}`,
            METHODS.GET,
          );
          const data = response.data.map(d => ({
            ...d,
            selected: Array.isArray(treeBoxValue)
              ? treeBoxValue.includes(d.id)
              : d.id == treeBoxValue,
          }));
          const cat = data.filter(
            item => !dataSource.find(d => item.id == d.id),
          );
          setDataSource(prev => [...prev, ...cat]);
          return data;
        } catch (ex) {
          return [];
        }
      }}
      onItemClick={onTreeItemClick}
      noDataText={intl.formatMessage({ id: 'app.no_data' })}
    />
  );
  const onTreeItemClick = () => {
    if (selectionMode == 'single') {
      setIsTreeBoxOpened(false);
    }
  };
  const onContentReady = e => {
    const treeView =
      (e.component.selectItem && e.component) ||
      (treeViewRef && treeViewRef.instance);

    if (treeView) {
      if (e.value === null) {
        treeView.unselectAll();
      } else {
        const values = e.value || treeBoxValue;
        values && values.forEach(value => treeView.selectItem(value));
      }
    }

    if (e.value !== undefined) {
      setTreeBoxValue(e.value);
    }
  };

  const treeViewOnContentReady = e => {
    e.component.selectItem(treeBoxValue);
  };

  const treeViewItemSelectionChanged = e => {
    const selected = e.component.getSelectedNodes().map(d => d.itemData);
    onValueChanged(selectionMode === 'multiple' ? selected : selected[0]);
  };

  const syncTreeViewSelection = e => {
    const treeView =
      treeViewRef && treeViewRef.current && treeViewRef.current.instance;
    setTreeBoxValue(e.value);
    if (!treeView) return;
    if (!e.value) {
      treeView.unselectAll();
    } else {
      treeView.selectItem(e.value);
    }
  };
  function onTreeBoxOpened(e) {
    if (e.name === 'opened') {
      setIsTreeBoxOpened(e.value);
    }
  }
  return (
    <div style={{ width: '100%' }}>
      <DropDownBox
        width="100%"
        value={treeBoxValue}
        valueExpr="id"
        displayExpr="name"
        showClearButton
        onOptionChanged={onTreeBoxOpened}
        opened={isTreeBoxOpened}
        dataSource={dataSource}
        onValueChanged={e => {
          selectionMode === 'multiple'
            ? onContentReady(e)
            : syncTreeViewSelection(e);
        }}
        contentRender={treeViewRender}
      />
    </div>
  );
}

export default ElevatorTree;
