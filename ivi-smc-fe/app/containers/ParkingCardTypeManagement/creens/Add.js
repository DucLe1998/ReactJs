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
import DatePicker from 'components/DatePicker';

import { TextBox } from 'devextreme-react/text-box';
import InputAdornment from '@material-ui/core/InputAdornment';
import { useStyles } from '../styled';
import { API_PARKING, API_ROUTE, SAP_SRC } from '../../apiUrl';
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
import TextareaAutosize from '@material-ui/core/TextareaAutosize';

const initValues = {
  area: null,
  zone: null,
  block: null,
  floor: null,
  forceUpdate: false,
  map: null,
  zipData: null,
};

export const AddHmi = ({ onClose, id, setReload }) => {
  const classes = useStyles();

  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState(null);
  const [fileUploadName, setFileUploadName] = useState('');
  const [fileUploadError, setFileUploadError] = useState('');
  // const fetchDataSource = () => {
  //   setLoading(true);
  //   getApi(`${API_PARKING.ADD_MAP_INDOOR}/${id}`)
  //     .then(response => {
  //       setDetail(response.data);
  //     })
  //     .catch(err => {
  //       showError(getErrorMessage(err));
  //     })
  //     .finally(() => {
  //       setLoading(false);
  //     });
  // };
  const schema = validationSchema({
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
    // if (id) {
    // }
  }, []);
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
      <DialogTitle className="title">
        {id ? 'Sửa thuê bao' : 'Thêm thuê bao'}
      </DialogTitle>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <p className={classes.label}>
            Mã thuê bao<span style={{ color: 'red' }}> </span>
          </p>
          <Controller
            control={control}
            name="floor"
            defaultValue=""
            render={props => (
              <TextBox
                maxLength="50"
                width="100%"
                defaultValue="123"
                disabled={true}
                style={{
                  background: '#F1F1F1',
                  color: '#A4A4A4',
                }}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <p className={classes.label}>
            Ngày bắt đầu<span style={{ color: 'red' }}> </span>
          </p>
          <Controller
            control={control}
            name="floor"
            defaultValue=""
            render={props => (
              <DatePicker
                
              />
            )}
          />
        </Grid>

        
        <Grid item xs={12} sm={6}>
          <p className={classes.label}>
            Trạng thái<span style={{ color: 'red' }}> </span>
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
                // disabled={!watchFields.block}
                // disableClearable
                noOptionsText="Không có dữ liệu"
                getOptionLabel={option => option?.statusName || ''}
                firstIndex={1}
                getOptionSelected={(option, selected) =>
                  option.statusId === selected.statusId
                }
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
                        var result2 = [
                          { statusId: 'code1', statusName: 'Khu do thi'},
                          { statusId: 'code2', statusName: 'Khu do thi 2'},
                          { statusId: 'code3', statusName: 'Khu do thi 3'},
                          { statusId: 'code4', statusName: 'Khu do thi 4'},
                          { statusId: 'code5', statusName: 'Khu do thi 5'},
                        ]
                        resolve({
                          data: [...result2],
                          totalCount: result2?.length || 0,
                        });
                      })
                      .catch(err => reject(getErrorMessage(err)));
                  })
                }
                onChange={(e, value) => {
                  props.onChange(value);
                }}
                renderInput={params => (
                  <TextField
                    {...params}
                    variant="outlined"
                    placeholder="Chọn trạng thái"
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
            Bãi xe được vào<span style={{ color: 'red' }}> </span>
          </p>
          <Controller
            control={control}
            name="flow"
            defaultValue={[]}
            render={props => (
              <MultiSelect
                  value={props.value}
                  placeholder="Chọn bãi xe"
                  selectAllLabel="Tất cả"
                  onChangeValue={props.onChange}
                  options={statusNewsManagement}
              />
            )}
          />
        </Grid>


        <Grid item xs={12}>
          <p className={classes.label}>
            Cấu hình<span style={{ color: 'red' }}> </span>
          </p>
          <Controller
            control={control}
            name="floor"
            defaultValue=""
            render={props => (
              <TextareaAutosize
                placeholder="Empty"
                minRows={8}
                style={{
                  width: '100%',
                  height: '70%',
                  border: '0.5px solid #E0E0E0',
                  padding: '8px 8px',
                }}
                defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
                  ut labore et dolore magna aliqua."
              />
            )}
          />
          <FormHelperText style={{ color: '#FF0707' }}>
              Cấu hình không hợp lệ
          </FormHelperText>
        </Grid>
        

      </Grid>

      <DialogActions>
        <BtnCancel onClick={onClose}>Hủy</BtnCancel>
        <BtnSuccess onClick={handleSubmit()}>{id ? 'Lưu' : 'Thêm'}</BtnSuccess>
      </DialogActions>
    </form>
  );
};


export default AddHmi;
