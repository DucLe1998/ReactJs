import { Controller, useForm } from 'react-hook-form';
import React, { useEffect, useState, useMemo } from 'react';
import {
  DialogActions,
  FormHelperText,
  FormLabel,
  Grid,
  TextField,
  Button,
  FormControl,
} from '@material-ui/core';
import * as yup from 'yup';

import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import VAutocomplete from 'components/VAutocomplete';
import { getApi, postApi, putApi } from 'utils/requestUtils';
import { validationSchema } from 'utils/utils';
import { showError, showSuccess } from 'utils/toast-utils';
import BtnSuccess from 'components/Button/BtnSuccess';
import Loading from '../../Loading';
import { getErrorMessage } from '../../Common/function';
import { API_PARKING_LOT } from '../../apiUrl';
import { useStyles } from '../styled';

const initValues = {
  name: null,
  ip: null,
  pkLot: null,
  status: { id: 'active', value: 'Hoạt động' },
  versions: null,
  progCfg: '{}',
  ip: null,
};

export const AddEntryPoint = ({ onClose, id, setReload, filter }) => {
  const classes = useStyles();

  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState(null);
  const [fileUploadName, setFileUploadName] = useState('');
  const [fileUploadError, setFileUploadError] = useState('');
  const fetchDataSource = () => {
    setLoading(true);
    getApi(`${API_PARKING_LOT.PARKING_ENTRY_POINTS}/${id}`)
      .then((response) => {
        const setData = response.data;
        if (response.data?.pkLotId) {
          setData.pkLot = {
            id: response.data?.pkLotId,
            name: response.data?.pkLotName,
          };
        }
        if (response.data?.swVersionId) {
          setData.versions = {
            id: response.data?.swVersionId,
            name: response.data?.swVersionName,
          };
        }
        if (response.data?.progCfg) {
          setData.progCfg = JSON.stringify(response.data?.progCfg, null, 2);
        }
        setDetail(setData);
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
      .trim()
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
    pkLot: yup.object().nullable().required('Trường này bắt buộc nhập'),
    status: yup.object().nullable().required('Trường này bắt buộc nhập'),
    progCfg: yup
      .string()
      .nullable()
      .test('isObject', 'Cấu hình không hợp lệ', function valid(value) {
        try {
          JSON.parse(value);
        } catch (e) {
          return false;
        }
        return true;
      }),
  });
  const {
    handleSubmit,
    control,
    getValues,
    watch,
    setError,
    setValue,
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
      status: values?.status,
      progCfg: values?.progCfg ? JSON.parse(values?.progCfg) : '{}',
      swVersionId: values?.versions?.id,
      swVersionName: values?.versions?.name,
      ip: values.ip,
    };
    if (id) handleUpdate(params);
    else handleAdd(params);
  };
  const handleAdd = (params) => {
    setLoading(true);
    postApi(API_PARKING_LOT.PARKING_ENTRY_POINTS, params)
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
    putApi(`${API_PARKING_LOT.PARKING_ENTRY_POINTS}/${id}`, params)
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
      postApi(`${API_PARKING_LOT.PARKING_ENTRY_POINTS}/checkname`, {
        name: value,
      })
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
  return (
    <form className={classes.modal}>
      {loading && <Loading />}

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <FormControl error={errors.name} fullWidth>
            <FormLabel required>Tên entry point</FormLabel>
            <Controller
              control={control}
              name="name"
              render={(props) => (
                <TextField
                  autoComplete="off"
                  inputProps={{ maxLength: 50 }}
                  fullWidth
                  placeholder="Nhập tên entry point"
                  value={props.value}
                  onChange={(e) => {
                    clearErrors('name');
                    props.onChange(e.target.value.replace(/\s/g, ''));
                    debounceSearchName(e.target.value.replace(/\s/g, ''));
                  }}
                  error={errors.name}
                  helperText={errors.name?.message}
                  variant="outlined"
                  size="small"
                />
              )}
            />
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl error={errors.pkLot} fullWidth>
            <FormLabel required>Tên bãi gửi xe</FormLabel>
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
          <FormControl error={errors.status} fullWidth>
            <FormLabel required>Trạng thái</FormLabel>
            <Controller
              control={control}
              name="status"
              render={(props) => (
                <VAutocomplete
                  value={props.value}
                  disabled
                  placeholder="Trạng thái"
                  fullWidth
                  noOptionsText="Không có dữ liệu"
                  getOptionLabel={(option) => option?.value}
                  firstIndex={1}
                  getOptionSelected={(option, selected) =>
                    option?.id == selected?.id
                  }
                  loadData={() =>
                    new Promise((resolve, reject) => {
                      getApi(`${API_PARKING_LOT.GET_DATA_STATE('entrypts')}`)
                        .then((result) => {
                          resolve({
                            data: [...result.statusType],
                            totalCount: result?.statusType?.length || 0,
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
            {errors.status && (
              <FormHelperText>{errors.status?.message}</FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl error={errors.ip} fullWidth>
            <FormLabel required>Địa chỉ IP</FormLabel>
            <Controller
              control={control}
              name="ip"
              render={(props) => (
                <TextField
                  autoComplete="off"
                  maxLength="50"
                  fullWidth
                  placeholder="Nhập địa chỉ IP"
                  value={props.value}
                  onChange={(e) => {
                    props.onChange(e.target.value);
                  }}
                  error={errors.ip}
                  helperText={errors.ip?.message}
                  variant="outlined"
                  size="small"
                />
              )}
            />
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
        <Grid item xs={12}>
          <FormControl error={errors.devCfg} fullWidth>
            <FormLabel>Cấu hình</FormLabel>
            <Controller
              control={control}
              name="progCfg"
              render={(props) => (
                <TextareaAutosize
                  placeholder="//Cấu hình"
                  minRows={8}
                  value={props.value}
                  onChange={(e) => {
                    if (e.target.value) {
                      setValue('progCfg', e.target.value);
                    } else {
                      setValue('progCfg', '{}');
                    }
                  }}
                  style={{
                    width: '100%',
                    height: '70%',
                    border: '0.5px solid #E0E0E0',
                    padding: '8px 8px',
                    marginBottom: '10px',
                  }}
                />
              )}
            />
            {errors.progCfg && (
              <FormHelperText style={{ color: '#FF0707' }}>
                {errors.progCfg?.message}
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
          <Button
            onClick={() => {
              getApi(`${API_PARKING_LOT.GET_DATA_CONFIG('entrypts')}`)
                .then((result) => {
                  setValue('progCfg', JSON.stringify(result, null, 2));
                })
                .catch((err) => showError(err));
            }}
            variant="outlined"
            color="primary"
          >
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

export default AddEntryPoint;
