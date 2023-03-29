/* eslint-disable func-names */
/* eslint-disable no-unused-expressions */
/* eslint-disable prefer-const */
import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import DropDownBox from 'devextreme-react/drop-down-box';
import TreeView from 'devextreme-react/tree-view';
import { useIntl } from 'react-intl';
import { Validator, CustomRule } from 'devextreme-react/validator';
import { createChildrenAreaTree } from 'utils/utils';
// selectionMode="multiple"
// value={[
//   { id: 11, name: 'BQL Start City Thanh Hóa' },
//   { id: 33, name: 'DTGL' },
// ]}
export function AreaTree({
  disabled,
  value,
  required,
  onValueChanged,
  selectionMode = 'single',
  level,
  allowSelectParentLevel,
  searchEnabled = false,
  showClearButton = true,
  dropDownBoxProps = {},
}) {
  const intl = useIntl();
  const treeViewRef = useRef(null);
  const dropdownBox = useRef(null);
  const [dataSource, setDataSource] = useState(
    value ? (Array.isArray(value) ? value : [value]) : [],
  );
  const getValue = value =>
    value
      ? selectionMode === 'multiple'
        ? value.map(i => i.id)
        : [value.id]
      : [];
  const [treeBoxValue, setTreeBoxValue] = useState([]);
  const [isTreeBoxOpened, setIsTreeBoxOpened] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    setIsFirstLoad(false);
  }, []);
  useEffect(() => {
    setTreeBoxValue(getValue(value));
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
      hasItemsExpr="hasItems"
      selectByClick
      searchEnabled={searchEnabled}
      onContentReady={
        selectionMode === 'multiple' ? onContentReady : treeViewOnContentReady
      }
      onItemSelectionChanged={treeViewItemSelectionChanged}
      createChildren={async parent => {
        const data = await createChildrenAreaTree(parent, null, level);
        const dataM = data.map(d => ({
          ...d,
          selected: Array.isArray(treeBoxValue)
            ? treeBoxValue.includes(d.id)
            : d.id == treeBoxValue,
        }));
        const cat = dataM.filter(
          item => !dataSource.find(d => item.id == d.id),
        );
        setDataSource(prev => [...prev, ...cat]);
        return dataM;
      }}
      onItemRendered={onItemRendered}
      onItemClick={onTreeItemClick}
      noDataText={intl.formatMessage({ id: 'app.no_data' })}
    />
  );
  const onTreeItemClick = e => {
    if (
      selectionMode == 'single' &&
      (!level || allowSelectParentLevel || (level && e.itemData.level >= level))
    ) {
      setIsTreeBoxOpened(false);
    }
  };
  const onItemRendered = ({ itemElement, itemData }) => {
    if (!allowSelectParentLevel && itemData.level < level) {
      const cb = itemElement.parentElement.getElementsByClassName(
        'dx-checkbox',
      )[0];
      cb.style.display = 'none';
      itemElement.style.paddingLeft = 0;
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
        let values = e.value || treeBoxValue;
        values &&
          values
            .map(i => i.id)
            .forEach(function(value) {
              treeView.selectItem(value);
            });
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
    const selected = e.component
      .getSelectedNodes()
      .map(d => d.itemData)
      .filter(d => allowSelectParentLevel || (level ? d.level >= level : true));
    onValueChanged(selectionMode === 'multiple' ? selected : selected[0]);
    if (dropdownBox && dropdownBox.current && dropdownBox.current.instance) {
      // tự đóng lại sau khi chọn item
      dropdownBox.current.instance.close();
    }
  };

  const syncTreeViewSelection = e => {
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
    if (!e.value) onValueChanged(null);
  };
  function onTreeBoxOpened(e) {
    if (e.name === 'opened') {
      setIsTreeBoxOpened(e.value);
    }
  }
  const validateTree = () => {
    if (isFirstLoad) return true;
    return treeBoxValue && treeBoxValue.length > 0;
  };
  return (
    <div style={{ width: '100%' }}>
      <DropDownBox
        width="100%"
        ref={dropdownBox}
        disabled={disabled}
        value={treeBoxValue}
        valueExpr="id"
        displayExpr="name"
        showClearButton={showClearButton}
        dataSource={dataSource}
        onValueChanged={e => {
          selectionMode === 'multiple'
            ? onContentReady(e)
            : syncTreeViewSelection(e);
        }}
        contentRender={treeViewRender}
        opened={isTreeBoxOpened}
        onOptionChanged={onTreeBoxOpened}
        {...dropDownBoxProps}
      >
        {required ? (
          <Validator>
            <CustomRule
              validationCallback={validateTree}
              message={intl.formatMessage({
                id: 'app.NVR.message.require_input',
              })}
            />
          </Validator>
        ) : null}
      </DropDownBox>
    </div>
  );
}

AreaTree.propTypes = {
  required: PropTypes.bool, // xác định có cần validate bắt buộc nhập giá trị hay không
  onValueChanged: PropTypes.func, // hàm callback được gọi khi giá trị lựa chọn thay đôit
};

export default AreaTree;
