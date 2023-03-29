import {
  Button,
  DialogActions,
  FormControl,
  FormHelperText,
  FormLabel,
  MenuItem,
  OutlinedInput,
  Select,
} from '@material-ui/core';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import CheckCircleOutlineOutlinedIcon from '@material-ui/icons/CheckCircleOutlineOutlined';
import useAxios from 'axios-hooks';
import LoadingIndicator from 'components/LoadingIndicator';
import { getErrorMessage } from 'containers/Common/function';
import React, { Fragment, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { API_DETAIL_USER_IDENTITY } from '../../apiUrl';
import messages from '../messages';

const cardTypes = [
  { value: 'PROXIMITY', disabled: true },
  { value: 'MIFARE', disabled: false },
  { value: 'UHF', disabled: true },
];

export function VerifyIdentifi({ onSubmit }) {
  const intl = useIntl();
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardType: cardTypes[1].value,
  });
  const [errForm, setErrForm] = useState({});
  const [valid, setValid] = useState(false);
  const [data, setData] = useState(null);
  const [{ loading, error, data: cardData }, excecuteVerify] = useAxios(
    { method: 'GET' },
    {
      manual: true,
    },
  );
  useEffect(() => {
    if (cardData) {
      if (cardData.userId) {
        setData(cardData);
        setValid(false);
      } else {
        setData(null);
        setValid(true);
      }
    }
  }, [cardData]);
  useEffect(() => {
    if (error) {
      setData(null);
      setValid(false);
      // showError(error);
    }
  }, [error]);
  const onChangeCardType = e => {
    setFormData({ ...formData, cardType: e.value });
  };
  const RegexCard = /^[0-9]+$/;
  const validate = data => {
    const err = {};
    const cardNumber = data.cardNumber.trim();
    setFormData({ ...formData, cardNumber });
    if (!cardNumber.length) {
      err.cardNumber = 'Mã thẻ không được để trống';
    } else if (!RegexCard.test(cardNumber)) {
      err.cardNumber = 'Mã thẻ chỉ chứa chữ số';
    }
    setErrForm(err);
    return Object.keys(err).length;
  };
  const onClickVerifyBtn = async () => {
    const notValid = validate(formData);
    if (!notValid) {
      excecuteVerify({
        url: API_DETAIL_USER_IDENTITY.VERIFY_CARD(formData.cardNumber),
      });
    }
  };
  return (
    <React.Fragment>
      <div
        style={{
          display: 'flex',
          gap: '8px',
          justifyContent: 'space-between',
        }}
      >
        <FormControl
          error={Boolean(errForm.cardNumber)}
          size="small"
          margin="none"
          fullWidth
        >
          <FormLabel required>
            {intl.formatMessage(messages.cardNumber)}
          </FormLabel>
          <OutlinedInput
            id="cardNumber"
            name="cardNumber"
            placeholder={intl.formatMessage(messages.cardNumber)}
            value={formData.cardNumber}
            onChange={e => {
              setFormData({ ...formData, cardNumber: e.target.value });
            }}
            disabled={loading}
          />
          <FormHelperText>{errForm.cardNumber}</FormHelperText>
        </FormControl>
        <FormControl variant="outlined" size="small" margin="none" fullWidth>
          <FormLabel>Loại thẻ</FormLabel>
          <Select
            value={formData.cardType}
            onChanged={onChangeCardType}
            autoWidth
            disabled={loading}
          >
            {cardTypes.map(item => (
              <MenuItem value={item.value} disabled={item.disabled}>
                {item.value}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText />
        </FormControl>
        <Button
          variant="contained"
          color="primary"
          style={{ height: '40px', minWidth: '100px', marginTop: '21px' }}
          disabled={loading}
          onClick={() => {
            onClickVerifyBtn();
          }}
        >
          Kiểm tra
        </Button>
      </div>
      <div>
        {error && (
          <span style={{ color: 'red' }}>{getErrorMessage(error)}</span>
        )}
        {!loading && data && typeof data == 'object' && (
          <div
            style={{
              color: 'red',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            Mã thẻ này đã được định danh cho người dùng bên dưới, vui lòng nhập
            mã số thẻ khác
          </div>
        )}
        <div
          style={{
            height: '280px',
            width: '100%',
            borderRadius: '16px',
            padding: '5px 50px',
            background: '#EEEEEE',
            margin: '24px 0',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {loading ? (
            <LoadingIndicator />
          ) : (
            <Fragment>
              {valid && (
                <Fragment>
                  <CheckCircleOutlineOutlinedIcon
                    style={{
                      fontSize: '135px',
                      color: '#4caf50',
                      marginRight: '16px',
                    }}
                  />
                  <span>
                    Mã số thẻ chưa được định danh, bạn có thể sử dụng mã thẻ này
                  </span>
                </Fragment>
              )}
              {data && typeof data == 'object' && (
                <Fragment>
                  <AccountCircleOutlinedIcon
                    style={{
                      fontSize: '135px',
                      color: '#2196f3',
                      marginRight: '16px',
                    }}
                  />
                  <div>
                    <p>
                      <b>Tên: {data.fullName}</b>
                    </p>
                    <p>
                      <b>MSNV: {data.employeeCode}</b>
                    </p>
                    <p>
                      <b>
                        Trạng thái:{' '}
                        {data.status === 'ACTIVE'
                          ? 'Hoạt động'
                          : 'Không hoạt động'}
                      </b>
                    </p>
                    <p>
                      <b>Email: {data.email}</b>
                    </p>
                    <p>
                      <b>Đơn vị/ Công ty: {data.companyName}</b>
                    </p>
                  </div>
                </Fragment>
              )}
            </Fragment>
          )}
        </div>
      </div>
      <DialogActions>
        <Button onClick={() => onSubmit(0)} variant="contained">
          {intl.formatMessage(messages.btnCancel)}
        </Button>
        <Button
          variant="contained"
          color="primary"
          disabled={!valid}
          onClick={() => {
            onSubmit({
              cardNumber: formData.cardNumber,
              cardType: formData.cardType,
              // identifyMethod: IDENTIFY_TYPES.CARD.id,
            });
          }}
        >
          {intl.formatMessage(messages.identify)}
        </Button>
      </DialogActions>
    </React.Fragment>
  );
}

export default VerifyIdentifi;
