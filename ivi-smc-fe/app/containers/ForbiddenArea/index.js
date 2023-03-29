import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import PageHeader from 'components/PageHeader';
import _, { uniqueId } from 'lodash';
import Grid from '@material-ui/core/Grid';
import { checkAuthority } from 'utils/functions';
import SearchTop from './SearchTop';
import { getApiCustom } from '../../utils/requestUtils';
import CardItem from './CardItem';
import { API_FORBIDDEN_AREA } from '../apiUrl';
import LoadingIndicator from '../../components/LoadingIndicator';
import NoData from '../../components/NoData';
import { showError } from 'utils/toast-utils';

const initParams = {
  page: 1,
  limit: 50,
  keyword: '',
};

export function ForbiddenArea({ userAuthority }) {
  const [params, setParams] = useState(initParams);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const resourceCode = 'cameraai/forbidden-area';
  const scopes = checkAuthority(['get'], resourceCode, userAuthority);

  const onFilter = value => {
    const newParams = { ...params, ...value, page: 1 };
    if (!_.isEqual(newParams, params)) {
      setParams(newParams);
    }
  };

  const onChangeLimit = e => {
    if (!e || !e.target) return;
    if (e.target.value !== params.limit) {
      setParams({
        ...params,
        page: initParams.page,
        limit: e.target.value,
      });
    }
  };

  const onChangePage = e => {
    if (!e) return;
    if (e !== params.page) {
      setParams({ ...params, page: e });
    }
  };

  const getTitle = () => `Kết quả tìm kiếm (${data?.count || 0})`;

  const renderHeader = () => (
    <PageHeader
      title={getTitle()}
      showPager
      handleChangePageIndex={onChangePage}
      handlePageSize={onChangeLimit}
      totalCount={data?.count || 0}
      pageIndex={(params && params.page) || 0}
      rowsPerPage={(params && params.limit) || 50}
    />
  );

  const renderContent = () => {
    if (!data || !data?.rows || !data?.rows?.length) {
      return <NoData />;
    }
    return (
      <Grid container spacing={3}>
        {(data?.rows || []).map(o => (
          <Grid item sm={3} xs={4} key={uniqueId()}>
            <CardItem data={o} scopes={scopes} />
          </Grid>
        ))}
      </Grid>
    );
  };

  const fetchData = () => {
    setLoading(true);
    getApiCustom(
      {
        url: API_FORBIDDEN_AREA.SEARCH,
        params: _.pickBy(params),
      },
      res => {
        setData(res);
        setLoading(false);
      },
      e => {
        showError(e);
        setLoading(false);
      },
    );
  };

  useEffect(() => {
    fetchData();
  }, [params]);

  return (
    <React.Fragment>
      <Helmet>
        <title>ForbiddenArea</title>
        <meta name="description" content="Description of ForbiddenArea" />
      </Helmet>
      <SearchTop onFilter={onFilter} loading={loading} />
      <React.Suspense fallback={<LoadingIndicator />}>
        {renderHeader()}
        {loading ? <LoadingIndicator /> : renderContent()}
      </React.Suspense>
    </React.Fragment>
  );
}

export default ForbiddenArea;
