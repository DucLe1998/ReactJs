import React from 'react';
import { ButtonBase, makeStyles } from '@material-ui/core';
import clsx from 'clsx';
const useStyles = makeStyles((theme) => ({
  ul: {
    margin: 0,
    display: 'flex',
    padding: 0,
    flexWrap: 'wrap',
    listStyle: 'none',
    alignItems: 'center',
  },
  button: {
    border: '1px solid',
    borderColor: theme.palette.primary.light,
    height: '32px',
    margin: '3px',
    padding: '0 6px',
    minWidth: '32px',
    textAlign: 'center',
    borderRadius: '16px',
  },
  selected: {
    backgroundColor: theme.palette.primary.main,
    color: '#fff',
  },
  disabled: {
    opacity: 0.38,
  },
}));

export default function ShortMultiSelect(props) {
  const {
    options = [],
    getOptionDisabled,
    displayExpr = 'name',
    valueExpr = 'value',
    value = [],
    onChange,
  } = props;
  const classes = useStyles();
  const onItemClick = (item, isSelected) => {
    if (!onChange) return;
    if (isSelected) {
      onChange(value.filter((v) => v != item[valueExpr]));
    } else onChange([...value, item[valueExpr]]);
  };
  return (
    <ul className={classes.ul}>
      {React.Children.toArray(
        options.map((item) => {
          const isDisabled = getOptionDisabled
            ? getOptionDisabled(item)
            : false;
          const isSelected = value.includes(item[valueExpr]);
          const displayText =
            typeof displayExpr == 'function'
              ? displayExpr(item)
              : item[displayExpr];
          return (
            <li>
              <ButtonBase
                classes={{
                  root: clsx(classes.button, isSelected && classes.selected),
                  disabled: classes.disabled,
                }}
                disabled={isDisabled}
                onClick={() => onItemClick(item, isSelected)}
              >
                {displayText || ''}
              </ButtonBase>
            </li>
          );
        }),
      )}
    </ul>
  );
}
