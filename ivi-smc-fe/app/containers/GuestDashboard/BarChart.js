// import { callApi } from 'utils/requestUtils';
// import { API_DASHBOARD } from 'containers/apiUrl';
import styled from 'styled-components';
// import { makeStyles } from '@material-ui/core/styles';
// import CircleProgress from 'components/CircleProgress';
// import { Typography, Link } from '@material-ui/core';
import { Link } from 'react-router-dom';
// import { subDays, startOfDay } from 'date-fns';
import faker from 'faker';

import {
  Chart,
  CommonSeriesSettings,
  ValueAxis,
  // Title,
  Export,
  Legend,
  Series,
  Tooltip,
  CommonAxisSettings,
  Size,
} from 'devextreme-react/chart';
// import faker from 'faker';
import React, { useEffect, useRef, useState } from 'react';
// import useInterval from 'react-useinterval';
import { showError } from 'utils/toast-utils';
import { getErrorMessage } from 'containers/Common/function';
import { getApi } from 'utils/requestUtils';
import { GUEST_DASHBOARD } from 'containers/apiUrl';
import { pickBy } from 'lodash';
import CircularProgress from '@material-ui/core/CircularProgress';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import TitleChart from './TitleChart';
import { DEFAULT_SERIES, TIME_TYPES } from './constants';

const ChartContainer = styled.div`
  background-color: white;
  padding: 24px 30px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  & .dxc-val-elements text {
    /* fill: rgba(255, 255, 255, 0.8) !important; */
    font-size: 14px !important;
    font-weight: normal !important;
  }

  & .dxc-arg-elements text {
    /* fill: rgba(255, 255, 255, 0.8) !important; */
    font-size: 14px !important;
    font-weight: normal !important;
  }
  & .dxc-legend text {
    /* fill: rgba(255, 255, 255, 0.8) !important; */
    font-size: 14px !important;
    font-weight: normal !important;
  }
  & .dxc-arg-line {
    display: none;
  }
  & .dxc-val-line {
    display: none;
  }
`;

export default function BarChart({ title = 'Tiêu đề' }) {
  const [data, setData] = useState({});
  const [timeType, setTimeType] = useState(TIME_TYPES[0].value);
  const [chartCols, setChartCols] = useState(DEFAULT_SERIES);
  const [loading, setLoading] = useState(false);
  const [isFirstLoad, setIsFirsLoad] = useState(true);
  const chartRef = useRef(null);

  const fetchData = async () => {
    if (isFirstLoad) {
      setLoading(true);
    }
    try {
      const payload = {
        timeType,
      };
      const response = await getApi(
        GUEST_DASHBOARD.GUEST_STATISTIC_CHART,
        pickBy(payload),
      );
      // convert data
      const previewData = (response?.data?.assets || []).map(data => {
        const name = data.timeLabel;
        return {
          type: name,
          TOTALGUEST: data?.guestTotal || 0,
          ARRIVED: data?.arrivedTotal || 0,
          AVAIABLED: data?.activeTotal || 0,
          EXPIRED: data?.inactiveTotal || 0,
          FACES: data?.faceTotal || 0,
          CARDS: data?.cardTotal || 0,
          FINGERPRINTS: data?.fingerTotal || 0,
        };
      });
      setData(previewData);
    } catch (error) {
      showError(getErrorMessage(error));
    } finally {
      if (isFirstLoad) {
        setLoading(false);
      }
    }
  };
  const customizeTooltip = arg => ({
    text: `${arg.seriesName}: ${arg.valueText}`,
  });

  const onChangeType = data => {
    const checkedCodes =
      data.filter(col => col.checked === true).map(col => col.code) || [];
    const newSeries = DEFAULT_SERIES.filter(serie =>
      checkedCodes.includes(serie.code),
    );
    setChartCols(newSeries);
  };

  const onChangeTimeType = data => {
    setTimeType(data);
  };

  useEffect(() => {
    fetchData();
  }, [timeType]);

  useEffect(() => {
    setIsFirsLoad(false);
  }, []);

  return (
    <ChartContainer>
      <TitleChart
        title={title}
        onChangeType={data => onChangeType(data)}
        onChangeTimeType={data => onChangeTimeType(data)}
      />
      {loading ? (
        <div
          style={{ display: 'flex', width: '100%', justifyContent: 'center' }}
        >
          <CircularProgress />
        </div>
      ) : (
        <Chart
          id="chart"
          style={{ color: 'rgba(255,266,255,0.8)' }}
          dataSource={data || []}
          // onLegendClick={legendClickHandler}
          ref={chartRef}
        >
          {/* <Size width="100%" /> */}
          <CommonAxisSettings
            grid={{ color: 'rgb(94, 129, 244)', opacity: '0.1' }}
          />
          <CommonSeriesSettings
            argumentField="type"
            type="bar"
            barPadding={0.3}
          />
          {React.Children.toArray(
            chartCols.map(s => (
              <Series valueField={s.code} name={s.name} color={s.color} />
            )),
          )}
          <ValueAxis
            visible
            autoBreaksEnabled={false}
            maxAutoBreakCount={3}
            breakStyle={{ line: 'straight' }}
          />
          <Legend
            verticalAlignment="bottom"
            horizontalAlignment="left"
            itemTextPosition="right"
            orientation="horizontal"
            position="outside"
          />
          <Export enabled={false} />
          <Tooltip
            enabled
            location="edge"
            // contentRender={TooltipTemplate}
            customizeTooltip={customizeTooltip}
            // shared
          />
        </Chart>
      )}
    </ChartContainer>
  );
}

// const TooltipTemplate = info => (
//   <div className="state-tooltip">
//     <div className="capital">
//       <span className="caption">Capital</span>
//     </div>
//     <div className="population">
//       <span className="caption">Population</span>
//     </div>
//     <div>
//       <span className="caption">Area</span>
//     </div>
//   </div>
// );
