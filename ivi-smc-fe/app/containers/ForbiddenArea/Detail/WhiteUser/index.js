import React, { useState } from 'react';
import { Button, Popup } from 'devextreme-react';
import qs from 'qs';
import LoadingIndicator from 'components/LoadingIndicator';
import { delApiCustom, postApiCustom } from 'utils/requestUtils';
import ListWhiteUser from './ListWhiteUser';
import { WhiteUserHeaderTitle, WhiteUserHeaderWrap } from '../styled';
import { API_FORBIDDEN_AREA } from '../../../apiUrl';
import AddWhiteUser from './AddWhiteUser';
import { PopupAddWhiteUserWrap } from './styled';

export default function WhiteUser({ data, refresh, scopes }) {
  const [showPopupAdd, setShowPopUpAdd] = useState(false);

  const onAdd = employCode => {
    setShowPopUpAdd(!showPopupAdd);
    postApiCustom(
      {
        url: API_FORBIDDEN_AREA.ADD_WHITE_USER({
          forbiddenAreaId: data?.id,
        }).concat(
          '?',
          qs.stringify({
            employeeCodes: employCode,
          }),
        ),
      },
      refresh,
    );
  };
  const onRemove = employCode => {
    delApiCustom(
      {
        url: API_FORBIDDEN_AREA.DELELE_WHITE_USER({
          whiteUserId: employCode,
          forbiddenAreaId: data?.id,
        }),
      },
      refresh,
    );
  };
  return (
    <React.Fragment>
      <React.Suspense fallback={<LoadingIndicator />}>
        <WhiteUserHeaderWrap>
          <WhiteUserHeaderTitle>
            Đối tượng được vào khu vực cấm
          </WhiteUserHeaderTitle>
          {scopes.create && (
            <Button
              disabled={showPopupAdd}
              text="Thêm mới"
              onClick={() => setShowPopUpAdd(!showPopupAdd)}
            />
          )}
        </WhiteUserHeaderWrap>
        <ListWhiteUser
          data={data?.areaUsers || []}
          onRemove={onRemove}
          scopes={scopes}
        />
        <Popup
          visible={showPopupAdd}
          onHiding={() => setShowPopUpAdd(false)}
          width={600}
          height={600}
          title="Thêm mới nhân viên được phép vào khu vực cấm"
        >
          <PopupAddWhiteUserWrap>
            <AddWhiteUser
              visible={showPopupAdd}
              onAdd={onAdd}
              onCancel={() => setShowPopUpAdd(false)}
            />
          </PopupAddWhiteUserWrap>
        </Popup>
      </React.Suspense>
    </React.Fragment>
  );
}
