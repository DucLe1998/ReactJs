import {
  Button,
  DialogActions,
  DialogContent,
  FormControl,
  FormHelperText,
  FormLabel,
  OutlinedInput,
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { useFormik } from 'formik';
import React from 'react';
import { useIntl } from 'react-intl';
import * as yup from 'yup';
import btnMsg from '../Common/Messages/button';
import { WARNING_STATUS } from './constants';
import messages from './messages';

export default function EditPopup({ onSubmit }) {
  const { formatMessage } = useIntl();
  const validationSchema = yup.object({
    description: yup
      .string('Ghi chú')
      .trim()
      .required(formatMessage({ id: 'app.invalid.required' }))
      // eslint-disable-next-line no-template-curly-in-string
      .max(255, formatMessage({ id: 'app.invalid.maxLength' }, { max: 255 })),
  });
  const formik = useFormik({
    initialValues: {
      status: WARNING_STATUS[0],
      description: '',
    },
    validationSchema,
    onSubmit: values => {
      onSubmit(values);
    },
  });
  return (
    <form onSubmit={formik.handleSubmit}>
      <DialogContent style={{ paddingTop: 0 }}>
        <FormControl fullWidth margin="none">
          <FormLabel>{formatMessage({ id: 'app.column.status' })}</FormLabel>
          <Autocomplete
            id="combo-box-status"
            name="status"
            size="small"
            value={formik.values.status}
            disableClearable
            options={WARNING_STATUS}
            getOptionLabel={option => formatMessage(option.text) || ''}
            getOptionSelected={(option, selected) => option.id == selected.id}
            renderInput={params => (
              <OutlinedInput
                ref={params.InputProps.ref}
                inputProps={params.inputProps}
                {...params.InputProps}
                fullWidth
                margin="dense"
              />
            )}
            onChange={(e, newVal) => formik.setFieldValue('status', newVal)}
            noOptionsText={formatMessage({ id: 'app.no_data' })}
          />
        </FormControl>
        <FormControl
          size="small"
          margin="dense"
          fullWidth
          error={
            formik.touched.description && Boolean(formik.errors.description)
          }
        >
          <FormLabel required>
            {formatMessage(messages.column_description)}
          </FormLabel>
          <OutlinedInput
            margin="dense"
            multiline
            rows={4}
            name="description"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <FormHelperText>
            {formik.touched.description && formik.errors.description}
          </FormHelperText>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button color="default" variant="contained" onClick={() => onSubmit(0)}>
          {formatMessage(btnMsg.cancel)}
        </Button>
        <Button color="primary" variant="contained" type="submit">
          {formatMessage(btnMsg.save)}
        </Button>
      </DialogActions>
    </form>
  );
}
