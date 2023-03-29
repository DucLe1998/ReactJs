import {
  Button,
  DialogActions,
  DialogContent,
  Grid,
  Select,
  MenuItem,
} from '@material-ui/core';
import TextField from 'components/TextField';
import { useFormik } from 'formik';
import React from 'react';
import * as yup from 'yup';
import TreeSelect from 'components/TreeSelect';
import { SAP_API } from 'containers/apiUrl';
import { getApi } from 'utils/requestUtils';

const AddForm = ({ onSubmit, data }) => {
  const validationSchema = yup.object().shape({
    name: yup.string().trim().required('Trường này bắt buộc nhập'),
    ip: yup.string().trim().required('Trường này bắt buộc nhập'),
    port: yup.string().trim().required('Trường này bắt buộc nhập'),
    area: yup.mixed().required('Trường này bắt buộc nhập'),
    relayId: yup.mixed().required('Trường này bắt buộc nhập'),
  });

  const formik = useFormik({
    initialValues: data,
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
              label="Tên còi"
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Nhập tên còi"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="IP"
              required
              name="ip"
              error={formik.touched.ip && Boolean(formik.errors.ip)}
              helperText={formik.touched.ip && formik.errors.ip}
              value={formik.values.ip}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Nhập IP"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Port"
              name="port"
              required
              error={formik.touched.port && Boolean(formik.errors.port)}
              helperText={formik.touched.port && formik.errors.port}
              value={formik.values.port}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Nhập port"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Khu vực"
              required
              error={Boolean(formik.errors.area)}
              helperText={formik.errors.area}
            >
              <TreeSelect
                value={formik.values.area}
                onValueChanged={(newVal) => {
                  formik.setFieldValue('area', newVal, true);
                }}
                placeholder="Khu vực"
                keyExpr="id"
                displayExpr="areaName"
                searchEnabled
                error={Boolean(formik.errors.area)}
                hasItemsExpr={(node) => !node?.isLeaf}
                loadData={(node) =>
                  new Promise((resolve, reject) => {
                    let url = SAP_API.ROOT_AREA;
                    if (node?.key) {
                      url = SAP_API.CHILD_AREA(node.key);
                    }
                    getApi(url)
                      .then((ret) => {
                        resolve(ret.data);
                      })
                      .catch((err) => reject(err));
                  })
                }
              />
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Rơ le"
              required
              error={formik.touched.relayId && Boolean(formik.errors.relayId)}
              helperText={formik.touched.relayId && formik.errors.relayId}
            >
              <Select
                displayEmpty
                value={formik.values.relayId}
                onChange={(e) =>
                  formik.setFieldValue('relayId', e.target.value)
                }
                variant="outlined"
              >
                <MenuItem value="" disabled>
                  Chọn rơ le
                </MenuItem>
                <MenuItem value={1}>Rơ le 1</MenuItem>
                <MenuItem value={2}>Rơ le 2</MenuItem>
              </Select>
            </TextField>
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
