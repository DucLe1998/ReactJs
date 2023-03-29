import { Controller, useForm } from 'react-hook-form';
import React, { useEffect, useState, useMemo } from 'react';
import {
  DialogActions,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  TextField,
  Button,
} from '@material-ui/core';
import * as yup from 'yup';

import { TextBox } from 'devextreme-react/text-box';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import VAutocomplete from 'components/VAutocomplete';
import { getApi, postApi, putApi } from 'utils/requestUtils';
import { validationSchema } from 'utils/utils';
import { showError, showSuccess } from 'utils/toast-utils';
import Loading from '../../Loading';
import { getErrorMessage } from '../../Common/function';
import { API_PARKING_LOT } from '../../apiUrl';
import { useStyles } from '../styled';
const initValues = {
  name: null,
  pkLot: null,
  entrypt: null,
  lane: null,
  status: { id: 'active', value: 'Hoạt động' },
  deviceType: null,
  devCfg: '{}',
  ip: null,
  mac: null,
  versions: null,
  dscr: null,
};

export const AddDevice = ({ onClose, id, setReload, filter }) => {
  const classes = useStyles();

  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState(null);
  const [pkLotId, setPkLotId] = useState();
  const [entrypId, setEntrypId] = useState();
  const [laneId, setLaneId] = useState();
  const fetchDataSource = () => {
    setLoading(true);
    getApi(`${API_PARKING_LOT.PARKING_DEVICES}/${id}`)
      .then((response) => {
        const setData = response.data;
        if (response.data?.pkLotId) {
          setData.pkLot = {
            id: response.data?.pkLotId,
            name: response.data?.pkLotName,
          };
        }
        if (response.data?.entryptId) {
          setData.entrypt = {
            id: response.data?.entryptId,
            name: response.data?.entryptName,
          };
        }
        if (response.data?.laneId) {
          setData.lane = {
            id: response.data?.laneId,
            name: response.data?.laneName,
          };
        }
        if (response.data?.swVersionId) {
          setData.versions = {
            id: response.data?.swVersionId,
            name: response.data?.swVersionName,
          };
        }
        if (response.data?.devCfg) {
          setData.devCfg = response.data?.devCfg;
        }
        setDetail(setData);
        setPkLotId(response.data?.pkLotId);
        setEntrypId(response.data?.entryptId);
        setLaneId(response.data?.laneId);
      })
      .catch((err) => {
        showError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const schema = validationSchema({
    name: yup.string().trim().nullable().required('Trường này bắt buộc nhập'),
    ip: yup
      .string()
      .nullable()
      .required('Trường này bắt buộc nhập')
      .test('is invalid', 'Địa chỉ không hợp lệ', function valid(value) {
        if (
          /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
            value,
          )
        ) {
          return true;
        }
        return false;
      }),
    deviceType: yup
      .object()
      .shape()
      .nullable()
      .required('Trường này bắt buộc nhập'),
    status: yup
      .object()
      .shape()
      .nullable()
      .required('Trường này bắt buộc nhập'),
    lane: yup.object().shape().nullable().required('Trường này bắt buộc nhập'),
    entrypt: yup
      .object()
      .shape()
      .nullable()
      .required('Trường này bắt buộc nhập'),
    pkLot: yup.object().shape().nullable().required('Trường này bắt buộc nhập'),
    devCfg: yup
      .string()
      .nullable()
      .test('isObject', 'Cấu hình không hợp lệ', function valid(value) {
        if (value) {
          try {
            JSON.parse(value);
          } catch (e) {
            return false;
          }
          return true;
        }
        return true;
      }),
  });
  const {
    handleSubmit,
    control,
    setError,
    setValue,
    getValues,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: initValues,
    resolver: schema,
  });

  useEffect(() => {
    if (id) {
      fetchDataSource();
    }
  }, [id]);
  const setDetailFormValue = () => {
    if (detail?.name) {
      reset(detail);
    } else {
      reset(initValues);
    }
  };

  useEffect(() => {
    if (detail) {
      setDetailFormValue();
    }
  }, [detail]);
  useEffect(() => {
    reset({ ...initValues, ...filter });
  }, [filter]);
  const onSubmit = (values) => {
    setLoading(true);
    const params = {
      name: values.name,
      pkLotName: values?.pkLot?.name,
      pkLotId: values?.pkLot?.id,
      entryptName: values?.entrypt?.name,
      entryptId: values?.entrypt?.id,
      laneId: values?.lane?.id,
      laneName: values?.lane?.name,
      status: values?.status,
      mac: values?.mac,
      ip: values?.ip,
      deviceType: values?.deviceType,
      devCfg: values?.devCfg ? values?.devCfg : '',
      swVersionId: values?.versions?.id,
      swVersionName: values?.versions?.name,
      dscr: values?.dscr,
    };
    if (id) handleUpdate(params);
    else handleAdd(params);
  };
  const handleAdd = (params) => {
    setLoading(true);
    postApi(API_PARKING_LOT.PARKING_DEVICES, params)
      .then(() => {
        showSuccess('Thêm mới thành công', {
          text: 'Dữ liệu đã được cập nhật',
        });
        setReload();
        onClose();
      })
      .catch((err) => {
        showError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const handleUpdate = (params) => {
    setLoading(true);
    putApi(`${API_PARKING_LOT.PARKING_DEVICES}/${id}`, params)
      .then(() => {
        showSuccess('Cập nhật thành công', {
          text: 'Dữ liệu đã được cập nhật',
        });
        setReload();
        onClose();
      })
      .catch((err) => {
        showError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  let timeout = useMemo(() => undefined, []);
  const debounceSearchName = (value) => {
    // eslint-disable-next-line no-unused-expressions
    // clearTimeout(timeout);
    timeout = setTimeout(() => {
      if (!value) return;
      postApi(`${API_PARKING_LOT.PARKING_DEVICES}/checkname`, { name: value })
        .then((res) => {
          if (res?.existed) {
            setError('name', { message: 'Dữ liệu đã tồn tại trong hệ thống.' });
          }
        })
        .catch((err) => {
          showError(err);
        });
    }, 500);
  };
  const setConfigDevice = () => {
    getApi(`${API_PARKING_LOT.GET_DATA_CONFIG('devices')}`, {
      typeId: getValues().deviceType ? getValues().deviceType.id : '',
    })
      .then((result) => {
        setValue('devCfg', JSON.stringify(result, null, 2));
      })
      .catch((err) => showError(err));
  };
  return (
    <form className={classes.modal}>
      {loading && <Loading />}

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <FormControl error={errors.name} fullWidth>
            <FormLabel required>Tên thiết bị</FormLabel>
            <Controller
              control={control}
              name="name"
              render={(props) => (
                <TextField
                  autoComplete="off"
                  inputProps={{ maxLength: 50 }}
                  fullWidth
                  placeholder="Nhập tên thiết bị"
                  value={props.value}
                  onChange={(e) => {
                    clearErrors('name');
                    props.onChange(e.target.value.replace(/\s/g, ''));
                    debounceSearchName(e.target.value.replace(/\s/g, ''));
                  }}
                  variant="outlined"
                  size="small"
                  error={errors.name}
                  helperText={errors.name?.message}
                />
              )}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl error={errors.deviceType} fullWidth>
            <FormLabel required>Loại thiết bị</FormLabel>
            <Controller
              control={control}
              name="deviceType"
              render={(props) => (
                <VAutocomplete
                  value={props.value}
                  fullWidth
                  placeholder="Chọn loại thiết bị"
                  noOptionsText="Không có dữ liệu"
                  getOptionLabel={(option) => option?.value}
                  firstIndex={1}
                  getOptionSelected={(option, selected) =>
                    option?.id == selected?.id
                  }
                  loadData={() =>
                    new Promise((resolve, reject) => {
                      getApi(`${API_PARKING_LOT.GET_DATA_TYPE('devices')}`)
                        .then((result) => {
                          resolve({
                            data: [...result.deviceType],
                            totalCount: result?.deviceType?.length || 0,
                          });
                        })
                        .catch((err) => reject(err));
                    })
                  }
                  onChange={(e, value) => {
                    props.onChange(value);
                    setConfigDevice();
                  }}
                  disabled={Boolean(filter?.deviceType)}
                />
              )}
            />
            {errors.deviceType && (
              <FormHelperText>{errors.deviceType?.message}</FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl error={errors.ip} fullWidth>
            <FormLabel required>Địa chỉ IP thiết bị</FormLabel>
            <Controller
              control={control}
              name="ip"
              render={(props) => (
                <TextField
                  autoComplete="off"
                  fullWidth
                  placeholder="Nhập địa chỉ IP thiết bị"
                  value={props.value}
                  onChange={(e) => {
                    props.onChange(e.target.value);
                  }}
                  variant="outlined"
                  size="small"
                  error={errors.ip}
                  helperText={errors.ip?.message}
                />
              )}
            />
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl error={errors.status} fullWidth>
            <FormLabel required> Trạng thái</FormLabel>
            <Controller
              control={control}
              name="status"
              render={(props) => (
                <VAutocomplete
                  value={props.value}
                  fullWidth
                  placeholder="Trạng thái"
                  // disabled={!watchFields.block}
                  // disableClearable
                  noOptionsText="Không có dữ liệu"
                  getOptionLabel={(option) => option?.value}
                  firstIndex={1}
                  getOptionSelected={(option, selected) =>
                    option?.id == selected?.id
                  }
                  loadData={() =>
                    new Promise((resolve, reject) => {
                      getApi(`${API_PARKING_LOT.GET_DATA_STATE('devices')}`)
                        .then((result) => {
                          resolve({
                            data: [...result.statusType],
                            totalCount: result?.statusType?.length || 0,
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
            {errors.status && (
              <FormHelperText>{errors.status?.message}</FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormLabel>Địa chỉ MAC</FormLabel>
          <Controller
            control={control}
            name="mac"
            render={(props) => (
              <TextBox
                maxLength="50"
                width="100%"
                placeholder="Nhập địa chỉ MAC"
                value={props.value}
                onValueChanged={(e) => {
                  props.onChange(e.value);
                  // setValue('area',e.value)
                }}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl error={errors.pkLot} fullWidth>
            <FormLabel required>Bãi gửi xe</FormLabel>
            <Controller
              control={control}
              name="pkLot"
              defaultValue=""
              render={(props) => (
                <VAutocomplete
                  value={props.value}
                  fullWidth
                  placeholder="Chọn bãi gửi xe"
                  noOptionsText="Không có dữ liệu"
                  getOptionLabel={(option) => option?.name || ''}
                  firstIndex={1}
                  getOptionSelected={(option, selected) =>
                    option.id == selected.id
                  }
                  loadData={(page, keyword) =>
                    new Promise((resolve, reject) => {
                      getApi(`${API_PARKING_LOT.PARKING_LOT}`, {
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
                        .catch((err) => reject(err));
                    })
                  }
                  onChange={(e, value) => {
                    setPkLotId(value?.id);
                    setValue('entrypt', null);
                    setValue('lane', null);
                    props.onChange(value);
                  }}
                  disabled={Boolean(filter?.pkLot)}
                />
              )}
            />
            {errors.pkLot && (
              <FormHelperText>{errors.pkLot?.message}</FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl error={errors.entrypt} fullWidth>
            <FormLabel required>Entry point</FormLabel>
            <Controller
              control={control}
              name="entrypt"
              defaultValue=""
              render={(props) => (
                <VAutocomplete
                  value={props.value}
                  fullWidth
                  placeholder="Chọn entry point"
                  noOptionsText="Không có dữ liệu"
                  getOptionLabel={(option) => option?.name || ''}
                  firstIndex={1}
                  getOptionSelected={(option, selected) =>
                    option.id == selected.id
                  }
                  loadData={(page, keyword) =>
                    new Promise((resolve, reject) => {
                      getApi(`${API_PARKING_LOT.PARKING_ENTRY_POINTS}`, {
                        infoLevel: 'basic',
                        pkLotId: pkLotId || filter?.pkLot?.id,
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
                        .catch((err) => reject(err));
                    })
                  }
                  onChange={(e, value) => {
                    setEntrypId(value?.id);
                    setValue('lane', null);
                    props.onChange(value);
                  }}
                  disabled={Boolean(filter?.entrypt)}
                />
              )}
            />
            {errors.entrypt && (
              <FormHelperText>{errors.entrypt?.message}</FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl error={errors.lane} fullWidth>
            <FormLabel required>Làn xe</FormLabel>
            <Controller
              control={control}
              name="lane"
              defaultValue=""
              render={(props) => (
                <VAutocomplete
                  value={props.value}
                  fullWidth
                  placeholder="Chọn làn xe"
                  noOptionsText="Không có dữ liệu"
                  getOptionLabel={(option) => option?.name || ''}
                  firstIndex={1}
                  getOptionSelected={(option, selected) =>
                    option.id == selected.id
                  }
                  loadData={(page, keyword) =>
                    new Promise((resolve, reject) => {
                      getApi(`${API_PARKING_LOT.PARKING_LANES}`, {
                        infoLevel: 'basic',
                        pkLotId: pkLotId || filter?.pkLot?.id,
                        entryptId: entrypId || filter?.entrypt?.id,
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
                        .catch((err) => reject(err));
                    })
                  }
                  onChange={(e, value) => {
                    props.onChange(value);
                  }}
                  disabled={Boolean(filter?.lane)}
                />
              )}
            />
            {errors.lane && (
              <FormHelperText>{errors.lane?.message}</FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <FormLabel>Phiên bản phần mềm</FormLabel>
            <Controller
              control={control}
              name="versions"
              defaultValue=""
              render={(props) => (
                <VAutocomplete
                  value={props.value}
                  fullWidth
                  placeholder="Chọn phiên bản phần mềm"
                  noOptionsText="Không có dữ liệu"
                  getOptionLabel={(option) => option?.name || ''}
                  firstIndex={1}
                  getOptionSelected={(option, selected) =>
                    option.id == selected.id
                  }
                  loadData={(page, keyword) =>
                    new Promise((resolve, reject) => {
                      getApi(`${API_PARKING_LOT.PARKING_VERSIONS}`, {
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
                        .catch((err) => reject(err));
                    })
                  }
                  onChange={(e, value) => {
                    props.onChange(value);
                  }}
                />
              )}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <FormLabel>Mô tả</FormLabel>
            <Controller
              control={control}
              name="dscr"
              render={(props) => (
                <TextField
                  autoComplete="off"
                  inputProps={{ maxLength: 50 }}
                  fullWidth
                  placeholder="Nhập mô tả"
                  value={props.value}
                  onChange={(e) => {
                    props.onChange(e.target.value);
                  }}
                  variant="outlined"
                  size="small"
                />
              )}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl error={errors.devCfg} fullWidth>
            <FormLabel>Cấu hình</FormLabel>
            <Controller
              control={control}
              name="devCfg"
              render={(props) => (
                <TextareaAutosize
                  placeholder="//Cấu hình"
                  minRows={8}
                  value={props.value}
                  onChange={(e) => {
                    if (e.target.value) {
                      setValue('devCfg', e.target.value);
                    } else {
                      setValue('devCfg', '{}');
                    }
                  }}
                  style={{
                    width: '100%',
                    height: '70%',
                    border: '0.5px solid #E0E0E0',
                    padding: '8px 8px',
                    marginBottom: '10px',
                    overflow: 'scroll-y',
                  }}
                />
              )}
            />
            {errors.devCfg && (
              <FormHelperText style={{ color: '#FF0707' }}>
                {errors.devCfg?.message}
              </FormHelperText>
            )}
          </FormControl>
          {/* <Button
            onClick={() => {
              getApi(`${API_PARKING_LOT.GET_DATA_CONFIG('devices')}`)
                .then((result) => {
                  setValue('devCfg', JSON.stringify(result, null, 2));
                })
                .catch((err) => showError(err));
            }}
            variant="outlined"
            color="primary"
            style={{ marginRight: '10px' }}
          >
            Tải cấu hình
          </Button> */}
          <Button onClick={setConfigDevice} variant="outlined" color="primary">
            Cấu hình mặc định
          </Button>
        </Grid>
      </Grid>
      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Hủy
        </Button>
        <Button
          onClick={handleSubmit(onSubmit)}
          variant="contained"
          color="primary"
        >
          {id ? 'Lưu' : 'Thêm'}
        </Button>
      </DialogActions>
    </form>
  );
};

export default AddDevice;
