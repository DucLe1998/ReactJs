/* eslint-disable react/prop-types,no-param-reassign,no-unused-expressions,no-dupe-keys */
import React, { Fragment, useState, useEffect, useCallback } from 'react';
// import { useIntl } from 'react-intl';
import Grid from '@material-ui/core/Grid';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { validationSchema } from 'utils/utils';
import PageHeader from 'components/PageHeader';
import BtnSuccess from 'components/Button/BtnSuccess';
import BtnCancel from 'components/Button/BtnCancel';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import _ from 'lodash';
import {
  FormHelperText,
  Paper,
  TextareaAutosize,
  TextField,
} from '@material-ui/core';
import Loading from 'containers/Loading/Loadable';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useStyles } from '../../styled';
import { getApi, postApi } from '../../../../../../utils/requestUtils';
import { CAMERA_AI_API_SRC } from '../../../../../apiUrl';
import { showError, showSuccess } from '../../../../../../utils/toast-utils';

const initValues = {
  name: null,
  engineType: null,
  version: null,
  // registry: null,
  repository: null,
  tag: null,
  digest: null,
  defaultParam: null,
  defaultConfig: null,
  changeLog: null,
};

const FormEngineImage = () => {
  //   const intl = useIntl();
  const classes = useStyles();
  const { id, name, engineImageId } = useParams();
  const history = useHistory();
  // const location = useLocation();
  // const { beforeUrl } = location.state;
  const [loading, setLoading] = useState(false);
  const [loadingRepository, setLoadingRepository] = useState(false);
  const [loadingTag, setLoadingTag] = useState(false);

  const [repositories, setRepositories] = useState([]);
  const [tags, setTags] = useState([]);

  const schema = validationSchema({
    name: yup
      .string()
      .trim()
      .nullable()
      .required('Trường này bắt buộc nhập'),
    engineType: yup
      .object()
      .shape()
      .nullable()
      .required('Trường này bắt buộc nhập'),
    version: yup
      .string()
      .trim()
      .nullable()
      .required('Trường này bắt buộc nhập'),
    // registry: yup
    //   .string()
    //   .trim()
    //   .nullable()
    //   .required('Trường này bắt buộc nhập'),
    repository: yup
      .string()
      .trim()
      .nullable()
      .required('Trường này bắt buộc nhập'),
    tag: yup
      .string()
      .trim()
      .nullable()
      .required('Trường này bắt buộc nhập'),
    digest: yup
      .string()
      .trim()
      .nullable()
      .required('Trường này bắt buộc nhập'),
    defaultConfig: yup
      .string()
      .trim()
      .nullable()
      .test('json', 'Invalid JSON format', value => {
        let item = typeof value !== 'string' ? JSON.stringify(value) : value;
        try {
          item = JSON.parse(item);
        } catch (e) {
          return false;
        }
        if (typeof item === 'object' && item !== null) {
          return true;
        }
        return false;
      })
      .required('Trường này bắt buộc nhập'),
  });

  const {
    handleSubmit,
    control,
    getValues,
    watch,
    // setError,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: initValues,
    resolver: schema,
    mode: 'onChange',
  });

  const watchFields = watch(['repository', 'tag']);

  const onBack = () => {
    const currentPath = window.location.pathname;
    const beforeUrl = `${currentPath.slice(
      0,
      currentPath.indexOf('engine-image'),
    )}engine-image`;
    history.push(beforeUrl);
  };

  const handleCreate = payload => {
    setLoading(true);
    postApi(`${CAMERA_AI_API_SRC}/engine-type`, _.pickBy(payload))
      .then(() => {
        showSuccess('Tạo mới thành công');
        onBack();
      })
      .catch(err => {
        showError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleUpdate = payload => {
    setLoading(true);
    postApi(
      `${CAMERA_AI_API_SRC}/engine-type/${engineImageId}`,
      _.pickBy(payload),
    )
      .then(() => {
        showSuccess('Cập nhật thành công');
        onBack();
      })
      .catch(err => {
        showError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onSubmit = values => {
    const payload = {
      ...values,
      engineType: values.engineType.id,
      defaultConfig: JSON.parse(values.defaultConfig),
    };
    if (engineImageId) {
      handleUpdate(payload);
    } else {
      handleCreate(payload);
    }
  };

  const fetchDetail = () => {
    if (engineImageId) {
      setLoading(true);
      getApi(`${CAMERA_AI_API_SRC}/engine-type/${engineImageId}`)
        .then(res => {
          // set lai form data
          reset({
            name: res.data.name,
            engineType: res.data.engineType,
            version: res.data.version,
            // registry: null,
            repository: res.data.registry,
            tag: res.data.tag,
            digest: res.data.digest,
            defaultParam: res.data.defaultParam,
            defaultConfig: JSON.stringify(res.data.defaultConfig),
            changeLog: res.data.changelog,
          });
        })
        .catch(err => {
          showError(err);
          // onBack(); // co loi xay ra khi call API lay detail thi cho ve man trc luon
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      reset({
        ...getValues(),
        engineType: {
          id,
          name,
        },
      });
    }
  };

  const fetchRepository = useCallback(() => {
    setLoadingRepository(true);
    getApi(`${CAMERA_AI_API_SRC}/engine-images/repositories`)
      .then(res => {
        setRepositories(res.data);
      })
      .catch(err => {
        showError(err);
      })
      .finally(() => {
        setLoadingRepository(false);
      });
  }, []);

  const fetchTag = useCallback(() => {
    setLoadingTag(true);
    getApi(`${CAMERA_AI_API_SRC}/engine-images/tags`, {
      repository: watchFields.repository,
    })
      .then(res => {
        setTags(res.data);
      })
      .catch(err => {
        showError(err);
      })
      .finally(() => {
        setLoadingTag(false);
      });
  }, [watchFields.repository]);

  const fetchDegist = useCallback(() => {
    getApi(`${CAMERA_AI_API_SRC}/engine-images/info-of-tag`, {
      repository: watchFields.repository,
      tag: watchFields.tag,
    })
      .then(res => {
        setValue('degist', res.data);
      })
      .catch(err => {
        showError(err);
      });
  }, [watchFields.tag]);

  useEffect(() => {
    fetchDetail();
    fetchRepository();
  }, []);

  // useEffect(() => {
  //   setRepositories([]);
  //   setValue('repository', null);
  //   if (watchFields.registry) {
  //     fetchRepository();
  //   }
  // }, [watchFields.registry]);

  useEffect(() => {
    setTags([]);
    setValue('tag', null);
    if (watchFields.repository) {
      fetchTag();
    }
  }, [watchFields.repository]);

  useEffect(() => {
    setValue('degist', null);
    if (watchFields.tag) {
      fetchDegist();
    }
  }, [watchFields.tag]);

  return (
    <Fragment>
      {loading && <Loading />}
      <PageHeader
        showBackButton
        title={engineImageId ? 'Edit engine image' : 'Create new engine image'}
        onBack={() => onBack()}
      >
        <Grid container spacing={2} justify="flex-end">
          <Grid item>
            <BtnCancel onClick={() => onBack()}>Hủy</BtnCancel>
          </Grid>
          <Grid item>
            <BtnSuccess onClick={handleSubmit(onSubmit)}>
              {engineImageId ? 'Cập nhật' : 'Thêm mới'}
            </BtnSuccess>
          </Grid>
        </Grid>
      </PageHeader>
      <form className={classes.root}>
        <Paper>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <p className={classes.label}>
                Name<span style={{ color: 'red' }}>*</span>
              </p>
              <Controller
                control={control}
                name="name"
                defaultValue=""
                render={props => (
                  <TextField
                    className={classes.textField}
                    error={!!errors.name}
                    helperText={errors.name && errors.name.message}
                    variant="outlined"
                    value={props.value || ''}
                    onChange={e => {
                      props.onChange(e.target.value);
                    }}
                    placeholder="Nhập tên"
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <p className={classes.label}>
                Engine Type<span style={{ color: 'red' }}>*</span>
              </p>
              <Controller
                control={control}
                name="engineType"
                defaultValue=""
                render={props => (
                  <Autocomplete
                    value={props.value}
                    className={classes.autocomplete}
                    options={[]}
                    fullWidth
                    getOptionLabel={option => option?.name || ''}
                    getOptionSelected={(option, selected) =>
                      option.id === selected.id
                    }
                    onChange={(e, value) => {
                      props.onChange(value);
                    }}
                    disabled
                    renderInput={params => (
                      <TextField {...params} variant="outlined" />
                    )}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <p className={classes.label}>
                Version<span style={{ color: 'red' }}>*</span>
              </p>
              <Controller
                control={control}
                name="version"
                defaultValue=""
                render={props => (
                  <TextField
                    className={classes.textField}
                    error={!!errors.version}
                    helperText={errors.version && errors.version.message}
                    variant="outlined"
                    value={props.value || ''}
                    onChange={e => {
                      props.onChange(e.target.value);
                    }}
                    placeholder="Version"
                    fullWidth
                  />
                )}
              />
            </Grid>
            {/* <Grid item xs={12} sm={6}>
              <p className={classes.label}>
                Registry<span style={{ color: 'red' }}>*</span>
              </p>
              <Controller
                control={control}
                name="registry"
                defaultValue=""
                render={props => (
                  <TextField
                    className={classes.textField}
                    error={!!errors.registry}
                    helperText={errors.registry && errors.registry.message}
                    variant="outlined"
                    value={props.value || ''}
                    onChange={e => {
                      props.onChange(e.target.value);
                    }}
                    placeholder="Registry"
                    fullWidth
                  />
                )}
              />
            </Grid> */}
            <Grid item xs={12} sm={6} md={4}>
              <p className={classes.label}>
                Repository<span style={{ color: 'red' }}>*</span>
              </p>
              <Controller
                control={control}
                name="repository"
                defaultValue=""
                render={props => (
                  <Autocomplete
                    value={props.value}
                    className={classes.autocomplete}
                    options={repositories}
                    fullWidth
                    noOptionsText="Không có dữ liệu"
                    onChange={(e, value) => {
                      props.onChange(value);
                    }}
                    loading={loadingRepository}
                    renderInput={params => (
                      <TextField
                        {...params}
                        variant="outlined"
                        placeholder="Repository"
                        error={!!errors.repository}
                        helperText={
                          errors.repository && errors.repository.message
                        }
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <React.Fragment>
                              {loadingRepository ? (
                                <CircularProgress color="inherit" size={20} />
                              ) : null}
                              {params.InputProps.endAdornment}
                            </React.Fragment>
                          ),
                        }}
                      />
                    )}
                  />
                )}
                VAutocomple
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <p className={classes.label}>
                Tag<span style={{ color: 'red' }}>*</span>
              </p>
              <Controller
                control={control}
                name="tag"
                defaultValue=""
                render={props => (
                  <Autocomplete
                    value={props.value}
                    className={classes.autocomplete}
                    options={tags}
                    fullWidth
                    noOptionsText="Không có dữ liệu"
                    onChange={(e, value) => {
                      props.onChange(value);
                    }}
                    loading={loadingTag}
                    renderInput={params => (
                      <TextField
                        {...params}
                        variant="outlined"
                        placeholder="Tag"
                        error={!!errors.tag}
                        helperText={errors.tag && errors.tag.message}
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <React.Fragment>
                              {loadingTag ? (
                                <CircularProgress color="inherit" size={20} />
                              ) : null}
                              {params.InputProps.endAdornment}
                            </React.Fragment>
                          ),
                        }}
                      />
                    )}
                  />
                )}
                VAutocomple
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <p className={classes.label}>
                Digest<span style={{ color: 'red' }}>*</span>
              </p>
              <Controller
                control={control}
                name="digest"
                defaultValue=""
                render={props => (
                  <TextField
                    className={classes.textField}
                    error={!!errors.digest}
                    helperText={errors.digest && errors.digest.message}
                    variant="outlined"
                    value={props.value || ''}
                    placeholder="Digest"
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <p className={classes.label}>Default param</p>
              <Controller
                control={control}
                name="defaultParam"
                render={props => (
                  <div className={classes.textAreaContainer}>
                    <TextareaAutosize
                      style={{ width: '100%' }}
                      rowsMin={3}
                      value={props.value || ''}
                      onChange={e => {
                        props.onChange(e.target.value);
                      }}
                    />
                  </div>
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <p className={classes.label}>
                Default config
                <span style={{ color: 'red' }}>*</span>
              </p>
              <Controller
                control={control}
                name="defaultConfig"
                render={props => (
                  <div className={classes.textAreaContainer}>
                    <TextareaAutosize
                      style={{
                        width: '100%',
                        borderColor: `${errors.defaultConfig ? '#f44336' : ''}`,
                      }}
                      rowsMin={15}
                      value={props.value || ''}
                      onChange={e => {
                        props.onChange(e.target.value);
                      }}
                    />
                  </div>
                )}
              />
              {errors.defaultConfig && (
                <FormHelperText style={{ color: '#f44336' }}>
                  {errors.defaultConfig.message}
                </FormHelperText>
              )}
            </Grid>
            <Grid item xs={12}>
              <p className={classes.label}>Change log</p>
              <Controller
                control={control}
                name="changeLog"
                render={props => (
                  <div className={classes.textAreaContainer}>
                    <TextareaAutosize
                      style={{ width: '100%' }}
                      rowsMin={10}
                      value={props.value || ''}
                      onChange={e => {
                        props.onChange(e.target.value);
                      }}
                    />
                  </div>
                )}
              />
            </Grid>
          </Grid>
        </Paper>
      </form>
    </Fragment>
  );
};

export default FormEngineImage;
