import React from 'react';
import { Avatar } from '@material-ui/core';
import * as colors from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';
import { last } from 'lodash';
const useStyles = makeStyles((theme) => ({
  filled: (hue) => {
    const color = hue[500];
    return {
      backgroundColor: color,
      color: theme.palette.getContrastText(color),
    };
  },
}));
const colorArray = [
  'red',
  'pink',
  'purple',
  'deepPurple',
  'indigo',
  'blue',
  'lightBlue',
  'cyan',
  'teal',
  'green',
  'lightGreen',
  'lime',
  'yellow',
  'amber',
  'orange',
  'deepOrange',
  'brown',
];
export default function AvatarName({ name = '', color, ...other }) {
  let hue;
  if (color && colorArray.includes(color)) {
    hue = colors[color];
  } else {
    const randomColor = Math.floor(Math.random() * colorArray.length);
    hue = colors[colorArray[randomColor]];
  }
  const classes = useStyles(hue);
  const getAva = (name) => {
    const split = name.split(' ');
    if (split.length > 1) {
      return split[0][0] + (last(split)[0] || '');
    }
    return name[0];
  };
  return (
    <Avatar className={classes.filled} {...other}>
      {getAva(name)}
    </Avatar>
  );
}
