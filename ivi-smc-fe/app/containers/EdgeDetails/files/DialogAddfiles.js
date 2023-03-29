import React from 'react';
import { DialogActions, Button, DialogContent, Grid } from '@material-ui/core';
import VAutocomplete from 'components/VAutocomplete';
import TextField from 'components/TextField';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useIntl } from 'react-intl';
import { getApi } from 'utils/requestUtils';
import { API_CAMERA_AI } from 'containers/apiUrl';
const defaultNew = {
  engineType: null,
  versionFiles: [],
};
export default function DialogAddfiles({ onSubmit }) {
  const intl = useIntl();
  const validationSchema = yup.object().shape({
    engineType: yup
      .mixed()
      .required(intl.formatMessage({ id: 'app.invalid.required' })),
    versionFiles: yup
      .array()
      .min(1, intl.formatMessage({ id: 'app.invalid.required' })),
  });
  const formik = useFormik({
    initialValues: defaultNew,
    validationSchema,
    onSubmit,
  });
  return (
    <>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item sm={12} md={6}>
            <TextField
              label="EngineType"
              required
              error={
                formik.touched.engineType && Boolean(formik.errors.engineType)
              }
              helperText={formik.touched.engineType && formik.errors.engineType}
            >
              <VAutocomplete
                placeholder="Select engineType"
                value={formik.values.engineType}
                onChange={(e, newVal) => {
                  formik.setFieldValue('engineType', newVal);
                  formik.setFieldValue('versionFiles', []);
                }}
                getOptionSelected={(option, value) => option.id == value.id}
                getOptionDisabled={(option) =>
                  option.countFPGAVersionFiles <= 0
                }
                loadData={(page) =>
                  new Promise((resolve, reject) => {
                    getApi(API_CAMERA_AI.ENGINE_TYPE, {
                      page,
                    })
                      .then((res) => {
                        resolve({
                          data: res.data.rows,
                          totalCount: res.data.count,
                        });
                      })
                      .catch((err) => reject(err));
                  })
                }
              />
            </TextField>
          </Grid>
          <Grid item sm={12} md={6}>
            <TextField
              label="File"
              required
              error={
                formik.touched.versionFiles &&
                Boolean(formik.errors.versionFiles)
              }
              helperText={
                formik.touched.versionFiles && formik.errors.versionFiles
              }
            >
              <VAutocomplete
                multiple
                placeholder="Select File"
                value={formik.values.versionFiles}
                onChange={(e, newVal) => {
                  formik.setFieldValue('versionFiles', newVal);
                }}
                disabled={!formik.values?.engineType}
                virtual={false}
                getOptionSelected={(option, value) => option.id == value.id}
                loadData={() =>
                  new Promise((resolve, reject) => {
                    getApi(
                      API_CAMERA_AI.ENGINE_TYPE_DETAILS(
                        formik.values.engineType?.id,
                      ),
                    )
                      .then((res) => {
                        resolve({
                          data: res.data.versionFiles,
                          totalCount: res.data.versionFiles.length,
                        });
                      })
                      .catch((err) => reject(err));
                  })
                }
              />
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
          Thêm mới
        </Button>
      </DialogActions>
    </>
  );
}
