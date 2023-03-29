import React from 'react';
import { useIntl } from 'react-intl';

import {
  DialogContent,
  DialogActions,
  Dialog,
  DialogTitle,
  DialogContentText,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import messages from '../messages';

const useStyles = makeStyles({
  root: {
    '& .MuiDialogActions-root': {
      padding: '32px',
    },
    '& .MuiPaper-rounded': {
      borderRadius: '8px',
    },
  },
  paper: {
    overflowY: 'unset',
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
  dialogContentText: {
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '16px',
    lineHeight: '19px',
    width: '622px',
    color: '#000',
  },
});

export default function DialogCancel({ open, handleClose, onSuccess }) {
  const classes = useStyles();
  const intl = useIntl();
  return (
    <Dialog
      className={classes.root}
      open={open}
      onClose={handleClose}
      classes={{
        paper: classes.paper,
      }}
    >
      <DialogTitle>
        {intl.formatMessage(messages.cancelRegistration)}
      </DialogTitle>
      <DialogContent style={{ overflowY: 'unset' }}>
        <DialogContentText className={classes.dialogContentText}>
          {intl.formatMessage(messages.dialogCancelContent)}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <button
          type="button"
          onClick={handleClose}
          className={classes.button}
          style={{ border: '1px solid #dddddd' }}
        >
          Không
        </button>
        <button
          type="button"
          onClick={onSuccess}
          className={classes.button}
          style={{
            marginLeft: '32px',
            color: '#fff',
            boxShadow: '0px 4px 10px rgba(16, 156, 241, 0.24)',
            backgroundColor: '#00554A',
          }}
        >
          Có
        </button>
      </DialogActions>
    </Dialog>
  );
}
