import { Controller, useForm } from 'react-hook-form';
import React, { useEffect } from 'react';
import { DialogActions, DialogTitle, Grid, TextField } from '@material-ui/core';
import _ from 'lodash';
import { useStyles } from '../styled';
import { SAP_SRC } from '../../apiUrl';
import VAutocomplete from '../../../components/VAutocomplete';
import { getApi } from '../../../utils/requestUtils';
import { getErrorMessage } from '../../Common/function';
import BtnCancel from '../../../components/Button/BtnCancel';
import BtnSuccess from '../../../components/Button/BtnSuccess';

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
          <p className={classes.label}>Bãi gửi xe</p>
          <Controller
            control={control}
            name="pklot"
            defaultValue=""
            render={props => (
              <VAutocomplete
                value={props.value}
                fullWidth
                noOptionsText="Không có dữ liệu"
                getOptionLabel={option => option?.pklotName || ''}
                firstIndex={1}
                loadData={(page, keyword) =>
                  new Promise((resolve, reject) => {
                    // if (!watchFields.block) {
                    //   resolve({
                    //     data: [],
                    //     totalCount: 0,
                    //   });
                    //   return;
                    // }
                    const params = {
                      page,
                      searchValue: keyword,
                      limit: 50,
                      blockId: process.env.BLOCK_ID || '',
                    };
                    getApi(`${SAP_SRC}/floors`, _.pickBy(params))
                      .then(result => {
                        //const data = [...result.rows];
                        const result2 = [
                          { pklotId: '1', pklotName: 'pklotName 1' },
                          { pklotId: '2', pklotName: 'pklotName 2' },
                          { pklotId: '3', pklotName: 'pklotName 3' },
                          { pklotId: '4', pklotName: 'pklotName 4' },
                          { pklotId: '5', pklotName: 'pklotName 5' },
                        ];
                        resolve({
                          data: [...result2],
                          totalCount: result2?.length || 0,
                        });
                      })
                      .catch(err => reject(getErrorMessage(err)));
                  })
                }
                getOptionSelected={(option, selected) =>
                  option.pklotId === selected.pklotId
                }
                onChange={(e, value) => {
                  props.onChange(value);
                }}
                renderInput={params => (
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
      </Grid>
      <DialogActions>
        <BtnCancel onClick={onClose}>Hủy</BtnCancel>
        <BtnSuccess onClick={handleSubmit(onSubmit)}>Lọc</BtnSuccess>
      </DialogActions>
    </form>
  );
};

export default FilterMap;
