/* eslint-disable react/prop-types,no-param-reassign,no-unused-expressions,no-dupe-keys */
import React, { useState } from 'react';
import * as yup from 'yup';
import { useFormik } from 'formik';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import { useIntl } from 'react-intl';
import Autocomplete from 'components/MultiAutocomplete';
import {
  Grid,
  Checkbox,
  DialogContent,
  DialogActions,
  FormControlLabel,
  InputAdornment,
  IconButton,
  Button,
} from '@material-ui/core';
import TextField from 'components/TextField';
import { SERVER_TYPE } from './constants';
const AddForm = ({ onSubmit, data }) => {
  const intl = useIntl();
  const [showPassword, setShowPassword] = useState(false);

  const validationSchema = yup.object().shape({
    host: yup
      .string()
      .trim()
      .required(intl.formatMessage({ id: 'app.invalid.required' })),
    port: yup
      .number()
      .integer()
      .required(intl.formatMessage({ id: 'app.invalid.required' })),
    description: yup
      .string()
      .trim()
      .max(
        255,
        intl.formatMessage({ id: 'app.invalid.maxLength' }, { max: 255 }),
      ),
  });
  const formik = useFormik({
    initialValues: data,
    validationSchema,
    onSubmit: (values) => {
      const { serverType, ...other } = values;
      onSubmit({ ...other, serverType: serverType?.id });
    },
  });
  return (
    <>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField label="Loại server">
              <Autocomplete
                disableClearable
                multiple={false}
                value={formik.values.serverType}
                options={SERVER_TYPE}
                onChange={(event, newValue) => {
                  formik.setFieldValue('serverType', newValue);
                }}
                getOptionSelected={(option, value) => option.id == value.id}
              />
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              label="Host"
              name="host"
              placeholder="Host"
              error={formik.touched.host && Boolean(formik.errors.host)}
              helperText={formik.touched.host && formik.errors.host}
              value={formik.values.host}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              label="Post"
              name="port"
              type="number"
              placeholder="Port"
              error={formik.touched.port && Boolean(formik.errors.port)}
              helperText={formik.touched.port && formik.errors.port}
              value={formik.values.port}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField>
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={(e) =>
                      formik.setFieldValue('useSSL', e.target.checked)
                    }
                    checked={formik.values.useSSl}
                    color="primary"
                  />
                }
                label="Sử dụng SSL"
              />
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Tên truy cập"
              name="username"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              autoComplete="new-password"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Mật khẩu"
              name="password"
              autoComplete="new-password"
              type={showPassword ? 'text' : 'password'}
              value={formik.values.password}
              onChange={formik.handleChange}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Mô tả"
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.description && Boolean(formik.errors.description)
              }
              helperText={
                formik.touched.description && formik.errors.description
              }
              multiline
              rows={4}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={() => onSubmit(0)}>
          Hủy
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={formik.handleSubmit}
        >
          Lưu
        </Button>
      </DialogActions>
    </>
  );
};

export default AddForm;
