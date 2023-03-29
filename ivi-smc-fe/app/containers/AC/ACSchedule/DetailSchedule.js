/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable consistent-return */
/* eslint-disable no-restricted-globals */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable radix */
import Grid from '@material-ui/core/Grid';
import { useParams, useHistory } from 'react-router-dom';
import CustomTable from 'components/Custom/table/CustomTable';
import { IconDelete, IconPlus } from 'components/Custom/Icon/ListIcon';
import TitlePage from 'components/Custom/TitlePage';
import TabMainUseState from 'components/Custom/Tab/TabMainUseState';
import IconBtn from 'components/Custom/IconBtn';
import Loading from 'containers/Loading/Loadable';
import VAutocomplete from 'components/VAutocomplete';
import React, { useEffect, useState } from 'react';
import PopupDelete from 'components/Custom/popup/PopupDelete';
import LabelInput from 'components/TextInput/element/LabelInput';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import Btn from 'components/Custom/Btn';
import ShowErrorValidate from 'components/TextInput/ShowErrorValidate';
import TextInput from 'components/TextInput/TextInput';
import { callApi, getApi } from 'utils/requestUtils';
import utils, { validationSchema } from 'utils/utils';
import { ACCESS_CONTROL_API_SRC } from 'containers/apiUrl';
import './styles.css';

import Daily from './components/Daily';

const dataDailyDefault = [
  {
    label: '',
    value: 1,
  },
  {
    label: 'Thứ 2',
    StringValue: 'MONDAY',
    value: 2,
  },
  {
    label: 'Thứ 3',
    StringValue: 'TUESDAY',
    value: 3,
  },
  {
    label: 'Thứ 4',
    StringValue: 'WEDNESDAY',
    value: 4,
  },
  {
    label: 'Thứ 5',
    StringValue: 'THURSDAY',
    value: 5,
  },
  {
    label: 'Thứ 6',
    StringValue: 'FRIDAY',
    value: 6,
  },
  {
    label: 'Thứ 7',
    StringValue: 'SATURDAY',
    value: 7,
  },
  {
    label: 'CN',
    StringValue: 'SUNDAY',
    value: 8,
  },
];

const DetailSchedule = () => {
  const history = useHistory();

  const { id, type } = useParams();
  const [tab, setTab] = useState('1');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, errors, reset } = useForm({
    defaultValue: {
      name: '',
      des: '',
    },
    resolver: validationSchema({
      name: yup.string().trim().required().max(100, '100 ký tự'),
      des: yup.string().trim().max(250, '250 ký tự'),
    }),
  });

  const [dataDailyState, setDataDailyState] = useState(dataDailyDefault);
  const [dataDaily, setDataDaily] = useState([]);

  const [dataConfiguaHoliday, setDataConfiguaHoliday] = useState([]);
  const [isOpenConfirmUpdate, setIsOpenConfirmUpdate] = useState(false);

  useEffect(() => {
    if (id && id !== 'null') {
      fetchData();
    }
  }, [id]);

  console.log('type', type);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await callApi(
        `${ACCESS_CONTROL_API_SRC}/schedules/${id}`,
        'GET',
      );
      if (res) {
        const { name, description, listScheduleWeekly, listHoliday } = res.data;
        reset({
          name,
          des: description,
        });
        const renderDataHoliday = listHoliday?.map((i, index) => ({
          id: index,
          nameHoliday: i,
        }));
        setDataConfiguaHoliday(renderDataHoliday || []);

        const renderData = listScheduleWeekly?.map((item) => ({
          label: dataDailyDefault.find((o) => o.StringValue === item.dayOfWeek)
            .label,
          value: dataDailyDefault.find((o) => o.StringValue === item.dayOfWeek)
            .value,
          StringValue: item.dayOfWeek,
          times: item.times.map((a, b) => ({
            start: a.startTimeInMinute,
            end: a.endTimeInMinute,
            type: (b + 1).toString(),
          })),
        }));

        const result = dataDailyDefault.reduce((finalList, item) => {
          const found = renderData.find(
            (i) => i.StringValue === item.StringValue,
          );
          finalList.push(found || item);
          return finalList;
        }, []);
        setDataDailyState(result);
      }
    } catch (error) {
      utils.showToastErrorCallApi(error);
    } finally {
      setLoading(false);
    }
  };

  const renderShowError = (label, name) => (
    <ShowErrorValidate label={label} errors={errors} name={name} />
  );

  const onSubmit = async (v) => {
    const newValue = dataDaily
      .filter((e) => e.label && e.times)
      .map((item) => ({
        dayOfWeek: item.StringValue,
        times:
          item.times?.map((a) => ({
            endTimeInMinute: a.end,
            startTimeInMinute: a.start,
          })) || [],
      }));
    const dto = {
      scheduleWeeklyRequest: newValue,
      description: v.des,
      name: v.name,
      listHoliday: dataConfiguaHoliday?.map((e) => e?.nameHoliday?.id) || [],
    };
    setLoading(true);
    try {
      if (type === 'update') {
        await callApi(`${ACCESS_CONTROL_API_SRC}/schedules/${id}`, 'PUT', dto);
      } else {
        await callApi(`${ACCESS_CONTROL_API_SRC}/schedules`, 'POST', dto);
      }
      history.goBack();
      utils.showToast('Thành công');
    } catch (error) {
      utils.showToastErrorCallApi(error);
    } finally {
      setLoading(false);
    }
  };

  const onClickChangeRole = (item, value, type) => {
    const found = dataConfiguaHoliday.find((e) => e?.id === item?.id);
    if (found) {
      if (type === 'name') {
        found.nameHoliday = value;
      }
    }
    const foundExit = dataConfiguaHoliday.filter((e) => e.id !== item.id);
    setDataConfiguaHoliday([...foundExit, found].sort((a, b) => a.id - b.id));
  };

  const ViewContent = () => {
    switch (tab) {
      case '2':
        return (
          <>
            <div
              className="ct-flex-row"
              style={{
                justifyContent: 'space-between',
                marginBottom: 16,
                color: '#4B67E2',
              }}
            >
              <div />
              <div
                onClick={() => {
                  if (dataConfiguaHoliday?.length < 3) {
                    const dto = {
                      id:
                        dataConfiguaHoliday.length > 0
                          ? dataConfiguaHoliday[dataConfiguaHoliday.length - 1]
                              .id + 1
                          : 0,
                      nameHoliday: '',
                    };
                    setDataConfiguaHoliday((v) => [...v, dto]);
                  } else {
                    utils.showToast('Thêm tối đa 3 ngày', 'warning');
                  }
                }}
                className="ct-flex-row"
                style={{ cursor: 'pointer' }}
              >
                <div style={{ marginRight: 6, paddingBottom: 4 }}>
                  <IconPlus color="#4B67E2" />
                </div>
                Thêm mới
              </div>
            </div>
            <Grid container spacing={4}>
              <Grid item sm={12}>
                <CustomTable
                  data={dataConfiguaHoliday || []}
                  disabledSelect
                  row={[
                    {
                      caption: 'STT',
                      cellRender: (e) => <div>{e.rowIndex + 1}</div>,
                      width: 100,
                    },
                    {
                      dataField: 'nameHoliday',
                      caption: 'Chọn ngày nghỉ',
                      cellRender: (e) => (
                        <div>
                          <VAutocomplete
                            value={e.value}
                            disableClearable
                            firstIndex={1}
                            loadData={(page, keyword) =>
                              new Promise((resolve, reject) => {
                                getApi(`${ACCESS_CONTROL_API_SRC}/holidays`, {
                                  keyword,
                                  limit: 50,
                                  page,
                                })
                                  .then((result) => {
                                    resolve({
                                      data: result.data.rows,
                                      totalCount: result.data.count,
                                    });
                                  })
                                  .catch((err) => reject(err));
                              })
                            }
                            getOptionLabel={(option) => option.name || ''}
                            getOptionSelected={(option, selected) =>
                              option.id === selected.id
                            }
                            onChange={(_u, newVal) =>
                              onClickChangeRole(e.data, newVal, 'name')
                            }
                          />
                        </div>
                      ),
                      width: 300,
                    },
                    {
                      caption: 'Mô tả',
                      cellRender: (e) => (
                        <div>{e.data.nameHoliday.description}</div>
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
                              const found = dataConfiguaHoliday.filter(
                                (o) => o.id !== e.data.id,
                              );
                              setDataConfiguaHoliday(found);
                            }}
                          />
                        </div>
                      ),
                    },
                  ]}
                  height={300}
                />
                <div
                  style={{
                    fontWeight: 400,
                    marginTop: 16,
                    fontStyle: 'italic',
                  }}
                >
                  Chú ý: Nhóm ngày nghỉ chỉ được phép thêm tối đa 3 nhóm
                </div>
              </Grid>
            </Grid>
          </>
        );
      default:
        return (
          <div>
            <div
              style={{
                color: '#333',
                margin: '20px 0 20px 0',
              }}
            >
              <LabelInput label="Bảng cấu hình thời gian" type="title" />
            </div>

            <Daily
              callbackOfDaily={(v) => {
                setDataDaily(v);
                setDataDailyState(v);
              }}
              dataDailyProps={dataDailyState}
            />
          </div>
        );
    }
  };

  return (
    <div style={{ marginTop: 24, minWidth: 1000 }}>
      <div
        style={{ justifyContent: 'space-between', marginBottom: 24 }}
        className="ct-flex-row"
      >
        <div>
          <TitlePage
            title={
              type === 'create'
                ? 'Thêm mới lịch hoạt động'
                : 'Chi tiết lịch hoạt động'
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
            label={type === 'create' ? 'Thêm' : 'Sửa'}
            onClick={
              type === 'create'
                ? handleSubmit(onSubmit)
                : () => setIsOpenConfirmUpdate(true)
            }
          />
        </div>
      </div>
      <div
        style={{
          padding: 26,
          borderRadius: 8,
          // pointerEvents: !scopes?.update && 'none',
          backgroundColor: '#FFF',
        }}
      >
        <form>
          <div>
            <Grid container spacing={1}>
              <Grid item sm={5}>
                <TextInput
                  label="Tên lịch hoạt động *"
                  name="name"
                  innerRef={register()}
                  showError={renderShowError}
                />
              </Grid>
              <Grid item sm={9}>
                <TextInput
                  label="Mô tả"
                  name="des"
                  innerRef={register()}
                  showError={renderShowError}
                />
              </Grid>
              <Grid item sm={12}>
                <TabMainUseState
                  style={{ marginBottom: 16 }}
                  callback={(e) => setTab(e)}
                  tab={tab}
                  data={[
                    { label: 'Cấu hình thời gian hoạt động', key: '1' },
                    // { label: 'Cấu hình thời gian nghỉ', key: '2' },
                  ]}
                />
                {ViewContent()}
              </Grid>
            </Grid>
          </div>
        </form>
      </div>

      {loading && <Loading />}
      {isOpenConfirmUpdate && type !== 'create' && (
        <PopupDelete
          saveTxt="Lưu"
          title="Xác nhận lưu thay đổi lịch hoạt động "
          textFollowTitle="Thay đổi lịch hoạt động sẽ bị ảnh hưởng đến hệ thống vận hành, bạn có chắc chắn lưu lịch hoạt động này không?"
          onClickSave={handleSubmit(onSubmit)}
          onClose={(v) => setIsOpenConfirmUpdate(v)}
        />
      )}
    </div>
  );
};

export default DetailSchedule;
