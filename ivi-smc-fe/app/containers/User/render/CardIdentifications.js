import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import utils from 'utils/utils';
import { callApi, getApi } from 'utils/requestUtils';
import { Popup } from 'devextreme-react';
import Loading from 'containers/Loading';
import Grid from '@material-ui/core/Grid';
import VAutocomplete from 'components/VAutocomplete';
import CustomSelect from 'containers/CamAiConfigHumanFaceModule/components/CustomSelect';
import { DialogActions } from '@material-ui/core';
import BtnCancel from 'components/Button/BtnCancel';
import BtnSuccess from 'components/Button/BtnSuccess';
import { makeStyles } from '@material-ui/core/styles';
import { ACCESS_CONTROL_API_SRC } from 'containers/apiUrl';

export const CardIdentifications = ({
  onClose,
  initValues,
  dataDetail,
  callbackSuccess,
  cardNumberProps,
  type,
  handleChange,
}) => {
  const classes = useStyles();

  const [loading, setLoading] = useState(false);
  const [cardNumber, setCardNumber] = useState('');

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {},
    mode: 'onChange',
  });

  const setDetailFormValue = () => {
    reset({
      status: STATUS.find((i) => i.value === initValues.status) || STATUS[0],
      updatedAt: initValues.updatedAt,
    });
  };

  useEffect(() => {
    if (dataDetail?.cards?.length > 0) {
      setTimeout(() => {
        setCardNumber(dataDetail.cards[0]);
      }, 300);
    }
  }, [dataDetail]);

  useEffect(() => {
    setDetailFormValue();
  }, [initValues]);

  const onSubmit = async () => {
    if (!cardNumber) {
      return utils.showToast('Chưa chọn thẻ!', 'warning');
    }
    if (type === 'create') {
      handleChange(cardNumber);
    } else {
      setLoading(true);
      if (cardNumber && dataDetail?.userId) {
        try {
          await callApi(`${ACCESS_CONTROL_API_SRC}/user-cards/assign`, 'POST', {
            cardNumber: cardNumber.cardNumber,
            userId: dataDetail.userId,
          });
          onClose();
          callbackSuccess();
        } catch (error) {
          utils.showToastErrorCallApi(error);
        } finally {
          setLoading(false);
        }
      }
    }
  };

  return (
    <Popup
      className={`${classes.filter} popup`}
      visible
      title="Thông tin thẻ"
      showTitle
      onHidden={() => {
        onClose(false);
      }}
      dragEnabled
      width={600}
      height="auto"
    >
      <form className={classes.root}>
        {loading && <Loading />}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <p className={classes.label}>
              Mã số thẻ <span style={{ color: 'red' }}>*</span>
            </p>
            <VAutocomplete
              // value={cardNumber || undefined}
              defaultValue={
                type === 'create'
                  ? cardNumberProps
                  : (dataDetail?.cards && dataDetail?.cards[0]) || undefined
              }
              firstIndex={1}
              loadData={(page, keyword) =>
                new Promise((resolve, reject) => {
                  getApi(`${ACCESS_CONTROL_API_SRC}/user-cards`, {
                    keyword,
                    limit: 50,
                    page,
                    cardStatus: 'NEW',
                  })
                    .then((result) => {
                      resolve({
                        data: result.data?.rows,
                        totalCount: result.data?.count,
                      });
                    })
                    .catch((err) => reject(err));
                })
              }
              getOptionLabel={(option) => option.cardNumber}
              getOptionSelected={(option, selected) => option.id == selected.id}
              onChange={(e, newVal) => setCardNumber(newVal)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <p className={classes.label}>Trạng thái</p>
            <CustomSelect
              disableClearable
              fullWidth
              noOptionsText="Không có dữ liệu"
              getOptionLabel={(option) => option?.label || ''}
              control={control}
              errors={errors}
              name="status"
              getOptionSelected={(option, selected) =>
                option.value === selected.value
              }
              options={STATUS}
              defaultValue={STATUS[0]}
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <p className={classes.label}>Thời gian cập nhật</p>
          </Grid>
        </Grid>
        <DialogActions>
          <BtnCancel onClick={onClose}>Hủy</BtnCancel>
          <BtnSuccess
            disabled={
              dataDetail &&
              cardNumber?.cardNumber === dataDetail?.cards[0]?.cardNumber
            }
            onClick={handleSubmit(onSubmit)}
          >
            Lưu
          </BtnSuccess>
        </DialogActions>
      </form>
    </Popup>
  );
};

const STATUS = [
  { value: 'INACTIVE', label: 'Không hoạt động' },
  { value: 'ACTIVE', label: 'Đang hoạt động' },
];

const useStyles = makeStyles(() => ({
  root: {
    padding: '0px 10px',
    '& .MuiInputBase-root': {
      height: '40px',
    },
    '& .MuiInputBase-input': {
      boxSizing: 'border-box',
      height: '100%',
    },
    '& .MuiPaper-rounded': {
      borderRadius: '8px',
    },
    '& .MuiDialogActions-root': {
      padding: '32px',
    },
  },
  label: {
    fontWeight: '500',
    height: '17px',
    lineHeight: '16px',
    fontSize: '14px',
    color: '#999999',
    margin: '5px 0',
  },
  button: {
    padding: '12px 16px',
    border: 'none',
    outline: 'none',
    lineHeight: '16px',
    borderRadius: '8px',
    cursor: 'pointer',
    minWidth: '104px',
    boxSizing: 'border-box',
  },
  iconBtnHeader: {
    backgroundColor: 'rgba(116, 116, 128, 0.08)',
    height: 36,
    width: 36,
    borderRadius: 6,
  },
  popup: {
    zIndex: '1299 !important',
    '& .dx-popup-content': {
      padding: '0px 36px',
    },
    '& .title': {
      padding: '0px',
    },
  },
  uploadImageContainer: {
    width: '100%',
    borderRadius: '12px',
    height: '186px',
    display: 'flex',
    justifyContent: 'center',
  },
}));

export default CardIdentifications;
