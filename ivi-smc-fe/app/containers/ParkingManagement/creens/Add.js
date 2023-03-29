/* eslint-disable no-unused-vars */
import { Controller, useForm } from 'react-hook-form';
import React, { Fragment, useEffect, useState } from 'react';
import DragdropBG from 'images/dragndrop-1.svg';
import ClearIcon from '@material-ui/icons/Clear';
import {
  DialogActions,
  DialogTitle,
  FormHelperText,
  Grid,
  TextField,
} from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import * as yup from 'yup';
import styled from 'styled-components';
import FileUploader from 'devextreme-react/file-uploader';
import CustomUploadFile from 'components/CustomUploadFile';
import DatePicker from 'components/DatePicker';
import { TextBox } from 'devextreme-react/text-box';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import MultiSelect from '../../../components/MultiSelect';
import { useStyles } from '../styled';
import { API_PARKING, API_ROUTE, SAP_SRC } from '../../apiUrl';
import VAutocomplete from '../../../components/VAutocomplete';
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
  zone: null,
  type: null,
  status: null,
  layout: null,
  version: null,
  zipData: null,
};

export const AddParking = ({ onClose, id, setReload }) => {
  const classes = useStyles();

  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState(null);
  const [fileUploadName, setFileUploadName] = useState('');
  const [fileUploadError, setFileUploadError] = useState('');

  const fetchDataSource = () => {
    setLoading(true);
    getApi(`${API_PARKING.ADD_MAP_INDOOR}/${id}`)
      .then((response) => {
        // setDetail(response.data);
      })
      .catch((err) => {
        const dataCheck = {
          name: 'Tên bãi gửi xe',
          zone: 'Tầng 2',
          type: { typeId: id, typeName: 'type ' + id },
          status: { statusId: id, statusName: 'status ' + id },
          layout: { layoutId: id, layoutName: 'layout' + id },
          version: '1.1.1',
          zipData: { zipDataId: id, zipDataName: 'zipData' + id  },
        };
        setDetail(dataCheck);
        // showError(getErrorMessage(err));
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const schema = validationSchema({
    name: yup
      .string()
      .nullable()
      .required('Trường này bắt buộc nhập'),
    type: yup
      .object()
      .shape()
      .nullable()
      .required('Trường này bắt buộc nhập'),
    // block: yup
    //   .object()
    //   .shape()
    //   .nullable(),
    // // .required('Trường này bắt buộc nhập'),
    // floor: yup
    //   .object()
    //   .shape()
    //   .nullable()
    //   .required('Trường này bắt buộc nhập'),
    // map: yup
    //   .mixed()
    //   // .test('type', 'Không đúng định dạng', value => {
    //   //   const SUPPORTED_FORMATS = ['jpg', 'jpeg', 'png'];
    //   //   return SUPPORTED_FORMATS.includes(value?.type);
    //   // })
    //   .required('Trường này bắt buộc nhập'),
    // zipData: yup
    //   .mixed()
    //   // .test('type', 'Không đúng định dạng', value => {
    //   //   const SUPPORTED_FORMATS = ['zip'];
    //   //   return SUPPORTED_FORMATS.includes(value?.type);
    //   // })
    //   .required('Trường này bắt buộc nhập'),
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
  const onSubmit = async (values) => {
    console.log('Submit.....', values);
    const map = values?.map?.id
      ? values?.map
      : await handleUploadFileBeforeSubmit(values.map);
    const zip = values?.zipData?.id
      ? values?.zipData
      : await handleUploadFileBeforeSubmit(values.zipData);
    if (map === null || zip === null) {
      return;
    }
    const params = {
      areaId: +process.env.AREA_ID,
      zoneId: +process.env.ZONE_ID,
      statusIs: +process.env.ZONE_ID,
      buildingId: +process.env.BLOCK_ID,
      parkingId: values.floor.floorId,
      forceUpdate: values.forceUpdate,
      fileDataId: zip.id,
      fileMapId: map.id,
    };
    if (id) handleUpdate(params);
    else handleAdd(params);
  };

  const handleAdd = (params) => {
    setLoading(true);
    postApi(API_PARKING.ADD_MAP_INDOOR, params)
      .then(() => {
        showSuccess('Thành công');
        setReload();
        onClose();
      })
      .catch((err) => {
        //showSuccess('Thành công');
        showError(getErrorMessage(err));
        setValue('map', { ...getValues().map, id: params.fileMapId });
        setValue('zipData', { ...getValues().zipData, id: params.fileDataId });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleUpdate = (params) => {
    setLoading(true);
    putApi(`${API_PARKING.ADD_MAP_INDOOR}/${id}`, params)
      .then(() => {
        showSuccess('Thành công');
        setReload();
        onClose();
      })
      .catch((err) => {
        // showError(getErrorMessage(err));
        setValue('map', { ...getValues().map, id: params.fileMapId });
        setValue('zipData', { ...getValues().zipData, id: params.fileDataId });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleUploadFileBeforeSubmit = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('isPublic ', true);
    setLoading(true);
    try {
      const res = await callApiWithConfig(
        `${API_ROUTE.UPLOAD_API}`,
        METHODS.POST,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      return res?.data || null;
    } catch (e) {
      showError(getErrorMessage(e));
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleUploadFile = async (e, acceptType, field, onChange) => {
    if (!acceptType.includes(e.value[0].type)) {
      setError(field, { type: 'type', message: 'Không đúng định dạng' });
      return;
    }
    clearErrors(field);
    onChange(e.value[0]);
  };

  return (
    <form className={classes.modal}>
      {loading && <Loading />}
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6}>
          <p className={classes.label}>
            Tên bãi gửi xe<span style={{ color: 'red' }}>*</span>
          </p>
          <Controller
            control={control}
            name="name"
            render={(props) => (
              <TextBox
                maxLength="50"
                width="100%"
                placeholder="Nhập tên bãi gửi xe"
                value={props.value}
                onValueChanged={(e) => {
                  props.onChange(e.value);
                  // setValue('area',e.value)
                }}
              />
            )}
          />
          {errors.name && (
            <FormHelperText style={{ color: '#f44336' }}>
              {errors.name.message}
            </FormHelperText>
          )}
        </Grid>

        <Grid item xs={12} sm={6}>
          <p className={classes.label}>
            Tên tầng<span style={{ color: 'red' }}> </span>
          </p>
          <Controller
            control={control}
            name="zone"
            render={(props) => (
              <TextBox
                maxLength="50"
                width="100%"
                placeholder="Nhập tên tầng"
                value={props.value}
                onValueChanged={(e) => {
                  props.onChange(e.value);
                }}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <p className={classes.label}>
            Loại bãi gửi xe<span style={{ color: 'red' }}>*</span>
          </p>
          <Controller
            control={control}
            name="type"
            defaultValue=""
            render={(props) => (
              <VAutocomplete
                value={props.value}
                fullWidth
                // disabled={!watchFields.block}
                // disableClearable
                noOptionsText="Không có dữ liệu"
                getOptionLabel={(option) => option?.typeName || ''}
                firstIndex={1}
                getOptionSelected={(option, selected) =>
                  option.typeId == selected.typeId}
                loadData={() =>
                  new Promise((resolve, reject) => {
                    // if (!watchFields.block) {
                    //   resolve({
                    //     data: [],
                    //     totalCount: 0,
                    //   });
                    //   return;
                    // }
                    getApi(`${SAP_SRC}/floors/search`, {
                      blockId: process.env.BLOCK_ID,
                    })
                      .then((result) => {
                        const result2 = [
                          { typeId: '1', typeName: 'type 1' },
                          { typeId: '2', typeName: 'type 2' },
                          { typeId: '3', typeName: 'type 3' },
                          { typeId: '4', typeName: 'type 4' },
                          { typeId: '5', typeName: 'type 5' },
                        ];
                        resolve({
                          data: [...result2],
                          totalCount: result2?.length || 0,
                        });
                      })
                      .catch((err) => reject(getErrorMessage(err)));
                  })}
                onChange={(e, value) => {
                  props.onChange(value);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    placeholder="Chọn loại bãi gửi xe"
                    error={!!errors.floor}
                    helperText={errors.floor && errors.floor.message}
                  />
                )}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <p className={classes.label}>
            Trạng thái bãi xe<span style={{ color: 'red' }}></span>
          </p>
          <Controller
            control={control}
            name="status"
            defaultValue=""
            render={(props) => (
              <VAutocomplete
                value={props.value}
                fullWidth
                // disabled={!watchFields.block}
                // disableClearable
                noOptionsText="Không có dữ liệu"
                getOptionLabel={(option) => option?.statusName || ''}
                firstIndex={1}
                getOptionSelected={(option, selected) =>
                  option.statusId == selected.statusId}
                loadData={() =>
                  new Promise((resolve, reject) => {
                    // if (!watchFields.block) {
                    //   resolve({
                    //     data: [],
                    //     totalCount: 0,
                    //   });
                    //   return;
                    // }
                    getApi(`${SAP_SRC}/floors/search`, {
                      blockId: process.env.BLOCK_ID,
                    })
                      .then((result) => {
                        const result2 = [
                          { statusId: '1', statusName: 'status 1' },
                          { statusId: '2', statusName: 'status 2' },
                          { statusId: '3', statusName: 'status 3' },
                          { statusId: '4', statusName: 'status 4' },
                          { statusId: '5', statusName: 'status 5' },
                        ];
                        resolve({
                          data: [...result2],
                          totalCount: result2?.length || 0,
                        });
                      })
                      .catch((err) => reject(getErrorMessage(err)));
                  })}
                onChange={(e, value) => {
                  props.onChange(value);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    placeholder="Hoạt động"
                    error={!!errors.floor}
                    helperText={errors.floor && errors.floor.message}
                  />
                )}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <p className={classes.label}>
            Layout hầm<span style={{ color: 'red' }}></span>
          </p>
          <Controller
            control={control}
            name="layout"
            defaultValue=""
            render={(props) => (
              <VAutocomplete
                value={props.value}
                fullWidth
                // disabled={!watchFields.block}
                // disableClearable
                noOptionsText="Không có dữ liệu"
                getOptionLabel={(option) => option?.layoutName || ''}
                firstIndex={1}
                getOptionSelected={(option, selected) =>
                  option.layoutId == selected.layoutId}
                loadData={() =>
                  new Promise((resolve, reject) => {
                    // if (!watchFields.block) {
                    //   resolve({
                    //     data: [],
                    //     totalCount: 0,
                    //   });
                    //   return;
                    // }
                    getApi(`${SAP_SRC}/floors/search`, {
                      blockId: process.env.BLOCK_ID,
                    })
                      .then((result) => {
                        const result2 = [
                          { layoutId: '1', layoutName: 'layout 1' },
                          { layoutId: '2', layoutName: 'layout 2' },
                          { layoutId: '3', layoutName: 'layout 3' },
                          { layoutId: '4', layoutName: 'layout 4' },
                          { layoutId: '5', layoutName: 'layout 5' },
                        ];
                        resolve({
                          data: [...result2],
                          totalCount: result2?.length || 0,
                        });
                      })
                      .catch((err) => reject(getErrorMessage(err)));
                  })}
                onChange={(e, value) => {
                  props.onChange(value);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    placeholder="Chọn layout hầm"
                    error={!!errors.floor}
                    helperText={errors.floor && errors.floor.message}
                  />
                )}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <p className={classes.label}>
            Version<span style={{ color: 'red' }}> </span>
          </p>
          <Controller
            control={control}
            name="version"
            render={(props) => (
              <TextBox
                maxLength="50"
                width="100%"
                placeholder="Nhập version"
                value={props.value}
                onValueChanged={(e) => {
                  props.onChange(e.value);
                }}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <p className={classes.label}>
            Layout hầm<span style={{ color: 'red' }}></span>
          </p>
          <Controller
            control={control}
            name="zipData"
            defaultValue=""
            render={(props) => (
              <VAutocomplete
                value={props.value}
                fullWidth
                // disabled={!watchFields.block}
                // disableClearable
                noOptionsText="Không có dữ liệu"
                getOptionLabel={(option) => option?.zipDataName || ''}
                firstIndex={1}
                getOptionSelected={(option, selected) =>
                  option.zipDataId == selected.zipDataId}
                loadData={() =>
                  new Promise((resolve, reject) => {
                    // if (!watchFields.block) {
                    //   resolve({
                    //     data: [],
                    //     totalCount: 0,
                    //   });
                    //   return;
                    // }
                    getApi(`${SAP_SRC}/floors/search`, {
                      blockId: process.env.BLOCK_ID,
                    })
                      .then((result) => {
                        const result2 = [
                          { zipDataId: '1', zipDataName: 'zipDataName 1' },
                          { zipDataId: '2', zipDataName: 'zipDataName 2' },
                          { zipDataId: '3', zipDataName: 'zipDataName 3' },
                          { zipDataId: '4', zipDataName: 'zipDataName 4' },
                          { zipDataId: '5', zipDataName: 'zipDataName 5' },
                        ];
                        resolve({
                          data: [...result2],
                          totalCount: result2?.length || 0,
                        });
                      })
                      .catch((err) => reject(getErrorMessage(err)));
                  })}
                onChange={(e, value) => {
                  props.onChange(value);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    placeholder="Chọn dữ liệu"
                    error={!!errors.floor}
                    helperText={errors.floor && errors.floor.message}
                  />
                )}
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

const FormUploadWrap = styled.div`
  display: flex;
  width: 100%;

  .img-choose-file {
    text-align: center;
    align-self: center;
  }
  & .dx-texteditor.dx-editor-outlined {
    border: none;
  }
`;

export default AddParking;
