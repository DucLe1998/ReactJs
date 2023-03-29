import styled from 'styled-components';
import React from 'react';
import moment from 'moment/min/moment-with-locales';
import { LinkStyle, EventImage } from '../components/CommonComponent';
import NoImage from '../images/noimage.png';

const Status = styled.div`
  border-radius: 15px;
  padding: 2px 15px;
  color: var(--main-text-light-color);
  font-size: 12px;
  text-align: center;
  width: fit-content;
  margin: auto;
`;
const HightStatus = styled(Status)`
  background-color: var(--hight-level-color);
`;
const DangerousStatus = styled(Status)`
  background-color: var(--dangerous-status);
`;
const MediumStatus = styled(Status)`
  background-color: var(--medium-level-color);
`;
const LowStatus = styled(Status)`
  background-color: var(--low-level-color);
`;
const DisabledStatus = styled(Status)`
  background-color: var(--disabled-level-color);
`;
function getStatusHtml(status) {
  switch (status) {
    case 'DANGEROUS':
      return <DangerousStatus>Nguy hiểm</DangerousStatus>;
    case 'VERY_HIGH':
      return <HightStatus>Rất nghiêm trọng</HightStatus>;
    case 'h':
    case 'HIGH':
    case 'CAMERA_HIGH':
      return <HightStatus>Cao</HightStatus>;
    case 'm':
    case 'MEDIUM':
    case 'CAMERA_NORMAL':
      return <MediumStatus>Trung bình</MediumStatus>;
    case 'l':
    case 'LOW':
    case 'CAMERA_LOW':
      return <LowStatus>Thấp</LowStatus>;
    case 'a':
    case 'ON':
      return <LowStatus>Hoạt động</LowStatus>;
    case 'd':
    case 'OFF':
      return <DisabledStatus>Không hoạt động</DisabledStatus>;
    default:
      return <LowStatus>Thấp</LowStatus>;
  }
}

function getColorByCode(code, returnEmtyIfNotExists) {
  // const root = document.documentElement;
  switch (code) {
    case 'LOW':
      return 'var(--low-level-color)';
    case 'MEDIUM':
    case 'NEW':
      return 'var(--medium-level-color)';
    case 'HIGH':
    case 'PROCESSING':
    case 'PROCCESED':
      return 'var(--hight-level-color)';
    case 'VERY_HIGH':
      return 'var(--very-hight-level-color)';
    case 'DANGEROUS':
    case 'CANCELED':
      return 'var(--dangerous-status)';
    case 'ON':
    case 'Hoạt động':
    case 'hoạt động':
      return 'var(--low-level-color)';
    case 'OFF':
    case 'không hoạt động':
    case 'Không hoạt động':
      return 'var(--disabled-level-color)';
    case 'ACCESS_CONTROL':
      return 'var(--access-control-color)';
    case 'CAMERA':
    case 'TRAFFIC_CAMERA':
      return 'var(--camera-color)';
    case 'INTERCOM':
      return 'var(--intercom-color)';
    case 'HEALTHCARE':
      return 'var(--health-care-color)';
    default:
      if (!returnEmtyIfNotExists) return 'var(--main-bg-color)';
      return '';
  }
}
function getHTMLTimeCountDown(time) {
  const minutesInMilisecond = 60000;
  // const hourInMilisecond = 3600000;
  // const dayInMilisecond = 86400000;
  if (time > Date.now()) {
    return <span style={{ color: '#000' }}>Vài giây trước</span>;
  }
  if (time >= Date.now() - minutesInMilisecond * 3) {
    return (
      <span style={{ color: '#000' }}>
        {moment()
          .locale('vi')
          .to(time)}
      </span>
    );
  }
  if (time >= Date.now() - minutesInMilisecond * 20)
    return (
      <span style={{ color: '#000' }}>
        {moment()
          .locale('vi')
          .to(time)}
      </span>
    );
  return (
    <span style={{ color: '#000' }}>
      {moment()
        .locale('vi')
        .to(time)}
    </span>
  );
}
function getEventRowValue(column, value, row, index, page, pageSize) {
  if (column === 'order') return page * pageSize + index + 1;
  if (column === 'eventName' || column === 'taskName')
    return <LinkStyle>{value}</LinkStyle>;
  if (
    column === 'sourceName' &&
    row.sourceId &&
    row.sourceType != 'MAINTENANCE'
  ) {
    return <LinkStyle>{value}</LinkStyle>;
  }
  if (column === 'levelCode') return getStatusHtml(value);
  if (
    column === 'createdDate' ||
    column === 'deadline' ||
    column === 'createdAt'
  ) {
    return value ? moment(value).format(process.env.DATE_TIME_FORMAT) : '';
  }
  if (column === 'image') {
    if (value) return <EventImage src={value} />;
    return <EventImage src={NoImage} />;
  }
  const a =
    column.format && typeof value === 'number' ? column.format(value) : value;
  return a;
}

export {
  getStatusHtml,
  getColorByCode,
  getHTMLTimeCountDown,
  getEventRowValue,
};
