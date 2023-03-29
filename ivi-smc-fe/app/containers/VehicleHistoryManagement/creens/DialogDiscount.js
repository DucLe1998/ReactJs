import React, { useState, useEffect, useMemo } from 'react';
import { Grid, DialogActions, Button } from '@material-ui/core';
import { showError } from 'utils/toast-utils';
import { getApi } from 'utils/requestUtils';
import TableCustom from 'components/TableCustom';
import Barcode from 'react-barcode';
import QRCode from 'react-qr-code';
import { API_PARKING_LOT } from '../../apiUrl';
import { useStyles } from '../styled';
import Loading from '../../Loading';
export const PaymentDetail = ({ onClose, id, setReload }) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState(null);
  let timeout = useMemo(() => undefined, []);
  const fetchDataSource = () => {
    setLoading(true);
    timeout = setTimeout(() => {
      getApi(`${API_PARKING_LOT.HISTORY_DISCOUNT}/${id}`)
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
      minWidth: 40,
      width: 'auto',
    },
    {
      dataField: 'UID',
      caption: 'UID',
      alignment: 'center',
      minWidth: 140,
      width: 'auto',
    },
    {
      dataField: 'discountId',
      caption: 'ID gói/voucher KM',
      alignment: 'center',
      minWidth: 140,
      width: 'auto',
    },
    {
      dataField: 'discountName',
      caption: 'Tên gói',
      alignment: 'center',
      minWidth: 140,
      width: 'auto',
    },
    // {
    //   dataField: 'discountTime',
    //   caption: 'Đợt voucher phát hành',
    //   format: 'dd/MM/yyyy',
    //   alignment: 'center',
    //   width: '150px',
    // },
    {
      dataField: 'amount',
      caption: 'Số tiền',
      alignment: 'center',
      format: {
        type: 'currency',
        precision: 0,
        currency: 'VND',
      },
      minWidth: 140,
      width: 'auto',
    },
    {
      dataField: 'barcode',
      caption: 'Barcode',
      alignment: 'center',
      cellRender: ({ data }) => (
        <div style={{ textAlign: 'center' }}>
          {data?.barcode && <Barcode width={1} value={data?.barcode} />}
        </div>
      ),
      minWidth: 200,
      width: 'auto',
    },
    {
      dataField: 'qrcode',
      caption: 'QR code',
      alignment: 'center',
      cellRender: ({ data }) => (
        <div style={{ textAlign: 'center' }}>
          {data?.qrcode && (
            <QRCode value={data?.qrcode} size={120} level="M" includeMargin />
          )}
        </div>
      ),
      minWidth: 120,
      width: 'auto',
    },
  ];
  return (
    <form className={classes.modal}>
      {loading && <Loading />}
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TableCustom
            data={detail?.discountList || []}
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
