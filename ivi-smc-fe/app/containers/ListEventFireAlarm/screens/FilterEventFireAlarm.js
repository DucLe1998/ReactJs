import { Controller, useForm } from 'react-hook-form';
import React, { useEffect } from 'react';
import { DialogActions, Grid, TextField } from '@material-ui/core';
import _ from 'lodash';
import { DateBox } from 'devextreme-react';
import { useStyles } from '../styled';
import { SAP_SRC } from '../../apiUrl';
import VAutocomplete from '../../../components/VAutocomplete';
import { getApi } from '../../../utils/requestUtils';
import { getErrorMessage } from '../../Common/function';
import BtnCancel from '../../../components/Button/BtnCancel';
import BtnSuccess from '../../../components/Button/BtnSuccess';

export const FilterEventFireAlarm = ({
  onClose,
  handleChangeFilter,
  initValues,
}) => {
  const classes = useStyles();

  const { handleSubmit, control, reset, getValues, watch } = useForm({
    defaultValues: initValues,
  });

  const setDetailFormValue = () => {
    reset({
      deviceType: initValues.deviceType,
      eventType: initValues.eventType,
      zone: initValues.zone,
      block: initValues.block,
      functionLocation: initValues.functionLocation,
      fromDate: initValues.fromDate,
      toDate: initValues.toDate,
    });
  };

  useEffect(() => {
    setDetailFormValue();
  }, [initValues]);

  const onSubmit = values => {
    handleChangeFilter(values);
    onClose();
  };

  const resetFilter = () => {
    reset({
      deviceType: null,
      eventType: null,
      zone: null,
      block: null,
      functionLocation: null,
      fromDate: null,
      toDate: null,
    });
  };

  //   const watchFields = watch([
  //     'deviceType',
  //     'eventType',
  //     'zone',
  //     'block',
  //     'functionLocation',
  //     'fromDate',
  //     'toDate',
  //   ]);

  return (
    <form className={classes.root}>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <p className={classes.label}>Loại thiết bị</p>
          <Controller
            control={control}
            name="deviceType"
            render={props => (
              <VAutocomplete
                value={props.value || []}
                fullWidth
                virtual={false}
                multiple
                limitTags={3}
                noOptionsText="Không có dữ liệu"
                getOptionLabel={option => option?.areaName || ''}
                firstIndex={1}
                loadData={() =>
                  new Promise((resolve, reject) => {
                    getApi(`${SAP_SRC}/area`) // TODO -> define API
                      .then(result => {
                        const data = [...result.rows];
                        resolve({
                          data,
                          totalCount: result?.count,
                        });
                      })
                      .catch(err => reject(getErrorMessage(err)));
                  })
                }
                getOptionSelected={(option, selected) =>
                  option.areaId === selected.areaId
                }
                onChange={(e, value) => {
                  props.onChange(value);
                }}
                renderInput={params => (
                  <TextField
                    {...params}
                    variant="outlined"
                    placeholder="Chọn loại thiết bị"
                  />
                )}
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <p className={classes.label}>Loại sự kiện</p>
          <Controller
            control={control}
            name="eventType"
            defaultValue=""
            render={props => (
              <VAutocomplete
                value={props.value || []}
                fullWidth
                virtual={false}
                multiple
                limitTags={3}
                noOptionsText="Không có dữ liệu"
                getOptionLabel={option => option?.zoneName || ''}
                firstIndex={1}
                loadData={() =>
                  new Promise((resolve, reject) => {
                    getApi(`${SAP_SRC}/zones`) // TODO -> define API
                      .then(result => {
                        const data = [...result];
                        resolve({
                          data,
                          totalCount: data?.length || 0,
                        });
                      })
                      .catch(err => reject(getErrorMessage(err)));
                  })
                }
                getOptionSelected={(option, selected) =>
                  option.zoneId === selected.zoneId
                }
                onChange={(e, value) => {
                  props.onChange(value);
                }}
                renderInput={params => (
                  <TextField
                    {...params}
                    variant="outlined"
                    placeholder="Chọn loại sự kiện"
                  />
                )}
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <p className={classes.label}>Phân khu</p>
          <Controller
            control={control}
            name="zone"
            render={props => (
              <VAutocomplete
                value={props.value || []}
                fullWidth
                virtual={false}
                multiple
                limitTags={3}
                noOptionsText="Không có dữ liệu"
                getOptionLabel={option => option?.zoneName || ''}
                firstIndex={1}
                loadData={() =>
                  new Promise((resolve, reject) => {
                    getApi(`${SAP_SRC}/zones`) // TODO -> search all or search by params
                      .then(result => {
                        const data = [...result];
                        resolve({
                          data,
                          totalCount: data?.length || 0,
                        });
                      })
                      .catch(err => reject(getErrorMessage(err)));
                  })
                }
                getOptionSelected={(option, selected) =>
                  option.zoneId === selected.zoneId
                }
                onChange={(e, value) => {
                  props.onChange(value);
                }}
                renderInput={params => (
                  <TextField
                    {...params}
                    variant="outlined"
                    placeholder="Chọn phân khu"
                  />
                )}
              />
            )}
            VAutocomple
          />
        </Grid>
        <Grid item xs={12}>
          <p className={classes.label}>Tòa nhà</p>
          <Controller
            control={control}
            name="block"
            render={props => (
              <VAutocomplete
                value={props.value || []}
                fullWidth
                virtual={false}
                multiple
                limitTags={3}
                noOptionsText="Không có dữ liệu"
                getOptionLabel={option => option?.blockName || ''}
                firstIndex={1}
                loadData={() =>
                  new Promise((resolve, reject) => {
                    getApi(`${SAP_SRC}/blocks`) // TODO -> search all or search by params
                      .then(result => {
                        const data = [...result.rows];
                        resolve({
                          data,
                          totalCount: result?.count,
                        });
                      })
                      .catch(err => reject(getErrorMessage(err)));
                  })
                }
                getOptionSelected={(option, selected) =>
                  option.blockId === selected.blockId
                }
                onChange={(e, value) => {
                  props.onChange(value);
                }}
                renderInput={params => (
                  <TextField
                    {...params}
                    variant="outlined"
                    placeholder="Chọn tòa nhà"
                  />
                )}
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <p className={classes.label}>Khu tiện ích</p>
          <Controller
            control={control}
            name="functionLocation"
            render={props => (
              <VAutocomplete
                value={props.value || []}
                fullWidth
                virtual={false}
                multiple
                limitTags={3}
                noOptionsText="Không có dữ liệu"
                getOptionLabel={option => option?.functionLocationName || ''}
                firstIndex={1}
                loadData={() =>
                  new Promise((resolve, reject) => {
                    getApi(`${SAP_SRC}/functions`) // TODO -> search all or search by params
                      .then(result => {
                        const data = [...result.rows];
                        resolve({
                          data,
                          totalCount: result?.count,
                        });
                      })
                      .catch(err => reject(getErrorMessage(err)));
                  })
                }
                getOptionSelected={
                  (option, selected) =>
                    option.functionLocationCode ===
                    selected.functionLocationCode // TODO -> id or functionLocationCode
                }
                onChange={(e, value) => {
                  props.onChange(value);
                }}
                renderInput={params => (
                  <TextField
                    {...params}
                    variant="outlined"
                    placeholder="Chọn khu tiện ích"
                  />
                )}
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <p className={classes.label}>Từ ngày</p>
          <Controller
            control={control}
            name="fromDate"
            render={props => (
              <DateBox // TODO -> are there dates disabled ?
                type="date"
                value={props.value}
                onValueChanged={e => props.onChange(e.value)}
                placeholder="Chọn ngày"
                openOnFieldClick
                acceptCustomValue={false}
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <p className={classes.label}>Đến ngày</p>
          <Controller // TODO -> are there dates disabled ?
            control={control}
            name="toDate"
            defaultValue=""
            render={props => (
              <DateBox
                type="date"
                value={props.value}
                onValueChanged={e => props.onChange(e.value)}
                placeholder="Chọn ngày"
                openOnFieldClick
                acceptCustomValue={false}
              />
            )}
          />
        </Grid>
      </Grid>
      <DialogActions>
        <div style={{ width: '50%' }}>
          <BtnSuccess onClick={resetFilter}>Bỏ điều kiện</BtnSuccess>
        </div>
        <div
          style={{
            width: '50%',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <BtnCancel onClick={onClose}>Hủy</BtnCancel>
          <BtnSuccess onClick={handleSubmit(onSubmit)}>Lọc</BtnSuccess>
        </div>
      </DialogActions>
    </form>
  );
};

export default FilterEventFireAlarm;
