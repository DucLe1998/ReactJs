import React, { useRef } from 'react'
import { Shape } from 'react-konva';
// import { } from "react-konva"

const Cross = (props) => {
    const ref = useRef();
    const prevCursorRef = useRef()
    const onMouseEnter = (e) => {
        const stage = e.target.getStage();
        prevCursorRef.current = stage.container().style.cursor
        stage.container().style.cursor = 'move';
    }
    const onMouseLeave = e => {
        const stage = e.target.getStage();
        stage.container().style.cursor = prevCursorRef.current;
        prevCursorRef.current = ""
    }
    return (
        <Shape
            sceneFunc={function (ctx, shape) {
                const stage = shape.getStage()
                const scale = stage?.scaleX() || 1
                shape.strokeWidth(4/scale)
                ctx.beginPath();
                const size = 10 /scale
            
                ctx.moveTo(- size, - size);
                ctx.lineTo(+ size, + size);
                ctx.stroke();

                ctx.moveTo(+ size, - size);
                ctx.lineTo(- size, + size);
                ctx.stroke();
                // (!) Konva specific method, it is very important
                ctx.fillStrokeShape(shape);
            }}
            // strokeEnabled={false}
            ref={ref}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            stroke={props.color || 'red'}
            // strokeWidth={4}
            draggable

            {...props}
        />
    )
}

export default Cross;