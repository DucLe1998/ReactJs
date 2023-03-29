import { Button, DialogActions, DialogContent, Grid } from '@material-ui/core';
import TextField from 'components/TextField';
import { useFormik } from 'formik';
import React from 'react';
import * as yup from 'yup';
const initValues = {
  name: '',
  type: '',
  code: '',
};

const AddForm = ({ onSubmit }) => {
  const validationSchema = yup.object().shape({
    type: yup.string().trim().required('Trường này bắt buộc nhập'),
    name: yup.string().trim().required('Trường này bắt buộc nhập'),
    code: yup.string().trim().required('Trường này bắt buộc nhập'),
  });

  const formik = useFormik({
    initialValues: initValues,
    validationSchema,
    onSubmit,
  });

  return (
    <>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              name="name"
              label="Tên EngineType"
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Nhập tên EngineType"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Loại EngineType"
              required
              name="type"
              error={formik.touched.type && Boolean(formik.errors.type)}
              helperText={formik.touched.type && formik.errors.type}
              value={formik.values.type}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Nhập loại EngineType"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Mã code EngineType"
              name="code"
              required
              error={formik.touched.code && Boolean(formik.errors.code)}
              helperText={formik.touched.code && formik.errors.code}
              value={formik.values.code}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Nhập mã code EngineType"
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
          Thêm
        </Button>
      </DialogActions>
    </>
  );
};

export default AddForm;
