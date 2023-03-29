import {
  Button,
  Chip,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  Menu,
  MenuItem,
  Typography,
} from '@material-ui/core';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';
import useAxios from 'axios-hooks';
import PageHeader from 'components/PageHeader';
import { NOTIFICATION_API } from 'containers/apiUrl';
import Loading from 'containers/Loading/Loadable';
import { endOfDay, format, startOfDay } from 'date-fns';
import PopupState, { bindMenu, bindTrigger } from 'material-ui-popup-state';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
// import { Link } from 'react-router-dom';
import { showError, showSuccess } from 'utils/toast-utils';
import { showAlertConfirm } from 'utils/utils';
import { DEFAULT_FILTER, key, READ_STATUS, READ_STATUS_MAP } from './constants';
import { useStyles } from './style';
import Avatar from './avatar';
export default function MyNotification({ history, location }) {
  const classes = useStyles();
  const state = location?.state || {};
  // const [openFilterDialog, setOpenFilterDialog] = useState(false);
  const [filter, setFilter] = useState({
    ...DEFAULT_FILTER,
    ...(state[key] || {}),
  });
  const [needReload, setNeedReload] = useState(0);
  const isFilter = (filterOp) => {
    const { keyword, limit, page, isRead, ...filter } = filterOp;
    return Object.values(filter).filter((v) => !!v && String(v).length).length;
  };
  const [showFilter, setShowFilter] = useState(isFilter(filter));
  useEffect(() => {
    if (Object.keys(state).length) {
      history.replace({ ...location?.state, [key]: undefined });
    }
  }, []);
  // table data
  // const [
  //   { data: getTableData, loading: getTableLoading, error: getTableError },
  //   executeGetTable,
  // ] = useAxios(NOTIFICATION_API.LIST, {
  //   useCache: false,
  //   manual: true,
  // });
  useEffect(() => {
    const { fromDate, toDate, isRead, ...other } = filter;
    executeGetTable({
      params: {
        ...other,
        fromDate: fromDate ? startOfDay(fromDate).getTime() : undefined,
        toDate: toDate ? endOfDay(toDate).getTime() : undefined,
        isRead: READ_STATUS_MAP[isRead],
      },
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
  // patch
  const [
    { response: patchData, loading: patchLoading, error: patchError },
    executePatch,
  ] = useAxios(
    {
      method: 'PATCH',
    },
    {
      manual: true,
    },
  );
  useEffect(() => {
    if (patchError) {
      showError(patchError);
    }
  }, [patchError]);

  useEffect(() => {
    if (patchData) {
      // showSuccess('thành công');
      setNeedReload(needReload + 1);
    }
  }, [patchData]);
  const onDeleteBtnClick = (data) => {
    showAlertConfirm({
      text: 'Bạn có chắc chắn muốn xóa thông báo này?',
      title: 'Xóa thông báo',
    }).then((result) => {
      if (result.value) {
        executeDelete({
          url: NOTIFICATION_API.DETAILS(data.id),
        });
      }
    });
  };
  const handlePageSize = (e) => {
    setFilter({ ...filter, limit: e.target.value, page: 1 });
  };
  const onReadStatusChange = (status) => {
    setFilter({ ...filter, page: 1, isRead: status });
  };
  const onItemClick = (item) => {
    if (item?.eventSubType == 'GUEST_REGISTRATION') {
      const data = JSON.parse(item.data);
      window.open(
        `/guest-registrations/details/${data.registrationId}/${
          data.dataType == 'REQUEST_APPROVE' ? 'approve' : 'list'
        }`,
      );
      executePatch({
        url: NOTIFICATION_API.READ,
        data: {
          ids: [item.id],
        },
      });
    } else {
      history.push({
        pathname: `/me-notification/${item.id}`,
        state: {
          key: filter,
        },
      });
    }
  };

  const markAllAsRead = () => {
    executePatch({
      url: NOTIFICATION_API.READ_ALL,
      data: {
        eventTypes: null,
      },
    });
  };
  const onReadItemChange = (item) => {
    executePatch({
      url: item.read ? NOTIFICATION_API.UNREAD : NOTIFICATION_API.READ,
      data: {
        ids: [item.id],
      },
    });
  };
  return (
    <>
      <Helmet>
        <title>Danh sách thông báo</title>
        <meta name="description" content="Danh sách thông báo" />
      </Helmet>
      {(getTableLoading || deleteLoading || patchLoading) && <Loading />}
      <PageHeader
        title="Danh sách thông báo"
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
        placeholderSearch="Tìm kiếm theo tiêu đề, nội dung tóm tắt"
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
      ></PageHeader>
      <div className={classes.toolbar}>
        <div className={classes.chipArray}>
          {React.Children.toArray(
            READ_STATUS.map((item) => (
              <Chip
                label={item.label}
                color={item.value == filter.isRead ? 'primary' : 'default'}
                onClick={() => onReadStatusChange(item.value)}
              />
            )),
          )}
        </div>
        <div>
          <Button startIcon={<DoneAllIcon />} onClick={markAllAsRead}>
            Đã đọc tất cả
          </Button>
        </div>
      </div>
      {getTableData?.rows?.length > 0 ? (
        <List
          disablePadding
          style={{
            maxHeight: 'calc(100vh - 201px)',
            minHeight: 120,
            overflow: 'overlay',
            backgroundColor: 'white',
          }}
        >
          {React.Children.toArray(
            getTableData.rows.map((item) => (
              <>
                <ListItem
                  selected={!item.read}
                  button
                  onClick={() => onItemClick(item)}
                  classes={{
                    selected: classes.itemSelected,
                  }}
                >
                  <ListItemAvatar>
                    <Avatar
                      type={item?.eventSubType || item?.eventType}
                      data={item.data}
                    />
                  </ListItemAvatar>
                  <div className={classes.itemContent}>
                    <Typography variant="h6" component="p" noWrap>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" noWrap>
                      {item.content}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {format(item.createdAt, 'HH:mm dd/MM/yyyy')}
                    </Typography>
                  </div>
                  <ListItemSecondaryAction>
                    <PopupState variant="popover" popupId={item.id}>
                      {(popupState) => (
                        <>
                          <IconButton {...bindTrigger(popupState)}>
                            <MoreVertIcon />
                          </IconButton>
                          <Menu
                            {...bindMenu(popupState)}
                            // getContentAnchorEl={null}
                            // anchorOrigin={{
                            //   vertical: 'bottom',
                            //   horizontal: 'center',
                            // }}
                            // transformOrigin={{
                            //   vertical: 'top',
                            //   horizontal: 'center',
                            // }}
                          >
                            <MenuItem
                              onClick={() => {
                                popupState.close();
                                onReadItemChange(item);
                              }}
                            >
                              {item.read
                                ? 'Đánh dấu chưa đọc'
                                : 'Đánh dấu đã đọc'}
                            </MenuItem>
                            <MenuItem
                              onClick={() => {
                                popupState.close();
                                onDeleteBtnClick(item);
                              }}
                            >
                              Xóa thông báo
                            </MenuItem>
                          </Menu>
                        </>
                      )}
                    </PopupState>
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
              </>
            )),
          )}
        </List>
      ) : (
        <div className={classes.empty}>
          <NotificationsNoneIcon className={classes.iconEmpty} />
          <p>Bạn không có thông báo nào</p>
        </div>
      )}
    </>
  );
}
