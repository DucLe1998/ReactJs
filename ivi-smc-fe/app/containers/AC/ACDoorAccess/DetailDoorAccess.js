/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable radix */
import Grid from '@material-ui/core/Grid';
import TabMainUseState from 'components/Custom/Tab/TabMainUseState';
import { useParams, useHistory } from 'react-router-dom';
import TitlePage from 'components/Custom/TitlePage';
import IconBtn from 'components/Custom/IconBtn';
import { IconDelete, IconEdit } from 'components/Custom/Icon/ListIcon';
import CustomTable from 'components/Custom/table/CustomTable';
import Btn from 'components/Custom/Btn';
import TextInput from 'components/TextInput/TextInput';
import { callApi, getApi } from 'utils/requestUtils';
import utils, { validationSchema } from 'utils/utils';
import { ACCESS_CONTROL_API_SRC } from 'containers/apiUrl';
import Loading from 'containers/Loading';
import gui from 'utils/gui';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import VAutocomplete from './components/VAutocomplete';
import CtDropDownTree from './components/CtDropDownTree';

const DetailDoorAccess = () => {
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
  const [listDoorAccess, setListDoorAccess] = useState([]);
  const [doorList, setDoorList] = useState([]);
  const [isOnOpen, setIsOnOpen] = useState(false);
  const [dataTableRoleAndFloor, setDataTableRoleAndFloor] = useState([]);
  const [dataInputForm, setDataInputForm] = useState({
    name: '',
    des: '',
  });

  useEffect(() => {
    if (id && id !== 'null') {
      fetchData();
    }
  }, [id]);

  const fetchData = async () => {
    setLoading(true);

    try {
      const res = await callApi(
        `${ACCESS_CONTROL_API_SRC}/door-accesses/${id}`,
        'GET',
      );
      if (res) {
        // setData(res.data);
        const { name, description, policies = [] } = res.data;
        setDataInputForm({
          name,
          des: description,
        });
        const policiesCv = [];
        const doorData = [];
        while (policies.length > 0) {
          doorData.push({ id: policies[0].doorId, name: policies[0].doorName });
          for (let i = 1; i < policies.length; i++) {
            if (
              policies[0].doorGroupId === policies[i].doorGroupId &&
              policies[0].scheduleId === policies[i].scheduleId
            ) {
              doorData.push({
                id: policies[i].doorId,
                name: policies[i].doorName,
              });
            }
          }
          policiesCv.push({ ...policies[0], doorData: [...doorData] });
          const temp = policies.filter(
            (o) =>
              o.doorGroupId !== policies[0].doorGroupId ||
              o.scheduleId !== policies[0].scheduleId,
          );
          const ld = doorData.length;
          for (let i = 0; i < ld; i++) {
            doorData.pop();
          }
          const l = policies.length;
          for (let i = 0; i < l; i++) {
            policies.pop();
          }
          for (let i = 0; i < temp.length; i++) {
            policies.push(temp[i]);
          }
        }

        const listDoor = policiesCv?.map((item, index) => ({
          doorGroup: item === undefined ? '' : item.doorGroupName,
          doorData: item === undefined ? [] : item.doorData,
          doorGroupId: item === undefined ? '' : item.doorGroupId,
          doorName: item === undefined ? '' : item.doorName,
          doorId: item === undefined ? '' : item.doorId,
          schedule:
            item === undefined
              ? ''
              : item.schedule === null
              ? 'Luôn luôn'
              : item?.schedule?.name,
          scheduleId:
            item === undefined
              ? ''
              : item.scheduleId === null
              ? null
              : item.scheduleId,
          id: index,
          key: index + 1,
          isEdit: false,
        }));
        setListDoorAccess(listDoor);
        setDataTableRoleAndFloor(listDoor);
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

  //   const renderShowError = (label, name) => (
  //     <ShowErrorValidate label={label} errors={errors} name={name} />
  //   );

  const onSubmit = () => {
    if (type === 'create') {
      if (!dataInputForm?.name) {
        setTab('1');
        utils.showToast('Chưa nhập tên cấp truy cập!', 'error');
        return;
      }
    }
    const dataTableRoleAndFloorCv = [];
    for (let i = 0; i < dataTableRoleAndFloor.length; i++) {
      for (let j = 0; j < dataTableRoleAndFloor[i].doorData.length; j++) {
        dataTableRoleAndFloorCv.push({
          doorId: dataTableRoleAndFloor[i].doorData[j].id,
          doorname: dataTableRoleAndFloor[i].doorData[j].name,
          scheduleId: dataTableRoleAndFloor[i].scheduleId,
          schedule: dataTableRoleAndFloor[i].schedule,
        });
      }
    }
    const dto = {
      name: dataInputForm.name,
      description: dataInputForm.des,
      policies:
        dataTableRoleAndFloorCv?.map((item) => ({
          applyMode: item.scheduleId ? 'CUSTOMIZE' : 'ALWAYS',
          doorId: item.doorId,
          scheduleId: item.scheduleId,
        })) || [],
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
          ? `${ACCESS_CONTROL_API_SRC}/door-accesses`
          : `${ACCESS_CONTROL_API_SRC}/door-accesses/${id}`,
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

  const onAddNewDoorAccess = () => {
    const newDoorAccess = utils.createArray(1) || [];
    const newListDoorAccess = [...listDoorAccess, ...newDoorAccess];
    setListDoorAccess(newListDoorAccess);
    setDataTableRoleAndFloor(
      newListDoorAccess.map((item, index) => ({
        doorGroup: item === undefined ? '' : item.doorGroup,
        doorData: item === undefined ? [] : item.doorData,
        doorGroupId: item === undefined ? '' : item.doorGroupId,
        doorName: item === undefined ? '' : item.doorName,
        doorId: item === undefined ? '' : item.doorId,
        schedule: item === undefined ? '' : item.schedule,
        scheduleId: item === undefined ? null : item.scheduleId,
        id: index,
        key: index + 1,
        isEdit: item === undefined ? false : item.isEdit,
      })),
    );
  };

  const onChangeListDoorAccess = (item, value, type) => {
    const found = dataTableRoleAndFloor.find((e) => e?.id === item?.id);
    if (found) {
      if (type === 'doorGroup') {
        found.doorGroup =
          value === undefined || value === null ? '' : value.name;
        found.doorGroupId =
          value === undefined || value === null ? '' : value.id;
        found.doorData = [];
        found.doorName = '';
        found.doorId = '';
      } else if (type === 'doorName') {
        found.doorName = value[0]?.name;
        found.doorId = value[0].id;
        found.doorData = value.map((o) => ({ id: o.id, name: o.name }));
        found.isEdit = false;
      } else if (type === 'isEdit') {
        found.isEdit = true;
      } else {
        found.schedule = value.name;
        found.scheduleId = value.id;
      }
    }
    const foundExit = dataTableRoleAndFloor.filter((e) => e.id !== item.id);
    setDataTableRoleAndFloor(
      [...foundExit, found].sort((a, b) => a.key - b.key),
    );
    setListDoorAccess([...foundExit, found].sort((a, b) => a.key - b.key));
  };

  const IconPlus = () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        stroke="#4B67E2"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.70016 1.16667C7.70016 0.780075 7.38675 0.466675 7.00016 0.466675C6.61356 0.466675 6.30016 0.780075 6.30016 1.16667V6.30005H1.16666C0.78006 6.30005 0.46666 6.61345 0.46666 7.00005C0.46666 7.38665 0.78006 7.70005 1.16666 7.70005H6.30016V12.8333C6.30016 13.2199 6.61356 13.5333 7.00016 13.5333C7.38675 13.5333 7.70016 13.2199 7.70016 12.8333V7.70005H12.8333C13.2199 7.70005 13.5333 7.38665 13.5333 7.00005C13.5333 6.61345 13.2199 6.30005 12.8333 6.30005H7.70016V1.16667Z"
        fill="#3C3C43"
        fillOpacity="0.6"
      />
    </svg>
  );

  const ViewContent = () => {
    switch (tab) {
      default:
        return (
          <div>
            <Grid container spacing={4}>
              <Grid item sm={6}>
                <div className="ct-flex-row" style={{ marginBottom: 16 }}>
                  <TextInput
                    label="Tên cấp truy cập *"
                    name="name"
                    innerRef={register()}
                    // showInputWithValue={type !== 'create'}
                    value={dataInputForm?.name}
                    onChange={(e) => {
                      dataInputForm.name = e;
                    }}
                  />
                </div>
              </Grid>
              <Grid item sm={6} />
              <Grid item sm={12}>
                <div className="ct-flex-row" style={{ marginBottom: 16 }}>
                  <TextInput
                    label="Mô tả"
                    name="des"
                    innerRef={register()}
                    // showInputWithValue={type !== 'create'}
                    value={dataInputForm.des}
                    onChange={(e) => {
                      dataInputForm.des = e;
                    }}
                  />
                </div>
              </Grid>
              <Grid item sm={12}>
                <div
                  style={{
                    justifyContent: 'space-between',
                  }}
                  className="ct-flex-row"
                >
                  <div className="ct-flex-row">Danh sách cửa và lịch</div>
                  <div
                    style={{
                      color: '#4B67E2',
                    }}
                    className="ct-flex-row"
                  >
                    {[
                      {
                        label: 'Thêm mới',
                        icon: <IconPlus />,
                        width: 115,
                        onClick: () => {
                          onAddNewDoorAccess();
                        },
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
                      </div>
                    ))}
                  </div>
                </div>
              </Grid>
              <Grid item sm={12}>
                <CustomTable
                  data={dataTableRoleAndFloor}
                  disabledSelect
                  row={[
                    {
                      caption: 'STT',
                      key: 11,
                      id: 11,
                      cellRender: (e) => <div>{e.rowIndex + 1}</div>,
                      alignment: 'left',
                      width: 40,
                    },
                    {
                      dataField: 'doorGroup',
                      caption: 'Nhóm cửa',
                      alignment: 'center',
                      width: 400,
                      cellRender: (e) => (
                        <div style={{}}>
                          <CtDropDownTree
                            selectionMode="single"
                            api="door-groups"
                            value={{
                              id: e.data.doorGroupId,
                              name: e.data.doorGroup,
                            }}
                            onValueChanged={(newVal) => {
                              onChangeListDoorAccess(
                                e.data,
                                newVal,
                                'doorGroup',
                              );
                            }}
                          />
                        </div>
                      ),
                    },
                    {
                      dataField: 'doorName',
                      caption: 'Cửa',
                      alignment: 'center',
                      width: 400,
                      cellRender: (e) => (
                        <div style={{}}>
                          <VAutocomplete
                            id="combo-box-setting"
                            multiple
                            value={e.data.isEdit ? doorList : e.data.doorData}
                            // disabled={!e.data.isEdit}
                            disableClearable
                            firstIndex={1}
                            loadData={(page, keyword) =>
                              new Promise((resolve, reject) => {
                                getApi(`${ACCESS_CONTROL_API_SRC}/doors`, {
                                  keyword,
                                  limit: 50,
                                  page,
                                  doorGroupIds: e.data.doorGroupId,
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
                            getOptionLabel={(option) => option.name || ''}
                            getOptionSelected={(option, selected) =>
                              option.id == selected.id
                            }
                            onOpen={() => {
                              setIsOnOpen(true);
                            }}
                            onClose={() => {
                              onChangeListDoorAccess(
                                e.data,
                                doorList,
                                'doorName',
                              );
                              setDoorList([]);
                              setIsOnOpen(false);
                            }}
                            onChange={(__v, newVal) => {
                              if (isOnOpen) {
                                setDoorList(
                                  newVal.sort((a, b) => a.name - b.name),
                                );
                              } else if (
                                e.data.doorData.length > newVal.length
                              ) {
                                onChangeListDoorAccess(
                                  e.data,
                                  newVal.sort((a, b) => a.name - b.name),
                                  'doorName',
                                );
                                setDoorList([]);
                              }
                            }}
                          />
                        </div>
                      ),
                    },
                    {
                      alignment: 'center',
                      key: 6,
                      id: 6,
                      width: 60,
                      cellRender: (e) => (
                        <div>
                          {!e.data.isEdit && (
                            <IconBtn
                              icon={<IconEdit />}
                              onClick={() => {
                                for (
                                  let i = 0;
                                  i < dataTableRoleAndFloor.length;
                                  i++
                                ) {
                                  dataTableRoleAndFloor[i].isEdit = false;
                                }
                                onChangeListDoorAccess(
                                  e.data,
                                  e.data,
                                  'isEdit',
                                );
                                setDoorList(e.data.doorData);
                              }}
                            />
                          )}
                        </div>
                      ),
                    },
                    {
                      dataField: 'schedule',
                      caption: 'Lịch hoạt động',
                      alignment: 'center',
                      cellRender: (e) => (
                        <div style={{}}>
                          <VAutocomplete
                            id="combo-box-setting"
                            value={{ id: e.value, name: e.value }}
                            reservedOption
                            disableClearable
                            firstIndex={1}
                            loadData={(page, keyword) =>
                              new Promise((resolve, reject) => {
                                getApi(`${ACCESS_CONTROL_API_SRC}/schedules`, {
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
                            getOptionLabel={(option) => option.name || ''}
                            getOptionSelected={(option, selected) =>
                              option.id == selected.id
                            }
                            onChange={(_v, newVal) => {
                              onChangeListDoorAccess(
                                e.data,
                                newVal,
                                'schedule',
                              );
                            }}
                          />
                        </div>
                      ),
                    },
                    {
                      caption: 'Hành động',
                      alignment: 'center',
                      width: 150,
                      cellRender: (e) => (
                        <div>
                          <IconBtn
                            icon={<IconDelete />}
                            onClick={() => {
                              const found = dataTableRoleAndFloor.filter(
                                (o) => o.id !== e.data.id,
                              );
                              setDataTableRoleAndFloor(found);
                              setListDoorAccess(found);
                            }}
                          />
                        </div>
                      ),
                    },
                  ]}
                  height={gui.screenHeight / 2.5}
                />
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
                ? 'Thêm mới quản lý truy cập cửa'
                : 'Chi tiết quản lý truy cập cửa'
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

export default DetailDoorAccess;
