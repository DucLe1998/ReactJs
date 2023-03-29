import React, { useState } from 'react';
import { Button } from 'devextreme-react/button';
import clsx from 'clsx';
import Grid from '@material-ui/core/Grid';
import moment from 'moment';
import DateBox from 'devextreme-react/date-box';
import { useIntl } from 'react-intl';
import { addMonths } from 'date-fns';

import {
  RowContent,
  RowItem,
  RowLabel,
} from '../../../components/CommonComponent';
import { useStyles } from '../style';
import messages from '../messages';

export function OptionExpAccount({
  startDateInput,
  endDateInput,
  confirmText,
  cancelText,
  confirm,
  close,
  isMinMonth,
  minDate,
}) {
  const classes = useStyles();
  const intl = useIntl();
  const today = new Date();
  const [startDate, setStartDate] = useState(
    startDateInput || new Date().setHours(0, 0, 0, 0),
  );
  const [endDate, setEndDate] = useState(
    endDateInput || new Date(addMonths(new Date(), 3)).setHours(23, 59, 59, 0),
  );

  return (
    <div className={classes.marginCard}>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <span className={classes.label}>
            {intl.formatMessage(messages.startTime)}
          </span>
          <DateBox
            id="startDate"
            name="startDate"
            type="date"
            displayFormat="dd/MM/yyyy"
            value={startDate}
            showClearButton={false}
            onValueChanged={c => {
              const start = new Date(c.value).setHours(0, 0, 0, 0);
              if (isMinMonth) {
                setStartDate(start);
                if (moment(addMonths(c.value, 3)).isAfter(moment(endDate))) {
                  setEndDate(
                    new Date(addMonths(c.value, 3)).setHours(23, 59, 59, 0),
                  );
                }
              } else {
                setStartDate(start);
              }
            }}
            min={
              isMinMonth
                ? minDate < today.valueOf()
                  ? minDate
                  : today.valueOf()
                : null
            }
            max={isMinMonth ? null : endDate}
          />
        </Grid>
        <Grid item xs={6}>
          <span className={classes.label}>
            {intl.formatMessage(messages.endTime)}
          </span>
          <DateBox
            id="endDate"
            name="endDate"
            type="date"
            displayFormat="dd/MM/yyyy"
            value={endDate}
            showClearButton={false}
            onValueChanged={c => {
              const end = new Date(c.value).setHours(23, 59, 59, 0);
              setEndDate(end);
            }}
            min={
              isMinMonth ? moment(addMonths(startDate, 3)).valueOf() : startDate
            }
          />
        </Grid>
      </Grid>
      <RowItem style={{ float: 'right', marginTop: 20 }}>
        <RowLabel />
        <RowContent>
          <Button
            style={{ marginRight: 10 }}
            className={clsx(classes.button, classes.buttonCancel)}
            onClick={close}
          >
            {cancelText}
          </Button>
          <Button
            className={clsx(classes.button, classes.buttonFilter)}
            onClick={() => confirm(startDate, endDate)}
          >
            {confirmText}
          </Button>
        </RowContent>
      </RowItem>
    </div>
  );
}

export default OptionExpAccount;
