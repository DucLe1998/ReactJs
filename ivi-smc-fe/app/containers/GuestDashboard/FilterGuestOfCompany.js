import { useForm } from 'react-hook-form';
import React, { useEffect } from 'react';
import { Grid } from '@material-ui/core';
import CustomSelect from 'containers/CamAiConfigHumanFaceModule/components/CustomSelect';
import BtnCancel from 'components/Button/BtnCancel';
import BtnSuccess from 'components/Button/BtnSuccess';
import { makeStyles } from '@material-ui/core/styles';

const AUTH_STATUS = [
  { id: 'ALL', name: 'Tất cả' },
  { id: 'CARD', name: 'Thẻ' },
  { id: 'FINGERPRINT', name: 'Vân tay' },
  { id: 'FACE', name: 'Khuôn mặt' },
  { id: 'NONE', name: 'Không xác định' },
];

const STATUS = [
  { id: null, name: 'Tất cả' },
  { id: 'IDENTIFIED', name: 'Đã định danh' },
  { id: 'UNIDENTIFIED', name: 'Chưa định danh' },
];

export const FilterGuestOfCompany = ({
  onClose,
  handleChangeFilter,
  initValues,
}) => {
  const classes = useStyles();

  const { handleSubmit, control, reset, errors } = useForm({
    mode: 'onChange',
  });

  const setDetailFormValue = () => {
    reset({
      identificationStatus: initValues.identificationStatus,
      status: initValues.status,
    });
  };

  useEffect(() => {
    setDetailFormValue();
  }, [initValues]);

  const onSubmit = values => {
    handleChangeFilter(values);
    onClose();
  };

  return (
    <form className={classes.root}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <p className={classes.label}>Phương thức định danh</p>
          <CustomSelect
            disableClearable
            control={control}
            errors={errors}
            name="identificationStatus"
            getOptionLabel={option => option?.name || ''}
            getOptionSelected={(option, selected) => option.id === selected.id}
            options={AUTH_STATUS}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <p className={classes.label}>Trạng thái</p>
          <CustomSelect
            disableClearable
            control={control}
            errors={errors}
            name="status"
            getOptionLabel={option => option?.name || ''}
            getOptionSelected={(option, selected) => option.id === selected.id}
            options={STATUS}
          />
        </Grid>
      </Grid>
      <Grid container style={{ marginTop: '24px' }}>
        <Grid
          item
          xs={12}
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

const useStyles = makeStyles(() => ({
  popup: {
    zIndex: '1299 !important',
    '& .title': {
      padding: '0px',
    },
  },
}));

export default FilterGuestOfCompany;
