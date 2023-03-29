import { Button, Popover } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ExpandIcon from '@material-ui/icons/ExpandMore';
import { isEmpty } from 'lodash';
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';
// import HoverPopover from 'material-ui-popup-state/HoverPopover';
import React, { createContext, Fragment, memo } from 'react';
import PopoverComponent from './popover';
const useStyles = makeStyles((theme) => ({
  chip: {
    backgroundColor: '#fff',
    color: 'black !important',
    marginRight: theme.spacing(1),
    '&:hover': {
      color: 'white !important',
    },
  },
}));
function Filter(props) {
  const { items, values, onChange } = props;
  const classes = useStyles();
  const ParentPopupState = createContext(null);
  return (
    <div>
      {React.Children.toArray(
        items.map((item) => {
          const { label, field, hidden } = item;
          if (hidden) return null;
          const value = values[field];
          let count = 0;
          if (!isEmpty(value)) count = Array.isArray(value) ? value.length : 1;
          return (
            <PopupState variant="popover" popupId={field}>
              {(popupState) => (
                <>
                  <Button
                    {...bindTrigger(popupState)}
                    className={classes.chip}
                    variant="contained"
                    endIcon={<ExpandIcon />}
                  >
                    {`${label}${count ? ` (${count})` : ''}`}
                  </Button>
                  <ParentPopupState.Provider value={popupState}>
                    <Popover
                      {...bindPopover(popupState)}
                      classes={{ list: classes.menu }}
                      anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                      }}
                      getContentAnchorEl={null}
                    >
                      <PopoverComponent
                        value={value}
                        item={item}
                        onChange={onChange}
                        popupState={popupState}
                      />
                    </Popover>
                  </ParentPopupState.Provider>
                </>
              )}
            </PopupState>
          );
        }),
      )}
    </div>
  );
}
export default memo(Filter);
