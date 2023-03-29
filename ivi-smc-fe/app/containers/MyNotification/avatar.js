import React from 'react';
import { Badge, Avatar } from '@material-ui/core';
import NotificationsIcon from '@material-ui/icons/Notifications';
import ReceiptIcon from '@material-ui/icons/Receipt';
import ClearIcon from '@material-ui/icons/Clear';
import CheckIcon from '@material-ui/icons/Check';
import AddIcon from '@material-ui/icons/Add';
import SettingsIcon from '@material-ui/icons/Settings';
import BarChartIcon from '@material-ui/icons/BarChart';
import RedeemIcon from '@material-ui/icons/Redeem';
import WarningIcon from '@material-ui/icons/Warning';
import { useStyles } from './style';
export default function NotiAvatar({ type, data }) {
  const classes = useStyles();
  const obj = JSON.parse(data);
  const switchGuest = () => {
    let badgeContent = null;
    switch (obj.dataType) {
      case 'RESPONSE_REJECT':
        badgeContent = (
          <ClearIcon
            className={classes.badgeIcon}
            style={{
              backgroundColor: '#E24545',
            }}
          />
        );
        break;
      case 'RESPONSE_APPROVED':
        badgeContent = (
          <CheckIcon
            className={classes.badgeIcon}
            style={{
              backgroundColor: '#40A574',
            }}
          />
        );
        break;
      case 'REQUEST_APPROVE':
        badgeContent = (
          <AddIcon
            className={classes.badgeIcon}
            style={{
              backgroundColor: '#ff9800',
            }}
          />
        );
        break;
      default:
        break;
    }
    return (
      <Badge
        overlap="circular"
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        badgeContent={badgeContent}
      >
        <Avatar className={classes.avartar}>
          <ReceiptIcon />
        </Avatar>
      </Badge>
    );
  };
  switch (type) {
    case 'GUEST_REGISTRATION':
      return switchGuest();
    case 'SYSTEM':
      return (
        <Avatar className={classes.avartar}>
          <SettingsIcon />
        </Avatar>
      );
    case 'ACTION':
      return (
        <Avatar className={classes.avartar}>
          <BarChartIcon />
        </Avatar>
      );
    case 'ADVERTISEMENT':
      return (
        <Avatar className={classes.avartar}>
          <RedeemIcon />
        </Avatar>
      );
    case 'WARNING':
      return (
        <Avatar className={classes.avartar}>
          <WarningIcon />
        </Avatar>
      );
    default:
      return (
        <Avatar className={classes.avartar}>
          <NotificationsIcon />
        </Avatar>
      );
  }
}
