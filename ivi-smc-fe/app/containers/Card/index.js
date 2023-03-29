import { Badge, IconButton, Switch, Tooltip } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/DeleteOutlineOutlined';
import EditIcon from '@material-ui/icons/InfoOutlined';
import useAxios from 'axios-hooks';
import { IconButtonSquare } from 'components/CommonComponent';
import Dialog from 'components/Dialog';
import PageHeader from 'components/PageHeader';
import TableCustom from 'components/TableCustom';
import { IconExport, IconFilter, IconImport } from 'constant/ListIcons';
import { USER_CARD_API } from 'containers/apiUrl';
import Loading from 'containers/Loading/Loadable';
import { endOfDay, startOfDay } from 'date-fns';
import FileSaver from 'file-saver';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { showError, showSuccess } from 'utils/toast-utils';
import { showAlertConfirm } from 'utils/utils';
import { DEFAULT_FILTER, key, STATUS_MAP, USER_TYPE_MAP } from './constants';
import Filter from './filter';
import Import from './import';
const IMPORT_API_MAP = {
  input: USER_CARD_API.IMPORT(false),
  transfer: USER_CARD_API.IMPORT(true),
  block: USER_CARD_API.IMPORT_BLOCK,
};
export function Card({ history, location }) {
  const intl = useIntl();
  const headerRef = useRef();
  const state = location?.state || {};
  const [openFilterDialog, setOpenFilterDialog] = useState(false);
  const [openImportDialog, setOpenImportDialog] = useState(false);
  const [filter, setFilter] = useState({
    ...DEFAULT_FILTER,
    ...(state[key] || {}),
  });
  const [needReload, setNeedReload] = useState(0);
  const isFilter = (filterOp) => {
    const { keyword, limit, page, ...filter } = filterOp;
    return Object.values(filter).filter((v) => !!v && String(v).length).length;
  };
  const [showFilter, setShowFilter] = useState(isFilter(filter));
  useEffect(() => {
    if (Object.keys(state).length) {
      history.replace({ ...location?.state, [key]: undefined });
    }
  }, []);
  // table data
  const [
    { data: getTableData, loading: getTableLoading, error: getTableError },
    executeGetTable,
  ] = useAxios(
    { method: 'GET', url: USER_CARD_API.SEARCH },
    {
      useCache: false,
      manual: true,
    },
  );
  useEffect(() => {
    const { group, createdAt, ...other } = filter;
    const [createdAtMin, createdAtMax] = createdAt;
    const params = {
      ...other,
      cardStatus: filter?.cardStatus || undefined,
      cardType: filter?.cardType || undefined,
      cardUserType: filter?.cardUserType || undefined,
      groupId: filter?.group?.groupId || undefined,
      createdAtMin: createdAtMin
        ? startOfDay(createdAtMin).getTime()
        : undefined,
      createdAtMax: createdAtMax
        ? endOfDay(createdAtMax).getTime()
        : createdAtMin
        ? endOfDay(createdAtMin).getTime()
        : undefined,
    };
    executeGetTable({
      params,
    });
  }, [filter, needReload]);
  useEffect(() => {
    if (getTableData) {
      if (getTableData.rows.length <= 0 && filter.page > 1) {
        setFilter({ ...filter, page: filter.page - 1 });
      }
    }
  }, [getTableData]);
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
  // block
  const [
    { response: putData, loading: putLoading, error: putError },
    executePut,
  ] = useAxios(
    {
      method: 'PUT',
    },
    {
      manual: true,
    },
  );
  useEffect(() => {
    if (putError) {
      showError(putError);
    }
  }, [putError]);

  useEffect(() => {
    if (putData) {
      showSuccess('Thành công');
      setNeedReload(needReload + 1);
    }
  }, [putData]);
  // import
  const [
    { response: importData, loading: importLoading, error: importError },
    executeImport,
  ] = useAxios(
    {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      responseType: 'blob',
    },
    {
      manual: true,
    },
  );
  useEffect(() => {
    if (importError) {
      showError(importError);
    }
  }, [importError]);

  useEffect(() => {
    if (importData) {
      showSuccess('Thành công');
      setNeedReload(needReload + 1);
      setOpenImportDialog(false);
      const now = new Date();
      FileSaver.saveAs(
        importData,
        `import-result-${now.toLocaleDateString('vi')}.xlsx`,
      );
    }
  }, [importData]);
  const renderOrderCell = ({ rowIndex }) => (
    <span>{(filter.page - 1) * filter.limit + rowIndex + 1}</span>
  );
  const onDeleteBtnClick = (data) => {
    showAlertConfirm(
      {
        text: 'Bạn có chắc chắn muốn xóa thẻ này?',
        title: 'Xóa thẻ',
      },
      intl,
    ).then((result) => {
      if (result.value) {
        executeDelete({
          url: USER_CARD_API.DELETE,
          data: [data.cardId],
        });
      }
    });
  };
  const onSwitchBlock = (data) => {
    executePut({
      params: { blocked: !data?.cardBlocked },
      url: USER_CARD_API.BLOCK(data.cardId),
    });
  };
  const blockRender = ({ value = false, data }) => (
    <Switch
      checked={value}
      color="secondary"
      onChange={() => onSwitchBlock(data)}
    />
  );
  const actionRenderer = ({ data }) => (
    <>
      <Tooltip title={intl.formatMessage({ id: 'app.tooltip.info' })}>
        <IconButton
          color="primary"
          component={Link}
          to={{
            pathname: `/card/${data.cardId}`,
            state: {
              [key]: filter,
            },
          }}
        >
          <EditIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      {data.cardStatus == 'NEW' && (
        <Tooltip title="Xóa">
          <IconButton onClick={() => onDeleteBtnClick(data)}>
            <ClearIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
    </>
  );
  const userTypeRenderer = ({ value }) =>
    USER_TYPE_MAP.get(value || 'NONE') || 'Không xác định';
  const statusRenderer = ({ value }) =>
    STATUS_MAP.get(value) || 'Không xác định';
  const columns = [
    {
      caption: intl.formatMessage({ id: 'app.column.order' }),
      width: 'auto',
      alignment: 'center',
      cellRender: renderOrderCell,
      minWidth: 50,
    },
    {
      dataField: 'cardNumber',
      caption: 'Mã thẻ',
      minWidth: 125,
    },
    {
      dataField: 'frontNumber',
      caption: 'Mã thẻ mặt trước',
      minWidth: 125,
    },
    {
      dataField: 'backNumber',
      caption: 'Mã thẻ mặt sau',
      minWidth: 125,
    },
    {
      dataField: 'cardStatus',
      caption: 'Trạng thái',
      cellRender: statusRenderer,
      // width: 'auto',
      minWidth: 134,
    },
    {
      dataField: 'cardType',
      caption: 'Loại thẻ',
      // width: 'auto',
      // minWidth: 120,
    },
    {
      dataField: 'cardUserType',
      caption: 'Đối tượng',
      cellRender: userTypeRenderer,
      // width: 'auto',
      // minWidth: 120,
    },
    {
      dataField: 'accessCode',
      caption: 'Mã định danh',
      minWidth: 105,
    },
    {
      dataField: 'groupName',
      caption: 'Đơn vị',
      minWidth: 100,
    },
    {
      dataField: 'cardBlocked',
      caption: 'Trạng thái khóa',
      minWidth: 125,
      cellRender: blockRender,
    },
    {
      caption: intl.formatMessage({ id: 'app.column.action' }),
      cellRender: actionRenderer,
      width: 'auto',
      minWidth: 103,
      // alignment: 'center',
    },
  ];
  const handlePageSize = (e) => {
    setFilter({ ...filter, limit: e.target.value, page: 1 });
  };
  // const handlePropertyChange = e => {
  //   if (e.fullName.includes('sortOrder')) {
  //     if (e.value) {
  //       const direction = e.value == 'asc' ? '+' : '-';
  //       const key = columns[e.fullName.slice(8, -11)].dataField;
  //       setSort(direction + key);
  //     } else setSort(undefined);
  //   }
  // };
  const onFilterBtnClick = () => {
    setOpenFilterDialog(true);
  };
  const onFilterPopoverClose = (ret) => {
    if (ret) {
      const newState = {
        ...filter,
        ...ret,
        page: 1,
      };
      setFilter(newState);
      setShowFilter(isFilter(newState));
    }
    setOpenFilterDialog(false);
  };
  const filterDialog = (
    <Dialog
      open={openFilterDialog}
      onClose={() => onFilterPopoverClose(0)}
      title="Lọc thẻ"
      maxWidth="sm"
      fullWidth
    >
      <Filter initialState={filter} onSubmit={onFilterPopoverClose} />
    </Dialog>
  );
  const onImportBtnClick = () => {
    setOpenImportDialog(true);
  };
  const onExportBtnClick = () => {
    showSuccess('Coming soon');
  };
  const onImportDialogClose = (ret) => {
    if (ret) {
      const formData = new FormData();
      formData.append('file', ret.file);
      executeImport({
        url: IMPORT_API_MAP[ret.typeInput],
        data: formData,
      });
    } else {
      setOpenImportDialog(false);
    }
  };
  const importDialog = (
    <Dialog
      open={openImportDialog}
      onClose={() => onImportDialogClose(0)}
      title="Nhập thẻ"
      maxWidth="md"
      fullWidth
    >
      <Import onSubmit={onImportDialogClose} />
    </Dialog>
  );
  return (
    <>
      <Helmet>
        <title>Danh sách thẻ</title>
        <meta name="description" content="Danh sách thẻ" />
      </Helmet>
      {(getTableLoading || deleteLoading || importLoading || putLoading) && (
        <Loading />
      )}
      {filterDialog}
      {importDialog}
      <PageHeader
        ref={headerRef}
        title="Danh sách thẻ"
        showSearch
        showFilter={Boolean(showFilter)}
        onBack={() => {
          setFilter({
            ...DEFAULT_FILTER,
            keyword: filter.keyword,
            limit: filter.limit,
          });
          setShowFilter(0);
        }}
        defaultSearch={filter.keyword}
        placeholderSearch="Tìm kiếm theo số thẻ"
        showPager
        totalCount={getTableData?.count || 0}
        pageIndex={filter.page}
        rowsPerPage={filter.limit}
        handleChangePageIndex={(pageIndex) => {
          setFilter({ ...filter, page: pageIndex });
        }}
        handlePageSize={handlePageSize}
        onSearchValueChange={(newVal) => {
          setFilter({ ...filter, keyword: newVal, page: 1 });
        }}
      >
        <Tooltip title={intl.formatMessage({ id: 'app.tooltip.filter' })}>
          <Badge badgeContent={showFilter} color="primary">
            <IconButtonSquare icon={IconFilter} onClick={onFilterBtnClick} />
          </Badge>
        </Tooltip>
        <Tooltip title="Nhập thẻ">
          <Badge>
            <IconButtonSquare
              icon={IconImport}
              onClick={() => onImportBtnClick()}
            />
          </Badge>
        </Tooltip>
        <Tooltip title="Tải xuống thẻ">
          <Badge>
            <IconButtonSquare
              icon={IconExport}
              onClick={() => onExportBtnClick()}
            />
          </Badge>
        </Tooltip>
      </PageHeader>
      {useMemo(
        () => (
          <TableCustom
            hideTable={false}
            data={getTableData?.rows || []}
            columns={columns}
            keyExpr="cardId"
          />
        ),
        [getTableData],
      )}
    </>
  );
}

export default Card;
