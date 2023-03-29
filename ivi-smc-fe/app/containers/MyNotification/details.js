import { Paper, Typography } from '@material-ui/core';
import useAxios from 'axios-hooks';
import PageHeader from 'components/PageHeader';
import { NOTIFICATION_API } from 'containers/apiUrl';
import Loading from 'containers/Loading/Loadable';
import { format } from 'date-fns';
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import ReactHtmlParser from 'react-html-parser';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { showError } from 'utils/toast-utils';

const ContentContainer = styled.div`
  img {
    max-width: 100%;
    height: auto;
  }
`;
export default function Details({ history, location }) {
  const { id } = useParams();
  // const [{ data: getData, loading: getLoading, error: getError }, executeGet] =
  //   useAxios(NOTIFICATION_API.DETAILS(id), {
  //     manual: true,
  //   });
  useEffect(() => {
    if (id) executeGet();
  }, [id]);
  useEffect(() => {
    if (getError) showError(getError);
  }, [getError]);
  const onBack = () => {
    history.push({
      pathname: '/me-notification',
      state: location.state,
    });
  };
  return (
    <>
      <Helmet>
        <title>Chi tiết thông báo</title>
        <meta name="description" content="Chi tiết thông báo" />
      </Helmet>
      {getLoading && <Loading />}
      <PageHeader title="Chi tiết thông báo" showBackButton onBack={onBack} />
      {getData && (
        <>
          <Typography variant="h4" component="div">
            {getData?.title}
          </Typography>
          <Typography variant="caption" olor="textSecondary" component="p">
            {format(getData?.createdAt, 'HH:mm dd/MM/yyyy')}
          </Typography>
          <Paper
            style={{
              padding: 16,
              marginTop: 16,
            }}
          >
            <ContentContainer>
              {ReactHtmlParser(getData?.content || '')}
            </ContentContainer>
          </Paper>
        </>
      )}
    </>
  );
}
