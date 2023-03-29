import React, { useState } from 'react';
import { IconNoti } from 'constant/ListIcons';
import { Badge, makeStyles, Popover } from '@material-ui/core';
import { useVinToken } from 'utils/hooks/useVinToken';
import { useSnackbar } from 'notistack';
import SockJsClient from 'react-stomp';
import { useSelector } from 'react-redux';
import { checkAuthority } from 'utils/functions';
import PopupNoti from '../PopupNoti';
import NotisOverView from '../NotisOverView';

const topic = '/topic/notification';

const getKeyNoti = d => d?.data && JSON.parse(d?.data)?.dataId;

const useStyles = makeStyles(() => ({
  paper: {
    left: 'calc(100vw - 400px)',
    width: 326,
    marginTop: 12,
    borderRadius: 10,
  },
  badge: {
    '& .MuiBadge-anchorOriginTopRightRectangle': {
      top: '3px',
      right: '4px',
      border: '1px solid #fff',
      backgroundColor: '#F7685B !important',
    },
  },
}));

export default function FireNoti() {
  const userAuthority = useSelector(
    state => state?.usermenu?.listUserAuthority,
  );
  const resourceCode = 'cameraai/events';
  const scopes = checkAuthority(['get', 'list'], resourceCode, userAuthority);

  const [invisible, setInvisible] = useState(false);
  const { wsUrl } = useVinToken();
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();

  return (
    <div style={{ marginRight: 10, cursor: 'pointer' }}>
      {scopes.get && scopes.list && (
        <SockJsClient
          url={wsUrl}
          topics={[topic]}
          onMessage={data => {
            const at = new Date();
            enqueueSnackbar(
              <PopupNoti title="Cảnh báo cháy" data={{ ...data, at }} />,
              {
                autoHideDuration: 400000,
                anchorOrigin: {
                  vertical: 'bottom',
                  horizontal: 'right',
                },
                key: getKeyNoti(data),
              },
            );
          }}
          headers={{
            'Access-Control-Allow-Credentials': true,
          }}
        />
      )}

      <Popover
        open={invisible}
        anchorEl={() => document.getElementById('badge-noti')}
        anchorReference="anchorEl"
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={() => setInvisible(!invisible)}
        classes={{
          paper: classes.paper,
        }}
      >
        <NotisOverView visable={invisible} />
      </Popover>
      <Badge
        variant="dot"
        invisible={invisible}
        badgeContent={4}
        color="primary"
        onClick={() => {
          setInvisible(!invisible);
        }}
        className={classes.badge}
        id="badge-noti"
      >
        <img src={IconNoti} alt="" />
      </Badge>
    </div>
  );
}
