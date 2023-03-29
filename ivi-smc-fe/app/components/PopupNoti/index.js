import React, { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { formatDistanceToNow } from 'date-fns';
import vi from 'date-fns/locale/vi';
import { useHistory } from 'react-router';
import {
  BtnViewDetailWrap,
  NotiFooterWrap,
  NotiHeaderWrap,
  PopupNotiWrap,
  NotiBodyWrap,
  BtnCancelWrap,
} from './styled';

const getData = d => d?.data && JSON.parse(d?.data);

export default function PopupNoti(props) {
  const { title, data } = props;
  const [diffTime, setDiffTime] = useState('Vừa xong');
  const { closeSnackbar } = useSnackbar();
  const history = useHistory();

  const d = getData(data);
  const keyNoti = d?.dataId;
  const content = d?.location || d?.content;

  const onViewDetail = () => {
    history.push(`/fire-warning/${keyNoti}`);
    closeSnackbar(keyNoti);
  };
  const onCancel = () => {
    closeSnackbar(keyNoti);
  };

  useEffect(() => {
    const getDiffMin = setInterval(() => {
      const a = formatDistanceToNow(data?.at, { locale: vi });
      setDiffTime(a);
    }, 1000);
    return () => clearInterval(getDiffMin);
  }, []);

  return (
    <PopupNotiWrap>
      <NotiHeaderWrap>
        <div className="title"> {title} </div>
        <div className="time"> {diffTime} </div>
      </NotiHeaderWrap>
      <NotiBodyWrap>{props?.children || content}</NotiBodyWrap>
      <NotiFooterWrap>
        <BtnViewDetailWrap onClick={onViewDetail}>
          Xem chi tiết
        </BtnViewDetailWrap>
        <BtnCancelWrap onClick={onCancel}>Bỏ qua</BtnCancelWrap>
      </NotiFooterWrap>
    </PopupNotiWrap>
  );
}
