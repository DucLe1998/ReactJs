/* eslint-disable no-unused-vars */
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
  IconButton,
  Button as MatButton,
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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile, faFileImport } from '@fortawesome/free-solid-svg-icons';
import Close from '@material-ui/icons/Close';
import MultiSelect from '../../../components/MultiSelect';
import { useStyles } from '../styled';
import { API_PARKING, API_PARKING_LOT, API_FILE } from '../../apiUrl';
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
  dataName: null,
  dataUrl: null,
  dscr: null,
  freeSpot: null,
  layoutName: null,
  layoutUrl: null,
  name: null,
  floorState: { id: 'use', value: 'Đang sử dụng' },
  totalSpot: null,
  version: null,
  data: null,
  layout: null,
  floorType: null,
};

export const AddFloor = ({
  onClose,
  dataEdit,
  dataSource,
  setReload,
  dataOnChange,
}) => {
  const classes = useStyles();
  const id = 1;
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState(null);
  const [fileUploadData, setFileUploadData] = useState();
  const [fileUploadDataName, setFileUploadDataName] = useState();
  const [fileUploadDataId, setFileUploadDataId] = useState();
  const [fileUploadLayout, setFileUploadLayout] = useState();
  const [fileUploadLayoutName, setFileUploadLayoutName] = useState();
  const [fileUploadLayoutId, setFileUploadLayoutId] = useState();
  const [fileUploadError, setFileUploadError] = useState('');

  const schema = validationSchema({
    name: yup
      .string()
      .trim()
      .test('duplicate', 'Đã tồn tại tầng', function valid(value) {
        let isInclude = true;
        if (value && dataSource) {
          dataSource.map((x) => (x.name == value ? (isInclude = false) : ''));
        }
        if (value && dataEdit && dataSource[dataEdit - 1]?.name == value) {
          isInclude = true;
        }
        return isInclude;
      })
      .required('Trường này bắt buộc nhập'),
    floorType: yup
      .object()
      .shape()
      .nullable()
      .required('Trường này bắt buộc nhập'),
    floorState: yup
      .object()
      .shape()
      .nullable()
      .required('Trường này bắt buộc nhập'),
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
    fileUpload,
    formState: { errors },
  } = useForm({
    defaultValues: initValues,
    resolver: schema,
  });

  useEffect(() => {
    if (dataEdit) {
      setDetail(dataSource[dataEdit - 1]);
      const getData = dataSource[dataEdit - 1];
      setFileUploadLayoutName(getData?.layoutName);
      setFileUploadLayoutId(getData?.layoutUrl);
      setFileUploadDataName(getData?.dataName);
      setFileUploadDataId(getData?.dataUrl);
    }
  }, [dataEdit]);

  const setDetailFormValue = () => {
    if (detail?.name) {
      reset(detail);
    } else {
      reset(initValues);
    }
  };
  const handleUploadFileData = (e) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('file', e.value[0]);
    formData.append('isPublic', true);
    formData.append('service', 'SMART_PARKING');
    try {
      // API_ROUTE.UPLOAD_API
      callApiWithConfig(`${API_FILE.UPLOAD_API}`, METHODS.POST, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }).then((res) => {
        setFileUploadDataName(e.value[0].name);
        setFileUploadDataId(res.data.id);
      });
    } catch (e) {
      showError(getErrorMessage(e));
      return null;
    } finally {
      setLoading(false);
    }
  };
  const handleUploadFileLayout = (e) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('file', e.value[0]);
    formData.append('isPublic', true);
    formData.append('service', 'SMART_PARKING');
    try {
      // API_ROUTE.UPLOAD_API
      callApiWithConfig(`${API_FILE.UPLOAD_API}`, METHODS.POST, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }).then((res) => {
        setFileUploadLayoutName(e.value[0].name);
        setFileUploadLayoutId(res.data.id);
      });
    } catch (e) {
      showError(getErrorMessage(e));
      return null;
    } finally {
      setLoading(false);
    }
  };
  const handleUploadLayout = (e) => {
    setValue('layoutUrl', e.value[0]);
  };
  useEffect(() => {
    if (detail) {
      setDetailFormValue();
    }
  }, [detail]);
  const onSubmit = async (values) => {
    // const dataUrl = values?.dataUrl?.id
    //   ? values?.dataUrl
    //   : await handleUploadFileBeforeSubmit(values.dataUrl);
    // const layoutUrl = values?.layoutUrl?.id
    //   ? values?.layoutUrl
    //   : await handleUploadFileBeforeSubmit(values.layoutUrl);
    // if (dataUrl === null || layoutUrl === null) {
    //   return;
    // }
    const params = {
      dataName: fileUploadDataName,
      dataUrl: fileUploadDataId,
      dscr: values?.dscr,
      freeSpot: values?.freeSpot,
      layoutName: fileUploadLayoutName,
      layoutUrl: fileUploadLayoutId,
      name: values?.name,
      floorState: values?.floorState,
      totalSpot: values?.totalSpot,
      version: values?.version,
      floorType: values?.floorType,
    };
    if (dataEdit) {
      const new_data = [...dataSource];
      new_data[dataEdit - 1] = params;
      dataOnChange(new_data);
      showSuccess('Cập nhật thành công', {
        text: 'Dữ liệu đã được cập nhật',
      });
    } else {
      dataOnChange([...dataSource, params]);
      showSuccess('Thêm mới thành công', {
        text: 'Dữ liệu đã được cập nhật',
      });
    }
    onClose();
  };

  const handleAdd = (params) => {
    console.log(params);
    setLoading(true);
    // Add API_PARKING.ADD_MAP_INDOOR
  };

  const handleUpdate = (params) => {
    setLoading(true);
    putApi(`${API_PARKING.ADD_MAP_INDOOR}`, params)
      .then(() => {
        showSuccess('Thành công');
        onClose();
      })
      .catch((err) => {
        // showError(getErrorMessage(err));
        // setValue('map', { ...getValues().map, id: params.fileMapId });
        // setValue('zipData', { ...getValues().zipData, id: params.fileDataId });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleUploadFileBeforeSubmit = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name ', file.name);
    formData.append('service', 'SMART_PARKING');
    setLoading(true);
    try {
      // API_ROUTE.UPLOAD_API
      const res = await callApiWithConfig(
        `${API_PARKING_LOT.PARKING_UPLOAD_PKLOTS}`,
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
    console.log(e);
    // if (!acceptType.includes(e.value[0].type)) {
    //   setError(field, { type: 'type', message: 'Không đúng định dạng' });
    //   return;
    // }
    // clearErrors(field);
    onChange(e.value[0]);
  };

  return (
    <form className={classes.modal} encType="multipart/form-data">
      {loading && <Loading />}

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <FormControl error={errors.name} fullWidth>
            <FormLabel required> Tên tầng</FormLabel>
            <Controller
              control={control}
              name="name"
              render={(props) => (
                <TextField
                  autoComplete="off"
                  inputProps={{ maxLength: 50 }}
                  fullWidth
                  placeholder="Nhập tên tầng"
                  value={props.value}
                  onChange={(e) => {
                    props.onChange(e.target.value);
                  }}
                  error={errors.name}
                  helperText={errors.name?.message}
                  variant="outlined"
                  size="small"
                />
              )}
            />
          </FormControl>
          <Controller
            control={control}
            name="freeSpot"
            render={(props) => (
              <TextField
                autoComplete="off"
                inputProps={{ maxLength: 50 }}
                fullWidth
                value={props.value}
                onChange={(e) => {
                  props.onChange(e.target.value);
                }}
                variant="outlined"
                size="small"
                style={{ display: 'none' }}
                disabled
              />
            )}
          />
          <Controller
            control={control}
            name="totalSpot"
            render={(props) => (
              <TextField
                autoComplete="off"
                inputProps={{ maxLength: 50 }}
                fullWidth
                value={props.value}
                onChange={(e) => {
                  props.onChange(e.target.value);
                }}
                variant="outlined"
                size="small"
                style={{ display: 'none' }}
                disabled
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl error={errors.floorType} fullWidth>
            <FormLabel required> Loại bãi gửi xe</FormLabel>
            <Controller
              control={control}
              name="floorType"
              render={(props) => (
                <VAutocomplete
                  value={props.value}
                  fullWidth
                  // disabled={!watchFields.block}
                  // disableClearable
                  noOptionsText="Không có dữ liệu"
                  getOptionLabel={(option) => option.value || ''}
                  firstIndex={1}
                  getOptionSelected={(option, selected) =>
                    option.id == selected.id
                  }
                  loadData={() =>
                    new Promise((resolve, reject) => {
                      getApi(`${API_PARKING_LOT.GET_DATA_TYPE('pklots')}`)
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
            {errors.floorType && (
              <FormHelperText>{errors.floorType?.message}</FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl error={errors.floorState} fullWidth>
            <FormLabel required> Trạng thái</FormLabel>
            <Controller
              control={control}
              name="floorState"
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
                      getApi(`${API_PARKING_LOT.GET_DATA_STATE('pklots')}`)
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
            {errors.floorState && (
              <FormHelperText>{errors.floorState?.message}</FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormLabel> Version</FormLabel>
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
          <FormLabel> Layout hầm</FormLabel>
          {/* <CustomUploadFile
            control={control}
            errors={errors}
            name="layout"
            acceptType=".zip"
            onImportFile={(e) => {
              handleUploadFileVersion(e);
            }}
          /> */}
          {fileUploadLayoutName && (
            <div
              style={{
                width: '100%',
                border: '1px solid #ccc',
                borderRadius: '4px',
                padding: '10px 5px',
              }}
            >
              {fileUploadLayoutName}
              <IconButton
                style={{ float: 'right', marginTop: '-5px' }}
                size="small"
              >
                <Close
                  onClick={() => {
                    setFileUploadLayoutName(null);
                    setFileUploadLayoutId(null);
                  }}
                />
              </IconButton>
            </div>
          )}
          <FileUploader
            multiple={false}
            control={control}
            name="layout"
            accept="image/*"
            uploadMode="useForm"
            selectButtonText="Upload layout hầm"
            onValueChanged={(e) => handleUploadFileLayout(e)}
            labelText=""
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormLabel> Dữ liệu</FormLabel>
          {fileUploadDataName && (
            <div
              style={{
                width: '100%',
                border: '1px solid #ccc',
                borderRadius: '4px',
                padding: '10px 5px',
              }}
            >
              {fileUploadDataName}
              <IconButton
                style={{ float: 'right', marginTop: '-5px' }}
                size="small"
              >
                <Close
                  onClick={() => {
                    setFileUploadDataName(null);
                    setFileUploadDataId(null);
                  }}
                />
              </IconButton>
            </div>
          )}
          <FileUploader
            multiple={false}
            control={control}
            name="data"
            accept="*"
            uploadMode="useForm"
            selectButtonText="Upload dữ liệu"
            onValueChanged={(e) => handleUploadFileData(e)}
            labelText=""
          />
        </Grid>
      </Grid>

      <DialogActions>
        <BtnCancel onClick={onClose}>Hủy</BtnCancel>
        <BtnSuccess onClick={handleSubmit(onSubmit)}>
          {dataSource ? 'Lưu' : 'Thêm'}
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

export default AddFloor;
