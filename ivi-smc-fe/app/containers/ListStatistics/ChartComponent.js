import React from 'react';
import { Card, Grid } from '@material-ui/core';
import ChartStackedColumn from './ChartStackedColumn';
import ChartPieDoughnut from './ChartPieDoughnut';
import { useStyles } from './style';

export default function ChartComponent({
  title,
  argumentField,
  dataSource,
  dataSourcePieDoughnut,
  barSeries,
  barPadding,
}) {
  const classes = useStyles();
  return (
    <>
      <Card className={classes.card}>
        <p className={classes.title}>
          {title} <span className={classes.secondaryColor}>(Tổng 850)</span>
        </p>
        <Grid container>
          <Grid item xs={6}>
            <p style={{ textAlign: 'center' }}>
              Số lượng {title.toString().toLowerCase()}
            </p>
            <ChartStackedColumn
              argumentField={argumentField}
              dataSource={dataSource}
              barSeries={barSeries || barSeriesS}
              barPadding={barPadding}
            />
          </Grid>
          <Grid item xs={6}>
            <p style={{ textAlign: 'center' }}>
              Tỷ trọng {title.toString().toLowerCase()}
            </p>
            <ChartPieDoughnut dataSource={dataSourcePieDoughnut} />
          </Grid>
        </Grid>
      </Card>
    </>
  );
}

const barSeriesS = [
  {
    name: 'Thấp',
    valueField: 'lower',
    color: '#14B86E',
  },
  {
    name: 'Trung bình',
    valueField: 'medium',
    color: '#F8B94A',
  },
  {
    name: 'Cao',
    valueField: 'high',
    color: '#F07A2B',
  },
  {
    name: 'Nguy hiểm',
    valueField: 'dangerous',
    color: '#FF0000',
  },
];
