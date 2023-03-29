import React, { useEffect, useState } from 'react';
import { getApiCustom } from 'utils/requestUtils';
import NoData from 'components/NoData';
import { NOTIFICATION_EVENT_API } from 'containers/apiUrl';
import NotiItem from './NotiItem';
import ShowMoreItem from './ShowMoreItem';
import { ListNotiWrap, NotiContainerWrap } from './styled';
import LoadingNoti from './LoadingNoti';

export default function NotisOverView(props) {
  const { visable } = props;
  const [noti, setNoti] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visable) {
      setLoading(true);
      getApiCustom(
        {
          url: NOTIFICATION_EVENT_API.LIST,
          params: {
            eventTypes: 'FIRE_ALARM',
            displayCms: 'true',
            limit: 15,
          },
        },
        res => {
          setNoti(res?.rows);
          setLoading(false);
        },
      );
    }
  }, [visable]);

  if (loading) return <LoadingNoti />;
  if (!loading && !noti.length) return <NoData text="Không có thông báo nào" />;

  return (
    <NotiContainerWrap>
      <ListNotiWrap>
        {React.Children.toArray(noti.map(o => <NotiItem data={o} />))}
      </ListNotiWrap>
      <ShowMoreItem />
    </NotiContainerWrap>
  );
}
