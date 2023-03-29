import React from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import VAutocomplete from 'components/VAutocomplete';
import { CAM_AI_DEVICE } from 'containers/apiUrl';
import TextField from 'components/TextField';
import { DialogContent, DialogActions, Button } from '@material-ui/core';
import { useIntl } from 'react-intl';
import { getApi } from 'utils/requestUtils';
import CamDraw from 'components/CamDraw';
const defaultNew = {
  camera: null,
  fps: 30,
  rois: [],
};
export default function Camera({ data, onSubmit, list }) {
  const intl = useIntl();
  const validationSchema = yup.object().shape({
    camera: yup.mixed().required(
      intl.formatMessage({
        id: 'app.invalid.required',
      }),
    ),
    fps: yup.number().required(
      intl.formatMessage({
        id: 'app.invalid.required',
      }),
    ),
    // rois: yup.array().min(
    //   1,
    //   intl.formatMessage({
    //     id: 'app.invalid.required',
    //   }),
    // ),
  });
  const formik = useFormik({
    initialValues: data || defaultNew,
    validationSchema,
    onSubmit,
  });
  return (
    <>
      <DialogContent>
        <TextField
          label="Camera"
          required
          name="camera"
          error={formik.touched.camera && Boolean(formik.errors.camera)}
          helperText={formik.touched.camera && formik.errors.camera}
        >
          <VAutocomplete
            placeholder="Select camera"
            value={formik.values.camera}
            disableClearable
            onChange={(e, newVal) => {
              formik.setFieldValue('camera', newVal);
              formik.setFieldValue('rois', []);
            }}
            getOptionLabel={(option) => option?.deviceName || ''}
            getOptionSelected={(option, value) => option.id == value.id}
            getOptionDisabled={(option) => {
              if (list.length <= 0) return false;
              const found = list.find((item) => item.camera.id == option.id);
              return found && data?.camera?.id != option.id;
            }}
            virtual={false}
            loadData={() =>
              new Promise((resolve, reject) => {
                getApi(CAM_AI_DEVICE.LIST)
                  .then((res) => {
                    resolve({
                      data: res.data,
                      totalCount: res.data.length,
                    });
                  })
                  .catch((err) => reject(err));
              })
            }
          />
        </TextField>
        <TextField
          label="FPS"
          required
          name="fps"
          type="number"
          value={formik.values.fps}
          error={formik.touched.fps && Boolean(formik.errors.fps)}
          helperText={formik.touched.fps && formik.errors.fps}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.values.camera?.id && (
          <CamDraw
            camId={formik.values.camera?.id}
            area={formik.values.rois}
            setArea={(newVal) => formik.setFieldValue('rois', newVal)}
          />
        )}
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
