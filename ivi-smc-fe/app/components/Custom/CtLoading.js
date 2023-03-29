import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import './styles.css';

export function CtLoading({ style }) {
  return (
    <div style={style} className="ct-loading">
      <CircularProgress />
    </div>
  );
}
CtLoading.propTypes = {};
export default CtLoading;
