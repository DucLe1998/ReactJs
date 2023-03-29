/* eslint-disable react/prop-types,no-param-reassign,no-unused-expressions,no-dupe-keys */
import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import IconButton from '@material-ui/core/IconButton';
import Loading from 'containers/Loading/Loadable';
import DataGrid, {
  Column,
  Paging,
  Selection,
  HeaderFilter,
  Sorting,
} from 'devextreme-react/data-grid';

import PageHeader from 'components/PageHeader';
import { IconButtonSquare } from 'components/CommonComponent';
import AddIcon from 'images/icon-button/add.svg';
import DeleteIcon from 'images/icon-button/delete.svg';
import EditIcon from 'images/icon-button/ic_edit.svg';
import ChangePass from 'images/icon-button/changepassword.svg';
import SVG from 'react-inlinesvg';
import Swal from 'sweetalert2';
import { Popup } from 'devextreme-react/popup';
import { useIntl } from 'react-intl';
import { getAreaString } from 'utils/functions';
import { useHistory } from 'react-router-dom';
import FilterIcon from 'images/icon-button/filter.svg';
import { Button } from 'devextreme-react/button';
import { Badge, Tooltip } from '@material-ui/core';
import { loadData, showLoading, deleteRows } from './actions';
import { makeSelectIsMenuExpanded } from '../Menu/selectors';
import { makeSelectListData, makeSelectLoading } from './selectors';
import reducer from './reducer';
import saga from './saga';
import sagaCommon from '../Common/sagaCommon';
import reducerCommon from '../Common/reducer';
import { makeSelectListNVRStatus } from '../Common/selectors';
import EditNVR from './edit';
import AddNVR from './add';
import DetailNVR from './detail';
import ChangePassword from './changePassword';
import Filter from './filter';
const key = 'nvr';
//----------------------------------------------------------------
export function ListNVR({
  loading,
  listNVR,
  error,
  onLoadData,
  onDeleteRows,
  listNVRStatus,
}) {
  const history = useHistory();
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });
  useInjectReducer({ key: 'common', reducer: reducerCommon });
  useInjectSaga({ key: 'common', saga: sagaCommon });
  const intl = useIntl();
  const dataGridRef = useRef({});
  const [pageSize, setPageSize] = useState(25);
  const [pageIndex, setPageIndex] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [totalPage, setTotalPage] = useState(0);
  const [isDisabled] = useState(false);
  const [searchValue, setSearchValue] = useState();
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);
  const [editingRow, setEditingRow] = useState(null);
  const [isOpenAddNew, setIsOpenAddNew] = useState(false);
  const [isOpenDetail, setIsOpenDetail] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [isOpenChangePassword, setIsOpenChangePassword] = useState(false);
  const [isOpenFilter, setIsOpenFilter] = useState(false);
  const defaultFilter = {
    status: [],
  };
  const [filterData, setFilterData] = useState(defaultFilter);
  const handleChangePageIndex = pageIndex => {
    if (dataGridRef && dataGridRef.current) {
      dataGridRef.current.instance.pageIndex(pageIndex);
    }
    setPageIndex(pageIndex);
  };
  const handlePageSize = e => {
    const { value } = e.target;
    if (dataGridRef && dataGridRef.current) {
      dataGridRef.current.instance.pageSize(value);
    }
    setPageSize(value);
    setPageIndex(1);
  };
  const renderOrderCell = item => (
    <div style={{ textAlign: 'right' }}>
      {(pageIndex - 1) * pageSize + item.rowIndex + 1}
    </div>
  );
  const renderName = item => (
    <Button
      tabIndex={0}
      className="no-border-button link-style"
      text={item.data.name}
      onClick={() => {
        history.push(`/list-nvr/detail?id=${item.data.id}`);
      }}
    />
  );
  const renderArea = ({ data }) => <div>{getAreaString(data)}</div>;
  const renderStatusCell = item => {
    if (['OFFLINE', 'INACTIVE'].includes(item.status))
      return (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            color: 'var(--disabled-level-color)',
          }}
        >
          <span style={{ width: '100%' }}>
            {intl.formatMessage({
              id: 'app.status.disabled',
            })}
          </span>
        </div>
      );
    return (
      <div style={{ display: 'flex', color: '#4C96FD' }}>
        <span style={{ width: '100%' }}>
          {intl.formatMessage({
            id: 'app.status.enabled',
          })}
        </span>
      </div>
    );
  };
  const renderActionCell = item => (
    <div className="center-content">
      <IconButton
        disabled={isDisabled}
        title={intl.formatMessage({
          id: 'app.NVR.button.edit.tooltip',
        })}
        color="primary"
        style={{ padding: '10px' }}
        // eslint-disable-next-line no-console
        onClick={() => {
          // setEditingRow(item.data);
          // setIsOpenDetail(true);
          history.push(`/list-nvr/detail?id=${item.data.id}`);
        }}
      >
        <SVG src={EditIcon} />
      </IconButton>
      <IconButton
        title={intl.formatMessage({
          id: 'app.NVR.button.change_pasword.tooltip',
        })}
        color="primary"
        style={{ padding: '10px' }}
        // eslint-disable-next-line no-console
        onClick={() => {
          setEditingRow(item.data);
          setIsOpenChangePassword(true);
        }}
      >
        <SVG src={ChangePass} />
      </IconButton>
      <IconButton
        disabled={isDisabled}
        title={intl.formatMessage({
          id: 'app.NVR.button.delete.tooltip',
        })}
        color="primary"
        style={{ padding: '10px' }}
        // eslint-disable-next-line no-console
        onClick={() => deleteRows([item.data])}
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

  const handleContentReady = () => {
    // if (e.component.shouldSkipNextReady) {
    //   e.component.shouldSkipNextReady = false;
    // } else {
    //   e.component.shouldSkipNextReady = true;
    //   // e.component.columnOption('command:select', 'visibleIndex', 99);
    //   e.component.updateDimensions();
    // }
  };
  const handleSelectionChange = e => {
    setSelectedRows(e.selectedRowsData);
  };
  const deleteRows = items => {
    Swal.fire({
      title: intl.formatMessage({
        id: 'app.NVR.header.title',
      }),
      html: intl.formatMessage(
        {
          id: 'app.NVR.message.delete.confirm',
        },
        {
          name: `<b> ${items.length}</b>`,
        },
      ),

      imageWidth: 213,
      showCancelButton: true,
      showCloseButton: true,
      showConfirmButton: true,
      focusCancel: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: intl.formatMessage({
        id: 'app.button.OK',
      }),
      cancelButtonText: intl.formatMessage({
        id: 'app.button.cancel',
      }),
      customClass: {
        content: 'content-class',
      },
    }).then(result => {
      if (result.value) {
        // gọi hàm xóa
        onDeleteRows(items.map(el => el.id));
        // setSelectedRows([]);
      }
    });
  };
  const buildQuery = () => {
    let query = '?type=NVR';
    if (searchValue) {
      query += `&keyword=${encodeURIComponent(searchValue)}`;
    }
    if (filterData.status && filterData.status.length < 2) {
      filterData.status.forEach(item => {
        query += `&status=${encodeURIComponent(item.code)}`;
      });
    }
    query += `&index=${pageIndex}`;
    query += `&pageSize=${pageSize}`;
    return query;
  };
  const loadDataAPI = () => {
    const query = buildQuery();
    onLoadData(query);
  };
  useEffect(() => {
    setTotalCount(listNVR.totalRow);
    setTotalPage(listNVR.totalPage);
    if (dataGridRef && dataGridRef.current) {
      dataGridRef.current.instance.clearSorting();
    }
  }, [listNVR]);
  useEffect(() => {
    if (!isFirstLoad) {
      if (pageIndex > 1) setPageIndex(1);
      else loadDataAPI();
    }
  }, [searchValue, filterData]);

  useEffect(() => {
    loadDataAPI();
  }, [pageIndex, pageSize, listNVR.reloadData]);
  useEffect(() => {
    setIsFirstLoad(false);
  }, []);
  if (error) {
    Swal.fire({
      title: intl.formatMessage({
        id: 'app.error.title',
      }),
      text: error,
      icon: 'info',
      imageWidth: 213,
      dangerMode: true,
      showCancelButton: false,
      showCloseButton: true,
      showConfirmButton: true,
      focusConfirm: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: intl.formatMessage({
        id: 'app.button.OK',
      }),
      cancelButtonText: intl.formatMessage({
        id: 'app.button.cancel',
      }),
      customClass: {
        content: 'content-class',
      },
    });
  }
  return (
    <React.Fragment>
      <div style={{ display: editingRow && isOpenDetail ? 'none' : 'block' }}>
        <Helmet>
          <title>
            {intl.formatMessage({
              id: 'app.NVR.header.title',
            })}
          </title>
          <meta name="description" content="Smart city" />
        </Helmet>
        <PageHeader
          title={intl.formatMessage({
            id: 'app.NVR.header.title',
          })}
          showSearch
          showPager
          showFilter={filterData.status.length > 0}
          onBack={() => {
            setFilterData(defaultFilter);
          }}
          pageIndex={pageIndex}
          totalCount={totalCount}
          rowsPerPage={pageSize}
          handlePageSize={handlePageSize}
          handleChangePageIndex={handleChangePageIndex}
          onSearchValueChange={value => {
            setSearchValue(value);
          }}
        >
          {/* <SelectBox
          items={listNVRStatus}
          placeholder={intl.formatMessage({
            id: 'app.NVR.column.status',
          })}
          width="200px"
          searchEnabled
          displayExpr={item => item && intl.formatMessage({ id: item.name })}
          valueExpr="id"
          showClearButton
          onValueChanged={e => {
            setStatus(e.value);
          }}
        /> */}
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
          <Tooltip title={intl.formatMessage({ id: 'app.tooltip.filter' })}>
            <Badge color="primary">
              <IconButtonSquare
                icon={FilterIcon}
                onClick={() => {
                  setIsOpenFilter(true);
                }}
              />
            </Badge>
          </Tooltip>
          <Tooltip title={intl.formatMessage({ id: 'app.tooltip.delete' })}>
            <Badge color="primary">
              <IconButtonSquare
                icon={DeleteIcon}
                disabled={selectedRows.length === 0}
                onClick={() => {
                  deleteRows(selectedRows, true);
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
            dataSource={listNVR.data}
            noDataText={intl.formatMessage({
              id: 'app.no_data',
            })}
            onOptionChanged={handleOptionChange}
            onContentReady={handleContentReady}
            onSelectionChanged={handleSelectionChange}
            columnAutoWidth
            allowColumnResizing={false}
            showColumnLines={false}
            rowAlternationEnabled
            showBorders={false}
            height="calc(100vh - 200px)"
          >
            {
              <Selection
                mode="multiple"
                selectAllMode="page"
                showCheckBoxesMode="always"
              />
            }
            <HeaderFilter visible />
            <Sorting mode="none" />
            <Paging enabled={false} />
            <Column
              dataField="order"
              caption={intl.formatMessage({
                id: 'app.NVR.column.order',
              })}
              allowSorting={false}
              width="auto"
              cellRender={renderOrderCell}
              allowHeaderFiltering={false}
            />
            <Column
              dataField="name"
              caption={intl.formatMessage({
                id: 'app.NVR.column.name',
              })}
              allowSearch
              cellRender={renderName}
              allowHeaderFiltering={false}
            />
            <Column
              dataField="status"
              caption={intl.formatMessage({
                id: 'app.NVR.column.status',
              })}
              cellRender={e => renderStatusCell(e.data)}
              allowSearch
              width={130}
              alignment="center"
              allowHeaderFiltering={false}
            />
            <Column
              dataField="information.ip"
              caption={intl.formatMessage({
                id: 'app.NVR.column.IP',
              })}
              allowSearch
              allowHeaderFiltering={false}
              width="150px"
            />
            <Column
              dataField="information.port"
              caption={intl.formatMessage({
                id: 'app.NVR.column.port',
              })}
              allowSearch
              width={150}
              allowHeaderFiltering={false}
            />
            <Column
              dataField="information.serialNumber"
              caption={intl.formatMessage({
                id: 'app.NVR.column.serial',
              })}
              allowSearch
              width={200}
              allowHeaderFiltering={false}
            />
            <Column
              dataField="area"
              caption={intl.formatMessage({
                id: 'app.NVR.column.area',
              })}
              cellRender={renderArea}
              allowSearch
              allowHeaderFiltering={false}
            />
            <Column
              dataField="information._version"
              caption={intl.formatMessage({
                id: 'app.NVR.column.version',
              })}
              allowSearch
              width={100}
              allowHeaderFiltering={false}
            />
            <Column
              dataField="number_of_children"
              caption={intl.formatMessage({
                id: 'app.NVR.column.available',
              })}
              allowSearch
              width={100}
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
      </div>

      {editingRow && isOpenEdit && (
        <Popup
          className="popup"
          visible
          title={intl.formatMessage({
            id: 'app.NVR.edit.title',
          })}
          showTitle
          onHidden={() => {
            setIsOpenEdit(false);
          }}
          dragEnabled={false}
          width="500"
          height="456"
        >
          <EditNVR
            editingRow={editingRow}
            onClose={() => {
              setIsOpenEdit(false);
            }}
          />
        </Popup>
      )}
      {editingRow && isOpenDetail && (
        <DetailNVR
          editingRow={editingRow}
          onClose={() => {
            setIsOpenDetail(false);
          }}
        />
      )}
      {isOpenAddNew && (
        <Popup
          className="popup"
          visible
          title={intl.formatMessage({
            id: 'app.NVR.add.title',
          })}
          showTitle
          onHidden={() => {
            setIsOpenAddNew(false);
          }}
          dragEnabled
          width="500px"
          height="auto"
        >
          <AddNVR
            onClose={() => {
              setIsOpenAddNew(false);
            }}
          />
        </Popup>
      )}
      {isOpenChangePassword && (
        <Popup
          className="popup"
          visible
          title={editingRow.name}
          showTitle
          onHidden={() => {
            setIsOpenChangePassword(false);
          }}
          dragEnabled
          width="600"
          height="auto"
        >
          <ChangePassword
            editingRow={editingRow}
            onClose={() => {
              setIsOpenChangePassword(false);
            }}
          />
        </Popup>
      )}
      {isOpenFilter && (
        <Popup
          className="popup"
          visible
          title={intl.formatMessage({
            id: 'app.title.filter',
          })}
          showTitle
          onHidden={() => {
            setIsOpenFilter(false);
          }}
          dragEnabled={false}
          width="350"
          height="auto"
        >
          <Filter
            filterValue={filterData}
            listNVRStatus={listNVRStatus}
            onClose={() => {
              setIsOpenFilter(false);
            }}
            onFilter={values => {
              setFilterData(values);
            }}
          />
        </Popup>
      )}
    </React.Fragment>
  );
}

ListNVR.propTypes = {
  loading: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({
  listNVR: makeSelectListData(),
  listNVRStatus: makeSelectListNVRStatus(),
  isMenuExpanded: makeSelectIsMenuExpanded(),
  loading: makeSelectLoading(),
});

export function mapDispatchToProps(dispatch) {
  return {
    onLoadData: evt => {
      dispatch(loadData(evt));
    },
    onDeleteRows: rows => {
      dispatch(deleteRows(rows));
    },
    onShowLoading: evt => {
      dispatch(showLoading(evt));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(ListNVR);
