import React from 'react';
import {
  Chart,
  Series,
  Legend,
  CommonSeriesSettings,
  ValueAxis,
  Tooltip,
} from 'devextreme-react/chart';

export default function ChartStackedColumn({
  dataSource,
  argumentField,
  barSeries,
  barPadding = 0.7,
}) {
  return (
    <>
      <Chart id="chart" dataSource={dataSource}>
        <CommonSeriesSettings
          argumentField={argumentField}
          barPadding={barPadding}
          type="stackedBar"
        />
        {barSeries.map(item => (
          <Series
            valueField={item.valueField}
            name={item.name}
            color={item.color}
          />
        ))}
        <ValueAxis position="left" />
        <Legend horizontalAlignment="right" margin={margin} />
        <Tooltip enabled location="edge" customizeTooltip={customizeTooltip} />
      </Chart>
    </>
  );
}

const customizeTooltip = arg => ({
  text: `${arg.seriesName} - ${arg.valueText}`,
});
const margin = {
  top: 100,
  left: 75,
  right: 0,
  bottom: 0,
};
