import React, { useMemo, useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { getApiCustom } from 'utils/requestUtils';
import { useForm, Controller } from 'react-hook-form';

import {
  DialogContent,
  Grid,
  DialogActions,
  Dialog,
  TextField,
  DialogTitle,
  Checkbox,
} from '@material-ui/core';
import messages from '../messages';
import { GUEST_REGISTRATION } from '../../apiUrl';
import { dialogAddguestStyles } from '../styles';

export default function DialogEditGuest({
  open,
  handleClose,
  initialValues,
  onSuccess,
  guestsData,
  guestIndex,
}) {
  const classes = dialogAddguestStyles();
  const intl = useIntl();
  const [isDisabled, setDisabled] = useState(false);
  const [isWarning, setWarning] = useState(false);
  const [identityNumbers, setIdentityNumbers] = useState([]);
  const {
    handleSubmit,
    control,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm({ mode: 'onChange' });

  useEffect(() => {
    reset(initialValues);
    setDisabled(initialValues?.isRepresentation);
  }, [initialValues]);
  useEffect(() => {
    const items = guestsData.map(item => item.identityNumber);
    items.splice(guestIndex, 1);
    setIdentityNumbers(items);
  }, [guestsData, guestIndex]);
  const validateIdentityNumber = value => {
    if (identityNumbers.indexOf(value) !== -1) return false;
    return true;
  };
  let timeout = useMemo(() => undefined, []);
  const debounceSearchIdentityNumber = value => {
    // eslint-disable-next-line no-unused-expressions
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      if (!value) return;
      getApiCustom(
        {
          url: `${GUEST_REGISTRATION}/guests`,
          params: { identityNumber: value },
        },
        res => {
          if (res.count) {
            setWarning(true);
          }
        },
      );
    }, 700);
  };
  const onSubmitForm = values => {
    setWarning(false);
    clearErrors();
    onSuccess(values);
  };

  return (
    <Dialog
      open={open}
      maxWidth="md"
      fullWidth
      onClose={e => {
        setWarning(false);
        handleClose(e);
      }}
      className={classes.root}
    >
      <form onSubmit={handleSubmit(onSubmitForm)}>
        <DialogTitle>Sửa thông tin khách</DialogTitle>
        <DialogContent style={{ overflowY: 'unset' }}>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <Grid container direction="column">
                <p className={classes.label}>
                  {intl.formatMessage(messages.guestName)}*
                </p>
                <Controller
                  control={control}
                  name="fullName"
                  rules={{
                    required: true,
                  }}
                  render={props => (
                    <TextField
                      autoComplete="off"
                      autoFocus
                      error={!!errors.fullName}
                      value={props.value}
                      inputProps={{
                        maxLength: 50,
                      }}
                      placeholder={intl.formatMessage(messages.inputGuestName)}
                      variant="outlined"
                      onChange={props.onChange}
                    />
                  )}
                />
              </Grid>
            </Grid>
            <Grid item xs={6}>
              <Grid container direction="column">
                <p className={classes.label}>
                  {intl.formatMessage(messages.phoneNumber)}*
                </p>
                <Controller
                  control={control}
                  name="phoneNumber"
                  rules={{
                    required: true,
                    pattern: {
                      value: new RegExp(
                        '^(\\+[0-9][-. ]{0,1})?(([0-9]+)[-. ]{0,1})?([0-9]+[-. ]{0,1}[0-9])$',
                      ),
                      message: 'Số điện thoại không hợp lệ.',
                    },
                  }}
                  render={props => (
                    <TextField
                      inputProps={{
                        maxLength: 50,
                      }}
                      autoComplete="off"
                      error={!!errors.phoneNumber}
                      value={props.value}
                      placeholder={intl.formatMessage(
                        messages.inputPhoneNumber,
                      )}
                      variant="outlined"
                      helperText={errors.phoneNumber?.message}
                      onChange={props.onChange}
                    />
                  )}
                />
              </Grid>
            </Grid>
            <Grid item xs={6}>
              <Grid container direction="column">
                <p className={classes.label}>
                  {intl.formatMessage(messages.identityNumber)}*
                </p>
                <Grid>
                  <Controller
                    control={control}
                    name="identityNumber"
                    rules={{
                      required: true,
                      validate: value =>
                        validateIdentityNumber(value) ||
                        'Số giấy tờ đã tồn tại trong lần đăng ký này. Vui lòng check lại thông tin',
                    }}
                    render={props => (
                      <TextField
                        inputProps={{
                          maxLength: 50,
                        }}
                        className={
                          errors.identityNumber
                            ? classes.default
                            : isWarning
                            ? classes.warning
                            : classes.default
                        }
                        autoComplete="off"
                        error={!!errors.identityNumber}
                        helperText={
                          errors.identityNumber?.message ||
                          (isWarning
                            ? 'Số giấy tờ này đã được đăng ký ở một đơn đăng ký khác.'
                            : '')
                        }
                        placeholder={intl.formatMessage(
                          messages.inputIdentityNumber,
                        )}
                        style={{ width: '100%' }}
                        variant="outlined"
                        value={props.value}
                        onChange={e => {
                          if (isWarning) setWarning(false);
                          debounceSearchIdentityNumber(e.target.value);
                          props.onChange(e.target.value);
                        }}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid
              item
              xs={6}
              style={{
                display: 'flex',
                alignItems: 'center',
                marginTop: '26px',
              }}
            >
              <Controller
                control={control}
                name="isRepresentation"
                render={props => (
                  <Checkbox
                    onChange={e => props.onChange(e.target.checked)}
                    checked={props.value}
                    color="primary"
                    disabled={isDisabled}
                  />
                )}
              />

              <p style={{ margin: 0 }}>
                {intl.formatMessage(messages.isRepresentativeGuest)}
              </p>
            </Grid>
            {/* <Grid item xs={6}>
              <Grid container direction="column">
                <p className={classes.label}>Mã định danh</p>
                <Controller
                  control={control}
                  name="accessCode"
                  render={props => (
                    <TextField
                      name="accessCode"
                      variant="outlined"
                      value={props.value}
                      InputProps={{
                        readOnly: true,
                      }}
                      className={classes.disabledInput}
                    />
                  )}
                />
              </Grid>
            </Grid> */}
          </Grid>
        </DialogContent>
        <DialogActions>
          <button
            type="button"
            onClick={() => {
              setWarning(false);
              handleClose();
            }}
            className={classes.button}
            style={{ border: '1px solid #dddddd' }}
          >
            Hủy
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className={classes.button}
            style={{
              marginLeft: '32px',
              color: '#fff',
              boxShadow: '0px 4px 10px rgba(16, 156, 241, 0.24)',
              backgroundColor: '#00554A',
            }}
          >
            {intl.formatMessage(messages.save)}
          </button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
