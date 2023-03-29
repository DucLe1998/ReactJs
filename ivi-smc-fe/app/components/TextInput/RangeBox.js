import React from 'react';
import LabelInput from './element/LabelInput';
import './styles.css';

const RangeBox = ({
  label,
  min = 0,
  max = 10,
  name,
  innerRef,
  defaultValue = 0,
  unit = 'giây',
}) => {
  const onChangeRange = v => {
    const rangeBullet = document.getElementById(`range-box-label-${name}`);
    const rangeSlider = document.getElementById(name);
    const aaa = (v / rangeSlider.max) * 93;
    rangeBullet.style.left = `${aaa}%`;
    rangeBullet.innerHTML = `${v} ${unit}`;

    if (rangeSlider) {
      const ccc =
        ((v - rangeSlider.min) / (rangeSlider.max - rangeSlider.min)) * 100;
      rangeSlider.style.background = `linear-gradient(to right, #4C96FD 0%, #4C96FD ${ccc}%, #4c96fd59 ${ccc}%, #4c96fd59 100%)`;
    }
  };

  return (
    <div className="view-input" style={{ width: '100%' }}>
      <LabelInput label={label} />

      <div
        style={{
          alignItems: 'center',
          display: 'flex',
          height: 40,
        }}
      >
        <div style={{ marginRight: 10, fontSize: 12 }}>{min}</div>
        <div
          style={{
            position: 'relative',
            flex: 1,
            display: 'flex',
          }}
        >
          <span
            id={`range-box-label-${name}`}
            style={{
              fontSize: 12,

              left: `${(defaultValue / max) * 93}%`,
            }}
            className="ct-rs-label"
          >
            {defaultValue || 0} {unit}
          </span>
          <input
            style={{
              width: '100%',
              background: `linear-gradient(to right, #4C96FD 0%, #4C96FD ${((defaultValue -
                min) /
                (max - min)) *
                100}%, #4c96fd59 ${((defaultValue - min) / (max - min)) *
                100}%, #4c96fd59 100%)`,
            }}
            type="range"
            id={name}
            className="ct-input-range"
            name={name}
            min={min}
            max={max}
            onChange={v => onChangeRange(v.target.value)}
            defaultValue={defaultValue}
            ref={innerRef}
          />
        </div>
        <div
          style={{
            width: 60,
            marginLeft: 10,
            fontSize: 12,
          }}
        >
          {max} {unit}
        </div>
      </div>
    </div>
  );
};

export default RangeBox;
