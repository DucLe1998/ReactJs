import React from 'react';
import { Button } from 'devextreme-react/button';
import clsx from 'clsx';
import { useIntl } from 'react-intl';
import {
  RowContent,
  RowItem,
  RowLabel,
} from '../../../components/CommonComponent';
import { useStyles } from '../style';
import { showSuccess } from '../../../utils/toast-utils';
import messages from '../messages';

export function Delete({
  text,
  close,
  confirm,
  btnConfirm,
  cancelText,
  confirmText,
  isDeleteUser,
}) {
  const classes = useStyles();
  const intl = useIntl();
  return (
    <div className={classes.marginCard}>
      <p>{text}</p>
      <RowItem style={{ float: 'right' }}>
        <RowLabel />
        <RowContent>
          <Button
            style={{ marginRight: 10 }}
            className={clsx(classes.button, classes.buttonCancel)}
            onClick={close}
          >
            {cancelText || intl.formatMessage(messages.btnCancel)}
          </Button>
          <Button
            className={clsx(classes.button, classes.buttonFilter)}
            onClick={() => {
              if (confirm) {
                showSuccess(intl.formatMessage(messages.informationNoChange));
                confirm();
              } else if (isDeleteUser) {
                btnConfirm();
              } else {
                showSuccess(intl.formatMessage(messages.deleteSuccess));
                close();
              }
            }}
          >
            {confirmText || intl.formatMessage({ id: 'app.tooltip.delete' })}
          </Button>
        </RowContent>
      </RowItem>
    </div>
  );
}

export default Delete;
