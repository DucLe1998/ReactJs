/* eslint-disable react/prop-types,no-param-reassign,no-unused-expressions,no-dupe-keys */
import React from 'react';
import { useIntl } from 'react-intl';
import Grid from '@material-ui/core/Grid';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';

import PopupCustom from 'components/Custom/popup/PopupCustom';
import TextInput from 'components/TextInput/TextInput';
import { validationSchema } from 'utils/utils';
import ShowErrorValidate from 'components/TextInput/ShowErrorValidate';
import TextArea from '../../../../../../components/TextInput/TextArea';

const PopupFormEngineImage = ({ onClose, onClickSave }) => {
  const intl = useIntl();

  const { register, handleSubmit, errors } = useForm({
    resolver: validationSchema({
      name: yup
        .string()
        .trim()
        .required()
        .max(100, '100 ký tự'),
      version: yup
        .string()
        .trim()
        .required()
        .max(100, '100 ký tự'),
    }),
  });

  const onSave = v => {
    onClickSave(v);
  };

  const renderShowError = (label, name) => (
    <ShowErrorValidate label={label} errors={errors} name={name} />
  );

  return (
    <PopupCustom
      onClose={onClose}
      title="Create new engine image"
      width="50%"
      closeOnOutsideClick
      body={
        <>
          <Grid container spacing={4}>
            <Grid item sm={6}>
              <TextInput
                label="Name *"
                defaultValue=""
                name="name"
                innerRef={register}
                showError={renderShowError}
              />
              <TextInput
                label="Version *"
                defaultValue=""
                name="version"
                innerRef={register}
                showError={renderShowError}
              />
            </Grid>
            <Grid item sm={6}>
              <TextInput
                label="Engine Type *"
                defaultValue=""
                name="EngineType"
                innerRef={register}
                showError={renderShowError}
              />
              <TextInput
                label="Registry"
                defaultValue=""
                name="Registry"
                innerRef={register}
                showError={renderShowError}
              />
            </Grid>
          </Grid>
          <TextInput
            label="Repository *"
            defaultValue=""
            name="repository"
            innerRef={register}
            showError={renderShowError}
          />
          <TextArea
            label="Default param"
            defaultValue=""
            name="Default param"
            innerRef={register}
            showError={renderShowError}
            placeholderHidden
            rows={3}
          />
          <TextArea
            label="Cấu hình mặc định"
            defaultValue=""
            name="Defaultconfig"
            innerRef={register}
            showError={renderShowError}
            placeholderHidden
            rows={8}
          />
          <TextArea
            label="Change log"
            defaultValue=""
            name="Change log"
            innerRef={register}
            showError={renderShowError}
            placeholderHidden
            rows={3}
          />
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
          label: intl.formatMessage({ id: 'app.tooltip.add' }),
          onClick: handleSubmit(onSave),
        },
      ]}
    />
  );
};

export default PopupFormEngineImage;
