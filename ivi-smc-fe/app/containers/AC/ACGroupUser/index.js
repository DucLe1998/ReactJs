/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable consistent-return */
/* eslint-disable radix */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useEffect, useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { Popup } from 'devextreme-react/popup';
import CustomTable from 'components/Custom/table/CustomTable';
import useUrlState from '@ahooksjs/use-url-state';
import utils from 'utils/utils';
import IconBtn from 'components/Custom/IconBtn';
import Pagination from 'components/PageHeader/Pagination';
import { ACCESS_CONTROL_API_SRC } from 'containers/apiUrl';
import HeaderMain from 'components/Custom/Header/HeaderMain';
import TreeViewGroup from 'components/Custom/AreaTree/TreeViewGroup';
import gui from 'utils/gui';
import { IconFilter } from 'components/Custom/Icon/ListIcon';
import Loading from 'containers/Loading/Loadable';
import { callApi } from 'utils/requestUtils';
import FilterUser from './popups/FilterUser';
import { COLUMNSLISTUSER } from './constants';

const useStyles = makeStyles(() => ({
  filter: {
    zIndex: '1299 !important',
  },
}));

const initValueFilter = {
  keyword: '',
  limit: 25,
  page: 1,
  tab: '1',
  userType: 'USER',
};

export function ACGroupUser() {
  const [valueFilter, setValueFilter] = useUrlState(initValueFilter);

  const classes = useStyles();
  const [listUser, setListUser] = useState({});
  const [openFilter, setOpenFilter] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reloadTreeView, setReloadTreeView] = useState(0);

  useEffect(() => {
    if (valueFilter?.tab) {
      fetchData();
    }
  }, [valueFilter]);

  const fetchData = () => {
    if (valueFilter.groupId) {
      fetchDataListUser(valueFilter.groupId);
    }
  };

  const handleSetValueFilter = (data) => {
    const newDto = {
      userType: data?.userType.value || undefined,
      accessGroupIds:
        data?.accessGroupIds?.length > 0
          ? JSON.stringify(
              data?.accessGroupIds?.map((e) => ({ id: e.id, name: e.name })),
            )
          : [],
      identifyOption: data?.identifyOption?.length
        ? JSON.stringify(data?.identifyOption)
        : undefined,
      status: data?.status.value || undefined,
      validTimeType: data?.validTimeType.value || undefined,
      page: 1,
    };
    setValueFilter(newDto);
    setOpenFilter(false);
  };
  const fetchDataListUser = async (groupId) => {
    const AGid =
      valueFilter?.accessGroupIds?.length > 0
        ? JSON.parse(valueFilter.accessGroupIds).map((e) => e.id)
        : [];
    const payload = {
      keyword: valueFilter.keyword || null,
      page: valueFilter.page,
      limit: valueFilter.limit,
      // currentGroupId: AGid,
      accessGroupIds: AGid,
      identifyOption: valueFilter?.identifyOption
        ? JSON.parse(valueFilter?.identifyOption).map((i) => i.value)
        : null,
      status: valueFilter?.status || null,
      userType: valueFilter?.userType || null,
      validTimeType: valueFilter?.validTimeType || null,
      currentGroupId: groupId,
    };

    setLoading(true);
    const dto = utils.queryString(payload);
    try {
      const res = await callApi(
        `${ACCESS_CONTROL_API_SRC}/user-access/search?${dto}`,
        'GET',
      );
      setListUser(res.data);
    } catch (error) {
      utils.showToastErrorCallApi(error);
    } finally {
      setLoading(false);
    }
  };

  const ViewContentTab = () => (
    <>
      <div
        className="ct-content-main"
        style={{
          height: gui.heightContentOfScreen,
          maxHeight: gui.heightContentOfScreen,
        }}
      >
        <div className="ct-content-main-left">
          <TreeViewGroup
            textApi="người dùng"
            api="user"
            params={`type=${valueFilter.userType}`}
            titleDelete="Xóa nhóm người dùng"
            ContentDelete="Điều này sẽ xoá toàn bộ danh sách user nằm trong thư mục.
            Bạn có chắc chắn muốn thực hiện việc này"
            ContentDeleteSub="Bạn có chắc chắn muốn xóa nhóm"
            elementTotal="totalUser"
            groupId={valueFilter.groupId}
            reloadTreeView={reloadTreeView}
            callback={(e) => {
              setValueFilter({ page: 1, groupId: e });
            }}
            callbackReload={() => fetchData()}
          />
        </div>
        <div className="ct-content-main-right">
          <CustomTable
            data={listUser.rows || []}
            disabledSelect
            row={COLUMNSLISTUSER}
            height={gui.heightTable}
          />
          <div
            style={{
              marginTop: 20,
            }}
          >
            <Pagination
              totalCount={listUser?.count || 0}
              pageIndex={parseInt(valueFilter.page || 1)}
              rowsPerPage={parseInt(valueFilter.limit || 25)}
              handlePageSize={(e) =>
                setValueFilter({ limit: e.target.value, page: 1 })
              }
              handleChangePageIndex={(e) => setValueFilter({ page: e })}
            />
          </div>
        </div>
      </div>

      {loading && <Loading />}

      {openFilter && (
        <Popup
          className={`${classes.filter} popup`}
          visible
          title="Bộ lọc"
          showTitle
          onHidden={() => {
            setOpenFilter(false);
          }}
          width="50%"
          height="auto"
        >
          <FilterUser
            onClose={() => setOpenFilter(false)}
            callback={handleSetValueFilter}
            valueFilter={valueFilter}
          />
        </Popup>
      )}
    </>
  );

  return (
    <div className="ct-root-page">
      <HeaderMain
        onClickTab={(v) => {
          if (v === '1') {
            setValueFilter({ userType: 'USER', tab: 1, groupId: '' });
          } else if (v === '2') {
            setValueFilter({ userType: 'GUEST', tab: 2 });
          }
          setReloadTreeView((v) => v + 1);
          setLoading(true);
        }}
        data={[
          { label: 'Danh sách nhóm người dùng', key: '1' },
          { label: 'Danh sách khách', key: '2' },
        ]}
        placeholderSearch="Nhập thông tin tìm kiếm...."
        defaultValueSearch={valueFilter.keyword}
        onSearchValueChange={(e) => setValueFilter({ keyword: e, page: 1 })}
        buttonRight={() => (
          <div className="ct-flex-row">
            {[
              {
                icon: (
                  <IconBtn
                    icon={
                      <IconFilter
                        color={
                          valueFilter?.deviceType ||
                          valueFilter?.status ||
                          valueFilter?.devicePosittion
                            ? '#007BFF'
                            : ''
                        }
                      />
                    }
                    style={styles.iconBtnHeader}
                    showTooltip="Bộ lọc"
                  />
                ),
                width: 40,
                onClick: () => setOpenFilter(true),
              },
            ].map((item, index) => (
              <div
                key={index.toString()}
                style={{ width: item.width, marginRight: 10 }}
                onClick={item.onClick}
                className="ct-div-btn-no-bg ct-flex-row"
              >
                {item.icon}
                <div>{item.label}</div>
                {item.icon2 ? item.icon2 : null}
              </div>
            ))}
          </div>
        )}
      />
      {ViewContentTab()}
    </div>
  );
}

const styles = {
  iconBtnHeader: {
    backgroundColor: 'rgba(116, 116, 128, 0.08)',
    height: 36,
    width: 36,
    borderRadius: 6,
  },
};

export default ACGroupUser;
