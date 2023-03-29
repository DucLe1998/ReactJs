import {
  Box,
  Button,
  FormLabel,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Tooltip,
  Typography,
} from '@material-ui/core';
import * as colors from '@material-ui/core/colors';
import AddIcon from '@material-ui/icons/Add';
import BuildIcon from '@material-ui/icons/Build';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import NewReleasesIcon from '@material-ui/icons/NewReleases';
import NotificationsOffIcon from '@material-ui/icons/NotificationsOffOutlined';
import ReplayIcon from '@material-ui/icons/Replay';
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
} from '@material-ui/lab';
import useAxios from 'axios-hooks';
import Label from 'components/Label';
import PageHeader from 'components/PageHeader';
import TextField from 'components/TextField';
import { API_EVENTS, API_FILE } from 'containers/apiUrl';
import Loading from 'containers/Loading';
import { format } from 'date-fns';
import { useFormik } from 'formik';
import React, { Children, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { showError, showSuccess } from 'utils/toast-utils';
import { getImageUrlFromMinio } from 'utils/utils';
import * as yup from 'yup';
import { STATUS_MAP } from '../constants';
import FileItem from '../FileItem';
const getBoderColor = ({ isDragActive, isDragReject }) => {
  if (isDragActive) {
    return 'steelblue';
  }
  if (isDragReject) {
    return '#f44336';
  }
  return 'transparent';
};
const DropContainer = styled.div`
  border: 3px dashed;
  border-color: ${(props) => getBoderColor(props)};
  min-height: 142px;
  display: flex;
  padding: 8px;
  background-color: #f5f5f5;
  flex-wrap: wrap;
  gap: 10px;
`;
const getIconStatus = (status) => {
  switch (status) {
    case 'INVALID_WARNING':
      return <ClearIcon />;
    case 'PROCESSING':
      return <BuildIcon />;
    case 'COMPLETED':
      return <CheckIcon />;
    case 'NEW':
    default:
      return <NewReleasesIcon />;
  }
};
const ItemWrapper = ({
  createdAt,
  status,
  description,
  createdByName = 'Admin',
}) => {
  const statusObj = STATUS_MAP.get(status);
  return (
    <TimelineItem>
      <TimelineOppositeContent>
        <Typography>{format(createdAt, 'HH:mm dd/MM/yyyy')}</Typography>
      </TimelineOppositeContent>
      <TimelineSeparator>
        <TimelineDot style={{ backgroundColor: colors[statusObj.color][500] }}>
          {getIconStatus(status)}
        </TimelineDot>
        <TimelineConnector
          style={{ backgroundColor: colors[statusObj.color][500] }}
        />
      </TimelineSeparator>
      <TimelineContent>
        <Paper elevation={3}>
          <Box px={2} py={1}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h6" component="p">
                {createdByName}
              </Typography>
              <span>
                <Label
                  color={statusObj.color}
                  text={statusObj.text}
                  variant="dot"
                />
                {/* <Typography variant="caption">
                  {format(createdAt, 'HH:mm dd/MM/yyyy')}
                </Typography> */}
              </span>
            </Box>
            {description && (
              <Typography color="textSecondary">{description}</Typography>
            )}
          </Box>
        </Paper>
      </TimelineContent>
    </TimelineItem>
  );
};
const fileAccept =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/msword, image/jpeg, image/png';
const DetailDefaultEvent = ({ history, location }) => {
  const { id } = useParams();
  const [needReload, setNeedReload] = useState(0);
  const {
    acceptedFiles,
    fileRejections,
    getRootProps,
    getInputProps,
    isDragReject,
    isDragActive,
    open,
  } = useDropzone({
    multiple: true,
    noClick: true,
    accept: fileAccept,
    maxSize: 1024 ** 3 * 3, // 3Gb
  });
  useEffect(() => {
    if (fileRejections && fileRejections.length) {
      // const { errors } = fileRejections[0];
      showError('Tệp không hợp lệ');
    }
  }, [fileRejections]);
  useEffect(() => {
    if (acceptedFiles && acceptedFiles.length) {
      const formData = new FormData();
      acceptedFiles.forEach((file) => {
        formData.append('files', file);
      });
      executeUpload({
        data: formData,
      });
    }
  }, [acceptedFiles]);
  const validationSchema = yup.object().shape({
    note: yup.string().trim().max(250, 'Độ dài tối đa 250'),
  });
  const [data, setData] = useState(null);
  const formik = useFormik({
    initialValues: {
      note: '',
      updatedStatus: 'NEW',
      attachmentFiles: [],
    },
    validationSchema,
    onSubmit: (values) => {
      const { attachmentFiles, ...other } = values;
      executePut({
        data: {
          ...other,
          attachmentFileIds: attachmentFiles.map((i) => i.id),
        },
      });
    },
  });
  //  data
  const [{ data: getData, loading, error }, executeGet] = useAxios(
    API_EVENTS.DETAILS_EVENT(id),
    {
      useCache: false,
      manual: true,
    },
  );
  useEffect(() => {
    if (id) {
      executeGet();
    }
  }, [needReload]);
  useEffect(() => {
    if (error) {
      showError(error);
    }
  }, [error]);
  useEffect(() => {
    if (getData) {
      setData(getData);
      formik.resetForm({
        values: {
          note: '',
          updatedStatus: getData?.status || 'NEW',
          attachmentFiles: getData?.attachments || [],
        },
      });
    }
  }, [getData]);
  // upload
  const [
    { data: uploadData, loading: uploadLoading, error: uploadError },
    executeUpload,
  ] = useAxios(
    {
      url: API_FILE.UPLOAD_MULTI_API,
      params: {
        service: 'CAMERAAI',
      },
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
    {
      manual: true,
    },
  );
  useEffect(() => {
    if (uploadError) {
      showError(uploadError);
    }
  }, [uploadError]);

  useEffect(() => {
    if (uploadData) {
      const { attachmentFiles } = formik.values;
      formik.setFieldValue('attachmentFiles', [
        ...attachmentFiles,
        ...uploadData,
      ]);
    }
  }, [uploadData]);
  // update
  const [{ data: putData, loading: putLoading, error: putError }, executePut] =
    useAxios(
      { url: API_EVENTS.UPDATE(id), method: 'PUT' },
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
      showSuccess('Cập nhật thành công');
      setNeedReload(needReload + 1);
    }
  }, [putData]);
  const onAlarmBtnClick = () => {
    showError('Waiting for API');
  };
  const onBack = () => {
    history.push({
      pathname: `/camera-ai/list-event`,
      state: location?.state,
    });
  };
  const onFileDelete = (id) => {
    const { attachmentFiles } = formik.values;
    formik.setFieldValue(
      'attachmentFiles',
      attachmentFiles.filter((file) => file.id != id),
    );
  };
  return (
    <>
      <Helmet>
        <title>Chi tiết sự kiện AI</title>
        <meta name="description" content="Chi tiết sự kiện AI" />
      </Helmet>
      {(loading || uploadLoading || putLoading) && <Loading />}
      <PageHeader
        showBackButton
        onBack={onBack}
        title={`Chi tiết ${data?.eventName || ''}`}
      >
        <Button variant="contained" onClick={onBack}>
          Hủy
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={formik.handleSubmit}
          disabled={!formik.dirty}
        >
          Lưu
        </Button>
        <Tooltip title="Tắt còi">
          <span>
            <IconButton
              onClick={onAlarmBtnClick}
              disabled={data?.sirensStatus != 'ON'}
            >
              <NotificationsOffIcon />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Làm mới">
          <IconButton
            onClick={() => setNeedReload(needReload + 1)}
            color="primary"
          >
            <ReplayIcon />
          </IconButton>
        </Tooltip>
      </PageHeader>
      <Paper style={{ padding: 16 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={7}>
            <div style={{ textAlign: 'center' }}>
              <img
                alt={data?.eventName || ''}
                height="auto"
                width="100%"
                style={{
                  minHeight: '335px',
                }}
                src={data ? getImageUrlFromMinio(data?.imageUrl) : ''}
              />
              <div
                style={{
                  textAlign: 'center',
                  color: 'rgba(0, 0, 0, 0.6)',
                  marginTop: 12,
                  fontStyle: 'italic',
                }}
              >
                Hình ảnh vi phạm được trích xuất từ camera
              </div>
            </div>
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <FormLabel>Tệp đính kèm</FormLabel>
                <Button startIcon={<AddIcon />} color="primary" onClick={open}>
                  Đính kèm
                </Button>
              </div>
              <DropContainer {...getRootProps({ isDragReject, isDragActive })}>
                <input {...getInputProps()} />
                {Children.toArray(
                  formik.values.attachmentFiles.map((file) => (
                    <FileItem {...file} onDelete={onFileDelete} />
                  )),
                )}
              </DropContainer>
            </div>
          </Grid>
          <Grid item xs={12} md={5}>
            <TextField
              disabled
              label="Tiêu đề "
              value={data?.eventName || ''}
            />
            <TextField disabled label="Khu vực" value={data?.areaName || ''} />
            <TextField
              disabled
              label="Ngày phát hiện"
              value={
                data ? format(new Date(data.timeOccur), 'HH:mm dd/MM/yyyy') : ''
              }
            />
            <TextField
              disabled
              label="Tên camera"
              value={data?.deviceName || ''}
            />
            <TextField label="Trạng thái">
              <Select
                value={formik.values.updatedStatus}
                onChange={(e) =>
                  formik.setFieldValue('updatedStatus', e.target.value)
                }
                variant="outlined"
              >
                {Array.from(STATUS_MAP.keys()).map((d) => (
                  <MenuItem value={d} key={d}>
                    {STATUS_MAP.get(d).text}
                  </MenuItem>
                ))}
              </Select>
            </TextField>
            <TextField
              label={`Ghi chú (${formik.values.note.length}/250)`}
              name="note"
              placeholder="Nhập ghi chú"
              multiline
              rows={5}
              value={formik.values.note}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.note && Boolean(formik.errors.note)}
              helperText={formik.touched.note && formik.errors.note}
            />
          </Grid>
        </Grid>
        {getData && getData?.histories && (
          <Timeline align="alternate">
            {React.Children.toArray(
              getData.histories.map((item) => <ItemWrapper {...item} />),
            )}
          </Timeline>
        )}
      </Paper>
    </>
  );
};

export default DetailDefaultEvent;
