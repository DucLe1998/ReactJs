/**
 *
 * BlacklistCameraAi
 *
 */

import React, { Fragment, useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
// import { makeStyles } from '@material-ui/core/styles';
import { Tooltip, Badge, ClickAwayListener } from '@material-ui/core';
import { useHistory, Link } from 'react-router-dom';
import DataGrid, {
  Column,
  LoadPanel,
  Paging,
  Scrolling,
  Selection,
} from 'devextreme-react/data-grid';
import { BiPlus } from 'react-icons/bi';
import { HiOutlineDownload } from 'react-icons/hi';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import { checkAuthority } from 'utils/functions';
import Img from 'components/Imge';
import makeSelectBlacklistCameraAi from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';
import Loading from '../Loading';
import PageHeader from '../../components/PageHeader';
import { IconButtonSquare } from '../../components/CommonComponent';
import {
  deleteUser,
  downloadBlackList,
  loadBlackList,
  loadMovementDetectedHistory,
  setForm,
  setOpenMovementDetectedHistoryPopup,
  updateName,
} from './actions';
import IconBtn from '../../components/Custom/IconBtn';
import { buildUrlWithToken } from '../../utils/utils';
import IconEdit from './icons/IconEdit';
import IconDelete from './icons/IconDelete';
import { delApi, getApi, putApi } from '../../utils/requestUtils';
import { API_CAMERA_AI } from '../apiUrl';
import { getErrorMessage } from '../Common/function';
import { showError, showSuccess } from '../../utils/toast-utils';
import PopupDelete from './PopupDelete';
const key = 'blacklistCameraAi';

const initParams = {
  keyword: '',
  limit: 25,
  page: 1,
  sort: undefined,
};

const initDatasouce = { rows: [], limit: 0, totalPage: 0, count: 0, page: 1 };

export function BlacklistCameraAi({
  userAuthority,
  blacklistCameraAi,
  onDownloadBlackList,
}) {
  // const classes = useStyles();
  const intl = useIntl();
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });

  const resourceCode = 'cameraai/blacklist-users';
  const scopes = checkAuthority(
    ['get', 'update', 'delete', 'create', 'list'],
    resourceCode,
    userAuthority,
  );
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState(initParams);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [editCell, setEditCell] = useState(null);
  const [deleteData, setDeleteData] = useState(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [blackList, setBlackList] = useState(initDatasouce);

  const handleClickAway = () => {
    setEditCell(null);
  };

  const loadData = useCallback(() => {
    setLoading(true);
    getApi(API_CAMERA_AI.LIST_BLACKLIST_USER_3_6, search)
      .then(res => {
        setBlackList(res.data);
      })
      .catch(err => {
        showError(getErrorMessage(err));
      })
      .finally(() => {
        setLoading(false);
      });
  });
  useEffect(() => {
    loadData();
    setSelectedRowKeys([]);
  }, [search]);

  const renderNameCell = ({ data }) => (
    <Fragment>
      <Grid container alignItems="center">
        <Grid item xs={8}>
          {(editCell === null || editCell?.id !== data.id) && (
            <Tooltip title={data.name}>
              <p
                style={{
                  overflow: 'hidden',
                  maxWidth: '100%',
                  textOverflow: 'ellipsis',
                }}
              >
                {data.name}
              </p>
            </Tooltip>
          )}
          {editCell?.id === data.id && (
            <ClickAwayListener
              mouseEvent="onMouseDown"
              touchEvent="onTouchStart"
              onClickAway={handleClickAway}
            >
              <TextField
                value={editCell.name}
                onChange={e => {
                  onEditName(e.target.value);
                }}
                onBlur={() => {
                  if (editCell.name !== data.name) {
                    handleUpdate(editCell);
                  }
                }}
              />
            </ClickAwayListener>
          )}
        </Grid>
        {scopes.update && (
          <Grid item xs={1}>
            <IconBtn
              style={styles.iconDataCell}
              onClick={() => {
                setEditCell(data);
              }}
              icon={<IconEdit />}
            />
          </Grid>
        )}
      </Grid>
    </Fragment>
  );
  const renderImageCell = ({ value }) => (
    <Fragment>
      <Img
        src={buildUrlWithToken(value)}
        style={{ maxWidth: '91px', height: '56px', minWidth: '56px' }}
      />
    </Fragment>
  );
  const renderViewMovementDetectedHistoryCell = ({ data }) => (
    <Fragment>
      {scopes.get && (
        <Link to={`/camera-ai/black-list/${data.id}/${data.uuid}/histories`}>
          {intl.formatMessage(messages.cell_view_history_title)}
        </Link>
      )}
    </Fragment>
  );
  const renderActionCell = ({ data }) => (
    <Fragment>
      {scopes.delete && (
        <IconBtn
          style={styles.iconDataCell}
          onClick={() => {
            setDeleteData(data);
            setShowDeletePopup(true);
          }}
          icon={<IconDelete />}
          showTooltip={intl.formatMessage({
            id: 'app.tooltip.delete',
          })}
        />
      )}
    </Fragment>
  );
  const columns = [
    {
      dataField: 'imageUrl',
      caption: intl.formatMessage(messages.column_image_title),
      cellRender: renderImageCell,
      cssClass: 'valign-center',
      allowSorting: false,
    },
    {
      dataField: 'name',
      caption: intl.formatMessage(messages.column_name_title),
      cellRender: renderNameCell,
      alignment: 'left',
      cssClass: 'valign-center',
      width: '20%',
      allowSorting: false,
    },
    {
      dataField: 'uuid',
      caption: intl.formatMessage(messages.column_id_title),
      cssClass: 'valign-center',
      allowSorting: false,
    },
    {
      dataField: 'updatedAt',
      caption: intl.formatMessage(messages.column_time_title),
      dataType: 'datetime',
      format: 'dd/MM/yyyy HH:mm',
      cssClass: 'valign-center',
      allowSorting: false,
    },
    {
      // caption: intl.formatMessage(messages.column_view_detail_title),
      cellRender: renderViewMovementDetectedHistoryCell,
      cssClass: 'valign-center',
      allowSorting: false,
    },
    {
      // caption: intl.formatMessage(messages.column_action_title),
      cellRender: renderActionCell,
      cssClass: 'valign-center',
      allowSorting: false,
    },
  ];

  function handlePageSize(e) {
    setSearch({ ...search, page: 1, limit: e.target.value });
  }

  const handlePropertyChange = e => {
    if (e.fullName.includes('sortOrder')) {
      if (e.value) {
        const direction = e.value == 'asc' ? '+' : '-';
        const key = columns[e.fullName.slice(8, -11)].dataField;
        setSearch({ ...search, sorting: direction + key });
      } else setSearch({ ...search, sorting: undefined });
    }
  };

  const onSelectionChanged = ({ selectedRowKeys }) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  const deletePopup = () => (
    <PopupDelete
      onClickSave={() => handleDelete()}
      typeTxt="tập tin"
      onClose={() => {
        setDeleteData(null);
        setShowDeletePopup(false);
      }}
    />
  );

  const handleDelete = () => {
    setLoading(true);
    delApi(API_CAMERA_AI.DELETE_LIST_USER_3_6, {
      ids: deleteData ? [deleteData.id] : selectedRowKeys,
    })
      .then(() => {
        setShowDeletePopup(false);
        setDeleteData(null);
        setSelectedRowKeys([]);
        loadData();
        showSuccess('Xóa các đối tượng khỏi danh sách đen thành công');
      })
      .catch(err => {
        showError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleUpdate = data => {
    setLoading(true);
    putApi(API_CAMERA_AI.UPDATE_USER_3_6(data.id), {
      name: data.name,
    })
      .then(() => {
        loadData();
        showSuccess('Sửa tên đối tượng thành công');
      })
      .catch(err => {
        showError(err);
      })
      .finally(() => {
        setLoading(false);
        setEditCell(null);
      });
  };

  const onDownloadBtnClick = data => {
    onDownloadBlackList(data ? [data.id] : selectedRowKeys);
  };
  const onEditName = newName => {
    setEditCell({ ...editCell, name: newName });
  };

  const handleChangePageIndex = pageIndex => {
    setSearch({ ...search, page: pageIndex });
  };

  return (
    <Fragment>
      <Helmet>
        <title>{intl.formatMessage(messages.header)}</title>
        <meta name="description" content="Description of Blacklist" />
      </Helmet>
      {loading && <Loading />}
      {showDeletePopup && deletePopup()}
      <Fragment>
        <PageHeader
          title={intl.formatMessage(messages.header)}
          showSearch
          showPager
          totalCount={blackList?.count || 0}
          pageIndex={search.page}
          rowsPerPage={search.limit}
          handleChangePageIndex={handleChangePageIndex}
          handlePageSize={handlePageSize}
          onSearchValueChange={newVal =>
            setSearch({ ...search, keyword: newVal, page: 1 })
          }
        >
          {scopes.delete && (
            <Tooltip title={intl.formatMessage({ id: 'app.tooltip.delete' })}>
              <Badge badgeContent={selectedRowKeys.length} color="primary">
                <IconButtonSquare
                  icon="trash"
                  onClick={() => {
                    setShowDeletePopup(true);
                  }}
                  disabled={selectedRowKeys.length <= 0}
                />
              </Badge>
            </Tooltip>
          )}
          {scopes.create && (
            <Link to="/camera-ai/black-list/add">
              <Tooltip
                title={intl.formatMessage(messages.new_blacklist_add_btn)}
              >
                <Badge color="primary">
                  <IconBtn
                    style={styles.iconBtnHeader}
                    icon={<BiPlus color="gray" />}
                  />
                </Badge>
              </Tooltip>
            </Link>
          )}

          {scopes.list && (
            <Tooltip
              title={intl.formatMessage(messages.tooltip_download)}
              badgeContent={selectedRowKeys.length}
            >
              <Badge color="primary">
                <IconBtn
                  style={styles.iconBtnHeader}
                  icon={<HiOutlineDownload color="gray" />}
                  onClick={() => {
                    onDownloadBtnClick();
                  }}
                />
              </Badge>
            </Tooltip>
          )}
        </PageHeader>
        <DataGrid
          className="center-row-grid"
          dataSource={blackList?.rows || []}
          keyExpr="id"
          // noDataText={intl.formatMessage({ id: 'app.no_data' })}
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
          // sorting={{ mode: 'none' }}
        >
          <Paging enabled={false} />
          <Scrolling mode="infinite" />
          <LoadPanel enabled={false} />
          <Selection mode="multiple" showCheckBoxesMode="always" />
          {columns.map((defs, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <Column {...defs} key={index} />
          ))}
        </DataGrid>
      </Fragment>
    </Fragment>
  );
}

BlacklistCameraAi.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const styles = {
  iconBtnHeader: {
    backgroundColor: 'rgba(116, 116, 128, 0.08)',
    height: 36,
    width: 36,
    borderRadius: 6,
  },
  iconDataCell: {
    height: 36,
    width: 36,
    borderRadius: 6,
  },
};

const mapStateToProps = createStructuredSelector({
  blacklistCameraAi: makeSelectBlacklistCameraAi(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onLoadBlacklist: evt => {
      dispatch(loadBlackList(evt));
    },
    onDeleteUser: evt => {
      dispatch(deleteUser(evt));
    },
    onLoadHistory: evt => {
      dispatch(loadMovementDetectedHistory(evt));
    },
    onCloseHisPopup: evt => {
      dispatch(setOpenMovementDetectedHistoryPopup(evt));
    },
    onUpdateUser: evt => {
      dispatch(updateName(evt));
    },
    onSetForm: evt => {
      dispatch(setForm(evt));
    },
    onDownloadBlackList: evt => {
      dispatch(downloadBlackList(evt));
    },
    onSetOpenMovementDetectedHistoryPopup: evt => {
      dispatch(setOpenMovementDetectedHistoryPopup(evt));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(BlacklistCameraAi);
