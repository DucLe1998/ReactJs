/* eslint-disable jsx-a11y/media-has-caption */
import React from 'react';
import { Box } from '@material-ui/core';
const MediaView = ({ data }) => (
  <Box display="flex" justifyContent="center" alignItems="center">
    {data.type ? (
      <video
        src="https://cdn.rawgit.com/mediaelement/mediaelement-files/4d21a042/big_buck_bunny.mp4"
        controls
        crossOrigin="anonymous"
      />
    ) : (
      <img
        alt={data.caption}
        src={data.source}
        style={{ maxWidth: '100%', maxHeight: '100%' }}
      />
    )}
  </Box>
);
export default MediaView;
