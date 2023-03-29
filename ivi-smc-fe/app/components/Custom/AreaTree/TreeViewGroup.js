/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable no-unused-expressions */
/* eslint-disable import/no-unresolved */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-console */
/* eslint-disable arrow-body-style */
import React, { useEffect, useState } from 'react';
import TreeView from 'devextreme-react/tree-view';
import 'whatwg-fetch';
import gui from 'utils/gui';
import '../styles.css';
import utils, { createChildrenGroupUser } from 'utils/utils';
import Loading from 'containers/Loading/Loadable';
import { callApi } from 'utils/requestUtils';
import { ACCESS_CONTROL_API_SRC } from 'containers/apiUrl';
import ClickAway from 'components/Custom/ClickAway';
import PopupDelete from 'components/Custom/popup/PopupDelete';
import FormGroup from './FormGroup';
import { IconDelete, IconEdit, IconPlus } from '../Icon/ListIcon';

const TreeViewGroup = ({
  callback,
  params,
  api,
  elementTotal,
  groupId,
  reloadTreeView,
  titleDelete = '',
  ContentDelete = '',
  textApi,
  callbackReload,
  contentConfirmHaveItem,
  allUrlApi,
  ContentDeleteSub,
}) => {
  const [itemTreeViewId, setItemTreeViewId] = useState('');

  const [itemTreeView, setItemTreeView] = useState('');

  const [openViewDelete, setOpenViewDelete] = useState(false);
  const [isOpenFormGroupUser, setIsOpenFormGroupUser] = useState(false);
  const [dataTreeView, setDataTreeView] = useState([]);

  const [itemDelete, setItemDelete] = useState('');
  const [itemUpdate, setItemUpdate] = useState('');
  const [setName, setSetName] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOpenViewConfirm, setIsOpenViewConfirm] = useState(false);

  useEffect(() => {
    fetchDataTreeView();
  }, [reloadTreeView]);

  useEffect(() => {
    if (itemTreeView) {
      localStorage.setItem(
        `item-${api}-tree-view`,
        JSON.stringify(itemTreeView),
      );
    }
  }, [itemTreeView]);

  const fetchDataTreeView = async (v) => {
    setLoading(true);
    try {
      const fetchAllGroupUser = await callApi(
        params
          ? `${
              allUrlApi || ACCESS_CONTROL_API_SRC
            }/${api}-groups/children-lv1?${params}`
          : `${allUrlApi || ACCESS_CONTROL_API_SRC}/${api}-groups/children-lv1`,
        'GET',
      );
      const found = fetchAllGroupUser?.data?.find((e) => !e.parentId);
      if (found) {
        if (groupId) {
          setItemTreeViewId(v || groupId);
        } else {
          callback(found.id);
          setItemTreeViewId(groupId || found.id);
        }
      }
      const arrAllGroup = fetchAllGroupUser.data || [];
      const data =
        arrAllGroup?.map((i) => ({
          id: i.id,
          categoryId: i.parentId || null,
          name: i.name,
          hasItems: i.isParent,
          total: i[elementTotal] || 0,
          expanded: !i.parentId,
        })) || [];
      setItemUpdate('');
      setItemDelete('');
      setDataTreeView(data);
    } catch (error) {
      utils.showToastErrorCallApi(error);
    } finally {
      setLoading(false);
    }
  };

  const onClickItemOption = (i, type) => {
    setItemDelete(i);
    if (type === 'delete') {
      setOpenViewDelete(true);
    }
    if (type === 'add') {
      setIsOpenFormGroupUser(true);
    }
    if (type === 'update') {
      setItemUpdate(i);
      setIsOpenFormGroupUser(true);
    }
  };

  console.log('itemDelete', itemDelete);

  return (
    <div>
      {loading ? (
        'Đang tải dữ liệu ...'
      ) : (
        <TreeView
          dataStructure="plain"
          rootValue=""
          parentIdExpr="categoryId"
          displayExpr="name"
          keyExpr="id"
          // height={gui.screenHeight - 230}
          itemRender={(e) => (
            <TreeViewItem
              item={e}
              allUrlApi={allUrlApi}
              setName={setName}
              textApi={textApi}
              itemTreeViewId={itemTreeViewId}
              fetchDataTreeView={fetchDataTreeView}
              callback={(e, type, item) => {
                setItemTreeViewId(e);
                setItemTreeView(item);
                if (!type) {
                  const dto = {
                    pathOfTrees: item.pathOfTrees,
                    type: item.type,
                  };
                  localStorage.setItem(
                    `path-tree-of-${item.type}`,
                    JSON.stringify(dto),
                  );
                  callback(e);
                }
              }}
              onSetName={(e) => {
                setSetName(e);
              }}
              api={api}
              callbackOnClickItemOption={(i, t) => onClickItemOption(i, t)}
            />
          )}
          createChildren={(e) =>
            createChildrenGroupUser(
              e,
              `${api}-groups`,
              elementTotal,
              allUrlApi,
              params,
            )
          }
          focusStateEnabled={false}
          className="cus-tree-view"
          noDataText="Không có dữ liệu"
          items={dataTreeView}
        />
      )}

      {openViewDelete && (
        <PopupDelete
          title={titleDelete || 'Xóa Group User'}
          textFollowTitle={
            (ContentDeleteSub &&
              (itemDelete?.total > 0
                ? ContentDelete
                : `${ContentDeleteSub} ${itemDelete?.name} ?`)) ||
            ContentDelete ||
            `Điều này sẽ xoá toàn bộ danh sách user nằm trong thư mục.
          Bạn có chắc chắn muốn thực hiện việc này`
          }
          onClickSave={async () => {
            try {
              await callApi(
                `${allUrlApi || ACCESS_CONTROL_API_SRC}/${api}-groups/${
                  itemDelete.id
                }`,
                'DELETE',
              );
              utils.showToast('Thành công');
              setOpenViewDelete(false);
              localStorage.removeItem(`path-tree-of-${api}-groups`);
              localStorage.removeItem(`item-${api}-tree-view`);
              callback && callback(dataTreeView[0].id);
              fetchDataTreeView(dataTreeView[0].id);
            } catch (error) {
              utils.showToastErrorCallApi(error);
            }
          }}
          onClose={(v) => setOpenViewDelete(v)}
        />
      )}

      {isOpenViewConfirm && (
        <PopupDelete
          title="Xóa thư mục"
          textFollowTitle={
            contentConfirmHaveItem ||
            `Vui lòng gõ toàn bộ user ra khỏi nhóm ${
              itemDelete?.name || ''
            } trước khi xóa nhóm`
          }
          hiddenBtnClose
          onClickSave={() => {
            setIsOpenViewConfirm(false);
          }}
          saveTxt="Xong"
          onClose={(v) => setIsOpenViewConfirm(v)}
        />
      )}

      <FormGroup
        open={isOpenFormGroupUser}
        item={itemDelete}
        data={itemUpdate}
        api={api}
        allUrlApi={allUrlApi}
        textApi={textApi}
        callback={() => {
          fetchDataTreeView();
          callbackReload && callbackReload();
        }}
        onClose={(v) => {
          setIsOpenFormGroupUser(v);
          setItemUpdate('');
          setItemDelete('');
        }}
      />
    </div>
  );
};

const TreeViewItem = ({
  item,
  itemTreeViewId,
  callback,
  callbackOnClickItemOption,
  fetchDataTreeView,
  api,
  onSetName,
  setName,
  allUrlApi,
}) => {
  const check = itemTreeViewId === item.id;
  // const [itemGroupUser, setItemGroupUser] = useState('');
  const [open, setOpen] = useState(false);
  const [offsetItem, setOffsetItem] = useState('');

  const [loading, setLoading] = useState(false);

  const handlerDragStart = (e, i) => {
    // setItemGroupUser(i);
    callback(i.id, true, i);
    onSetName(i.name);
  };

  const onDropGroupUser = async (e, i, id, fullItem) => {
    if (e.target.id == `droppable-gr-user${id}`) {
      e.target.style.border = '';
      if (e.target.id == `droppable-gr-user${i}`) {
        return;
      }
    }
    if (setName && i) {
      setLoading(true);
      try {
        const dto = {
          name: setName,
          parentId: id,
        };
        await callApi(
          `${allUrlApi || ACCESS_CONTROL_API_SRC}/${api}-groups/${i}`,
          'PUT',
          dto,
        );
        const dto2 = {
          pathOfTrees: fullItem.pathOfTrees,
          type: fullItem.type,
        };
        localStorage.setItem(
          `path-tree-of-${fullItem.type}`,
          JSON.stringify(dto2),
        );
        utils.showToast('Gán group thành công');
        fetchDataTreeView();
      } catch (error) {
        utils.showToastErrorCallApi(error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (itemTreeViewId !== item.id) {
      setOpen(false);
    }
  }, [itemTreeViewId]);

  const onCloseAway = () => {
    setOpen(false);
  };

  return (
    <div>
      {loading && <Loading />}
      <ClickAway
        open={open}
        onClose={onCloseAway}
        style={{
          // position: 'fixed',
          top:
            gui.screenHeight - offsetItem?.top < 150
              ? offsetItem?.top - 80
              : offsetItem?.top - 5 || 0,
          left: offsetItem?.left + 180 || 0,
          zIndex: 200,
          overflow: 'hidden',
          border: 'none',
          backgroundColor: '#fff',
          boxShadow: '3px 3px 15px 0 rgba(0, 0, 0, 0.16)',
          borderRadius: 6,
          width: 170,
        }}
        viewBtn={
          <div
            onContextMenu={(e) => {
              e.preventDefault();
              if (e.type === 'contextmenu') {
                const offsets = document
                  .getElementById(`droppable-gr-user${item.id}`)
                  .getBoundingClientRect();
                setOffsetItem(offsets);
                callback(item.id, 'right', item);
                setOpen(true);
              }
            }}
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: 12,
              paddingRight: 4,
              cursor: 'pointer',
              color: check ? '#FFF' : '',
              fontWeight: check ? 700 : '',
              backgroundColor: check ? '#4B67E2' : '',
              minHeight: 25,
              paddingLeft: check ? 4 : 0,
            }}
            draggable
            onDragStart={(e) => handlerDragStart(e, item)}
            onDragOver={(e) => e.preventDefault()}
            onDragLeave={(e) => {
              if (e.target.id == `droppable-gr-user${item.id}`) {
                e.target.style.border = '';
              }
            }}
            onDragEnter={(e) => {
              if (setName && e.target.id == `droppable-gr-user${item.id}`) {
                e.target.style.border = '1px solid #4B67E2';
              }
            }}
            onClick={() => callback(item.id, null, item)}
            onDrop={(e) => {
              if (setName) {
                onDropGroupUser(e, itemTreeViewId, item.id, item);
              } else {
                e.target.style.border = '';
              }
            }}
            className="ct-flex-row"
          >
            <div
              id={`droppable-gr-user${item.id}`}
              className={item.name}
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                textTransform: 'none',
                textAlign: 'left',
              }}
            >
              {item.name}
            </div>
            <div
              id="test-id"
              style={{
                borderRadius: 8,
                backgroundColor: check ? '#FFF' : '#E4E4E4',
                padding: '0 5px 0 5px',
                fontSize: 12,
                fontWeight: 400,
                color: '#333',
              }}
            >
              {item?.total || null}
            </div>
          </div>
        }
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {[
            {
              name: 'Thêm nhóm mới',
              type: 'add',
              icon: <IconPlus />,
            },
            {
              name: 'Đổi tên nhóm',
              type: 'update',
              icon: <IconEdit />,
            },
            {
              name: 'Xóa nhóm',
              type: 'delete',
              icon: <IconDelete />,
            },
          ].map((i, index) => {
            if (!item.categoryId && index !== 0) {
              return null;
            }
            return (
              <div
                className="item-menu-group-user ct-flex-row"
                style={{
                  cursor: 'pointer',
                  paddingLeft: 10,
                  height: 32,
                  color: i.type === 'delete' && 'red',
                }}
                key={index.toString()}
                onClick={() => callbackOnClickItemOption(item, i.type)}
              >
                {i.name}
              </div>
            );
          })}
        </div>
      </ClickAway>
    </div>
  );
};

export default TreeViewGroup;
