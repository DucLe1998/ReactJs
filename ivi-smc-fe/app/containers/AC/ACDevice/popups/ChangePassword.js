import React from 'react';
import { Grid } from '@material-ui/core';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import utils, { validationSchema } from 'utils/utils';
import TextInput from 'components/TextInput/TextInput';
import ShowErrorValidate from 'components/TextInput/ShowErrorValidate';
import PopupCustom from 'components/Custom/popup/PopupCustom';
import { callApi } from 'utils/requestUtils';
// import { API_ROUTE } from 'containers/apiUrl';

export const ChangePassword = ({ onClose, data }) => {
  const { register, handleSubmit, errors } = useForm({
    defaultValue: {},
    resolver: validationSchema({
      newPass: yup.string().trim().required().max(50, '50 ký tự'),
      reNewPass: yup.string().trim().required().max(100, '100 ký tự'),
    }),
  });

  const onSubmit = (v) => {
    if (v.newPass !== v.reNewPass) {
      return utils.showToast('Mật khẩu mới không trùng khớp', 'error');
    }
    return callAPI(v);
  };

  const callAPI = async (v) => {
    try {
      const dto = {
        deviceIds: [data.id],
        payload: {
          command: 'CHANGE_PASSWORD',
          params: v.newPass,
        },
      };
      await callApi(
        // `${API_ROUTE.ACCESS_CONTROL_DEVICE}/devices/command`,
        'POST',
        dto,
      );
      onClose(false);
      utils.showToast('Thành công');
    } catch (error) {
      utils.showToastErrorCallApi(error);
    }
  };

  const renderShowError = (label, name) => (
    <ShowErrorValidate label={label} errors={errors} name={name} />
  );

  return (
    <PopupCustom
      onClose={onClose}
      title="Đổi mật khẩu thiết bị"
      width="510px"
      height="auto"
      body={
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextInput
                label="Mật khẩu mới *"
                name="newPass"
                type="password"
                innerRef={register()}
                showError={renderShowError}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextInput
                label="Nhập lại mật khẩu mới *"
                name="reNewPass"
                type="password"
                innerRef={register()}
                showError={renderShowError}
              />
            </Grid>
          </Grid>
        </form>
      }
      listBtnFooter={[
        {
          colorText: '#000',
          className: 'btn-cancel',
          label: 'Hủy bỏ',
          onClick: () => onClose(false),
        },
        {
          className: 'btn-save',
          label: 'Đồng ý',
          onClick: handleSubmit(onSubmit),
        },
      ]}
    />
  );
};

export default ChangePassword;
