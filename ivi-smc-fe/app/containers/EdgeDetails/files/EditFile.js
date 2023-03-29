/* eslint-disable react-hooks/rules-of-hooks */
import {
  Grid,
  makeStyles,
  TextField,
  Paper,
  FormHelperText,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import Loading from 'containers/Loading';
import { Controller, useForm } from 'react-hook-form';
import { CAMERA_AI_API_SRC } from 'containers/apiUrl';

import PageHeader from 'components/PageHeader';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import { useHistory, useParams } from 'react-router-dom';
import axios from 'axios';
import { showSuccess, showError } from 'utils/toast-utils';

const useStyles = makeStyles({
  root: {
    width: '100%',
    '& .MuiInputBase-root': {
      height: '40px',
    },
    '& .MuiInputBase-input': {
      boxSizing: 'border-box',
      height: '100%',
    },
  },
  label: {
    height: '17px',
    lineHeight: '16px',
    fontSize: '14px',
    color: '#999999',
    margin: '5px 0',
  },
  disabledInput: {
    backgroundColor: '#f4f4f4',
    outline: 'none',
  },
  button: {
    margin: 'auto',
    borderRadius: '8px',
    boxSizing: 'border-box',
    cursor: 'pointer',
    border: 'none',
    outline: 'none',
    padding: '12px 16px',
    lineHeight: '16px',
    fontWeight: 500,
    minWidth: '104px',
    whiteSpace: 'nowrap',
  },
  textAreaContainer: {
    '& textarea': {
      borderRadius: '6px !important',
      borderColor: '#c4c4c4',
      '&:hover': {
        borderColor: '#40A574',
      },
      '&:focus-visible': {
        outline: 'none',
        border: '2px solid #40A574',
      },
    },
  },
  h3: {
    margin: '0',
    fontSize: '20px',
    fontWeight: 500,
    fontStyle: 'normal',
    marginBottom: '24px',
    lineHeight: '23px',
    letterSpacing: '0.38px',
  },
});

const DetailsItem = props => {
  const { label, value } = props;
  const classes = useStyles();
  return (
    <Grid container direction="column">
      <p className={classes.label}>
        {label}
        <span style={{ color: 'red' }}>*</span>
      </p>
      <TextField
        className={classes.disabledInput}
        value={value}
        variant="outlined"
        fullWidth
        InputProps={{
          readOnly: true,
        }}
      />
    </Grid>
  );
};

const CustomTextArea = ({ control, errors, name, rules, ...otherParams }) => {
  const classes = useStyles();
  return (
    <React.Fragment>
      <Controller
        control={control}
        name={name}
        rules={rules}
        defaultValue=""
        render={props => (
          <div className={classes.textAreaContainer}>
            <TextareaAutosize
              {...otherParams}
              style={{
                padding: '8px',
                width: '100%',
                borderColor: `${errors[name] ? '#f44336' : ''}`,
              }}
              value={props.value || ''}
              onChange={e => props.onChange(e.target.value)}
            />
          </div>
        )}
      />
      {errors[name] && (
        <FormHelperText style={{ color: '#f44336' }}>
          {errors[name].message}
        </FormHelperText>
      )}
    </React.Fragment>
  );
};

export default function details() {
  const history = useHistory();
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState();
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const classes = useStyles();
  const { id } = useParams();

  useEffect(() => {
    getData(true);
  }, []);

  const getData = withLoading => {
    // eslint-disable-next-line no-unused-expressions
    withLoading && setLoading(true);
    axios
      .get(`${CAMERA_AI_API_SRC}/fpga-version-file/detail/${id}`)
      .then(res => {
        setData(res.data);
        reset({
          description: res.data.description,
          defaultConfig: res.data.defaultConfig,
        });
      })
      .catch(err => showError(err))
      .finally(() => withLoading && setLoading(false));
  };

  const validateConfig = text => {
    try {
      JSON.parse(text);
    } catch (e) {
      return false;
    }
    return true;
  };

  const onSubmit = values => {
    const formData = new FormData();
    formData.append('defaultConfig', values.defaultConfig);
    formData.append('description', values.description);
    formData.append('fpgaVerFileId', id);

    setLoading(true);
    axios
      .put(`${CAMERA_AI_API_SRC}/fpga-version-file/update`, formData)
      .then(() => showSuccess('Lưu thành công'))
      .catch(err => showError(err))
      .finally(() => setLoading(false));
  };

  return (
    <div className={classes.root}>
      <PageHeader
        showBackButton
        title="Edit EDGE version file"
        onBack={() => history.goBack()}
      >
        <div style={{ display: 'flex' }}>
          <button
            type="button"
            className={classes.button}
            onClick={() => history.goback()}
            style={{
              border: '1px solid #dddddd',
              color: 'rgba(0, 0, 0, 0.8)',
            }}
          >
            Cancel
          </button>
          <button
            form="edit-version-file-form"
            className={classes.button}
            type="submit"
            style={{
              background: '#00554A',
              boxShadow: '0px 4px 10px rgba(16, 156, 241, 0.24)',
              color: '#ffffff',
              marginRight: '30px',
              marginLeft: '24px',
            }}
          >
            Save
          </button>
        </div>
      </PageHeader>
      {isLoading ? <Loading /> : null}
      <form id="edit-version-file-form" onSubmit={handleSubmit(onSubmit)}>
        <Paper style={{ padding: '32px' }}>
          <h3 className={classes.h3}>{data?.engineType.name} Module</h3>
          <Grid container spacing={3}>
            <Grid item xs={4}>
              <DetailsItem label="Name" value={data?.name || ''} />
            </Grid>
            <Grid item xs={4}>
              <DetailsItem label="Version" value={data?.version || ''} />
            </Grid>
            <Grid item xs={4} />
            <Grid item xs={4}>
              <DetailsItem
                label="Name of file setup"
                value={data?.nameFileSetup || ''}
              />
            </Grid>
            <Grid item xs={4}>
              <DetailsItem
                label="Name of File Run"
                value={data?.nameFileRun || ''}
              />
            </Grid>
            <Grid item xs={8}>
              <Grid container direction="column">
                <p className={classes.label}>
                  Upload File{<span style={{ color: 'red' }}>*</span>}
                </p>
                <div
                  style={{
                    height: '50px',
                    borderRight: '8px',
                    borderRadius: '6px',
                    border: '1px dashed rgba(0, 0, 0, 0.24)',
                    display: 'grid',
                    placeItems: 'center',
                  }}
                >
                  {data?.url || ''}
                </div>
              </Grid>
            </Grid>
            <Grid item xs={8}>
              <Grid container direction="column">
                <p className={classes.label}>Description</p>
                <CustomTextArea
                  name="description"
                  control={control}
                  errors={errors}
                  rowsMin={2}
                />
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Grid container direction="column">
                <p className={classes.label}>Default config</p>
                <CustomTextArea
                  name="defaultConfig"
                  control={control}
                  errors={errors}
                  rules={{
                    required: 'Required',
                    validate: text =>
                      validateConfig(text) || 'Invalid JSON format',
                  }}
                  rowsMin={4}
                />
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </form>
    </div>
  );
}
