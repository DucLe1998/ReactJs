import { Controller, useForm } from 'react-hook-form';
import React, { Fragment, useEffect, useState } from 'react';
import DragdropBG from 'images/dragndrop-1.svg';
import ClearIcon from '@material-ui/icons/Clear';
import {
  DialogActions,
  DialogTitle,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  TextField,
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
  vehType: null,
  color: null,
  dscr: null,
  veh: null,
};

export const AddBls = ({ onClose, id, setReload }) => {
  const classes = useStyles();

  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState(null);
  const [fileUploadName, setFileUploadName] = useState('');
  const [fileUploadError, setFileUploadError] = useState('');
  const fetchDataSource = () => {
    setLoading(true);
    getApi(`${API_PARKING_LOT.PARKING_LPNS}/${id}`)
      .then((response) => {
        const setData = response.data;
        setData.veh = {
          name: response.data?.vehName,
          id: response.data?.vehId,
        };
        console.log(setData)
        setDetail(setData);
      })
      .catch((err) => {
        showError(getErrorMessage(err));
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const schema = validationSchema({
    name: yup.string().trim().required('Trường này bắt buộc nhập'),
    veh: yup.object().shape().nullable().required('Trường này bắt buộc nhập'),
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
  const onSubmit = (values) => {
    setLoading(true);
    const params = {
      name: values.name,
      model: values.model,
      vehId: values?.veh.id,
      vehName: values?.veh.name,
      color: values?.color,
      dscr: values?.dscr,
    };
    if (id) handleUpdate(params);
    else handleAdd(params);
  };
  const handleAdd = (params) => {
    setLoading(true);
    postApi(API_PARKING_LOT.PARKING_LPNS, params)
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
    putApi(`${API_PARKING_LOT.PARKING_LPNS}/${id}`, params)
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
  return (
    <form className={classes.modal}>
      {loading && <Loading />}

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <FormControl error={errors.name} fullWidth>
            <FormLabel required>Biển số xe</FormLabel>
            <Controller
              control={control}
              name="name"
              render={(props) => (
                <TextField
                  maxLength="50"
                  width="100%"
                  placeholder="Nhập biển số"
                  value={props.value}
                  onChange={(e) => {
                    props.onChange(e.target.value);
                  }}
                  disabled={Boolean(detail)}
                  error={errors.name}
                  helperText={errors.name?.message}
                  inputProps={{ maxLength: 20 }}
                  variant="outlined"
                  size="small"
                />
              )}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormLabel>Model xe</FormLabel>
          <Controller
            control={control}
            name="model"
            render={(props) => (
              <TextBox
                maxLength="50"
                width="100%"
                placeholder="Nhập model xe "
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
          <FormLabel>Màu xe</FormLabel>
          <Controller
            control={control}
            name="color"
            render={(props) => (
              <TextBox
                maxLength="50"
                width="100%"
                placeholder="Nhập mầu xe "
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
          <FormControl error={errors.veh} fullWidth>
            <FormLabel required>Hãng xe</FormLabel>
            <Controller
              control={control}
              name="veh"
              render={(props) => (
                <VAutocomplete
                  value={props.value}
                  fullWidth
                  noOptionsText="Không có dữ liệu"
                  placeholder="Chọn hãng xe"
                  getOptionLabel={(option) => option?.name || ''}
                  firstIndex={1}
                  getOptionSelected={(option, selected) =>
                    option?.id == selected?.id
                  }
                  loadData={(page, keyword) =>
                    new Promise((resolve, reject) => {
                      getApi(`${API_PARKING_LOT.PARKING_VEH}`, {
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
            {errors.veh && (
              <FormHelperText>{errors.veh?.message}</FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={12}>
          <FormLabel>Thông tin khác</FormLabel>
          <Controller
            control={control}
            name="dscr"
            render={(props) => (
              <TextBox
                maxLength="50"
                width="100%"
                placeholder="Nhập thông tin "
                value={props.value}
                onValueChanged={(e) => {
                  props.onChange(e.value);
                  // setValue('area',e.value)
                }}
              />
            )}
          />
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

export default AddBls;
