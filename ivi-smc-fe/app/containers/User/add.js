/* eslint-disable react/no-this-in-sfc */
import {
  Badge,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  IconButton,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  Switch,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/AddOutlined';
import ClearIcon from '@material-ui/icons/DeleteOutlineOutlined';
import PhotoCameraIcon from '@material-ui/icons/PhotoCameraOutlined';
import { DatePicker } from '@material-ui/pickers';
import useAxios from 'axios-hooks';
import AvatarName from 'components/AvatarName';
import PageHeader from 'components/PageHeader';
import TableCustom from 'components/TableCustom';
import TreeSelect from 'components/TreeSelect';
import VAutocomplete from 'components/VAutocomplete';
import { API_IAM, API_FILE } from 'containers/apiUrl';
import Loading from 'containers/Loading/Loadable';
import { useFormik } from 'formik';
import React, { useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl';
import { getApi } from 'utils/requestUtils';
import { showError } from 'utils/toast-utils';
import { showAlertConfirm } from 'utils/utils';
import * as yup from 'yup';
import { uniq } from 'lodash';
import { useDropzone } from 'react-dropzone';
const useStyles = makeStyles((theme) => ({
  label: {
    margin: 0,
    border: '1px solid #0000003b',
    borderRadius: 4,
    '&:hover': {
      borderColor: theme.palette.primary.main,
    },
  },
  checkbox: {
    padding: 7,
  },
  camera: {
    color: '#ccc',
    background: 'white',
    borderRadius: 30,
    padding: 7,
    width: 36,
    height: 36,
    boxShadow: '0px 0px 10px rgb(0 0 0 / 16%)',
    cursor: 'pointer',
  },
  block: {
    marginTop: 16,
  },
}));
function TextField({ error, helperText, label, required, children, ...other }) {
  return (
    <FormControl size="small" margin="dense" fullWidth error={error}>
      <FormLabel required={required}>{label || <>&nbsp;</>}</FormLabel>
      {children || <OutlinedInput {...other} />}
      <FormHelperText>{helperText}</FormHelperText>
    </FormControl>
  );
}
export default function AddUser({ history, location }) {
  const classes = useStyles();
  const intl = useIntl();
  const goBack = () => {
    history.push({
      pathname: '/user',
      state: location.state,
    });
  };
  const { acceptedFiles, fileRejections, getRootProps, getInputProps } =
    useDropzone({
      accept: 'image/jpeg,image/png',
      maxSize: 1024 ** 2,
    });
  useEffect(() => {
    if (acceptedFiles && acceptedFiles.length) {
      const file = acceptedFiles[0];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('isPublic ', true);
      executeUpload({
        data: formData,
      });
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
  // upload avatar
  const [
    { data: uploadData, loading: uploadLoading, error: uploadError },
    executeUpload,
  ] = useAxios(
    {
      url: API_FILE.UPLOAD_API,
      params: {
        service: 'IAM',
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
      formik.setFieldValue('avatarImageId', uploadData.id);
    }
  }, [uploadData]);
  const defaultNew = {
    availableAt: null,
    expiredAt: null,
    customizeTime: false,
    avatarImageId: undefined,
    email: '',
    fullName: '',
    identityNumber: undefined,
    phoneNumber: '',
    note: '',
    policies: [],
    syncCode: '',
    userCode: '',
    userStatus: 'ACTIVE',
    vehicles: [],
    workPhone: '',
    account: true,
    userAccount: {
      accStatus: 'ACTIVE',
      identityProviderType: 'LOCAL',
      password: '',
      confirmPassword: '',
      username: '',
    },
    userExtraInfo: [],
    mainGroup: null,
    isLeader: false,
    userGroups: [],
  };
  const validationSchema = yup.object().shape({
    fullName: yup
      .string()
      .trim()
      .required(intl.formatMessage({ id: 'app.invalid.required' }))
      .max(
        100,
        intl.formatMessage({ id: 'app.invalid.maxLength' }, { max: 100 }),
      ),
    email: yup
      .string()
      .trim()
      .email(intl.formatMessage({ id: 'app.invalid.email' }))
      .required(intl.formatMessage({ id: 'app.invalid.required' })),
    phoneNumber: yup
      .string()
      .trim()
      .required(intl.formatMessage({ id: 'app.invalid.required' })),
    userCode: yup
      .string()
      .trim()
      .required(intl.formatMessage({ id: 'app.invalid.required' })),
    mainGroup: yup
      .mixed()
      .required(intl.formatMessage({ id: 'app.invalid.required' })),
    userGroups: yup
      .mixed()
      .test(
        'include',
        'Đơn vị kiêm nhiệm trùng nhau hoặc trùng với đơn vị chính',
        function valid(value) {
          const { mainGroup } = this.parent;
          if (!mainGroup) return true;
          const ids = value.filter((v) => v.group).map((v) => v.group.groupId);
          if (ids.length <= 0) return true;
          const included = ids.includes(mainGroup.groupId);
          if (included) return false;
          const notUnique = ids.length > uniq(ids).length;
          if (notUnique) return false;
          return true;
        },
      ),
    policies: yup
      .mixed()
      .test('overlap', 'Vai trò trùng nhau', function valid(value) {
        if (value.length <= 0) return true;
        const ids = value.filter((v) => v.policy).map((v) => v.policy.policyId);
        if (ids.length > uniq(ids).length) return false;
        return true;
      }),
    availableAt: yup
      .date()
      .nullable()
      .when('customizeTime', {
        is: true,
        then: yup
          .date()
          .nullable()
          .required(intl.formatMessage({ id: 'app.invalid.required' })),
      }),
    expiredAt: yup
      .date()
      .nullable()
      .when('customizeTime', {
        is: true,
        then: yup
          .date()
          .nullable()
          .required(intl.formatMessage({ id: 'app.invalid.required' })),
      }),
    userAccount: yup.object().when('account', {
      is: true,
      then: yup.object({
        username: yup
          .string()
          .trim()
          .required(intl.formatMessage({ id: 'app.invalid.required' })),
        password: yup
          .string()
          .required(intl.formatMessage({ id: 'app.invalid.required' })),
        confirmPassword: yup
          .string()
          .oneOf([yup.ref('password'), null], 'Mật khẩu không khớp')
          .required(intl.formatMessage({ id: 'app.invalid.required' })),
      }),
    }),
  });
  const formik = useFormik({
    initialValues: defaultNew,
    validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });
  const onSubmit = (values) => {
    const {
      policies,
      userGroups,
      mainGroup,
      isLeader,
      userExtraInfo,
      customizeTime,
      account,
      userAccount,
      ...other
    } = values;
    const payload = {
      ...other,
      policyIds: policies
        .filter((i) => i.policy?.policyId)
        .map((i) => i.policy.policyId),
      userGroups: [
        {
          isDefault: true,
          groupId: mainGroup.groupId,
          isLeader,
        },
        ...userGroups
          .filter((i) => i.group?.groupId)
          .map((i) => ({
            isDefault: false,
            groupId: i.group.groupId,
            isLeader: i.isLeader,
          })),
      ],
      availableAt:
        customizeTime && values.availableAt
          ? values.availableAt.getTime()
          : null,
      expiredAt:
        customizeTime && values.expiredAt ? values.expiredAt.getTime() : null,
      userExtraInfo: userExtraInfo.filter((i) => i.value.length),
      userAccount: account ? userAccount : undefined,
    };
    executePost({
      data: payload,
    });
  };
  const [
    { data: postData, loading: postLoading, error: postError },
    executePost,
  ] = useAxios(
    { url: API_IAM.USER_CREATE, method: 'POST' },
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
      showAlertConfirm({
        title: 'Thêm mới người dùng thành công',
        text: 'Bạn có muốn tiếp tục bổ sung các thông tin khác cho người dùng này?',
      }).then(({ value }) => {
        if (value) {
          history.push(`/user/details/${postData.userId}`);
        } else goBack();
      });
    }
  }, [postData]);
  const [
    { data: getExtraData, loading: getExtraLoading, error: getExtraError },
  ] = useAxios(API_IAM.USER_EXTRA_KEYS);
  useEffect(() => {
    if (getExtraError) showError(getExtraError);
  }, [getExtraError]);
  useEffect(() => {
    if (getExtraData) {
      const data = getExtraData.map((item) => ({
        key: item.key,
        value: '',
      }));
      formik.setFieldValue('userExtraInfo', data);
    }
  }, [getExtraData]);
  const loadDepartment = (node) =>
    new Promise((resolve, reject) => {
      if (node?.id) {
        resolve([]);
      }
      getApi(API_IAM.LIST_DEPARTMENT)
        .then((ret) => {
          resolve(ret.data);
        })
        .catch((err) => reject(err));
    });
  const departCell = ({ data }) => {
    const onValueChanged = (value) => {
      data.setValue(value);
      data.component.closeEditCell();
    };
    return (
      <TreeSelect
        value={data.value}
        onValueChanged={onValueChanged}
        keyExpr="groupId"
        displayExpr="groupName"
        searchEnabled
        hasItemsExpr={(node) => !node?.isLeaf}
        loadData={loadDepartment}
      />
    );
  };
  const policyCell = ({ data }) => {
    const onValueChanged = (e, value) => {
      data.setValue(value);
      data.component.closeEditCell();
    };
    return (
      <VAutocomplete
        value={data.value}
        getOptionLabel={(option) => option?.policyName || ''}
        loadData={(page, keyword) =>
          new Promise((resolve, reject) => {
            getApi(API_IAM.POLICY_LIST, {
              keyword,
              page,
              limit: 50,
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
        getOptionSelected={(option, selected) =>
          option.policyId === selected.policyId
        }
        onChange={onValueChanged}
      />
    );
  };
  const onInitGroup = (e) => {
    e.data = {
      isLeader: false,
      group: null,
      isDefault: false,
    };
  };
  const onInitPolicy = (e) => {
    e.data = {
      policy: null,
    };
  };
  const headerRender = ({ component }) => (
    <Tooltip title={intl.formatMessage({ id: 'app.tooltip.add' })}>
      <IconButton
        size="small"
        onClick={() => {
          component.addRow();
        }}
        color="primary"
      >
        <AddIcon fontSize="inherit" />
      </IconButton>
    </Tooltip>
  );
  const actionRender = ({ rowIndex, component }) => (
    <Tooltip title={intl.formatMessage({ id: 'app.tooltip.delete' })}>
      <IconButton onClick={() => component.deleteRow(rowIndex)} size="small">
        <ClearIcon fontSize="inherit" />
      </IconButton>
    </Tooltip>
  );
  const departCol = [
    {
      dataField: 'group',
      caption: 'Đơn vị',
      cellRender: ({ value }) => value?.groupName,
      editCellComponent: departCell,
    },
    {
      dataField: 'group.groupCode',
      caption: 'Mã đơn vị',
      allowEditing: false,
    },
    {
      dataField: 'isLeader',
      caption: 'Là lãnh đạo đơn vị',
      dataType: 'boolean',
      // width: 'auto',
    },
    {
      cellRender: actionRender,
      headerCellRender: headerRender,
      alignment: 'center',
      width: 40,
    },
  ];

  const policyCol = [
    {
      dataField: 'policy',
      caption: 'Tên vai trò',
      cellRender: ({ value }) => value?.policyName,
      editCellComponent: policyCell,
    },
    {
      dataField: 'policy.description',
      caption: 'Mô tả',
      allowEditing: false,
    },
    {
      cellRender: actionRender,
      headerCellRender: headerRender,
      alignment: 'center',
      width: 40,
    },
  ];

  function policyRender() {
    const Table = useMemo(
      () => (
        <TableCustom
          hideTable={false}
          columns={policyCol}
          data={formik.values.policies}
          editing={{ mode: 'cell', allowUpdating: true }}
          pagingProps={{ enabled: true, pageSize: 10 }}
          onInitNewRow={onInitPolicy}
        />
      ),
      [formik.values.policies],
    );
    if (formik.values.account) {
      return (
        <div className={classes.block}>
          <Typography variant="h4">Vai trò</Typography>
          <FormHelperText error={Boolean(formik.errors.policies)}>
            {formik.errors.policies}
          </FormHelperText>
          {Table}
        </div>
      );
    }
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Thêm mới người dùng</title>
        <meta name="description" content="Thêm mới người dùng" />
      </Helmet>
      {(postLoading || getExtraLoading || uploadLoading) && <Loading />}
      <form onSubmit={formik.handleSubmit}>
        <Paper style={{ padding: '0 16px 16px 16px', marginTop: '25px' }}>
          <PageHeader
            title="Thêm mới người dùng"
            showBackButton
            onBack={goBack}
          >
            <Button variant="contained" onClick={goBack}>
              Hủy
            </Button>
            <Button variant="contained" color="primary" type="submit">
              Thêm
            </Button>
          </PageHeader>
          <Grid container spacing={2}>
            <Grid
              item
              sm={12}
              style={{ display: 'flex', justifyContent: 'center' }}
            >
              <Badge
                overlap="circular"
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                badgeContent={<PhotoCameraIcon className={classes.camera} />}
                {...getRootProps()}
              >
                <AvatarName
                  name={formik.values.fullName}
                  color="blue"
                  style={{
                    width: 140,
                    height: 140,
                    cursor: 'pointer',
                  }}
                  src={
                    formik.values.avatarImageId
                      ? API_FILE.DOWNLOAD_PUBLIC_FILE(
                          formik.values.avatarImageId,
                        )
                      : ''
                  }
                />
                <input {...getInputProps()} />
              </Badge>
            </Grid>
            <Grid item sm={12} md={6} lg={4} xl={3}>
              <TextField
                required
                label="Họ tên"
                error={
                  formik.touched.fullName && Boolean(formik.errors.fullName)
                }
                helperText={formik.touched.fullName && formik.errors.fullName}
                name="fullName"
                value={formik.values.fullName}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item sm={12} md={6} lg={4} xl={3}>
              <TextField
                required
                label="Email"
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                name="email"
                value={formik.values.email}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item sm={12} md={6} lg={4} xl={3}>
              <TextField
                required
                label="Số điện thoại"
                error={
                  formik.touched.phoneNumber &&
                  Boolean(formik.errors.phoneNumber)
                }
                helperText={
                  formik.touched.phoneNumber && formik.errors.phoneNumber
                }
                name="phoneNumber"
                value={formik.values.phoneNumber}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item sm={12} md={6} lg={4} xl={3}>
              <TextField
                label="Số giấy tờ"
                error={
                  formik.touched.identityNumber &&
                  Boolean(formik.errors.identityNumber)
                }
                helperText={
                  formik.touched.identityNumber && formik.errors.identityNumber
                }
                name="identityNumber"
                value={formik.values.identityNumber}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item sm={12} md={6} lg={4} xl={3}>
              <TextField
                required
                label="Mã người dùng"
                error={
                  formik.touched.userCode && Boolean(formik.errors.userCode)
                }
                helperText={formik.touched.userCode && formik.errors.userCode}
                name="userCode"
                value={formik.values.userCode}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item sm={12} md={6} lg={4} xl={3}>
              <TextField
                label="Mã đồng bộ"
                error={
                  formik.touched.syncCode && Boolean(formik.errors.syncCode)
                }
                helperText={formik.touched.syncCode && formik.errors.syncCode}
                name="syncCode"
                value={formik.values.syncCode}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item sm={12} md={6} lg={4} xl={3}>
              <TextField
                required
                label="Đơn vị"
                error={
                  formik.touched.mainGroup && Boolean(formik.errors.mainGroup)
                }
                helperText={formik.touched.mainGroup && formik.errors.mainGroup}
              >
                <TreeSelect
                  value={formik.values.mainGroup}
                  onValueChanged={(newVal) =>
                    formik.setFieldValue('mainGroup', newVal)
                  }
                  keyExpr="groupId"
                  displayExpr="groupName"
                  searchEnabled
                  hasItemsExpr={(node) => !node?.isLeaf}
                  loadData={loadDepartment}
                  error={
                    formik.touched.mainGroup && Boolean(formik.errors.mainGroup)
                  }
                />
              </TextField>
            </Grid>
            <Grid item sm={12} md={6} lg={4} xl={3}>
              <TextField>
                <FormControlLabel
                  classes={{
                    root: classes.label,
                  }}
                  control={
                    <Checkbox
                      classes={{ root: classes.checkbox }}
                      checked={formik.values.isLeader}
                      color="primary"
                      onChange={(e) =>
                        formik.setFieldValue('isLeader', e.target.checked)
                      }
                    />
                  }
                  label="Là lãnh đạo đơn vị"
                />
              </TextField>
            </Grid>
            <Grid item sm={12} md={6} lg={4} xl={3}>
              <TextField label="Trạng thái">
                <FormControlLabel
                  classes={{
                    root: classes.label,
                  }}
                  control={
                    <Switch
                      checked={formik.values.userStatus == 'ACTIVE'}
                      color="primary"
                      onChange={(e) =>
                        formik.setFieldValue(
                          'userStatus',
                          e.target.checked ? 'ACTIVE' : 'INACTIVE',
                        )
                      }
                    />
                  }
                  label=""
                />
              </TextField>
            </Grid>
            <Grid item sm={12} md={6} lg={4} xl={3}>
              <TextField label="Thời gian hiệu lực">
                <Select
                  value={formik.values.customizeTime}
                  onChange={(e) =>
                    formik.setFieldValue('customizeTime', e.target.value)
                  }
                  variant="outlined"
                >
                  <MenuItem value={false}>Không xác định</MenuItem>
                  <MenuItem value>Tùy chỉnh</MenuItem>
                </Select>
              </TextField>
            </Grid>
            {formik.values.customizeTime && (
              <>
                <Grid item sm={12} md={6} lg={4} xl={3}>
                  <TextField
                    required
                    label="Ngày bắt đầu"
                    error={
                      formik.touched.availableAt &&
                      Boolean(formik.errors.availableAt)
                    }
                  >
                    <DatePicker
                      value={formik.values.availableAt}
                      variant="inline"
                      inputVariant="outlined"
                      format="dd/MM/yyyy"
                      placeholder="dd/MM/yyyy"
                      size="small"
                      autoOk
                      helperText={
                        formik.touched.availableAt && formik.errors.availableAt
                      }
                      error={
                        formik.touched.availableAt &&
                        Boolean(formik.errors.availableAt)
                      }
                      onChange={(newVal) =>
                        formik.setFieldValue('availableAt', newVal)
                      }
                    />
                  </TextField>
                </Grid>
                <Grid item sm={12} md={6} lg={4} xl={3}>
                  <TextField
                    required
                    label="Ngày kết thúc"
                    error={
                      formik.touched.expiredAt &&
                      Boolean(formik.errors.expiredAt)
                    }
                  >
                    <DatePicker
                      value={formik.values.expiredAt}
                      variant="inline"
                      inputVariant="outlined"
                      placeholder="dd/MM/yyyy"
                      format="dd/MM/yyyy"
                      size="small"
                      autoOk
                      helperText={
                        formik.touched.expiredAt && formik.errors.expiredAt
                      }
                      error={
                        formik.touched.expiredAt &&
                        Boolean(formik.errors.expiredAt)
                      }
                      onChange={(newVal) =>
                        formik.setFieldValue('expiredAt', newVal)
                      }
                    />
                  </TextField>
                </Grid>
              </>
            )}
            {React.Children.toArray(
              formik.values.userExtraInfo.map((item, index) => (
                <Grid item sm={12} md={6} lg={4} xl={3}>
                  <TextField
                    label={item.key}
                    name={`userExtraInfo[${index}].value`}
                    value={formik.values.userExtraInfo[index].value}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                  />
                </Grid>
              )),
            )}
            <Grid item sm={12}>
              <TextField
                label="Ghi chú"
                error={formik.touched.note && Boolean(formik.errors.note)}
                helperText={formik.touched.note && formik.errors.note}
                name="note"
                value={formik.values.note}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                multiline
                rows={3}
              />
            </Grid>
          </Grid>
          <div className={classes.block}>
            <Typography variant="h4">Đơn vị kiêm nhiệm</Typography>
            <FormHelperText error={Boolean(formik.errors.userGroups)}>
              {formik.errors.userGroups}
            </FormHelperText>
            {useMemo(
              () => (
                <TableCustom
                  hideTable={false}
                  columns={departCol}
                  data={formik.values.userGroups}
                  editing={{ mode: 'cell', allowUpdating: true }}
                  pagingProps={{ enabled: true, pageSize: 10 }}
                  onInitNewRow={onInitGroup}
                />
              ),
              [formik.values.userGroups],
            )}
          </div>
          <div className={classes.block}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formik.values.account}
                  color="primary"
                  onChange={(e) =>
                    formik.setFieldValue('account', e.target.checked)
                  }
                />
              }
              label="Tạo tài khoản đăng nhập"
            />
          </div>
          {formik.values.account && (
            <div className={classes.block}>
              <Typography variant="h4">Thông tin tài khoản</Typography>
              <Grid container spacing={2}>
                <Grid item sm={12} md={6} lg={4} xl={3}>
                  <TextField
                    required
                    label="Tài khoản"
                    error={
                      formik.touched.userAccount?.username &&
                      Boolean(formik.errors.userAccount?.username)
                    }
                    helperText={
                      formik.touched.userAccount?.username &&
                      formik.errors.userAccount?.username
                    }
                    name="userAccount.username"
                    autoComplete="new-password"
                    value={formik.values.userAccount.username}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                  />
                </Grid>
                <Grid item sm={12} md={6} lg={4} xl={3}>
                  <TextField
                    required
                    label="Mật khẩu"
                    error={
                      formik.touched.userAccount?.password &&
                      Boolean(formik.errors.userAccount?.password)
                    }
                    helperText={
                      formik.touched.userAccount?.password &&
                      formik.errors.userAccount?.password
                    }
                    autoComplete="new-password"
                    name="userAccount.password"
                    value={formik.values.userAccount.password}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="password"
                  />
                </Grid>
                <Grid item sm={12} md={6} lg={4} xl={3}>
                  <TextField
                    required
                    label="Xác nhận mật khẩu"
                    error={
                      formik.touched.userAccount?.confirmPassword &&
                      Boolean(formik.errors.userAccount?.confirmPassword)
                    }
                    helperText={
                      formik.touched.userAccount?.confirmPassword &&
                      formik.errors.userAccount?.confirmPassword
                    }
                    name="userAccount.confirmPassword"
                    value={formik.values.userAccount.confirmPassword}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="password"
                  />
                </Grid>
                <Grid item sm={12} md={6} lg={4} xl={3}>
                  <TextField label="Trạng thái">
                    <FormControlLabel
                      classes={{
                        root: classes.label,
                      }}
                      control={
                        <Switch
                          checked={
                            formik.values.userAccount.accStatus == 'ACTIVE'
                          }
                          color="primary"
                          onChange={(e) =>
                            formik.setFieldValue(
                              'userAccount.accStatus',
                              e.target.checked ? 'ACTIVE' : 'INACTIVE',
                            )
                          }
                        />
                      }
                      label=""
                    />
                  </TextField>
                </Grid>
              </Grid>
            </div>
          )}
          {policyRender()}
        </Paper>
      </form>
    </>
  );
}
