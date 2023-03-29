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
import Dialog from 'components/Dialog';
import PageHeader from 'components/PageHeader';
import TableCustom from 'components/TableCustom';
import TreeSelect from 'components/TreeSelect';
import { API_FILE, API_IAM } from 'containers/apiUrl';
import Loading from 'containers/Loading/Loadable';
import { format } from 'date-fns';
import { useFormik } from 'formik';
import { uniq } from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';
import { callApi, getApi } from 'utils/requestUtils';
import { showError, showSuccess } from 'utils/toast-utils';
import { showAlertConfirm } from 'utils/utils';
import * as yup from 'yup';
import AddPolicy from './render/AddAuthorities';
import AddAccount from './addAccount';
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
export default function EditUser() {
  const { id } = useParams();
  const classes = useStyles();
  const intl = useIntl();
  const [edit, setEdit] = useState(false);
  const [info, setInfo] = useState(null);
  const [change, setChange] = useState(0);
  const [loading, setLoading] = useState(false);
  const [openAddPolicy, setOpenAddPolicy] = useState(false);
  const [openAddAccount, setOpenAddAccount] = useState(false);
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
        html: errors.map((err) => `<li>${err.message}</li>`),
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
      method: 'POST',
      params: {
        service: 'IAM',
      },
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
    syncCode: '',
    userCode: '',
    userStatus: 'ACTIVE',
    vehicles: [],
    workPhone: '',
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
      userGroups,
      mainGroup,
      isLeader,
      userExtraInfo,
      customizeTime,
      policies,
      ...other
    } = values;
    const payload = {
      ...other,
      userGroups: [
        {
          isDefault: true,
          groupId: mainGroup.groupId,
          isLeader,
        },
        ...userGroups.map((i) => ({
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
    };
    executePost({
      data: payload,
    });
  };
  const [
    { data: postData, loading: postLoading, error: postError },
    executePost,
  ] = useAxios(
    { url: API_IAM.USER_CREATE, method: 'PUT' },
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
      setEdit(false);
      setChange(change + 1);
    }
  }, [postData]);
  const [
    { data: getExtraData, loading: getExtraLoading, error: getExtraError },
  ] = useAxios(API_IAM.USER_EXTRA_KEYS);
  useEffect(() => {
    if (getExtraError) showError(getExtraError);
  }, [getExtraError]);
  const [{ data: getData, loading: getLoading, error: getError }, executeGet] =
    useAxios(API_IAM.USER_DETAIL(id), {
      manual: true,
    });
  useEffect(() => {
    if (id && getExtraData) executeGet();
  }, [id, change, getExtraData]);
  useEffect(() => {
    if (getError) showError(getError);
  }, [getError]);
  // add acount
  const [
    { data: postAcoount, loading: postAccountLoading, error: postAccountError },
    executePostAccount,
  ] = useAxios(
    { url: API_IAM.USER_ACCOUNT_CREATE(id), method: 'POST' },
    {
      manual: true,
    },
  );
  useEffect(() => {
    if (postAccountError) showError(postAccountError);
  }, [postAccountError]);
  useEffect(() => {
    if (postAcoount) {
      setOpenAddAccount(false);
      setChange(change + 1);
    }
  }, [postAcoount]);
  useEffect(() => {
    if (getData) {
      const { userGroups, userExtraInfo, availableAt, expiredAt, ...data } =
        getData;
      const mainGroup = userGroups.find((i) => i.isDefault) || null;
      const groups = userGroups.filter((i) => !i.isDefault);
      const state = {
        ...data,
        customizeTime: Boolean(getData.availableAt),
        availableAt: availableAt ? new Date(availableAt) : null,
        expiredAt: expiredAt ? new Date(expiredAt) : null,
        mainGroup,
        isLeader: mainGroup?.isLeader || false,
        userGroups: groups.map((i) => {
          const { isLeader, isDefault, userId, ...group } = i;
          return {
            isLeader,
            isDefault,
            group,
          };
        }),
        userExtraInfo: getExtraData.map((i) => {
          const foundKey = userExtraInfo.find((k) => k.key == i.key);
          return {
            key: i.key,
            value: foundKey?.value || '',
          };
        }),
      };
      setInfo(state);
    }
  }, [getData]);
  const onChangeAccountStatus = (e) => {
    setLoading(true);
    callApi(API_IAM.USER_ACCOUNT_ENABLE(id, e.target.checked), 'PUT')
      .then(() => {
        showSuccess('Cập nhật trạng thái thành công');
        setChange(change + 1);
      })
      .catch((err) => showError(err))
      .finally(() => setLoading(false));
  };
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
  const onInitGroup = (e) => {
    e.data = {
      isLeader: false,
      group: null,
      isDefault: false,
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
      // width: 'auto',
    },
    {
      cellRender: actionRender,
      headerCellRender: headerRender,
      alignment: 'center',
      width: 40,
    },
  ];
  const departColInfo = [
    {
      dataField: 'group.groupName',
      caption: 'Đơn vị',
    },
    {
      dataField: 'group.groupCode',
      caption: 'Mã đơn vị',
    },
    {
      dataField: 'isLeader',
      caption: 'Là lãnh đạo đơn vị',
    },
  ];
  const onDeletePolicy = (data) => {
    showAlertConfirm({
      text: 'Bạn có chắc chắn muốn xóa vai trò này không?',
    }).then(({ value }) => {
      if (value) {
        setLoading(true);
        callApi(API_IAM.POLICY_DELETE_USER, 'DELETE', {
          piId: getData.piId,
          policyId: data.policyId,
        })
          .then(() => {
            showSuccess('Xóa vai trò thành công');
            setChange(change + 1);
          })
          .catch((err) => showError(err))
          .finally(() => setLoading(false));
      }
    });
  };
  const actionPolicy = ({ data }) => (
    <Tooltip title={intl.formatMessage({ id: 'app.tooltip.delete' })}>
      <IconButton onClick={() => onDeletePolicy(data)} size="small">
        <ClearIcon fontSize="inherit" />
      </IconButton>
    </Tooltip>
  );
  const onAddPolicyDialogClose = (ret) => {
    if (ret) {
      setLoading(true);
      callApi(API_IAM.POST_USER_POLICY, 'POST', {
        piId: getData.piId,
        policyId: ret.policyId,
      })
        .then(() => {
          showSuccess('Thêm vai trò thành công');
          setChange(change + 1);
        })
        .catch((err) => showError(err))
        .finally(() => {
          setLoading(false);
          setOpenAddPolicy(false);
        });
    } else setOpenAddPolicy(false);
  };
  const addPolicyDialog = openAddPolicy && (
    <Dialog
      open={openAddPolicy}
      title="Thêm vai trò"
      fullWidth
      maxWidth="sm"
      onClose={() => onAddPolicyDialogClose(0)}
    >
      <AddPolicy
        policies={getData?.policies}
        onSubmit={onAddPolicyDialogClose}
      />
    </Dialog>
  );
  const headerPolicy = () => (
    <Tooltip title={intl.formatMessage({ id: 'app.tooltip.add' })}>
      <IconButton
        size="small"
        onClick={() => {
          setOpenAddPolicy(true);
        }}
        color="primary"
      >
        <AddIcon fontSize="inherit" />
      </IconButton>
    </Tooltip>
  );
  const policyCol = [
    {
      dataField: 'policyName',
      caption: 'Tên vai trò',
    },
    {
      dataField: 'description',
      caption: 'Mô tả',
    },
    {
      cellRender: actionPolicy,
      headerCellRender: headerPolicy,
      alignment: 'center',
      width: 40,
    },
  ];
  const onResetPwBtnClick = () => {
    showAlertConfirm({
      text: 'Bạn có chắc chắn muốn đặt lại mật khẩu cho tài khoản này?',
    }).then(({ value }) => {
      if (value) {
        setLoading(true);
        callApi(API_IAM.USER_RESET_PASSWORD(id), 'PATCH')
          .then(() => {
            showSuccess('Đặt lại mật khẩu thành công');
          })
          .catch((err) => showError(err))
          .finally(() => setLoading(false));
      }
    });
  };

  function infoRender() {
    return (
      <>
        <Grid container spacing={2}>
          <Grid
            item
            sm={12}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            <AvatarName
              name={info.fullName}
              color="blue"
              src={
                info.avatarImageId
                  ? API_FILE.DOWNLOAD_PUBLIC_FILE(info.avatarImageId)
                  : ''
              }
              style={{
                width: 140,
                height: 140,
              }}
            />
            <Typography>{info.accessCode}</Typography>
          </Grid>
          <Grid item sm={12} md={6} lg={4} xl={3}>
            <TextField required label="Họ tên" value={info.fullName} disabled />
          </Grid>
          <Grid item sm={12} md={6} lg={4} xl={3}>
            <TextField required label="Email" value={info.email} disabled />
          </Grid>
          <Grid item sm={12} md={6} lg={4} xl={3}>
            <TextField
              required
              label="Số điện thoại"
              value={info.phoneNumber}
              disabled
            />
          </Grid>
          <Grid item sm={12} md={6} lg={4} xl={3}>
            <TextField
              label="Số giấy tờ"
              value={info.identityNumber}
              disabled
            />
          </Grid>
          <Grid item sm={12} md={6} lg={4} xl={3}>
            <TextField
              required
              label="Mã người dùng"
              value={info.userCode}
              disabled
            />
          </Grid>
          <Grid item sm={12} md={6} lg={4} xl={3}>
            <TextField label="Mã đồng bộ" value={info.syncCode} disabled />
          </Grid>
          <Grid item sm={12} md={6} lg={4} xl={3}>
            <TextField
              required
              label="Đơn vị"
              value={info.mainGroup?.groupName}
              disabled
            />
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
                    checked={info.isLeader}
                    color="primary"
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
                    checked={info.userStatus == 'ACTIVE'}
                    color="primary"
                  />
                }
                label=""
              />
            </TextField>
          </Grid>
          <Grid item sm={12} md={6} lg={4} xl={3}>
            <TextField label="Thời gian hiệu lực">
              <OutlinedInput
                value={info.customizeTime ? 'Tùy chỉnh' : 'Không xác định'}
                disabled
              />
            </TextField>
          </Grid>
          {info.customizeTime && (
            <>
              <Grid item sm={12} md={6} lg={4} xl={3}>
                <TextField
                  required
                  label="Ngày bắt đầu"
                  value={format(info.availableAt, 'dd/MM/yyyy')}
                  disabled
                />
              </Grid>
              <Grid item sm={12} md={6} lg={4} xl={3}>
                <TextField
                  required
                  label="Ngày kết thúc"
                  value={format(info.expiredAt, 'dd/MM/yyyy')}
                  disabled
                />
              </Grid>
            </>
          )}
          {React.Children.toArray(
            info.userExtraInfo.map((item) => (
              <Grid item sm={12} md={6} lg={4} xl={3}>
                <TextField label={item.key} value={item.value} disabled />
              </Grid>
            )),
          )}
          <Grid item sm={12}>
            <TextField
              label="Ghi chú"
              value={info.note}
              disabled
              multiline
              rows={3}
            />
          </Grid>
        </Grid>
        <div className={classes.block}>
          <Typography variant="h4">Đơn vị kiêm nhiệm</Typography>
          <TableCustom
            columns={departColInfo}
            data={info.userGroups}
            pagingProps={{ enabled: true, pageSize: 10 }}
          />
        </div>
      </>
    );
  }
  const groupTable = useMemo(
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
  );
  const policyTable = useMemo(
    () => (
      <TableCustom
        hideTable={false}
        columns={policyCol}
        data={getData?.policies}
        pagingProps={{ enabled: true, pageSize: 10 }}
      />
    ),
    [getData],
  );
  function editRender() {
    return (
      <>
        <Grid container spacing={2}>
          <Grid
            item
            sm={12}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
            }}
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
                    ? API_FILE.DOWNLOAD_PUBLIC_FILE(formik.values.avatarImageId)
                    : ''
                }
              />
              <input {...getInputProps()} />
            </Badge>
            <Typography>{info.accessCode}</Typography>
          </Grid>
          <Grid item sm={12} md={6} lg={4} xl={3}>
            <TextField
              required
              label="Họ tên"
              error={formik.touched.fullName && Boolean(formik.errors.fullName)}
              helperText={formik.touched.fullName && formik.errors.fullName}
              name="fullName"
              value={formik.values.fullName}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              disabled={info.identityProviderType == 'LDAP'}
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
              disabled={info.identityProviderType == 'LDAP'}
            />
          </Grid>
          <Grid item sm={12} md={6} lg={4} xl={3}>
            <TextField
              required
              label="Số điện thoại"
              error={
                formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)
              }
              helperText={
                formik.touched.phoneNumber && formik.errors.phoneNumber
              }
              name="phoneNumber"
              value={formik.values.phoneNumber}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              disabled={info.identityProviderType == 'LDAP'}
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
              error={formik.touched.userCode && Boolean(formik.errors.userCode)}
              helperText={formik.touched.userCode && formik.errors.userCode}
              name="userCode"
              value={formik.values.userCode}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              // disabled={info.identityProviderType == 'LDAP'}
            />
          </Grid>
          <Grid item sm={12} md={6} lg={4} xl={3}>
            <TextField
              label="Mã đồng bộ"
              error={formik.touched.syncCode && Boolean(formik.errors.syncCode)}
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
                    formik.touched.expiredAt && Boolean(formik.errors.expiredAt)
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
          {groupTable}
        </div>
      </>
    );
  }
  const addAccountBtnClick = () => {
    setOpenAddAccount(true);
  };
  const handleAddAccountClose = (ret) => {
    if (ret) {
      executePostAccount({
        data: ret,
      });
    } else setOpenAddAccount(false);
  };
  const addAccountDialog = openAddAccount && (
    <Dialog
      title="Tạo tài khoản đăng nhập"
      open={openAddAccount}
      onClose={() => handleAddAccountClose(0)}
      fullWidth
      maxWidth="sm"
    >
      <AddAccount onSubmit={handleAddAccountClose} />
    </Dialog>
  );
  return (
    <>
      {(postLoading ||
        getLoading ||
        getExtraLoading ||
        loading ||
        postAccountLoading ||
        uploadLoading) && <Loading />}
      {addAccountDialog}
      {info && (
        <form onSubmit={formik.handleSubmit}>
          <Paper style={{ padding: '0 16px 16px 16px' }}>
            <PageHeader title="Thông tin người dùng">
              {!getData?.userAccount && getData.userStatus == 'ACTIVE' && (
                <Button variant="contained" onClick={addAccountBtnClick}>
                  Tạo tài khoản đăng nhập
                </Button>
              )}
              {edit ? (
                <>
                  <Button
                    variant="contained"
                    color="default"
                    onClick={() => setEdit(false)}
                  >
                    Hủy
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={formik.handleSubmit}
                  >
                    Lưu
                  </Button>
                </>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    const { status, ...formData } = info;
                    setEdit(true);
                    formik.resetForm({ values: formData });
                  }}
                >
                  Chỉnh sửa
                </Button>
              )}
            </PageHeader>
            {edit ? editRender() : infoRender()}
          </Paper>
        </form>
      )}
      {getData?.userAccount && (
        <Paper style={{ padding: '0 16px 16px 16px', marginTop: '16px' }}>
          <PageHeader title="Thông tin tài khoản">
            {getData.userAccount.identityProviderType == 'LOCAL' &&
              getData.userAccount.accStatus == 'ACTIVE' && (
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={onResetPwBtnClick}
                >
                  Đặt lại mật khẩu
                </Button>
              )}
          </PageHeader>
          <div className={classes.block}>
            <Grid container spacing={2}>
              <Grid item sm={12} md={6} lg={4} xl={3}>
                <TextField
                  required
                  label="Tài khoản"
                  value={getData.userAccount.username}
                  disabled
                />
              </Grid>
              <Grid item sm={12} md={6} lg={4} xl={3}>
                <TextField
                  label="Loại tài khoản"
                  value={getData.userAccount.identityProviderType}
                  disabled
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
                        checked={getData.userAccount.accStatus == 'ACTIVE'}
                        color="primary"
                        onChange={onChangeAccountStatus}
                        disabled={getData.userStatus == 'INACTIVE'}
                      />
                    }
                    label=""
                  />
                </TextField>
              </Grid>
            </Grid>
          </div>
          <div className={classes.block}>
            <Typography variant="h4">Vai trò</Typography>
            {policyTable}
            {addPolicyDialog}
          </div>
        </Paper>
      )}
    </>
  );
}
