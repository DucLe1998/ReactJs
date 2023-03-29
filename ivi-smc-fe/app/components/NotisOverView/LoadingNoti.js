import React from 'react';
import Skeleton from '@material-ui/lab/Skeleton';
import { ListNotiWrap, NotiContainerWrap, NotiItemWrap } from './styled';
import ShowMoreItem from './ShowMoreItem';

export default function LoadingNoti() {
  const l = new Array(10).fill();
  return (
    <NotiContainerWrap>
      <ListNotiWrap>
        {React.Children.toArray(
          l.map(() => (
            <NotiItemWrap>
              <div className="header">
                <div className="title">
                  <Skeleton variant="rect" width={200} height={20} />
                </div>
                <div className="time">
                  <Skeleton variant="text" width={50} height={10} />
                </div>
              </div>
              <div className="content">
                <Skeleton variant="text" width={323} height={20} />
              </div>
            </NotiItemWrap>
          )),
        )}
      </ListNotiWrap>
      <ShowMoreItem />
    </NotiContainerWrap>
  );
}
