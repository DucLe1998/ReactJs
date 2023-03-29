import React, { useEffect, useRef, useState } from 'react';
import CustomTable from 'components/Custom/table/CustomTable';
import {
  Button,
  makeStyles,
  Paper,
  TextField,
  Typography,
} from '@material-ui/core';
import VAutocomplete from 'components/VAutocomplete';
import { callApi, getApi } from 'utils/requestUtils';
import { Autocomplete } from '@material-ui/lab';
import { DateTimePicker } from '@material-ui/pickers';
import IconBtn from 'components/Custom/IconBtn';
import { IconDelete, IconPlus } from 'components/Custom/Icon/ListIcon';
import PageHeader from 'components/PageHeader';
import { ACCESS_CONTROL_API_SRC } from 'containers/apiUrl';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import utils from 'utils/utils';
import { useForm } from 'react-hook-form';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
  },
  btnWraper: {
    display: 'flex',
    height: '67px',
    alignItems: 'end',
    marginLeft: '32px',
  },
}));

const messageEffectiveAccessGroup = [
  { value: 'UNLIMITED', label: 'Luôn luôn' },
  { value: 'LIMITED', label: 'Chọn thời gian' },
];

export default function Accesscontrol() {
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const accessCodeUser = useRef('');

  const classes = useStyles();
  const [dataAccessGroupsId, setDataAccessGroupsId] = useState([]);
  const [dataUserGroups, setDataUserGroups] = useState([]);

  useEffect(() => {
    if (id && id !== 'null') {
      fetchData();
    }
  }, [id]);

  const getListAccessGroupNamesByUserGroupId = async (userGroupId) => {
    const res = await callApi(
      `${ACCESS_CONTROL_API_SRC}/user-groups/${userGroupId}`,
      'GET',
    );

    if (res && res.data && res.data.accessGroupList) {
      return res.data.accessGroupList.map((item) => item.name).join(', ');
    }

    return '';
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await callApi(
        `${ACCESS_CONTROL_API_SRC}/user-access/${id}/detail-groups`,
        'GET',
      );

      if (res) {
        const { accessCode, groupMappings, directAcGroups } =
          res.data;
        accessCodeUser.current = accessCode;
        const userGroupMappings = groupMappings.map((item, index) => ({
          key: index,
          userGroup: item.userGroup,
          nameAccessGroups: item.accessGroups
            .map((item) => item.name)
            .join(', '),
        }));

        setDataUserGroups(userGroupMappings);

        setDataAccessGroupsId(
          directAcGroups?.map((o, index) => ({
            accessGroupId: {
              id: o.id,
              name: o.name,
            },
            endTime: o.endTime || undefined,
            startTime: o.startTime || undefined,
            key: index,
            type: o.startTime
              ? messageEffectiveAccessGroup[1]
              : messageEffectiveAccessGroup[0],
          })) || [],
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const { handleSubmit } = useForm();

  const onSubmit = (v) => {
    const dataAcGroup =
      dataAccessGroupsId
        ?.filter((e) => e.accessGroupId)
        .map(
          (o) =>
            o.accessGroupId && {
              accessGroupId: o.accessGroupId.id,
              name: o.accessGroupId.name,
              type: o.type.value,
              endTime:
                o.endTime && o.type.value === 'LIMITED'
                  ? moment(o.endTime).valueOf()
                  : null,
              startTime:
                o.startTime && o.type.value === 'LIMITED'
                  ? moment(o.startTime).valueOf()
                  : null,
            },
        ) || [];

    const foundValidateAcGroup = dataAcGroup
      .filter((o) => o.type === 'LIMITED' && o.startTime && o.endTime)
      .find((e) => e.startTime >= e.endTime);

    if (foundValidateAcGroup) {
      return utils.showToast(
        `Nhóm quyền: ${foundValidateAcGroup.name} có thời gian bắt đầu lớn hơn thời gian kết thúc`,
        'warning',
      );
    }

    const dto = {
      accessGroupIds: dataAcGroup.map((item) => item.accessGroupId),
      userGroupIds: dataUserGroups.map((item) => item.userGroup.id),
      userId: id,
    };

    console.log(`callApiUpdate ${JSON.stringify(dto)}`);
    return callApiUpdate(dto);
  };

  const callApiUpdate = async (dto) => {
    setLoading(true);
    try {
      await callApi(`${ACCESS_CONTROL_API_SRC}/user-access`, 'POST', dto);
      utils.showToast('Cập nhật thành công');
    } catch (error) {
      utils.showToastErrorCallApi(error);
    } finally {
      setLoading(false);
    }
  };

  const onClickChangeAccessGroup = (item, element, value) => {
    const found = dataAccessGroupsId.find((e) => e?.key === item?.key);
    if (found) {
      found[element] = value;
      if (element === 'type') {
        const dt = new Date();
        found.endTime = dt.setHours(dt.getHours() + 1);
        found.startTime = new Date();
      }
    }
    const foundExit = dataAccessGroupsId.filter((e) => e.key !== item.key);
    setDataAccessGroupsId([...foundExit, found].sort((a, b) => a.key - b.key));
  };

  const onClickChangeUserGroup = async (item, value) => {
    const found = dataUserGroups.find((e) => e?.key === item?.key);
    if (found) {
      found.userGroup = value;
      found.nameAccessGroups = await getListAccessGroupNamesByUserGroupId(
        value.id,
      );
    }

    const foundExit = dataUserGroups.filter((e) => e.key !== item.key);
    setDataUserGroups([...foundExit, found].sort((a, b) => a.key - b.key));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Paper className={classes.paper}>
        <PageHeader title="Kiểm soát vào ra">
          <>
            <Button
              variant="contained"
              color="default"
              onClick={() => {
                fetchData();
              }}
            >
              Hủy
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit(onSubmit)}
            >
              Lưu
            </Button>
          </>
        </PageHeader>
        <div
          style={{ justifyContent: 'space-between' }}
          className="ct-flex-row"
        >
          <Typography variant="h5">
            Nhóm người dùng và nhóm quyền theo nhóm
          </Typography>

          <div
            style={{
              marginTop: 14,
              marginBottom: 14,
              color: '#6589FF',
              cursor: 'pointer',
            }}
            onClick={() => {
              const dto = {
                key:
                  dataUserGroups.length > 0
                    ? dataUserGroups[dataUserGroups.length - 1].key + 1
                    : 0,
                userGroup: '',
                nameAccessGroups: '',
              };

              setDataUserGroups((v) => [...v, dto]);
            }}
          >
            <span style={{ marginRight: 10 }}>
              <IconPlus color="#6589FF" />
            </span>
            Thêm mới
          </div>
        </div>

        <CustomTable
          data={dataUserGroups || []}
          disabledSelect
          row={[
            {
              caption: 'STT',
              cellRender: (e) => <div>{e.rowIndex + 1}</div>,
              alignment: 'center',
              width: 100,
            },
            {
              dataField: 'userGroup.name',
              caption: 'Nhóm người dùng',
              alignment: 'center',
              width: '40%',
              cellRender: (e) => (
                <VAutocomplete
                  defaultValue={e.data.userGroup || undefined}
                  disableClearable
                  firstIndex={1}
                  loadData={(page, keyword) =>
                    new Promise((resolve, reject) => {
                      getApi(`${ACCESS_CONTROL_API_SRC}/user-groups`, {
                        keyword,
                        limit: 50,
                        page,
                      })
                        .then((result) => {
                          const mapExistUserGroupIds = dataUserGroups
                            .map((item) => item.userGroup.id)
                            .reduce((map, obj) => {
                              map[obj] = true;
                              return map;
                            }, {});

                          resolve({
                            data: result.data?.rows?.filter(
                              (item) => mapExistUserGroupIds[item.id] !== true,
                            ),
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
                  onChange={(o, newVal) => {
                    console.log(`onChange newVal ${JSON.stringify(newVal)}`);
                    console.log(`onChange e.data ${JSON.stringify(e.data)}`);
                    if (newVal.id != e.data.userGroup.id) {
                      onClickChangeUserGroup(e.data, newVal);
                    }
                  }}
                />
              ),
            },
            {
              dataField: 'nameAccessGroups',
              caption: 'Nhóm quyền theo nhóm',
              width: '40%',
              alignment: 'center',
              cellRender: (e) => (
                <div
                  className="ct-flex-row"
                  style={{
                    justifyContent: 'center',
                  }}
                >
                  {e.value}
                </div>
              ),
            },
            {
              caption: 'Hành động',
              alignment: 'center',
              width: '20%',
              cellRender: (e) => (
                <div>
                  <IconBtn
                    icon={<IconDelete />}
                    onClick={() => {
                      console.log(e.data.key);
                      const found = dataUserGroups.filter(
                        (o) => o.key !== e.data.key,
                      );
                      setDataUserGroups(found);
                    }}
                  />
                </div>
              ),
            },
          ]}
          height={300}
        />

        <div
          style={{ justifyContent: 'space-between' }}
          className="ct-flex-row"
        >
          <Typography variant="h5">Nhóm quyền truy cập bổ sung</Typography>

          <div
            style={{
              marginTop: 14,
              marginBottom: 14,
              color: '#6589FF',
              cursor: 'pointer',
            }}
            onClick={() => {
              const dt = new Date();
              const dto = {
                accessGroupId: '',
                endTime: dt.setHours(dt.getHours() + 1),
                startTime: new Date(),
                key:
                  dataAccessGroupsId.length > 0
                    ? dataAccessGroupsId[dataAccessGroupsId.length - 1].key + 1
                    : 0,
                type: messageEffectiveAccessGroup[0],
                syncKey: null,
              };
              setDataAccessGroupsId((v) => [...v, dto]);
            }}
          >
            <span style={{ marginRight: 10 }}>
              <IconPlus color="#6589FF" />
            </span>
            Thêm mới
          </div>
        </div>

        <CustomTable
          data={dataAccessGroupsId || []}
          disabledSelect
          row={[
            {
              caption: 'STT',
              cellRender: (e) => <div>{e.rowIndex + 1}</div>,
              alignment: 'center',
              width: 100,
            },
            {
              dataField: 'accessGroupId',
              caption: 'Nhóm quyền truy cập',
              alignment: 'center',
              width: 350,
              cellRender: (v) => (
                <VAutocomplete
                  defaultValue={v.value || undefined}
                  disableClearable
                  firstIndex={1}
                  loadData={(page, keyword) =>
                    new Promise((resolve, reject) => {
                      getApi(`${ACCESS_CONTROL_API_SRC}/access-groups`, {
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
                  onChange={(e, newVal) =>
                    onClickChangeAccessGroup(v.data, 'accessGroupId', newVal)
                  }
                />
              ),
            },
            {
              dataField: 'type',
              caption: 'Thời hạn',
              alignment: 'center',
              width: 200,
              cellRender: (v) => (
                <Autocomplete
                  id="combo-box-setting"
                  defaultValue={v.value}
                  disabled
                  options={messageEffectiveAccessGroup}
                  disableClearable
                  fullWidth
                  getOptionLabel={(option) => option.label}
                  getOptionSelected={(option, selected) =>
                    option.value === selected.value
                  }
                  onChange={(e, newVal) =>
                    onClickChangeAccessGroup(v.data, 'type', newVal)
                  }
                  renderInput={(params) => (
                    <TextField {...params} variant="outlined" size="small" />
                  )}
                />
              ),
            },
            {
              dataField: 'startTime',
              caption: 'Thời gian bắt đầu',
              alignment: 'center',
              cellRender: (e) => (
                <div
                  className="ct-flex-row"
                  style={{
                    justifyContent: 'center',
                  }}
                >
                  <div
                    style={{
                      width: 200,
                    }}
                  >
                    {e.data.type.value ===
                    messageEffectiveAccessGroup[0].value ? (
                      <TextField
                        placeholder="-- : --"
                        variant="outlined"
                        size="small"
                        disabled
                        fullWidth
                      />
                    ) : (
                      <DateTimePicker
                        variant="inline"
                        disabled={
                          e.data.type.value ===
                          messageEffectiveAccessGroup[0].value
                        }
                        fullWidth
                        inputVariant="outlined"
                        format="HH:mm - dd/MM/yyyy"
                        value={e.value}
                        onChange={(newVal) =>
                          onClickChangeAccessGroup(e.data, 'startTime', newVal)
                        }
                        inputProps={{
                          style: {
                            height: 5,
                          },
                        }}
                      />
                    )}
                  </div>
                </div>
              ),
            },
            {
              dataField: 'endTime',
              caption: 'Thời gian kết thúc',
              alignment: 'center',
              cellRender: (e) => (
                <div
                  className="ct-flex-row"
                  style={{
                    justifyContent: 'center',
                  }}
                >
                  <div
                    style={{
                      width: 200,
                    }}
                  >
                    {e.data.type.value ===
                    messageEffectiveAccessGroup[0].value ? (
                      <TextField
                        placeholder="-- : --"
                        variant="outlined"
                        size="small"
                        disabled
                        fullWidth
                      />
                    ) : (
                      <DateTimePicker
                        variant="inline"
                        fullWidth
                        disabled={
                          e.data.type.value ===
                          messageEffectiveAccessGroup[0].value
                        }
                        inputVariant="outlined"
                        format="HH:mm - dd/MM/yyyy"
                        value={e.value}
                        onChange={(newVal) =>
                          onClickChangeAccessGroup(e.data, 'endTime', newVal)
                        }
                        inputProps={{
                          style: {
                            height: 5,
                          },
                        }}
                      />
                    )}
                  </div>
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
                      const found = dataAccessGroupsId.filter(
                        (o) => o.key !== e.data.key,
                      );
                      setDataAccessGroupsId(found);
                    }}
                  />
                </div>
              ),
            },
          ]}
          height={400}
        />
      </Paper>
    </form>
  );
}
