import React from 'react';
import { useHistory } from 'react-router';
import { ShowMoreItemWrap } from './styled';

export default function ShowMoreItem() {
  const history = useHistory();
  const onShowMore = () => {
    const el = document.querySelector('#badge-noti');
    el.click();
    history.push('/fire-warning');
  };
  return <ShowMoreItemWrap onClick={onShowMore}>Xem Tất cả</ShowMoreItemWrap>;
}
