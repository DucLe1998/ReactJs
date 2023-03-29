/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable indent */
/* eslint-disable react/button-has-type */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
const useStyles = makeStyles((theme) => ({
  button: {
    backgroundColor: 'transparent',
    borderRadius: '24px',
    border: 'none',
    height: '32px',
    color: '#051D3F',
    width: '100%',
    // margin: '0px 10px',
    // padding: '8px 24px',
    cursor: 'pointer',
  },
  selected: {
    backgroundColor: '#4B67E2',
    color: '#FFFFFF',
  },
}));

const typeTF = {
  week: 'WEEK',
  month: 'MONTH',
  year: 'YEAR',
};

const BtnTimeChart = ({ callback, valueFilter }) => {
  const [typeTimeFilter, setTypeTimeFilter] = useState(
    valueFilter.timeType || typeTF.week,
  );
  const classes = useStyles();
  const onClickBtn = (type) => {
    setTypeTimeFilter(type);
    callback(type);
  };

  return (
    <div
      style={{
        backgroundColor: '#EFF2FE',
        borderRadius: 24,
        width: 280,
        height: 32,
        justifyContent: 'space-between',
      }}
      className="ct-flex-row"
    >
      <button
        onClick={() => {
          onClickBtn(typeTF.week);
        }}
        className={clsx(
          classes.button,
          typeTimeFilter === typeTF.week && classes.selected,
        )}
      >
        Tuần
      </button>
      <button
        onClick={() => {
          onClickBtn(typeTF.month);
        }}
        className={clsx(
          classes.button,
          typeTimeFilter === typeTF.month && classes.selected,
        )}
      >
        Tháng
      </button>
      {/* <button
        onClick={() => {
          onClickBtn(typeTF.year);
        }}
        className={clsx(
          classes.button,
          typeTimeFilter === typeTF.year && classes.selected,
        )}
      >
        Năm
      </button> */}
    </div>
  );
};

export default BtnTimeChart;
