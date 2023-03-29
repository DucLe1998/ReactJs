import React, { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import vi from 'date-fns/locale/vi';
import { useHistory } from 'react-router';
import { NotiItemWrap } from './styled';

const getData = d => d?.data && JSON.parse(d?.data);

export default function NotiItem({ data }) {
  const [diffTime, setDiffTime] = useState();
  const history = useHistory();
  const dataId = getData(data)?.dataId;

  const d = getData(data);
  const content = d?.location || d?.content;

  useEffect(() => {
    const getDiffMin = setInterval(() => {
      const a = formatDistanceToNow(data?.notificationAt, { locale: vi });
      setDiffTime(a);
    }, 1000);
    return () => clearInterval(getDiffMin);
  }, []);

  return (
    <NotiItemWrap
      onClick={() => dataId && history.push(`/fire-warning/${dataId}`)}
    >
      <div className="header">
        <div className="title"> {data?.title} </div>
        <div className="time"> {diffTime}</div>
      </div>
      <div className="content">{content}</div>
    </NotiItemWrap>
  );
}
