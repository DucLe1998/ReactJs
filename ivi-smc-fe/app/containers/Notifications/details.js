import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  InputAdornment,
  OutlinedInput,
  Paper,
  Switch,
} from '@material-ui/core';
import { DateTimePicker } from '@material-ui/pickers';
import useAxios from 'axios-hooks';
import TinyEditor from 'components/CustomTextEditor';
import Autocomplete from 'components/MultiAutocomplete';
import PageHeader from 'components/PageHeader';
import VAutocomplete from 'components/VAutocomplete';
import { IAM_API_SRC, NOTIFICATION_EVENT_API } from 'containers/apiUrl';
import Loading from 'containers/Loading/Loadable';
import { add, format, set } from 'date-fns';
import { useFormik } from 'formik';
import React, { Fragment, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import ReactHtmlParser from 'react-html-parser';
import { useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { getApi } from 'utils/requestUtils';
import { showError, showSuccess } from 'utils/toast-utils';
import { showAlertConfirm } from 'utils/utils';
import * as yup from 'yup';
import { LIST_EVENT_TYPE, STATUS_MAP, TYPE_LIST_MAP } from './constants';
const ContentContainer = styled.div`
   {
    margin-top: 25px;
  }
  img {
    max-width: 100%;
    height: auto;
  }
`;
export default function Details({ history, location }) {
  const intl = useIntl();
  const { id } = useParams();
  const [edit, setEdit] = useState(false);
  const [info, setInfo] = useState(null);
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const defaultNew = {
    title: '',
    content: '',
    body: '',
    bodyLength: 0,
    eventType: LIST_EVENT_TYPE[0],
    effectType: 'SOUND',
    notificationAt: add(new Date(), { minutes: 15 }),
    targetType: 'COMPANY',
    targets: [],
    data: '{}',
    sentAll: false,
    eventSource: 'USER',
  };
  const goBack = () => {
    history.push({
      pathname: '/notification',
      state: location.state,
    });
  };
  const validationSchema = yup.object().shape({
    title: yup
      .string()
      .trim()
      .required(intl.formatMessage({ id: 'app.invalid.required' }))
      .max(
        100,
        intl.formatMessage({ id: 'app.invalid.maxLength' }, { max: 100 }),
      )
      .matches(
        /^[\p{L}'\-.\s0-9()]+([\p{L}'\-.0-9()]+)*$/gu,
        "Tiêu đề chỉ chứa chữ cái, chữ số và các ký tự đặc biệt sau . - ' ( )",
      ),
    content: yup
      .string()
      .trim()
      .required(intl.formatMessage({ id: 'app.invalid.required' }))
      .max(
        100,
        intl.formatMessage({ id: 'app.invalid.maxLength' }, { max: 100 }),
      ),
    notificationAt: yup
      .date()
      // .required(intl.formatMessage({ id: 'app.invalid.required' }))
      .nullable()
      .min(
        add(set(new Date(), { seconds: 0 }), { minutes: 5 }),
        'Thời gian gửi sau hiện tại tối thiểu 5 phút',
      ),
    bodyLength: yup
      .number()
      .min(1, intl.formatMessage({ id: 'app.invalid.required' }))
      .max(
        1000,
        intl.formatMessage({ id: 'app.invalid.maxLength' }, { max: 1000 }),
      ),
    targets: yup.array().when('sentAll', {
      is: (val) => !val,
      then: yup.array().min(1, 'Cần chọn tối thiếu 1 công ty'),
    }),
    eventType: yup
      .mixed()
      .required(intl.formatMessage({ id: 'app.invalid.required' })),
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
      eventType: values.eventType?.id,
      notificationAt: values.notificationAt
        ? values.notificationAt.getTime()
        : null,
      targets: values.sentAll ? [] : values.targets.map((i) => i.orgUnitId),
    };
    executePut({
      data: payload,
      url: id ? NOTIFICATION_EVENT_API.DETAIL(id) : NOTIFICATION_EVENT_API.LIST,
      method: id ? 'PUT' : 'POST',
    });
  };
  const [{ data: getData, loading: getLoading, error: getError }, executeGet] =
    useAxios(NOTIFICATION_EVENT_API.DETAIL(id), {
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
      const {
        targets = [],
        orgUnits = [],
        createdAt,
        notificationAt,
        eventType = 'ACTION',
        status = 'WAITING',
        ...data
      } = getData;
      const state = {
        ...data,
        createdAt: new Date(createdAt),
        notificationAt: new Date(notificationAt),
        eventType: TYPE_LIST_MAP[eventType],
        status: STATUS_MAP[status],
        targets: (targets || []).length ? orgUnits : [],
        sentAll: (targets || []).length <= 0,
      };
      setInfo(state);
    }
  }, [getData]);
  const [{ data: putData, loading: putLoading, error: putError }, executePut] =
    useAxios(
      { url: NOTIFICATION_EVENT_API.DETAIL(id), method: 'PUT' },
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
  // delete
  const [
    { response: deleteData, loading: deleteLoading, error: deleteError },
    executeDelete,
  ] = useAxios(
    {
      method: 'PATCH',
    },
    {
      manual: true,
    },
  );
  useEffect(() => {
    if (deleteError) {
      showError(deleteError);
    }
  }, [deleteError]);

  useEffect(() => {
    if (deleteData) {
      showSuccess('Hủy thành công');
      goBack();
    }
  }, [deleteData]);
  const onCancelBtnClick = () => {
    showAlertConfirm(
      {
        text: 'Bạn có chắc chắn muốn hủy thông báo này?',
        title: 'Hủy thông báo',
      },
      intl,
    ).then((result) => {
      if (result.value) {
        executeDelete({
          url: NOTIFICATION_EVENT_API.CANCEL(id),
        });
      }
    });
  };
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
    if (getData?.status == 'WAITING') {
      return (
        <>
          <Button
            variant="contained"
            color="default"
            onClick={onCancelBtnClick}
          >
            Hủy thông báo
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              const { status, ...formData } = info;
              setEdit(true);
              formik.resetForm({ values: formData });
            }}
          >
            Cập nhật
          </Button>
        </>
      );
    }
    return null;
  }
  const renderDetails = info && !edit && (
    <>
      <Grid container spacing={2}>
        <Grid item sm={12} md={6} lg={4} xl={3}>
          <FormControl fullWidth margin="dense" size="small">
            <FormLabel>Thời gian tạo</FormLabel>
            <OutlinedInput
              readOnly
              value={format(info.createdAt, 'HH:mm dd/MM/yyyy')}
            />
          </FormControl>
        </Grid>
        <Grid item sm={12} md={6} lg={4} xl={3}>
          <FormControl fullWidth margin="dense" size="small">
            <FormLabel>Thời gian gửi</FormLabel>
            <OutlinedInput
              readOnly
              value={format(info.notificationAt, 'HH:mm dd/MM/yyyy')}
            />
          </FormControl>
        </Grid>
        <Grid item sm={12} md={6} lg={4} xl={3}>
          <FormControl fullWidth margin="dense" size="small">
            <FormLabel>Trạng thái</FormLabel>
            <OutlinedInput readOnly value={info.status.text} />
          </FormControl>
        </Grid>
        <Grid item sm={12} md={6} lg={4} xl={3}>
          <FormControl fullWidth margin="dense" size="small">
            <FormLabel>Nhóm thông báo</FormLabel>
            <OutlinedInput readOnly value={info.eventType.name} />
          </FormControl>
        </Grid>
        {info.targets.length > 0 ? (
          <Grid item sm={12} md={6} lg={8} xl={6}>
            <FormControl fullWidth margin="dense" size="small">
              <FormLabel>Công ty</FormLabel>
              <OutlinedInput
                readOnly
                value={info.targets.map((t) => t.orgUnitName).join(', ')}
              />
            </FormControl>
          </Grid>
        ) : (
          <Grid item sm={12} md={6} lg={4} xl={3}>
            <FormControl fullWidth margin="dense" size="small">
              <FormLabel>&nbsp;</FormLabel>
              <FormControlLabel
                control={<Checkbox checked={info.sentAll} color="primary" />}
                label="Gửi tất cả công ty"
              />
            </FormControl>
          </Grid>
        )}
        <Grid item sm={12}>
          <FormControl fullWidth margin="dense" size="small">
            <FormLabel>Tiêu đề</FormLabel>
            <OutlinedInput readOnly value={info.title} />
          </FormControl>
        </Grid>
        <Grid item sm={12}>
          <FormControl fullWidth margin="dense" size="small">
            <FormLabel>Nội dung tóm tắt</FormLabel>
            <OutlinedInput
              readOnly
              value={info.content}
              multiline
              maxRows={4}
            />
          </FormControl>
        </Grid>
      </Grid>
      <ContentContainer>{ReactHtmlParser(info?.body || '')}</ContentContainer>
    </>
  );
  const editRender = (!id || edit) && (
    <Grid container spacing={2}>
      <Grid item sm={12} md={6} lg={4} xl={3}>
        <FormControl
          fullWidth
          margin="dense"
          size="small"
          error={
            formik.touched.notificationAt &&
            Boolean(formik.errors.notificationAt)
          }
        >
          <FormLabel required>Thời gian gửi</FormLabel>
          <DateTimePicker
            value={formik.values.notificationAt}
            format="HH:mm dd/MM/yyyy"
            variant="inline"
            placeholder="HH:mm dd/MM/yyyy"
            inputVariant="outlined"
            size="small"
            disablePast
            open={openDatePicker}
            onOpen={() => {
              if (formik.values.notificationAt != null) setOpenDatePicker(true);
            }}
            onClose={() => setOpenDatePicker(false)}
            emptyLabel="Gửi ngay"
            onChange={(newVal) => {
              formik.setFieldValue('notificationAt', newVal);
            }}
            error={
              formik.touched.notificationAt &&
              Boolean(formik.errors.notificationAt)
            }
            helperText={
              formik.touched.notificationAt && formik.errors.notificationAt
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Switch
                    checked={formik.values.notificationAt == null}
                    color="primary"
                    onChange={(event) => {
                      if (event.target.checked) setOpenDatePicker(false);
                      formik.setFieldValue(
                        'notificationAt',
                        event.target.checked
                          ? null
                          : add(new Date(), { minutes: 15 }),
                      );
                    }}
                  />
                </InputAdornment>
              ),
            }}
          />
        </FormControl>
      </Grid>
      <Grid item sm={12} md={6} lg={4} xl={3}>
        <FormControl
          fullWidth
          margin="dense"
          size="small"
          error={formik.touched.eventType && Boolean(formik.errors.eventType)}
        >
          <FormLabel required>Nhóm thông báo</FormLabel>
          <Autocomplete
            value={formik.values.eventType}
            multiple={false}
            options={LIST_EVENT_TYPE}
            getOptionLabel={(option) => option.name || ''}
            getOptionSelected={(option, value) => option.id == value.id}
            onChange={(e, newVal) => formik.setFieldValue('eventType', newVal)}
            placeholder="Nhóm thông báo"
            disableClearable
            error={formik.touched.eventType && Boolean(formik.errors.eventType)}
          />
          <FormHelperText>
            {formik.touched.eventType && formik.errors.eventType}
          </FormHelperText>
        </FormControl>
      </Grid>
      <Grid item sm={12} md={6} lg={4} xl={3}>
        <FormControl fullWidth margin="dense" size="small">
          <FormLabel>&nbsp;</FormLabel>
          <FormControlLabel
            control={
              <Checkbox
                checked={formik.values.sentAll}
                color="primary"
                onChange={(e) =>
                  formik.setFieldValue('sentAll', e.target.checked)
                }
              />
            }
            label="Gửi tất cả công ty"
          />
        </FormControl>
      </Grid>
      {!formik.values.sentAll && (
        <Grid item sm={12} md={6} lg={8} xl={3}>
          <FormControl
            fullWidth
            margin="dense"
            error={formik.touched.targets && Boolean(formik.errors.targets)}
          >
            <FormLabel required>Công ty</FormLabel>
            <VAutocomplete
              id="combo-box-targets"
              name="targets"
              value={formik.values.targets}
              multiple
              // limitTags={1}
              loadData={(page, keyword) =>
                new Promise((resolve, reject) => {
                  getApi(`${IAM_API_SRC}/org-units`, {
                    keyword,
                    limit: 50,
                    page,
                    status: 'ACTIVE',
                  })
                    .then((result) => {
                      resolve({
                        data: result.data.rows,
                        totalCount: result.data.count,
                      });
                    })
                    .catch((err) => reject(err));
                })
              }
              getOptionLabel={(option) => option.orgUnitName || ''}
              getOptionSelected={(option, selected) =>
                option.orgUnitId == selected.orgUnitId
              }
              onChange={(e, newVal) => formik.setFieldValue('targets', newVal)}
            />
            <FormHelperText>
              {formik.touched.targets && formik.errors.targets}
            </FormHelperText>
          </FormControl>
        </Grid>
      )}
      <Grid item sm={12}>
        <FormControl
          fullWidth
          margin="dense"
          size="small"
          error={formik.touched.title && Boolean(formik.errors.title)}
        >
          <FormLabel required>
            Tiêu đề ({formik.values.title.length}/100)
          </FormLabel>
          <OutlinedInput
            name="title"
            value={formik.values.title}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            inputProps={{ maxLength: 100 }}
          />
          <FormHelperText>
            {formik.touched.title && formik.errors.title}
          </FormHelperText>
        </FormControl>
      </Grid>
      <Grid item sm={12}>
        <FormControl
          fullWidth
          margin="dense"
          size="small"
          error={formik.touched.content && Boolean(formik.errors.content)}
        >
          <FormLabel required>
            Nội dung tóm tắt ({formik.values.content.length}/100)
          </FormLabel>
          <OutlinedInput
            name="content"
            value={formik.values.content}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            multiline
            maxRows={4}
            inputProps={{ maxLength: 100 }}
          />
          <FormHelperText>
            {formik.touched.content && formik.errors.content}
          </FormHelperText>
        </FormControl>
      </Grid>
      <Grid item sm={12}>
        <FormControl
          fullWidth
          margin="dense"
          // size="small"
          error={formik.touched.bodyLength && Boolean(formik.errors.bodyLength)}
        >
          <FormLabel required>
            Nội dung thông báo ({formik.values.bodyLength}/1000)
          </FormLabel>
          <TinyEditor
            error={
              formik.touched.bodyLength && Boolean(formik.errors.bodyLength)
            }
            value={formik.values.body}
            onChangeValue={({ value, length }) => {
              formik.setFieldValue('body', value);
              formik.setFieldValue('bodyLength', length);
            }}
          />
          <FormHelperText>
            {formik.touched.bodyLength && formik.errors.bodyLength}
          </FormHelperText>
        </FormControl>
      </Grid>
    </Grid>
  );
  return (
    <>
      <Helmet>
        <title>{id ? 'Chi tiết' : 'Thêm mới'} thông báo</title>
        <meta name="description" content="Chi tiết thông báo" />
      </Helmet>
      {(getLoading || putLoading || deleteLoading) && <Loading />}
      <form onSubmit={formik.handleSubmit}>
        <Paper style={{ padding: '0 16px 16px 16px', marginTop: '25px' }}>
          <PageHeader
            title={id ? 'Chi tiết thông báo' : 'Thêm mới thông báo'}
            showBackButton
            onBack={goBack}
          >
            {id ? (
              detailBtnRender()
            ) : (
              <Button variant="contained" color="primary" type="submit">
                Thêm mới
              </Button>
            )}
          </PageHeader>
          {renderDetails}
          {editRender}
        </Paper>
      </form>
    </>
  );
}
