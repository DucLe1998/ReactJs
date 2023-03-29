import React, { useState, useEffect } from 'react';

import moment from 'moment';
import useInterval from '../../../utils/hooks/useInterval';
import LoadingIcon from '../LoadingIcon';
import IconBtn from '../IconBtn';
import { IconStop } from '../Icon/ListIcon';

const ViewRecording = ({
  loadingCutVideo,
  stopAndStartRecord,
  onClickCut,
  broadcastId,
}) => {
  const [counter, setCounter] = useState(0);

  useInterval(() => {
    if (stopAndStartRecord) {
      setCounter(counter + 1000);
    }
  }, 1000);

  useEffect(() => {
    if (!stopAndStartRecord) {
      setCounter(0);
    }
  }, [stopAndStartRecord]);

  if (!stopAndStartRecord && !loadingCutVideo) {
    return <div />;
  }

  const countHouse = Math.floor((counter / (1000 * 60 * 60)) % 24);

  return (
    <div className="view-record">
      <div className="ct-flex-row main-view-record">
        {loadingCutVideo ? (
          <>
            <LoadingIcon /> Đang lưu ...
          </>
        ) : (
          <>
            <div className="shadow-icon-record">
              <div className="shadow-icon-record-children" />
            </div>
            Đang thu {countHouse < 10 ? `0${countHouse}` : countHouse}:
            {moment(counter).format('mm:ss')}
          </>
        )}
      </div>
      <div className="main-view-record-icon">
        <IconBtn
          disabled={loadingCutVideo}
          onClick={() => onClickCut(broadcastId)}
          style={{ padding: 4 }}
          icon={<IconStop />}
        />
      </div>
    </div>
  );
};

export default ViewRecording;
