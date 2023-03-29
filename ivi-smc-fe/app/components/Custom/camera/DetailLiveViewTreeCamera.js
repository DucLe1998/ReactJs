import React from 'react';
import TreeView from 'devextreme-react/tree-view';
import 'whatwg-fetch';
import { FiMinus, FiPlus } from 'react-icons/fi';
import { BiMap } from 'react-icons/bi';
import { BsDiamond } from 'react-icons/bs';
import IconBtn from '../IconBtn';
import gui from '../../../utils/gui';
import './styles.css';
import { createChildrenAreaTree } from '../../../utils/utils';

const colorGreen = '#40A574';
const colorGray = 'rgba(60, 60, 67, 0.6)';

const DetailLiveViewTreeCamera = ({ callback, listCamera, scopes }) => {
  const handlerDragStart = (e, i) => {
    callback(i, 'dragStart');
  };

  const renderTreeViewItem = item => {
    const foundExist = listCamera.find(i => i.id === item.cameraId);
    const renderStatus = v => {
      switch (v) {
        case 'ONLINE':
          return '#32D74B';
        default:
          return colorGray;
      }
    };
    const renderIcon = v => {
      switch (v) {
        case 'block':
          return <BsDiamond color={colorGray} />;
        case 'floor':
          return <BsDiamond color={colorGray} />;
        case 'unit':
          return <BsDiamond color={colorGray} />;
        case 'zone':
          return <BiMap size="1.3em" color={colorGray} />;
        default:
          return null;
      }
    };
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: 12,
        }}
        draggable={!foundExist && item.type === 'CAMERA'}
        onDragStart={e => handlerDragStart(e, item)}
        onDragOver={e => e.preventDefault()}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            textTransform: 'none',
            fontWeight: item.type === 'zone' && 'bold',
            textAlign: 'left',
          }}
        >
          {item.type === 'CAMERA' && (
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: renderStatus(item.fullItem.status_of_device),
                marginRight: 3,
                marginLeft: 4,
              }}
            />
          )}
          <span style={{ marginRight: 5 }}>{renderIcon(item.type)}</span>
          <span style={{ marginTop: item.type !== 'CAMERA' && 3 }}>
            {item.name}
          </span>
        </div>
        {item.type === 'CAMERA' && scopes?.update && (
          <div>
            <IconBtn
              onClick={() => callback(item, foundExist ? 'delete' : 'add')}
              style={{ padding: 3 }}
              icon={
                foundExist ? (
                  <FiMinus size={14} color="red" />
                ) : (
                  <FiPlus size={14} color={colorGreen} />
                )
              }
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <TreeView
      dataStructure="plain"
      rootValue=""
      parentIdExpr="parentId"
      displayExpr="name"
      height={gui.screenHeight - 200}
      itemRender={renderTreeViewItem}
      createChildren={e => createChildrenAreaTree(e, 'CAMERA')}
      focusStateEnabled={false}
      className="cus-tree-view"
      noDataText="Không có dữ liệu"
    />
  );
};

export default DetailLiveViewTreeCamera;
