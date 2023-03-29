/* eslint-disable react-hooks/rules-of-hooks */
import {
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  OutlinedInput,
} from '@material-ui/core';
import React, { useRef, useState } from 'react';
import PublishIcon from '@material-ui/icons/Publish';
import { makeStyles } from '@material-ui/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { callApiWithConfig } from '../../utils/requestUtils';
import { API_ROUTE } from '../../containers/apiUrl';
import { showError } from '../../utils/toast-utils';
import { getErrorMessage } from '../../containers/Common/function';

const useStyles = makeStyles({
  label: {
    height: '17px',
    lineHeight: '16px',
    fontSize: '14px',
    color: '#999999',
    margin: '5px 0',
  },
  input: {
    '& .MuiInputBase-input': {
      color: '#109CF1',
    },
    '& .MuiInputBase-input::placeholder': {
      color: 'rgba(0, 0, 0, 0.87)',
      opacity: '0.65',
    },
  },
});

export default function customInput(props) {
  const classes = useStyles();
  const inputRef = useRef();
  const { label, error, onUpload, disabled, ...otherProps } = props;
  const [loading, setLoading] = useState(false);

  const onChooseImg = async () => {
    const file = inputRef.current.files[0];
    const formData = new FormData();
    if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
      showError('Tệp phải đúng định dạng .jpg/.png');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      showError('Kích thước ảnh quá lớn');
      return;
    }
    formData.append('file', file);
    formData.append('isPublic ', true);
    setLoading(true);
    try {
      const res = await callApiWithConfig(
        `${API_ROUTE.UPLOAD_API}`,
        'POST',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      onUpload({ id: res.data.id, name: res.data.name });
    } catch (err) {
      showError(getErrorMessage(err));
      onUpload({ id: '', name: '' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container direction="column">
      <FormControl error={!!error}>
        <p className={classes.label}>
          {label}
          {!disabled && <span style={{ color: 'red' }}>*</span>}
        </p>
        <OutlinedInput
          {...otherProps}
          onClick={() => !disabled && inputRef.current?.click()}
          inputProps={{ readOnly: true }}
          className={classes.input}
          endAdornment={
            <InputAdornment position="end">
              {loading ? (
                <CircularProgress size={24} style={{ marginRight: '12px' }} />
              ) : (
                <IconButton>
                  <PublishIcon color="primary" />
                  <input
                    type="file"
                    accept=".png,.jpg"
                    hidden
                    ref={inputRef}
                    onInput={onChooseImg}
                  />
                </IconButton>
              )}
            </InputAdornment>
          }
        />
        {error && <FormHelperText>Trường thông tin bắt buộc</FormHelperText>}
      </FormControl>
    </Grid>
  );
}
