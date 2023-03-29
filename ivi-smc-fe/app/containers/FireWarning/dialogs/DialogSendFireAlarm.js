import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import React, { useCallback, useEffect, useState } from 'react';
import {
  DialogActions,
  Grid,
  InputAdornment,
  TextField,
} from '@material-ui/core';
import _ from 'lodash';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Button } from 'devextreme-react';
import { format } from 'date-fns';
import { validationSchema } from '../../../utils/utils';
import { rootStyles } from '../styles';
import BtnCancel from '../../../components/Button/BtnCancel';
// import BtnSuccess from '../../../components/Button/BtnSuccess';
// import Loading from '../../Loading';
import { ISSUES_TYPE } from '../constants';
import { getApi, postApi } from '../../../utils/requestUtils';
import { FIRE_ALARM_API } from '../../apiUrl';
import { showError, showSuccess } from '../../../utils/toast-utils';

const initVal = {
  issueType: ISSUES_TYPE[0],
  title: null,
  content: null,
  issueId: null,
  sourceId: null,
};

export const SendFireAlarm = ({ onClose, issueId, setLoading }) => {
  // const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState(null);
  const classes = rootStyles();

  const schema = validationSchema({
    content: yup
      .string()
      .nullable()
      .required('Trường này bắt buộc nhập')
      .min(11, 'Tối thiểu 11 kí tự'),
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    getValues,
  } = useForm({
    defaultValues: initVal,
    resolver: schema,
    mode: 'onChange',
  });

  const fetchDetailData = () => {
    setLoading(true);
    getApi(FIRE_ALARM_API.INFOR(issueId))
      .then(res => {
        setDetail(res.data);
      })
      .catch(err => {
        showError(err);
        onClose();
      })
      .finally(() => setLoading(false));
  };

  const onSubmit = value => {
    const payload = {
      areaId: 19,
      issueId,
      issueType: value.issueType.id,
      content: value.content,
      sourceId: value.sourceId.id,
      title: value.title || value.issueType.name,
      // targetIds: [value.sourceId.id],
      targetType: 'TOPIC',
    };
    setLoading(true);
    postApi(FIRE_ALARM_API.PUSH_NOTI, payload)
      .then(() => {
        showSuccess('Gửi thông báo xác nhận báo cháy thành công');
        onClose();
      })
      .catch(err => {
        showError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const setFormData = () => {
    reset({
      ...getValues(),
      sourceId: {
        id: detail.zoneId,
        name: `${detail.location || ''}`,
      },
    });
  };
  useEffect(() => {
    fetchDetailData();
  }, [issueId]);

  useEffect(() => {
    if (detail?.id) {
      setFormData();
    }
  }, [detail]);

  return (
    <React.Fragment>
      <form className={classes.root}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <p className={classes.label}>Thời gian</p>
            <TextField
              size="small"
              InputProps={{
                readOnly: true,
              }}
              variant="outlined"
              value={
                detail?.createdDate
                  ? format(new Date(detail.createdDate), 'HH:mm dd/MM/yyyy')
                  : ''
              }
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <p className={classes.label}>Vị trí báo cháy</p>
            <Controller
              control={control}
              name="sourceId"
              defaultValue=""
              render={props => (
                <Autocomplete
                  value={props.value || ''}
                  className={classes.autocomplete}
                  options={ISSUES_TYPE}
                  fullWidth
                  size="small"
                  freeSolo
                  getOptionLabel={option => option?.name || ''}
                  getOptionSelected={(option, selected) =>
                    option.id === selected.id
                  }
                  onChange={(e, value) => {
                    props.onChange(value);
                  }}
                  renderInput={params => (
                    <TextField
                      {...params}
                      variant="outlined"
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  )}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <p className={classes.label}>Loại thông báo</p>
            <Controller
              control={control}
              name="issueType"
              defaultValue=""
              render={props => (
                <Autocomplete
                  value={props.value || ''}
                  className={classes.autocomplete}
                  options={ISSUES_TYPE}
                  size="small"
                  fullWidth
                  getOptionLabel={option => option?.name || ''}
                  getOptionSelected={(option, selected) =>
                    option.id === selected.id
                  }
                  onChange={(e, value) => {
                    props.onChange(value);
                  }}
                  renderInput={params => (
                    <TextField {...params} variant="outlined" />
                  )}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <p className={classes.label}>Tiêu đề</p>
            <Controller
              control={control}
              name="title"
              defaultValue=""
              render={props => (
                <TextField
                  size="small"
                  className={classes.textField}
                  error={!!errors.title}
                  helperText={errors.title && errors.title.message}
                  variant="outlined"
                  value={props.value || ''}
                  onChange={e => {
                    props.onChange(e.target.value);
                  }}
                  placeholder="Nhập tiêu đề thông báo"
                  fullWidth
                  InputProps={{
                    inputProps: {
                      maxLength: 65,
                    },
                    endAdornment: (
                      <InputAdornment
                        position="end"
                        style={{ cursor: 'pointer' }}
                        id="dropzone-upload-item-map"
                      >
                        {props?.value?.length || 0}/65
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <p className={classes.label}>
              Nội dung<span style={{ color: 'red' }}>*</span>
            </p>
            <Controller
              control={control}
              name="content"
              defaultValue=""
              render={props => (
                <TextField
                  size="small"
                  className={classes.textField}
                  error={!!errors.content}
                  helperText={errors.content && errors.content.message}
                  variant="outlined"
                  value={props.value || ''}
                  onChange={e => {
                    props.onChange(e.target.value);
                  }}
                  placeholder="Nhập nội dung thông báo"
                  fullWidth
                  InputProps={{
                    inputProps: {
                      maxLength: 100,
                    },
                    endAdornment: (
                      <InputAdornment
                        position="end"
                        style={{ cursor: 'pointer' }}
                        id="dropzone-upload-item-map"
                      >
                        {props?.value?.length || 0}/100
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
          </Grid>
          {/* <Grid item xs={12} sm={6}>
            <p className={classes.label}>
              Tòa nhà gửi thông báo<span style={{ color: 'red' }}>*</span>
            </p>
            <Controller
              control={control}
              name="targets"
              defaultValue=""
              render={props => (
                <VAutocomplete
                  value={props.value}
                  fullWidth
                  virtual={false}
                  noOptionsText="Không có dữ liệu"
                  getOptionLabel={option => option?.blockName || ''}
                  firstIndex={1}
                  loadData={() =>
                    new Promise((resolve, reject) => {
                      if (!detail.zoneCode) {
                        resolve({
                          data: [],
                          totalCount: 0,
                        });
                        return;
                      }
                      getApi(`${SAP_SRC}/blocks/search`, {
                        zoneCode: detail.zoneCode,
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
                    option.blockId === selected.blockId
                  }
                  onChange={(e, value) => {
                    props.onChange(value);
                  }}
                  renderInput={params => (
                    <TextField
                      {...params}
                      variant="outlined"
                      placeholder="Chọn tòa nhà"
                      error={!!errors.block}
                      helperText={errors.block && errors.block.message}
                    />
                  )}
                  renderTags={(tagValue, getTagProps) =>
                    tagValue.map((option, index) => (
                      <Chip
                        label={option.title}
                        {...getTagProps({ index })}
                        disabled={option.blockId === detail.blockId}
                      />
                    ))
                  }
                />
              )}
              VAutocomple
            />
          </Grid> */}
        </Grid>
        <DialogActions>
          <BtnCancel onClick={onClose}>Hủy</BtnCancel>
          <Button
            onClick={handleSubmit(onSubmit)}
            style={{
              height: '40px',
              background: '#00554a',
              borderRadius: '8px',
              color: '#ffffff',
              '&:hover': {
                opacity: '0.9',
                boxShadow: '0px 4px 10px rgba(16, 156, 241, 0.24)',
                background: '#00554a',
              },
            }}
          >
            Xác nhận thông báo cháy
          </Button>
        </DialogActions>
      </form>
    </React.Fragment>
  );
};

export default SendFireAlarm;
