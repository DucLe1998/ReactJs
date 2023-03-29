import React, { useEffect, Fragment, useState } from 'react';
import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import Grid from '@material-ui/core/Grid';
import PageHeader from 'components/PageHeader';
import NoData from 'components/NoData';
import LoadingIndicator from 'components/LoadingIndicator';
import { useIntl } from 'react-intl';
import { endOfDay, startOfDay } from 'date-fns';
import { postApiCustom } from 'utils/requestUtils';
import { showError } from 'utils/toast-utils';
import reducer from './reducer';
import saga from './saga';
import { DetailItemDetectedEvent } from './DetailItemDetectedEvent';
import SearchTop from './SearchTop';
import { API_CAMERA_AI } from '../apiUrl';
import messages from './messages';

const key = 'ListItem';

const initParams = {
  limit: 25,
  page: 1,
  fromDate: startOfDay(new Date()),
  toDate: endOfDay(new Date()),
};
export function ListItemCameraAi() {
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });
  const intl = useIntl();
  const [data, setData] = useState();
  const [params, setParams] = useState(initParams);
  const [loading, setLoading] = useState(false);
  const [firstRender, setFirstRender] = useState(true);

  const fetchData = () => {
    if (firstRender) return;
    setLoading(true);
    setData([]);
    const fixParam = coverToFormData(params);
    postApiCustom(
      {
        url: API_CAMERA_AI.LIST_ITEMS_CAMERAAI_3_12,
        payload: fixParam,
      },
      (res) => {
        setData(res);
        setLoading(false);
      },
      (err) => {
        setData([]);
        setLoading(false);
        showError(err);
      },
    );
  };

  const onSearch = (e) => {
    if (firstRender) {
      setFirstRender(false);
    }
    setParams(e);
  };
  const onChangeLimit = (e) => {
    if (!e || !e.target) return;
    if (e.target.value !== params.limit) {
      setParams({ ...params, page: initParams.page, limit: e.target.value });
    }
  };

  const onChangePage = (e) => {
    if (!e) return;
    if (e !== params.page) {
      setParams({ ...params, page: e });
    }
  };

  const getTitle = () =>
    `${intl.formatMessage(messages.searchResult)} (${data?.count || 0})`;

  const coverToFormData = (o) => {
    const b = new FormData();
    for (const i in o) {
      o[i] && b.append(i, o[i]);
    }
    return b;
  };

  useEffect(() => {
    fetchData();
  }, [params]);

  const renderHeader = () => (
    <PageHeader
      title={getTitle()}
      showPager
      pageIndex={params.page || 0}
      totalCount={data?.count || 0}
      rowsPerPage={params.limit || 0}
      handleChangePageIndex={onChangePage}
      handlePageSize={onChangeLimit}
    />
  );

  const renderContent = () => {
    if (!data || !data?.rows?.length) {
      return <NoData />;
    }
    return (
      <Grid container spacing={2} justify="flex-start">
        {data?.rows?.map((elem) => (
          <DetailItemDetectedEvent elem={elem} key={data?.rows.indexOf(elem)} />
        ))}
      </Grid>
    );
  };
  return (
    <Fragment>
      <SearchTop params={params} onSubmit={onSearch} />
      {!firstRender && (
        <>
          {renderHeader()}
          {loading ? <LoadingIndicator /> : renderContent()}
        </>
      )}
    </Fragment>
  );
}

export default ListItemCameraAi;
