import {
  Button,
  DialogActions,
  Grid,
  MenuItem,
  Select,
  DialogContent,
} from '@material-ui/core';
import useAxios from 'axios-hooks';
import TextField from 'components/TextField';
import { GUEST_API } from 'containers/apiUrl';
import Loading from 'containers/Loading/Loadable';
import { useFormik } from 'formik';
import React, { useEffect } from 'react';
import { useIntl } from 'react-intl';
import { showError } from 'utils/toast-utils';
import * as yup from 'yup';
import { pick } from 'lodash';
const GENDER_MAP = [
  {
    key: 'MALE',
    value: 'Nam',
  },
  {
    key: 'FEMALE',
    value: 'Nữ',
  },
  {
    key: 'OTHER',
    value: 'Khác',
  },
];
export default function EditGuest({ data, onSubmit }) {
  const intl = useIntl();
  const validationSchema = yup.object().shape({
    identityNumber: yup.string(),
    fullName: yup
      .string()
      .trim()
      .required(intl.formatMessage({ id: 'app.invalid.required' })),
    phoneNumber: yup
      .string()
      .trim()
      .required(intl.formatMessage({ id: 'app.invalid.required' })),
    email: yup.string().email(intl.formatMessage({ id: 'app.invalid.email' })),
  });
  // get
  const [{ data: getData, error: getError, loading: getLoading }] = useAxios(
    {
      url: GUEST_API.READ(data.id),
      method: 'GET',
    },
    { useCache: false },
  );
  useEffect(() => {
    if (getError) {
      showError(getError);
    }
  }, [getError]);
  useEffect(() => {
    if (getData) {
      const values = pick(getData, [
        'address',
        'email',
        'fullName',
        'gender',
        'identityNumber',
        'phoneNumber',
      ]);
      formik.resetForm({ values });
    }
  }, [getData]);
  // put
  const [{ data: postData, error: postError, loading }, executePost] = useAxios(
    {
      url: GUEST_API.UPDATE(data.id),
      method: 'PUT',
    },
    {
      manual: true,
    },
  );
  useEffect(() => {
    if (postError) {
      showError(postError);
    }
  }, [postError]);
  useEffect(() => {
    if (postData) {
      onSubmit({ ...data, ...postData });
    }
  }, [postData]);
  const onAdd = (values) => {
    executePost({ data: { ...values, isUpdateIdentity: false } });
  };

  const formik = useFormik({
    initialValues: data,
    validationSchema,
    onSubmit: onAdd,
  });
  return (
    <>
      {(getLoading || loading) && <Loading />}
      <DialogContent>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <TextField
              label="Số giấy tờ"
              value={formik.values.identityNumber}
              disabled
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              required
              name="fullName"
              label="Tên khách"
              value={formik.values.fullName}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              error={formik.touched.fullName && Boolean(formik.errors.fullName)}
              helperText={formik.touched.fullName && formik.errors.fullName}
              autoFocus
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              required
              name="phoneNumber"
              label="Số điện thoại"
              value={formik.values.phoneNumber}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              error={
                formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)
              }
              helperText={
                formik.touched.phoneNumber && formik.errors.phoneNumber
              }
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              name="address"
              label="Địa chỉ/Công ty"
              value={formik.values.address}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              name="email"
              label="Email"
              value={formik.values.email}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField label="Giới tính">
              <Select
                value={formik.values.gender}
                onChange={(e) => formik.setFieldValue('gender', e.target.value)}
                variant="outlined"
              >
                {GENDER_MAP.map((d) => (
                  <MenuItem value={d.key} key={d.key}>
                    {d.value}
                  </MenuItem>
                ))}
              </Select>
            </TextField>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          onClick={() => {
            onSubmit(0);
          }}
        >
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
