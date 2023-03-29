import { Controller, useForm } from 'react-hook-form';
import React, { useEffect } from 'react';
import { FormHelperText, Grid, TextField } from '@material-ui/core';
import { DateBox } from 'devextreme-react';
import CustomSelect from 'containers/CamAiConfigHumanFaceModule/components/CustomSelect';
import NumberFormat from 'react-number-format';
import { validationSchema } from 'utils/utils';
import * as yup from 'yup';
import _ from 'lodash';
import { useStyles } from '../styles';
import BtnCancel from '../../../components/Button/BtnCancel';
import BtnSuccess from '../../../components/Button/BtnSuccess';

import {
  PAYMENT_PARKING_STATUS,
  INIT_SEARCH_VALUE,
  PAYMENT_VINID_STATUS,
  MIN_DATE,
} from '../constants';

export const FilterPayment = ({ onClose, handleChangeFilter, initValues }) => {
  const classes = useStyles();

  const schema = validationSchema({
    fromDate: yup
      .date()
      .test(
        'greaterThanEndDate',
        'Ngày bắt đầu phải nhỏ hơn ngày kết thúc',
        value => {
          const endDate = getValues
            ? getValues().toDate
              ? getValues().toDate.getTime()
              : null
            : null;
          if (endDate && value) {
            return value.getTime() <= endDate;
          }
          return true;
        },
      )
      .test(
        'outOf3Month',
        'Ngày không được vượt quá 3 tháng',
        value => value.getTime() >= MIN_DATE.getTime(),
      ),
    toDate: yup
      .date()
      .nullable()
      .test('outOf3Month', 'Ngày không được vượt quá 3 tháng', value => {
        if (!value) {
          return true;
        }
        return value.getTime() >= MIN_DATE.getTime();
      }),
    from: yup
      .string()
      .nullable()
      .test(
        'greaterThanMax',
        'Số tiền tối thiểu phải nhỏ hơn số tiền tối đa',
        value => {
          const max = getValues && getValues().to;
          if (max && value) {
            return +value <= +max;
          }
          return true;
        },
      ),
  });

  //

  const { handleSubmit, control, reset, errors, getValues, trigger } = useForm({
    resolver: schema,
    mode: 'onChange',
  });

  const setDetailFormValue = () => {
    reset({
      toDate: initValues.toDate,
      fromDate: initValues.fromDate,
      paymentVinIDStatus: initValues.paymentVinIDStatus,
      paymentParkingStatus: initValues.paymentParkingStatus,
      from: initValues.from,
      to: initValues.to,
    });
  };

  const handleResetData = () => {
    reset({
      toDate: INIT_SEARCH_VALUE.toDate,
      fromDate: INIT_SEARCH_VALUE.fromDate,
      paymentVinIDStatus: INIT_SEARCH_VALUE.paymentVinIDStatus,
      paymentParkingStatus: INIT_SEARCH_VALUE.paymentParkingStatus,
      from: INIT_SEARCH_VALUE.from,
      to: INIT_SEARCH_VALUE.to,
    });
  };

  useEffect(() => {
    setDetailFormValue();
  }, [initValues]);

  const onSubmit = values => {
    handleChangeFilter(values);
    onClose();
  };

  const dropDownOptions = {
    position: { my: 'center', at: 'center', of: window },
  };

  return (
    <form className={classes.root}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <p className={classes.label}>Từ ngày</p>
          <Controller
            control={control}
            name="fromDate"
            defaultValue={new Date().getTime()}
            render={props => (
              <DateBox
                style={errors.fromDate && { border: '1px solid #f44336' }}
                type="datetime"
                showAnalogClock={false}
                value={props.value}
                useMaskBehavior
                onValueChanged={e => {
                  props.onChange(e.value);
                }}
                placeholder="Chọn ngày"
                displayFormat="HH:mm dd/MM/yyyy"
                dropDownOptions={dropDownOptions}
                dateOutOfRangeMessage=""
                min={MIN_DATE}
                applyButtonText="Đồng ý"
              />
            )}
          />
          {errors.fromDate && errors.fromDate.message && (
            <FormHelperText style={{ color: '#f44336' }}>
              {errors.fromDate.message}
            </FormHelperText>
          )}
        </Grid>
        <Grid item xs={12} sm={6}>
          <p className={classes.label}>Đến ngày</p>
          <Controller
            control={control}
            name="toDate"
            defaultValue={new Date().getTime()}
            render={props => (
              <DateBox
                showClearButton
                type="datetime"
                showAnalogClock={false}
                value={props.value}
                useMaskBehavior
                onValueChanged={e => {
                  props.onChange(e.value);
                  trigger('fromDate');
                }}
                placeholder="Chọn ngày"
                displayFormat="HH:mm dd/MM/yyyy"
                dateOutOfRangeMessage=""
                dropDownOptions={dropDownOptions}
                min={MIN_DATE}
                applyButtonText="Đồng ý"
              />
            )}
          />
          {errors.toDate && errors.toDate.message && (
            <FormHelperText style={{ color: '#f44336' }}>
              {errors.toDate.message}
            </FormHelperText>
          )}
        </Grid>
        <Grid item xs={12} sm={6}>
          <p className={classes.label}>Trạng thái thanh toán VinID</p>
          <CustomSelect
            disableClearable
            control={control}
            errors={errors}
            name="paymentVinIDStatus"
            getOptionLabel={option => option?.name || ''}
            getOptionSelected={(option, selected) => option.id === selected.id}
            options={PAYMENT_VINID_STATUS}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <p className={classes.label}>Trạng thái thanh toán Parking</p>
          <CustomSelect
            disableClearable
            control={control}
            errors={errors}
            name="paymentParkingStatus"
            getOptionLabel={option => option?.name || ''}
            getOptionSelected={(option, selected) => option.id === selected.id}
            options={PAYMENT_PARKING_STATUS}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <p className={classes.label}>Số tiền tối thiểu</p>
          <Controller
            control={control}
            name="from"
            defaultValue={null}
            render={props => (
              <TextField
                className={classes.colorPlaceholer}
                placeholder=".000VNĐ"
                fullWidth
                value={props.value}
                error={!!errors.from}
                helperText={errors.from && errors.from.message}
                onChange={e => {
                  props.onChange(e.target.value);
                }}
                variant="outlined"
                InputProps={{
                  inputComponent: NumberFormatCustom,
                }}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <p className={classes.label}>Số tiền tối đa</p>
          <Controller
            control={control}
            name="to"
            defaultValue={null}
            render={props => (
              <TextField
                className={classes.colorPlaceholer}
                placeholder=".000VNĐ"
                fullWidth
                value={props.value}
                onChange={e => {
                  props.onChange(e.target.value);
                  trigger('from');
                }}
                variant="outlined"
                InputProps={{
                  inputComponent: NumberFormatCustom,
                }}
              />
            )}
          />
        </Grid>
      </Grid>
      <Grid container style={{ marginTop: '24px' }}>
        <Grid item xs={4}>
          <BtnSuccess onClick={handleResetData}>Đặt lại</BtnSuccess>
        </Grid>
        <Grid
          item
          xs={8}
          container
          direction="row"
          alignContent="center"
          justify="flex-end"
        >
          <BtnCancel onClick={onClose} style={{ marginRight: '12px' }}>
            Hủy
          </BtnCancel>
          <BtnSuccess onClick={handleSubmit(onSubmit)}>Lọc</BtnSuccess>
        </Grid>
      </Grid>
    </form>
  );
};

function NumberFormatCustom(props) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={values => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      allowNegative={false}
      thousandSeparator="."
      decimalSeparator=","
      isNumericString
      suffix=".000VNĐ"
    />
  );
}

export default FilterPayment;
