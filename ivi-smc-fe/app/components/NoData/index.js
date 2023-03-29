import React from 'react';
import styled from 'styled-components';
import { IconNotFound } from 'constant/ListIcons';
import LoadingIndicator from 'components/LoadingIndicator';

export default function NoData({ text }) {
  return (
    <React.Fragment>
      <React.Suspense fallback={<LoadingIndicator />}>
        <LayoutNoData>
          <img src={IconNotFound} alt="no data" />
          <span> {text || 'Không có dữ liệu'} </span>
        </LayoutNoData>
      </React.Suspense>
    </React.Fragment>
  );
}
const LayoutNoData = styled.div`
  display: flex;
  margin: auto;
  min-height: 400px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  grid-gap: 10px;
`;
