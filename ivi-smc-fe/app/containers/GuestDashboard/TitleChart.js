/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable indent */
/* eslint-disable react/button-has-type */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { format, add, sub } from 'date-fns';
import { Typography, OutlinedInput } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Menu from '@material-ui/core/Menu';
import FormGroup from '@material-ui/core/FormGroup';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Icon from '@material-ui/core/Icon';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import Autocomplete from '@material-ui/lab/Autocomplete';
import SelectBox from 'devextreme-react/select-box';
import { HiOutlineDownload } from 'react-icons/hi';
import { DEFAULT_SERIES, TIME_TYPES } from './constants';

const now = new Date();

const TitleChart = ({ title = 'Tiêu đề', onChangeTimeType, onChangeType }) => {
  const guestTypes = [...DEFAULT_SERIES];
  guestTypes.unshift({
    name: 'Tất cả',
    code: 'ALL',
  });

  const [filters, setFilters] = useState({
    timeType: TIME_TYPES[0].value,
    guestTypes: guestTypes.map(type => ({
      code: type.code,
      checked: true,
    })),
  });
  // const classes = useStyles();

  const handleChange = event => {
    let guestTypes = filters.guestTypes.map(type => {
      if (event.target.name === 'ALL') {
        return { code: type.code, checked: event.target.checked }; // check || uncheck when click all
      }
      // check vao checkbox duoc chon
      if (type.code === event.target.name) {
        return { code: type.code, checked: event.target.checked };
      }
      return type;
    });
    // KT lai trang thai cua check all
    if (
      guestTypes.filter(type => type.checked === true).length ===
        DEFAULT_SERIES.length &&
      event.target.checked
    ) {
      guestTypes = guestTypes.map(type => {
        if (type.code === 'ALL') {
          return { code: type.code, checked: true };
        }
        return type;
      });
    }
    if (!event.target.checked) {
      guestTypes = guestTypes.map(type => {
        if (type.code === 'ALL') {
          return { code: type.code, checked: false };
        }
        return type;
      });
    }

    const payload = {
      timeType: filters.timeType,
      guestTypes: [...guestTypes],
    };
    setFilters({ ...payload }); // view only
    onChangeType(guestTypes); // handle logic
  };

  const getContentLabel = () => {
    let text = 'Tất cả';
    const checkedOptions = filters.guestTypes.filter(
      type => type.checked === true,
    );
    if (checkedOptions.length === 0) {
      text = 'Chọn cột';
    } else if (checkedOptions.find(type => type.code === 'ALL')?.checked) {
      text = 'Tất cả';
    } else if (checkedOptions.length === 1) {
      text = guestTypes.find(type => type.code === checkedOptions[0].code)
        ?.name; // khong can +0... nhu TH ben duoi
    } else {
      const name =
        guestTypes.find(type => type.code === checkedOptions[0].code)?.name ||
        '';
      text = `${name} +${checkedOptions.length - 1}...`;
    }

    return (
      <span
        style={{
          color: '#333',
          fontWeight: '400',
          fontSize: '14px',
          textTransform: 'none',
          flex: 1,
          textAlign: 'start',
          lineHeight: 'normal',
        }}
      >
        {text}
      </span>
    );
  };

  const getSubTitle = () => {
    switch (filters.timeType) {
      case 'DAY_7': {
        const before7Day = sub(now, { days: 7 });
        return `${before7Day.getDate()} tháng ${before7Day.getMonth() +
          1} năm ${before7Day.getFullYear()} - ${now.getDate()} tháng ${now.getMonth() +
          1} năm ${now.getFullYear()}`;
      }
      case 'WEEK_4': {
        const before4Week = sub(now, { weeks: 4 });
        return `${before4Week.getDate()} tháng ${before4Week.getMonth() +
          1} năm ${before4Week.getFullYear()} - ${now.getDate()} tháng ${now.getMonth() +
          1} năm ${now.getFullYear()}`;
      }
      case 'MONTH_12': {
        const before12Month = sub(now, { months: 12 });
        return `${before12Month.getDate()} tháng ${before12Month.getMonth() +
          1} năm ${before12Month.getFullYear()} - ${now.getDate()} tháng ${now.getMonth() +
          1} năm ${now.getFullYear()}`;
      }

      default:
        return '';
    }
  };

  return (
    <div
      style={{
        justifyContent: 'space-between',
        marginBottom: 24,
      }}
      className="ct-flex-row"
    >
      <div>
        <div
          className="title-chart"
          style={{ marginBottom: 4, fontSize: '18px', fontWeight: 'bold' }}
        >
          {title}
        </div>
        <div style={{ fontSize: '12px', color: '#717070' }}>
          <span style={{ fontWeight: 'normal' }}>Phạm vi ngày:</span>{' '}
          <span style={{ fontWeight: 'bold' }}>{getSubTitle()}</span>
        </div>
      </div>
      <div style={{ display: 'flex' }}>
        <PopupState variant="popover" popupId="demo-popup-menu">
          {popupState => (
            <React.Fragment>
              <Button
                {...bindTrigger(popupState)}
                endIcon={
                  <span
                    style={{
                      fontSize: '9px',
                      transform: 'rotate(45deg)',
                      marginRight: '12px',
                      marginTop: '-4px',
                    }}
                  >
                    &#9698;
                  </span>
                }
                style={{
                  marginRight: '12px',
                  border: '1px solid #dddddd',
                  minWidth: '150px',
                }}
              >
                {getContentLabel()}
              </Button>
              <Menu
                {...bindMenu(popupState)}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
                getContentAnchorEl={null}
              >
                <div
                  style={{
                    height: '336px',
                    overflow: 'auto',
                  }}
                >
                  <FormGroup
                    style={{
                      padding: '0px 15px',
                    }}
                  >
                    {React.Children.toArray(
                      guestTypes.map(item => (
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={Boolean(
                                filters.guestTypes.find(
                                  type => type.code === item.code,
                                )?.checked,
                              )}
                              color="primary"
                              onChange={handleChange}
                              name={item.code}
                            />
                          }
                          label={item.name}
                        />
                      )),
                    )}
                  </FormGroup>
                </div>
              </Menu>
            </React.Fragment>
          )}
        </PopupState>
        <SelectBox
          items={TIME_TYPES}
          defaultValue={TIME_TYPES[0].value}
          value={filters.timeType}
          width="140px"
          displayExpr={item => (item ? item.label : '')}
          valueExpr="value"
          onValueChanged={e => {
            // setOption(e.value);
            setFilters({
              ...filters,
              timeType: e.value,
            }); // view only
            onChangeTimeType(e.value); // handle logic
          }}
          showClearButton={false}
        />
        {/* <Button
          startIcon={<HiOutlineDownload color="gray" />}
          style={{ marginLeft: '20px' }}
        >
          Tải xuống
        </Button> */}
      </div>
    </div>
  );
};

export default TitleChart;
