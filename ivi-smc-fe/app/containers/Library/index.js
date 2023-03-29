/* eslint-disable jsx-a11y/anchor-is-valid */
/**
 *
 * Library
 *
 */
import {
  Badge,
  Box,
  IconButton,
  Tooltip,
  Typography,
  SvgIcon,
} from '@material-ui/core';
import SVG from 'react-inlinesvg';
import Dialog from 'components/Dialog';
// import { makeStyles } from '@material-ui/core/styles';
import DescriptionIcon from '@material-ui/icons/Description';
import ImageIcon from '@material-ui/icons/Image';
import VideocamIcon from '@material-ui/icons/Videocam';
// import clsx from 'clsx';
import { IconButtonSquare } from 'components/CommonComponent';
// import Carousel, { Modal, ModalGateway } from 'react-images';
import PageHeader from 'components/PageHeader';
import { IconDelete, IconFilter } from 'constant/ListIcons';
import { IconDownLoad } from 'components/Custom/Icon/ListIcon';
import { getErrorMessage } from 'containers/Common/function';
import Loading from 'containers/Loading/Loadable';
import { endOfDay, startOfDay } from 'date-fns';
import DataGrid, {
  Column,
  Paging,
  Selection,
} from 'devextreme-react/data-grid';
// import DropDownButton from 'devextreme-react/drop-down-button';
import filesize from 'filesize';

import PropTypes from 'prop-types';
import React, { Fragment, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import { showAlertConfirm, showAlertError } from 'utils/utils';
import { makeSelectIsMenuExpanded } from '../Menu/selectors';
import {
  deleteFileAction,
  downloadFileAction,
  loadListFile,
  setPageAction,
} from './actions';
import { DEFAULT_FILTER } from './constants';
// import FileMng from './FileMng';
// import MediaView from './mediaView';
import FilterPopover from './filterpopover';
import messages from './messages';
import reducer from './reducer';
import saga from './saga';
import makeSelectLibrary from './selectors';

// const useStyles = makeStyles(theme => ({
//   margin: {
//     marginRight: theme.spacing(1),
//   },
//   input: {
//     padding: '7px 8px 7px 0px',
//   },
//   iconSmall: {
//     fontSize: '20px',
//     verticalAlign: 'middle',
//   },
// }));

const getIcon = name => {
  const props = {
    // style: { fontSize: 18 },
    color: 'action',
  };
  let icon = <DescriptionIcon {...props} />;
  if (/\.(gif|jpe?g|tiff?|png|webp|bmp)$/i.test(name)) {
    icon = <ImageIcon {...props} />;
  } else if (
    /\.(mp4|mkv|wmv|m4v|mov|avi|flv|webm|flac|mka|m4a|aac|ogg)$/i.test(name)
  ) {
    icon = <VideocamIcon {...props} />;
  }
  return icon;
};
export function Library({
  library,
  // isExpanedMenu,
  onLoadListFile,
  deleteFile,
  downloadFile,
  setPage,
}) {
  // const classes = useStyles();
  const intl = useIntl();
  const { loading, error, page, needReload, fileData } = library;
  useInjectReducer({ key: 'library', reducer });
  useInjectSaga({ key: 'library', saga });
  const [pageSize, setPageSize] = useState(25);
  const [sort, setSort] = useState(undefined);
  const [search, setSearch] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [filterOp, setFilterOp] = useState(DEFAULT_FILTER);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  // const [viewType, setViewType] = useState(1);
  // const [currentIndex, setCurrentIndex] = useState(null);
  // const [openViewModal, setOpenViewModal] = useState(false);
  function loadData() {
    const query = {
      keyword: search,
      pageSize,
      index: page,
      sortBy: sort,
      type: filterOp.type?.id,
      fromDate: filterOp.fromDate
        ? startOfDay(filterOp.fromDate).getTime()
        : undefined,
      toDate: filterOp.toDate ? endOfDay(filterOp.toDate).getTime() : undefined,
    };
    onLoadListFile(query);
  }
  useEffect(() => {
    loadData();
    setSelectedRowKeys([]);
  }, [pageSize, page, sort, search, needReload, filterOp]);
  // const onItemClick = (index, data) => {
  // setOpenViewModal(true);
  // setCurrentIndex(index);
  // downloadFile(data);
  // };
  const nameRenderer = ({ value }) => (
    <Box display="flex" alignItems="center">
      {getIcon(value)}
      {/* <Link
        component="button"
        variant="body2"
        onClick={() => {
          // if (row.isSelected) {
          //   component.deselectRows([key]);
          // } else component.selectRows([key]);
          onItemClick(rowIndex, data);
        }}
      > */}
      <span style={{ marginLeft: '5px' }}>{value}</span>
      {/* </Link> */}
    </Box>
  );
  const sizeRenderer = ({ value }) => (
    <Typography variant="body2" component="p">
      {filesize(value)}
    </Typography>
  );
  const actionRenderer = ({ data }) => (
    <Fragment>
      <Tooltip title={intl.formatMessage(messages.tooltip_download)}>
        <IconButton onClick={() => onDownloadBtnClick(data)} color="primary">
          <SvgIcon component={IconDownLoad} />
        </IconButton>
      </Tooltip>
      <Tooltip title={intl.formatMessage({ id: 'app.tooltip.delete' })}>
        <IconButton onClick={() => onDeleteBtnClick(data)}>
          <SVG src={IconDelete} />
        </IconButton>
      </Tooltip>
    </Fragment>
  );
  const columns = [
    {
      dataField: 'name',
      caption: intl.formatMessage({ id: 'app.column.name' }),
      cellRender: nameRenderer,
      cssClass: 'valign-center',
    },
    {
      dataField: 'atts',
      caption: intl.formatMessage({ id: 'app.column.date' }),
      dataType: 'datetime',
      allowSorting: true,
      format: 'dd/MM/yyyy HH:mm',
      cssClass: 'valign-center',
    },
    {
      dataField: 'type',
      caption: intl.formatMessage(messages.column_format),
      cssClass: 'valign-center',
    },
    {
      dataField: 'size',
      caption: intl.formatMessage(messages.column_size),
      cellRender: sizeRenderer,
      alignment: 'left',
      cssClass: 'valign-center',
    },
    {
      caption: intl.formatMessage({ id: 'app.column.action' }),
      cellRender: actionRenderer,
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
  const onSelectionChanged = ({ selectedRowKeys }) => {
    setSelectedRowKeys(selectedRowKeys);
  };
  const onDeleteBtnClick = data => {
    showAlertConfirm(
      {
        text: intl.formatMessage(messages.text_delete, {
          name: (data || {}).name,
          length: data ? 0 : selectedRowKeys.length,
        }),
        title: intl.formatMessage(messages.title_delete),
      },
      intl,
    ).then(result => {
      if (result.value) {
        deleteFile(data ? [data.id] : selectedRowKeys);
      }
    });
  };
  const onDownloadBtnClick = data => {
    downloadFile(data);
  };
  // const formatImageData = data =>
  //   data.map(item => ({
  //     caption: item.name,
  //     source: item.source,
  //     type: item.type,
  //   }));
  // const viewModal = openViewModal && (
  //   <ModalGateway>
  //     <Modal onClose={() => setOpenViewModal(false)}>
  //       <Carousel
  //         components={{
  //           View: MediaView,
  //         }}
  //         views={formatImageData(fileData.data)}
  //         currentIndex={currentIndex}
  //       />
  //     </Modal>
  //   </ModalGateway>
  // );
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
        <meta name="description" content="Description of Library" />
      </Helmet>
      {loading && <Loading />}
      {/* {viewModal} */}
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
        totalCount={fileData.totalRow}
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
        <Tooltip title={intl.formatMessage({ id: 'app.tooltip.delete' })}>
          <Badge badgeContent={selectedRowKeys.length} color="primary">
            <IconButtonSquare
              icon={IconDelete}
              onClick={() => onDeleteBtnClick()}
              disabled={selectedRowKeys.length <= 0}
            />
          </Badge>
        </Tooltip>
      </PageHeader>
      {/* {viewType == 1 ? ( */}
      <DataGrid
        className="center-row-grid"
        dataSource={fileData.data}
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
        onSelectionChanged={onSelectionChanged}
        selectedRowKeys={selectedRowKeys}
        rowAlternationEnabled
        sorting={{ mode: 'none' }}
      >
        <Paging enabled={false} />
        <Selection mode="multiple" showCheckBoxesMode="always" />
        {columns.map((defs, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <Column {...defs} key={index} />
        ))}
      </DataGrid>
      {/* ) : (
        <FileMng
          dataSource={fileData.data}
          keyExpr="id"
          noDataText={intl.formatMessage({ id: 'app.no_data' })}
          onSelectionChanged={onSelectionChanged}
          selectedRowKeys={selectedRowKeys}
          onItemClick={onItemClick}
        />
      )} */}
    </Fragment>
  );
}

Library.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  library: makeSelectLibrary(),
  isExpanedMenu: makeSelectIsMenuExpanded(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    setPage: evt => {
      dispatch(setPageAction(evt));
    },
    onLoadListFile: evt => {
      dispatch(loadListFile(evt));
    },
    deleteFile: evt => {
      dispatch(deleteFileAction(evt));
    },
    downloadFile: evt => {
      dispatch(downloadFileAction(evt));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(Library);
