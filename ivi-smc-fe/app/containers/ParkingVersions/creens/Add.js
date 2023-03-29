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
  IconButton,
} from '@material-ui/core';
import * as yup from 'yup';

import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import { useStyles } from '../styled';
import { API_PARKING_LOT, API_FILE } from '../../apiUrl';
import VAutocomplete from 'components/VAutocomplete';
import {
  callApiWithConfig,
  getApi,
  postApi,
  putApi,
  METHODS,
} from 'utils/requestUtils';
import { getErrorMessage } from '../../Common/function';
import { validationSchema } from 'utils/utils';
import { showError, showSuccess } from 'utils/toast-utils';
import Loading from '../../Loading';
import BtnSuccess from 'components/Button/BtnSuccess';
import Close from '@material-ui/icons/Close';
import FileUploader from 'devextreme-react/file-uploader';
const initValues = {
  name: null,
  fileUrl: null,
  dscr: null,
  version: null,
  versionType: null,
};

export const AddEntryPoint = ({ onClose, id, setReload, filter }) => {
  const classes = useStyles();

  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState(null);
  const [fileUploadDataName, setFileUploadDataName] = useState();
  const [fileUploadDataId, setFileUploadDataId] = useState();
  const [fileUploadError, setFileUploadError] = useState('');
  const fetchDataSource = () => {
    setLoading(true);
    getApi(`${API_PARKING_LOT.PARKING_VERSIONS}/${id}`)
      .then((response) => {
        const setData = response.data;
        setFileUploadDataName(setData?.name);
        //setFileUploadDataId(setData?.fileUrl);
        setFileUploadDataId(setData?.fileId);
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
    //name: yup.string().nullable().required('Trường này bắt buộc nhập'),
    versionType: yup.object().nullable().required('Trường này bắt buộc nhập'),
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
        setValue('name', e.value[0].name);
        setFileUploadDataName(e.value[0].name);
        setFileUploadDataId(res.data.id);
      });
    } catch (e) {
      showError((e));
      return null;
    } finally {
      setLoading(false);
    }
  };
  const onSubmit = (values) => {
    setLoading(true);
    const params = {
      name: fileUploadDataName,
      fileUrl: fileUploadDataId,
      fileId: fileUploadDataId,
      version: values?.version,
      dscr: values?.dscr,
      versionType: values?.versionType,
    };
    if (id) handleUpdate(params);
    else handleAdd(params);
  };
  const handleAdd = (params) => {
    setLoading(true);
    postApi(API_PARKING_LOT.PARKING_VERSIONS, params)
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
    putApi(`${API_PARKING_LOT.PARKING_VERSIONS}/${id}`, params)
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
            <FormLabel required>Tên phiên bản phần mềm</FormLabel>
            {fileUploadDataName && (
              <div
                style={{
                  width: '100%',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  padding: '10px 5px',
                }}
              >
                <a href={API_FILE.DOWNLOAD_PUBLIC_FILE(fileUploadDataId)}
                  target="_blank"
                  download
                >
                  {fileUploadDataName}
                </a>
                <IconButton
                  style={{ float: 'right', marginTop: '-5px' }}
                  size="small"
                >
                  <Close
                    onClick={() => {
                      setValue('name', null);
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
              name="fileUrl"
              accept="*"
              uploadMode="useForm"
              selectButtonText="Upload phiên bản phần mềm"
              onValueChanged={(e) => handleUploadFileData(e)}
              labelText=""
            />
            {/* <Controller
              control={control}
              name="name"
              render={(props) => (
                <TextField
                  autoComplete="off"
                  inputProps={{ maxLength: 50 }}
                  fullWidth
                  placeholder="Nhập tên phiên bản phần mềm"
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
            /> */}
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <FormLabel>Version</FormLabel>
            <Controller
              control={control}
              name="version"
              render={(props) => (
                <TextField
                  autoComplete="off"
                  inputProps={{ maxLength: 50 }}
                  fullWidth
                  placeholder="Nhập version"
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
        <Grid item xs={12} sm={6}>
          <FormControl error={errors.versionType} fullWidth>
            <FormLabel required>Loại phần mềm</FormLabel>
            <Controller
              control={control}
              name="versionType"
              render={(props) => (
                <VAutocomplete
                  value={props.value}
                  placeholder="Chọn loại phần mềm"
                  fullWidth
                  noOptionsText="Không có dữ liệu"
                  getOptionLabel={(option) => option?.value}
                  firstIndex={1}
                  getOptionSelected={(option, selected) => option?.id == selected?.id}
                  loadData={() =>
                    new Promise((resolve, reject) => {
                      getApi(`${API_PARKING_LOT.GET_DATA_TYPE('versions')}`)
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
                  }}
                />
              )}
            />
            {errors.versionType && (
              <FormHelperText>{errors.versionType?.message}</FormHelperText>
            )}
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
      </Grid>

      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Hủy
        </Button>
        <Button
          onClick={handleSubmit(onSubmit)}
          variant="contained"
          color="primary"
          disabled={!fileUploadDataName}
        >
          {id ? 'Lưu' : 'Thêm'}
        </Button>
      </DialogActions>
    </form>
  );
};

export default AddEntryPoint;
