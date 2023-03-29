import { Controller, useForm } from 'react-hook-form';
import React, { useEffect } from 'react';
import { DialogActions, DialogTitle, Grid, TextField } from '@material-ui/core';
import _ from 'lodash';
import { useStyles } from '../styled';
import VAutocomplete from '../../../components/VAutocomplete';
import { getApi } from '../../../utils/requestUtils';
import { getErrorMessage } from '../../Common/function';
import BtnCancel from '../../../components/Button/BtnCancel';
import BtnSuccess from '../../../components/Button/BtnSuccess';
import { API_PARKING_LOT } from 'containers/apiUrl';

export const FilterMap = ({ onClose, handleChangeFilter, initValues }) => {
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

  const onSubmit = values => {
    handleChangeFilter(values);
    onClose();
  };


  return (
    <form className={classes.root}>
      {/* <DialogTitle className="title">Lọc danh sách entry point</DialogTitle> */}
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <p className={classes.label}>Rule</p>
          <Controller
            control={control}
            name="rule"
            defaultValue=""
            render={props => (
              <VAutocomplete
                value={props.value}
                fullWidth
                placeholder="Chọn rule"
                noOptionsText="Không có dữ liệu"
                getOptionLabel={(option) => option?.name || ''}
                firstIndex={1}
                getOptionSelected={(option, selected) =>
                  option.id == selected.id
                }
                loadData={(page, keyword) =>
                  new Promise((resolve, reject) => {
                    getApi(`${API_PARKING_LOT.PARKING_RULES}`, {
                      infoLevel: 'basic',
                      limit: 50,
                      page,
                      keyword,
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
              />
            )}
          />
        </Grid>
      </Grid>
      <DialogActions>
        <BtnCancel onClick={onClose}>Hủy</BtnCancel>
        <BtnSuccess onClick={handleSubmit(onSubmit)}>Lọc</BtnSuccess>
      </DialogActions>
    </form>
  );
};

export default FilterMap;
