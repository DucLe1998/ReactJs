import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormLabel,
  TextField,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { STATUS_MAP } from 'containers/Card/constants';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import CheckCircleOutlineOutlinedIcon from '@material-ui/icons/CheckCircleOutlineOutlined';
import React, { useCallback, useState } from 'react';
import { getApi, postApi } from 'utils/requestUtils';
import { API_IAM } from '../../apiUrl';
export default function DialogEditIdentity({
  open,
  handleClose,
  onSuccess,
  guestsData,
  guestIndex,
}) {
  const [cardNumber, setcardNumber] = useState();
  const [cardStatus, setcardStatus] = useState('');
  const [cardInfo, setcardInfo] = useState('');
  const guestId = guestsData[guestIndex]?.guestId;

  const onSubmitForm = () => {
    if (guestId) {
      const payload = [
        {
          userId: guestId,
          cardUserType: 'GUEST',
          cardId: cardInfo.cardId,
        },
      ];
      postApi(`${API_IAM.CARD_ASSIGN}`, payload).then((result) => {
        onSuccess(result.data[0]);
      });
    }
  };
  const checkCard = () => {
    getApi(`${API_IAM.CARD_DETAIL}`, {
      cardNum: cardNumber,
    })
      .then((res) => {
        setcardStatus(res.data?.cardStatus);
        setcardInfo(res.data);
      })
      .catch(() => {
        setcardStatus('EMPTY');
      });
  };
  const CardContent = useCallback(
    (cardStatus) => {
      switch (cardStatus) {
        case 'NEW':
        case 'AVAILABLE':
          return (
            <>
              <p>
                <CheckCircleOutlineOutlinedIcon
                  style={{
                    fontSize: '135px',
                    color: '#4caf50',
                    marginRight: '16px',
                  }}
                />
              </p>
              <p>
                Mã số thẻ chưa được định danh, bạn có thể sử dụng mã thẻ này
              </p>
            </>
          );
        case 'ACTIVE':
        case 'INACTIVE':
          return (
            <>
              <p>
                <AccountCircleOutlinedIcon
                  style={{
                    fontSize: '135px',
                    color: '#2196f3',
                    marginRight: '16px',
                  }}
                />
              </p>
              <div style={{ flex: 1 }}>
                <p>{cardInfo?.fullName}</p>
                <p>{cardInfo?.userCode}</p>
                <p>{STATUS_MAP.get(cardInfo?.cardStatus)}</p>
                <p>{cardInfo?.email}</p>
                <p>{cardInfo?.groupName}</p>
              </div>
            </>
          );
        case 'EMPTY':
          return <span>Không tìm thấy thông tin thẻ</span>;
        default:
          return null;
      }
    },
    [cardInfo],
  );
  return (
    <Dialog
      open={open}
      maxWidth="sm"
      fullWidth
      onClose={(e) => {
        handleClose(e);
      }}
    >
      <DialogTitle>Định danh thẻ</DialogTitle>
      <DialogContent
        style={{ gap: 16, display: 'flex', flexDirection: 'column' }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'end',
            gap: 16,
          }}
        >
          <div style={{ flex: 1 }}>
            <FormLabel>Nhập mã số thẻ</FormLabel>
            <TextField
              autoComplete="off"
              autoFocus
              size="small"
              type="number"
              value={cardNumber}
              inputProps={{
                maxLength: 50,
              }}
              fullWidth
              placeholder="Nhập mã số thẻ"
              variant="outlined"
              onChange={(e) => {
                setcardNumber(e.target.value);
                setcardStatus('');
              }}
            />
          </div>
          <Button
            variant="contained"
            color="primary"
            onClick={checkCard}
            style={{ height: 40 }}
          >
            Kiểm tra
          </Button>
        </div>
        {['ACTIVE', 'INACTIVE'].includes(cardStatus) && (
          <Alert severity="error">
            Mã thẻ này đã được định danh cho người dùng bên dưới, vui lòng nhập
            mã số thẻ khác
          </Alert>
        )}
        <div
          style={{
            width: '100%',
            minHeight: '223px',
            borderRadius: '16px',
            border: '1px solid rgba(0, 0, 0, 0.12)',
            background: 'rgba(238, 238, 238, 0.36)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
          }}
        >
          {CardContent(cardStatus)}
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="contained">
          Hủy
        </Button>
        <Button
          disabled={!['NEW', 'AVAILABLE'].includes(cardStatus)}
          onClick={onSubmitForm}
          variant="contained"
          color="primary"
        >
          Định danh
        </Button>
      </DialogActions>
    </Dialog>
  );
}
