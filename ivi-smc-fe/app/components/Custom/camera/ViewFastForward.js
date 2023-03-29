/* eslint-disable no-unused-expressions */
/* eslint-disable react/button-has-type */
import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import ClickAwayListener from '@material-ui/core/ClickAwayListener';

import Btn from '../Btn';
import IconBtn from '../IconBtn';

const useStyles = makeStyles(() => ({
  root: {
    position: 'relative',
  },
  dropdown2: {
    position: 'absolute',
    top: 47,
    right: 0,
    zIndex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 10,
    width: 64,
  },
}));

const ViewFastForward = ({ itemChoice, callback }) => {
  const classes = useStyles();
  const [isOpenViewFastForward, setIsOpenViewFastForward] = useState(false);

  const onClickItem = v => {
    callback && callback(v);
    setIsOpenViewFastForward(false);
  };

  return (
    <>
      <ClickAwayListener onClickAway={() => setIsOpenViewFastForward(false)}>
        <div className={classes.root}>
          <IconBtn
            icon={<div className="ct-txt-btn">x{itemChoice}</div>}
            onClick={() => setIsOpenViewFastForward(prev => !prev)}
          />
          {isOpenViewFastForward ? (
            <div className={classes.dropdown2}>
              {[1, 4, 6, 8, 16, 32].map((item, index) => (
                <div key={index.toString()}>
                  <Btn label={`x${item}`} onClick={() => onClickItem(item)} />
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </ClickAwayListener>
    </>
  );
};

export default ViewFastForward;
