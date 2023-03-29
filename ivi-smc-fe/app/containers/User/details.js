import PageHeader from 'components/PageHeader';
import SMCTab from 'components/SMCTab';
import React, { useState } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import Info from './edit';
import AccessControl from './render/AccessControl';
import Identities from './render/identities';
import IdentificationUserAccessControl from './render/IdentificationUserAccessControl';
import Parking from './render/InfoParkinglot';
export default function Details({ history, location }) {
  const { path, url } = useRouteMatch();
  // const { id } = useParams();
  const listTabs = [
    { id: 'info', text: 'Thông tin cá nhân' },
    { id: 'identity', text: 'Thông tin định danh' },
    { id: 'accessControl', text: 'Kiểm soát vào ra' },
    { id: 'parking', text: 'Thông tin gửi xe' },
  ];
  let currentTab = location.pathname.split('/').reverse()[0];
  if (!listTabs.map((v) => v.id).includes(currentTab)) {
    currentTab = null;
  }
  const [selectedTab, setSelectedTab] = useState(currentTab);
  const goBack = () => {
    history.push({ pathname: '/user', state: location.state });
  };

  return (
    <>
      <PageHeader title="Chi tiết người dùng" showBackButton onBack={goBack}>
        <SMCTab
          items={listTabs}
          selectedTabId={selectedTab}
          onChange={(id) => {
            setSelectedTab(id);
            history.push(`${url}/${id}`);
          }}
        />
      </PageHeader>
      <Switch>
        <Route exact path={`${path}/identity`} component={IdentificationUserAccessControl} />
        <Route exact path={`${path}/parking`} component={Parking} />
        <Route exact path={`${path}/accesscontrol`} component={AccessControl} />
        <Route component={Info} />
      </Switch>
    </>
  );
}
