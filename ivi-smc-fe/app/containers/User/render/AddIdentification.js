import React from 'react';
import { Button } from 'devextreme-react/button';
import clsx from 'clsx';
import CardIcon from 'images/icon-button/the.svg';
import FaceIcon from 'images/icon-button/khuonmat.svg';
import FingerprintIcon from '@material-ui/icons/Fingerprint';
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from '@material-ui/core';
import { useIntl } from 'react-intl';
import { RowContent, RowItem, RowLabel } from 'components/CommonComponent';
import { useStyles } from '../style';
import messages from '../messages';
import { IDENTIFY_TYPES } from '../constants';

export function AddIdentification({ confirmText, cancelText, confirm, close }) {
  const classes = useStyles();
  const intl = useIntl();
  const [value, setValue] = React.useState(IDENTIFY_TYPES.CARD.id);
  const handleChange = event => {
    setValue(event.target.value);
  };

  return (
    <div className={classes.marginCard}>
      <FormControl component="fieldset" className={classes.fullWidth}>
        <RadioGroup
          className={classes.radioLabel}
          name="type"
          value={value}
          onChange={handleChange}
        >
          <FormControlLabel
            disabled
            style={{ marginBottom: 5 }}
            value={IDENTIFY_TYPES.FACES.id}
            control={
              <Radio className={classes.radio} size="small" color="default" />
            }
            label={`${intl.formatMessage(messages.face)} ${intl.formatMessage(
              messages.availableSoon,
            )}`}
          />
          <img
            alt="khuonmat"
            src={FaceIcon}
            style={{ position: 'absolute', top: 3, right: 12 }}
          />
          <FormControlLabel
            disabled
            value={IDENTIFY_TYPES.FINGERPRINTS.id}
            control={
              <Radio className={classes.radio} size="small" color="default" />
            }
            label={`${intl.formatMessage(
              messages.fingerprint,
            )} ${intl.formatMessage(messages.availableSoon)}`}
          />
          <FingerprintIcon
            style={{ position: 'absolute', top: 47, right: 12 }}
          />
          <FormControlLabel
            style={{ marginBottom: 5 }}
            value={IDENTIFY_TYPES.CARD.id}
            control={
              <Radio className={classes.radio} size="small" color="default" />
            }
            label={intl.formatMessage(messages.card)}
          />
          <img
            alt="Thẻ"
            src={CardIcon}
            style={{ position: 'absolute', top: 88, right: 12 }}
          />
        </RadioGroup>
      </FormControl>
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
            onClick={() => {
              const data = {
                identifyMethod: value,
                updatedDate: new Date(),
                updatedAt: new Date(),
                identifyStatus: true,
                status: true,
              };
              confirm(data);
            }}
          >
            {confirmText}
          </Button>
        </RowContent>
      </RowItem>
    </div>
  );
}

export default AddIdentification;
