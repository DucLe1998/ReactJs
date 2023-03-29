/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { faIdCard, faImage } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Button,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@material-ui/core';
import InfoIcon from '@material-ui/icons/InfoOutlined';
import axios from 'axios';
import Label from 'components/Label';
import ModalImage from 'components/ModalImage';
import PageHeader from 'components/PageHeader';
import ShortMultiSelect from 'components/ShortMultiSelect';
import TextField from 'components/TextField';
import Loading from 'containers/Loading';
import DialogCancel from 'containers/ManageGuests/dialogs/DialogCancel';
import DialogEditVehicles from 'containers/ManageGuests/dialogs/DialogViewVehicles';
import { format } from 'date-fns';
import { get } from 'lodash';
import React, { useEffect, useState } from 'react';
import Barcode from 'react-barcode';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl';
import { Link, useParams } from 'react-router-dom';
import { min2Time } from 'utils/functions';
import { showError, showSuccess } from 'utils/toast-utils';
import { buildUrlWithToken, showAlertConfirm } from 'utils/utils';
import { API_FILE, REGISTRATION_API } from '../apiUrl';
import DialogAddCard from './dialogs/DialogAddCard';
import DialogAddIdentity from './dialogs/DialogAddIdentity';
import DialogReject from './dialogs/DialogReject';
import messages from './messages';
import {
  generateId,
  REPEAT_TYPE_MAP,
  STATUS_APPROVAL,
  STATUS_DEVICE,
  STATUS_MAP,
  WEEKDAYS,
} from './modules';
import { addGuestStyles } from './styles';
const Buttons = ({
  showRegister,
  showCancel,
  handleReregister,
  handleCancel,
  showApprove,
  handleRejectBtnClick,
  handleApproveBtnClick,
}) => {
  const intl = useIntl();
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      {showApprove && (
        <>
          <Button variant="contained" onClick={handleRejectBtnClick}>
            Từ chối
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleApproveBtnClick}
          >
            Đồng ý
          </Button>
        </>
      )}
      {showCancel && (
        <Button variant="contained" onClick={handleCancel} color="secondary">
          {intl.formatMessage(messages.cancelRegistration)}
        </Button>
      )}
      {showRegister && (
        <Button variant="contained" color="primary" onClick={handleReregister}>
          {intl.formatMessage(messages.reRegister)}
        </Button>
      )}
    </div>
  );
};
export default function DetailGuest({ history, location }) {
  // const resourceCode = 'guest-registration/registration';
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
  const intl = useIntl();
  const classes = addGuestStyles();
  const { id, from } = useParams();
  const [data, setData] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [openCancel, setOpenCancel] = useState(false);
  const [openReject, setOpenReject] = useState(false);
  const [openIdentity, setOpenIdentity] = useState(false);
  const [openCard, setOpenCard] = useState(false);
  const [tableRows, setTableRows] = useState([]);
  const [tableVehicles, setTableVehicles] = useState([]);
  const [tableApproval, setTableApproval] = useState([]);
  const [guestIndex, setGuestIndex] = useState(0);
  const [vehiclesIndex, setVehiclesIndex] = useState(0);
  const [openEditVehicles, setOpenEditVehicles] = useState(false);
  const [initialValues, setInitialValues] = useState();
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(0);
  const [checkArrived, setCheckArrived] = useState('NOT_ARRIVED');
  const userObj = JSON.parse(window.localStorage.getItem('userData') || '{}');
  const userId = userObj?.userId;

  const backToManage = () => {
    history.replace({
      pathname: `/guest-registrations${from == 'approve' ? '/approver' : ''}`,
      state: location.state,
    });
  };

  useEffect(() => {
    setLoading(true);
    axios
      .get(REGISTRATION_API.DETAILS_REGISTRATION(id))
      .then((response) => {
        const res = response.data;
        if (res.status === 'REMOVE') res.status = 'CANCELLED';
        setData(res);
        const guests = [...res.guests];
        guests.sort(compareGuests); // Khach dai dien luon luon len tren dau
        setTableRows(guests);
        const vehicles = [...res.vehicles];
        vehicles.map((x) =>
          x?.vehicleRegistrationStatus == 'ARRIVED'
            ? setCheckArrived('ARRIVED')
            : '',
        );
        setTableVehicles(vehicles);
        const approvalPresons = [...res.approvers];
        setTableApproval(
          approvalPresons.sort((x, y) => x.approvalLevel - y.approvalLevel),
        );
      })
      .catch((err) => {
        showError(err);
      })
      .finally(() => setLoading(false));
  }, [reload, id]);
  const handleCancel = () => {
    setOpenCancel(true);
  };
  const handleCloseCancel = () => {
    setOpenCancel(false);
  };
  const onSuccessCancel = () => {
    axios
      .patch(REGISTRATION_API.CANCEL(id))
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
  const onEditVehicles = (index) => {
    setInitialValues(tableVehicles[index]);
    setVehiclesIndex(index);
    setOpenEditVehicles(true);
  };
  const handleCloseEditVehicles = () => {
    setOpenEditVehicles(false);
  };
  const onSuccessEditVehicles = (values) => {
    const rows = tableRows;
    if (values.isRepresentation === true) {
      rows[0].isRepresentation = false;
      rows.splice(guestIndex, 1);
      rows.unshift(values);
    } else rows[guestIndex] = values;
    setTableVehicles([...rows]);
    setOpenEditVehicles(false);
  };

  const onReRegister = () => {
    history.push({
      pathname: `/guest-registrations/${id}/re-register`,
      state: location.state,
    });
  };

  const onAddIdentity = (index) => {
    setInitialValues(tableRows[index]);
    setGuestIndex(index);
    setOpenIdentity(true);
  };
  const handleCloseIdentity = () => {
    setOpenIdentity(false);
  };
  const onSuccessIdentity = (values) => {
    const rows = tableRows;
    rows[guestIndex].documentFileId = values;
    setTableRows([...rows]);
    setOpenIdentity(false);
  };
  const renderImage = (url) => {
    if (url) {
      return (
        <div
          onClick={() =>
            setImageUrl(
              buildUrlWithToken(`${API_FILE.DOWNLOAD_PUBLIC_API}/${url}`),
            )
          }
          style={{ cursor: 'pointer' }}
        >
          <img
            alt="anh giay to"
            style={{ maxWidth: 120 }}
            src={`${API_FILE.DOWNLOAD_PUBLIC_API}/${url}`}
          />
        </div>
      );
    }
    return null;
  };
  const onAddCard = (index) => {
    setInitialValues(tableRows[index]);
    setGuestIndex(index);
    setOpenCard(true);
  };
  const handleCloseCard = () => {
    setOpenCard(false);
  };
  const onSuccessCard = (values) => {
    const rows = tableRows;
    rows[guestIndex].cards = [values];

    setOpenCard(false);
    setTableRows([...rows]);
  };
  const onSuccessApprove = () => {
    setLoading(true);
    axios
      .patch(REGISTRATION_API.APPROVE(id))
      .then(() => {
        setReload(reload + 1);
      })
      .catch((error) => {
        showError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const onSuccessReject = (reason) => {
    setLoading(true);
    axios
      .patch(REGISTRATION_API.REJECT(id, reason))
      .then(() => {
        setReload(reload + 1);
        setOpenReject(false);
      })
      .catch((error) => {
        showError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const handleApproveBtnClick = () => {
    showAlertConfirm({
      text: 'Bạn có chắc chắn phê duyệt đơn này không?',
    }).then(({ value }) => {
      if (value) {
        onSuccessApprove();
      }
    });
  };
  const handleRejectBtnClick = () => {
    setOpenReject(true);
  };
  const handleCloseReject = () => {
    setOpenReject(false);
  };
  const statusRender = (value) => {
    const obj = STATUS_MAP[value || 'WAITING'];
    return <Label {...obj} variant="ghost" textVariant="h5" />;
  };
  const daysRender = ({ value }) => (
    <ShortMultiSelect
      disabled
      value={value}
      options={WEEKDAYS}
      displayExpr={(option) => intl.formatMessage(option.label)}
      valueExpr="value"
    />
  );
  const columns = [
    {
      dataField: 'repeatType',
      label: intl.formatMessage(messages.repeatType),
      getValue: (value) => REPEAT_TYPE_MAP[value || 'ONCE']?.value || '',
    },
    {
      dataField: 'startDate',
      label: 'Ngày bắt đầu',
      getValue: (value) => format(new Date(value), 'dd/MM/yyyy'),
    },
    {
      dataField: 'endDate',
      label: 'Ngày kết thúc',
      getValue: (value) => format(new Date(value), 'dd/MM/yyyy'),
      visible: (data) => data.repeatType != 'ONCE',
    },
    {
      dataField: 'dayOfWeeks',
      label: 'Ngày lặp lại',
      render: daysRender,
      visible: (data) => data.repeatType != 'ONCE',
    },
    {
      dataField: 'startTimeInMinute',
      label: intl.formatMessage(messages.startTime),
      getValue: (value) => format(min2Time(value), 'HH:mm'),
    },
    {
      dataField: 'endTimeInMinute',
      label: intl.formatMessage(messages.endTime),
      getValue: (value) => format(min2Time(value), 'HH:mm'),
    },
    {
      dataField: 'groupName',
      label: 'Khu vực làm việc',
    },
    {
      dataField: 'areaName',
      label: 'Đơn vị đến',
    },
    {
      dataField: 'department',
      label: 'Phòng/Ban',
    },
    {
      dataField: 'note',
      label: 'Mục đích',
    },
    {
      dataField: 'createdUsername',
      label: 'Người đăng ký',
    },
    {
      dataField: 'documentReference',
      label: 'Văn bản tham chiếu',
    },
  ];
  return (
    <>
      <Helmet>
        <title>{intl.formatMessage(messages.helmetTitle)}</title>
        <meta name="description" content="Description of ManageGuests" />
      </Helmet>
      {loading && <Loading />}
      <DialogCancel
        open={openCancel}
        handleClose={handleCloseCancel}
        onSuccess={onSuccessCancel}
      />
      <PageHeader
        showBackButton
        title={intl.formatMessage(messages.registrationDetails)}
        onBack={backToManage}
      >
        <Buttons
          handleReregister={onReRegister}
          handleCancel={handleCancel}
          showRegister={
            ['COMPLETE', 'UNSUCCESSFUL', 'CANCELLED', 'REMOVE'].includes(
              data?.status,
            ) && scopes.create
          }
          handleApproveBtnClick={handleApproveBtnClick}
          handleRejectBtnClick={handleRejectBtnClick}
          showApprove={
            data?.approvalStatusMe == 'WAITING' && data?.status == 'WAITING'
          }
          showCancel={
            data?.createdUserId == userId &&
            ['WAITING', 'APPROVED'].includes(data?.status) &&
            checkArrived != 'ARRIVED'
          }
        />
      </PageHeader>
      {data && (
        <Paper className={classes.paper}>
          <Grid
            container
            spacing={2}
            style={{
              borderBottom: '1px solid #D8D8D8',
              marginBottom: 16,
            }}
          >
            <Grid item sm={6} xs={12}>
              <Typography variant="h4" component="p">
                {intl.formatMessage(messages.information)}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Thời gian cập nhật lúc{' '}
                {format(new Date(data.updatedAt), 'HH:mm dd/MM/yyyy')}
              </Typography>
              <div
                style={{
                  marginTop: 20,
                }}
              >
                {statusRender(data.status)}
              </div>
            </Grid>
            <Grid item sm={6} xs={12} container justifyContent="flex-end">
              <Barcode value={data?.code} height={80} />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            {React.Children.toArray(
              columns.map((col) => {
                const key = col.dataField;
                const value = get(data, key);
                let visible = true;
                if (col.visible) {
                  visible = col.visible(data);
                }
                if (!visible) return null;
                return (
                  <Grid item sm={12} md={6} lg={4} xl={3}>
                    {col.render ? (
                      <TextField label={col.label}>
                        {col.render({ data, value })}
                      </TextField>
                    ) : (
                      <TextField
                        disabled
                        label={col.label}
                        value={col.getValue ? col.getValue(value) : value}
                      />
                    )}
                  </Grid>
                );
              }),
            )}
          </Grid>
        </Paper>
      )}
      <Paper className={classes.paper}>
        <Grid
          container
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
          }}
        >
          <h3 style={{ margin: 0, fontSize: '20px', lineHeight: '23px' }}>
            Danh sách khách đăng ký
            {tableRows?.length ? ` (${tableRows.length} người)` : ''}
          </h3>
        </Grid>

        <TableContainer>
          <Table
            style={{ border: '1px solid #dddddd' }}
            className={classes.table}
          >
            <TableHead>
              <TableRow className={classes.tableRow}>
                <TableCell>
                  {intl.formatMessage(messages.orderNumber)}
                </TableCell>
                <TableCell>Ảnh giấy tờ</TableCell>
                <TableCell>Mã người dùng</TableCell>
                <TableCell>Giấy tờ</TableCell>
                <TableCell>Tên khách</TableCell>
                <TableCell>Số Dt</TableCell>
                <TableCell>Địa chỉ công ty</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Mã thẻ</TableCell>
                <TableCell>Thời gian cấp thẻ</TableCell>
                <TableCell>{intl.formatMessage(messages.actions)}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableRows.map((row, index) => (
                <TableRow key={generateId()} className={classes.tableRow}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{renderImage(row?.documentFileId)}</TableCell>
                  <TableCell>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      {row.accessCode}
                      {row.isRepresentation && (
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
                  </TableCell>
                  <TableCell>{row.identityNumber}</TableCell>
                  <TableCell>{row.fullName}</TableCell>
                  <TableCell>{row.phoneNumber}</TableCell>
                  <TableCell>{row.address}</TableCell>
                  <TableCell>
                    {STATUS_DEVICE[row.guestRegistrationStatus]}
                  </TableCell>
                  <TableCell>
                    {row?.cards &&
                      row.cards.map((x) => <div>{x?.cardNumber}</div>)}
                  </TableCell>
                  <TableCell>
                    {row?.cards &&
                      row.cards.map((x) => (
                        <div>
                          {x?.assignAt
                            ? format(new Date(x?.assignAt), 'HH:mm dd/MM/yyyy')
                            : ''}
                        </div>
                      ))}
                  </TableCell>
                  <TableCell>
                    {row.guestId && (
                      <>
                        <Tooltip title="Ảnh giấy tờ">
                          <IconButton
                            size="small"
                            onClick={() => onAddIdentity(index)}
                          >
                            <FontAwesomeIcon icon={faImage} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Định danh thẻ">
                          <IconButton
                            size="small"
                            onClick={() => onAddCard(index)}
                          >
                            <FontAwesomeIcon icon={faIdCard} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Chi tiết">
                          <IconButton
                            size="small"
                            component={Link}
                            to={`/guests/${row.guestId}`}
                          >
                            <InfoIcon />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Paper className={classes.paper}>
        <Grid
          container
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
          }}
        >
          <h3 style={{ margin: 0, fontSize: '20px', lineHeight: '23px' }}>
            Thông tin xe
            {tableVehicles?.length ? ` (${tableVehicles.length} xe)` : ''}
          </h3>
          <Grid
            item
            xs={4}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}
          ></Grid>
        </Grid>

        <TableContainer>
          <Table
            style={{ border: '1px solid #dddddd' }}
            className={classes.table}
          >
            <TableHead>
              <TableRow className={classes.tableRow}>
                <TableCell>
                  {intl.formatMessage(messages.orderNumber)}
                </TableCell>
                <TableCell>Tên xe</TableCell>
                <TableCell>Biển số</TableCell>
                <TableCell>Tên lái xe</TableCell>
                <TableCell>ID thiết bị</TableCell>
                <TableCell>Trạng thái thiết bị</TableCell>
                <TableCell>{intl.formatMessage(messages.actions)}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableVehicles.map((row, index) => (
                <TableRow key={generateId()} className={classes.tableRow}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      {row.vehicleName}
                    </div>
                  </TableCell>
                  <TableCell>{row.numberPlate}</TableCell>
                  <TableCell>{row?.guestInfo?.name}</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  
                  <TableCell>
                    <Tooltip title="Chi tiết">
                      <IconButton
                        size="small"
                        // component={Link}
                        onClick={() => onEditVehicles(index)}
                      >
                        <InfoIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Paper className={classes.paper}>
        <Grid
          container
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
          }}
        >
          <h3 style={{ margin: 0, fontSize: '20px', lineHeight: '23px' }}>
            Thông tin người phê duyệt
            {tableApproval?.length ? ` (${tableApproval.length} người)` : ''}
          </h3>
          <Grid
            item
            xs={4}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}
          ></Grid>
        </Grid>

        <TableContainer>
          <Table
            style={{ border: '1px solid #dddddd' }}
            className={classes.table}
          >
            <TableHead>
              <TableRow className={classes.tableRow}>
                <TableCell>
                  {intl.formatMessage(messages.orderNumber)}
                </TableCell>
                <TableCell>Tên</TableCell>
                <TableCell>Tên tài khoản</TableCell>
                <TableCell>Chức vụ</TableCell>
                <TableCell>Đơn vị</TableCell>
                <TableCell>Trạng thái phê duyệt</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableApproval.map((row, index) => (
                <TableRow key={generateId()} className={classes.tableRow}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{row?.fullName}</TableCell>
                  <TableCell>{row?.username}</TableCell>
                  <TableCell>{row?.positionName}</TableCell>
                  <TableCell>{row?.groupName}</TableCell>
                  <TableCell>{STATUS_APPROVAL[row?.approvalStatus]}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      {openIdentity && (
        <DialogAddIdentity
          open={openIdentity}
          handleClose={handleCloseIdentity}
          onSuccess={onSuccessIdentity}
          guestsData={tableRows}
          initialValues={initialValues}
          guestIndex={guestIndex}
        />
      )}
      <DialogEditVehicles
        open={openEditVehicles}
        handleClose={handleCloseEditVehicles}
        onSuccess={onSuccessEditVehicles}
        guestsData={tableVehicles}
        initialValues={initialValues}
        guestIndex={vehiclesIndex}
        guest={tableRows}
        registrationCode={data?.code}
      />

      {openCard && (
        <DialogAddCard
          open={openCard}
          handleClose={handleCloseCard}
          onSuccess={onSuccessCard}
          guestsData={tableRows}
          guestIndex={guestIndex}
        />
      )}
      {imageUrl && (
        <ModalImage
          onClose={() => {
            setImageUrl(null);
          }}
          imageUrl={buildUrlWithToken(imageUrl)}
        />
      )}
      <DialogReject
        open={openReject}
        handleClose={handleCloseReject}
        onSuccess={(data) => onSuccessReject(data)}
      />
    </>
  );
}

const compareGuests = (firstGuest, secondGuest) => {
  if (firstGuest?.isRepresentation) {
    return -1;
  }
  if (secondGuest?.isRepresentation) {
    return 1;
  }
  return 0;
};
