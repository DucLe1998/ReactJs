/* eslint-disable react/prop-types,no-param-reassign,no-unused-expressions,no-dupe-keys */
import React from 'react';
import { BsChevronLeft } from 'react-icons/bs';
import { useHistory } from 'react-router-dom';
import IconBtn from './IconBtn';
import CtToolTip from './CtToolTip';

const TitlePage = ({ title, onClick, hiddenIcon, urlBack }) => {
  const t = useHistory();
  return (
    <CtToolTip text={title?.length > 50 && title}>
      <div
        style={{
          fontSize: 20,
          fontWeight: 500,
          backgroundColor: 'transparent',
          textTransform: 'none',
          fontFamily: 'roboto',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          whiteSpace: 'nowrap',
        }}
      >
        {!hiddenIcon && (
          <IconBtn
            style={{
              backgroundColor: 'transparent',
              width: 18,
              height: 18,
              marginRight: 12,
              marginTop: -4,
              border: '1.3px solid rgba(60, 60, 67, 0.6)',
            }}
            onClick={
              onClick || (() => (urlBack ? t.push(urlBack) : t.goBack()))
            }
            icon={<BsChevronLeft color="rgba(60, 60, 67, 0.6)" size="0.7em" />}
          />
        )}

        {title?.length > 50 ? `${title?.slice(0, 50)}...` : title || 'Trở về'}
      </div>
    </CtToolTip>
  );
};

export default TitlePage;
