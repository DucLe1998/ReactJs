import {
  Button,
  Checkbox,
  DialogActions,
  Grid,
  ListItemIcon,
  ListItemText,
  Typography,
  Select,
  MenuItem,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import TextField from 'components/TextField';
import VAutocomplete from 'components/VAutocomplete';
import { GUEST_API } from 'containers/apiUrl';
import { useFormik } from 'formik';
import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { getApi } from 'utils/requestUtils';
import * as yup from 'yup';
import Loading from 'containers/Loading/Loadable';
import useAxios from 'axios-hooks';
import { showError } from 'utils/toast-utils';
const GENDER_MAP = [
  {
    key: 'MALE',
    value: 'Nam',
  },
  {
    key: 'FEMALE',
    value: 'Nữ',
  },
  {
    key: 'OTHER',
    value: 'Khác',
  },
];
export default function AddGuest({ guestList, onSubmit }) {
  const intl = useIntl();
  const [data, setData] = useState([]);
  const [add, setAdd] = useState(false);
  const validationSchema = yup.object().shape({
    identityNumber: yup.string(),
    fullName: yup
      .string()
      .trim()
      .required(intl.formatMessage({ id: 'app.invalid.required' })),
    phoneNumber: yup
      .string()
      .trim()
      .required(intl.formatMessage({ id: 'app.invalid.required' })),
    email: yup.string().email(intl.formatMessage({ id: 'app.invalid.email' })),
  });
  const [{ data: postData, error: postError, loading }, executePost] = useAxios(
    {
      url: GUEST_API.CREATE,
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
      setData((prev) => [...prev, postData]);
      setAdd(false);
    }
  }, [postData]);
  const onAdd = (values) => {
    executePost({ data: values });
  };
  const formik = useFormik({
    initialValues: {
      address: '',
      email: '',
      fullName: '',
      gender: 'OTHER',
      identityNumber: '',
      phoneNumber: '',
      // avatarFileId: '',
      // groupInfo: '',
    },
    validationSchema,
    onSubmit: onAdd,
  });
  return (
    <>
      <Typography variant="h6" component="p">
        Thêm khách
      </Typography>
      {loading && <Loading />}
      {add ? (
        <>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <TextField
                label="Số giấy tờ"
                value={formik.values.identityNumber}
                disabled
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                required
                name="fullName"
                label="Tên khách"
                value={formik.values.fullName}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                error={
                  formik.touched.fullName && Boolean(formik.errors.fullName)
                }
                helperText={formik.touched.fullName && formik.errors.fullName}
                autoFocus
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                required
                name="phoneNumber"
                label="Số điện thoại"
                value={formik.values.phoneNumber}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                error={
                  formik.touched.phoneNumber &&
                  Boolean(formik.errors.phoneNumber)
                }
                helperText={
                  formik.touched.phoneNumber && formik.errors.phoneNumber
                }
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="address"
                label="Địa chỉ/Công ty"
                value={formik.values.address}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="email"
                label="Email"
                value={formik.values.email}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField label="Giới tính">
                <Select
                  value={formik.values.gender}
                  onChange={(e) =>
                    formik.setFieldValue('gender', e.target.value)
                  }
                  variant="outlined"
                >
                  {GENDER_MAP.map((d) => (
                    <MenuItem value={d.key} key={d.key}>
                      {d.value}
                    </MenuItem>
                  ))}
                </Select>
              </TextField>
            </Grid>
          </Grid>
          <DialogActions>
            <Button
              variant="contained"
              onClick={() => {
                formik.resetForm();
                setAdd(null);
              }}
            >
              Trở về
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
      ) : (
        <>
          <VAutocomplete
            value={data}
            fullWidth
            multiple
            autoFocus
            getOptionLabel={(option) => option?.identityNumber || option || ''}
            getOptionSelected={(option, value) => option.id == value.id}
            getOptionDisabled={(option) => {
              const index = guestList.findIndex((d) => d.id == option.id);
              return index >= 0;
            }}
            itemSize={56}
            renderOption={(option, { selected }) => {
              if (typeof option == 'string') {
                return (
                  <>
                    <ListItemIcon>
                      <AddIcon style={{ margin: 9 }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={option || ''}
                      secondary="Thêm mới khách"
                    />
                  </>
                );
              }
              return (
                <>
                  <ListItemIcon>
                    <Checkbox
                      style={{ marginRight: 8 }}
                      checked={selected}
                      color="primary"
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={option?.identityNumber || ''}
                    secondary={option?.fullName || ''}
                  />
                </>
              );
            }}
            loadData={(page, keyword, signal) =>
              new Promise((resolve, reject) => {
                getApi(GUEST_API.LIST, { keyword, page, limit: 15 }, { signal })
                  .then((result) => {
                    resolve({
                      data: result.data.rows,
                      totalCount: result.data.count || 0,
                    });
                  })
                  .catch((err) => reject(err));
              })
            }
            filterOptions={(options, params) => {
              const filtered = [...options];
              const guestIdList = [...options, ...guestList].map(
                (x) => x.identityNumber,
              );
              if (
                params.inputValue !== '' &&
                !guestIdList.includes(params.inputValue)
              ) {
                filtered.push(params.inputValue);
              }
              return filtered;
            }}
            onChange={(e, newValue) => {
              const newGuest = newValue.find((d) => typeof d == 'string');
              if (newGuest) {
                setAdd(true);
                formik.setFieldValue('identityNumber', newGuest, false);
              } else setData(newValue);
            }}
            placeholder="Nhập số giấy tờ"
          />
          <DialogActions>
            <Button variant="contained" onClick={() => onSubmit(0)}>
              Đóng
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => onSubmit(data)}
            >
              Thêm
            </Button>
          </DialogActions>
        </>
      )}
    </>
  );
}
