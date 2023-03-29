/* eslint-disable react/prop-types,no-param-reassign,no-unused-expressions,no-dupe-keys */
import React, { useEffect, useState } from 'react';
import Avatar2 from 'images/NoAvatar.svg';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import { buildUrlWithToken } from '../../../utils/utils';

const CardPreview2 = ({
  option,
  inputValue,
  onSearch2,
  setKeyword,
  setFileCropped,
}) => {
  const [imgUrl, setImgUrl] = useState(null);
  useEffect(() => {
    if (option.imageUrl) {
      setImgUrl(buildUrlWithToken(option.imageUrl));
    } else {
      setImgUrl(Avatar2);
    }
  }, [option]);
  const matchesName = match(option.userDetectedName, inputValue);
  const partsName = parse(option.userDetectedName, matchesName);

  const matchesUID = match(option.code, inputValue);
  const partsUID = parse(option.code, matchesUID);
  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions,jsx-a11y/click-events-have-key-events
    <div
      style={{
        width: '100%',
        height: '78px',
        padding: '15px',
        display: 'flex',
        cursor: 'pointer',
      }}
      onClick={() => {
        const searchVal = `${option.userDetectedName || ''} - ${option.code ||
          ''}`;
        onSearch2({ keyword: searchVal, searchParam: searchVal, file: null });
        setKeyword(searchVal);
        setFileCropped(null);
      }}
    >
      <div style={{ margin: '0px 18.49px' }}>
        <img
          alt=""
          src={imgUrl}
          style={{
            width: '48px',
            height: '48px',
          }}
          onError={() => {
            setImgUrl(Avatar2);
          }}
        />
      </div>
      <div>
        <div>
          {partsName.map(part => (
            <span
              key={partsName.indexOf(part)}
              style={{
                fontWeight: 500,
                color: part.highlight ? '#109CF1' : '#2C2C2E',
                fontSize: '17px',
                lineHeight: '22px',
              }}
            >
              {part.text}
            </span>
          ))}
        </div>
        <div>
          {partsUID.map(part => (
            <span
              key={partsUID.indexOf(part)}
              style={{
                color: part.highlight ? '#109CF1' : 'rgba(60, 60, 67, 0.6)',
                fontSize: '15px',
                lineHeight: '18px',
              }}
            >
              {part.text}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CardPreview2;
