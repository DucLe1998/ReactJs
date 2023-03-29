/* eslint-disable react/button-has-type */
import React, { useEffect, useState } from 'react';
import { BsCircle } from 'react-icons/bs';
import { MdRadioButtonChecked } from 'react-icons/md';
import { makeStyles } from '@material-ui/core/styles';
import { ClickAwayListener } from '@material-ui/core';

import utils from '../../../utils/utils';
import IconBtn from '../IconBtn';
import gui from '../../../utils/gui';
import Btn from '../Btn';
import { IconLayout } from '../Icon/ListIcon';

const widthSquare = 130;

const useStyles = makeStyles(() => ({
  root: {
    position: 'relative',
  },
  dropdown: {
    position: 'absolute',
    top: 47,
    left: -10,
    right: 0,
    zIndex: 300,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 10,
    width: gui.screenWidth / 2,
    minWidth: 700,
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

const ViewLayout = ({ callback, squareType, listCamera }) => {
  const classes = useStyles();

  const [open, setOpen] = useState(false);
  const [squareTypeConst, setSquareTypeConst] = useState(1);

  useEffect(() => {
    afterClickItem(squareType, 'auto');
  }, [squareType]);

  useEffect(() => {
    if (listCamera.length > 0) {
      autoRenUiListCamera();
    }
  }, [listCamera]);

  const autoRenUiListCamera = () => {
    const count = listCamera.length;
    if (count <= 1) {
      afterCheckLayout(1);
    } else if (count <= 4) {
      afterCheckLayout(2);
    } else if (count <= 9) {
      afterCheckLayout(3);
    } else if (count <= 16) {
      afterCheckLayout(4);
    } else if (count <= 25) {
      afterCheckLayout(5);
    } else if (count <= 36) {
      afterCheckLayout(6);
    } else if (count <= 64) {
      afterCheckLayout(8);
    }
  };

  const afterCheckLayout = v => {
    setSquareTypeConst(v);
  };

  const afterClickItem = (v, t) => {
    callback(v, t);
  };

  return (
    <div
      className="ct-flex-row"
      style={{
        background: 'rgba(0, 0, 0, 0.8)',
        paddingLeft: 8,
        paddingRight: 10,
        borderRadius: 8,
        height: 40,
        fontWeight: 400,
      }}
    >
      <ClickAwayListener onClickAway={() => setOpen(false)}>
        <div className={classes.root}>
          <Btn
            label="Bố cục"
            icon={<IconLayout />}
            onClick={() => setOpen(prev => !prev)}
          />
          {open ? (
            <div className={classes.dropdown}>
              <div>
                <div
                  style={{
                    textAlign: 'center',
                    marginTop: 20,
                    marginBottom: 10,
                    fontWeight: 500,
                  }}
                >
                  Chọn Layout
                </div>
                <div style={styles.root}>
                  {[1, 2, 3, 4].map((item, index) => (
                    <ViewItemSquare
                      squareType={squareType}
                      key={index.toString()}
                      item={item}
                      callback={afterClickItem}
                      squareTypeConst={squareTypeConst}
                    />
                  ))}
                </div>
                <div style={styles.root}>
                  {[5, 6, 8].map((item, index) => (
                    <ViewItemSquare
                      squareType={squareType}
                      key={index.toString()}
                      item={item}
                      callback={afterClickItem}
                      squareTypeConst={squareTypeConst}
                    />
                  ))}
                  <div style={{ width: widthSquare, height: widthSquare }} />
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </ClickAwayListener>
      <div
        style={{
          backgroundColor: 'rgba(147, 193, 152, 1)',
          padding: '0px 4px',
          borderRadius: 4,
          fontSize: 13,
          color: '#000',
        }}
      >
        {squareType * squareType}
      </div>
    </div>
  );
};

const ViewItemSquare = ({ item, callback, squareType, squareTypeConst }) => {
  const checkDisabled = item < squareTypeConst;
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
      }}
    >
      <div
        style={{
          width: widthSquare,
          height: widthSquare,
          border: `1px solid ${
            squareType === item
              ? '#007AFF'
              : checkDisabled
              ? '#706c6c'
              : '#e9dfdf'
          } `,
          position: 'relative',
          borderRadius: 8,
        }}
      >
        <div
          style={{
            backgroundColor: 'transparent',
            width: '100%',
            height: '100%',
            color: '#000',
            position: 'absolute',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              fontWeight: 500,
              fontFamily: 'roboto',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: checkDisabled ? '#706c6c' : '#FFFFFF',
              width: 22,
              height: 22,
              borderRadius: '100%',
            }}
          >
            {item * item}
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignContent: 'flex-start',
            width: '100%',
            height: '100%',
            padding: 15,
          }}
        >
          {utils.createArray(item * item).map((_item, index) => (
            <RenderViewSquare
              colorBorder={checkDisabled ? '#706c6c' : '#e9dfdf'}
              i={item}
              key={index.toString()}
            />
          ))}
        </div>
      </div>
      <IconBtn
        onClick={() => callback(item)}
        style={{ marginBottom: 23, marginTop: 23 }}
        disabled={checkDisabled}
        icon={
          squareType === item ? (
            <MdRadioButtonChecked color="#007AFF" />
          ) : (
            <BsCircle color={checkDisabled ? '#706c6c' : '#e9dfdf'} />
          )
        }
      />
    </div>
  );
};

const RenderViewSquare = ({ i, colorBorder }) => (
  <div
    style={{
      border: `0.5px solid ${colorBorder}`,
      height: `${100 / i}%`,
      width: `${100 / i}%`,
    }}
  />
);

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'row',
    overflow: 'none',
    width: '100%',
    justifyContent: 'space-around',
    paddingTop: 20,
  },
};

export default ViewLayout;
