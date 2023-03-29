import { Badge, Box, IconButton, Tooltip } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import InfoIcon from '@material-ui/icons/Info';
// import faker from 'faker';
import useAxios from 'axios-hooks';
import { IconButtonSquare } from 'components/CommonComponent';
import Dialog from 'components/Dialog';
import PageHeader from 'components/PageHeader';
import Loading from 'containers/Loading/Loadable';
import { Column, RowDragging, TreeList } from 'devextreme-react/tree-list';
import AddIconSvg from 'images/icon-button/add.svg';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl';
import { showError, showSuccess } from 'utils/toast-utils';
import { showAlertConfirm } from 'utils/utils';
import { SAP_API } from '../apiUrl';
import Add from './add';
import { defaultNew } from './constants';

export default function Department() {
  const intl = useIntl();
  const [keyword, setKeyword] = useState('');
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
  ] = useAxios(SAP_API.LIST_AREA, {
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
        text: 'Bạn có chắc chắn muốn xóa phân khu này?',
        title: 'Xóa phân khu',
      },
      intl,
    ).then((result) => {
      if (result.value) {
        executeDelete({
          url: SAP_API.DETAIL_AREA(data.id),
        });
      }
    });
  };
  const actionRenderer = ({ data }) => (
    <>
      <Tooltip title="Thêm mới phân khu con">
        <IconButton
          onClick={() =>
            setOpenAddDialog({
              areaName: '',
              areaCode: '',
              parent: data,
            })
          }
          size="small"
        >
          <AddIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Chi tiết">
        <IconButton
          color="primary"
          size="small"
          onClick={() => {
            const { parentId, parentName, areaCode, areaName, id } = data;
            setOpenAddDialog({
              id,
              areaName,
              areaCode,
              parent: parentId
                ? { id: parentId, areaName: parentName || 'noname' }
                : null,
            });
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
  const columns = [
    {
      dataField: 'areaName',
      caption: 'Tên phân khu',
    },
    {
      dataField: 'areaCode',
      caption: 'Mã phân khu',
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
      url: SAP_API.ROOT_AREA,
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
        const { parent, ...other } = ret;
        const data = {
          ...other,
          parentId: parent?.id,
        };
        executeAdd({
          url: ret?.id ? SAP_API.DETAIL_AREA(ret.id) : SAP_API.ROOT_AREA,
          method: ret?.id ? 'PUT' : 'POST',
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
      title={`${openAddDialog.id ? 'Chi tiết' : 'Thêm mới'} phân khu`}
      maxWidth="sm"
      fullWidth
      disableEnforceFocus
    >
      <Add initialValues={openAddDialog} onSubmit={onAddDialogClose} />
    </Dialog>
  );
  const onDragChange = useCallback((e) => {
    const visibleRows = e.component.getVisibleRows();
    let targetNode = visibleRows[e.toIndex].node;
    if (targetNode.data.id === e.itemData.parentId) {
      e.cancel = true;
    }
    while (targetNode && targetNode.data) {
      if (targetNode.data.id === e.itemData.id) {
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
      {e.itemData.areaName}
    </Box>
  );
  const onDragEnd = useCallback((e) => {
    if (e.fromIndex == e.toIndex) return;
    const visibleRows = e.component.getVisibleRows();
    const targetNode = visibleRows[e.toIndex].node;
    showAlertConfirm({
      html: `Bạn có chắc chắn muốn chuyển phân khu <b>${e.itemData.areaName}</b> sang thuộc phân khu <b>${targetNode.data.areaName}</b>?`,
    }).then((ret) => {
      if (ret.value) {
        executeAdd({
          url: SAP_API.DETAIL_AREA(e.itemData.id),
          method: 'PUT',
          data: {
            areaName: e.itemData.areaName,
            parentId: targetNode.data.id,
          },
        });
      }
    });
  }, []);
  return (
    <>
      <Helmet>
        <title>Quản lý phân khu</title>
        <meta name="description" content="Description of Department" />
      </Helmet>
      {(getTableLoading || deleteLoading || addLoading) && <Loading />}
      {addDialog}
      <PageHeader
        title="Quản lý phân khu"
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
                setOpenAddDialog(defaultNew);
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
            keyExpr="id"
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
            rootValue={null}
            filterMode="fullBranch"
            // stateStoring={{
            //   enabled: true,
            //   type: 'sessionStorage',
            //   storageKey: 'departTreeList',
            // }}
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
