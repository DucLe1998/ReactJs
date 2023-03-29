/**
 *
 * ModalImage
 *
 */

import React, { useState } from 'react';
import styled from 'styled-components';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';
function ModalImage({ onClose, imageUrl }) {
  const classes = useStyles();
  const [scaleModalImage, setScaleModalImage] = useState(1);
  const handleSliderChange = (event, newValue) => {
    setScaleModalImage(newValue);
  };
  return (
    <Modal>
      <div className={classes.imageContainer}>
        {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions,jsx-a11y/click-events-have-key-events */}
        <span
          className="close"
          onClick={() => {
            onClose();
          }}
        >
          &times;
        </span>
        <img
          style={{
            transform: `scale(${scaleModalImage})`,
          }}
          className="modal-content"
          id="img01"
          src={imageUrl}
          alt=""
        />
        <div className={classes.vertical}>
          <div className={classes.white}>100%</div>
          <CustomSlider
            orientation="vertical"
            defaultValue={0}
            // valueLabelDisplay="auto"
            onChange={handleSliderChange}
            step={0.01}
            min={1}
            max={2}
          />
          <div className={classes.white}>0%</div>
        </div>
      </div>
    </Modal>
  );
}

const Modal = styled.div`
  & {
    display: flex;
    position: fixed;
    z-index: 9;
    padding-top: 100px;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgb(0, 0, 0);
    background-color: rgba(0, 0, 0, 0.9);
  }

  & .modal-content {
    width: 100%;
    height: 100%;
  }
  & .close {
    position: absolute;
    top: 15px;
    right: 35px;
    color: #f1f1f1;
    font-size: 40px;
    font-weight: bold;
    transition: 0.3s;
  }

  & .close:hover,
  .close:focus {
    color: #bbb;
    text-decoration: none;
    cursor: pointer;
  }
`;

const CustomSlider = withStyles({
  root: {
    color: '#C4C4C4',
    height: 8,
    '&$vertical': {
      width: 8,
    },
  },
  thumb: {
    height: 24,
    width: 24,
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    marginTop: -8,
    marginLeft: -12,
  },
  active: {},
  valueLabel: {
    left: 'calc(-50% + 4px)',
  },
  track: {
    height: 8,
    borderRadius: 4,
  },
  rail: {
    height: 8,
    borderRadius: 4,
  },
  vertical: {
    '& $rail': {
      width: 8,
    },
    '& $track': {
      width: 8,
    },
    '& $thumb': {
      marginLeft: -8,
      marginBottom: -11,
    },
  },
})(Slider);

const useStyles = makeStyles(() => ({
  vertical: {
    textAlign: 'center',
    height: '30%',
    position: 'relative',
    float: 'right',
    marginTop: '-35%',
    marginRight: '20px',
  },
  imageContainer: {
    width: '45vw',
    height: '70vh',
    margin: 'auto',
    overflow: 'hidden',
  },
  white: {
    color: '#FFFFFF',
    margin: '10px 0px',
  },
}));

ModalImage.propTypes = {};

export default ModalImage;
