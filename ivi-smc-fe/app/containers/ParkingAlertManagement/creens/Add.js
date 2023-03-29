import { Controller, useForm } from 'react-hook-form';
import React, { useEffect, useState, useMemo } from 'react';
import {
  DialogActions,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  TextField,
  Button,
} from '@material-ui/core';
import * as yup from 'yup';

import { TextBox } from 'devextreme-react/text-box';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import VAutocomplete from 'components/VAutocomplete';
import { getApi, postApi, putApi } from 'utils/requestUtils';
import { validationSchema } from 'utils/utils';
import { showError, showSuccess } from 'utils/toast-utils';
import Loading from '../../Loading';
import { getErrorMessage } from '../../Common/function';
import { API_PARKING_LOT } from '../../apiUrl';
import { useStyles } from '../styled';
const initValues = {
  state: null,
  dscr: null,
};

export const AddDevice = ({ onClose, id, setReload, filter }) => {
  const classes = useStyles();

  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState(null);
  const fetchDataSource = () => {
    setLoading(true);
    
    getApi(`${API_PARKING_LOT.PARKING_ALERTS}/${id}/issue`)
      .then((response) => {
        const setData = response;
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
    state: yup.object().nullable().required('Trường này bắt buộc nhập'),
  });
  const {
    handleSubmit,
    control,
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
    reset(detail);
  };

  useEffect(() => {

    if (detail) {
      setDetailFormValue();
    }
  }, [detail]);
  useEffect(() => {
    reset({ ...initValues, ...filter });
  }, [filter]);
  const onSubmit = (values) => {
    setLoading(true);
    const params = {
      dscr: values?.dscr,
      state: values?.state,
    };
    if (id) handleUpdate(params);
    else handleAdd(params);
  };
  const handleAdd = (params) => {
    setLoading(true);
    postApi(API_PARKING_LOT.PARKING_ALERTS, params)
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
    putApi(`${API_PARKING_LOT.PARKING_ALERTS}/${id}/issue`, params)
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
      postApi(`${API_PARKING_LOT.PARKING_APGS}/checkname`, { name: value })
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
      <Grid container spacing={4}>
        <Grid item xs={12} sm={12}>
          <FormControl error={errors.state} fullWidth>
            <FormLabel>Trạng thái</FormLabel>
            <Controller
              control={control}
              name="state"
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
                  loadData={(page, keyword) => {
                    return {
                      data: [
                        { id: 'pending', value: 'Chưa xử lý' },
                        { id: 'processed', value: 'Đã xử lý' },
                      ],
                      totalCount: 2,
                    }
                  }}
                  onChange={(e, value) => {
                    props.onChange(value);
                  }}
                />
              )}
            />
            {errors.state && (
              <FormHelperText style={{ color: '#f44336' }}>
                {errors.state?.message}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormLabel>Ghi chú</FormLabel>
          <Controller
            control={control}
            name="dscr"
            render={(props) => (
              <TextareaAutosize
                placeholder="Nhập ghi chú"
                minRows={8}
                value={props.value}
                onChange={(e) => {
                  setValue('dscr', e.target.value);
                }}
                style={{
                  width: '100%',
                  height: '70%',
                  border: '0.5px solid #E0E0E0',
                  padding: '8px 8px',
                }}
              />
            )}
          />
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

export default AddDevice;
