import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  OutlinedInput,
  Paper,
} from '@material-ui/core';
import useAxios from 'axios-hooks';
import PageHeader from 'components/PageHeader';
// import TreeSelect from 'components/TreeSelect';
import Loading from 'containers/Loading/Loadable';
import { format } from 'date-fns';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';
// import { getApi } from 'utils/requestUtils';
import { showError, showSuccess } from 'utils/toast-utils';
import * as yup from 'yup';
import { API_IAM } from '../apiUrl';
import { defaultNew, STATUS_MAP } from './contants';

export default function Details({ history, location }) {
  const intl = useIntl();
  const { id } = useParams();
  const [edit, setEdit] = useState(false);
  const [info, setInfo] = useState(null);
  const goBack = () => {
    history.push({
      pathname: '/department',
      state: location.state,
    });
  };
  const validationSchema = yup.object().shape({
    groupName: yup
      .string()
      .trim()
      .required(intl.formatMessage({ id: 'app.invalid.required' }))
      .max(
        255,
        intl.formatMessage({ id: 'app.invalid.maxLength' }, { max: 255 }),
      ),
    groupCode: yup
      .string()
      .trim()
      .required(intl.formatMessage({ id: 'app.invalid.required' }))
      .max(
        255,
        intl.formatMessage({ id: 'app.invalid.maxLength' }, { max: 255 }),
      ),
    description: yup
      .string()
      .trim()
      .max(
        255,
        intl.formatMessage({ id: 'app.invalid.maxLength' }, { max: 255 }),
      ),
  });
  const formik = useFormik({
    initialValues: defaultNew,
    validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });
  const onSubmit = (values) => {
    const payload = {
      ...values,
      parentId: values.parent?.groupId,
    };
    executePut({
      data: payload,
      url: API_IAM.UPDATE_DEPARTMENT(id),
      method: 'PUT',
    });
  };
  const [{ data: getData, loading: getLoading, error: getError }, executeGet] =
    useAxios(API_IAM.DETAIL_DEPARTMENT(id), {
      manual: true,
    });
  useEffect(() => {
    if (id) executeGet();
  }, [id]);
  useEffect(() => {
    if (getError) showError(getError);
  }, [getError]);
  useEffect(() => {
    if (getData) {
      const { parentId, parentName, ...data } = getData;
      const state = {
        ...data,
        statusName: STATUS_MAP[getData.status].label,
        parent: parentId ? { groupId: parentId, groupName: parentName } : null,
      };
      setInfo(state);
    }
  }, [getData]);
  const [{ data: putData, loading: putLoading, error: putError }, executePut] =
    useAxios(
      { url: API_IAM.UPDATE_DEPARTMENT(id), method: 'PUT' },
      {
        manual: true,
      },
    );
  useEffect(() => {
    if (putError) {
      showError(putError);
    }
  }, [putError]);
  useEffect(() => {
    if (putData) {
      showSuccess('Thành công');
      goBack();
    }
  }, [putData]);
  function detailBtnRender() {
    if (edit) {
      return (
        <>
          <Button
            variant="contained"
            color="default"
            onClick={() => setEdit(false)}
          >
            Hủy cập nhật
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={formik.handleSubmit}
          >
            Lưu
          </Button>
        </>
      );
    }
    return (
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          const { createdAt, updatedAt, ...formData } = info;
          setEdit(true);
          formik.resetForm({ values: formData });
        }}
        disabled={!info}
      >
        Cập nhật
      </Button>
    );
  }

  return (
    <>
      <Helmet>
        <title>Chi tiết đơn vị</title>
        <meta name="description" content="Chi tiết đơn vị" />
      </Helmet>
      {(getLoading || putLoading) && <Loading />}
      <form onSubmit={formik.handleSubmit}>
        <Paper style={{ padding: '0 16px 16px 16px', marginTop: '25px' }}>
          <PageHeader title="Chi tiết đơn vị" showBackButton onBack={goBack}>
            {detailBtnRender()}
          </PageHeader>
          {info && (
            <Grid container spacing={2}>
              <Grid item sm={12} md={6} lg={4} xl={3}>
                <FormControl
                  size="small"
                  margin="dense"
                  fullWidth
                  error={
                    edit &&
                    formik.touched.groupName &&
                    Boolean(formik.errors.groupName)
                  }
                >
                  <FormLabel required>Tên đơn vị</FormLabel>
                  {edit ? (
                    <OutlinedInput
                      value={formik.values.groupName}
                      margin="dense"
                      name="groupName"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  ) : (
                    <OutlinedInput disabled value={info.groupName} />
                  )}
                  <FormHelperText>
                    {edit &&
                      formik.touched.groupName &&
                      formik.errors.groupName}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item sm={12} md={6} lg={4} xl={3}>
                <FormControl fullWidth margin="dense" size="small">
                  <FormLabel>Thời gian tạo</FormLabel>
                  <OutlinedInput
                    disabled
                    value={format(info.createdAt, 'HH:mm dd/MM/yyyy')}
                  />
                </FormControl>
              </Grid>
              <Grid item sm={12} md={6} lg={4} xl={3}>
                <FormControl fullWidth margin="dense" size="small">
                  <FormLabel>Thời gian cập nhật</FormLabel>
                  <OutlinedInput
                    disabled
                    value={format(info.updatedAt, 'HH:mm dd/MM/yyyy')}
                  />
                </FormControl>
              </Grid>
              <Grid item sm={12} md={6} lg={4} xl={3}>
                <FormControl
                  size="small"
                  margin="dense"
                  fullWidth
                  error={
                    edit &&
                    formik.touched.groupCode &&
                    Boolean(formik.errors.groupCode)
                  }
                >
                  <FormLabel required>Mã đơn vị</FormLabel>
                  {edit ? (
                    <OutlinedInput
                      value={formik.values.groupCode}
                      margin="dense"
                      name="groupCode"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  ) : (
                    <OutlinedInput disabled value={info.groupCode} />
                  )}
                  <FormHelperText>
                    {edit &&
                      formik.touched.groupCode &&
                      formik.errors.groupCode}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item sm={12} md={6} lg={4} xl={3}>
                <FormControl size="small" margin="dense" fullWidth>
                  <FormLabel>
                    {intl.formatMessage({ id: 'app.column.status' })}
                  </FormLabel>
                  <OutlinedInput disabled value={info.statusName} />
                </FormControl>
              </Grid>
              <Grid item sm={12} md={6} lg={4} xl={3}>
                <FormControl fullWidth margin="dense" size="small">
                  <FormLabel>Thuộc đơn vị</FormLabel>
                  <OutlinedInput disabled value={info.parent?.groupName} />
                </FormControl>
              </Grid>
              <Grid item sm={12} md={6} lg={4} xl={3}>
                <FormControl fullWidth margin="dense" size="small">
                  <FormLabel>&nbsp;</FormLabel>
                  {edit ? (
                    <FormControlLabel
                      label="Là đơn vị thuộc "
                      control={
                        <Checkbox
                          color="primary"
                          checked={formik.values.isPnLVGR}
                          onChange={(e) =>
                            formik.setFieldValue('isPnLVGR', e.target.checked)
                          }
                        />
                      }
                    />
                  ) : (
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={info.isPnLVGR}
                          color="primary"
                          disabled
                        />
                      }
                      label="Là đơn vị thuộc "
                    />
                  )}
                </FormControl>
              </Grid>
            </Grid>
          )}
        </Paper>
      </form>
    </>
  );
}
