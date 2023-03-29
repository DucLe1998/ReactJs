import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormLabel,
  TextField,
} from '@material-ui/core';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { validationSchema } from 'utils/utils';
import * as yup from 'yup';

export default function DialogReject({ open, handleClose, onSuccess }) {
  const schema = validationSchema({
    reason: yup.string().nullable().required('Trường này bắt buộc nhập'),
  });
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: schema,
  });

  const onSubmitForm = (values) => {
    onSuccess(values.reason);
  };
  return (
    <form onSubmit={handleSubmit(onSubmitForm)}>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Từ chối đơn</DialogTitle>
        <DialogContent>
          <Controller
            control={control}
            defaultValue=""
            name="reason"
            render={(props) => (
              <FormControl
                size="small"
                fullWidth
                margin="dense"
                error={!!errors.reason}
              >
                <FormLabel required>
                  Lý do từ chối ({props.value.length}/255)
                </FormLabel>
                <TextField
                  id="outlined-multiline-static"
                  multiline
                  fullWidth
                  rows={6}
                  value={props.value}
                  inputProps={{ maxLength: 255 }}
                  placeholder="Nhập lý do"
                  onChange={(e) => {
                    props.onChange(e.target.value);
                  }}
                  error={errors.reason}
                  helperText={errors.reason && errors.reason.message}
                  variant="outlined"
                  size="small"
                />
              </FormControl>
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleClose}>
            Hủy
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit(onSubmitForm)}
          >
            Đồng ý
          </Button>
        </DialogActions>
      </Dialog>
    </form>
  );
}
