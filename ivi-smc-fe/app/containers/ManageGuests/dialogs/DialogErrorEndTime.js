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
// eslint-disable-next-line no-unused-vars
import messages from '../messages';

const useStyles = makeStyles({
  root: {
    '& .MuiPaper-rounded': {
      borderRadius: '8px',
    },
    '& .MuiDialogActions-root': {
      padding: '32px',
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
    maxWidth: '100%',
  },
});

export default function DialogErrorEndTime({ open, handleClose }) {
  const classes = useStyles();
  // eslint-disable-next-line no-unused-vars
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
      <DialogTitle>Thời gian kết thúc không đúng</DialogTitle>
      <DialogContent style={{ overflowY: 'unset' }}>
        <DialogContentText className={classes.dialogContentText}>
          Thời gian kết thúc của bạn nhỏ hơn thời gian bắt đầu. Hãy điều chỉnh
          và thử lại.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <button
          type="button"
          onClick={handleClose}
          className={classes.button}
          style={{
            marginLeft: '32px',
            color: '#fff',
            boxShadow: '0px 4px 10px rgba(16, 156, 241, 0.24)',
            backgroundColor: '#00554A',
          }}
        >
          Ok
        </button>
      </DialogActions>
    </Dialog>
  );
}
