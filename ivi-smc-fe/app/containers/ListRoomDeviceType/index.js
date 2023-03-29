/* eslint-disable react/prop-types,no-param-reassign,no-unused-expressions,no-dupe-keys */
import { Badge, Tooltip } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import PageHeader from 'components/PageHeader';
import { API_BOOKING } from 'containers/apiUrl';
import Loading from 'containers/Loading/Loadable';
import { Popup } from 'devextreme-react';
import DataGrid, {
  Column,
  HeaderFilter,
  Paging,
  Sorting,
} from 'devextreme-react/data-grid';
import AddIcon from 'images/icon-button/add.svg';
import DeleteIcon from 'images/icon-button/delete.svg';
import EditIcon from 'images/icon-button/ic_edit.svg';
import _ from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import SVG from 'react-inlinesvg';
import { useIntl } from 'react-intl';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import { callApi, getApi } from 'utils/requestUtils';
import { showError, showSuccess } from 'utils/toast-utils';
import { showAlertConfirm } from 'utils/utils';
import { IconButtonSquare } from '../../components/CommonComponent';
import reducerCommon from '../Common/reducer';
import sagaCommon from '../Common/sagaCommon';
import { makeSelectIsMenuExpanded } from '../Menu/selectors';
import { loadData } from './actions';
import AddData from './add';
import EditData from './edit';
import reducer from './reducer';
import saga from './saga';
import { makeSelectListData, makeSelectLoading } from './selectors';
const key = 'roomDeviceType';
const initParams = {
  keyword: '',
  limit: 25,
  page: 1,
};
//----------------------------------------------------------------
export function ListRoomDeviceType() {
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });
  useInjectReducer({ key: 'common', reducer: reducerCommon });
  useInjectSaga({ key: 'common', saga: sagaCommon });
  const intl = useIntl();
  const dataGridRef = useRef({});
  const [totalCount, setTotalCount] = useState(0);
  const [filter, setFilter] = useState(initParams);
  const [reload, setReload] = useState(0);
  const [isOpenAddNew, setIsOpenAddNew] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [edittingItem, setEdittingItem] = useState(null);

  const [loading, setLoading] = useState(false);
  const [listData, setListData] = useState({
    rows: [],
    count: 0,
    totalPage: 0,
  });

  const handleChangePageIndex = pageIndex => {
    if (dataGridRef && dataGridRef.current) {
      dataGridRef.current.instance.pageIndex(pageIndex);
    }
    setFilter({ ...filter, page: pageIndex });
    setReload(reload + 1);
  };
  const handlePageSize = e => {
    const { value } = e.target;
    if (dataGridRef && dataGridRef.current) {
      dataGridRef.current.instance.pageSize(value);
    }
    // setPageSize(value);
    setFilter({ ...filter, limit: value, page: 1 });
    setReload(reload + 1);
  };
  const renderOrderCell = item => (
    <div style={{ textAlign: 'right' }}>
      {(filter.page - 1) * filter.limit + item.rowIndex + 1}
    </div>
  );
  const handleOptionChange = () => {
    // if (e.fullName === 'searchPanel.text' || e.name === 'columns') {
    //   setPageIndex(e.component.pageIndex());
    //   setPageSize(e.component.pageSize());
    //   setTimeout(() => {
    //     setTotalCount(e.component.totalCount());
    //   }, 500);
    // }
    // if (e.fullName === 'paging.pageSize') {
    //   setPageSize(e.value);
    // }
    // if (e.fullName === 'paging.pageIndex') {
    //   setPageIndex(e.value);
    // }
  };

  const handleContentReady = e => {
    if (e.component.shouldSkipNextReady) {
      e.component.shouldSkipNextReady = false;
    } else {
      e.component.shouldSkipNextReady = true;
      // e.component.columnOption('command:select', 'visibleIndex', 99);
      e.component.updateDimensions();
    }
  };
  const renderActionCell = item => (
    <div className="center-content">
      <IconButton
        title={intl.formatMessage({
          id: 'app.button.edit',
        })}
        color="primary"
        style={{ padding: '10px' }}
        // eslint-disable-next-line no-console
        onClick={() => {
          setEdittingItem(item.data);
          setIsOpenEdit(true);
        }}
      >
        <SVG src={EditIcon} />
      </IconButton>
      <IconButton
        title={intl.formatMessage({
          id: 'app.button.delete',
        })}
        color="primary"
        style={{ padding: '10px' }}
        // eslint-disable-next-line no-console
        onClick={() => deleteRows(item.data)}
      >
        <SVG src={DeleteIcon} />
      </IconButton>
    </div>
  );

  const renderActionHeader = () => (
    <div style={{ textAlign: 'center', marginLeft: '25px' }}>
      {' '}
      {intl.formatMessage({
        id: 'app.column.action',
      })}{' '}
    </div>
  );
  const deleteRows = item => {
    showAlertConfirm({
      title: 'Xóa nhóm thiết bị',
      html: intl.formatMessage(
        {
          id: 'app.ROOM_DEVICE_TYPE.message.delete.confirm',
        },
        {
          name: `"${item.name}"`,
        },
      ),
    }).then(result => {
      if (result.value) {
        // gọi hàm xóa
        callApi(`${API_BOOKING.DEVICE_TYPE_API}/${item.id}`, 'delete')
          .then(() => {
            showSuccess('Xóa nhóm thiết bị thành công');
            fetchData();
          })
          .catch(err => {
            showError(err);
          });
        // setSelectedRows([]);
      }
    });
  };
  const fetchData = () => {
    const params = {
      ...filter,
      doorState: filter?.doorState?.id,
      doorStatus: filter?.doorStatus?.id,
      lockState: filter?.lockState?.id,
    };
    setLoading(true);
    getApi(API_BOOKING.DEVICE_TYPE_API, _.pickBy(params))
      .then(res => setListData(res?.data))
      .catch(err => {
        showError(err);
      })
      .finally(() => {
        setLoading(false);
      });
    // onLoadData(_.pickBy(params));
  };

  useEffect(() => {
    fetchData();
  }, [reload]);

  useEffect(() => {
    setTotalCount(listData.count);
    // setTotalPage(listData.totalPage);

    if (dataGridRef && dataGridRef.current) {
      dataGridRef.current.instance.clearSorting();
    }
  }, [listData]);

  return (
    <React.Fragment>
      <Helmet>
        <title>
          {intl.formatMessage({
            id: 'app.ROOM_DEVICE_TYPE.header.title',
          })}
        </title>
        <meta name="description" content="Smart city" />
      </Helmet>
      <PageHeader
        title={intl.formatMessage({
          id: 'app.ROOM_DEVICE_TYPE.header.title',
        })}
        showSearch
        showPager
        pageIndex={filter.page}
        totalCount={totalCount}
        rowsPerPage={filter.limit}
        searchPlaceholderId="app.ROOM_DEVICE_TYPE.label.search_placeholder"
        handlePageSize={handlePageSize}
        handleChangePageIndex={handleChangePageIndex}
        onSearchValueChange={value => {
          // setSearchValue(value);
          setFilter({ ...filter, keyword: value, page: 1 });
          setReload(reload + 1);
        }}
      >
        <Tooltip title={intl.formatMessage({ id: 'app.tooltip.add' })}>
          <Badge color="primary">
            <IconButtonSquare
              icon={AddIcon}
              onClick={() => {
                setIsOpenAddNew(true);
              }}
            />
          </Badge>
        </Tooltip>
      </PageHeader>
      {loading && <Loading />}
      <div>
        <DataGrid
          className="center-row-grid"
          ref={dataGridRef}
          dataSource={listData.rows}
          noDataText={intl.formatMessage({
            id: 'app.no_data',
          })}
          onOptionChanged={handleOptionChange}
          onContentReady={handleContentReady}
          columnAutoWidth
          allowColumnResizing
          showColumnLines={false}
          rowAlternationEnabled
          showBorders={false}
          height="calc(100vh - 200px)"
        >
          <HeaderFilter visible />
          <Paging enabled={false} />
          <Sorting mode="none" />
          <Column
            dataField="order"
            caption={intl.formatMessage({
              id: 'app.column.order',
            })}
            allowSorting={false}
            width="auto"
            cellRender={renderOrderCell}
            allowHeaderFiltering={false}
          />
          <Column
            dataField="name"
            caption={intl.formatMessage({
              id: 'app.ROOM_DEVICE_TYPE.column.name',
            })}
            allowSearch
            allowHeaderFiltering={false}
          />
          <Column
            dataField="code"
            caption={intl.formatMessage({
              id: 'app.ROOM_DEVICE_TYPE.column.code',
            })}
            allowSearch
            allowHeaderFiltering={false}
          />
          <Column
            className="center-header"
            caption={intl.formatMessage({
              id: 'app.column.action',
            })}
            allowSorting={false}
            cellRender={renderActionCell}
            headerCellRender={renderActionHeader}
            width={180}
          />
        </DataGrid>
      </div>
      {isOpenAddNew && (
        <Popup
          className="popup"
          visible
          title={intl.formatMessage({
            id: 'app.ROOM_DEVICE_TYPE.add_new',
          })}
          showTitle
          onHidden={() => {
            setIsOpenAddNew(false);
          }}
          dragEnabled={false}
          width="600"
          height="250"
        >
          <AddData
            onClose={needReload => {
              setIsOpenAddNew(false);
              if (needReload) {
                fetchData();
              }
            }}
          />
        </Popup>
      )}
      {isOpenEdit && (
        <Popup
          className="popup"
          visible
          title={intl.formatMessage({
            id: 'app.ROOM_DEVICE_TYPE.edit',
          })}
          showTitle
          onHidden={() => {
            setIsOpenEdit(false);
          }}
          dragEnabled={false}
          width="600"
          height="300"
        >
          <EditData
            edittingItem={edittingItem}
            onClose={needReload => {
              setIsOpenEdit(false);
              if (needReload) {
                fetchData();
              }
            }}
          />
        </Popup>
      )}
    </React.Fragment>
  );
}

ListRoomDeviceType.propTypes = {
  // loading: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({
  listData: makeSelectListData(),
  isMenuExpanded: makeSelectIsMenuExpanded(),
  loading: makeSelectLoading(),
});

export function mapDispatchToProps(dispatch) {
  return {
    onLoadData: evt => {
      dispatch(loadData(evt));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(ListRoomDeviceType);
