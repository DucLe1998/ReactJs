/* eslint-disable radix */
/* eslint-disable react/prop-types,no-param-reassign,no-unused-expressions,no-dupe-keys */
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import PopupCustom from 'components/Custom/popup/PopupCustom';
import './style.css';
import utils from 'utils/utils';

const AddTimeAndMinute = ({ onClose, onClickSave, typeDay, itemChoice }) => {
  const intl = useIntl();

  const [data, setData] = useState([]);

  const onSave = () => {
    const found = data.find(
      (e) => e.start !== 0 && e.end !== 0 && e.start >= e.end,
    );
    if (found) {
      utils.showToast(
        `Nhập sai thông tin khoảng thời gian: Time ${found.type} không hợp lệ!`,
        'warning',
      );
    } else {
      onClickSave(data, typeDay);
    }
  };

  const callbackOnChangeInput = (value) => {
    const foundExit = data.find((e) => e.type === value.type);
    if (foundExit) {
      setData([...data.filter((e) => e.type !== foundExit.type), value]);
    } else {
      setData([...data, value]);
    }
  };

  useEffect(() => {
    if (itemChoice.times) {
      setData(itemChoice.times);
    }
  }, [itemChoice]);

  return (
    <PopupCustom
      onClose={onClose}
      title="Chọn khoảng thời gian"
      width="444px"
      closeOnOutsideClick
      body={
        <div>
          {[
            { name: 'Time 1', type: '1' },
            { name: 'Time 2', type: '2' },
            { name: 'Time 3', type: '3' },
          ].map((item, index) => {
            const found = data.find((e) => e.type === item.type);
            return (
              <RowInputTime
                name={item.name}
                type={item.type}
                key={index.toString()}
                defaultValue={found}
                callback={callbackOnChangeInput}
              />
            );
          })}
        </div>
      }
      listBtnFooter={[
        {
          colorText: '#000',
          className: 'btn-cancel',
          label: intl.formatMessage({ id: 'app.button.cancel' }),
          onClick: () => onClose(false),
        },
        {
          className: 'btn-save',
          label: 'Thêm',
          onClick: onSave,
        },
      ]}
    />
  );
};

const RowInputTime = ({ name, callback, type, defaultValue }) => {
  const [startTime, setStartTime] = useState({ hour: '', minute: '' });
  const [endTime, setEndTime] = useState({ hour: '', minute: '' });

  const onChangeStartTime = (value) => {
    setStartTime({
      ...startTime,
      ...value,
    });
  };

  const a = defaultValue?.start;
  const b = defaultValue?.end;
  const defaultValueStartHour = (a - (a % 60)) / 60;
  const defaultValueStartMinute = a - defaultValueStartHour * 60;
  const defaultValueEndHour = (b - (b % 60)) / 60;
  const defaultValueEndMinute = b - defaultValueEndHour * 60;

  useEffect(() => {
    if (defaultValueEndHour || defaultValueEndMinute) {
      setStartTime({
        hour: defaultValueStartHour,
        minute: defaultValueStartMinute,
      });
      setEndTime({
        hour: defaultValueEndHour,
        minute: defaultValueEndMinute,
      });
    }
  }, [defaultValueEndHour]);

  useEffect(() => {
    if (startTime.hour || startTime.minute || endTime.hour || endTime.minute) {
      const aStart =
        parseInt(startTime.hour || 0) * 60 +
        ((startTime.minute && parseInt(startTime.minute)) || 0);
      const aEnd =
        parseInt(endTime.hour || 0) * 60 +
        ((endTime.minute && parseInt(endTime.minute)) || 0);
      callback({
        start: aStart,
        end: aEnd,
        type,
      });
    } else {
      callback({
        start: 0,
        end: 0,
        type,
      });
    }
  }, [startTime, endTime]);

  const onChangeEndTime = (value) => {
    setEndTime({
      ...endTime,
      ...value,
    });
  };

  return (
    <div className="ct-flex-row mt-16">
      <div style={{ minWidth: 60 }}>{name}</div>
      <div
        className="ct-flex-row"
        style={{
          position: 'relative',
        }}
      >
        <input
          className="input-hour"
          placeholder={startTime.minute && !startTime.hour ? '00' : '--'}
          type="number"
          min="0"
          max="24"
          id={`input-hour-${type}`}
          defaultValue={defaultValueStartHour || ''}
          onChange={(e) => {
            if (e.target.value > 24) {
              document.getElementById(`input-hour-${type}`).value = '24';
            } else {
              onChangeStartTime({ hour: e.target.value || 0 });
            }
          }}
        />
        <div style={{ position: 'absolute', left: 62 }}>:</div>
        <input
          className="input-minute"
          placeholder={!startTime.minute && startTime.hour ? '00' : '--'}
          type="number"
          min="0"
          max="60"
          id={`input-minute-${type}`}
          defaultValue={defaultValueStartMinute || ''}
          onChange={(e) => {
            if (e.target.value > 60) {
              document.getElementById(`input-minute-${type}`).value = '60';
            } else {
              onChangeStartTime({
                minute: e.target.value || 0,
              });
            }
          }}
        />
      </div>

      <div style={{ width: 40, textAlign: 'center' }}>~</div>

      <div
        className="ct-flex-row"
        style={{
          position: 'relative',
        }}
      >
        <input
          className="input-hour"
          placeholder={endTime.minute && !endTime.hour ? '00' : '--'}
          type="number"
          min="0"
          max="24"
          id={`input-hour-end-${type}`}
          onChange={(e) => {
            if (e.target.value > 24) {
              document.getElementById(`input-hour-end-${type}`).value = '24';
            } else {
              onChangeEndTime({ hour: e.target.value || 0 });
            }
          }}
          defaultValue={defaultValueEndHour || ''}
        />
        <div style={{ position: 'absolute', left: 62 }}>:</div>
        <input
          className="input-minute"
          placeholder={!endTime.minute && endTime.hour ? '00' : '--'}
          type="number"
          min="0"
          max="60"
          id={`input-minute-end-${type}`}
          onChange={(e) => {
            if (e.target.value > 60) {
              document.getElementById(`input-minute-end-${type}`).value = '60';
            } else {
              onChangeEndTime({
                minute: e.target.value || 0,
              });
            }
          }}
          defaultValue={defaultValueEndMinute || ''}
        />
      </div>
    </div>
  );
};

export default AddTimeAndMinute;
