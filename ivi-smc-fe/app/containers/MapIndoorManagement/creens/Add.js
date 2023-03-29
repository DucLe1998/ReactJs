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
import InputAdornment from '@material-ui/core/InputAdornment';
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
  area: null,
  zone: null,
  block: null,
  floor: null,
  forceUpdate: false,
  map: null,
  zipData: null,
};

export const AddMap = ({ onClose, id, setReload }) => {
  const classes = useStyles();

  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState(null);

  const fetchDataSource = () => {
    setLoading(true);
    getApi(`${API_PARKING.ADD_MAP_INDOOR}/${id}`)
      .then(response => {
        setDetail(response.data);
      })
      .catch(err => {
        showError(getErrorMessage(err));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const schema = validationSchema({
    area: yup
      .object()
      .shape()
      .nullable(),
    // .required('Trường này bắt buộc nhập'),
    zone: yup
      .object()
      .shape()
      .nullable(),
    // .required('Trường này bắt buộc nhập'),
    block: yup
      .object()
      .shape()
      .nullable(),
    // .required('Trường này bắt buộc nhập'),
    floor: yup
      .object()
      .shape()
      .nullable()
      .required('Trường này bắt buộc nhập'),
    map: yup
      .mixed()
      // .test('type', 'Không đúng định dạng', value => {
      //   const SUPPORTED_FORMATS = ['jpg', 'jpeg', 'png'];
      //   return SUPPORTED_FORMATS.includes(value?.type);
      // })
      .required('Trường này bắt buộc nhập'),
    zipData: yup
      .mixed()
      // .test('type', 'Không đúng định dạng', value => {
      //   const SUPPORTED_FORMATS = ['zip'];
      //   return SUPPORTED_FORMATS.includes(value?.type);
      // })
      .required('Trường này bắt buộc nhập'),
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
    reset({
      area: {
        areaId: detail?.areaId,
        areaName: detail?.areaName,
      },
      zone: {
        zoneId: detail?.zoneId,
        zoneName: detail?.zoneName,
      },
      block: {
        blockId: detail?.buildingId,
        blockName: detail?.buildingName,
      },
      floor: {
        floorId: detail?.parkingId,
        floorName: detail?.parkingName,
      },
      forceUpdate: detail?.forceUpdate || false,
      map: {
        name: detail?.fileMapName,
        id: detail?.fileMapId,
      },
      zipData: {
        name: detail?.fileDataName,
        id: detail?.fileDataId,
      },
    });
  };

  useEffect(() => {
    if (detail) {
      setDetailFormValue();
    }
  }, [detail]);

  const watchFields = watch(['area', 'zone', 'block']);
  const onSubmit = async values => {
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
      buildingId: +process.env.BLOCK_ID,
      parkingId: values.floor.floorId,
      forceUpdate: values.forceUpdate,
      fileDataId: zip.id,
      fileMapId: map.id,
    };
    if (id) handleUpdate(params);
    else handleAdd(params);
  };

  const handleAdd = params => {
    setLoading(true);
    postApi(API_PARKING.ADD_MAP_INDOOR, params)
      .then(() => {
        showSuccess('Thành công');
        setReload();
        onClose();
      })
      .catch(err => {
        showError(getErrorMessage(err));
        setValue('map', { ...getValues().map, id: params.fileMapId });
        setValue('zipData', { ...getValues().zipData, id: params.fileDataId });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleUpdate = params => {
    setLoading(true);
    putApi(`${API_PARKING.ADD_MAP_INDOOR}/${id}`, params)
      .then(() => {
        showSuccess('Thành công');
        setReload();
        onClose();
      })
      .catch(err => {
        showError(getErrorMessage(err));
        setValue('map', { ...getValues().map, id: params.fileMapId });
        setValue('zipData', { ...getValues().zipData, id: params.fileDataId });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleUploadFileBeforeSubmit = async file => {
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
    <form className={classes.root}>
      {loading && <Loading />}
      <DialogTitle className="title">
        {id ? 'Sửa thông tin bản đồ' : 'Thêm bản đồ'}
      </DialogTitle>
      <Grid container spacing={1}>
        {/* <Grid item xs={12} sm={6}> */}
        {/*  <p className={classes.label}> */}
        {/*    Khu đô thị<span style={{ color: 'red' }}>*</span> */}
        {/*  </p> */}
        {/*  <Controller */}
        {/*    control={control} */}
        {/*    name="area" */}
        {/*    defaultValue="" */}
        {/*    render={props => ( */}
        {/*      <VAutocomplete */}
        {/*        value={props.value} */}
        {/*        fullWidth */}
        {/*        virtual={false} */}
        {/*        disabled={!!id} */}
        {/*        // disableClearable */}
        {/*        noOptionsText="Không có dữ liệu" */}
        {/*        getOptionLabel={option => option?.areaName || ''} */}
        {/*        firstIndex={1} */}
        {/*        loadData={() => */}
        {/*          new Promise((resolve, reject) => { */}
        {/*            getApi(`${SAP_SRC}/area`) */}
        {/*              .then(result => { */}
        {/*                resolve({ */}
        {/*                  data: [...result.rows], */}
        {/*                  totalCount: result?.rows?.length || 0, */}
        {/*                }); */}
        {/*              }) */}
        {/*              .catch(err => reject(getErrorMessage(err))); */}
        {/*          }) */}
        {/*        } */}
        {/*        getOptionSelected={(option, selected) => */}
        {/*          option.areaId === selected.areaId */}
        {/*        } */}
        {/*        onChange={(e, value) => { */}
        {/*          props.onChange(value); */}
        {/*          setValue('zone', null); */}
        {/*        }} */}
        {/*        renderInput={params => ( */}
        {/*          <TextField */}
        {/*            {...params} */}
        {/*            variant="outlined" */}
        {/*            placeholder="Chọn khu đô thị" */}
        {/*            error={!!errors.area} */}
        {/*            helperText={errors.area && errors.area.message} */}
        {/*          /> */}
        {/*        )} */}
        {/*      /> */}
        {/*    )} */}
        {/*  /> */}
        {/* </Grid> */}
        {/* <Grid item xs={12} sm={6}> */}
        {/*  <p className={classes.label}> */}
        {/*    Phân khu<span style={{ color: 'red' }}>*</span> */}
        {/*  </p> */}
        {/*  <Controller */}
        {/*    control={control} */}
        {/*    name="zone" */}
        {/*    defaultValue="" */}
        {/*    render={props => ( */}
        {/*      <VAutocomplete */}
        {/*        value={props.value} */}
        {/*        fullWidth */}
        {/*        virtual={false} */}
        {/*        disabled={!!id} */}
        {/*        // disabled={!watchFields.area} */}
        {/*        // disableClearable */}
        {/*        noOptionsText="Không có dữ liệu" */}
        {/*        getOptionLabel={option => option?.zoneName || ''} */}
        {/*        firstIndex={1} */}
        {/*        loadData={() => */}
        {/*          new Promise((resolve, reject) => { */}
        {/*            if (!watchFields.area) { */}
        {/*              resolve({ */}
        {/*                data: [], */}
        {/*                totalCount: 0, */}
        {/*              }); */}
        {/*              return; */}
        {/*            } */}
        {/*            getApi(`${SAP_SRC}/zones/search`, { */}
        {/*              areaId: getValues().area.areaId, */}
        {/*            }) */}
        {/*              .then(result => { */}
        {/*                resolve({ */}
        {/*                  data: [...result], */}
        {/*                  totalCount: result?.length || 0, */}
        {/*                }); */}
        {/*              }) */}
        {/*              .catch(err => reject(getErrorMessage(err))); */}
        {/*          }) */}
        {/*        } */}
        {/*        getOptionSelected={(option, selected) => */}
        {/*          option.zoneCode === selected.zoneCode */}
        {/*        } */}
        {/*        onChange={(e, value) => { */}
        {/*          props.onChange(value); */}
        {/*          setValue('block', null); */}
        {/*        }} */}
        {/*        renderInput={params => ( */}
        {/*          <TextField */}
        {/*            {...params} */}
        {/*            variant="outlined" */}
        {/*            placeholder="Chọn phân khu" */}
        {/*            error={!!errors.zone} */}
        {/*            helperText={errors.zone && errors.zone.message} */}
        {/*          /> */}
        {/*        )} */}
        {/*      /> */}
        {/*    )} */}
        {/*  /> */}
        {/* </Grid> */}
        {/* <Grid item xs={12} sm={6}> */}
        {/*  <p className={classes.label}> */}
        {/*    Tòa nhà<span style={{ color: 'red' }}>*</span> */}
        {/*  </p> */}
        {/*  <Controller */}
        {/*    control={control} */}
        {/*    name="block" */}
        {/*    defaultValue="" */}
        {/*    render={props => ( */}
        {/*      <VAutocomplete */}
        {/*        value={props.value} */}
        {/*        fullWidth */}
        {/*        virtual={false} */}
        {/*        disabled={!!id} */}
        {/*        // disabled={!watchFields.zone} */}
        {/*        // disableClearable */}
        {/*        noOptionsText="Không có dữ liệu" */}
        {/*        getOptionLabel={option => option?.blockName || ''} */}
        {/*        firstIndex={1} */}
        {/*        loadData={() => */}
        {/*          new Promise((resolve, reject) => { */}
        {/*            if (!watchFields.zone) { */}
        {/*              resolve({ */}
        {/*                data: [], */}
        {/*                totalCount: 0, */}
        {/*              }); */}
        {/*              return; */}
        {/*            } */}
        {/*            getApi(`${SAP_SRC}/blocks/search`) */}
        {/*              .then(result => { */}
        {/*                resolve({ */}
        {/*                  data: [...result], */}
        {/*                  totalCount: result?.length || 0, */}
        {/*                }); */}
        {/*              }) */}
        {/*              .catch(err => reject(getErrorMessage(err))); */}
        {/*          }) */}
        {/*        } */}
        {/*        getOptionSelected={(option, selected) => */}
        {/*          option.blockId === selected.blockId */}
        {/*        } */}
        {/*        onChange={(e, value) => { */}
        {/*          props.onChange(value); */}
        {/*          setValue('floor', null); */}
        {/*        }} */}
        {/*        renderInput={params => ( */}
        {/*          <TextField */}
        {/*            {...params} */}
        {/*            variant="outlined" */}
        {/*            placeholder="Chọn tòa nhà" */}
        {/*            error={!!errors.block} */}
        {/*            helperText={errors.block && errors.block.message} */}
        {/*          /> */}
        {/*        )} */}
        {/*      /> */}
        {/*    )} */}
        {/*    VAutocomple */}
        {/*  /> */}
        {/* </Grid> */}
        <Grid item xs={12} sm={6}>
          <p className={classes.label}>
            Tầng<span style={{ color: 'red' }}> *</span>
          </p>
          <Controller
            control={control}
            name="floor"
            defaultValue=""
            render={props => (
              <VAutocomplete
                value={props.value}
                fullWidth
                virtual={false}
                disabled={!!id}
                // disabled={!watchFields.block}
                // disableClearable
                noOptionsText="Không có dữ liệu"
                getOptionLabel={option => option?.floorName || ''}
                firstIndex={1}
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
                      .then(result => {
                        resolve({
                          data: [...result],
                          totalCount: result?.length || 0,
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
                    error={!!errors.floor}
                    helperText={errors.floor && errors.floor.message}
                  />
                )}
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Controller
                control={control}
                name="forceUpdate"
                defaultValue=""
                render={({ onChange, value }) => (
                  <Checkbox
                    onChange={e => onChange(e.target.checked)}
                    checked={!!value}
                    color="primary"
                  />
                )}
              />
            }
            label="Force update"
          />
        </Grid>
        <Grid
          item
          container
          xs={12}
          justify="space-between"
          alignItems="center"
        >
          <Grid item>
            <p className={classes.label}>
              Ảnh bản đồ<span style={{ color: 'red' }}> *</span>
            </p>
          </Grid>
          {/* <Grid item>Chọn file</Grid> */}
        </Grid>
        <Grid item xs={12}>
          <div>
            <Controller
              control={control}
              name="map"
              render={({ onChange, value }) => (
                <FormUploadWrap>
                  {value && (
                    <TextField
                      value={value?.name}
                      fullWidth
                      disabled
                      variant="outlined"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment
                            position="end"
                            style={{ cursor: 'pointer' }}
                          >
                            <ClearIcon
                              onClick={e => {
                                e.stopPropagation();
                                onChange(null);
                              }}
                            />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                  {!value && (
                    <Fragment>
                      <div
                        id="dropzone-upload-item-map"
                        style={{
                          border: `1px dashed ${
                            errors.map ? '#FF0000' : '#787878'
                          }`,
                        }}
                        className={classes.uploadImageContainer}
                      >
                        <div className="img-choose-file">
                          <img alt="" src={DragdropBG} />
                        </div>
                      </div>
                      <FileUploader
                        multiple={false}
                        onValueChanged={e => {
                          handleUploadFile(
                            e,
                            ['image/jpg', 'image/jpeg', 'image/png'],
                            'map',
                            onChange,
                          );
                        }}
                        accept=".jpg,.png"
                        visible={false}
                        dialogTrigger="#dropzone-upload-item-map"
                        dropZone="#dropzone-upload-item-map"
                        uploadMode="useButtons"
                      />
                    </Fragment>
                  )}
                </FormUploadWrap>
              )}
            />
            {errors.map && (
              <FormHelperText style={{ color: '#f44336' }}>
                {errors.map.message}
              </FormHelperText>
            )}
          </div>
        </Grid>
        <Grid
          item
          container
          xs={12}
          justify="space-between"
          alignItems="center"
        >
          <Grid item>
            <p className={classes.label}>
              Dữ liệu<span style={{ color: 'red' }}> *</span>
            </p>
          </Grid>
          {/* <Grid item>Chọn file</Grid> */}
        </Grid>
        <Grid item xs={12}>
          <div>
            <Controller
              control={control}
              name="zipData"
              render={({ onChange, value }) => (
                <FormUploadWrap>
                  {value && (
                    <TextField
                      value={value?.name}
                      fullWidth
                      disabled
                      variant="outlined"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment
                            position="end"
                            style={{ cursor: 'pointer' }}
                          >
                            <ClearIcon
                              onClick={e => {
                                e.stopPropagation();
                                onChange(null);
                              }}
                            />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                  {!value && (
                    <Fragment>
                      <div
                        id="dropzone-upload-item-zip"
                        style={{
                          border: `1px dashed ${
                            errors.zipData ? '#FF0000' : '#787878'
                          }`,
                        }}
                        className={classes.uploadImageContainer}
                      >
                        <div className="img-choose-file">
                          <img alt="" src={DragdropBG} />
                        </div>
                      </div>
                      <FileUploader
                        multiple={false}
                        onValueChanged={e => {
                          handleUploadFile(
                            e,
                            [
                              'zip',
                              'application/octet-stream',
                              'application/zip',
                              'application/x-zip',
                              'application/x-zip-compressed',
                            ],
                            'zipData',
                            onChange,
                          );
                        }}
                        accept=".zip"
                        visible={false}
                        uploadMode="useButtons"
                        dialogTrigger="#dropzone-upload-item-zip"
                        dropZone="#dropzone-upload-item-zip"
                      />
                    </Fragment>
                  )}
                </FormUploadWrap>
              )}
            />
            {errors.zipData && (
              <FormHelperText style={{ color: '#f44336' }}>
                {errors.zipData.message}
              </FormHelperText>
            )}
          </div>
        </Grid>
      </Grid>
      <DialogActions>
        <BtnCancel onClick={onClose}>Hủy</BtnCancel>
        <BtnSuccess onClick={handleSubmit(onSubmit)}>Lưu</BtnSuccess>
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

export default AddMap;
