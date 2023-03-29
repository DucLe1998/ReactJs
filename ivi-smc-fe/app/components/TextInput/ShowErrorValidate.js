/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { Fragment } from 'react';

const ShowErrorValidate = ({ label, name, errors }) => {
  if (errors[name] && errors[name].type === 'typeError') {
    return (
      <Fragment>
        <label style={styles.error}>{`${label} không được bỏ trống`}</label>
      </Fragment>
    );
  }

  return (
    <Fragment>
      {errors[name] && errors[name].type === 'email' && (
        <label style={styles.error}>Email không đúng định dạng</label>
      )}
      {errors[name] && errors[name].type === 'matches' && (
        <label style={styles.error}>{`${label} ${errors[name].message}`}</label>
      )}
      {errors[name] && errors[name].type === 'required' && (
        <label style={styles.error}>Trường thông tin bắt buộc nhập</label>
      )}
      {errors[name] && errors[name].type === 'length' && (
        <label style={styles.error}>
          {`Độ dài là: ${errors[name].message} ký tự`}
        </label>
      )}
      {errors[name] && errors[name].type === 'min' && (
        <label style={styles.error}>
          {`${label} phải lớn hơn ${errors[name].message}`}
        </label>
      )}
      {errors[name] && errors[name].type === 'max' && (
        <label style={styles.error}>
          {`${label} không vượt quá ${errors[name].message}`}
        </label>
      )}
      {errors[name] && errors[name].type === 'json' && (
        <label style={styles.error}>Invalid JSON format</label>
      )}
    </Fragment>
  );
};

const styles = {
  error: {
    color: 'red',
  },
};

export default ShowErrorValidate;
