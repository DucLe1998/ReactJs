/* eslint-disable react/no-this-in-sfc */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  ListItemText,
  Paper,
  Popover,
  Radio,
  RadioGroup,
  Slider,
} from '@material-ui/core';
import axios from 'axios';
import DatePicker from 'components/DatePicker';
import Dialog from 'components/Dialog';
import Autocomplete from 'components/MultiAutocomplete';
import PageHeader from 'components/PageHeader';
import ShortMultiSelect from 'components/ShortMultiSelect';
import TableCustom from 'components/TableCustom';
import TreeSelect from 'components/TreeSelect';
import VAutocomplete from 'components/VAutocomplete';
import Loading from 'containers/Loading';
import DialogImport from 'containers/ManageGuests/dialogs/DialogImport';
import {
  add,
  eachDayOfInterval,
  isAfter,
  isSameDay,
  startOfDay,
} from 'date-fns';
import DxButton from 'devextreme-react/button';
import {
  Column,
  Item,
  RequiredRule,
  Toolbar,
} from 'devextreme-react/data-grid';
import { TextBox } from 'devextreme-react/text-box';
import { useFormik } from 'formik';
import WarningImg from 'images/warning.svg';
import { uniq } from 'lodash';
import React, { useEffect, useMemo, useState, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import Swal from 'sweetalert2';
import { getApi } from 'utils/requestUtils';
import { showError, showSuccess } from 'utils/toast-utils';
import { showAlertConfirm } from 'utils/utils';
import * as yup from 'yup';
import PointEditor from './pointEditor';
import {
  API_IAM,
  GUEST_REGISTRATION,
  IAM_API_SRC,
  NAVIGATION_API,
  SAP_API,
} from '../apiUrl';
import AddGuestPopover from './dialogs/addGuest';
import EditGuest from './dialogs/editGuest';
import messages from './messages';
import { formatDate, WEEKDAYS } from './modules';
import { addGuestStyles } from './styles';
const DAYS_OF_WEEK = [
  'SUNDAY',
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
];
const marks = [0, 4, 8, 12, 16, 20, 24].map((t) => ({
  label: `${t}H`,
  value: t,
}));
function Buttons({ handleCancel, action, disabled }) {
  const intl = useIntl();

  return (
    <div style={{ display: 'flex', gap: 16 }}>
      {action !== 'add' && (
        <Button variant="contained" onClick={handleCancel}>
          Hủy
        </Button>
      )}

      <Button
        type="submit"
        disabled={disabled}
        variant="contained"
        color="primary"
      >
        {action === 'update'
          ? intl.formatMessage(messages.saveChanges)
          : action === 're-register'
          ? intl.formatMessage(messages.reRegister)
          : 'Đăng ký'}
      </Button>
    </div>
  );
}

export default function AddGuest({ history, location }) {
  const classes = addGuestStyles();
  const intl = useIntl();
  const { id, action } = useParams();
  const [openDialogImport, setOpenDialogImport] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState(null);
  const vehicleList = useRef({});
  const [anchorEl, setAnchorEl] = useState(null);
  const defaultNew = {
    repeatType: 'ONCE',
    dayOfWeeks: [],
    area: null,
    block: null,
    floor: null,
    company: null,
    startDate: new Date(),
    endDate: null,
    group: null,
    groupId: null,
    areaId: null,
    note: null,
    documentReference: null,
    // startTimeInMinute: 0,
    // endTimeInMinute: 0,
    timeRange: [8, 20],
    guests: [],
    vehicles: [],
    approvalPersons: [],
  };
  const validationSchema = yup.object().shape({
    dayOfWeeks: yup.array().when('repeatType', {
      is: (repeatType) => repeatType == 'WEEKLY',
      then: yup.array().min(1, 'Cần lựa chọn tối thiểu 1'),
    }),
    area: yup
      .mixed()
      .required(intl.formatMessage({ id: 'app.invalid.required' })),
    group: yup
      .mixed()
      .required(intl.formatMessage({ id: 'app.invalid.required' })),
    startDate: yup
      .date()
      .nullable()
      .required(intl.formatMessage({ id: 'app.invalid.required' }))
      .min(startOfDay(new Date()), 'Ngày bắt đầu không được là quá khứ'),
    endDate: yup.mixed().when('repeatType', (repeatType) => {
      if (repeatType == 'DAILY') {
        return yup
          .date()
          .nullable()
          .required(intl.formatMessage({ id: 'app.invalid.required' }))
          .test(
            'greater than 1',
            'Ngày kết thúc phải lớn hơn ngày bắt đầu',
            function valid(value) {
              const { startDate } = this.parent;
              return isAfter(value, startDate) && !isSameDay(value, startDate);
            },
          );
      }
      if (repeatType == 'WEEKLY') {
        return yup
          .date()
          .nullable()
          .required(intl.formatMessage({ id: 'app.invalid.required' }));
      }
      return yup.date().nullable();
    }),
    // guests: yup.array().min(1, 'Đăng ký tối thiểu 1 khách'),
    // approvalPersons: yup.array().min(1, 'Tối thiểu 1 người phê duyệt'),
    // startTime: yup
    //   .date()
    //   .required(intl.formatMessage({ id: 'app.invalid.required' }))
    //   .nullable(),
    // endTime: yup
    //   .date()
    //   .required(intl.formatMessage({ id: 'app.invalid.required' }))
    //   .nullable()
    //   .test(
    //     'greater time',
    //     'Thời gian kết thúc phải lớn hơn thời gian bắt đầu',
    //     function valid(value) {
    //       const { startTime } = this.parent;
    //       return value.getTime() > startTime.getTime();
    //     },
    //   ),
    note: yup
      .string()
      .nullable()
      .required(intl.formatMessage({ id: 'app.invalid.required' })),
  });
  const formik = useFormik({
    initialValues: defaultNew,
    validationSchema,
    onSubmit: (values) => onSubmitForm(values),
  });

  const backToManage = () => {
    history.replace({
      pathname: '/guest-registrations',
      state: location.state,
    });
  };

  useEffect(() => {
    // getApi(`${NAVIGATION_API.TYPE_OF_CAR}`)
    //   .then((result) => {
    //     const map = result.data.reduce(
    //       (total, cur) => ({
    //         ...total,
    //         [cur.id]: cur,
    //       }),
    //       {},
    //     );
    //     vehicleList.current = map;
    //   })
    //   .catch((err) => showError(err));
    if (action === undefined) return;
    setLoading(true);

    getApi(`${GUEST_REGISTRATION}/registrations/${id}`)
      .then((response) => {
        const res = response.data;
        if (res.status === 'REMOVE') res.status = 'CANCELLED';
        formik.resetForm({ values: getResetFormObj(res) });
      })
      .catch((err) => {
        showError(err);
      })
      .finally(() => setLoading(false));
  }, []);

  const getResetFormObj = (detailsData) => ({
    startDate: new Date(detailsData.startDate),
    endDate:
      detailsData.endDate && detailsData.repeatType == 'WEEKLY'
        ? new Date(detailsData.endDate)
        : null,
    timeRange: [
      detailsData.startTimeInMinute / 60,
      detailsData.endTimeInMinute / 60,
    ],
    area: { areaName: detailsData.areaName, id: detailsData.areaId },
    group: {
      groupName: detailsData.groupName,
      groupId: detailsData.groupId,
    },
    company: {
      orgUnitName: detailsData.companyName,
      orgUnitId: detailsData.companyId,
    },
    department: detailsData.department,
    repeatType: detailsData.repeatType,
    dayOfWeeks: detailsData.dayOfWeeks,
    note: detailsData.note,
    documentReference: detailsData.documentReference,
    guests: detailsData.guests.map((x) => ({
      ...x,
      id: x.guestId,
    })),
    vehicles: detailsData.vehicles.map((x) => ({
      ...x,
      // typeOfCar: {
      //   id: x?.typeOfCarId,
      //   name: x?.typeOfCarName,
      // },
    })),
    approvalPersons: detailsData.approvers
      .sort((x, y) => x.approvalLevel - y.approvalLevel)
      .map((x) => ({
        users: {
          ...x,
          positionName: x?.positionName,
          mainGroupName: x?.groupName,
        },
      })),
  });
  const alert72Hours = (callback) =>
    Swal.fire({
      text: 'Thời hạn đăng ký quá 72 tiếng, bạn cần đăng ký để cấp thẻ lâu dài.',
      imageUrl: WarningImg,
      imageWidth: 150,
      showCancelButton: false,
      showCloseButton: true,
      showConfirmButton: true,
      focusConfirm: true,
      confirmButtonText: 'Đóng',
      customClass: {
        content: 'content-class',
        confirmButton: 'swal-btn-confirm',
      },
    }).then(() => callback());

  const onSubmitForm = async (data) => {
    if (loading) return;
    if (data.guests.length <= 0) {
      showError('Đăng ký tối thiểu 1 khách');
      return;
    }
    if (data.approvalPersons.length <= 0) {
      showError('Tối thiếu 1 người phê duyệt');
      return;
    }
    const check72Hours = await new Promise((resolved) => {
      if (data.repeatType == 'ONCE') {
        resolved(true);
      }
      if (data.dayOfWeeks.length >= 3) {
        alert72Hours(() => {
          resolved(true);
        });
      }
      const eachDayOfRange = eachDayOfInterval({
        start: data.startDate,
        end: data.endDate,
      });
      const count = eachDayOfRange.reduce((total, cur) => {
        const d = DAYS_OF_WEEK[cur.getDay()];
        if (data.dayOfWeeks.includes(d)) {
          return total + 1;
        }
        return total;
      }, 0);
      if (count >= 3) {
        alert72Hours(() => {
          resolved(true);
        });
      } else resolved(true);
    });
    if (check72Hours) {
      const dataSend = {
        repeatType: data.repeatType,
        dayOfWeeks: data.dayOfWeeks,
        areaId: data?.area?.id,
        groupId: data?.group?.groupId,
        note: data.note,
        documentReference: data?.documentReference,
        companyId: data?.company?.orgUnitId,
        startDate: formatDate(data.startDate),
        endDate: data.endDate
          ? formatDate(data.endDate)
          : formatDate(data.startDate),
        guests: data.guests.map((x) => ({
          ...x,
          guestId: x?.id,
        })),
        startTimeInMinute: data.timeRange[0] * 60,
        endTimeInMinute: data.timeRange[1] * 60,
        vehicles:
          data.vehicles.length > 0
            ? data.vehicles.map((x) => ({
                guestId: x?.guestInfo?.id,
                numberPlate: x?.numberPlate.toUpperCase(),
                // typeOfCarId: x?.typeOfCar?.id,
                vehicleName: x?.vehicleName,
                // allowedVehicleRoutes: x?.allowedVehicleRoutes || [],
              }))
            : [],
        approvalPersons: data.approvalPersons.map((item, index) => ({
          approvalLevel: index + 1,
          ...item?.users,
        })),
        department: data?.department,
      };
      setLoading(true);
      if (action === 'update') {
        axios
          .put(`${GUEST_REGISTRATION}/registrations/${id}`, dataSend)
          .then(() => {
            history.replace(`/guest-registrations/${id}`);
            showSuccess('Cập nhật thành công', {
              text: 'Cập nhật yêu cầu đăng ký khách thành công',
            });
          })
          .catch((error) => {
            showError(error);
          })
          .finally(() => setLoading(false));
      } else {
        axios
          .post(`${GUEST_REGISTRATION}/registrations`, dataSend)
          .then(() => {
            history.replace('/guest-registrations');
            showSuccess('Đăng ký thành công', {
              text: 'Yêu cầu đăng ký khách được tạo',
            });
          })
          .catch((error) => {
            showError(error);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    }
  };
  const isDisableDayOfWeekOption = (option) => {
    const { startDate, endDate } = formik.values;
    if (!endDate) return false;
    // ngay bat dau > ngay ket thuc => data dang sai => disable het khong cho chon thu trong tuan
    if (isAfter(startOfDay(startDate), startOfDay(endDate))) {
      return true;
    }
    const eachDayOfRange = eachDayOfInterval({
      start: startDate,
      end: endDate,
    });
    // range date >= 7  => thoa man dieu kien => ko disable
    if (eachDayOfRange.length >= 7) {
      return false;
    }

    return !eachDayOfRange.some(
      (day) => DAYS_OF_WEEK[day.getDay()] == option.value,
    );
  };
  const onInitApproval = (e) => {
    e.data = {
      users: null,
    };
  };
  const onInitVehicles = (e) => {
    e.data = {
      vehicleName: null,
      numberPlate: null,
      typeOfCar: null,
      guestInfo: null,
      allowedVehicleRoutes: [],
      accessDennyVehicleRoutes: [],
    };
  };

  const handleSuccessImport = (ret) => {
    if (ret) {
      const data = ret.map((d) => ({
        ...d,
        isRepresentation: false,
      }));
      const oldData = formik.values.guests.filter((item) => {
        const foundIndex = data.findIndex((d) => d.id == item.id);
        return foundIndex < 0;
      });
      const newGuest = [...oldData, ...data];
      if (newGuest) {
        const flagRepresentation = newGuest.findIndex(
          (g) => g.isRepresentation,
        );
        if (flagRepresentation < 0) {
          newGuest[0].isRepresentation = true;
        }
        formik.setFieldValue('guests', newGuest);
      }
    }
  };
  const onDeleteGuestBtnClick = (data) => {
    showAlertConfirm({
      text: data?.isRepresentation
        ? `Khách ${data.fullName} hiện đang là khách đại diện. Nếu xóa khách này, vai trò đại diện sẽ được chuyển cho người khác.`
        : `Bạn có chắc chắn muốn xóa khách ${data.fullName}?`,
    }).then(({ value }) => {
      if (value) {
        const found = formik.values.vehicles.find(
          (v) => v.guestInfo.id == data.id,
        );
        if (found) {
          showError(
            'Khách này có vai trò lái xe, cần chọn khách khác làm lái xe trước khi xóa',
          );
          return;
        }
        const guestList = formik.values.guests.filter((g) => g.id != data.id);
        if (data?.isRepresentation && guestList.length > 0) {
          guestList[0].isRepresentation = true;
          formik.setFieldValue('guests', guestList);
        }
        formik.setFieldValue('guests', guestList);
      }
    });
  };
  const handleEditDialogClose = (ret) => {
    if (ret) {
      const guestList = [...formik.values.guests];
      guestList[selectedGuest.rowIndex] = ret;
      formik.setFieldValue('guests', guestList);
      setSelectedGuest(null);
    } else {
      setSelectedGuest(null);
    }
  };
  const editDialog = selectedGuest && (
    <Dialog
      open={Boolean(selectedGuest)}
      onClose={() => handleEditDialogClose(0)}
      title="Chỉnh sửa thông tin khách"
      fullWidth
      maxWidth="sm"
    >
      <EditGuest data={selectedGuest.data} onSubmit={handleEditDialogClose} />
    </Dialog>
  );
  const onEditGuestBtnClick = (row) => {
    setSelectedGuest(row);
  };
  const onRowUpdating = (e) => {
    e.cancel = true;
    e.component.cancelEditData();
    if (e.newData.isRepresentation == true) {
      const guestList = formik.values.guests.map((g) => ({
        ...g,
        isRepresentation: g.id == e.key.id,
      }));
      formik.setFieldValue('guests', guestList);
    }
  };
  const guestLocalCell = ({ data }) => {
    const onValueChanged = (e, value) => {
      data.setValue(value);
      data.component.cellValue(data.rowIndex, 'guestInfo', value);
      data.component.closeEditCell();
    };
    return (
      <Autocomplete
        multiple={false}
        value={data.value}
        fullWidth
        getOptionLabel={(option) => option?.fullName || option?.name || ''}
        getOptionSelected={(option, selected) => option.id == selected.id}
        getOptionDisabled={(option) => {
          const index = formik.values.vehicles.findIndex(
            (v) => v.guestInfo.id == option.id,
          );
          return index >= 0;
        }}
        options={[...formik.values.guests]}
        onChange={onValueChanged}
        placeholder="Chọn người lái xe"
        disableClearable
      />
    );
  };
  const typeOfCarCell = ({ data }) => {
    const onValueChanged = (e, value) => {
      data.setValue(value);
      data.component.cellValue(data.rowIndex, 'typeOfCar', value);
      data.component.cellValue(data.rowIndex, 'allowedVehicleRoutes', []);
      data.component.closeEditCell();
    };
    return (
      <Autocomplete
        value={data.value}
        fullWidth
        disableClearable
        multiple={false}
        options={Object.values(vehicleList.current)}
        getOptionLabel={(option) => option?.name || ''}
        getOptionSelected={(option, selected) => option.id == selected.id}
        onChange={onValueChanged}
        placeholder="Chọn loại xe"
      />
    );
  };
  const allowedVehicleRender = (container, options) => {
    const noBreakSpace = '\u00A0';
    const text = (options.value || [])
      .map((element) => element?.pointName)
      .join(', ');
    container.textContent = text || noBreakSpace;
    container.title = text;
  };
  const allowedVehicleCell = ({ data }) => {
    const { typeOfCar } = data.data;
    const onValueChanged = (newVal) => {
      data.setValue(newVal);
      data.component.closeEditCell();
    };
    return (
      <PointEditor
        value={data.value}
        onChange={onValueChanged}
        loadData={(signal) =>
          new Promise((resolve, reject) => {
            const routes =
              vehicleList.current[typeOfCar.id]?.allowedVehicleRoutes;
            if (routes) {
              resolve(routes);
            } else {
              getApi(
                NAVIGATION_API.ALLOWED_POINTS(typeOfCar.id),
                {},
                { signal },
              )
                .then((result) => {
                  const rows = result.data.map((d) => ({
                    ...d,
                    pointId: d.id,
                    pointName: d.name,
                  }));
                  vehicleList.current[typeOfCar.id].allowedVehicleRoutes = rows;
                  resolve(rows);
                })
                .catch((err) => reject(err));
            }
          })
        }
      />
    );
  };
  const searchUser = (data) => {
    const list = [...formik.values.approvalPersons];
    const onValueChanged = (e, value) => {
      data.setValue(value);
      // data.component.cellValue(data.rowIndex, 'users', value);
      data.component.closeEditCell();
    };
    return (
      <VAutocomplete
        value={data.value}
        fullWidth
        itemSize={85}
        disableClearable
        getOptionLabel={(option) =>
          [option?.fullName, option?.username].join('/') || ''
        }
        getOptionSelected={(option, value) => option.userId == value.userId}
        getOptionDisabled={(option) => {
          const index = list.findIndex((d) => d.users.userId == option.userId);
          return index >= 0;
        }}
        renderOption={(option) => (
          <ListItemText
            primary={option.fullName || ''}
            secondary={`(${option.username})${
              option?.userGroup[0]?.positionName
                ? option?.userGroup[0]?.positionName
                : ''
            }`}
          />
        )}
        loadData={(page, keyword, signal) =>
          new Promise((resolve, reject) => {
            getApi(
              `${IAM_API_SRC}/users/search`,
              {
                limit: 50,
                page,
                keyword,
                isLeader: true,
              },
              { signal },
            )
              .then((result) => {
                resolve({
                  data: result.data?.rows,
                  totalCount: result.data?.count,
                });
              })
              .catch((err) => reject(err));
          })
        }
        onChange={onValueChanged}
        placeholder="Chọn người phê duyệt"
      />
    );
  };
  const orderCell = ({ rowIndex, component }) =>
    rowIndex + component.pageIndex() * component.pageSize() + 1;
  const approvalCol = [
    {
      caption: 'STT',
      cellRender: orderCell,
      width: 40,
      allowEditing: false,
    },
    {
      dataField: 'users',
      caption: 'Tên/Tên tài khoản',
      cellRender: ({ value }) => [value?.fullName, value?.username].join`/`,
      editCellRender: searchUser,
      required: true,
    },
    {
      dataField: 'users.userGroup[0].positionName',
      caption: 'Chức vụ',
      allowEditing: false,
    },
    {
      dataField: 'users.mainGroupName',
      caption: 'Đơn vị',
      allowEditing: false,
    },
    // {
    //   // cellRender: actionRender,
    //   headerCellRender: headerRenderApproval,
    //   alignment: 'center',
    //   width: 180,
    // },
  ];
  const vehiclesCol = [
    {
      caption: 'STT',
      cellRender: orderCell,
      minWidth: 40,
      width: 'auto',
    },
    {
      dataField: 'vehicleName',
      caption: 'Tên xe',
      minWidth: 180,
      width: 'auto',
    },
    {
      dataField: 'numberPlate',
      caption: 'Biển số',
      minWidth: 180,
      required: true,
      width: 'auto',
    },
    // {
    //   dataField: 'typeOfCar',
    //   caption: 'Loại xe',
    //   cellRender: ({ value }) => value?.name,
    //   editCellComponent: typeOfCarCell,
    //   minWidth: 180,
    //   required: true,
    //   width: 'auto',
    // },
    {
      dataField: 'guestInfo',
      caption: 'Tên lái xe',
      cellRender: ({ value }) => value?.fullName || value?.name || '',
      editCellComponent: guestLocalCell,
      minWidth: 180,
      required: true,
      width: 'auto',
    },
    // {
    //   dataField: 'allowedVehicleRoutes',
    //   caption: 'Điểm dừng',
    //   cellTemplate: allowedVehicleRender,
    //   editCellComponent: allowedVehicleCell,
    //   width: 200,
    //   minWidth: 200,
    //   required: true,
    // },
    // {
    //   // cellRender: actionRender,
    //   headerCellRender: headerRenderVehicle,
    //   alignment: 'center',
    //   width: 120,
    // },
  ];
  const guestsCol = [
    {
      // dataField: 'guestLocalId',
      caption: 'STT',
      cellRender: orderCell,
      width: 40,
      allowEditing: false,
    },
    {
      dataField: 'identityNumber',
      caption: 'Số giấy tờ',
      allowEditing: false,
      // width: 'auto',
      minWidth: 120,
    },
    {
      dataField: 'fullName',
      caption: 'Tên khách',
      // width: 'auto',
      minWidth: 120,
      allowEditing: false,
      required: true,
    },
    {
      dataField: 'phoneNumber',
      caption: 'Số điện thoại',
      minWidth: 160,
      // width: 'auto',
      allowEditing: false,
      required: true,
    },
    {
      dataField: 'address',
      caption: 'Địa chỉ/Công ty',
      minWidth: 140,
      // width: 'auto',
      allowEditing: false,
    },
    {
      dataField: 'isRepresentation',
      caption: 'Là khách đại diện',
      minWidth: 140,
      // cellRender: represenCell,
      dataType: 'boolean',
    },
    {
      // cellRender: actionRender,
      // headerCellRender: headerRenderGuest,
      type: 'buttons',
      buttons: [
        {
          hint: 'Sửa',
          icon: 'edit',
          onClick: ({ row }) => onEditGuestBtnClick(row),
        },
        {
          hint: 'Xóa',
          icon: 'trash',
          onClick: ({ row }) => {
            onDeleteGuestBtnClick(row.data);
          },
        },
      ],
      alignment: 'center',
      width: 120,
    },
  ];
  const TableGuest = useMemo(
    () => (
      <TableCustom
        hideTable={false}
        data={formik.values.guests}
        repaintChangesOnly
        // onRowRemoved={onRowRemoved}
        onRowUpdating={onRowUpdating}
        // onSaving={onSavingGuest}
        editing={{
          mode: 'cell',
          allowUpdating: true,
          // allowDeleting: true,
          // allowAdding: true,
          // useIcons: true,
          newRowPosition: 'last',
        }}
        pagingProps={{ enabled: true, pageSize: 20 }}
        // onInitNewRow={onInitGuests}
        // columns={guestsCol}
      >
        {React.Children.toArray(
          guestsCol.map((defs) => (
            <Column {...defs}>{defs?.required && <RequiredRule />}</Column>
          )),
        )}
        <Toolbar>
          <Item location="before" text="Thông tin khách" />
          <Item>
            <DxButton
              icon="add"
              hint="Thêm khách"
              onClick={({ event }) => {
                setAnchorEl(event.originalEvent.currentTarget);
              }}
            />
          </Item>
          <Item>
            <DxButton
              icon="file"
              hint="Tải lên danh sách"
              onClick={() => setOpenDialogImport(true)}
            />
          </Item>
        </Toolbar>
      </TableCustom>
    ),
    [formik.values.guests],
  );
  const TableVehicle = (
    <TableCustom
      hideTable={false}
      data={formik.values.vehicles}
      editing={{
        mode: 'cell',
        allowAdding: true,
        allowUpdating: true,
        allowDeleting: true,
        useIcons: true,
        newRowPosition: 'last',
      }}
      pagingProps={{ enabled: true, pageSize: 20 }}
      onInitNewRow={onInitVehicles}
      // columns={vehiclesCol}
    >
      {React.Children.toArray(
        vehiclesCol.map((defs) => (
          <Column {...defs}>{defs?.required && <RequiredRule />}</Column>
        )),
      )}
      <Toolbar>
        <Item location="before" text="Thông tin xe" />
        <Item name="addRowButton" />
      </Toolbar>
    </TableCustom>
  );
  const tableApprover = useMemo(
    () => (
      <TableCustom
        hideTable={false}
        data={formik.values.approvalPersons}
        editing={{
          mode: 'cell',
          allowAdding: true,
          allowUpdating: true,
          allowDeleting: true,
          useIcons: true,
          newRowPosition: 'last',
        }}
        pagingProps={{ enabled: true, pageSize: 20 }}
        onInitNewRow={onInitApproval}
        // columns={approvalCol}
      >
        {React.Children.toArray(
          approvalCol.map((defs) => (
            <Column {...defs}>{defs?.required && <RequiredRule />}</Column>
          )),
        )}
        <Toolbar>
          <Item location="before" text="Thông tin người phê duyệt" />
          <Item name="addRowButton" />
        </Toolbar>
      </TableCustom>
    ),
    [formik.values.approvalPersons],
  );
  const onAddGuest = (ret) => {
    if (ret) {
      const guestList = [
        ...formik.values.guests,
        ...ret.map((item) => ({ ...item, isRepresentation: false })),
      ];
      const flagRepresentation = guestList.some((g) => g.isRepresentation);
      if (!flagRepresentation) {
        guestList[0].isRepresentation = true;
      }
      setAnchorEl(null);
      formik.setFieldValue('guests', guestList);
    } else setAnchorEl(null);
  };
  return (
    <div className={classes.root}>
      <Helmet>
        <title>{intl.formatMessage(messages.helmetTitle)}</title>
        <meta name="description" content="Description of ManageGuests" />
      </Helmet>
      {loading && <Loading />}
      <form onSubmit={formik.handleSubmit} id="app-manageguests-addguests">
        <PageHeader
          title={
            action === undefined
              ? intl.formatMessage(messages.addGuestsHeader)
              : action === 'update'
              ? intl.formatMessage(messages.updateRegistration)
              : intl.formatMessage(messages.reRegisterHeader)
          }
          showBackButton
          onBack={backToManage}
        >
          <Buttons
            handleCancel={() => history.goBack()}
            action={action}
            disabled={loading}
          />
        </PageHeader>
        <Paper className={classes.paper}>
          <h3 className={classes.h3}>
            {intl.formatMessage(messages.information)}
          </h3>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <FormControl size="small" fullWidth margin="dense">
                <FormLabel>{intl.formatMessage(messages.repeatType)}</FormLabel>
                <RadioGroup
                  value={formik.values.repeatType}
                  name="repeatType"
                  onChange={(e) => {
                    if (
                      e.target.value != formik.values.repeatType &&
                      e.target.value == 'ONCE'
                    ) {
                      formik.setFieldValue('endDate', null);
                      formik.setFieldValue('dayOfWeeks', []);
                    }
                    formik.setFieldValue('repeatType', e.target.value);
                  }}
                  row
                >
                  <FormControlLabel
                    value="ONCE"
                    control={<Radio color="primary" />}
                    label="Một lần"
                  />
                  <FormControlLabel
                    value="WEEKLY"
                    control={<Radio color="primary" />}
                    label="Lặp lại"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl
                size="small"
                fullWidth
                margin="dense"
                error={
                  formik.touched.startDate && Boolean(formik.errors.startDate)
                }
              >
                <FormLabel>Ngày bắt đầu</FormLabel>
                <DatePicker
                  placeholder="dd/MM/yyyy"
                  disablePast
                  autoOk
                  onChange={(e) => {
                    formik.setFieldValue('startDate', e);
                    const { endDate, repeatType } = formik.values;
                    if (repeatType == 'WEEKLY') {
                      if (isAfter(startOfDay(e), startOfDay(endDate))) {
                        formik.setFieldValue('dayOfWeeks', []);
                      } else {
                        const eachDayOfRange = eachDayOfInterval({
                          start: e,
                          end: endDate,
                        });
                        const days = uniq(
                          eachDayOfRange.map((d) => DAYS_OF_WEEK[d.getDay()]),
                        );
                        formik.setFieldValue('dayOfWeeks', days);
                      }
                    }
                  }}
                  value={formik.values.startDate}
                  error={
                    formik.touched.startDate && Boolean(formik.errors.startDate)
                  }
                  helperText={
                    formik.touched.startDate && formik.errors.startDate
                  }
                />
              </FormControl>
            </Grid>
            {formik.values.repeatType != 'ONCE' && (
              <Grid item xs={4}>
                <FormControl
                  size="small"
                  fullWidth
                  margin="dense"
                  error={
                    formik.touched.endDate && Boolean(formik.errors.endDate)
                  }
                >
                  <FormLabel required>Ngày kết thúc</FormLabel>
                  <DatePicker
                    autoOk
                    placeholder="dd/MM/yyyy"
                    minDate={add(formik.values.startDate, {
                      days: 1,
                    })}
                    onChange={(e) => {
                      formik.setFieldValue('endDate', e);
                      const { startDate, repeatType } = formik.values;
                      if (repeatType == 'WEEKLY') {
                        if (isAfter(startOfDay(startDate), startOfDay(e))) {
                          formik.setFieldValue('dayOfWeeks', []);
                        } else {
                          const eachDayOfRange = eachDayOfInterval({
                            start: startDate,
                            end: e,
                          });
                          const days = uniq(
                            eachDayOfRange.map((d) => DAYS_OF_WEEK[d.getDay()]),
                          );
                          formik.setFieldValue('dayOfWeeks', days);
                        }
                      }
                    }}
                    value={formik.values.endDate}
                    error={
                      formik.touched.endDate && Boolean(formik.errors.endDate)
                    }
                    helperText={formik.touched.endDate && formik.errors.endDate}
                  />
                </FormControl>
              </Grid>
            )}
            {formik.values.repeatType === 'WEEKLY' && (
              <Grid item xs={4}>
                <FormControl
                  size="small"
                  fullWidth
                  margin="dense"
                  error={
                    formik.touched.dayOfWeeks &&
                    Boolean(formik.errors.dayOfWeeks)
                  }
                >
                  <FormLabel required>Ngày lặp lại</FormLabel>
                  <div style={{ height: '40px', display: 'flex' }}>
                    <ShortMultiSelect
                      options={WEEKDAYS}
                      displayExpr={(option) => intl.formatMessage(option.label)}
                      valueExpr="value"
                      getOptionDisabled={isDisableDayOfWeekOption}
                      value={formik.values.dayOfWeeks}
                      onChange={(e) => {
                        formik.setFieldValue('dayOfWeeks', e);
                      }}
                    />
                  </div>
                  <FormHelperText>
                    {formik.touched.dayOfWeeks && formik.errors.dayOfWeeks}
                  </FormHelperText>
                </FormControl>
              </Grid>
            )}
            <Grid item xs={4}>
              <FormControl size="small" fullWidth margin="dense">
                <FormLabel required>Thời gian</FormLabel>
                <Slider
                  style={{ width: 'calc(100% - 16px)', marginLeft: 8 }}
                  value={formik.values.timeRange}
                  onChange={(e, newVal) => {
                    const [start, end] = newVal;
                    if (start != end) {
                      formik.setFieldValue('timeRange', newVal);
                    }
                  }}
                  aria-labelledby="range-slider"
                  min={0}
                  max={24}
                  step={null}
                  marks={marks}
                />
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl
                size="small"
                fullWidth
                margin="dense"
                error={formik.touched.area && Boolean(formik.errors.area)}
              >
                <FormLabel required>Khu vực làm việc</FormLabel>
                <TreeSelect
                  showClearButton={false}
                  value={formik.values.area}
                  onValueChanged={(newVal) => {
                    formik.setFieldValue('area', newVal);
                  }}
                  keyExpr="id"
                  displayExpr="areaName"
                  searchEnabled
                  hasItemsExpr={(node) => !node?.isLeaf}
                  loadData={(node) =>
                    new Promise((resolve, reject) => {
                      let url = SAP_API.ROOT_AREA;
                      if (node?.key) {
                        url = SAP_API.CHILD_AREA(node.key);
                      }
                      getApi(url)
                        .then((ret) => {
                          resolve(ret.data);
                        })
                        .catch((err) => reject(err));
                    })
                  }
                />
                <FormHelperText>
                  {formik.touched.area && formik.errors.area}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl
                size="small"
                fullWidth
                margin="dense"
                error={formik.touched.group && Boolean(formik.errors.group)}
              >
                <FormLabel required>Đơn vị đến</FormLabel>
                <TreeSelect
                  showClearButton={false}
                  value={formik.values.group}
                  onValueChanged={(newVal) => {
                    formik.setFieldValue('group', newVal);
                  }}
                  keyExpr="groupId"
                  displayExpr="groupName"
                  searchEnabled
                  hasItemsExpr={(node) => !node?.isLeaf}
                  loadData={(node) =>
                    new Promise((resolve, reject) => {
                      if (node?.groupId) {
                        resolve([]);
                      }
                      getApi(API_IAM.LIST_DEPARTMENT)
                        .then((ret) => {
                          resolve(ret.data);
                        })
                        .catch((err) => reject(err));
                    })
                  }
                />
                <FormHelperText>
                  {formik.touched.group && formik.errors.group}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl size="small" fullWidth margin="dense">
                <FormLabel>Phòng/Ban</FormLabel>
                <TextBox
                  maxLength="50"
                  width="100%"
                  name="department"
                  placeholder="Nhập tên phòng ban"
                  value={formik.values.department}
                  onValueChanged={(e) => {
                    // props.onChange(e.value);
                    formik.setFieldValue('department', e.value);
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl
                size="small"
                fullWidth
                margin="dense"
                error={formik.touched.note && Boolean(formik.errors.note)}
              >
                <FormLabel required>Mục đích</FormLabel>
                <TextBox
                  maxLength="50"
                  width="100%"
                  name="note"
                  placeholder="Nhập mục đích"
                  value={formik.values.note}
                  onValueChanged={(e) => {
                    // props.onChange(e.value);
                    formik.setFieldValue('note', e.value);
                  }}
                />
                <FormHelperText>
                  {formik.touched.note && formik.errors.note}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl size="small" fullWidth margin="dense">
                <FormLabel>Văn bản tham chiếu</FormLabel>
                <TextBox
                  maxLength="50"
                  width="100%"
                  name="documentReference"
                  placeholder="Nhập số văn bản"
                  value={formik.values.documentReference}
                  onValueChanged={(e) => {
                    formik.setFieldValue('documentReference', e.value);
                  }}
                />
              </FormControl>
            </Grid>
          </Grid>
        </Paper>

        <Paper className={classes.paper}>
          <TableCustomWrap>{TableGuest}</TableCustomWrap>
        </Paper>

        <Paper className={classes.paper}>
          <TableCustomWrap>{TableVehicle}</TableCustomWrap>
        </Paper>

        <Paper className={classes.paper}>
          <TableCustomWrap>{tableApprover}</TableCustomWrap>
        </Paper>
      </form>
      {editDialog}
      {openDialogImport && (
        <DialogImport
          open={openDialogImport}
          close={() => setOpenDialogImport(false)}
          handleSuccess={handleSuccessImport}
        />
      )}
      <Popover
        id="addGuest-popup"
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        // onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Box p={2} width={480}>
          <AddGuestPopover
            guestList={formik.values.guests}
            onSubmit={onAddGuest}
          />
        </Box>
      </Popover>
    </div>
  );
}
const TableCustomWrap = styled.div`
  .dx-datagrid-nodata {
    display: none;
  }
  .dx-visibility-change-handler {
    min-height: auto !important;
  }
  .dx-fileuploader-files-container {
    height: 0px;
    padding: 0px !important;
  }
`;
