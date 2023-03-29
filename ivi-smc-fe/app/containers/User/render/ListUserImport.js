import { useIntl } from 'react-intl';
import React from 'react';
import { Box, Card, CardContent } from '@material-ui/core';
import DataGrid, {
  Column,
  LoadPanel,
  Paging,
  Scrolling,
} from 'devextreme-react/data-grid';
import clsx from 'clsx';
import { Button } from 'devextreme-react/button';
import messages from '../messages';
import { useStyles } from '../style';

export const ListUserImport = ({ listUser, close }) => {
  const intl = useIntl();
  const classes = useStyles();

  const renderOrderCell = item => (
    <div style={{ textAlign: 'left' }}>{item.rowIndex + 1}</div>
  );

  const renderStatusCell = ({ data }) => (
    <div style={{ textAlign: 'left' }}>
      <span
        style={{
          color: data.statusUpload === 'SUCCESS_FULL' ? '#4C96FD' : '#FB4E4E',
        }}
      >
        {getMessage(data.statusUpload)}
      </span>
    </div>
  );

  const StatusCode = [
    {
      code: 'SUCCESS_FULL',
      text: 'Thành công',
    },
    {
      code: 'USER_EXISTED_COMPANY',
      text: 'Người dùng đã tồn tại công ty',
    },
    {
      code: 'USER_NOT_LOGGED_IN',
      text: 'Người dùng chưa đăng nhập vào hệ thống',
    },
    {
      code: 'USER_BELONGED_COMPANY',
      text: 'Người dùng đã thuộc 1 công ty khác',
    },
    {
      code: 'ORG_UNIT_NOT_FOUND',
      text: 'Đơn vị không tồn tại',
    },
    {
      code: 'POSITION_NOT_FOUND',
      text: 'Chức vụ không tồn tại',
    },
    {
      code: 'IDENTITY_PROVIDER_IS_NULL',
      text: 'Không được để trống loại tài khoản',
    },
    {
      code: 'EMAIL_NOT_REGEX',
      text: 'Email không đúng định dạng',
    },
    {
      code: 'PHONE_NUMBER_NOT_REGEX',
      text: 'Điện thoại không đúng định dạng',
    },
    {
      code: 'DUPLICATE_EMPLOYEE_CODE',
      text: 'Mã nhân viên bị trùng lặp',
    },
    {
      code: 'NOT_PERMITTED_ASSIGN_OTHER_COMPANY',
      text: 'Không có quyền gán cho công ty khác',
    },
    {
      code: 'NOT_PERMITTED_ACCESS',
      text: 'Không có quyền',
    },
    {
      code: 'STATUS_NOT_VALID',
      text: 'Trạng thái không hợp lệ',
    },
  ];
  const getMessage = code => {
    const rs = StatusCode.filter(item => item.code === code)[0];
    return rs?.text || code;
  };

  const columns = [
    {
      dataField: 'index',
      caption: intl.formatMessage(messages.index),
      cssClass: 'valign-center',
      allowSorting: false,
      cellRender: renderOrderCell,
    },
    {
      // dataField: 'orgUnitName',
      dataField: 'orgUnitCode',
      caption: intl.formatMessage(messages.unit),
      cssClass: 'valign-center',
    },
    {
      dataField: 'fullName',
      caption: intl.formatMessage(messages.name),
      alignment: 'left',
      cssClass: 'valign-center',
    },
    {
      dataField: 'email',
      caption: intl.formatMessage(messages.email),
      cssClass: 'valign-center',
    },
    {
      dataField: 'employeeCode',
      caption: intl.formatMessage(messages.empCode),
      cssClass: 'valign-center',
    },
    {
      dataField: 'phoneNumber',
      caption: intl.formatMessage(messages.phoneNumber),
      cssClass: 'valign-center',
    },
    {
      // dataField: 'position',
      dataField: 'positionCode',
      caption: intl.formatMessage(messages.position),
      cssClass: 'valign-center',
    },
    // {
    //   dataField: 'role',
    //   caption: intl.formatMessage(messages.authority),
    //   cssClass: 'valign-center',
    // },
    {
      dataField: 'statusUpload',
      caption: intl.formatMessage(messages.status),
      cssClass: 'valign-center',
      cellRender: renderStatusCell,
    },
  ];

  return (
    <Box>
      <Card className={classes.card}>
        <CardContent>
          <DataGrid
            dataSource={listUser}
            keyExpr="username"
            noDataText={intl.formatMessage({ id: 'app.no_data' })}
            style={{
              height: '100%',
              maxHeight: `calc(100vh - ${500}px)`,
              width: '100%',
              maxWidth: '100%',
            }}
            showRowLines
            columnAutoWidth
            showColumnLines={false}
            rowAlternationEnabled
          >
            <Paging enabled={false} />
            <Scrolling mode="infinite" />
            <LoadPanel enabled={false} />
            {columns.map((defs, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <Column key={index} {...defs} />
            ))}
          </DataGrid>
        </CardContent>
      </Card>
      <div style={{ marginTop: 20 }}>
        <Button
          className={clsx(classes.button, classes.buttonFilter)}
          style={{ width: '7%', padding: '10px 0px', float: 'right' }}
          onClick={close}
        >
          {intl.formatMessage({ id: 'app.status.close' })}
        </Button>
      </div>
    </Box>
  );
};
