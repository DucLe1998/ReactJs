/* eslint-disable jsx-a11y/anchor-is-valid */
import {
  Badge,
  Divider,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemAvatar,
  Popover,
  Tooltip,
  Typography,
} from '@material-ui/core';
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';
import NotificationsNoneOutlinedIcon from '@material-ui/icons/NotificationsNoneOutlined';
import { Skeleton } from '@material-ui/lab';
import useAxios from 'axios-hooks';
import { NOTIFICATION_API } from 'containers/apiUrl';
import { format, startOfDay, subMonths } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Virtuoso } from 'react-virtuoso';
import { patchApi } from 'utils/requestUtils';
import Avatar from './avatar';
import { useStyles } from './style';
export default function Popup() {
  const classes = useStyles();
  const history = useHistory();
  const [page, setPage] = useState(1);
  const [data, setData] = useState(null);
  const [endReached, setEndReached] = useState(false);
  const [count, setCount] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const openPopup = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const itemHeight = 100;
  // count
  const [{ data: countData }, executeGetCount] = useAxios(
    NOTIFICATION_API.COUNT,
    {
      manual: true,
    },
  );
  useEffect(() => {
    executeGetCount();
  }, []);
  useEffect(() => {
    if (countData) {
      const data = countData.reduce(
        (total, cur) => total + cur.numberOfUnreadNotification || 0,
        0,
      );
      setCount(data);
    }
  }, [countData]);
  // table data
  const [{ data: getTableData }, executeGetTable] = useAxios(
    NOTIFICATION_API.LIST,
    {
      useCache: false,
      manual: true,
    },
  );
  useEffect(() => {
    if (!openPopup) {
      setPage(1);
      setData(null);
    } else {
      setCount(0);
      executeGetTable({
        params: {
          limit: 25,
          page,
          fromDate: startOfDay(subMonths(new Date(), 1)).getTime(),
        },
      });
    }
  }, [page, openPopup]);
  useEffect(() => {
    if (getTableData) {
      if (page == 1) {
        setData(getTableData.rows);
        if (getTableData.rows.length == getTableData.totalCount) {
          setEndReached(true);
        } else setEndReached(false);
      } else {
        setData([...data, ...getTableData.rows]);
        if (data.length + getTableData.rows.length == getTableData.totalCount) {
          setEndReached(true);
        } else setEndReached(false);
      }
    }
  }, [getTableData]);
  const loadMore = () => {
    if (!endReached) setPage(page + 1);
  };
  const onItemClick = (item) => {
    let url = `/me-notification/${item.id}`;
    if (item?.eventSubType == 'GUEST_REGISTRATION') {
      const data = JSON.parse(item.data);
      url = `/guest-registrations/details/${data.registrationId}/${
        data.dataType == 'REQUEST_APPROVE' ? 'approve' : 'list'
      }`;
      if (!item.read) {
        patchApi(NOTIFICATION_API.READ, {
          ids: [item.id],
        });
      }
    }
    history.push({
      pathname: url,
    });
    setAnchorEl(null);
  };
  const itemRender = (index) => {
    const item = data[index];
    if (!item) {
      return null;
    }
    return (
      <>
        <Divider />
        <ListItem
          button
          onClick={() => onItemClick(item)}
          selected={!item.read}
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
        </ListItem>
      </>
    );
  };
  const LoadingItem = (
    <Skeleton
      variant="rect"
      animation="wave"
      width="100%"
      height="100px"
      style={{ marginTop: '7px' }}
    />
  );
  const loadingNotification =
    !data && React.Children.toArray(new Array(5).fill().map(() => LoadingItem));
  const MUIComponents = {
    List: React.forwardRef(({ style, children }, listRef) => (
      <List
        style={{ padding: 0, ...style, margin: 0 }}
        component="div"
        ref={listRef}
      >
        {children}
      </List>
    )),
  };
  const listNotity =
    data && data.length ? (
      <Virtuoso
        style={{
          minHeight: itemHeight,
          maxHeight: '80vh',
          height: itemHeight * data.length,
        }}
        data={data}
        overscan={100}
        endReached={loadMore}
        itemContent={itemRender}
        components={MUIComponents}
      />
    ) : (
      <div className={classes.empty}>
        <NotificationsNoneIcon className={classes.iconEmpty} />
        <p>Bạn không có thông báo nào</p>
      </div>
    );
  return (
    <>
      <Tooltip title="Thông báo">
        <IconButton onClick={handleClick}>
          <Badge
            badgeContent={count}
            color="secondary"
            max={99}
            classes={{
              badge: classes.badge,
            }}
          >
            <NotificationsNoneOutlinedIcon />
          </Badge>
        </IconButton>
      </Tooltip>
      <Popover
        open={openPopup}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <div className={classes.popupContainer}>
          <div className={classes.popupHeader}>
            <Typography variant="h6" component="span">
              Thông báo
            </Typography>
            <Link
              variant="subtitle1"
              color="primary"
              component="button"
              onClick={() => {
                setAnchorEl(null);
                history.push('/me-notification');
              }}
            >
              Xem tất cả
            </Link>
          </div>
          {data ? listNotity : loadingNotification}
        </div>
      </Popover>
    </>
  );
}
