import React, { useCallback, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import PageHeader from 'components/PageHeader';
import { LayoutBackground } from 'components/CommonComponent';
import { checkAuthority } from 'utils/functions';
import { getApiCustom } from '../../../utils/requestUtils';
import { API_FORBIDDEN_AREA } from '../../apiUrl';
import Info from './Info';
import WhiteUser from './WhiteUser';
import LoadingIndicator from '../../../components/LoadingIndicator';

export default function DetailForbiddenArea({ userAuthority }) {
  const params = useParams();
  const history = useHistory();
  const { id } = params;
  const [data, setData] = useState();
  const [loading, setLoading] = useState();

  const resourceCode = 'cameraai/forbidden-area';
  const scopes = checkAuthority(
    ['create', 'update', 'delete'],
    resourceCode,
    userAuthority,
  );

  const fetchData = useCallback(() => {
    setLoading(true);
    getApiCustom(
      {
        url: API_FORBIDDEN_AREA.DETAIL,
        params: {
          forbiddenAreaId: id,
        },
      },
      res => {
        setData(res);
        setLoading(false);
      },
    );
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [id]);

  return (
    <React.Fragment>
      <React.Suspense fallback={<LoadingIndicator />}>
        <PageHeader
          title="Chi tiết khu vực cấm"
          showBackButton
          onBack={() => history.push(`/camera-ai/forbidden-area`)}
        />
        <LayoutBackground>
          {loading ? (
            <LoadingIndicator />
          ) : (
            <>
              <Info data={data} refresh={fetchData} scopes={scopes} />
              <WhiteUser
                data={data || []}
                refresh={fetchData}
                scopes={scopes}
              />
            </>
          )}
        </LayoutBackground>
      </React.Suspense>
    </React.Fragment>
  );
}
