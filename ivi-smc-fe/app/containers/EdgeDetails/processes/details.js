import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Grid,
  IconButton,
  Button,
  Paper,
  Tooltip,
  Typography,
  FormHelperText,
} from '@material-ui/core';
import TextField from 'components/TextField';
import TableCustom from 'components/TableCustom';
import PageHeader from 'components/PageHeader';
import { useFormik } from 'formik';
import * as yup from 'yup';
import VAutocomplete from 'components/VAutocomplete';
import { CAM_AI_EDGE, CAM_AI_SERVER, API_CAMERA_AI } from 'containers/apiUrl';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl';
import useAxios from 'axios-hooks';
import { showError, showSuccess } from 'utils/toast-utils';
import Loading from 'containers/Loading/Loadable';
import { getApi } from 'utils/requestUtils';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/AddOutlined';
import Dialog from 'components/Dialog';
import AddCamera from './camera';
export default function Details({ history }) {
  const { id, pId } = useParams();
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const intl = useIntl();
  const goBack = () => {
    history.push(`/camera-ai/configs/edge/${id}/processes`);
  };
  const defaultNew = {
    name: '',
    engineType: null,
    versionFile: null,
    minio: null,
    minioBucket: null,
    kafka: null,
    kafkaTopic: '',
    camera: [],
    devConfig: '{}',
    fpgaManagerId: id,
  };
  const validationSchema = yup.object().shape({
    name: yup
      .string()
      .trim()
      .required(intl.formatMessage({ id: 'app.invalid.required' }))
      .max(
        100,
        intl.formatMessage({ id: 'app.invalid.maxLength' }, { max: 100 }),
      ),
    engineType: yup
      .mixed()
      .required(intl.formatMessage({ id: 'app.invalid.required' })),
    versionFile: yup
      .mixed()
      .required(intl.formatMessage({ id: 'app.invalid.required' })),
    minio: yup
      .mixed()
      .required(intl.formatMessage({ id: 'app.invalid.required' })),
    minioBucket: yup
      .mixed()
      .required(intl.formatMessage({ id: 'app.invalid.required' })),
    kafka: yup
      .mixed()
      .required(intl.formatMessage({ id: 'app.invalid.required' })),
    kafkaTopic: yup
      .string()
      .trim()
      .required(intl.formatMessage({ id: 'app.invalid.required' })),
    camera: yup
      .array()
      .min(1, intl.formatMessage({ id: 'app.invalid.required' })),
    devConfig: yup
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

  //  data
  const [{ data: getData, loading, error }, executeGet] = useAxios(
    CAM_AI_EDGE.DETAILS_PROCESS(pId),
    {
      useCache: false,
      manual: true,
    },
  );
  useEffect(() => {
    if (pId) {
      executeGet();
    }
  }, [pId]);
  useEffect(() => {
    if (error) {
      showError(error);
    }
  }, [error]);
  useEffect(() => {
    if (getData) {
      const { minio, kafka, cameraInfos } = getData;
      const newState = {
        id: getData.id,
        name: getData.name,
        versionFile: getData?.versionFile || null,
        engineType: getData?.engineType || null,
        fpgaManagerId: getData.fpgaManager?.id,
        minio: minio
          ? {
              id: minio.id,
              host: minio.name,
            }
          : null,
        minioBucket: minio?.bucket
          ? {
              name: minio?.bucket,
            }
          : null,
        kafka: kafka
          ? {
              id: kafka.id,
              host: kafka.name,
            }
          : null,
        kafkaTopic: kafka?.topic || '',
        devConfig: getData?.devConfig || '{}',
        camera: cameraInfos.map((item) => {
          const { fps, rois, ...camera } = item;
          return {
            fps,
            camera: {
              id: camera.id,
              deviceName: camera.name,
            },
            rois,
          };
        }),
      };
      formik.resetForm({
        values: newState,
      });
    }
  }, [getData]);
  // submit
  const [
    { data: postData, loading: postLoading, error: postError },
    executePost,
  ] = useAxios(
    { method: 'POST' },
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
      showSuccess('Thành công');
      goBack();
    }
  }, [postData]);
  const onSubmit = (values) => {
    const data = {
      camera: values.camera.map((item) => ({
        fps: item.fps,
        id: item.camera?.id,
        rois: item.rois,
      })),
      devConfig: values.devConfig,
      fpgaManagerId: values.fpgaManagerId,
      kafkaId: values.kafka?.id,
      kafkaTopic: values.kafkaTopic,
      minioBucket: values.minioBucket?.name,
      minioId: values.minio?.id,
      name: values.name,
      typeProcess: values.engineType?.code,
      versionFileId: values.versionFile?.id,
    };
    const isEdit = Boolean(values?.id);
    executePost({
      url: isEdit
        ? CAM_AI_EDGE.DETAILS_PROCESS(values.id)
        : CAM_AI_EDGE.ADD_PROCESS,
      method: isEdit ? 'PUT' : 'POST',
      data,
    });
  };

  const formik = useFormik({
    initialValues: defaultNew,
    validationSchema,
    onSubmit,
  });
  const headerCellRender = () => (
    <Tooltip title={intl.formatMessage({ id: 'app.tooltip.add' })}>
      <IconButton
        size="small"
        onClick={() => {
          setOpenAddDialog(true);
        }}
        color="primary"
      >
        <AddIcon fontSize="inherit" />
      </IconButton>
    </Tooltip>
  );
  const actionRender = ({ rowIndex, component }) => (
    <>
      <Tooltip title="Chỉnh sửa">
        <IconButton
          size="small"
          color="primary"
          // disabled={!scopes?.update}
          onClick={() => {
            setOpenAddDialog(true);
            setSelectedCamera(rowIndex);
          }}
        >
          <EditIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Xóa">
        <IconButton
          size="small"
          color="secondary"
          // disabled={!scopes?.delete}
          onClick={() => {
            component.deleteRow(rowIndex);
          }}
        >
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </>
  );
  const columns = [
    {
      caption: 'Camera name',
      dataField: 'camera.deviceName',
    },
    {
      caption: 'FPS',
      dataField: 'fps',
    },
    {
      // caption: intl.formatMessage({ id: 'app.column.action' }),
      headerCellRender,
      cellRender: actionRender,
      alignment: 'center',
      minWidth: 100,
      width: 'auto',
    },
  ];
  const handleCloseAddDialog = (ret) => {
    if (ret) {
      if (selectedCamera == null) {
        // add
        const newState = [...formik.values.camera, ret];
        formik.setFieldValue('camera', newState);
      } else {
        // update
        const data = [...formik.values.camera];
        data[selectedCamera] = ret;
        formik.setFieldValue('camera', data);
      }
    }
    setOpenAddDialog(false);
    setSelectedCamera(null);
  };
  const addDialog = openAddDialog && (
    <Dialog
      title={selectedCamera == null ? 'Thêm mới camera' : 'Chỉnh sửa camera'}
      open={openAddDialog}
      onClose={() => handleCloseAddDialog(0)}
      fullWidth
      maxWidth="md"
    >
      <AddCamera
        data={formik.values.camera[selectedCamera]}
        list={formik.values.camera}
        onSubmit={handleCloseAddDialog}
      />
    </Dialog>
  );
  return (
    <>
      <Helmet>
        <title>{pId ? 'Chi tiết process' : 'Thêm mới process'}</title>
        <meta name="description" content="Description of edge process" />
      </Helmet>
      <PageHeader
        title={pId ? 'Chi tiết process' : 'Thêm mới process'}
        showBackButton
        onBack={goBack}
      >
        <Button variant="contained" onClick={goBack}>
          Hủy
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={formik.handleSubmit}
        >
          Lưu
        </Button>
      </PageHeader>
      {(loading || postLoading) && <Loading />}
      {addDialog}
      <Paper style={{ padding: 16 }}>
        <Grid container spacing={2}>
          <Grid item sm={12} md={6} lg={4}>
            <TextField
              label="Instance name"
              placeholder="Instance name"
              required
              name="name"
              value={formik.values.name}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </Grid>
          <Grid item sm={12} md={6} lg={4}>
            <TextField
              label="Engine Type"
              required
              name="engineType"
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
                  formik.setFieldValue('versionFile', null);
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
          <Grid item sm={12} md={6} lg={4}>
            <TextField
              label="Version File"
              required
              error={
                formik.touched.versionFile && Boolean(formik.errors.versionFile)
              }
              helperText={
                formik.touched.versionFile && formik.errors.versionFile
              }
            >
              <VAutocomplete
                placeholder="Select File"
                value={formik.values.versionFile}
                onChange={(e, newVal) => {
                  formik.setFieldValue('versionFile', newVal);
                }}
                disabled={!formik.values?.engineType}
                virtual={false}
                getOptionSelected={(option, value) => option.id == value.id}
                loadData={() =>
                  new Promise((resolve, reject) => {
                    getApi(CAM_AI_EDGE.LIST_FILE_BY_ENGINE_CODE(id), {
                      engineCode: formik.values.engineType?.code,
                    })
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
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item sm={12} md={6} lg={4}>
            <TextField
              label="Minio server"
              required
              name="minio"
              error={formik.touched.minio && Boolean(formik.errors.minio)}
              helperText={formik.touched.minio && formik.errors.minio}
            >
              <VAutocomplete
                placeholder="Select minio"
                value={formik.values.minio}
                onChange={(e, newVal) => {
                  formik.setFieldValue('minio', newVal);
                  formik.setFieldValue('minioBucket', null);
                }}
                getOptionLabel={(option) => option?.host || ''}
                getOptionSelected={(option, value) => option.id == value.id}
                virtual={false}
                loadData={() =>
                  new Promise((resolve, reject) => {
                    getApi(CAM_AI_SERVER.LIST_SERVER, {
                      type: 'MINIO',
                    })
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
          </Grid>
          <Grid item sm={12} md={6} lg={4}>
            <TextField
              label="Minio bucket"
              required
              name="minioBucket"
              error={
                formik.touched.minioBucket && Boolean(formik.errors.minioBucket)
              }
              helperText={
                formik.touched.minioBucket && formik.errors.minioBucket
              }
            >
              <VAutocomplete
                placeholder="Select minioBucket"
                value={formik.values.minioBucket}
                onChange={(e, newVal) => {
                  formik.setFieldValue('minioBucket', newVal);
                }}
                getOptionSelected={(option, value) => option.name == value.name}
                virtual={false}
                disabled={!formik.values.minio?.id}
                loadData={() =>
                  new Promise((resolve, reject) => {
                    getApi(CAM_AI_SERVER.LIST_BUCKET(formik.values.minio?.id))
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
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item sm={12} md={6} lg={4}>
            <TextField
              label="Kafka server"
              required
              name="kafka"
              error={formik.touched.kafka && Boolean(formik.errors.kafka)}
              helperText={formik.touched.kafka && formik.errors.kafka}
            >
              <VAutocomplete
                placeholder="Select kafka"
                value={formik.values.kafka}
                onChange={(e, newVal) => {
                  formik.setFieldValue('kafka', newVal);
                }}
                getOptionLabel={(option) => option?.host || ''}
                getOptionSelected={(option, value) => option.id == value.id}
                virtual={false}
                loadData={() =>
                  new Promise((resolve, reject) => {
                    getApi(CAM_AI_SERVER.LIST_SERVER, {
                      type: 'KAFKA',
                    })
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
          </Grid>
          <Grid item sm={12} md={6} lg={4}>
            <TextField
              label="Kafka topic"
              required
              name="kafkaTopic"
              value={formik.values.kafkaTopic}
              error={
                formik.touched.kafkaTopic && Boolean(formik.errors.kafkaTopic)
              }
              helperText={formik.touched.kafkaTopic && formik.errors.kafkaTopic}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </Grid>
        </Grid>
        <div style={{ margin: '16px 0' }}>
          <Typography>Cameras</Typography>
          <FormHelperText error={Boolean(formik.errors.camera)}>
            {formik.errors.camera}
          </FormHelperText>
          {useMemo(
            () => (
              <TableCustom
                data={formik.values.camera}
                columns={columns}
                hideTable={false}
              />
            ),
            [formik.values.camera],
          )}
        </div>
        <TextField
          label="Dev config"
          required
          name="devConfig"
          value={formik.values.devConfig}
          error={formik.touched.devConfig && Boolean(formik.errors.devConfig)}
          helperText={formik.touched.devConfig && formik.errors.devConfig}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          multiline
          rows={15}
        />
      </Paper>
    </>
  );
}
