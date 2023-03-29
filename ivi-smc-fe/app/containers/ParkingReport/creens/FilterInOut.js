import { Controller, useForm } from 'react-hook-form';
import React, { useEffect, useState } from 'react';
import {
  DialogActions,
  TextField,
  Button,
  FormControl,
  FormLabel,
  Grid,
} from '@material-ui/core';
import _ from 'lodash';
import { API_PARKING_LOT } from 'containers/apiUrl';
import {
  KeyboardDatePicker,
  KeyboardDateTimePicker,
  TimePicker,
} from '@material-ui/pickers';
import { useStyles } from '../styled';
import VAutocomplete from '../../../components/VAutocomplete';
import { getApi } from '../../../utils/requestUtils';
import { getErrorMessage } from '../../Common/function';
export const FilterTimes = ({ onClose, handleChangeFilter, initValues }) => {
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
            name="pkLot"
            render={(props) => (
              <VAutocomplete
                value={props.value}
                fullWidth
                // disabled={!watchFields.block}
                // disableClearable
                noOptionsText="Không có dữ liệu"
                getOptionLabel={(option) => option?.name || ''}
                firstIndex={1}
                getOptionSelected={(option, selected) =>
                  option.id == selected.id
                }
                loadData={() =>
                  new Promise((resolve, reject) => {
                    getApi(`${API_PARKING_LOT.PARKING_LOT}`, {
                      infoLevel: 'basic',
                    })
                      .then((result) => {
                        resolve({
                          data: [...result.data],
                          totalCount: result.data?.length || 0,
                        });
                      })
                      .catch((err) => reject(getErrorMessage(err)));
                  })
                }
                onChange={(e, value) => {
                  props.onChange(value);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    placeholder="Chọn bãi gửi xe"
                  />
                )}
              />
            )}
          />
        </Grid>
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
                placeholder="Thời gian bắt đầu"
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
                placeholder="Thời gian kết thúc"
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

export default FilterTimes;
