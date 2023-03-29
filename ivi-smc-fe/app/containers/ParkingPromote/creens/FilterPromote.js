import { Controller, useForm } from 'react-hook-form';
import React, { useEffect } from 'react';
import { DialogActions, DialogTitle, Grid, Button } from '@material-ui/core';
import _ from 'lodash';
import { API_PARKING_LOT } from 'containers/apiUrl';
import { NumberBox } from 'devextreme-react/number-box';
import { useStyles } from '../styled';
import VAutocomplete from '../../../components/VAutocomplete';
import { getApi } from '../../../utils/requestUtils';
import { getErrorMessage } from '../../Common/function';
export const FilterPromote = ({ onClose, handleChangeFilter, initValues }) => {
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
      {/* <DialogTitle className="title">Lọc danh sách entry point</DialogTitle> */}
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <p className={classes.label}>Số tiền nhỏ nhất</p>
          <Controller
            control={control}
            name="moneyMin"
            render={(props) => (
              <NumberBox
                value={props.value}
                defaultValue={props.value}
                format="#,##0 VNĐ"
                onValueChange={(values) => {
                  props.onChange(values);
                }}
                variant="outlined"
                size="small"
              />
            )}
          />
        </Grid>
        <Grid item xs={6}>
          <p className={classes.label}>Số tiền lớn nhất</p>
          <Controller
            control={control}
            name="moneyMax"
            render={(props) => (
              <NumberBox
                value={props.value}
                defaultValue={props.value}
                format="#,##0 VNĐ"
                onValueChange={(values) => {
                  props.onChange(values);
                }}
                variant="outlined"
                size="small"
              />
            )}
          />
        </Grid>
        <Grid item xs={6}>
          <p className={classes.label}>Trạng thái sử dụng</p>
          <Controller
            control={control}
            name="state"
            render={(props) => (
              <VAutocomplete
                value={props.value}
                fullWidth
                placeholder="Trạng thái"
                noOptionsText="Không có dữ liệu"
                getOptionLabel={(option) => option?.value}
                firstIndex={1}
                getOptionSelected={(option, selected) =>
                  option?.id == selected?.id
                }
                loadData={() =>
                  new Promise((resolve, reject) => {
                    getApi(`${API_PARKING_LOT.GET_DATA_STATE('promotes')}`)
                      .then((result) => {
                        resolve({
                          data: [...result.stateType],
                          totalCount: result?.stateType?.length || 0,
                        });
                      })
                      .catch((err) => reject(getErrorMessage(err)));
                  })
                }
                onChange={(e, value) => {
                  props.onChange(value);
                }}
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

export default FilterPromote;
