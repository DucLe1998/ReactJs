import React from 'react';
import { Link } from 'react-router-dom';
import { useVinToken } from 'utils/hooks/useVinToken';
import { CardItemBox, Image, Name, Description, BtnViewDetail } from './styled';

export default function CardItem({ data, scopes }) {
  const { imageUrl, forbiddenAreaName, locationName } = data;
  const { getUrl } = useVinToken();
  return (
    <CardItemBox>
      <Image>
        <img src={getUrl(imageUrl)} alt="" />
      </Image>
      <Name> {forbiddenAreaName} </Name>
      <Description> {locationName}</Description>
      {scopes.get && (
        <Link
          to={{
            pathname: `/camera-ai/forbidden-area/${data?.id}`,
          }}
        >
          <BtnViewDetail>Xem chi tiết</BtnViewDetail>
        </Link>
      )}
    </CardItemBox>
  );
}
