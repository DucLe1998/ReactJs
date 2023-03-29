/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Fragment, useState } from 'react';
import { Typography, Link, Tooltip } from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import CheckIcon from '@material-ui/icons/Check';
import { format } from 'date-fns';
import clsx from 'clsx';
import filesize from 'filesize';
import VidFrame from './film-frame.png';
import { getIconClass } from './constants';
const useStyles = makeStyles(theme => ({
  container: {
    position: 'relative',
    padding: theme.spacing(1),
    margin: theme.spacing(1),
    width: '176px',
    '&:hover': {
      backgroundColor: '#ddd',
    },
    borderRadius: '2px',
    outline: 'none',
  },
  check: {
    fontSize: '14px',
    position: 'absolute',
    right: '2px',
    top: '2px',
    color: theme.palette.primary.main,
  },
  selected: {
    backgroundColor: '#ddd',
  },
  thumbnail: { textAlign: 'center', margin: theme.spacing(1), height: '81px' },
  vidBorder: {
    // width: '124px',
    // height: '71px',
    borderWidth: '5px 10px',
    borderColor: 'transparent',
    borderStyle: 'solid',
    borderImageSource: `url(${VidFrame})`,
    borderImageWidth: '5px 10px',
    borderImageSlice: '52 144',
  },
  image: {
    width: '144px',
    height: '81px',
  },
  text: {
    display: 'flex',
    flexDirection: 'column',
  },
  name: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    width: '100%',
    whiteSpace: 'nowrap',
    display: 'block',
    fontSize: theme.typography.pxToRem(14),
  },
  iconWrap: { textAlign: 'center', margin: theme.spacing(1), height: 'auto' },
  icon: {
    fontSize: '64px',
  },
}));
const HtmlTooltip = withStyles(() => ({
  tooltip: {
    backgroundColor: '#fff',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    // fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
    boxSizing: 'border-box',
  },
}))(Tooltip);
export default function Item({
  index,
  data,
  keyExpr,
  selectedItemKeys,
  handleSelection,
  onClick,
}) {
  const classes = useStyles();
  const selected = selectedItemKeys.includes(data[keyExpr]);
  const [loaded, setLoaded] = useState(true);
  return (
    <HtmlTooltip
      placement="right"
      enterDelay={500}
      title={
        <Fragment>
          <Typography variant="body1" component="p">
            {data.name}
          </Typography>
          <Typography variant="subtitle1" component="p">
            {filesize(data.size)}
          </Typography>
        </Fragment>
      }
    >
      <div
        role="gridcell"
        tabIndex={-1}
        className={clsx(classes.container, selected && classes.selected)}
        onClick={e => handleSelection(e, index)}
      >
        {selected && <CheckIcon className={classes.check} />}
        {data.thumbnail && loaded ? (
          <div className={classes.thumbnail}>
            <img
              loading="lazy"
              src={data.thumbnail}
              alt={data.name}
              className={clsx(classes.image, data.type && classes.vidBorder)}
              onError={() => setLoaded(false)}
            />
          </div>
        ) : (
          <div className={classes.iconWrap}>
            <i className={clsx(getIconClass(data.name), classes.icon)} />
          </div>
        )}
        <div className={classes.text}>
          <Link
            component="button"
            variant="body2"
            tabIndex={-1}
            onClick={e => {
              e.stopPropagation();
              onClick(index, data);
            }}
          >
            <span className={classes.name}>{data.name}</span>
          </Link>
          <Typography
            variant="subtitle2"
            color="textSecondary"
            align="center"
            component="p"
            style={{ fontSize: '12px' }}
          >
            {format(data.atts, 'dd/MM/yyyy HH:mm')}
          </Typography>
        </div>
      </div>
    </HtmlTooltip>
  );
}
