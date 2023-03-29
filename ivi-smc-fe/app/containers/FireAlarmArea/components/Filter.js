import { Controller, useForm } from 'react-hook-form';
import React, { useEffect } from 'react';
import { Grid, TextField } from '@material-ui/core';
import { validationSchema } from 'utils/utils';
import _ from 'lodash';
import { getApi } from 'utils/requestUtils';
import { CAMERA_API, FIRE_ALARM_API, SAP_SRC } from 'containers/apiUrl';
import { getErrorMessage } from 'containers/Common/function';
import VAutocomplete from 'components/VAutocomplete';
import BtnSuccess from '../../../components/Button/BtnSuccess';
import BtnCancel from '../../../components/Button/BtnCancel';
import { useStyles } from '../styles';

export const Filter = ({ onClose, handleChangeFilter, initValues }) => {
  const classes = useStyles();

  const schema = validationSchema({});

  const { handleSubmit, control, reset } = useForm({
    resolver: schema,
    mode: 'onChange',
  });

  const setDetailFormValue = () => {
    reset({ ...initValues });
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
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <p className={classes.label}>Tầng</p>
          <Controller
            control={control}
            name="floor"
            defaultValue=""
            render={props => (
              <VAutocomplete
                value={props.value}
                fullWidth
                noOptionsText="Không có dữ liệu"
                getOptionLabel={option => option?.floorName || ''}
                firstIndex={1}
                loadData={(page, keyword) =>
                  new Promise((resolve, reject) => {
                    const params = {
                      page,
                      searchValue: keyword,
                      limit: 50,
                      // blockId: process.env.BLOCK_ID || '',
                    };
                    getApi(`${SAP_SRC}/floors`, _.pickBy(params))
                      .then(result => {
                        const data = [...result.rows];
                        if (page === 1 && data?.length) {
                          data.unshift({ floorId: null, floorName: 'Tất cả' });
                        }
                        resolve({
                          data,
                          totalCount: result?.count + 1 || 0,
                        });
                      })
                      .catch(err => reject(getErrorMessage(err)));
                  })
                }
                getOptionSelected={(option, selected) =>
                  option.floorId === selected.floorId
                }
                onChange={(e, value) => {
                  props.onChange(value);
                }}
                renderInput={params => (
                  <TextField
                    {...params}
                    variant="outlined"
                    placeholder="Chọn tầng"
                  />
                )}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <p className={classes.label}>Camera</p>
          <Controller
            control={control}
            name="camera"
            defaultValue=""
            render={props => (
              <VAutocomplete
                value={props.value}
                fullWidth
                noOptionsText="Không có dữ liệu"
                getOptionLabel={option => option?.name || ''}
                firstIndex={1}
                loadData={(page, keyword) =>
                  new Promise((resolve, reject) => {
                    const payload = {
                      keyword,
                      pageSize: 50,
                      index: page,
                      type: 'CAMERA',
                    };
                    getApi(CAMERA_API.GET_LIST, _.pickBy(payload))
                      .then(result => {
                        const data = [...result.data.data];
                        if (page === 1 && data?.length) {
                          data.unshift({
                            id: null,
                            name: 'Tất cả',
                          });
                        }
                        resolve({
                          data,
                          totalCount: result?.data?.totalRow + 1 || 0,
                        });
                      })
                      .catch(err => reject(getErrorMessage(err)));
                  })
                }
                getOptionSelected={(option, selected) =>
                  option.id === selected.id
                }
                onChange={(e, value) => {
                  props.onChange(value);
                }}
                renderInput={params => (
                  <TextField
                    {...params}
                    variant="outlined"
                    placeholder="Chọn camera"
                  />
                )}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <p className={classes.label}>Thiết bị</p>
          <Controller
            control={control}
            name="device"
            defaultValue=""
            render={props => (
              <VAutocomplete
                value={props.value}
                fullWidth
                noOptionsText="Không có dữ liệu"
                getOptionLabel={option => option?.deviceName || ''}
                firstIndex={1}
                loadData={(page, keyword) =>
                  new Promise((resolve, reject) => {
                    const payload = {
                      limit: 50,
                      page,
                      deviceName: keyword,
                    };
                    getApi(FIRE_ALARM_API.LIST_FAS_DEVICES, _.pickBy(payload))
                      .then(result => {
                        const data = [...result.data.rows];
                        if (page === 1 && data?.length) {
                          data.unshift({
                            deviceId: null,
                            deviceName: 'Tất cả',
                          });
                        }
                        resolve({
                          data,
                          totalCount: result?.data.count + 1 || 0,
                        });
                      })
                      .catch(err => reject(getErrorMessage(err)));
                  })
                }
                getOptionSelected={(option, selected) =>
                  option.deviceId === selected.deviceId
                }
                onChange={(e, value) => {
                  props.onChange(value);
                }}
                renderInput={params => (
                  <TextField
                    {...params}
                    variant="outlined"
                    placeholder="Chọn thiết bị"
                  />
                )}
              />
            )}
          />
        </Grid>
      </Grid>
      <Grid container style={{ marginTop: '24px' }}>
        <Grid
          item
          xs={12}
          container
          direction="row"
          alignContent="center"
          justify="flex-end"
        >
          <BtnCancel onClick={onClose} style={{ marginRight: '12px' }}>
            Hủy
          </BtnCancel>
          <BtnSuccess onClick={handleSubmit(onSubmit)}>Lọc</BtnSuccess>
        </Grid>
      </Grid>
    </form>
  );
};

export default Filter;
