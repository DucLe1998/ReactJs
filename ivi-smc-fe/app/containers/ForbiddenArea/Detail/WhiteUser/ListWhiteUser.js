import { Grid } from '@material-ui/core';
import React from 'react';
import LoadingIndicator from 'components/LoadingIndicator';
import NoData from 'components/NoData';
import WhiteUserItem from './WhiteUserItem';

export default function ListWhiteUser({ data, onRemove, scopes }) {
  if (!data || !data.length) return <NoData />;
  return (
    <React.Fragment>
      <React.Suspense fallback={<LoadingIndicator />}>
        <Grid container spacing={3}>
          {(data || []).map(o => (
            <WhiteUserItem
              key={Math.random()}
              data={o?.whitelistUser}
              onRemove={onRemove}
              scopes={scopes}
            />
          ))}
        </Grid>
      </React.Suspense>
    </React.Fragment>
  );
}
