import React, { useEffect, useState } from 'react';
import { Grid } from '@material-ui/core';
import { IconClose } from 'constant/ListIcons';
import { useVinToken } from 'utils/hooks/useVinToken';
import Avatar2 from 'images/NoAvatar.svg';
import { WhiteUserItemWrap, IconCloseWrap } from '../styled';

const formatInfo = text => text || 'Chưa rõ thông tin';

export default function WhiteUserItem({ data, onRemove, scopes }) {
  const { getUrl } = useVinToken();
  const [imgUrl, setImgUrl] = useState(null);
  useEffect(() => {
    setImgUrl(getUrl(data?.imageUrl));
  }, [data]);
  return (
    <Grid item lg={2} sm={4}>
      <WhiteUserItemWrap>
        <img
          src={imgUrl}
          alt=""
          onError={() => {
            setImgUrl(Avatar2);
          }}
        />
        <span className="name"> {formatInfo(data?.name)} </span>
        <span className="code"> {formatInfo(data?.employeeCode)} </span>
        <span className="company"> {formatInfo(data?.companyName)}</span>
        {scopes.delete && (
          <IconCloseWrap src={IconClose} onClick={() => onRemove(data?.id)} />
        )}
      </WhiteUserItemWrap>
    </Grid>
  );
}
