/* eslint-disable react-hooks/rules-of-hooks */
import { Grid, makeStyles, TextField, Paper } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import Loading from 'containers/Loading';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Controller, useForm } from 'react-hook-form';
import { FIRE_ALARM } from 'containers/apiUrl';
import moment from 'moment';

import PageHeader from 'components/PageHeader';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import { useHistory, useParams } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import styled from 'styled-components';
import { DataGrid } from 'devextreme-react';
import {
  Column,
  LoadPanel,
  Paging,
  Scrolling,
  Sorting,
} from 'devextreme-react/data-grid';
import { checkAuthority } from 'utils/functions';
import { showError } from '../../utils/requestUtils';
import { showSuccess } from '../../utils/toast-utils';
import ListCameraFireWarning from './view/ListCameraFireWarning';

const useStyles = makeStyles({
  root: {
    '& .MuiInputBase-root': {
      height: '40px',
    },
    '& .MuiInputBase-input': {
      boxSizing: 'border-box',
      height: '100%',
    },
  },
  button: {
    margin: 'auto',
    borderRadius: '8px',
    boxSizing: 'border-box',
    cursor: 'pointer',
    border: 'none',
    outline: 'none',
    padding: '12px 16px',
    lineHeight: '16px',
    fontWeight: 500,
    minWidth: '104px',
    whiteSpace: 'nowrap',
  },
  label: {
    height: '17px',
    lineHeight: '16px',
    fontSize: '14px',
    color: '#999999',
    margin: '5px 0',
  },
  disabledInput: {
    backgroundColor: '#f4f4f4',
    outline: 'none',
  },
});

const DetailsItem = props => {
  const { label, value } = props;
  const classes = useStyles();
  return (
    <Grid container direction="column">
      <p className={classes.label}>{label}</p>
      <TextField
        className={classes.disabledInput}
        value={value}
        variant="outlined"
        fullWidth
        InputProps={{
          readOnly: true,
        }}
      />
    </Grid>
  );
};

export default function details({ userAuthority }) {
  const history = useHistory();
  const [isLoading, setLoading] = useState(false);
  const [disableSaveBtn, setDisableSaveBtn] = useState(true);
  const [data, setData] = useState();
  const [histories, setHistories] = useState([]);
  const { handleSubmit, control, reset } = useForm();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const classes = useStyles();
  const { id } = useParams();

  const millisecondsToHuman = ms => {
    if (ms < 0) return 'Không xác định';
    let seconds = parseInt((ms / 1000) % 60, 10);
    let minutes = parseInt((ms / (1000 * 60)) % 60, 10);
    let hours = parseInt((ms / (1000 * 60 * 60)) % 24, 10);

    hours = hours < 10 ? `0${hours}` : hours;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    seconds = seconds < 10 ? `0${seconds}` : seconds;

    return `${hours}:${minutes}:${seconds}`;
  };

  const resourceCode = 'fire-alarm/issue';
  const scopes = checkAuthority(
    ['get', 'update', 'delete', 'create'],
    resourceCode,
    userAuthority,
  );

  const fetchData = async () => {
    setLoading(true);
    try {
      const detail = await axios.get(`${FIRE_ALARM}/issues/${id}`);
      setData(detail.data);
      reset({
        status: {
          label: detail.data.statusName,
          value: detail.data.statusCode,
        },
        note: detail.data.note,
      });
      const his = await axios.get(`${FIRE_ALARM}/issues/${id}/history`);
      setHistories(his?.data?.rows || []);
    } catch (error) {
      showError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // setLoading(true);
    // axios
    //   .get(`${FIRE_ALARM}/issues/${id}`)
    //   .then(res => {
    //     setData(res.data);
    //     reset({
    //       status: { label: res.data.statusName, value: res.data.statusCode },
    //       note: res.data.note,
    //     });
    //   })
    //   .catch(err => showError(err))
    //   .finally(() => setLoading(false));
  }, []);

  const onSubmit = values => {
    const dataPut = { note: values.note, statusCode: values.status.value };
    setLoading(true);
    axios
      .put(`${FIRE_ALARM}/issues/${id}`, dataPut)
      .then(() => {
        showSuccess('Cập nhật dữ liệu thành công');
        history.replace('/fire-warning');
      })
      .catch(err => showError(err))
      .finally(() => setLoading(false));
  };

  const renderStatusCode = ({ value }) => {
    switch (value) {
      case 'PROCESSING':
        return 'Đang xử lý';
      case 'FINISHED':
        return 'Đã xử lý';
      case 'WRONG':
        return 'Báo sai';
      default:
        return 'Không xác định';
    }
  };

  const renderTimeDate = ({ value }) =>
    moment(value).format('HH:mm:ss DD-MM-yyyy');

  const columns = [
    {
      caption: 'STT',
      cellRender: props => props?.rowIndex + 1,
      allowSorting: false,
      alignment: 'center',
    },
    {
      dataField: 'userId',
      caption: 'User ID',
      alignment: 'center',
      allowSorting: true,
    },
    {
      dataField: 'userName',
      caption: 'Tên người dùng',
      alignment: 'center',
      allowSorting: true,
    },
    {
      dataField: 'statusCode',
      caption: 'Thao tác',
      alignment: 'center',
      cellRender: renderStatusCode,
      allowSorting: true,
    },
    {
      dataField: 'updatedAt',
      caption: 'Thời gian',
      alignment: 'center',
      cellRender: renderTimeDate,
      allowSorting: true,
    },
  ];

  return (
    <div className={classes.root}>
      <PageHeader
        showBackButton
        title={`Cảnh báo: ${data?.issueTypeName}`}
        onBack={() => history.replace('/fire-warning')}
      >
        <div style={{ display: 'flex' }}>
          <button
            type="button"
            className={classes.button}
            onClick={() => history.replace('/fire-warning')}
            style={{
              border: '1px solid #dddddd',
              color: 'rgba(0, 0, 0, 0.8)',
            }}
          >
            Hủy
          </button>
          {scopes.update && !disableSaveBtn && (
            <button
              form="fire-warning-details-form"
              className={classes.button}
              type="submit"
              style={{
                background: '#00554A',
                boxShadow: '0px 4px 10px rgba(16, 156, 241, 0.24)',
                color: '#ffffff',
                marginRight: '30px',
                marginLeft: '24px',
              }}
            >
              Lưu
            </button>
          )}
        </div>
      </PageHeader>
      {isLoading ? <Loading /> : null}
      <form id="fire-warning-details-form" onSubmit={handleSubmit(onSubmit)}>
        <Paper style={{ padding: '32px' }}>
          <Grid container spacing={3}>
            <Grid item xs={4}>
              <DetailsItem
                label="Loại cảnh báo"
                value={data?.issueTypeName || ''}
              />
            </Grid>
            <Grid item xs={4}>
              <DetailsItem
                label="Mức độ rủi ro"
                value={data?.levelName || ''}
              />
            </Grid>
            <Grid item xs={4}>
              <Grid container direction="column">
                <p className={classes.label}>Trạng thái</p>
                <Controller
                  control={control}
                  name="status"
                  defaultValue=""
                  render={props => (
                    <Autocomplete
                      value={props.value}
                      options={[
                        { label: 'Đang xử lý', value: 'PROCESSING' },
                        { label: 'Đã xử lý', value: 'FINISHED' },
                        { label: 'Báo sai', value: 'WRONG' },
                      ]}
                      fullWidth
                      getOptionLabel={option => option.label || ''}
                      getOptionSelected={(option, selected) =>
                        option.value === selected.value
                      }
                      onChange={(e, value) => {
                        if (value.value !== data.statusCode)
                          setDisableSaveBtn(false);
                        else setDisableSaveBtn(true);
                        props.onChange(value);
                      }}
                      renderInput={params => (
                        <TextField
                          {...params}
                          variant="outlined"
                          placeholder="Trạng thái"
                        />
                      )}
                    />
                  )}
                />
              </Grid>
            </Grid>
            <Grid item xs={4}>
              <DetailsItem label="Khu vực" value={data?.location || ''} />
            </Grid>
            <Grid item xs={4}>
              <DetailsItem label="Thiết bị" value={data?.deviceName || ''} />
            </Grid>
            <Grid item xs={4}>
              <DetailsItem
                label="Ngày phát hiện"
                value={
                  data?.createdDate
                    ? format(new Date(data.createdDate), 'HH:mm dd/MM/yyyy')
                    : ''
                }
              />
            </Grid>
            <Grid item xs={4}>
              <DetailsItem
                label="Thời gian kết thúc"
                value={
                  data?.finishedTime
                    ? format(new Date(data?.finishedTime), 'HH:mm dd/MM/yyyy')
                    : ''
                }
              />
            </Grid>

            <Grid item xs={4}>
              <DetailsItem
                label="Thời gian xử lý"
                value={
                  data?.timeProcess ? millisecondsToHuman(data.timeProcess) : ''
                }
              />
            </Grid>
            <Grid item xs={8}>
              <Grid container direction="column">
                <p className={classes.label}>Nội dung</p>
                <TextareaAutosize
                  value={data?.content || ''}
                  disabled
                  style={{ cursor: 'unset', padding: '8px' }}
                  rowsMin={4}
                  className={classes.disabledInput}
                />
              </Grid>
            </Grid>
            <Grid item xs={4}>
              <Grid container direction="column">
                <p className={classes.label}>Ghi chú</p>
                <Controller
                  control={control}
                  name="note"
                  defaultValue=""
                  render={props => (
                    <TextareaAutosize
                      style={{ padding: '8px' }}
                      rowsMin={2}
                      value={props.value}
                      onChange={e => {
                        if (e.target.value !== data.note)
                          setDisableSaveBtn(false);
                        else setDisableSaveBtn(true);
                        props.onChange(e.target.value);
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </form>
      <p style={{ paddingTop: '27px' }}>
        Vui lòng chọn trong danh sách Camera để xem trực tiếp ( sử dụng nút ghim
        lại nếu muốn giữ Camera trong danh sách)
      </p>
      <ListCameraFireWarning dataDetail={data} />
      <TableCustomWrap>
        <DataGrid
          dataSource={histories}
          columnAutoWidth
          showRowLines={false}
          showColumnLines={false}
          noDataText="Không có dữ liệu"
          style={{ minHeight: `${histories?.length ? '0' : '300px'}` }}
          onRowPrepared={e => {
            if (e.rowType == 'header') {
              e.rowElement.style.backgroundColor = 'rgba(194, 207, 224, 0.08)';
            } else {
              e.rowElement.style.backgroundColor =
                e.rowIndex % 2 ? '#F2F5F7' : '#FFFFFF';
            }
          }}
        >
          <Sorting mode="none" />
          {/* <SearchPanel visible={false} defaultText={keyword || ''} /> */}
          <Paging enabled={false} />
          <Scrolling mode="infinite" />
          <LoadPanel enabled={false} />
          {(columns || []).map(defs => (
            <Column {...defs} key={defs.dataField || Math.random()} />
          ))}
        </DataGrid>
      </TableCustomWrap>
    </div>
  );
}

const TableCustomWrap = styled.div`
  margin-top: 27px;
  .dx-datagrid-content {
    .dx-datagrid-table {
      tbody {
        tr {
          height:56px;
        }
        td {
          &[role="columnheader"] {
            .dx-datagrid-text-content {
              font-family: Roboto;
              font-style: normal;
              font-weight: bold;
              font-size: 14px;
              color: rgba(37, 37, 37, 0.6);
              text-align: left;
            }
          }
          font-weight: 400;
          vertical-align: middle;
        }
        }
      }
    }
  }
  .dx-datagrid-search-text {
    color: #109CF1;
    background-color: transparent;
  }
`;
