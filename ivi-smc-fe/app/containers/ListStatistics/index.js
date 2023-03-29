import React from 'react';
import { Helmet } from 'react-helmet';
import { useStyles } from './style';
import ChartSimple from './ChartSimple';
import { getApi } from '../../utils/requestUtils';
import { API_ACCESS_CONTROL, API_PARKING } from '../apiUrl';
import GiamSat from './GiamSat';

const colors = {
  green: '#14B86E',
  yellow: '#F8B94A',
  orange: '#F07A2B',
  red: '#FF0000',
  purple: '#547ED0',
};
const options = [
  {
    text: '7 ngày',
    value: 'DAY_7',
  },
  {
    text: '30 ngày',
    value: 'DAY_30',
  },
  {
    text: '6 tháng',
    value: 'MONTH_6',
  },
  {
    text: '12 tháng',
    value: 'MONTH_12',
  },
  {
    text: '36 tháng',
    value: 'MONTH_36',
  },
];

export default function ListStatistics() {
  const classes = useStyles();
  const EmployeeAPI = timeType =>
    getApi(API_ACCESS_CONTROL.LIST_EVENT_EMPLOYEE_STATISTICS(timeType));
  const GuestAPI = timeType =>
    getApi(API_ACCESS_CONTROL.LIST_EVENT_GUEST_STATISTICS(timeType));
  const VehicleAPI = timeType =>
    getApi(
      API_PARKING.GET_IN_OUT(
        +process.env.AREA_ID,
        +process.env.BLOCK_ID,
        timeType,
      ),
    );

  return (
    <div className={classes.root}>
      <Helmet>
        <title>Danh sách thống kê</title>
        <meta name="description" content="Danh sách thống kê" />
      </Helmet>
      <h4>Trang chủ</h4>
      <GiamSat />
      <ChartSimple
        title="Số lượt nhân viên ra vào"
        callAPI={EmployeeAPI}
        argumentField="label"
        valueField="numberOfEvent"
        color={colors.green}
        options={options}
        type="human"
      />
      <ChartSimple
        title="Số lượt khách ra vào"
        callAPI={GuestAPI}
        argumentField="label"
        valueField="numberOfEvent"
        color={colors.yellow}
        options={options}
        type="human"
      />
      <ChartSimple
        title="Số lượt phương tiện ra vào bãi gửi xe"
        callAPI={VehicleAPI}
        argumentField="label"
        valueField="numberOfEvent"
        color={colors.purple}
        options={options}
        type="vehicle"
      />
    </div>
  );
}
