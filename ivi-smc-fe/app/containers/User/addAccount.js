import React from 'react';
import {
  DialogActions,
  DialogContent,
  Button,
  FormControlLabel,
  Switch,
} from '@material-ui/core';
import TextField from 'components/TextField';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useIntl } from 'react-intl';
export default function AddAccount({ onSubmit }) {
  const intl = useIntl();
  const validationSchema = yup.object().shape({
    username: yup
      .string()
      .trim()
      .required(intl.formatMessage({ id: 'app.invalid.required' })),
    password: yup
      .string()
      .required(intl.formatMessage({ id: 'app.invalid.required' })),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password'), null], 'Mật khẩu không khớp')
      .required(intl.formatMessage({ id: 'app.invalid.required' })),
  });
  const formik = useFormik({
    initialValues: {
      accStatus: 'ACTIVE',
      identityProviderType: 'LOCAL',
      password: '',
      confirmPassword: '',
      username: '',
    },
    validationSchema,
    onSubmit,
  });
  return (
    <>
      <DialogContent>
        <TextField
          required
          label="Tài khoản"
          error={formik.touched.username && Boolean(formik.errors.username)}
          helperText={formik.touched.username && formik.errors.username}
          name="username"
          autoComplete="new-password"
          value={formik.values.username}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
        />
        <TextField
          required
          label="Mật khẩu"
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
          autoComplete="new-password"
          name="password"
          value={formik.values.password}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          type="password"
        />
        <TextField
          required
          label="Xác nhận mật khẩu"
          error={
            formik.touched.confirmPassword &&
            Boolean(formik.errors.confirmPassword)
          }
          helperText={
            formik.touched.confirmPassword && formik.errors.confirmPassword
          }
          name="confirmPassword"
          value={formik.values.confirmPassword}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          type="password"
        />
        <TextField label="Trạng thái">
          <FormControlLabel
            control={
              <Switch
                checked={formik.values.accStatus == 'ACTIVE'}
                color="primary"
                onChange={(e) =>
                  formik.setFieldValue(
                    'accStatus',
                    e.target.checked ? 'ACTIVE' : 'INACTIVE',
                  )
                }
              />
            }
            label=""
          />
        </TextField>
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
}
