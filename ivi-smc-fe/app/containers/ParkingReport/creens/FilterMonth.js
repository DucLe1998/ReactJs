import { Controller, useForm } from 'react-hook-form';
import React, { useEffect } from 'react';
import { DialogActions, TextField, Button, Grid } from '@material-ui/core';
import _ from 'lodash';
import { API_PARKING_LOT } from 'containers/apiUrl';
import { KeyboardDateTimePicker } from '@material-ui/pickers';
import { useStyles } from '../styled';
import VAutocomplete from '../../../components/VAutocomplete';
import { getApi } from '../../../utils/requestUtils';
import { getErrorMessage } from '../../Common/function';
export const FilterMonth = ({ onClose, handleChangeFilter, initValues }) => {
  const classes = useStyles();

  const { handleSubmit, control, reset, getValues, watch } = useForm({
    defaultValues: initValues,
  });

  const setDetailFormValue = () => {
    reset(initValues);
  };

  useEffect(() => {
    setDetailFormValue();
  }, [initValues]);

  const onSubmit = (values) => {
    handleChangeFilter(values);
    onClose();
  };
  return (
    <form className={classes.root}>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Controller
            control={control}
            name="timeFrom"
            render={(props) => (
              <KeyboardDateTimePicker
                id="manageGuest-dialogFilter"
                size="small"
                autoOk
                variant="inline"
                fullWidth
                placeholder="Từ"
                name="fromTime"
                value={props.value || null}
                onChange={(e) => {
                  props.onChange(e);
                }}
                inputVariant="outlined"
                format="hh:mm dd/MM/yyyy"
              />
            )}
          />
        </Grid>
        <Grid item xs={6}>
          <Controller
            control={control}
            name="timeTo"
            render={(props) => (
              <KeyboardDateTimePicker
                id="manageGuest-dialogFilter"
                size="small"
                autoOk
                variant="inline"
                fullWidth
                placeholder="Đến"
                name="timeTo"
                value={props.value || null}
                onChange={(e) => {
                  props.onChange(e);
                }}
                inputVariant="outlined"
                format="hh:mm dd/MM/yyyy"
              />
            )}
          />
        </Grid>
      </Grid>
      <DialogActions>
        <Button variant="contained" onClick={onClose}>
          Hủy
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit(onSubmit)}
        >
          Lọc
        </Button>
      </DialogActions>
    </form>
  );
};

export default FilterMonth;
