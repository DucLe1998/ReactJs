/**
 *
 * ListCamera
 *
 */

import { Badge, Box, Tooltip, IconButton } from '@material-ui/core';
import { IconButtonSquare } from 'components/CommonComponent';
import EditIcon from '@material-ui/icons/EditOutlined';
import Label from 'components/Label';
import Dialog from 'components/Dialog';
import PageHeader from 'components/PageHeader';
import { IconFilter } from 'constant/ListIcons';
import { getErrorMessage } from 'containers/Common/function';
import Loading from 'containers/Loading/Loadable';
import DataGrid, { Column, Paging } from 'devextreme-react/data-grid';
import PropTypes from 'prop-types';
import React, { Fragment, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { getAreaString, getAreaObjectFromTree } from 'utils/functions';
import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import { showAlertError } from 'utils/utils';
import { makeSelectIsMenuExpanded } from '../Menu/selectors';
import { loadListCamera, setOpenDrawerAction, setPageAction } from './actions';
import { DEFAULT_FILTER, LIST_STATUS } from './constants';
import FilterPopover from './filterpopover';
import messages from './messages';
import reducer from './reducer';
import saga from './saga';
import makeSelectListCamera from './selectors';
const LIST_STATUS_MAP = LIST_STATUS.reduce(
  (total, cur) => ({ ...total, [cur.id]: cur }),
  {},
);
export function ListCamera({
  listCamera,
  onLoadListCamera,
  // isExpanedMenu,
  setPage,
}) {
  const { loading, error, cameraData, page, needReload } = listCamera;
  useInjectReducer({ key: 'listCamera', reducer });
  useInjectSaga({ key: 'listCamera', saga });
  const intl = useIntl();
  const [pageSize, setPageSize] = useState(25);
  const [sort, setSort] = useState(undefined);
  const [search, setSearch] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [filterOp, setFilterOp] = useState(DEFAULT_FILTER);
  function loadData() {
    const query = {
      type: 'CAMERA',
      keyword: search,
      pageSize,
      index: page,
      sortBy: sort,
      statusOfDevice: filterOp?.statusOfDevice?.id,
      parentId: filterOp?.parent?.id,
    };
    if (filterOp.area) {
      Object.assign(query, getAreaObjectFromTree(filterOp.area));
    }
    onLoadListCamera(query);
  }
  useEffect(() => {
    loadData();
  }, [pageSize, page, sort, search, filterOp, needReload]);
  // const nameRenderer = ({ data, value }) => (
  //   <Link
  //     component={RouterLink}
  //     variant="body2"
  //     to={`/list-camera/details/${data.id}`}
  //   >
  //     {value}
  //   </Link>
  // );
  const statusRenderer = ({ value }) => (
    <Box display="flex" justifyContent="center">
      <Label {...LIST_STATUS_MAP[value]} variant="dot" />
    </Box>
  );
  const areaRenderer = ({ data }) => <span>{getAreaString(data)}</span>;
  const actionRenderer = ({ data }) => (
    <Fragment>
      <Tooltip title={intl.formatMessage({ id: 'app.tooltip.edit' })}>
        <IconButton
          color="primary"
          component={Link}
          to={`/list-camera/details/${data.id}`}
        >
          <EditIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Fragment>
  );
  const columns = [
    {
      dataField: 'name',
      caption: intl.formatMessage({ id: 'app.column.name' }),
      // cellRender: nameRenderer,
      allowSorting: false,
    },
    { dataField: 'parent.name', caption: 'NVR', allowSorting: false },
    {
      caption: intl.formatMessage({ id: 'app.column.area' }),
      allowSorting: false,
      cellRender: areaRenderer,
    },
    {
      dataField: 'information.sourceInputPortDescriptor.ipAddress',
      caption: 'IP',
      allowSorting: false,
    },
    {
      dataField: 'status_of_device',
      cellRender: statusRenderer,
      caption: intl.formatMessage({ id: 'app.column.status' }),
      alignment: 'center',
    },
    {
      caption: intl.formatMessage({ id: 'app.column.action' }),
      cellRender: actionRenderer,
      width: 'auto',
      alignment: 'center',
    },
  ];
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
  return (
    <Fragment>
      <Helmet>
        <title>{intl.formatMessage(messages.header)}</title>
        <meta name="description" content="Description of ListCamera" />
      </Helmet>
      {loading && <Loading />}
      {popover}
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
        totalCount={cameraData.totalRow}
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
        dataSource={cameraData.data}
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
        showRowLines
        showColumnLines={false}
        rowAlternationEnabled
        // sorting={{ mode: 'none' }}
      >
        <Paging enabled={false} />

        {columns.map((defs, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <Column {...defs} key={index} />
        ))}
      </DataGrid>
    </Fragment>
  );
}

ListCamera.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  listCamera: makeSelectListCamera(),
  isExpanedMenu: makeSelectIsMenuExpanded(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    setOpenDetailsDrawer: evt => {
      dispatch(setOpenDrawerAction(evt));
    },
    setPage: evt => {
      dispatch(setPageAction(evt));
    },
    onLoadListCamera: evt => {
      dispatch(loadListCamera(evt));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(ListCamera);
