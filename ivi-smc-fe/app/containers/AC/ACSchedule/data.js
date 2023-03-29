import IconCardLg from 'components/Custom/Icon/FileIcon/IconCardLg';
import IconFacePassLarg from 'components/Custom/Icon/FileIcon/IconFacePassLarg';
import IconTouchLg from 'components/Custom/Icon/FileIcon/IconTouchLg';
import React from 'react';

export const listCommand = {
  NOTIFY_NEW_USER: 'NOTIFY_NEW_USER',
  FORCE_CLOSE_DOOR: 'FORCE_CLOSE_DOOR',
  FORCE_OPEN_DOOR: 'FORCE_OPEN_DOOR',
  PUSH_TEMPERATURE: 'PUSH_TEMPERATURE',
  FORCE_REMOVE_FACE_INFO: 'FORCE_REMOVE_FACE_INFO',
  SYNC_ALL: 'SYNC_ALL',
  SYNC_CONFIG: 'SYNC_CONFIG',
  SYNC_USER_DATA: 'SYNC_USER_DATA',
  RESTORE_ALL_TO_DEFAULT: 'RESTORE_ALL_TO_DEFAULT',
  RESTORE_WITHOUT_NETWORK_TO_DEFAULT: 'RESTORE_WITHOUT_NETWORK_TO_DEFAULT',
  SET_TIME: 'SET_TIME',
  UPLOAD_USER_DATA: 'UPLOAD_USER_DATA',
  REMOVE_USER_DATA: 'REMOVE_USER_DATA',
};

export const listIconAuthMode = [
  {
    icon: (
      <div
        style={{
          marginLeft: -2.5,
          marginTop: -1.5,
        }}
      >
        <IconFacePassLarg />
      </div>
    ),
    key: 'face',
  },
  {
    icon: (
      <div style={{ marginTop: -2, marginLeft: 2 }}>
        <IconTouchLg />
      </div>
    ),
    key: 'touch',
  },
  {
    icon: (
      <div style={{ marginTop: -2, marginLeft: -5 }}>
        <IconCardLg />
      </div>
    ),
    key: 'card',
  },
];

export const AC_DEVICE_TYPE = [
  { value: 'IN', label: 'Cửa vào', type: 'CAMERA_ACCESS' },
  { value: 'OUT', label: 'Cửa ra', type: 'CAMERA_ACCESS' },
  { value: null, label: 'Phân tầng thang máy', type: 'CAMERA_ELEVATOR' },
];

export const TimeZoneDefault = [
  {
    value: '-12',
    label: '(UTC-12:00) International Date Line West',
  },
  {
    value: '-11',
    label: '(UTC-11:00) Coordinated Universal Time-11',
  },
  {
    value: '-10',
    label: '(UTC-10:00) Aletian Islands',
  },
  {
    value: '-9',
    label: '(UTC-09:00) Alaska',
  },
  {
    value: '-8',
    label: '(UTC-08:00) Baja California',
  },
  {
    value: '-7',
    label: '(UTC-07:00) Arizona',
  },
  {
    value: '-6',
    label: '(UTC-06:00) Eater Island',
  },
  {
    value: '-5',
    label: '(UTC-05:00) Haiti',
  },
  {
    value: '-4',
    label: '(UTC-04:00) Santiago',
  },
  {
    value: '-3',
    label: '(UTC-04:00) Brasilia',
  },
  {
    value: '-2',
    label: '(UTC-04:00) Coordinated Universal Time-02',
  },
  {
    value: '-1',
    label: '(UTC-04:00) Azores',
  },
  {
    value: '+0',
    label: '(UTC+00:00) Sao Tome',
  },
  {
    value: '+1',
    label: '(UTC+01:00) Casablanca',
  },
  {
    value: '+2',
    label: '(UTC+02:00) Amman',
  },
  {
    value: '+3',
    label: '(UTC+03:00) Minsk',
  },
  {
    value: '+4',
    label: '(UTC+04:00) Baku',
  },
  {
    value: '+5',
    label: '(UTC+05:00) Ekaterinburg',
  },
  {
    value: '+6',
    label: '(UTC+00:00) Omsk',
  },
  {
    value: '+7',
    label: '(UTC +07:00) Bangkok, Hanoi, Jakarta',
  },
  {
    value: '+8',
    label: '(UTC+08:00) Irkutsk',
  },
  {
    value: '+9',
    label: '(UTC+09:00) Seoul',
  },
  {
    value: '+10',
    label: '(UTC+10:00) Hobart',
  },
  {
    value: '+11',
    label: '(UTC+11:00) Magadan',
  },
  {
    value: '+12',
    label: '(UTC+12:00) Fiji',
  },
  {
    value: '+13',
    label: '(UTC+13:00) Samoa',
  },
  {
    value: '+14',
    label: '(UTC+14:00) Kiritimati Island',
  },
];
