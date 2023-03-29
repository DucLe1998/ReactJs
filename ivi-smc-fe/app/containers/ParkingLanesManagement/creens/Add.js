import { Controller, useForm } from 'react-hook-form';
import React, { Fragment, useEffect, useState, useMemo } from 'react';
import DragdropBG from 'images/dragndrop-1.svg';
import ClearIcon from '@material-ui/icons/Clear';
import {
  DialogActions,
  DialogTitle,
  FormLabel,
  FormHelperText,
  Grid,
  TextField,
  FormControl,
  Button,
} from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import * as yup from 'yup';
import styled from 'styled-components';
import FileUploader from 'devextreme-react/file-uploader';
import DatePicker from 'components/DatePicker';

import { TextBox } from 'devextreme-react/text-box';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import { useStyles } from '../styled';
import { API_PARKING_LOT, API_ROUTE, SAP_SRC } from '../../apiUrl';
import VAutocomplete from '../../../components/VAutocomplete';
import MultiSelect from '../../../components/MultiSelect';
import {
  callApiWithConfig,
  getApi,
  METHODS,
  postApi,
  putApi,
} from '../../../utils/requestUtils';
import { getErrorMessage } from '../../Common/function';
import { validationSchema } from '../../../utils/utils';
import { showError, showSuccess } from '../../../utils/toast-utils';
import Loading from '../../Loading';
import BtnCancel from '../../../components/Button/BtnCancel';
import BtnSuccess from '../../../components/Button/BtnSuccess';

const initValues = {
  name: null,
  pkLot: null,
  entrypt: null,
  state: { id: 'use', value: 'Đang sử dụng' },
  devCfg: "{}",
  laneType: null,
};

export const AddLane = ({ onClose, id, setReload, filter }) => {
  const classes = useStyles();

  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState(null);
  const [pkLotId, setPkLotId] = useState();
  const [entrypId, setEntrypId] = useState();
  const [fileUploadName, setFileUploadName] = useState('');
  const [fileUploadError, setFileUploadError] = useState('');
  const fetchDataSource = () => {
    setLoading(true);
    getApi(`${API_PARKING_LOT.PARKING_LANES}/${id}`)
      .then((response) => {
        const setData = response.data;
        if(response.data?.pkLotId){
          setData.pkLot = {
            id: response.data?.pkLotId,
            name: response.data?.pkLotName,
          };
        }
        if(response.data?.entryptId){
          setData.entrypt = {
            id: response.data?.entryptId,
            name: response.data?.entryptName,
          };
        }
        if (response.data?.devCfg) {
          setData.devCfg = JSON.stringify(
            JSON.parse(response.data?.devCfg),
            null,
            2,
          );
        }
        setDetail(setData);
        setPkLotId(response.data?.pkLotId);
        setEntrypId(response.data?.entryptId);
      })
      .catch((err) => {
        showError(getErrorMessage(err));
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const schema = validationSchema({
    name: yup.string().trim().nullable().required('Trường này bắt buộc nhập'),
    state: yup.object().shape().nullable().required('Trường này bắt buộc nhập'),
    pkLot: yup.object().shape().nullable().required('Trường này bắt buộc nhập'),
    entrypt: yup
      .object()
      .shape()
      .nullable()
      .required('Trường này bắt buộc nhập'),
    devCfg: yup
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
      name: values?.name,
      pkLotName: values?.pkLot?.name,
      pkLotId: values?.pkLot?.id,
      entryptName: values?.entrypt.name,
      entryptId: values?.entrypt.id,
      state: values?.state,
      devCfg: values?.devCfg,
      laneType: values?.laneType,
    };
    if (id) handleUpdate(params);
    else handleAdd(params);
  };
  const handleAdd = (params) => {
    setLoading(true);
    postApi(API_PARKING_LOT.PARKING_LANES, params)
      .then(() => {
        showSuccess('Thêm mới thành công', {
          text: 'Dữ liệu đã được cập nhật',
        });
        setReload();
        onClose();
      })
      .catch((err) => {
        showError(getErrorMessage(err));
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const handleUpdate = (params) => {
    setLoading(true);
    putApi(`${API_PARKING_LOT.PARKING_LANES}/${id}`, params)
      .then(() => {
        showSuccess('Cập nhật thành công', {
          text: 'Dữ liệu đã được cập nhật',
        });
        setReload();
        onClose();
      })
      .catch((err) => {
        showError(getErrorMessage(err));
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const handleUploadFile = async (e, acceptType, field, onChange) => {
    if (!acceptType.includes(e.value[0].type)) {
      setError(field, { type: 'type', message: 'Không đúng định dạng' });
      return;
    }
    clearErrors(field);
    onChange(e.value[0]);
  };
  const statusNewsManagement = [
    {
      value: 'DRAFT',
      label: 'Lưu nháp',
    },
    {
      value: 'SCHEDULE_PUBLISH',
      label: 'Hẹn giờ xuất bản',
    },
    {
      value: 'NONE_PUBLISH',
      label: 'Không xuất bản',
    },
    {
      value: 'PUBLISHED',
      label: 'Đã xuất bản',
    },
  ];
  let timeout = useMemo(() => undefined, []);
  const debounceSearchName = (value) => {
    // eslint-disable-next-line no-unused-expressions
    // clearTimeout(timeout);
    timeout = setTimeout(() => {
      if (!value) return;
      postApi(`${API_PARKING_LOT.PARKING_LANES}/checkname`, { name: value })
        .then((res) => {
          if (res?.existed) {
            setError('name', { message: 'Dữ liệu đã tồn tại trong hệ thống.' });
          }
        })
        .catch((err) => {
          showError(getErrorMessage(err));
        });
    }, 500);
  };
  return (
    <form className={classes.modal}>
      {loading && <Loading />}

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Grid container direction="column">
            <FormControl error={errors.name} fullWidth>
              <FormLabel required> Tên làn xe </FormLabel>
              <Controller
                control={control}
                name="name"
                rules={{
                  required: true,
                }}
                render={(props) => (
                  <TextField
                    autoComplete="off"
                    inputProps={{ maxLength: 50 }}
                    fullWidth
                    placeholder="Nhập tên làn xe"
                    value={props.value}
                    onChange={(e) => {
                      clearErrors('name');
                      props.onChange(e.target.value.replace(/\s/g, ''));
                      debounceSearchName(e.target.value.replace(/\s/g, ''));
                    }}
                    variant="outlined"
                    size="small"
                  />
                )}
              />
              {errors.name && (
                <FormHelperText>{errors.name?.message}</FormHelperText>
              )}
            </FormControl>

          </Grid>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormLabel> Loại làn xe </FormLabel>
          <Controller
            control={control}
            name="laneType"
            render={(props) => (
              <VAutocomplete
                value={props.value}
                fullWidth
                placeholder="Chọn loại làn xe"
                noOptionsText="Không có dữ liệu"
                getOptionLabel={(option) => option?.value}
                firstIndex={1}
                getOptionSelected={(option, selected) =>
                  option?.id == selected?.id
                }
                loadData={() =>
                  new Promise((resolve, reject) => {
                    getApi(`${API_PARKING_LOT.GET_DATA_TYPE('lanes')}`)
                      .then((result) => {
                        resolve({
                          data: [...result.deviceType],
                          totalCount: result?.deviceType?.length || 0,
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
        <Grid item xs={12} sm={6}>
          <FormControl error={errors.pkLot} fullWidth>
            <FormLabel required> Bãi gửi xe </FormLabel>

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
                        .catch((err) => reject(getErrorMessage(err)));
                    })
                  }
                  onChange={(e, value) => {
                    setPkLotId(value?.id);
                    setValue('entrypt',null);
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
            <FormLabel required> Entry point </FormLabel>
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
                        pkLotId: pkLotId ? pkLotId : filter?.pkLot?.id,
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
          <FormControl error={errors.state} fullWidth>
            <FormLabel> Trạng thái </FormLabel>
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
                      getApi(`${API_PARKING_LOT.GET_DATA_STATE('lanes')}`)
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
            {errors.state && (
              <FormHelperText>{errors.state?.message}</FormHelperText>
            )}
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
                    if(e.target.value){
                      setValue('devCfg', e.target.value);
                    }else{
                      setValue('devCfg', "{}");
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
          <Button
            onClick={() => {
              getApi(`${API_PARKING_LOT.GET_DATA_CONFIG('lanes')}`)
                .then((result) => {
                  setValue('devCfg', JSON.stringify(result, null, 2));
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
        <BtnCancel onClick={onClose}>Hủy</BtnCancel>
        <BtnSuccess onClick={handleSubmit(onSubmit)}>
          {id ? 'Lưu' : 'Thêm'}
        </BtnSuccess>
      </DialogActions>
    </form>
  );
};

export default AddLane;
