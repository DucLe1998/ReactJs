import React from 'react';
import {
  Chart,
  Series,
  Legend,
  CommonSeriesSettings,
  ValueAxis,
  Tooltip,
  VisualRange,
  Label,
  ArgumentAxis,
} from 'devextreme-react/chart';

export default function ChartSimpleColumn({
  dataSource,
  argumentField,
  valueField,
  color,
  endValue,
  barPadding = 0.7,
}) {
  return (
    <>
      <Chart id="chart" dataSource={dataSource}>
        <CommonSeriesSettings barPadding={barPadding} />
        <Series
          argumentField={argumentField}
          valueField={valueField}
          color={color}
          type="bar"
        />
        <ValueAxis position="left">
          <VisualRange startValue={0} endValue={endValue} />
          <Label customizeText={customizeText} />
        </ValueAxis>
        <ArgumentAxis>
          <Label rotationAngle={-45} overlappingBehavior="rotate" />
        </ArgumentAxis>
        <Legend horizontalAlignment="right" margin={margin} />
        <Tooltip
          enabled
          location="edge"
          shared
          customizeTooltip={customizeTooltip}
        />
      </Chart>
    </>
  );
}
const customizeText = arg => `          ${arg.value.toString()}`;
const customizeTooltip = arg => ({
  text: `${arg.totalText}`,
});
const margin = {
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
};
