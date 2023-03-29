import React, { useState, useEffect, useMemo } from 'react';
import TableCustom from 'components/TableCustom';
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  IconButton,
  TextField,
  Tooltip,
} from '@material-ui/core';
import useAxios from 'axios-hooks';
import { CAM_AI_SERVER } from 'containers/apiUrl';
import { showError, showSuccess } from 'utils/toast-utils';
import Loading from 'containers/Loading/Loadable';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import { useFormik } from 'formik';
import * as yup from 'yup';
export default function Buckets({ id }) {
  const [needReload, setNeedReload] = useState(0);
  const [adding, setAdding] = useState(false);
  const validationSchema = yup.object().shape({
    name: yup.string().trim().required('Thông tin này là bắt buộc'),
  });
  const formik = useFormik({
    initialValues: {
      name: '',
      days: 0,
    },
    validationSchema,
    onSubmit: (values) => {
      executePost({
        data: values,
      });
    },
  });
  // table data
  const [
    { data: getTableData, loading: getTableLoading, error: getTableError },
    executeGetTable,
  ] = useAxios(CAM_AI_SERVER.LIST_BUCKET(id), {
    useCache: false,
    manual: true,
  });
  useEffect(() => {
    executeGetTable();
  }, [needReload]);
  useEffect(() => {
    if (getTableError) {
      showError(getTableError);
    }
  }, [getTableError]);
  // post
  const [
    { data: postData, loading: postLoading, error: postError },
    executePost,
  ] = useAxios(
    {
      url: CAM_AI_SERVER.DETAILS_BUCKET(id),
      method: 'POST',
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
      showSuccess('Thành công');
      setNeedReload(needReload + 1);
      if (adding) {
        formik.resetForm();
        setAdding(false);
      }
    }
  }, [postData]);
  const columns = [
    {
      dataField: 'name',
      caption: 'Bucket name',
      allowEditing: false,
    },
    {
      dataField: 'creationDate',
      caption: 'Creation date',
      dataType: 'datetime',
      format: 'HH:mm dd/MM/yyyy',
      allowEditing: false,
    },
    {
      dataField: 'lifeCycle',
      caption: 'Time storage (s)',
      dataType: 'number',
    },
  ];
  const onAddBtnClick = () => {
    setAdding(true);
  };
  const onCancelBtnClick = () => {
    setAdding(false);
    formik.resetForm();
  };
  const onRowUpdated = ({ data }) => {
    executePost({
      data: {
        name: data.name,
        days: data.lifeCycle,
      },
      method: 'PUT',
    });
  };
  return (
    <>
      {(getTableLoading || postLoading) && <Loading />}
      <DialogContent>
        {useMemo(() => (
          <TableCustom
            data={getTableData}
            columns={columns}
            pagingProps={{ enabled: true, pageSize: 10 }}
            editing={{
              mode: 'row',
              useIcons: true,
              allowUpdating: true,
            }}
            onRowUpdated={onRowUpdated}
          />
        ))}
      </DialogContent>
      <DialogActions>
        {adding ? (
          <Box display="flex" alignItems="start">
            <TextField
              variant="outlined"
              size="small"
              placeholder="Add bucket name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
            <Box height={40} display="flex" alignItems="center">
              <Tooltip title="Lưu" onClick={formik.handleSubmit}>
                <IconButton size="small">
                  <CheckIcon style={{ color: '#40A574' }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Hủy">
                <IconButton size="small" onClick={onCancelBtnClick}>
                  <CloseIcon style={{ color: '#E24545' }} />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        ) : (
          <Button variant="contained" color="primary" onClick={onAddBtnClick}>
            Add new bucket
          </Button>
        )}
      </DialogActions>
    </>
  );
}
