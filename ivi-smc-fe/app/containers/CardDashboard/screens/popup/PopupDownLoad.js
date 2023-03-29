/* eslint-disable no-restricted-globals */
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import PopupCustom from 'components/Custom/popup/PopupCustom';
import Grid from '@material-ui/core/Grid';
import { Controller, useForm } from 'react-hook-form';
import { FormControl } from '@material-ui/core';
import DateTimeBox from 'components/TextInput/DateTimeBox';
import styled from 'styled-components';

const PopupDownload = ({ onClose, onClickSave, mode }) => {
  const { handleSubmit, control, errors } = useForm({});

  const intl = useIntl();

  const [timeStart, setTimeStart] = useState('');

  const [timeEnd, setTimeEnd] = useState('');

  const onSave = () => {
    const dto = {
      startTime: timeStart,
      endTime: timeEnd,
      modeDownload: mode,
    };
    onClickSave(dto);
    onClose(false);
  };

  return (
    <PopupCustom
      onClose={onClose}
      closeOnOutsideClick
      title="Tải xuống"
      width="50%"
      body={
        <>
          <div>
            <Explain>
              <li>Chọn thời gian muốn tải</li>
            </Explain>
            <Grid container spacing={4}>
              <Grid item sm={6}>
                <Controller
                  control={control}
                  rules={{
                    required: 'Trường thông tin bắt buộc nhập',
                  }}
                  name="startDate"
                  render={props => (
                    <FormControl
                      error={!!errors.startDate}
                      style={{ width: '100%' }}
                    >
                      <DateTimeBox
                        title="Thời gian từ"
                        placeholder="Chọn thời gian"
                        onValueChanged={e => {
                          props.onChange(e.value);
                          setTimeStart(e.value.valueOf());
                        }}
                        defaultValue={props.value}
                        name="startDate"
                      />
                      {errors.startDate && (
                        <div
                          style={{
                            color: 'red',
                            fontSize: 11,
                            marginTop: -10,
                            fontWeight: 400,
                          }}
                        >
                          {errors.startDate?.message}
                        </div>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item sm={6}>
                <Controller
                  control={control}
                  rules={{
                    required: 'Trường thông tin bắt buộc nhập',
                  }}
                  name="endDate"
                  render={props => (
                    <FormControl
                      error={!!errors.endDate}
                      style={{ width: '100%' }}
                    >
                      <DateTimeBox
                        title="Thời gian đến"
                        placeholder="Chọn thời gian"
                        onValueChanged={e => {
                          props.onChange(e.value);
                          setTimeEnd(e.value.valueOf());
                        }}
                        defaultValue={props.value}
                        name="endDate"
                      />
                      {errors.endDate && (
                        <div
                          style={{
                            color: 'red',
                            fontSize: 11,
                            marginTop: -10,
                            fontWeight: 400,
                          }}
                        >
                          {errors.endDate?.message}
                        </div>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>
            </Grid>
          </div>
        </>
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
          label: 'Tải',
          onClick: handleSubmit(onSave),
        },
      ]}
    />
  );
};

const Explain = styled.div`
  margin: 5px 0px 10px;
  max-width: 350px;
  font-size: 14px;
  font-weight: 400;
  width: 100%;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export default PopupDownload;
