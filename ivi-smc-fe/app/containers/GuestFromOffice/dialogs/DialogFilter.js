/* eslint-disable import/no-unresolved */
import React, { useState } from 'react';
import {
  DialogContent,
  Grid,
  DialogActions,
  Dialog,
  TextField,
  DialogTitle,
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { useIntl } from 'react-intl';

import { formatDate } from '../modules';
import messages from '../messages';

const useStyles = makeStyles({
  root: {
    '& .ct-root-popup': {
      padding: '0px',
    },
    '& .MuiDialogActions-root': {
      padding: '0px',
    },
    '& .MuiDialogContent-root': {
      overflowY: 'unset',
    },
    '& .MuiPaper-rounded': {
      borderRadius: '8px',
    },
  },
  createdBy: {
    height: 'auto',
  },
  button: {
    padding: '12px 16px',
    border: 'none',
    outline: 'none',
    lineHeight: '16px',
    boxSizing: 'border-box',
    borderRadius: '8px',
    cursor: 'pointer',
    minWidth: '104px',
  },
  label: {
    height: '17px',
    lineHeight: '16px',
    fontSize: '14px',
    color: '#999999',
    margin: '5px 0',
  },
  pdLeft: {
    paddingLeft: '8px',
  },
  pdRight: {
    paddingRight: '8px',
  },
  textField: {
    '& .MuiInputBase-root': {
      height: '40px',
    },
    '& .MuiInputBase-input': {
      boxSizing: 'border-box',
      height: '100%',
    },
  },
});

export default function DialogFilter({
  openFilter,
  handleCloseFilter,
  onSuccess,
}) {
  const classes = useStyles();
  const [registrationDate, handleStartDate] = useState(new Date());
  const [status, setStatus] = useState('');

  const intl = useIntl();

  return (
    <Dialog
      open={openFilter}
      onClose={handleCloseFilter}
      className={classes.root}
    >
      <form>
        <DialogTitle style={{ fontSize: '20px' }}>Lọc khách</DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={6} className={classes.textField}>
              <Grid container direction="column">
                <p className={classes.label}>
                  {intl.formatMessage(messages.appointmentDate)}
                </p>
                <KeyboardDatePicker
                  id="manageGuest-dialogFilter"
                  autoOk
                  fullWidth
                  placeholder="Ngày hẹn khách"
                  name="registrationDate"
                  value={registrationDate}
                  onChange={e => {
                    handleStartDate(e);
                  }}
                  inputVariant="outlined"
                  format="dd/MM/yyyy"
                />
              </Grid>
            </Grid>
            <Grid item xs={6} className={classes.textField}>
              <Grid container direction="column">
                <p className={classes.label}>
                  {intl.formatMessage(messages.repeatTypeStatus)}
                </p>
                <Autocomplete
                  name="status"
                  value={status}
                  renderInput={params => (
                    <TextField
                      {...params}
                      variant="outlined"
                      placeholder="Trạng thái"
                    />
                  )}
                  options={[
                    { key: 'WAITING', value: 'Đang chờ' },
                    { key: 'ARRIVED', value: 'Đã đến' },
                    { key: 'CANCELLED', value: 'Đã hủy' },
                    { key: 'COMPLETE', value: 'Hoàn thành' },
                  ]}
                  getOptionLabel={option => option?.value || ''}
                  getOptionSelected={(option, selected) =>
                    option.key === selected.key
                  }
                  onChange={(e, newValue) => {
                    setStatus(newValue);
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <button
            type="button"
            onClick={handleCloseFilter}
            variant="contained"
            className={classes.button}
            stysle={{ border: '1px solid #dddddd' }}
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={() =>
              onSuccess({
                registrationDate:
                  (registrationDate && formatDate(registrationDate)) || null,
                status: status?.key ? status.key : '',
              })
            }
            variant="contained"
            className={classes.button}
            style={{
              marginLeft: '32px',
              color: '#fff',
              boxShadow: '0px 4px 10px rgba(16, 156, 241, 0.24)',
              backgroundColor: '#00554A',
            }}
          >
            {intl.formatMessage(messages.filter)}
          </button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
