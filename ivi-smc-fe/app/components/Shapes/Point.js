import React from "react";
import { Circle } from "react-konva";

export default ({ onTranform, disabled, point, size, color}) => {
    const onDragEnd = (e) => {
        const shape = e.target;
        const point = [shape.x(), shape.y()]
        onTranform(point)
    }
    return (
        <Circle
            x={point[0]}
            y={point[1]}
            fill={color}
            radius={size}
            draggable={!disabled}
            onDragEnd={onDragEnd}
        />
    )
}
