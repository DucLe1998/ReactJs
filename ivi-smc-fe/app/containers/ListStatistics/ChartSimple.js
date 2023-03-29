import React, { useEffect, useState } from 'react';
import { Card, Grid } from '@material-ui/core';
import SelectBox from 'devextreme-react/select-box';
import { format } from 'date-fns';
import { useStyles } from './style';
import ChartSimpleColumn from './ChartSimpleColumn';
import Loading from '../Loading';

const humanType = 'human';

export default function ChartSimple({
  title,
  callAPI,
  argumentField,
  valueField,
  type,
  color,
  options,
  barPadding,
}) {
  const classes = useStyles();
  const defaultOption = options[0].value;
  const [dataSource, setDataSource] = useState({
    data: [],
    total: 0,
    endValue: 0,
  });
  const [option, setOption] = useState(defaultOption);
  const [loading, setLoading] = useState(true);

  const HumanAPI = option => {
    callAPI(option)
      .then(res => {
        const result = res?.data?.dataset || [];
        setDataSource({
          data: result,
          total: result.reduce(
            (accumulator, current) => accumulator + current?.numberOfEvent,
            0,
          ),
          endValue: calculateHeSo(result),
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const VehicleAPI = option => {
    callAPI(option)
      .then(res => {
        const result = res?.data;
        const list = [];
        let typeFormat = null;
        if (option === 'MONTH_6' || option === 'MONTH_12') {
          typeFormat = 'yyyy-MM';
        } else if (option === 'DAY_7' || option === 'DAY_30') {
          typeFormat = 'yyyy-MM-dd';
        } else {
          typeFormat = null;
        }
        result.forEach(element => {
          list.push({
            label: typeFormat
              ? format(new Date(element?.label), typeFormat)
              : element?.label,
            numberOfEvent: element?.totalIn + element?.totalOut,
          });
        });
        setDataSource({
          data: list || [],
          total: 0,
          endValue: calculateHeSo(list),
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    setLoading(true);
    if (type === humanType) {
      HumanAPI(option);
    } else {
      VehicleAPI(option);
    }
  }, [option]);

  return (
    <>
      {loading && <Loading />}
      <Card className={classes.card}>
        <Grid container alignItems="center">
          <Grid item xs={6}>
            <span className={classes.title}>{title}</span>
          </Grid>
          <Grid
            item
            xs={6}
            style={{
              display: 'flex',
              right: 100,
              position: 'absolute',
            }}
          >
            <SelectBox
              items={options}
              defaultValue={defaultOption}
              value={option}
              width="140px"
              displayExpr={item => (item ? item.text : '')}
              valueExpr="value"
              onValueChanged={e => {
                setOption(e.value);
              }}
            />
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={12}>
            <ChartSimpleColumn
              dataSource={dataSource.data}
              argumentField={argumentField}
              valueField={valueField}
              color={color}
              endValue={
                dataSource.endValue <= defaultHeSo
                  ? defaultHeSo
                  : dataSource.endValue
              }
              barPadding={barPadding}
            />
          </Grid>
        </Grid>
      </Card>
    </>
  );
}

const defaultHeSo = 100;
const calculateHeSo = array => {
  if (array && array.length === 0) {
    return defaultHeSo;
  }
  let value = Math.max(...array.map(o => o.numberOfEvent));
  if (value <= defaultHeSo) {
    value = defaultHeSo;
  } else if (value <= 500) {
    value = 500;
  } else if (value <= 1000) {
    value = 1000;
  } else if (value <= 5000) {
    value = 5000;
  } else if (value <= 10000) {
    value = 10000;
  } else if (value <= 50000) {
    value = 50000;
  } else if (value <= 100000) {
    value = 100000;
  }
  return value;
};
