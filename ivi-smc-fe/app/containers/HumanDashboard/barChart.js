/* eslint-disable jsx-a11y/anchor-is-valid */
import { Link, Paper, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import useAxios from 'axios-hooks';
import VAutocomplete from 'components/VAutocomplete';
import { format } from 'date-fns';
import {
  ArgumentAxis,
  Chart,
  Label,
  Legend,
  Margin,
  Series,
  Tooltip,
} from 'devextreme-react/chart';
import SelectBox from 'devextreme-react/select-box';
// import faker from 'faker';
import React, { useEffect, useState } from 'react';
import { getApi } from 'utils/requestUtils';
import { API_IAM, IAM_API_SRC } from '../apiUrl';
import { BACKDATE_ITEM, STATISTIC_ITEM } from './constants';

const useStyles = makeStyles(theme => ({
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: theme.spacing(2, 0),
  },
  paper: {
    padding: theme.spacing(2),
    position: 'relative',
  },
  toolbar: {
    position: 'absolute',
    display: 'flex',
    width: 'calc(100% - 32px)',
    justifyContent: 'space-between',
    alignItems: 'end',
  },
}));

export default function BarChart() {
  const [backDate, setBackDate] = useState(BACKDATE_ITEM[0]);
  const classes = useStyles();
  const [company, setCompany] = useState({});

  // const fakeData = new Array(7).fill().map(() => ({
  //   value: faker.datatype.number(),
  //   label: faker.date.recent().toLocaleString(),
  // }));
  const [chartData, setChartData] = useState([]);
  const [{ data: getChartData }, executeGetChartData] = useAxios(
    API_IAM.COMPANY_DASHBOARD,
    {
      useCache: false,
      manual: true,
    },
  );
  useEffect(() => {
    executeGetChartData({
      params: {
        orgUnitId: company?.orgUnitId,
        timeType: backDate.key,
      },
    });
  }, [backDate, company]);
  useEffect(() => {
    if (getChartData) setChartData(getChartData?.assets || []);
  }, [getChartData]);
  return (
    <div>
      <div className={classes.header}>
        <Typography component="span" variant="h5" color="textPrimary">
          Biểu đồ thống kê
        </Typography>
        <Link
          component="button"
          variant="subtitle2"
          color="textSecondary"
          // disabled={getStatisticLoading}
          // underline="none"
          onClick={executeGetChartData}
        >
          Cập nhật lúc {format(new Date(), 'HH:mm - dd/MM/yyy')}
        </Link>
      </div>
      <Paper className={classes.paper}>
        <div className={classes.toolbar}>
          <VAutocomplete
            id="combo-box-orgUnits"
            name="orgUnits"
            style={{ width: '250px' }}
            value={company}
            placeholder="Chọn đơn vị"
            loadData={(page, keyword) =>
              new Promise((resolve, reject) => {
                getApi(`${IAM_API_SRC}/org-units`, {
                  keyword,
                  limit: 50,
                  page,
                  sort: ['orgUnitName'],
                  status: 'ACTIVE',
                })
                  .then(result => {
                    resolve({
                      data: result.data.rows,
                      totalCount: result.data.count,
                    });
                  })
                  .catch(err => reject(err));
              })
            }
            getOptionLabel={option => option?.orgUnitName || ''}
            getOptionSelected={(option, selected) =>
              option.orgUnitId == selected.orgUnitId
            }
            onChange={(e, newVal) => setCompany(newVal)}
            getOptionDisabled={option => option.status == 'INACTIVE'}
          />
          <SelectBox
            items={BACKDATE_ITEM}
            value={backDate}
            width="140px"
            displayExpr="label"
            onValueChanged={e => {
              setBackDate(e.value);
            }}
          />
        </div>
        <Chart id="chart" dataSource={chartData} palette="Ocean">
          {React.Children.toArray(
            STATISTIC_ITEM.filter(i => i.line).map(item => (
              <Series
                valueField={item.key}
                name={item.label}
                argumentField="timeLabel"
                type="line"
                color={item.color}
                // barPadding={0.5}
                // barWidth={36}
              />
            )),
          )}
          <Margin top={12} />
          <ArgumentAxis>
            <Label rotationAngle={-45} overlappingBehavior="rotate" />
          </ArgumentAxis>
          <Legend
            verticalAlignment="top"
            horizontalAlignment="center"
            itemTextPosition="right"
          />
          <Tooltip enabled location="edge" />
        </Chart>
      </Paper>
    </div>
  );
}
