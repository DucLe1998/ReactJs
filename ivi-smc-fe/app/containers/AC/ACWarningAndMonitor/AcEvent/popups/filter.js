import React, { useState } from 'react';
import { DialogActions, Grid } from '@material-ui/core';
import BtnCancel from 'components/Button/BtnCancel';
import BtnSuccess from 'components/Button/BtnSuccess';
import { makeStyles } from '@material-ui/core/styles';
import { DatePicker } from '@material-ui/pickers';

export const FilterEvent = ({ onClose, callback, valueFilter }) => {
  const classes = useStyles();

  const [startDate, setDateStart] = useState(
    parseInt(valueFilter.startDate, 10) || null,
  );
  const [dateEnd, setDateEnd] = useState(
    parseInt(valueFilter.endDate, 10) || null,
  );

  const onSubmit = () => {
    callback({
      dateEnd,
      startDate,
    });
    onClose();
  };

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <p className={classes.label}>Thời gian bắt đầu</p>
          <DatePicker
            variant="inline"
            fullWidth
            // disableToolbar
            emptyLabel="Tất cả"
            inputVariant="outlined"
            format="MM/dd/yyyy"
            value={startDate}
            onChange={(e) => {
              setDateStart(
                new Date(
                  new Date(new Date(e.setHours(0)).setMinutes(0)).setSeconds(0),
                ).setMilliseconds(0),
              );
            }}
            inputProps={{
              style: {
                height: 5,
              },
            }}
          />
          {(startDate > dateEnd ||
            (startDate === null && dateEnd !== null)) && (
            <p className={classes.warning}>
              Thời gian kết thúc không nhỏ hơn thời gian bắt đầu
            </p>
          )}
        </Grid>
        <Grid item xs={12} sm={6}>
          <p className={classes.label}>Thời gian kết thúc</p>
          <DatePicker
            variant="inline"
            fullWidth
            // disableToolbar
            emptyLabel="Tất cả"
            inputVariant="outlined"
            format="MM/dd/yyyy"
            value={dateEnd}
            onChange={(e) => {
              setDateEnd(
                new Date(
                  new Date(new Date(e.setHours(23)).setMinutes(59)).setSeconds(
                    59,
                  ),
                ).setMilliseconds(999),
              );
            }}
            inputProps={{
              style: {
                height: 5,
              },
            }}
          />
        </Grid>
      </Grid>
      <DialogActions style={{ marginTop: 36 }}>
        <BtnCancel
          onClick={() => {
            setDateEnd(null);
            setDateStart(null);
          }}
        >
          Mặc định
        </BtnCancel>
        <BtnCancel onClick={onClose}>Hủy</BtnCancel>
        <BtnSuccess
          onClick={onSubmit}
          disabled={
            startDate > dateEnd || (startDate === null && dateEnd !== null)
          }
        >
          Lọc
        </BtnSuccess>
      </DialogActions>
    </div>
  );
};

const useStyles = makeStyles(() => ({
  root: {
    padding: '0px 10px',
    '& .MuiInputBase-root': {
      height: '40px',
    },
    '& .MuiInputBase-input': {
      boxSizing: 'border-box',
      height: '100%',
    },
    '& .MuiPaper-rounded': {
      borderRadius: '8px',
    },
    '& .MuiDialogActions-root': {
      padding: '32px',
    },
  },
  label: {
    fontWeight: '500',
    height: '17px',
    lineHeight: '16px',
    fontSize: '14px',
    color: '#999999',
    margin: '5px 0',
  },
  warning: {
    fontWeight: '500',
    height: '17px',
    lineHeight: '16px',
    fontSize: '14px',
    color: '#DD0000',
    margin: '5px 0',
  },
  button: {
    padding: '12px 16px',
    border: 'none',
    outline: 'none',
    lineHeight: '16px',
    borderRadius: '8px',
    cursor: 'pointer',
    minWidth: '104px',
    boxSizing: 'border-box',
  },
  iconBtnHeader: {
    backgroundColor: 'rgba(116, 116, 128, 0.08)',
    height: 36,
    width: 36,
    borderRadius: 6,
  },
  popup: {
    zIndex: '1299 !important',
    '& .dx-popup-content': {
      padding: '0px 36px',
    },
    '& .title': {
      padding: '0px',
    },
  },
  uploadImageContainer: {
    width: '100%',
    borderRadius: '12px',
    height: '186px',
    display: 'flex',
    justifyContent: 'center',
  },
}));

export default FilterEvent;
