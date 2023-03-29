/* eslint-disable func-names */
import { faIdCard } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  // Badge,
  FormControl,
  FormLabel,
  Grid,
  IconButton,
  Paper,
  TableContainer,
  TextField,
  Tooltip,
} from '@material-ui/core';
import InfoIcon from '@material-ui/icons/InfoOutlined';
import axios from 'axios';
import CustomTable from 'components/Custom/table/CustomTable';
import Dialog from 'components/Dialog';
import PageHeader from 'components/PageHeader';
import Loading from 'containers/Loading';
import DialogCancel from 'containers/ManageGuests/dialogs/DialogCancel';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl';
import { Link, useParams } from 'react-router-dom';
import { checkAuthority } from 'utils/functions';
import { showError, showSuccess } from 'utils/toast-utils';
import { GUEST_REGISTRATION } from '../apiUrl';
import DialogIdentityDetails from './dialogs/DialogIdentityDetails';
import messages from './messages';
import { getIntlObj, renderTime, getDayOfWeeks } from './modules';
import { detailStyles } from './styles';
const faceIdentityStatusList = {
  UNIDENTIFIED: 'Không xác định',
  WAITING: 'Đang chờ phê duyệt',
  APPROVED: 'Đã phê duyệt',
  CANCELLED: 'Đã từ chối',
};

const Buttons = function ({
  showRegister,
  showUpdate,
  showCancel,
  handleUpdate,
  handleReregister,
  handleCancel,
}) {
  const intl = useIntl();
  const classes = detailStyles();
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {showCancel && (
        <button
          onClick={handleCancel}
          type="button"
          className={classes.button}
          style={{
            border: '1px solid #dddddd',
            color: 'rgba(0, 0, 0, 0.8)',
          }}
        >
          {intl.formatMessage(messages.cancelRegistration)}
        </button>
      )}
      {showRegister && (
        <button
          type="button"
          className={classes.button}
          onClick={handleReregister}
          style={{
            background: '#00554A',
            boxShadow: '0px 4px 10px rgba(16, 156, 241, 0.24)',
            color: '#ffffff',
            marginRight: '30px',
            marginLeft: '24px',
          }}
        >
          {intl.formatMessage(messages.reRegister)}
        </button>
      )}
      {showUpdate && (
        <button
          type="button"
          onClick={handleUpdate}
          className={classes.button}
          style={{
            background: '#00554A',
            boxShadow: '0px 4px 10px rgba(16, 156, 241, 0.24)',
            color: '#ffffff',
            marginRight: '30px',
            marginLeft: '24px',
          }}
        >
          {intl.formatMessage(messages.update)}
        </button>
      )}
    </div>
  );
};

export default function Details({ userAuthority, history, location }) {
  const resourceCode = 'guest-registration/registration';
  // const scopes = checkAuthority(
  //   ['update', 'delete', 'create'],
  //   resourceCode,
  //   userAuthority,
  // );
  const scopes = {
    get: true,
    update: true,
    delete: true,
    create: true,
    patch: true,
  };
  const [data, setData] = useState({});
  const [openCancel, setOpenCancel] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [showIdentityDetails, setShowIdentityDetails] = useState(false);

  const classes = detailStyles();
  const intl = useIntl();

  const { id } = useParams();
  useEffect(() => {
    setLoading(true);

    axios
      .get(`${GUEST_REGISTRATION}/registrations/${id}`)
      .then((res) => {
        console.log('res', res);
        if (res.data.status === 'REMOVE') res.data.status = 'CANCELLED';
        setData(res.data);
      })
      .catch((err) => {
        if (
          err.response?.status == 403 ||
          (err.response?.status == 400 &&
            err.response.data.error.includes('PERMISSION'))
        ) {
          history.replace('/403');
        }
        showError(err);
      })
      .finally(() => setLoading(false));
  }, []);

  const backToManage = () => {
    history.replace({
      pathname: '/guest-registrations',
      state: location.state,
    });
  };

  const handleUpdate = () => {
    history.push({
      pathname: `/guest-registrations/${id}/update`,
      state: location.state,
    });
  };
  const onReRegister = () => {
    history.push({
      pathname: `/guest-registrations/${id}/re-register`,
      state: location.state,
    });
  };
  const handleCancel = () => {
    setOpenCancel(true);
  };
  const handleCloseCancel = () => {
    setOpenCancel(false);
  };
  const onSuccessCancel = () => {
    axios
      .patch(`${GUEST_REGISTRATION}/registrations/${id}/cancel`)
      .then(() => {
        setOpenCancel(false);
        history.replace('/guest-registrations');
        showSuccess('Yêu cầu đăng ký khách đã bị hủy.');
      })
      .catch((error) => {
        setOpenCancel(false);
        showError(error);
      });
  };
  const onApproveFaceBtnClick = (data) => {
    setShowIdentityDetails(data);
  };
  const onCloseFaceDetails = (ret) => {
    if (ret) {
      setLoading(true);
      axios
        .patch(
          `${GUEST_REGISTRATION}/registrations/${id}/guest/${showIdentityDetails.guestId}/${ret}`,
        )
        .then(() => {
          // need reload
          showSuccess(
            `${
              ret == 'approve' ? 'Phê duyệt' : 'Từ chối'
            } định danh khuôn mặt thành công`,
          );
          setShowIdentityDetails(null);
        })
        .catch((err) => showError(err))
        .finally(() => setLoading(false));
    } else setShowIdentityDetails(null);
  };
  const renderRepeatType = (type, days = []) => {
    if (!type) return '';
    if (type == 'WEEKLY') {
      return `${intl.formatMessage(getIntlObj(type))} (${days
        .map((d) => intl.formatMessage(d?.label))
        .join(', ')})`;
    }
    return intl.formatMessage(getIntlObj(type));
  };
  return (
    <div className={classes.root}>
      <Helmet>
        <title>{intl.formatMessage(messages.helmetTitle)}</title>
        <meta name="description" content="Description of ManageGuests" />
      </Helmet>
      <PageHeader
        showBackButton
        title={intl.formatMessage(messages.registrationDetails)}
        onBack={backToManage}
      >
        <Buttons
          handleUpdate={handleUpdate}
          handleReregister={onReRegister}
          handleCancel={handleCancel}
          showRegister={
            (data.status === 'COMPLETE' || data.status === 'CANCELLED') &&
            scopes.create
          }
          showUpdate={
            (data.status === 'WAITING' ||
              data.status === 'ARRIVED' ||
              data.status === 'LEAVE') &&
            scopes.update
          }
          showCancel={data.status == 'WAITING' && scopes.update}
        />
      </PageHeader>
      {isLoading && <Loading />}
      <DialogCancel
        open={openCancel}
        handleClose={handleCloseCancel}
        onSuccess={onSuccessCancel}
      />
      <Paper className={classes.paper}>
        <h3 className={classes.h3}>
          {intl.formatMessage(messages.information)}
        </h3>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={4} xl={3}>
            <FormControl size="small" fullWidth margin="dense">
              <FormLabel>Mã đơn</FormLabel>
              <TextField
                className={classes.disabledInput}
                value={data?.registrationCode || ''}
                variant="outlined"
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6} lg={4} xl={3}>
            <FormControl size="small" fullWidth margin="dense">
              <FormLabel>
                {data.repeatType === 'ONCE'
                  ? intl.formatMessage(messages.startDate)
                  : 'Ngày bắt đầu'}
              </FormLabel>
              <TextField
                className={classes.disabledInput}
                value={
                  data.startDate
                    ? format(new Date(data.startDate), 'dd/MM/yyyy')
                    : ''
                }
                variant="outlined"
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
              />
            </FormControl>
          </Grid>
          {data.repeatType !== 'ONCE' ? (
            <Grid item xs={12} md={6} lg={4} xl={3}>
              <FormControl size="small" fullWidth margin="dense">
                <FormLabel>Ngày kết thúc</FormLabel>
                <TextField
                  className={classes.disabledInput}
                  value={
                    data.endDate
                      ? format(new Date(data.endDate), 'dd/MM/yyyy')
                      : ''
                  }
                  variant="outlined"
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </FormControl>
            </Grid>
          ) : null}
          <Grid item xs={12} md={6} lg={4} xl={3}>
            <FormControl size="small" fullWidth margin="dense">
              <FormLabel>{intl.formatMessage(messages.time)}</FormLabel>
              <TextField
                className={classes.disabledInput}
                value={renderTime(data.startTimeInMinute, data.endTimeInMinute)}
                variant="outlined"
                InputProps={{
                  readOnly: true,
                }}
              />
            </FormControl>
          </Grid>
          {/* <Grid item xs={12} md={6} lg={4} xl={3}>
            <FormControl size="small" fullWidth margin="dense">
              <FormLabel>{intl.formatMessage(messages.area)}</FormLabel>
              <TextField
                className={classes.disabledInput}
                value={data.areaName || ''}
                variant="outlined"
                InputProps={{
                  readOnly: true,
                }}
              />
            </FormControl>
          </Grid> */}
          <Grid item xs={12} md={6} lg={4} xl={3}>
            <FormControl size="small" fullWidth margin="dense">
              <FormLabel>{intl.formatMessage(messages.block)}</FormLabel>
              <TextField
                className={classes.disabledInput}
                value={data.blockName || ''}
                variant="outlined"
                InputProps={{
                  readOnly: true,
                }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6} lg={4} xl={3}>
            <FormControl size="small" fullWidth margin="dense">
              <FormLabel>{intl.formatMessage(messages.floor)}</FormLabel>
              <TextField
                className={classes.disabledInput}
                value={data.floorName || ''}
                variant="outlined"
                InputProps={{
                  readOnly: true,
                }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6} lg={4} xl={3}>
            <FormControl size="small" fullWidth margin="dense">
              <FormLabel>{intl.formatMessage(messages.unit)}</FormLabel>
              <TextField
                className={classes.disabledInput}
                value={data.companyName || ''}
                variant="outlined"
                InputProps={{
                  readOnly: true,
                }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6} lg={4} xl={3}>
            <FormControl size="small" fullWidth margin="dense">
              <FormLabel>{intl.formatMessage(messages.repeatType)}</FormLabel>
              <TextField
                className={classes.disabledInput}
                value={renderRepeatType(
                  data.repeatType,
                  getDayOfWeeks(data.dayOfWeeks),
                )}
                variant="outlined"
                InputProps={{
                  readOnly: true,
                }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6} lg={4} xl={3}>
            <FormControl size="small" fullWidth margin="dense">
              <FormLabel>{intl.formatMessage(messages.status)}</FormLabel>
              <TextField
                className={classes.disabledInput}
                value={
                  data.status ? intl.formatMessage(getIntlObj(data.status)) : ''
                }
                variant="outlined"
                InputProps={{
                  readOnly: true,
                }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6} lg={4} xl={3}>
            <FormControl size="small" fullWidth margin="dense">
              <FormLabel>{intl.formatMessage(messages.createdBy)}</FormLabel>
              <TextField
                className={classes.disabledInput}
                value={data.createdUsername || ''}
                variant="outlined"
                InputProps={{
                  readOnly: true,
                }}
              />
            </FormControl>
          </Grid>
          {data.status === 'CANCELLED' && (
            <>
              <Grid item xs={12} md={6} lg={4} xl={3}>
                <FormControl size="small" fullWidth margin="dense">
                  <FormLabel>
                    {intl.formatMessage(messages.canceledBy)}
                  </FormLabel>
                  <TextField
                    className={classes.disabledInput}
                    value={data.cancelledUserName || 'Không xác định'}
                    variant="outlined"
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6} lg={4} xl={3}>
                <FormControl size="small" fullWidth margin="dense">
                  <FormLabel>
                    {intl.formatMessage(messages.reasonCancel)}
                  </FormLabel>
                  <TextField
                    className={classes.disabledInput}
                    value={
                      data.cancellReason
                        ? intl.formatMessage(getIntlObj(data.cancellReason))
                        : 'Không xác định'
                    }
                    variant="outlined"
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </FormControl>
              </Grid>
            </>
          )}
          <Grid item xs={12} md={6} lg={4} xl={3}>
            <FormControl size="small" fullWidth margin="dense">
              <FormLabel>{intl.formatMessage(messages.updateTime)}</FormLabel>
              <TextField
                className={classes.disabledInput}
                value={
                  (data.updatedAt &&
                    format(new Date(data.updatedAt), 'HH:mm dd/MM/yyyy')) ||
                  ''
                }
                variant="outlined"
                InputProps={{
                  readOnly: true,
                }}
              />
            </FormControl>
          </Grid>
          {data.waitTimeBeforeCancelInMinute && (
            <Grid item xs={12} md={6} lg={4} xl={3}>
              <FormControl size="small" fullWidth margin="dense">
                <FormLabel>Thời gian hủy nếu khách không đến sau</FormLabel>
                <TextField
                  className={classes.disabledInput}
                  value={`${data.waitTimeBeforeCancelInMinute} phút`}
                  variant="outlined"
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </FormControl>
            </Grid>
          )}
        </Grid>
      </Paper>

      <TableContainer component={Paper} className={classes.paper}>
        <h3 className={classes.h3}>
          {data.guests
            ? `${intl.formatMessage(messages.addGuestTableTitle)} (${
                data.guests.length
              } ${intl.formatMessage(messages.people)})`
            : `${intl.formatMessage(messages.addGuestTableTitle)}`}
        </h3>

        <CustomTable
          data={data?.guests || []}
          disabledSelect
          row={[
            {
              caption: 'STT',
              cellRender: (item) => (
                <div style={{ textAlign: 'center' }}>{item.rowIndex + 1}</div>
              ),
              alignment: 'center',
              width: 50,
            },
            {
              dataField: 'fullName',
              caption: 'Họ & Tên',
              cellRender: (v) => (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {v.value}
                  {v.data.isRepresentation && (
                    <p
                      style={{
                        margin: 0,
                        fontSize: '13px',
                        fontWeight: 400,
                        fontStyle: 'italic',
                        color: '#1fa2f2',
                      }}
                    >
                      {intl.formatMessage(messages.representativeGuest)}
                    </p>
                  )}
                </div>
              ),
            },
            {
              dataField: 'phoneNumber',
              caption: intl.formatMessage(messages.phoneNumber),
            },
            {
              dataField: 'identityNumber',
              caption: intl.formatMessage(messages.identityNumber),
            },
            {
              dataField: 'accessCode',
              caption: 'Mã định danh',
            },
            {
              dataField: 'cards.0.updatedAt',
              dataType: 'datetime',
              format: 'HH:mm:ss dd-MM-yyyy',
              caption: 'Thời gian cấp thẻ',
            },
            {
              dataField: 'cards.0.cardNumber',
              caption: 'Mã thẻ',
            },
            {
              dataField: 'authenticationModes',
              caption: intl.formatMessage(messages.identityMethod),
              cellRender: (v) => (
                <div>
                  {v.value?.length
                    ? v.value
                        .map((au) => intl.formatMessage(getIntlObj(au)))
                        .join(', ')
                    : 'Không xác định'}
                </div>
              ),
            },
            {
              dataField: 'authenticationStatus',
              caption: intl.formatMessage(messages.identityStatus),
              cellRender: (v) => intl.formatMessage(getIntlObj(v.value)),
            },
            {
              dataField: 'faceIdentityStatus',
              caption: 'Định danh khuôn mặt',
              cellRender: ({ value }) =>
                faceIdentityStatusList[value] || 'Không xác định',
            },
            {
              caption: 'Hành động',
              cellRender: (v) => (
                <>
                  <Tooltip title="Chi tiết">
                    <IconButton
                      size="small"
                      component={Link}
                      to={`/guests/${v.data.guestId}`}
                    >
                      <InfoIcon />
                    </IconButton>
                  </Tooltip>
                  {v.data.faceIdentityStatus != 'UNIDENTIFIED' && (
                    <Tooltip title="Định danh khuôn mặt">
                      {/* <Badge
                        color="primary"
                        invisible={v.data.faceIdentityStatus != 'WAITING'}
                        variant="dot"
                      > */}
                      <IconButton
                        size="small"
                        onClick={() => onApproveFaceBtnClick(v.data)}
                      >
                        <FontAwesomeIcon icon={faIdCard} />
                      </IconButton>
                      {/* </Badge> */}
                    </Tooltip>
                  )}
                </>
              ),
            },
          ]}
        />
      </TableContainer>
      {showIdentityDetails && (
        <Dialog
          maxWidth="md"
          // fullWidth
          open={Boolean(showIdentityDetails)}
          onClose={() => setShowIdentityDetails(null)}
          title={`Thông tin khuôn mặt khách ${showIdentityDetails.fullName}`}
        >
          <DialogIdentityDetails
            data={showIdentityDetails}
            onSubmit={onCloseFaceDetails}
          />
        </Dialog>
      )}
    </div>
  );
}
