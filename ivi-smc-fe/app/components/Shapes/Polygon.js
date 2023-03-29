import { alpha } from '@material-ui/core/styles';
import _ from 'lodash';
import React, { PureComponent } from 'react';
import { Circle, Group, Line } from 'react-konva';
import { euclideanDistance } from './helpers';
class Main extends PureComponent {
  state = {
    points: _.chunk(this.props.points, 2),
    scale: 1,
  };

  componentDidMount() {
    this.setScale();
  }

  setScale = () => {
    const stage = this.line?.getStage();
    if (stage) {
      this.setState({ scale: stage.scaleX() });
    }
  };

  componentDidUpdate(prevProps) {
    if (this.props.points !== prevProps.points) {
      this.setState({ points: _.chunk(this.props.points, 2) });
    }
    this.setScale();
  }

  addPoint = (event) => {
    const { layerX, layerY } = event;
    // console.log(event)
    const stage = this.line.getStage();
    // console.log()
    const { points } = this.state;
    const newPoint = [
      layerX / stage.scaleX() + stage.offsetX(),
      layerY / stage.scaleY() + stage.offsetY(),
    ];
    // return
    let temp = null;
    let index = -1;
    for (let i = 0; i < points.length; i++) {
      const point = points[i];
      let nextPoint = points[i + 1];
      if (!nextPoint) [nextPoint] = points;
      const dist1 = euclideanDistance(point, newPoint);
      const dist2 = euclideanDistance(newPoint, nextPoint);
      const dist = euclideanDistance(point, nextPoint);
      const sub = dist1 + dist2 - dist;
      // console.log(sub)
      if (!temp || sub < temp) {
        temp = sub;
        index = i + 1;
      }
    }
    points.splice(index, 0, newPoint);
    this.props.onTransform({ points: _.flatten(points) });
  };

  onRemovePoint = (rP) => {
    const { points } = this.state;
    if (points.length <= 3) return;
    const foundIndex = points.findIndex(
      (p) => p[0] === rP[0] && p[1] === rP[1],
    );
    points.splice(foundIndex, 1);
    this.props.onTransform({ points: _.flatten(points) });
  };

  _onDragMove = (e) => {
    const { points } = this.state;
    const { bound } = this.props;
    const shape = e.target;
    const x = _.clamp(shape.x(), 0, bound.width);
    const y = _.clamp(shape.y(), 0, bound.height);
    const point = [x, y];
    points[Number(e.target.name())] = point;
    this.setState({ points: [...points] });
  };

  _onDragEnd = () => {
    const { points } = this.state;
    this.props.onTransform({ points: _.flatten(points) });
  };

  _onGroupDragMove = (e) => {
    const shape = e.target;
    if (shape.nodeType === 'Group') {
      const { bound } = this.props;
      const pos = shape.getPosition();
      const newPos = { ...pos };
      const circles = shape.children
        .filter((c) => c.className == 'Circle')
        .map((node) => node.getPosition());
      const xArr = circles.map((c) => c.x);
      const yArr = circles.map((c) => c.y);
      const minX = _.min(xArr);
      const minY = _.min(yArr);
      const maxX = _.max(xArr);
      const maxY = _.max(yArr);
      if (minX + pos.x < 0) {
        newPos.x = -minX;
      }
      if (minY + pos.y < 0) {
        newPos.y = -minY;
      }
      if (maxX + pos.x > bound.width) {
        newPos.x = bound.width - maxX;
      }
      if (maxY + pos.y > bound.height) {
        newPos.y = bound.height - maxY;
      }
      shape.setPosition(newPos);
    }
  };

  _onGroupDragEnd = (e) => {
    const { points } = this.state;
    const shape = e.target;
    if (shape.nodeType === 'Group') {
      const pos = shape.getPosition();
      this.props.onTransform({
        points: _.flatten(
          points.map((p) => {
            p[0] += pos.x;
            p[1] += pos.y;
            return p;
          }),
        ),
      });
      shape.x(0);
      shape.y(0);
    }
  };

  _onMouseEnter = () => {
    const stage = this.line.getStage();
    this.prevCursor = stage.container().style.cursor;
    stage.container().style.cursor = 'pointer';
  };

  _onMouseLeave = () => {
    const stage = this.line.getStage();
    stage.container().style.cursor = this.prevCursor;
    this.prevCursor = '';
  };

  render() {
    const { points, scale } = this.state;
    const { name, color, disabled, closed, pointSize } = this.props;
    return (
      <Group
        name={name}
        draggable={!disabled}
        onMouseEnter={!disabled && this._onMouseEnter}
        onMouseLeave={!disabled && this._onMouseLeave}
        onDragEnd={this._onGroupDragEnd}
        onDragMove={this._onGroupDragMove}
      >
        <Line
          points={_.flatten(points)}
          stroke={color[400]}
          fill={alpha(color[100], 0.7)}
          strokeWidth={5}
          strokeScaleEnabled={false}
          closed={closed}
          ref={(node) => {
            this.line = node;
          }}
          // onDblClick={e => console.log(e.target.scaleY(), e.target.scaleX())}
          onDblClick={({ evt }) => !disabled && this.addPoint(evt)}
        />
        {!disabled &&
          points.map((p, i) => (
            <Circle
              key={i}
              x={p[0]}
              y={p[1]}
              radius={pointSize || 6 / Math.abs(scale)}
              fill={color[600]}
              draggable={!disabled}
              name={`${i}`}
              onDragMove={this._onDragMove}
              onDragEnd={this._onDragEnd}
              strokeScaleEnabled={false}
              onDblClick={() => this.onRemovePoint(p)}
            />
          ))}
      </Group>
    );
  }
}

export default Main;
