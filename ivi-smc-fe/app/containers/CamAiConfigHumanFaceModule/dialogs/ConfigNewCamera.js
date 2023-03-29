/* eslint-disable react/prop-types,no-param-reassign,no-unused-expressions,no-dupe-keys */
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import Grid from '@material-ui/core/Grid';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { validationSchema } from 'utils/utils';
import BtnSuccess from 'components/Button/BtnSuccess';
import BtnCancel from 'components/Button/BtnCancel';
// import _ from 'lodash';
import { TextField } from '@material-ui/core';
import { Popup } from 'devextreme-react';
import { useStyles } from '../../CameraAI/Configua/EnginesType/styled';
import CustomSelect from '../components/CustomSelect';
import { getApi } from '../../../utils/requestUtils';
import { CAM_AI_CONFIG_HUMAN_MODULE } from '../../apiUrl';
import { showError } from '../../../utils/toast-utils';

const initValues = {
  camera: null,
  fps: null,
};

const ConfigNewCamera = ({ onClose, submit, data, selectedCams = [] }) => {
  const intl = useIntl();
  const classes = useStyles();
  const [cameras, setCameras] = useState([]);
  const [loadingCameras, setLoadingCameras] = useState(false);

  const schema = validationSchema({
    camera: yup
      .object()
      .shape()
      .nullable()
      .required('Trường này bắt buộc nhập'),
    fps: yup
      .string()
      .trim()
      .nullable()
      .required('Trường này bắt buộc nhập'),
  });

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: initValues,
    resolver: schema,
    mode: 'onChange',
  });

  const onBack = () => {
    onClose && onClose();
  };

  const handleAdd = val => {
    submit(val);
  };

  const handleUpdate = val => {
    val.index = data.index;
    submit(val);
  };

  const onSubmit = val => {
    if (data) {
      handleUpdate(val);
    } else {
      handleAdd(val);
    }
  };

  const fetchLisCamera = async () => {
    setLoadingCameras(true);
    try {
      const res = await getApi(CAM_AI_CONFIG_HUMAN_MODULE.GET_CAMERAS);
      setCameras(res.data);
      setLoadingCameras(false);
    } catch (error) {
      showError(error);
      setLoadingCameras(false);
    }
  };

  useEffect(() => {
    if (data) {
      const { index, fps, ...camera } = data;
      reset({
        camera: {
          ...camera,
          deviceName: camera.camName,
        },
        fps,
      });
    }
  }, [data]);

  useEffect(() => {
    fetchLisCamera();
  }, []);

  return (
    <Popup
      className="popup"
      visible
      title={data ? 'Edit camera' : 'Config new camera'}
      showTitle
      onHidden={() => {
        onBack();
      }}
      dragEnabled
      width="600"
      height="auto"
    >
      <form className={classes.root} onSubmit={handleSubmit(onSubmit)}>
        <Grid container>
          <Grid item xs={12}>
            <p className={classes.label}>
              Camera<span style={{ color: 'red' }}>*</span>
            </p>
            <CustomSelect
              control={control}
              errors={errors}
              name="camera"
              noOptionsText="Không có dữ liệu"
              getOptionLabel={option => option?.deviceName || ''}
              getOptionSelected={(option, selected) =>
                option.id === selected.id
              }
              getOptionDisabled={option => {
                const isDisabled = data?.id
                  ? (selectedCams.filter(d => d.id === option.id).length > 0 || // case update cam
                      option.usedNVR === true) &&
                    option.id !== data?.id
                  : selectedCams.filter(d => d.id === option.id).length > 0 || // case create cam
                    option.usedNVR === true;
                return isDisabled;
              }}
              options={cameras || []}
              showloading={loadingCameras}
              renderOption={option => (
                <React.Fragment>
                  <Grid
                    container
                    direction="row"
                    justify="space-between"
                    alignItems="center"
                  >
                    <Grid item container xs={6}>
                      <Grid item xs={12}>
                        {option?.deviceName || ''}
                      </Grid>
                      <Grid item xs={12}>
                        {option?.ip || ''}
                      </Grid>
                    </Grid>
                    <Grid item xs={6} style={{ textAlign: 'right' }}>
                      {option?.status === 'ACTIVE' ? (
                        <span>ONLINE</span>
                      ) : (
                        <span style={{ color: 'red' }}>OFFLINE</span>
                      )}
                    </Grid>
                  </Grid>
                </React.Fragment>
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <p className={classes.label}>
              FPS<span style={{ color: 'red' }}>*</span>
            </p>
            <Controller
              control={control}
              name="fps"
              defaultValue=""
              render={props => (
                <TextField
                  className={classes.textField}
                  variant="outlined"
                  value={props.value || ''}
                  onChange={e => {
                    const input = e.target.value;
                    if (
                      !input ||
                      (input[input.length - 1].match('[0-9]') &&
                        input[0].match('[1-9]'))
                    ) {
                      props.onChange(input);
                    }
                  }}
                  fullWidth
                  error={!!errors.fps}
                  helperText={!!errors.fps && errors.fps.message}
                />
              )}
            />
          </Grid>
          <Grid
            item
            container
            xs={12}
            justify="flex-end"
            style={{ marginTop: '16px' }}
          >
            <BtnCancel
              id="btnClsoe"
              text="Cancel"
              onClick={() => onBack()}
              style={{ marginRight: '16px', fontWeight: '500' }}
            />
            <BtnSuccess
              type="success"
              id="btnSaveAndContinue"
              text="Save"
              useSubmitBehavior
            />
          </Grid>
        </Grid>
      </form>
    </Popup>
  );
};

export default ConfigNewCamera;
