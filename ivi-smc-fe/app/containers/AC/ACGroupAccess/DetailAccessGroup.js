/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable radix */
import Grid from '@material-ui/core/Grid';
import TabMainUseState from 'components/Custom/Tab/TabMainUseState';
import { useParams, useHistory } from 'react-router-dom';
import TitlePage from 'components/Custom/TitlePage';
import LabelInput from 'components/TextInput/element/LabelInput';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import Btn from 'components/Custom/Btn';
import TextInput from 'components/TextInput/TextInput';
import { callApi, getApi } from 'utils/requestUtils';
import utils, { validationSchema } from 'utils/utils';
import { ACCESS_CONTROL_API_SRC } from 'containers/apiUrl';
import Loading from 'containers/Loading/Loadable';

import VAutocomplete from './components/VAutocomplete';
import CtDropDownTree from './components/CtDropDownTree';

const DetailAccessGroup = () => {
  const history = useHistory();

  const { id, type } = useParams();
  const [tab, setTab] = useState('1');

  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset } = useForm({
    defaultValue: {
      kernelVersion: 'a',
    },
    resolver: validationSchema({
      name: yup.string().trim().required().max(100, '100 ký tự'),
      des: yup.string().trim().max(250, '250 ký tự'),
    }),
  });

  // const [data, setData] = useState('');
  const [doorAccess, setDoorAccess] = useState([]);
  const [userGroup, setUserGroup] = useState([{ id: '' }]);
  const [guestGroup, setGuestGroup] = useState([{ id: '' }]);
  const [user, setUser] = useState([]);
  const [dataInputForm, setDataInputForm] = useState({
    name: '',
    des: '',
  });
  const [data, setData] = useState('');

  useEffect(() => {
    if (id && id !== 'null') {
      fetchData();
    }
  }, [id]);

  const fetchData = async () => {
    setLoading(true);

    try {
      const res = await callApi(
        `${ACCESS_CONTROL_API_SRC}/access-groups/${id}`,
        'GET',
      );
      if (res) {
        // setData(res.data);
        const {
          name,
          description,
          doorAccesses = [],
          userGroups = [],
          users = [],
        } = res.data;
        setData(res.data);
        setDataInputForm({
          name,
          des: description,
        });
        setDoorAccess(
          res.data.doorAccesses !== null
            ? doorAccesses.map(
                (o) => ({ id: o.objectId, name: o.objectName } || []),
              )
            : [],
        );
        setTimeout(() => {
          setUserGroup(
            res.data.userGroups !== null
              ? userGroups
                  .filter((e) => e.groupType === 'USER')
                  .map((o) => ({ id: o.objectId, name: o.objectName } || []))
              : [{ id: '' }],
          );
        }, 300);
        setTimeout(() => {
          setGuestGroup(
            res.data.userGroups !== null
              ? userGroups
                  .filter((e) => e.groupType === 'GUEST')
                  .map((o) => ({ id: o.objectId, name: o.objectName } || []))
              : [{ id: '' }],
          );
        }, 300);
        setUser(
          res.data.users !== null
            ? users.map(
                (o) => ({ id: o.objectId, fullName: o.objectName } || []),
              )
            : [],
        );
        reset({
          name,
          des: description,
        });
      }
    } catch (error) {
      utils.showToastErrorCallApi(error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = () => {
    if (type === 'create') {
      if (!dataInputForm.name) {
        setTab('1');
        utils.showToast('Chưa nhập tên nhóm truy cập!', 'error');
        return;
      }
    }
    if (userGroup[0]?.id === '') userGroup.pop();
    const dto = {
      name: dataInputForm.name,
      description: dataInputForm.des,
      doorAccessIds: doorAccess
        ? (doorAccess || []).filter((o) => o.id !== undefined).map((o) => o.id)
        : [],
      userGroupIds: userGroup
        ? (userGroup || [])
            .filter((o) => o.id !== undefined)
            .map((o) => o.id)
            .concat(
              (guestGroup || [])
                .filter((o) => o.id !== undefined)
                .map((o) => o.id),
            )
        : [],
      userIds: user
        ? (user || []).filter((o) => o.id !== undefined).map((o) => o.id)
        : [],
    };

    if (type === 'create') {
      callApiUpdate(dto);
    } else {
      callApiUpdate(dto);
    }
  };

  const callApiUpdate = async (data) => {
    setLoading(true);
    try {
      await callApi(
        type === 'create'
          ? `${ACCESS_CONTROL_API_SRC}/access-groups`
          : `${ACCESS_CONTROL_API_SRC}/access-groups/${id}`,
        type === 'create' ? 'POST' : 'PUT',
        data,
      );
      if (type === 'create') {
        history.goBack();
      } else {
        fetchData();
        history.goBack();
      }
      utils.showToast(
        type === 'create' ? 'Tạo thành công' : 'Cập nhật thành công',
      );
    } catch (error) {
      utils.showToastErrorCallApi(error);
    } finally {
      setLoading(false);
    }
  };

  const ViewContent = () => {
    switch (tab) {
      default:
        return (
          <div>
            <Grid container spacing={4}>
              <Grid item sm={4}>
                <div className="ct-flex-row" style={{ marginBottom: 16 }}>
                  <TextInput
                    label="Tên nhóm truy cập *"
                    name="name"
                    innerRef={register()}
                    // showInputWithValue={type !== 'create'}
                    value={dataInputForm.name}
                    onChange={(e) => {
                      setDataInputForm((v) => ({
                        ...v,
                        name: e || '',
                      }));
                    }}
                  />
                </div>
              </Grid>
              <Grid item sm={4}>
                <LabelInput label="Cấp truy cập cửa" />
                <VAutocomplete
                  value={doorAccess}
                  multiple
                  disableClearable
                  firstIndex={1}
                  loadData={(page, keyword) =>
                    new Promise((resolve, reject) => {
                      getApi(`${ACCESS_CONTROL_API_SRC}/door-accesses`, {
                        keyword,
                        limit: 50,
                        page,
                      })
                        .then((result) => {
                          resolve({
                            data: result.data?.rows,
                            totalCount: result.data?.count,
                          });
                        })
                        .catch((err) => reject(err));
                    })
                  }
                  getOptionLabel={(option) => option.name}
                  getOptionSelected={(option, selected) =>
                    option.id == selected.id
                  }
                  onChange={(__e, newVal) => setDoorAccess(newVal)}
                />
              </Grid>

              <Grid item sm={4}>
                <CtDropDownTree
                  selectionMode="multiple"
                  showClearButton={false}
                  api="user-groups"
                  label="Nhóm người"
                  dataDefault={data}
                  value={userGroup}
                  onValueChanged={(newVal) => {
                    if (newVal.length > 0) {
                      if (
                        newVal[0].id === '8b44a058-3d58-4068-aa58-00c82c140962'
                      ) {
                        setUserGroup(
                          newVal.filter(
                            (o) =>
                              o.id === '8b44a058-3d58-4068-aa58-00c82c140962',
                          ),
                        );
                      } else {
                        setUserGroup(newVal);
                      }
                    } else {
                      setUserGroup([]);
                    }
                  }}
                />
              </Grid>
              <Grid item sm={4}>
                <CtDropDownTree
                  selectionMode="multiple"
                  showClearButton={false}
                  api="user-groups"
                  params="type=GUEST"
                  label="Nhóm khách"
                  dataDefault={data}
                  value={guestGroup}
                  onValueChanged={(newVal) => {
                    if (newVal.length > 0) {
                      if (
                        newVal[0].id === '8b44a058-3d58-4068-aa58-00c82c140962'
                      ) {
                        setGuestGroup(
                          newVal.filter(
                            (o) =>
                              o.id === '8b44a058-3d58-4068-aa58-00c82c140962',
                          ),
                        );
                      } else {
                        setGuestGroup(newVal);
                      }
                    } else {
                      setGuestGroup([]);
                    }
                  }}
                />
              </Grid>
              {type !== 'create' ? (
                <Grid item sm={4}>
                  <LabelInput label="Danh sách người" />
                  <VAutocomplete
                    multiple
                    value={user}
                    disabled
                    disableClearable
                    firstIndex={1}
                    loadData={(page, keyword) =>
                      new Promise((resolve, reject) => {
                        getApi(`${ACCESS_CONTROL_API_SRC}/users/search`, {
                          keyword,
                          limit: 50,
                          page,
                        })
                          .then((result) => {
                            resolve({
                              data: result.data?.rows,
                              totalCount: result.data?.count,
                            });
                          })
                          .catch((err) => reject(err));
                      })
                    }
                    getOptionLabel={(option) =>
                      option.fullName[option.fullName.length - 1] === ')'
                        ? `${option.fullName || ''}`
                        : `${option.fullName || ''}(${option.accessCode || ''})`
                    }
                    getOptionSelected={(option, selected) =>
                      option.id == selected.id
                    }
                    onChange={(_e, newVal) => {
                      setUser(newVal);
                    }}
                  />
                </Grid>
              ) : null}

              <Grid item sm={8}>
                <div className="ct-flex-row" style={{ marginBottom: 16 }}>
                  <TextInput
                    label="Mô tả"
                    name="des"
                    innerRef={register()}
                    // showInputWithValue={type !== 'create'}
                    value={dataInputForm.des}
                    onChange={(e) => {
                      setDataInputForm((v) => ({
                        ...v,
                        des: e || '',
                      }));
                    }}
                  />
                </div>
              </Grid>
            </Grid>
          </div>
        );
    }
  };

  return (
    <div style={{ marginTop: 24 }}>
      <div
        style={{ justifyContent: 'space-between', marginBottom: 24 }}
        className="ct-flex-row"
      >
        <div>
          <TitlePage
            title={
              type === 'create'
                ? 'Thêm mới quản lý nhóm quyền truy cập'
                : 'Chi tiết quản lý nhóm quyền truy cập'
            }
          />
        </div>
        <div className="ct-flex-row">
          <Btn
            colorText="#333"
            className="btn-cancel"
            label="Hủy"
            onClick={() => {
              history.goBack();
            }}
          />
          <Btn
            colorText="#FFF"
            className="btn-save"
            label={type === 'create' ? 'Tạo' : 'Lưu'}
            onClick={onSubmit}
          />
        </div>
      </div>
      <div
        style={{
          padding: '12px 26px 26px 26px',
          borderRadius: 8,
          // pointerEvents: !scopes?.update && 'none',
          backgroundColor: '#FFF',
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <TabMainUseState
            style={{ marginBottom: 16 }}
            callback={(e) => setTab(e)}
            tab={tab}
            data={[{ label: '', key: '2' }]}
          />

          {ViewContent()}
        </form>
      </div>

      {loading && <Loading />}
    </div>
  );
};

export default DetailAccessGroup;
