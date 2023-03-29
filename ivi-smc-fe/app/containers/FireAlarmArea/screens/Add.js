/**
 *
 * CamAiConfigHumanFaceModule
 *
 */

import React, { Fragment, useEffect, useState } from 'react';
// import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
// import { useIntl } from 'react-intl';
import ClearIcon from '@material-ui/icons/Clear';
import Img from 'components/Imge';

import * as yup from 'yup';
import BtnCancel from 'components/Button/BtnCancel';
import BtnSuccess from 'components/Button/BtnSuccess';
import { FileUploader, Button } from 'devextreme-react';
import styled from 'styled-components';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import { useHistory, useParams } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import Loading from 'containers/Loading/Loadable';
// import messages from './messages';
import PageHeader from 'components/PageHeader';
import DragdropBG from 'images/dragndrop-1.svg';
import { showError, showSuccess } from 'utils/toast-utils';
// import { FAKE_DATA } from './constants';
import { buildUrlWithToken, validationSchema } from 'utils/utils';
import {
  FormHelperText,
  Grid,
  InputAdornment,
  Paper,
  TextField,
  IconButton,
} from '@material-ui/core';
import CustomTextField from 'containers/CamAiConfigHumanFaceModule/components/CustomTextField';
import VAutocomplete from 'components/VAutocomplete';
import {
  callApiWithConfig,
  delApi,
  getApi,
  METHODS,
  postApi,
  putApi,
} from 'utils/requestUtils';
import { API_ROUTE, FIRE_ALARM_API, SAP_SRC } from 'containers/apiUrl';
import { getErrorMessage } from 'containers/Common/function';
import _ from 'lodash';
import PopupDelete from 'components/Custom/popup/PopupDelete';
import reducer from '../reducer';
import saga from '../saga';
import { BtnCancelWrap, useStyles } from '../styles';
import ListCamera from '../components/ListCamera';

const key = 'camAiConfigHumanFaceModule';

const initValues = {
  locationName: null,
  floor: null,
  device: null,
  cameras: [],
  areaImage: null,
};

export function AddNewFireAlarmArea() {
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });
  const history = useHistory();
  const { id, mode } = useParams();
  // const intl = useIntl();
  const classes = useStyles();

  const [loading, setLoading] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  const schema = validationSchema({
    locationName: yup
      .string()
      .trim()
      .nullable()
      .required('Trường này bắt buộc nhập'),
    floor: yup
      .object()
      .shape()
      .nullable()
      .required('Trường này bắt buộc nhập'),
    device: yup
      .object()
      .shape()
      .nullable()
      .required('Trường này bắt buộc nhập'),
    cameras: yup.array().min(1, 'Bắt buộc ít nhất 1 camera'),
  });

  const {
    handleSubmit,
    control,
    setValue,
    reset,
    watch,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: initValues,
    resolver: schema,
    mode: 'onChange',
  });

  const handleUploadFileBeforeSubmit = async file => {
    const formData = new FormData();
    formData.append('file', file);
    // formData.append('isPublic ', true);
    setLoading(true);
    try {
      const res = await callApiWithConfig(
        `${API_ROUTE.UPLOAD_API}?path=fireAlarmArea`,
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

  const fileToBase64 = async file => {
    function getBase64(file) {
      const reader = new FileReader();
      return new Promise(resolve => {
        reader.onload = ev => {
          resolve(ev.target.result);
        };
        reader.readAsDataURL(file);
      });
    }
    const data = await getBase64(file);
    return data;
  };

  const handleUploadFile = async (e, acceptType, field) => {
    if (!acceptType.includes(e.value[0].type)) {
      showError('File không đúng định dạng');
      return;
    }
    const arrayOfBase64 = await fileToBase64(e.value[0]);
    setValue(field, {
      file: e.value[0],
      url: arrayOfBase64,
      isGetFromDetail: false,
    });
  };

  const watchField = watch(['floor', 'cameras']);

  const handleCreate = async payload => {
    setLoading(true);
    try {
      await postApi(FIRE_ALARM_API.CREATE_FAS, _.pickBy(payload));
      showSuccess('Tạo mới thành công');
      onBack();
    } catch (error) {
      showError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async payload => {
    setLoading(true);
    try {
      await putApi(FIRE_ALARM_API.FAS_INFOR(id), _.pickBy(payload));
      showSuccess('Cập nhật thành công');
      onBack();
    } catch (error) {
      showError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    setLoading(true);
    delApi(FIRE_ALARM_API.FAS_INFOR(id))
      .then(() => {
        setShowDeletePopup(false);
        showSuccess('Xóa khu vực thành công');
        onBack();
      })
      .catch(err => {
        showError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onSubmit = async values => {
    if (id && !isEditMode) {
      // setIsEditMode(true);
      history.push(`/fire-alarm-area/${id}/edit`);
      return;
    }
    const areaImage = values?.areaImage?.isGetFromDetail
      ? values.areaImage
      : values?.areaImage?.file
      ? await handleUploadFileBeforeSubmit(values.areaImage.file)
      : null;
    const payload = {
      areaId: +process.env.AREA_ID,
      cameraIds: values?.cameras?.map(cam => cam.cameraId),
      deviceId: values?.device?.deviceId,
      directionFileId: areaImage?.id || null,
      floorId: values?.floor?.id,
      locationName: values?.locationName,
    };
    if (id) {
      handleUpdate(payload);
    } else {
      handleCreate(payload);
    }
  };

  const onBack = () => {
    if (history.length > 1) {
      history.goBack();
    } else {
      history.push('/fire-alarm-area');
    }
  };

  const onResetFormData = values => {
    reset({
      locationName: values.locationName,
      floor: {
        id: values.floorId,
        floorId: values.floorId,
        floorName: values.floorName,
        areaId: values.areaId,
        blockId: values.blockId,
        zoneId: values.zoneId,
      },
      device: { deviceId: values.deviceId, deviceName: values.deviceName },
      cameras: values.cameras
        .filter(cam => cam.id != null)
        .map(cam => ({
          ...cam,
          id: `cameraId_${values?.blockId ? 'blockId_' : ''}${
            values?.zoneId ? 'zoneId_' : ''
          }${values?.floorId ? 'floorId' : ''}${cam.id}`,
          cameraId: cam.id,
          floor_id: values.floorId,
        })),
      areaImage: {
        name: values.directionFileName || 'BE chưa trả tên',
        id: values.directionFileId || null,
        url: values.directionFileUrl || '',
        isGetFromDetail: true,
      },
    });
  };

  const fetchDetail = async () => {
    setLoading(true);
    try {
      const res = await getApi(FIRE_ALARM_API.FAS_INFOR(id));
      onResetFormData(res.data);
      setDetailData(res.data);
    } catch (error) {
      showError(error);
    } finally {
      setLoading(false);
    }
  };

  const onCancelBtnClick = () => {
    if (id) {
      if (isEditMode) {
        onBack();
        // onResetFormData(detailData);
        // setIsEditMode(false);
      } else {
        setShowDeletePopup(true);
      }
    } else {
      onBack();
    }
  };

  const deletePopup = () => (
    <PopupDelete
      onClickSave={() => handleDelete()}
      textFollowTitle="Khu vực báo cháy này sẽ bị xóa và không thể hoàn tác."
      title="Xóa khu vực báo cháy?"
      onClose={() => {
        setShowDeletePopup(false);
      }}
    />
  );

  useEffect(() => {
    if (id) {
      fetchDetail();
    }
  }, [id]);

  useEffect(() => {
    if (detailData && mode && mode === 'edit') {
      setIsEditMode(true);
    }
  }, [detailData]);

  return (
    <React.Fragment>
      <Helmet>
        <title>{}</title>
        <meta
          name="description"
          content={`${
            id
              ? isEditMode
                ? 'Cập nhật khu vực báo cháy'
                : 'Chi tiết khu vực báo cháy'
              : 'Thêm khu vực báo cháy'
          }`}
        />
      </Helmet>
      {loading && <Loading />}
      {showDeletePopup && deletePopup()}
      <PageHeader
        title={`${
          id
            ? isEditMode
              ? 'Cập nhật khu vực báo cháy'
              : 'Chi tiết khu vực báo cháy'
            : 'Thêm khu vực báo cháy'
        }`}
        showBackButton
        onBack={() => {
          onBack();
        }}
      >
        <BtnCancelWrap>
          <Button
            id="test"
            text={`${id ? (isEditMode ? 'Hủy' : 'Xóa') : 'Hủy'}`}
            onClick={() => {
              onCancelBtnClick();
            }}
          />
        </BtnCancelWrap>
        <BtnSuccess
          type="success"
          id="btnSaveAndContinue"
          text={`${id ? (isEditMode ? 'Lưu' : 'Cập nhật') : 'Tạo'}`}
          onClick={handleSubmit(onSubmit)}
        />
      </PageHeader>
      <form className={classes.root}>
        <Paper>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <p className={classes.label}>
                Tên khu vực <span style={{ color: 'red' }}>*</span>
              </p>
              <CustomTextField
                control={control}
                errors={errors}
                name="locationName"
                placeholder="Nhập tên khu vực"
                disabled={!isEditMode && !!id}
              />
            </Grid>
            <Grid item xs={6}>
              <p className={classes.label}>
                Tầng<span style={{ color: 'red' }}>*</span>
              </p>
              <Controller
                control={control}
                name="floor"
                defaultValue=""
                render={props => (
                  <VAutocomplete
                    disabled={!isEditMode && !!id}
                    value={getValues().floor || ''}
                    fullWidth
                    noOptionsText="Không có dữ liệu"
                    getOptionLabel={option => option?.floorName || ''}
                    firstIndex={1}
                    loadData={(page, keyword) =>
                      new Promise((resolve, reject) => {
                        const payload = {
                          limit: 50,
                          page,
                          searchValue: keyword,
                        };
                        getApi(`${SAP_SRC}/floors`, _.pickBy(payload))
                          .then(result => {
                            const data = [...result.rows];
                            resolve({
                              data,
                              totalCount: result?.count || 0,
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
                        disabled={!isEditMode && !!id}
                      />
                    )}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <p className={classes.label}>
                Thiết bị<span style={{ color: 'red' }}>*</span>
              </p>
              <Controller
                control={control}
                name="device"
                defaultValue=""
                render={props => (
                  <VAutocomplete
                    disabled={!isEditMode && !!id}
                    value={getValues().device || ''}
                    fullWidth
                    noOptionsText="Không có dữ liệu"
                    getOptionLabel={option => option?.deviceName || ''}
                    getOptionDisabled={option => {
                      const isDisabled = id
                        ? option.used === true &&
                          option.deviceId !== detailData.deviceId // case update
                        : option.used === true; // case create
                      return isDisabled;
                    }}
                    firstIndex={1}
                    loadData={(page, keyword) =>
                      new Promise((resolve, reject) => {
                        const payload = {
                          limit: 50,
                          page,
                          deviceName: keyword,
                        };
                        getApi(
                          FIRE_ALARM_API.LIST_FAS_DEVICES,
                          _.pickBy(payload),
                        )
                          .then(result => {
                            const data = [...result.data.rows];
                            resolve({
                              data,
                              totalCount: result?.data?.count || 0,
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
                        disabled={!isEditMode && !!id}
                        {...params}
                        variant="outlined"
                        placeholder="Chọn thiết bị"
                        error={!!errors.device}
                        helperText={errors.device && errors.device.message}
                      />
                    )}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <p className={classes.label}>
                Camera khu vực<span style={{ color: 'red' }}>*</span>
              </p>
              {errors.cameras && (
                <FormHelperText style={{ color: '#f44336' }}>
                  {errors.cameras.message}
                </FormHelperText>
              )}
              <Controller
                control={control}
                name="cameras"
                defaultValue=""
                render={props => (
                  <ListCamera
                    dataDetail={watchField.floor || null}
                    listCamera={watchField.cameras || []}
                    setListCamera={props.onChange}
                    screen={`/fire-alarm-area/${id ? 'add' : `${id}/edit`}`}
                    isDisabled={!isEditMode && !!id}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <p className={classes.label}>Ảnh khu vực</p>
              <div>
                <Controller
                  control={control}
                  name="areaImage"
                  render={({ onChange, value }) => (
                    <FormUploadWrap>
                      {value && value.url && (
                        <div className={classes.cardImageContainer}>
                          <div className="card-img">
                            <Img
                              src={
                                value.url.includes('libraries/download')
                                  ? buildUrlWithToken(value.url)
                                  : value.url
                              }
                              className="hover-image"
                            />
                            <IconButton
                              className="close"
                              onClick={() => {
                                if (!isEditMode && !!id) {
                                  return;
                                }
                                setValue('areaImage', null);
                              }}
                            >
                              &times;
                            </IconButton>
                          </div>
                        </div>
                      )}
                      {!value?.url && (
                        <Fragment>
                          <div
                            id="dropzone-upload-item"
                            style={{
                              border: `1px dashed ${
                                errors.zipData ? '#FF0000' : '#787878'
                              }`,
                            }}
                            className={classes.uploadImageContainer}
                          >
                            <div className="img-choose-file">
                              <img alt="" src={DragdropBG} />
                              <p>Ảnh khu vực</p>
                            </div>
                          </div>
                          <FileUploader
                            disabled={!isEditMode && !!id}
                            multiple={false}
                            onValueChanged={e => {
                              handleUploadFile(
                                e,
                                ['image/jpg', 'image/jpeg', 'image/png'],
                                'areaImage',
                                onChange,
                              );
                            }}
                            accept=".jpg,.png"
                            visible={false}
                            uploadMode="useButtons"
                            dialogTrigger="#dropzone-upload-item"
                            dropZone="#dropzone-upload-item"
                          />
                        </Fragment>
                      )}
                    </FormUploadWrap>
                  )}
                />
              </div>
            </Grid>
          </Grid>
        </Paper>
      </form>
    </React.Fragment>
  );
}

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

export default AddNewFireAlarmArea;
