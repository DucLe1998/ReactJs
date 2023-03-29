import { TextBox } from 'devextreme-react';
import React, { useCallback, useEffect, useState } from 'react';
import { debounce, Grid } from '@material-ui/core';
import NoData from 'components/NoData';
import { IconClose } from 'constant/ListIcons';
import LoadingIndicator from 'components/LoadingIndicator';
import { getApiCustom } from 'utils/requestUtils';
import BtnSuccess from 'components/Button/BtnSuccess';
import BtnCancel from 'components/Button/BtnCancel';
import Avatar2 from 'images/NoAvatar.svg';
import { useVinToken } from 'utils/hooks/useVinToken';
import { API_FORBIDDEN_AREA } from '../../../apiUrl';
import {
  WhiteUserItemWrap,
  AddWhiteUserContentWrap,
  AvatarUser,
  IconCloseWrap,
  InfoUser,
  AddWhiteUserFooterWrap,
} from './styled';

export default function AddWhiteUser({ onAdd, onCancel, visible }) {
  const [data, setData] = useState([]);
  const [keyword, setKeyword] = useState();
  const [searchHistory, setSearchHistory] = useState([]);
  const [selectedUser, setSelectedUser] = useState();
  const { getUrl } = useVinToken();

  const onChangeText = debounce(e => {
    setKeyword(e);
    if (selectedUser) {
      setSelectedUser(null);
    }
  }, 500);

  const onSelectUser = e => {
    setKeyword(e?.employeeCode);
    setSelectedUser(e);
  };
  const onClearUser = () => {
    setSelectedUser(null);
    setKeyword(null);
  };
  const renderContent = () => {
    if (keyword) {
      if (!data || !data?.employeeCode) return <NoData />;
      return (
        <WhiteUserItem
          data={{
            ...data,
            imageUrl: data?.imageUrl ? getUrl(data?.imageUrl) : Avatar2,
          }}
          onClear={onClearUser}
          showClearButton
          onSelect={() => onSelectUser(data)}
        />
      );
    }
    return renderSearchHistory();
  };

  const renderSearchHistory = () => (
    <Grid container spacing={0}>
      {(searchHistory || []).map(o => (
        <Grid key={o?.uuid} item lg={12} sm={12} sx={12}>
          <WhiteUserItem
            data={{
              ...o,
              imageUrl: o?.imageUrl ? getUrl(o?.imageUrl) : Avatar2,
            }}
            onSelect={() => onSelectUser(o)}
          />
        </Grid>
      ))}
    </Grid>
  );

  const fetchData = useCallback(() => {
    setData([]);
    getApiCustom(
      {
        url: API_FORBIDDEN_AREA.LIST_WHITE_USER,
        params: {
          employeeCode: keyword,
        },
      },
      res => {
        setData(res);
        setSelectedUser(res);
      },
    );
  }, [keyword]);

  useEffect(() => {
    if (visible) {
      getApiCustom(
        {
          url: API_FORBIDDEN_AREA.SEARCH_HISTORY,
        },
        setSearchHistory,
      );
    }
  }, [visible, keyword]);

  useEffect(() => {
    if (keyword) {
      fetchData();
    }
  }, [keyword]);

  return (
    <React.Fragment>
      <React.Suspense fallback={<LoadingIndicator />}>
        <TextBox
          onInput={e => onChangeText(e?.event?.target?.value)}
          value={keyword}
          showClearButton
        />
        <AddWhiteUserContentWrap>{renderContent()}</AddWhiteUserContentWrap>
        <AddWhiteUserFooterWrap>
          <BtnCancel text="Hủy" onClick={onCancel} />
          <BtnSuccess
            text="Thêm"
            type="success"
            onClick={() => onAdd(selectedUser?.employeeCode)}
            disabled={!selectedUser}
          />
        </AddWhiteUserFooterWrap>
      </React.Suspense>
    </React.Fragment>
  );
}

const WhiteUserItem = ({ data, onSelect, onClear, showClearButton }) => {
  const [imgUrl, setimgUrl] = useState(null);
  useEffect(() => {
    setimgUrl(data?.imageUrl);
  }, [data]);
  return (
    <WhiteUserItemWrap onClick={onSelect}>
      {showClearButton ? (
        <IconCloseWrap
          src={IconClose}
          alt=""
          onClick={e => {
            e.stopPropagation();
            onClear(data);
          }}
        />
      ) : (
        <div style={{ width: 20 }} />
      )}
      <AvatarUser src={imgUrl} alt="" onError={() => setimgUrl(Avatar2)} />
      <InfoUser>
        <span className="name"> {data?.name}</span>
        <span className="code"> {data?.employeeCode}</span>
        <span className="company">{data?.companyName || 'Chưa xác định'}</span>
      </InfoUser>
    </WhiteUserItemWrap>
  );
};
