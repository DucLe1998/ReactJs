/*
 *
 * LanguageToggle
 *
 */

import { Button, Menu, MenuItem, Tooltip } from '@material-ui/core';
import LngIcon from '@material-ui/icons/Language';
import ExpandIcon from '@material-ui/icons/ExpandMore';
import PropTypes from 'prop-types';
import React, { Fragment, useState } from 'react';
import { useIntl } from 'react-intl';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { appLocales } from '../../i18n';
import { changeLocale } from '../LanguageProvider/actions';
import { loadMenu } from '../Menu/actions';
import { makeSelectLocale } from '../LanguageProvider/selectors';
import messages from './messages';
import { makeSelectAuthState } from '../Login/selectors';

export function LocaleToggle(props) {
  const { locale, onLocaleToggle, dispatch, authState } = props;
  const { formatMessage } = useIntl();
  const [anchorEl, setAnchorEl] = useState(null);

  function onLngBtnClick(e) {
    setAnchorEl(e.currentTarget);
  }
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <Fragment>
      <Tooltip title={formatMessage(messages.changeLngTooltip)}>
        <Button
          startIcon={<LngIcon />}
          endIcon={<ExpandIcon />}
          onClick={onLngBtnClick}
        >
          {formatMessage(messages[locale])}
        </Button>
      </Tooltip>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {appLocales.map((item, index) => (
          <MenuItem
            key={index.toString()}
            onClick={() => {
              onLocaleToggle(item);
              // eslint-disable-next-line no-unused-expressions
              authState && dispatch(loadMenu());
            }}
            selected={locale == item}
          >
            {formatMessage(messages[item])}
          </MenuItem>
        ))}
      </Menu>
    </Fragment>
  );
}

LocaleToggle.propTypes = {
  locale: PropTypes.string,
};

const mapStateToProps = createStructuredSelector({
  locale: makeSelectLocale(),
  authState: makeSelectAuthState(),
});

export function mapDispatchToProps(dispatch) {
  return {
    onLocaleToggle: evt => dispatch(changeLocale(evt)),
    dispatch,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LocaleToggle);
