/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types,no-param-reassign,no-unused-expressions,no-dupe-keys */
import React, { useState, useEffect } from 'react';
import {
  Grid,
  Button,
  DialogContent,
  DialogActions,
  LinearProgress,
} from '@material-ui/core';
import * as yup from 'yup';
import { useFormik } from 'formik';
import TextField from 'components/TextField';
import { useDropzone } from 'react-dropzone';
import { useIntl } from 'react-intl';
import { showError } from 'utils/toast-utils';
import useAxios from 'axios-hooks';
import { API_CAMERA_AI } from 'containers/apiUrl';
const PopupFormFullFile = ({ data, onSubmit }) => {
  const intl = useIntl();
  const [uploading, setUploading] = useState(0);
  const { acceptedFiles, fileRejections, getRootProps, getInputProps } =
    useDropzone({
      accept:
        'zip,application/octet-stream,application/zip,application/x-zip,application/x-zip-compressed',
      maxSize: 1024 ** 3, // 1Gb
    });
  const validationSchema = yup.object().shape({
    name: yup
      .string()
      .trim()
      .required(intl.formatMessage({ id: 'app.invalid.required' }))
      .max(100, '100 ký tự'),
    setupFileName: yup
      .string()
      .trim()
      .required(intl.formatMessage({ id: 'app.invalid.required' }))
      .max(100, '100 ký tự'),
    version: yup
      .string()
      .trim()
      .required(intl.formatMessage({ id: 'app.invalid.required' }))
      .max(100, '100 ký tự'),
    runFileName: yup
      .string()
      .trim()
      .required(intl.formatMessage({ id: 'app.invalid.required' }))
      .max(100, '100 ký tự'),
    library: yup
      .mixed()
      .required(intl.formatMessage({ id: 'app.invalid.required' })),
    description: yup
      .string()
      .trim()
      .max(
        255,
        intl.formatMessage({ id: 'app.invalid.maxLength' }, { max: 255 }),
      ),
    defaultConfig: yup
      .string()
      .trim()
      .required(intl.formatMessage({ id: 'app.invalid.required' }))
      .test('json', 'Invalid JSON format', (value) => {
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
      }),
  });
  // upload
  const [
    { data: postData, loading: postLoading, error: postError },
    executePost,
    cancelUpload,
  ] = useAxios(
    {
      url: API_CAMERA_AI.ENGINE_TYPE_UPLOAD_VERSION,
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progress) => {
        const percent = Math.round((progress.loaded / progress.total) * 100);
        setUploading(percent);
      },
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
  const formik = useFormik({
    initialValues: data,
    validationSchema,
    onSubmit: (values) => {
      const { library, ...other } = values;
      if (library.libraryId) {
        onSubmit({ ...other, libraryId: library.libraryId });
      } else {
        const formData = new FormData();
        formData.append('versionFile', library.file);
        executePost({
          data: formData,
        });
      }
    },
  });
  useEffect(() => {
    if (acceptedFiles && acceptedFiles.length) {
      formik.setFieldValue('library', { file: acceptedFiles[0] });
    }
  }, [acceptedFiles]);
  useEffect(() => {
    if (fileRejections && fileRejections.length) {
      const { errors } = fileRejections[0];
      showError('Tệp không hợp lệ', {
        html: errors.map((err) => `<p>${err.message}</p>`),
      });
    }
  }, [fileRejections]);
  useEffect(() => {
    if (postData) {
      const { library } = formik.values;
      formik.setFieldValue('library', {
        file: library.file,
        libraryId: postData.id,
      });
      formik.handleSubmit();
    }
  }, [postData]);
  return (
    <>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Name"
              required
              disabled={postLoading}
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Name of File Setup"
              required
              disabled={postLoading}
              name="setupFileName"
              value={formik.values.setupFileName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.setupFileName &&
                Boolean(formik.errors.setupFileName)
              }
              helperText={
                formik.touched.setupFileName && formik.errors.setupFileName
              }
            />
          </Grid>
          <Grid item sm={6}>
            <TextField
              label="Version"
              required
              disabled={postLoading}
              name="version"
              value={formik.values.version}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.version && Boolean(formik.errors.version)}
              helperText={formik.touched.version && formik.errors.version}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              label="Name of File Run"
              disabled={postLoading}
              name="runFileName"
              value={formik.values.runFileName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.runFileName && Boolean(formik.errors.runFileName)
              }
              helperText={
                formik.touched.runFileName && formik.errors.runFileName
              }
            />
          </Grid>
          <Grid item sm={12}>
            <TextField
              label="Upload File"
              required
              error={formik.touched.library && Boolean(formik.errors.library)}
              helperText={formik.touched.library && formik.errors.library}
              disabled={postLoading}
              value={formik.values.library?.file?.path || ''}
            >
              {!postLoading && (
                <div
                  {...getRootProps()}
                  style={{
                    border: '3px dashed',
                    borderColor:
                      formik.touched.library && formik.errors.library
                        ? '#f44336'
                        : 'steelblue',
                    minHeight: '80px',
                    justifyContent: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'column',
                    padding: '8px',
                  }}
                >
                  <input {...getInputProps()} />
                  <p>Drag 'n' drop some files here, or click to select files</p>
                  <em>(Only *.zip file will be accepted)</em>
                </div>
              )}
            </TextField>
            {!postLoading && formik.values.library?.file && (
              <div>{formik.values.library?.file.path}</div>
            )}
            {postLoading && (
              <div>
                Uploading...{uploading}%
                <LinearProgress variant="determinate" value={uploading} />
              </div>
            )}
          </Grid>
          <Grid item sm={12}>
            <TextField
              label="Mô tả"
              // required
              disabled={postLoading}
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
          <Grid item sm={12}>
            <TextField
              label="Cấu hình mặc định"
              required
              disabled={postLoading}
              name="defaultConfig"
              value={formik.values.defaultConfig}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.defaultConfig &&
                Boolean(formik.errors.defaultConfig)
              }
              helperText={
                formik.touched.defaultConfig && formik.errors.defaultConfig
              }
              multiline
              rows={8}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          onClick={() => {
            if (postLoading) cancelUpload();
            onSubmit(0);
          }}
        >
          Hủy
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={formik.handleSubmit}
          disabled={postLoading}
        >
          Lưu
        </Button>
      </DialogActions>
    </>
  );
};

export default PopupFormFullFile;
