import {
  Button,
  DialogActions,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  TextField,
} from '@material-ui/core';
import VAutocomplete from 'components/VAutocomplete';
import Loading from 'containers/Loading';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { getApi, postApi, putApi } from 'utils/requestUtils';
import { showError, showSuccess } from 'utils/toast-utils';
import { validationSchema } from 'utils/utils';
import * as yup from 'yup';
import { API_PARKING_LOT } from '../../apiUrl';
import { useStyles } from '../styled';

const initValues = {
  csn: null,
  rule: null,
  service: null,
  state: {id: 'active', value: 'Đang hoạt động'},
};

export const AddCard = ({ onClose, id, setReload }) => {
  const classes = useStyles();

  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState(null);
  const fetchDataSource = () => {
    setLoading(true);
    getApi(`${API_PARKING_LOT.PARKING_CARDS}/${id}`)
      .then((response) => {
        const setData = response.data;
        setData.rule = {
          id: response.data?.authRuleId,
          name: response.data?.authRuleName,
        };
        setData.service = {
          id: response.data?.serviceId,
          name: response.data?.serviceName,
        };
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
    csn: yup.string().trim().nullable().required('Trường này bắt buộc nhập'),
    rule: yup.object().nullable().required('Trường này bắt buộc nhập'),
    service: yup.object().nullable().required('Trường này bắt buộc nhập'),
    state: yup.object().nullable().required('Trường này bắt buộc nhập'),
  });
  const {
    handleSubmit,
    control,
    reset,
    setValue,
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
    if (detail?.csn) {
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
      csn: values.csn,
      authRuleId: values?.rule?.id,
      authRuleName: values?.rule?.name,
      serviceId: values?.service?.id,
      serviceName: values?.service?.name,
      state: values?.state,
    };
    if (id) handleUpdate(params);
    else handleAdd(params);
  };
  const handleAdd = (params) => {
    setLoading(true);
    postApi(API_PARKING_LOT.PARKING_CARDS, params)
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
    putApi(`${API_PARKING_LOT.PARKING_CARDS}/${id}`, params)
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
  return (
    <form className={classes.modal}>
      {loading && <Loading />}

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <FormControl error={errors.csn} fullWidth>
            <FormLabel required>Mã vé</FormLabel>
            <Controller
              control={control}
              name="csn"
              render={(props) => (
                <TextField
                  inputProps={{ maxLength: 50 }}
                  fullWidth
                  placeholder="Nhập mã vé"
                  value={props.value}
                  onChange={(e) => {
                    props.onChange(e.target.value);
                  }}
                  error={errors.csn}
                  helperText={errors.csn?.message}
                  variant="outlined"
                  size="small"
                  disabled={id}
                />
              )}
            />
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl error={errors.service} fullWidth>
            <FormLabel required>Loại vé</FormLabel>
            <Controller
              control={control}
              name="service"
              defaultValue=""
              render={(props) => (
                <VAutocomplete
                  value={props.value}
                  fullWidth
                  placeholder="Chọn loại vé"
                  noOptionsText="Không có dữ liệu"
                  getOptionLabel={(option) => option?.name || ''}
                  firstIndex={1}
                  getOptionSelected={(option, selected) =>
                    option.id == selected.id
                  }
                  loadData={(page, keyword) =>
                    new Promise((resolve, reject) => {
                      getApi(`${API_PARKING_LOT.PARKING_SERVICES}`, {
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
                    new Promise((resolve, reject) => {
                      getApi(`${API_PARKING_LOT.PARKING_SERVICES}/${value?.id}`)
                        .then((result) => {
                          setValue('rule',{id: result?.data.ruleId, name: result?.data.ruleName})
                        })
                        .catch((err) => reject(err));
                    })
                  }}
                />
              )}
            />
            {errors.service && (
              <FormHelperText>{errors.service?.message}</FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl error={errors.rule} fullWidth>
            <FormLabel required>Rule</FormLabel>
            <Controller
              control={control}
              name="rule"
              defaultValue=""
              render={(props) => (
                <VAutocomplete
                  value={props.value}
                  fullWidth
                  placeholder="Rule"
                  noOptionsText="Không có dữ liệu"
                  getOptionLabel={(option) => option?.name || ''}
                  firstIndex={1}
                  getOptionSelected={(option, selected) =>
                    option.id == selected.id
                  }
                  loadData={(page, keyword) =>
                    new Promise((resolve, reject) => {
                      getApi(`${API_PARKING_LOT.PARKING_RULES}`, {
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
                  disabled
                />
              )}
            />
            {errors.rule && (
              <FormHelperText>{errors.rule?.message}</FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl error={errors.state} fullWidth>
            <FormLabel required>Trạng thái</FormLabel>
            <Controller
              control={control}
              name="state"
              render={(props) => (
                <VAutocomplete
                  value={props.value}
                  fullWidth
                  placeholder="Chọn trạng thái"
                  noOptionsText="Không có dữ liệu"
                  getOptionLabel={(option) => option?.value}
                  firstIndex={1}
                  getOptionSelected={(option, selected) =>
                    option?.id == selected?.id
                  }
                  loadData={() =>
                    new Promise((resolve, reject) => {
                      getApi(`${API_PARKING_LOT.GET_DATA_STATE('cards')}`)
                        .then((result) => {
                          resolve({
                            data: [...result.stateType],
                            totalCount: result?.stateType?.length || 0,
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
            {errors.state && (
              <FormHelperText>{errors.state?.message}</FormHelperText>
            )}
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
        >
          {id ? 'Lưu' : 'Thêm'}
        </Button>
      </DialogActions>
    </form>
  );
};

export default AddCard;
