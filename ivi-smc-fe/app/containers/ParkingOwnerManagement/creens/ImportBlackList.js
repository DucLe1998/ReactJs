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
  Button,
} from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import * as yup from 'yup';
import styled from 'styled-components';
import FileUploader from 'devextreme-react/file-uploader';
import CustomUploadFile from 'components/CustomUploadFile';
import DatePicker from 'components/DatePicker';
import MultiSelect from '../../../components/MultiSelect';
import { TextBox } from 'devextreme-react/text-box';
import InputAdornment from '@material-ui/core/InputAdornment';
import { useStyles } from '../styled';
import { API_PARKING, API_ROUTE, SAP_SRC } from '../../apiUrl';
import VAutocomplete from '../../../components/VAutocomplete';
import InsertDriveFileOutlinedIcon from '@material-ui/icons/InsertDriveFileOutlined';
import FileSaver from 'file-saver';
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
import TextareaAutosize from '@material-ui/core/TextareaAutosize';

const initValues = {
  area: null,
  zone: null,
  block: null,
  status: null,
  floor: null,
  forceUpdate: false,
  map: null,
  zipData: null,
};

export const ImportBlackList = ({ onClose, id, setReload }) => {
  const [typeInput, setTypeInput] = useState('input');

  const classes = useStyles();

  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState(null);
  const [fileUploadName, setFileUploadName] = useState('');
  const [fileUploadError, setFileUploadError] = useState('');

  const fetchDataSource = () => {
    setLoading(true);
    getApi(`${API_PARKING.ADD_MAP_INDOOR}/${id}`)
      .then(response => {
        
        //setDetail(response.data);
      })
      .catch(err => {
        let dataCheck = {
          area: 'Name',
          zone: {
            zoneId: 1,
            zoneName: 'Name',
          },
          status: {
            statusId: '1',
            statusName: 'Name',
          },
          block: {
            blockId: 1,
            blockName: 'Name',
          },
          floor: {
            floorId: 1,
            floorName: 'Name',
          },
          forceUpdate: false,
          map: {
            name: 'Name',
            id: 1,
          },
          zipData: {
            name: 'Name',
            id: 1,
          },
        };
        setDetail(dataCheck);
        //showError(getErrorMessage(err));
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const schema = validationSchema({
    // area: yup
    //   .object()
    //   .shape()
    //   .nullable(),
    // // .required('Trường này bắt buộc nhập'),
    // zone: yup
    //   .object()
    //   .shape()
    //   .nullable(),
    // // .required('Trường này bắt buộc nhập'),
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
    reset({
      area: detail?.area,
      zone: {
        zoneId: detail?.zone?.zoneId,
        zoneName: detail?.zone?.zoneName,
      },
      status: {
        statusId: detail?.status?.statusId,
        statusName: detail?.status?.statusName,
      },
      block: {
        blockId: detail?.buildingId,
        blockName: detail?.buildingName,
      },
      floor: {
        floorId: detail?.floorId,
        floorName: detail?.floorName,
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
    console.log('Submit.....',values)
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

  const handleAdd = params => {
    setLoading(true);
    postApi(API_PARKING.ADD_MAP_INDOOR, params)
      .then(() => {
        showSuccess('Thành công');
        setReload();
        onClose();
      })
      .catch(err => {
        showSuccess('Thành công');
        //showError(getErrorMessage(err));
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
        //showError(getErrorMessage(err));
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
    formData.append('service', 'SMART_PARKING');
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

  const downloadFileExample = async () => {
    const url =
      typeInput == 'input'
        ? 'upload-cards/template'
        : 'upload-card-assigned-user/template';
    try {
      const response = await getApi(
        `/cards/${url}`,
        {},
        {
          responseType: 'blob',
        },
      );
      FileSaver.saveAs(response, 'card-template.xlsx');
    } catch (err) {
      showError(err);
    }
  };

  return (
    <form className={classes.modal}>
      {loading && <Loading />}
      <Grid container spacing={4}>
        <Grid item xs={12} sm={12}>
          <p className={classes.label}>
            File<span style={{ color: 'red' }}> </span>
          </p>
          <CustomUploadFile
            control={control}
            errors={errors}
            name="file"
            acceptType=".zip"
            handleUploadFile = {() =>{

            }} 
          />
          <p>
            <Button
              variant="contained"
              color="default"
              startIcon={<InsertDriveFileOutlinedIcon />}
              onClick={downloadFileExample}
              style={{ lineHeight: 'inherit',textTransform: 'none', borderRadius: 32, background: '#F1F1F1', border: '1px solid #E0E0E0' }}
            >
              Dữ liệu mẫu
            </Button>
          </p>
        </Grid>
      </Grid>

      <DialogActions>
        <BtnCancel onClick={onClose}>Hủy</BtnCancel>
        <BtnSuccess onClick={handleSubmit(onSubmit)}>Thêm</BtnSuccess>
      </DialogActions>
    </form>
  );
};

export default ImportBlackList;
