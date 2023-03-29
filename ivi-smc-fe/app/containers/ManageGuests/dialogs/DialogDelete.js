import React from 'react';
import { useIntl } from 'react-intl';
import { makeStyles } from '@material-ui/core/styles';

import {
  DialogContent,
  DialogActions,
  Dialog,
  DialogTitle,
  DialogContentText,
} from '@material-ui/core';
import messages from '../messages';

const useStyles = makeStyles({
  root: {
    '& .MuiDialogContent-root': {
      overflowY: 'unset',
    },
    '& .MuiPaper-root': {
      minWidth: '562px',
    },
    '& .MuiDialogActions-root': {
      padding: '32px',
    },
    '& .MuiPaper-rounded': {
      borderRadius: '8px',
    },
  },
  button: {
    padding: '12px 16px',
    border: 'none',
    outline: 'none',
    lineHeight: '16px',
    borderRadius: '8px',
    cursor: 'pointer',
    boxSizing: 'border-box',
    minWidth: '104px',
  },
});
export default function DialogDelete({
  open,
  handleClose,
  handleSuccess,
  guestIndex,
  title,
  content,
}) {
  const intl = useIntl();
  const classes = useStyles();
  return (
    <Dialog open={open} onClose={handleClose} className={classes.root}>
      <DialogTitle>
        {title || intl.formatMessage(messages.dialogDeleteTitle)}
      </DialogTitle>
      <DialogContent>
        {content ? (
          <DialogContentText>{content}</DialogContentText>
        ) : (
          <DialogContentText>
            {guestIndex === 0
              ? 'Người dùng này đang là khách đại diện. Nếu xóa người dùng này, vai trò đại diện sẽ được chuyển cho người bên dưới.'
              : intl.formatMessage(messages.dialogDeleteContent)}
          </DialogContentText>
        )}
      </DialogContent>
      <DialogActions>
        <button
          type="button"
          className={classes.button}
          onClick={handleClose}
          style={{ border: '1px solid #dddddd' }}
        >
          {intl.formatMessage(messages.cancel)}
        </button>
        <button
          type="button"
          className={classes.button}
          onClick={handleSuccess}
          style={{
            marginLeft: '32px',
            color: '#fff',
            boxShadow: '0px 4px 10px rgba(16, 156, 241, 0.24)',
            backgroundColor: '#00554A',
          }}
        >
          {intl.formatMessage(messages.delete)}
        </button>
      </DialogActions>
    </Dialog>
  );
}
