import React, { useEffect, useState } from 'react';
import { Card, Grid } from '@material-ui/core';
import { getApi } from '../../utils/requestUtils';
import { API_ACCESS_CONTROL, API_PARKING } from '../apiUrl';
import Time from './Time';
import { useStyles } from './style';

export default function GiamSat() {
  const classes = useStyles();
  const [dataAc, setDataAc] = useState({
    totalEmployeeEvent: 0,
    totalGuestEvent: 0,
  });
  const [dataParking, setDataParking] = useState(0);
  const [isLoad, setIsLoad] = useState(0);

  useEffect(() => {
    getApi(API_ACCESS_CONTROL.LIST_EVENT_SUMMARY_STATISTICS).then(response => {
      setDataAc(response.data);
    });

    getApi(
      API_PARKING.GET_IN_OUT(
        +process.env.AREA_ID,
        +process.env.BLOCK_ID,
        'DAY_7',
      ),
    ).then(result => {
      const totalParkingEvent = result.data[result.data.length - 1];
      const value = totalParkingEvent?.totalIn + totalParkingEvent?.totalOut;
      setDataParking(value);
    });
  }, [isLoad]);

  return (
    <>
      <Card className={classes.card}>
        <Grid container alignItems="center">
          <Grid item xs>
            <span className={classes.title}>
              Giám sát lưu thông trong ngày hôm nay
            </span>
          </Grid>
          <Grid item xs>
            <Grid container justify="flex-end" alignItems="center">
              <Time setIsLoad={setIsLoad} />
            </Grid>
          </Grid>
        </Grid>
        <Grid
          container
          spacing={3}
          direction="row"
          justify="space-around"
          alignItems="center"
          style={{ textAlign: 'center' }}
        >
          <Grid item xs>
            <p className={classes.labelInOut}>
              Số lượt nhân viên ra vào tòa nhà
            </p>
            <p className={classes.numberValue}>
              {dataAc?.totalEmployeeEvent || 0}
            </p>
          </Grid>
          <Grid item xs>
            <p className={classes.labelInOut}>Số lượt khách ra vào tòa nhà</p>
            <p className={classes.numberValue}>
              {dataAc?.totalGuestEvent || 0}
            </p>
          </Grid>
          <Grid item xs>
            <p className={classes.labelInOut}>
              Số lượt phương tiện ra vào bãi gửi xe
            </p>
            <p className={classes.numberValue}>{dataParking}</p>
          </Grid>
        </Grid>
      </Card>
    </>
  );
}
