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
import VAutocomplete from 'components/VAutocomplete';
// import FormGroup from 'components/FormGroup';
import { getApi, postApi, putApi } from 'utils/requestUtils';
import { validationSchema } from 'utils/utils';
import { showError, showSuccess } from 'utils/toast-utils';
import Loading from '../../../Loading';
import { getErrorMessage } from '../../../Common/function';
import { INTERCOM_API } from '../../../apiUrl';
import { useStyles } from '../../../styled';
const initValues = {
  name: null,
  server_group: null,
  server_type: null,
  server_url: null,
};
const format_form = [
  {
    name: 'name',
    label: 'Server name',
    placeholder: 'Server name',
    type: 'TextField',
    data: [],
    require: true,
    width: 6,
  },
  {
    name: 'group',
    label: 'Server group',
    placeholder: 'Server group',
    type: 'TextField',
    data: [],
    require: true,
    width: 6,
  },
  {
    name: 'type',
    label: 'Server type',
    placeholder: 'Server type',
    type: 'VAutocomplete',
    data: [
      {
        key: 'intercom_api',
        value: 'intercom_api',
      },
      {
        key: 'intercom_janus',
        value: 'intercom_janus',
      },
      {
        key: 'intercom_sip',
        value: 'intercom_sip',
      },
      {
        key: 'intercom_stun',
        value: 'intercom_stun',
      },
      {
        key: 'intercom_turn',
        value: 'intercom_turn',
      },
    ],
    option: {
      key: 'id',
      value: 'value',
    },
    require: true,
    width: 6,
  },
  {
    name: 'url',
    label: 'Server url',
    placeholder: 'Server url',
    type: 'TextField',
    data: [],
    require: true,
    width: 6,
  },
];
export const Add = ({ onClose, id, setReload, filter }) => {
  const classes = useStyles();

  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState(null);
  
  const fetchDataSource = () => {
    setLoading(true);

    getApi(`${INTERCOM_API.SERVERS}/${id}`)
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
    name: yup.object().nullable().required('Trường này bắt buộc nhập'),
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
    const params = {};
    for(let i=0 ; format_form.length; i++){
      if(values[format_form[i].name]){
        params[item.name] = values[item.name]
      }
    }
    if (id) handleUpdate(params);
    else handleAdd(params);
  };
  const handleAdd = (params) => {
    setLoading(true);
    postApi(INTERCOM_API.SERVERS, params)
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
    putApi(`${INTERCOM_API.SERVERS}/${id}/update`, params)
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

  
  return (
    <div>
      <form className={classes.modal}>
        {loading && <Loading />}

        <Grid container spacing={2}>
          {format_form.map((item) => {
            if (item.type == 'TextField') {
              return (
                <Grid item xs={item.width}>
                  <FormControl error={errors[item.name]} fullWidth>
                    <FormLabel required={item?.require}>{item.label}</FormLabel>
                    <Controller
                      control={control}
                      name={item.name}
                      render={(props) => (
                        <TextField
                          autoComplete="off"
                          inputProps={{ maxLength: 50 }}
                          fullWidth
                          placeholder={item.placeholder}
                          value={props.value}
                          onChange={(e) => {
                            props.onChange(e.target.value);
                          }}
                          variant="outlined"
                          size="small"
                          error={errors[item.name]}
                          helperText={errors[item.name]?.message}
                        />
                      )}
                    />
                  </FormControl>
                </Grid>
              );
            }
            if(item.type == 'VAutocomplete'){
              return (
                <Grid item xs={item.width}>
                  <FormControl error={errors[item.name]} fullWidth>
                    <FormLabel required={item?.require}>{item.label}</FormLabel>
                    <Controller
                      control={control}
                      name={item.name}
                      render={(props) => (
                        <VAutocomplete
                          value={props.value}
                          fullWidth
                          placeholder={item.placeholder}
                          noOptionsText="Không có dữ liệu"
                          getOptionLabel={(option) => option[item.option.value]}
                          firstIndex={1}
                          getOptionSelected={(option, selected) =>
                            option[item.option.key] == selected[item.option.key]
                          }
                          loadData={(page, keyword) => {
                            return {
                              data: item.data,
                              totalCount: item.data.length,
                            };
                          }}
                          onChange={(e, value) => {
                            props.onChange(value);
                          }}
                        />
                      )}
                    />
                    {errors[item.name] && (
                      <FormHelperText style={{ color: '#f44336' }}>
                        {errors[item.name]?.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
              )
            }
          })}
        </Grid>

        <DialogActions style={{ marginTop: 36 }}>
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
    </div>
  );
};

export default Add;
