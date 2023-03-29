import { Badge, IconButton, Switch, Tooltip, Box } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import InfoIcon from '@material-ui/icons/Info';
// import faker from 'faker';
import useAxios from 'axios-hooks';
import { IconButtonSquare } from 'components/CommonComponent';
import Dialog from 'components/Dialog';
import PageHeader from 'components/PageHeader';
import Loading from 'containers/Loading/Loadable';
import { Column, TreeList, RowDragging } from 'devextreme-react/tree-list';
import AddIconSvg from 'images/icon-button/add.svg';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
} from 'react';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { showError, showSuccess } from 'utils/toast-utils';
import { showAlertConfirm } from 'utils/utils';
import { API_IAM } from '../apiUrl';
import Add from './add';
import { key } from './contants';

export default function Department() {
  const intl = useIntl();
  const ss = JSON.parse(sessionStorage.getItem(key)) || {};
  const [keyword, setKeyword] = useState(ss?.searchText || '');
  const treeList = useRef(null);
  useEffect(() => {
    if (treeList && treeList.current) {
      treeList.current.instance.searchByText(keyword);
    }
  }, [keyword]);
  // const getTableData = new Array(50).fill().map((item, index) => {
  //   const id = index + 1;
  //   const parentId = Math.round(index / (Math.random() * 10));
  //   return {
  //     id,
  //     parentId,
  //     name: faker.address.city(),
  //     status: 'ACTIVE',
  //   };
  // });
  const [needReload, setNeedReload] = useState(0);
  const [openAddDialog, setOpenAddDialog] = useState(false);

  // table data
  const [
    { data: getTableData, loading: getTableLoading, error: getTableError },
    executeGetTable,
  ] = useAxios(API_IAM.LIST_DEPARTMENT, {
    useCache: false,
    manual: true,
  });
  useEffect(() => {
    executeGetTable();
  }, [needReload]);
  useEffect(() => {
    if (getTableError) {
      showError(getTableError);
    }
  }, [getTableError]);
  // delete
  const [
    { response: deleteData, loading: deleteLoading, error: deleteError },
    executeDelete,
  ] = useAxios(
    {
      method: 'DELETE',
    },
    {
      manual: true,
    },
  );
  useEffect(() => {
    if (deleteError) {
      showError(deleteError);
    }
  }, [deleteError]);

  useEffect(() => {
    if (deleteData) {
      showSuccess('Xóa thành công');
      setNeedReload(needReload + 1);
    }
  }, [deleteData]);
  const onDeleteBtnClick = (data) => {
    showAlertConfirm(
      {
        text: 'Bạn có chắc chắn muốn xóa đơn vị này?',
        title: 'Xóa đơn vị',
      },
      intl,
    ).then((result) => {
      if (result.value) {
        executeDelete({
          url: API_IAM.DETAIL_DEPARTMENT(data.groupId),
        });
      }
    });
  };
  const actionRenderer = ({ data }) => (
    <>
      <Tooltip title="Thêm mới đơn vị con">
        <IconButton onClick={() => setOpenAddDialog(data)} size="small">
          <AddIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Chi tiết">
        <IconButton
          color="primary"
          size="small"
          component={Link}
          to={{
            pathname: `/department/${data.groupId}`,
          }}
        >
          <InfoIcon />
        </IconButton>
      </Tooltip>
      {data.isLeaf && (
        <Tooltip title="Xóa">
          <IconButton
            color="secondary"
            size="small"
            onClick={() => onDeleteBtnClick(data)}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      )}
    </>
  );
  // change status
  const [
    { response: statusData, loading: statusLoading, error: statusError },
    executeStatus,
  ] = useAxios(
    {
      method: 'PUT',
    },
    {
      manual: true,
    },
  );
  useEffect(() => {
    if (statusError) {
      showError(statusError);
    }
  }, [statusError]);

  useEffect(() => {
    if (statusData) {
      showSuccess('Thay đổi trạng thái thành công');
      setNeedReload(needReload + 1);
    }
  }, [statusData]);
  const onSwitchBtnClick = (data) => {
    executeStatus({
      url: API_IAM.STATUS_DEPARTMENT({
        id: data.groupId,
        status: data.status == 'ACTIVE',
      }),
    });
  };
  const statusRenderer = ({ value, data }) => (
    <Switch
      checked={value == 'ACTIVE'}
      color="primary"
      onClick={() => onSwitchBtnClick(data)}
    />
  );
  const columns = [
    {
      dataField: 'groupName',
      caption: 'Tên đơn vị',
      allowHeaderFiltering: false,
    },
    {
      dataField: 'groupCode',
      caption: 'Mã đơn vị',
      allowHeaderFiltering: false,
    },
    {
      dataField: 'status',
      caption: 'Trạng thái',
      cellRender: statusRenderer,
      headerFilter: {
        dataSource: [
          {
            text: 'Hoạt động',
            value: 'ACTIVE',
          },
          {
            text: 'Ngưng hoạt động',
            value: 'INACTIVE',
          },
        ],
      },
      width: 'auto',
    },
    {
      caption: 'Hành động',
      cellRender: actionRenderer,
      width: 'auto',
      minWidth: 103,
      // alignment: 'center',
    },
  ];
  // add
  const [
    { response: addData, loading: addLoading, error: addError },
    executeAdd,
  ] = useAxios(
    {
      url: API_IAM.ADD_DEPARTMENT,
      method: 'POST',
    },
    {
      manual: true,
    },
  );
  useEffect(() => {
    if (addError) {
      showError(addError);
    }
  }, [addError]);

  useEffect(() => {
    if (addData) {
      showSuccess('Thêm mới thành công');
      setOpenAddDialog(false);
      setNeedReload(needReload + 1);
    }
  }, [addData]);
  const onAddDialogClose = useCallback(
    (ret) => {
      if (ret) {
        const data = { ...ret, parentId: ret.parent?.groupId };
        executeAdd({
          data,
        });
      } else setOpenAddDialog(false);
    },
    [setOpenAddDialog],
  );
  const addDialog = (
    <Dialog
      open={Boolean(openAddDialog)}
      onClose={() => onAddDialogClose(0)}
      title="Thêm mới đơn vị"
      maxWidth="md"
      fullWidth
      disableEnforceFocus
    >
      <Add parent={openAddDialog} onSubmit={onAddDialogClose} />
    </Dialog>
  );
  // move
  const [
    { response: moveData, loading: moveLoading, error: moveError },
    executeMove,
  ] = useAxios(
    {
      url: API_IAM.MOVE_DEPARTMENT,
      method: 'PUT',
    },
    {
      manual: true,
    },
  );
  useEffect(() => {
    if (moveError) {
      showError(moveError);
    }
  }, [moveError]);

  useEffect(() => {
    if (moveData) {
      showSuccess('Chuyển đơn vị thành công');
      setNeedReload(needReload + 1);
    }
  }, [moveData]);
  const onDragChange = useCallback((e) => {
    const visibleRows = e.component.getVisibleRows();
    let targetNode = visibleRows[e.toIndex].node;
    if (targetNode.data.groupId === e.itemData.parentId) {
      e.cancel = true;
    }
    while (targetNode && targetNode.data) {
      if (targetNode.data.groupId === e.itemData.groupId) {
        e.cancel = true;
        break;
      }
      targetNode = targetNode.parent;
    }
  }, []);
  const dragRender = (e) => (
    <Box
      display="flex"
      alignItems="center"
      bgcolor="rgba(255,255,255,0.6)"
      width={e.itemElement.clientWidth}
      height={e.itemElement.clientHeight}
      border="1px dashed steelblue"
      px={2}
    >
      {e.itemData.groupName}
    </Box>
  );
  const onDragEnd = useCallback((e) => {
    if (e.fromIndex == e.toIndex) return;
    const visibleRows = e.component.getVisibleRows();
    const targetNode = visibleRows[e.toIndex].node;
    showAlertConfirm({
      html: `Bạn có chắc chắn muốn chuyển đơn vị <b>${e.itemData.groupName}</b> sang thuộc đơn vị <b>${targetNode.data.groupName}</b>?`,
    }).then((ret) => {
      if (ret.value) {
        executeMove({
          data: {
            groupId: e.itemData.groupId,
            toGroupId: targetNode.data.groupId,
          },
        });
      }
    });
  }, []);
  return (
    <>
      <Helmet>
        <title>Quản lý đơn vị</title>
        <meta name="description" content="Description of Department" />
      </Helmet>
      {(getTableLoading ||
        deleteLoading ||
        statusLoading ||
        addLoading ||
        moveLoading) && <Loading />}
      {addDialog}
      <PageHeader
        title="Quản lý đơn vị"
        showSearch
        defaultSearch={keyword}
        onSearchValueChange={(newVal) => {
          setKeyword(newVal);
        }}
      >
        <Tooltip title={intl.formatMessage({ id: 'app.tooltip.add' })}>
          <Badge color="primary">
            <IconButtonSquare
              icon={AddIconSvg}
              onClick={() => {
                setOpenAddDialog({});
              }}
            />
          </Badge>
        </Tooltip>
      </PageHeader>
      {useMemo(
        () => (
          <TreeList
            ref={treeList}
            dataSource={getTableData}
            keyExpr="groupId"
            parentIdExpr="parentId"
            style={{
              maxHeight: 'calc(100vh - 159px)',
            }}
            className="center-row-grid"
            columnAutoWidth
            allowColumnResizing
            columnResizingMode="widget"
            showRowLines
            showColumnLines={false}
            filterMode="fullBranch"
            rootValue={null}
            headerFilter={{
              visible: true,
            }}
            stateStoring={{
              enabled: true,
              type: 'sessionStorage',
              storageKey: key,
            }}
          >
            <RowDragging
              allowDropInsideItem
              allowReordering={false}
              showDragIcons={false}
              onDragChange={onDragChange}
              onDragEnd={onDragEnd}
              dragRender={dragRender}
            />
            {React.Children.toArray(columns.map((col) => <Column {...col} />))}
          </TreeList>
        ),
        [getTableData, keyword],
      )}
    </>
  );
}
