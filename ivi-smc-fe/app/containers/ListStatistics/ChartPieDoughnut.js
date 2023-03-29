import React from 'react';
import PieChart, {
  Legend,
  Series,
  Tooltip,
  Label,
  Connector,
  Size,
} from 'devextreme-react/pie-chart';
import { useStyles } from './style';

export default function ChartPieDoughnut({ dataSource }) {
  const classes = useStyles();
  const customizeTooltip = arg => {
    const { value } = dataSource.filter(
      item => item.name === arg.originalArgument,
    )[0];
    return {
      text: `${(arg.percent * 100).toFixed(0)}% - ${value}`,
    };
  };
  const customizeLabel = point => `${point.valueText}%`;
  return (
    <>
      <PieChart
        id="pie"
        type="doughnut"
        palette={['#14B86E', '#F8B94A', '#F07A2B', '#FF0000']}
        dataSource={dataSource}
        adaptiveLayout={{
          width: 150,
        }}
        className={classes.pieDoughnut}
      >
        <Series argumentField="name" valueField="percent">
          <Label visible format="fixedPoint" customizeText={customizeLabel}>
            <Connector visible width={1} />
          </Label>
        </Series>
        <Size height={380} />
        <Tooltip enabled customizeTooltip={arg => customizeTooltip(arg)} />
        <Legend horizontalAlignment="center" verticalAlignment="bottom" />
      </PieChart>
    </>
  );
}
