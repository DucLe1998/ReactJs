/**
 *
 * ListWarning
 *
 */
import { Badge, Box, Link, Tooltip } from '@material-ui/core';
import Dialog from 'components/Dialog';
import { IconButtonSquare } from 'components/CommonComponent';
import Label from 'components/Label';
import PageHeader from 'components/PageHeader';
import { IconFilter } from 'constant/ListIcons';
import { getErrorMessage } from 'containers/Common/function';
import Loading from 'containers/Loading/Loadable';
import { endOfDay, startOfDay } from 'date-fns';
import DataGrid, {
  Column,
  Paging,
  Selection,
} from 'devextreme-react/data-grid';
import PropTypes from 'prop-types';
import React, { Fragment, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { getAreaString, getAreaObjectFromTree } from 'utils/functions';
import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import { showAlertError } from 'utils/utils';
import { makeSelectIsMenuExpanded } from '../Menu/selectors';
import {
  editWarningAction,
  loadInfoWarningAction,
  loadListWarning,
  setOpenDrawerAction,
  setPageAction,
} from './actions';
import { DEFAULT_FILTER, WARNING_STATUS } from './constants';
import Details from './details';
import EditPopup from './editPopup';
import FilterPopover from './filterpopover';
import messages from './messages';
import reducer from './reducer';
import saga from './saga';
import makeSelectListWarning from './selectors';

const WARNING_STATUS_MAP = WARNING_STATUS.reduce(
  (total, cur) => ({
    ...total,
    [cur.id]: cur,
  }),
  {},
);
export function ListWarning({
  listWarning,
  onloadListWarning,
  setOpenDetailsDrawer,
  loadInfoWarning,
  editWarning,
  setPage,
  // isExpanedMenu,
}) {
  const {
    loading,
    error,
    page,
    needReload,
    openDetailsDrawer,
    selectedItem,
    warningData,
  } = listWarning;
  useInjectReducer({ key: 'listWarning', reducer });
  useInjectSaga({ key: 'listWarning', saga });
  const intl = useIntl();

  const [pageSize, setPageSize] = useState(25);
  const [sort, setSort] = useState(undefined);
  const [search, setSearch] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [filterOp, setFilterOp] = useState(DEFAULT_FILTER);
  // const [changes, setChanges] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  function loadData() {
    const query = {
      deviceName: search,
      pageSize,
      index: page,
      sortBy: sort,
      fromDate: filterOp.fromDate
        ? startOfDay(filterOp.fromDate).getTime()
        : undefined,
      toDate: filterOp.toDate ? endOfDay(filterOp.toDate).getTime() : undefined,
      status: filterOp.status?.id,
      deviceType: filterOp.deviceType || undefined,
      type: filterOp.type?.code,
    };
    if (filterOp.area) {
      Object.assign(query, getAreaObjectFromTree(filterOp.area));
    }
    onloadListWarning(query);
  }
  useEffect(() => {
    loadData();
    setSelectedRowKeys([]);
  }, [pageSize, page, sort, search, needReload, filterOp]);
  const statusRenderer = ({ value }) => {
    const { text, ...other } = WARNING_STATUS_MAP[value];
    return (
      <Box display="flex" justifyContent="center">
        <Label text={intl.formatMessage(text)} {...other} variant="ghost" />
      </Box>
    );
  };
  function onEditBtnClick(data) {
    loadInfoWarning(data);
  }
  const nameRenderer = ({ data, value }) => (
    // eslint-disable-next-line jsx-a11y/anchor-is-valid
    <Link
      component="button"
      variant="body2"
      onClick={() => onEditBtnClick(data)}
    >
      {value}
    </Link>
  );
  const areaRenderer = ({ data }) => (
    <span>{getAreaString(data.device_res_dto)}</span>
  );

  const columns = [
    {
      dataField: 'device_res_dto.name',
      caption: intl.formatMessage(messages.column_deviceName),
      allowSorting: false,
      cssClass: 'valign-center',
    },
    {
      dataField: 'device_res_dto.type',
      caption: intl.formatMessage(messages.column_deviceType),
      allowSorting: false,
      cssClass: 'valign-center',
    },
    {
      dataField: 'type_value_str',
      caption: intl.formatMessage(messages.column_warningType),
      cellRender: nameRenderer,
      allowSorting: false,
      cssClass: 'valign-center',
    },
    {
      caption: intl.formatMessage({ id: 'app.column.area' }),
      cellRender: areaRenderer,
      allowSorting: false,
      cssClass: 'valign-center',
    },
    {
      dataField: 'atts',
      caption: intl.formatMessage({ id: 'app.column.date' }),
      dataType: 'date',
      allowSorting: false,
      format: 'HH:mm dd/MM/yyyy',
      cssClass: 'valign-center',
    },
    {
      dataField: 'status',
      cellRender: statusRenderer,
      caption: intl.formatMessage({ id: 'app.column.status' }),
      alignment: 'center',
    },
  ];
  // const DetailTemplate = ({ data }) => {
  //   const { description } = data.data;
  //   return (
  //     <Typography style={{ whiteSpace: 'normal' }}>{description}</Typography>
  //   );
  // };
  useEffect(() => {
    if (error) {
      showAlertError(getErrorMessage(error), intl);
    }
  }, [error]);
  function handlePageSize(e) {
    setPageSize(e.target.value);
    setPage(1);
  }
  const handlePropertyChange = e => {
    if (e.fullName.includes('sortOrder')) {
      if (e.value) {
        const direction = e.value == 'asc' ? '+' : '-';
        const key = columns[e.fullName.slice(8, -11)].dataField;
        setSort(direction + key);
      } else setSort(undefined);
    }
  };
  const onFilterBtnClick = ({ event }) => {
    setAnchorEl(event.currentTarget);
  };
  const onFilterPopoverClose = ret => {
    setAnchorEl(null);
    if (ret) {
      setFilterOp(ret);
      setPage(1);
    }
  };
  const popover = (
    <Dialog
      open={Boolean(anchorEl)}
      onClose={() => onFilterPopoverClose(0)}
      title="Lọc"
      maxWidth="xs"
      fullWidth
    >
      <FilterPopover initialState={filterOp} onSubmit={onFilterPopoverClose} />
    </Dialog>
  );
  const onDetailsDrawerClose = ret => {
    if (ret) {
      editWarning(ret);
    } else {
      setOpenDetailsDrawer(false);
    }
  };
  const detailsDrawer = selectedItem && (
    <Dialog
      open={openDetailsDrawer}
      onClose={() => onDetailsDrawerClose(0)}
      title=""
      maxWidth="xs"
      fullWidth
    >
      <Details data={selectedItem} onSubmit={onDetailsDrawerClose} />
    </Dialog>
  );
  const onSelectionChanged = ({ selectedRowKeys }) => {
    setSelectedRowKeys(selectedRowKeys);
  };
  const onChangeStatusBtnClick = () => {
    setOpenEditDialog(true);
  };
  const onEditDialogClose = ret => {
    if (ret) {
      editWarning({ ids: selectedRowKeys, ...ret });
    }
    setOpenEditDialog(false);
  };
  const editDialog = openEditDialog && (
    <Dialog
      open={openEditDialog}
      maxWidth="sm"
      fullWidth
      title={intl.formatMessage(messages.title_changeStatus, {
        length: selectedRowKeys.length,
      })}
    >
      <EditPopup onSubmit={onEditDialogClose} />
    </Dialog>
  );
  return (
    <Fragment>
      <Helmet>
        <title>{intl.formatMessage(messages.header)}</title>
        <meta name="description" content="Description of ListWarning" />
      </Helmet>
      {loading && <Loading />}
      {popover}
      {detailsDrawer}
      {editDialog}
      <PageHeader
        title={intl.formatMessage(messages.header)}
        showSearch
        showPager
        showFilter={Boolean(
          Object.values(filterOp).filter(v => !!v && String(v).length).length,
        )}
        onBack={() => {
          setFilterOp(DEFAULT_FILTER);
          setPage(1);
        }}
        totalCount={warningData.totalRow}
        pageIndex={page}
        rowsPerPage={pageSize}
        handleChangePageIndex={pageIndex => {
          setPage(pageIndex);
        }}
        handlePageSize={handlePageSize}
        onSearchValueChange={newVal => {
          setSearch(newVal);
          setPage(1);
        }}
      >
        <Tooltip title={intl.formatMessage(messages.tooltip_changeStatus)}>
          <Badge badgeContent={selectedRowKeys.length} color="primary">
            <IconButtonSquare
              icon="tags"
              onClick={onChangeStatusBtnClick}
              disabled={selectedRowKeys.length <= 1}
            />
          </Badge>
        </Tooltip>
        <Tooltip title={intl.formatMessage({ id: 'app.tooltip.filter' })}>
          <Badge
            badgeContent={
              Object.values(filterOp).filter(v => !!v && String(v).length)
                .length
            }
            color="primary"
          >
            <IconButtonSquare icon={IconFilter} onClick={onFilterBtnClick} />
          </Badge>
        </Tooltip>
      </PageHeader>
      <DataGrid
        className="center-row-grid"
        dataSource={warningData.data}
        keyExpr="id"
        noDataText={intl.formatMessage({ id: 'app.no_data' })}
        onOptionChanged={handlePropertyChange}
        style={{
          height: '100%',
          maxHeight: `calc(100vh - ${50 + 84 + 25}px)`,
          width: '100%',
          maxWidth: '100%',
        }}
        columnAutoWidth
        // onRowUpdating={onRowUpdating}
        showRowLines
        showColumnLines={false}
        onSelectionChanged={onSelectionChanged}
        selectedRowKeys={selectedRowKeys}
        rowAlternationEnabled
        sorting={{ mode: 'none' }}
      >
        <Paging enabled={false} />

        {/* <MasterDetail enabled component={DetailTemplate} /> */}
        <Selection mode="multiple" showCheckBoxesMode="always" />
        {/* <Editing
          mode="batch"
          allowUpdating
          changes={changes}
          onChangesChange={setChanges}
        /> */}
        {columns.map((defs, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <Column {...defs} key={index} allowEditing={false} />
        ))}
        {/* <Column
          dataField="status"
          cellRender={statusRenderer}
          caption="Trạng thái"
          alignment="center"
        >
          <Lookup
            valueExpr="id"
            displayExpr="label"
            dataSource={WARNING_STATUS}
          />
        </Column> */}
      </DataGrid>
    </Fragment>
  );
}

ListWarning.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  listWarning: makeSelectListWarning(),
  isExpanedMenu: makeSelectIsMenuExpanded(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    setPage: evt => {
      dispatch(setPageAction(evt));
    },
    setOpenDetailsDrawer: evt => {
      dispatch(setOpenDrawerAction(evt));
    },
    onloadListWarning: evt => {
      dispatch(loadListWarning(evt));
    },
    loadInfoWarning: evt => {
      dispatch(loadInfoWarningAction(evt));
    },
    editWarning: evt => {
      dispatch(editWarningAction(evt));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(ListWarning);
