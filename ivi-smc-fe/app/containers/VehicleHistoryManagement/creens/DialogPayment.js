import React, { useState, useEffect } from 'react';
import { Grid, DialogActions, Button } from '@material-ui/core';
import { showError } from 'utils/toast-utils';
import { getApi } from 'utils/requestUtils';
import TableCustom from 'components/TableCustom';
import { API_PARKING_LOT } from '../../apiUrl';
import { useStyles } from '../styled';
import Loading from '../../Loading';
export const PaymentDetail = ({ onClose, id, setReload }) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState(null);
  const fetchDataSource = () => {
    setLoading(true);
    setTimeout(() => {
      getApi(`${API_PARKING_LOT.HISTORY_PAYMENT}/${id}`)
        .then((response) => {
          setLoading(true);
          const setData = response;
          setDetail(setData);
        })
        .catch((err) => {
          showError(err);
        })
        .finally(() => {
          setLoading(false);
        });
    }, 500);
  };
  useEffect(() => {
    if (id) {
      fetchDataSource();
    }
  }, [id]);
  const columns = [
    {
      caption: 'STT',
      alignment: 'center',
      cellRender: (props) => props?.rowIndex + 1,
      width: '80px',
    },
    {
      dataField: 'vehHistoryId',
      caption: 'UID',
      alignment: 'center',
      width: '80px',
    },
    {
      dataField: 'amountId',
      caption: 'ID gói thanh toán',
      alignment: 'center',
      width: '180px',
    },
    {
      dataField: 'orderId',
      caption: 'OrderId',
      alignment: 'center',
      width: '100px',
    },
    {
      dataField: 'transactionID',
      caption: 'TransactionID',
      alignment: 'center',
      width: '150px',
    },
    {
      dataField: 'amount',
      caption: 'Số tiền',
      format: {
        type: 'currency',
        precision: 0,
        currency: 'VND',
      },
      alignment: 'center',
      width: '120px',
    },
    {
      dataField: 'payMethod',
      caption: 'Phương thức thanh toán',
      alignment: 'center',
      width: 'auto',
    },
  ];
  return (
    <form className={classes.modal}>
      {loading && <Loading />}
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TableCustom
            data={detail?.paymentList || []}
            columns={columns}
            style={{
              maxHeight: 'calc(100vh - 215px)',
              width: '100%',
            }}
          />
        </Grid>
      </Grid>
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="primary">
          Đóng
        </Button>
      </DialogActions>
    </form>
  );
};

export default PaymentDetail;
