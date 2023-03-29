/**
 *
 * Policy
 *
 */

import { Dialog, IconButton, Tooltip, Badge } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditOutlined from '@material-ui/icons/EditOutlined';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import GroupIcon from '@material-ui/icons/Group';
import DialogTitle from 'components/DialogTitle';
import Label from 'components/Label';
import Loading from 'containers/Loading/Loadable';
import { Column, DataGrid, Paging } from 'devextreme-react/data-grid';
import DropDownButton from 'devextreme-react/drop-down-button';

import AddIcon from 'images/icon-button/add.svg';
import React, { Fragment, memo, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import { showAlertConfirm } from 'utils/utils';
import { IconButtonSquare } from '../../components/CommonComponent';
import PageHeader from '../../components/PageHeader';
import { deletePolicy, getPolicyAction } from './actions';
import EditPolicy from './edit';
import messages from './messages';
import reducer from './reducer';
import saga from './saga';
import makeSelectPolicy from './selectors';

export function Policy({ getPolicy, deletePolicy, policy }) {
  useInjectReducer({ key: 'policy', reducer });
  useInjectSaga({ key: 'policy', saga });
  const { loading, needReload, listPolicy } = policy;
  const intl = useIntl();
  const [pageSize, setPageSize] = React.useState(25);
  const [pageIndex, setPageIndex] = React.useState(1);
  const [search, setSearch] = React.useState('');
  const [filter, setFilter] = useState('');
  const [editRow, setEditRow] = useState(null);
  const [titleEdit, setTitleEdit] = useState('');
  const [sort, setSort] = useState(undefined);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  useEffect(() => {
    fetchData();
  }, [search, filter, pageSize, pageIndex, needReload, sort]);
  const fetchData = () => {
    const query = buildQuery();
    getPolicy(query);
  };
  const buildQuery = () => {
    let query = '';
    query += `keyword=${encodeURIComponent(search)}`;
    query += `&statuses=${encodeURIComponent(filter)}`;
    query += `&limit=${pageSize}`;
    query += `&page=${pageIndex}`;
    if (sort) query += `&sort=${sort}`;
    return query;
  };

  // const renderCellType = item => (
  //   <div>
  //     <Switch
  //       checked={item.data.status === 'ACTIVE'}
  //       color="primary"
  //       onClick={() => {}}
  //     />
  //     {item.data.status === 'ACTIVE'
  //       ? intl.formatMessage(messages.filterActive)
  //       : intl.formatMessage(messages.filterUnActive)}
  //   </div>
  // );
  const statusRenderer = ({ value }) => {
    if (value == 'ACTIVE') {
      return (
        <Label
          variant="dot"
          text={intl.formatMessage({ id: 'app.status.active' })}
          color="green"
        />
      );
    }
    return (
      <Label
        variant="dot"
        text={intl.formatMessage({ id: 'app.status.un_active' })}
        color="red"
      />
    );
  };
  const onClickFilter = (v) => {
    setFilter(v);
    setPageIndex(1);
  };
  const renderActionCell = (item) => (
    <div className="center-content">
      <Tooltip title={intl.formatMessage({ id: 'app.tooltip.edit' })}>
        <IconButton
          color="primary"
          onClick={() => {
            setEditRow(item.data);
            setIsOpenEdit(true);
            setTitleEdit('edit');
          }}
        >
          <EditOutlined fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title={intl.formatMessage(messages.copyTitle)}>
        <IconButton
          color="primary"
          onClick={() => {
            showAlertConfirm({
              icon: 'question',
              title: intl.formatMessage(messages.copyTitle),
              text: intl.formatMessage(messages.copyConfirm),
            }).then((result) => {
              if (result.value) {
                setTitleEdit('copy');
                setEditRow(item.data);
                setIsOpenEdit(true);
              }
            });
          }}
        >
          <FileCopyIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Quản lý người dùng">
        <IconButton
          color="primary"
          component={Link}
          to={`/list-policy/${item.data.policyId}/users`}
        >
          <GroupIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip
        title={intl.formatMessage({
          id: 'app.tooltip.delete',
        })}
      >
        <IconButton color="primary" onClick={() => deleteRow(item.data)}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </div>
  );
  const renderOrderCell = (item) => (
    <div style={{ textAlign: 'center' }}>
      {(pageIndex - 1) * pageSize + (item.rowIndex + 1)}
    </div>
  );
  const columns = [
    {
      alignment: 'center',
      caption: 'STT',
      allowSorting: false,
      cellRender: renderOrderCell,
      cssClass: 'valign-center',
      width: 'auto',
    },
    {
      dataField: 'policyCode',
      caption: intl.formatMessage(messages.columnCodePolicy),
      cssClass: 'valign-center',
    },
    {
      dataField: 'policyName',
      caption: intl.formatMessage(messages.columnNamePolicy),
      cssClass: 'valign-center',
    },
    {
      dataField: 'description',
      caption: intl.formatMessage(messages.columnDescriptionPolicy),
      cssClass: 'valign-center',
    },
    {
      dataField: 'status',
      caption: intl.formatMessage(messages.columnStatusPolicy),
      cellRender: statusRenderer,
      cssClass: 'valign-center',
      width: 'auto',
    },
    {
      alignment: 'center',
      caption: intl.formatMessage(messages.columnCenterPolicy),
      allowSorting: false,
      cellRender: renderActionCell,
      width: 'auto',
    },
  ];
  const deleteRow = (items) => {
    showAlertConfirm(
      {
        title: intl.formatMessage(messages.deleteTitle),
        text: intl.formatMessage(messages.deleteConfirm),
      },
      intl,
    ).then((result) => {
      if (result.value) {
        deletePolicy(items.policyId);
      }
    });
  };

  const onBack = () => {
    setFilter('');
  };
  function handlePageSize(e) {
    setPageSize(e.target.value);
    setPageIndex(1);
  }
  const handlePropertyChange = (e) => {
    if (e.fullName.includes('sortOrder')) {
      if (e.value) {
        const direction = e.value == 'asc' ? '+' : '-';
        const key = columns[e.fullName.slice(8, -11)].dataField;
        setSort(direction + key);
      } else setSort(undefined);
    }
  };
  return (
    <>
      <Helmet>
        <title>{intl.formatMessage(messages.listTitle)}</title>
        <meta name="description" content="Description of Policy" />
      </Helmet>
      {loading && <Loading />}
      <PageHeader
        title={intl.formatMessage(messages.listTitle)}
        showFilter={Object.keys(filter).length > 0}
        showSearch
        showPager
        totalCount={listPolicy?.count}
        pageIndex={pageIndex}
        rowsPerPage={pageSize}
        handleChangePageIndex={(pageIndex) => {
          setPageIndex(pageIndex);
        }}
        handlePageSize={handlePageSize}
        onSearchValueChange={(newVal) => {
          setSearch(newVal);
          setPageIndex(1);
        }}
        onBack={onBack}
        placeholderSearch="Tìm kiếm theo tên hoặc mã vai trò"
      >
        <Tooltip title={intl.formatMessage({ id: 'app.tooltip.add' })}>
          <Badge color="primary">
            <IconButtonSquare
              icon={AddIcon}
              onClick={() => {
                setTitleEdit('new');
                setEditRow({ policyId: 'new' });
                setIsOpenEdit(true);
              }}
            />
          </Badge>
        </Tooltip>
        <DropDownButton
          icon="filter"
          displayExpr="label"
          keyExpr="key"
          dropDownOptions={{ width: 230 }}
          useSelectMode
          selectedItemKey={filter}
          items={[
            { label: intl.formatMessage(messages.filterAll), key: '' },
            {
              label: intl.formatMessage(messages.filterUnActive),
              key: 'INACTIVE',
            },
            {
              label: intl.formatMessage(messages.filterActive),
              key: 'ACTIVE',
            },
          ]}
          onSelectionChanged={(e) => onClickFilter(e.item.key)}
        />
      </PageHeader>
      <DataGrid
        className="center-row-grid"
        style={{
          height: '100%',
          maxHeight: `calc(100vh - ${50 + 84 + 25}px)`,
          width: '100%',
          maxWidth: '100%',
        }}
        onOptionChanged={handlePropertyChange}
        dataSource={listPolicy.rows || []}
        showColumnLines={false}
        showBorders={false}
        noDataText="Không có dữ liệu"
        showRowLines
        columnAutoWidth
        rowAlternationEnabled
        allowColumnResizing
        sorting={{ mode: 'none' }}
      >
        <Paging enabled={false} />
        {columns.map((defs, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <Column {...defs} key={index} />
        ))}
      </DataGrid>
      {isOpenEdit && (
        <Dialog open={isOpenEdit} fullWidth maxWidth="md">
          <DialogTitle onClose={() => setIsOpenEdit(false)}>
            {intl.formatMessage(
              titleEdit == 'edit' ? messages.titleEdit : messages.titleAdd,
            )}
          </DialogTitle>
          <EditPolicy
            editingRow={editRow}
            setIsOpenEdit={setIsOpenEdit}
            title={titleEdit}
          />
        </Dialog>
      )}
    </>
  );
}

const mapStateToProps = createStructuredSelector({
  policy: makeSelectPolicy(),
});

function mapDispatchToProps(dispatch) {
  return {
    getPolicy: (params) => dispatch(getPolicyAction(params)),
    deletePolicy: (rows) => dispatch(deletePolicy(rows)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect, memo)(Policy);
