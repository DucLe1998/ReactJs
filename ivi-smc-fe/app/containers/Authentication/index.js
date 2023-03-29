import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { makeSelectAllUserAuthority } from '../Menu/selectors';
import { checkAuthority } from '../../utils/functions';

export function Authentication({
  children,
  scope,
  resourceCode,
  listAuthority,
}) {
  const hasPerm = checkAuthority(scope, resourceCode, listAuthority);
  return children(hasPerm);
}

const mapStateToProps = createStructuredSelector({
  listAuthority: makeSelectAllUserAuthority(),
});

export function mapDispatchToProps(dispatch) {
  return { dispatch };
}
Authentication.propTypes = {
  scope: PropTypes.any,
  resourceCode: PropTypes.any,
};

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(Authentication);
