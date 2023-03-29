import React, { Fragment, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { useIntl } from 'react-intl';
import TextField from '@material-ui/core/TextField';
import { Column, DataGrid, Paging } from 'devextreme-react/data-grid';
import IconBack from '@material-ui/icons/ArrowBack';
import DeleteIcon from '@material-ui/icons/Delete';
import {
  FormControl,
  Grid,
  FormLabel,
  Button,
  IconButton,
  Tooltip,
  Toolbar,
} from '@material-ui/core';

import VAutocomplete from '../../components/VAutocomplete';
import { callApi, getApi, postApi } from '../../utils/requestUtils';
import { API_IAM } from '../apiUrl';
import messages from './messages';
import { useStyles } from '../User/style';
import PageHeader from '../../components/PageHeader';
import { showAlertConfirm } from '../../utils/utils';
import Loading from '../Loading';
import { showSuccess, showError } from '../../utils/toast-utils';
import { getErrorMessage } from '../Common/function';
export default function AddUserPolicy(props) {
  const { id } = useParams();
  const history = useHistory();
  const classes = useStyles();
  const intl = useIntl();
  const [name, setName] = useState(props.location?.state?.name || '');
  const [search, setSearch] = React.useState('');
  const [reLoad, setReload] = useState(0);
  const [code, setCode] = useState(null);
  const [pageIndex, setPageIndex] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(25);
  const [listUser, setListUser] = useState({});
  const [loading, setLoading] = useState(false);
  const handleDelete = item => (
    <Tooltip title={intl.formatMessage({ id: 'app.tooltip.delete' })}>
      <IconButton
        color="primary"
        onClick={() => {
          showAlertConfirm(
            {
              title: intl.formatMessage(messages.titleDeleteUser),
              text: intl.formatMessage(messages.titleDeleteUserConfirm),
            },
            intl,
          ).then(result => {
            if (result.value) {
              setLoading(true);
              callApi(API_IAM.POST_USER_POLICY, 'DELETE', {
                piId: item.data.piId,
                policyId: id,
              })
                .then(() => {
                  // setLoading(false);
                  showSuccess(intl.formatMessage(messages.titleDeleteUser));
                  setReload(reLoad + 1);
                })
                .catch(err => {
                  setLoading(false);
                  showError(getErrorMessage(err));
                });
            }
          });
        }}
      >
        <DeleteIcon />
      </IconButton>
    </Tooltip>
  );
  const columns = [
    {
      dataField: 'username',
      caption: intl.formatMessage(messages.nameUserAdd),
      cssClass: 'valign-center',
    },
    {
      dataField: 'fullName',
      cssClass: 'valign-center',
      caption: intl.formatMessage(messages.fullnameUserAdd),
    },
    {
      dataField: 'email',
      caption: intl.formatMessage(messages.emailUserAdd),
      cssClass: 'valign-center',
    },
    {
      dataField: 'phoneNumber',
      caption: intl.formatMessage(messages.sdtUserAdd),
      cssClass: 'valign-center',
    },
    {
      dataField: 'orgUnitName',
      caption: intl.formatMessage(messages.unitUserAdd),
      cssClass: 'valign-center',
    },
    {
      dataField: 'position',
      caption: intl.formatMessage(messages.positionUserAdd),
      cssClass: 'valign-center',
    },
    {
      alignment: 'center',
      caption: 'Xóa',
      allowSorting: false,
      cellRender: handleDelete,
    },
  ];
  const saveItemUser = item => {
    if (item) {
      setLoading(true);
      postApi(API_IAM.POST_USER_POLICY, {
        piId: item.piId,
        policyId: id,
      })
        .then(() => {
          setLoading(false);
          showSuccess(intl.formatMessage(messages.addSuccess));
          setCode(null);
          setReload(reLoad + 1);
        })
        .catch(err => {
          setLoading(false);
          showError(getErrorMessage(err));
        });
    }
  };
  function handlePageSize(e) {
    setPageSize(e.target.value);
    setPageIndex(1);
  }
  const getApiDetailPolicy = () => {
    setLoading(true);
    getApi(`${API_IAM.LIST_POLICY}/${id}`)
      .then(({ data }) => {
        setName(data.policyName);
        getApi(API_IAM.LIST_USER, {
          policyIds: id,
          keyword: search,
          page: pageIndex,
          limit: pageSize,
        })
          .then(res => {
            setListUser(res.data);
            setLoading(false);
          })
          .catch(err => {
            setLoading(false);
            showError(getErrorMessage(err));
          });
      })
      .catch(err => {
        if (err.response.status == '404') {
          history.push(`/list-policy`);
        } else {
          setLoading(false);
          showError(getErrorMessage(err));
        }
      });
  };
  useEffect(() => {
    getApiDetailPolicy();
  }, [search, pageIndex, pageSize, reLoad]);

  return (
    <Fragment>
      {loading && <Loading />}
      <Toolbar disableGutters variant="dense">
        <IconButton
          onClick={() => {
            history.push(`/list-policy`);
          }}
          size="small"
          color="primary"
        >
          <IconBack />
        </IconButton>
        {intl.formatMessage(messages.titlePolicyManagerUser)}: {name}
      </Toolbar>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <FormLabel>
              {intl.formatMessage(messages.titleSearchUser)}
            </FormLabel>
            <VAutocomplete
              itemSize={60}
              value={code}
              fullWidth
              getOptionLabel={option =>
                `${option?.fullName} (${option?.username})`
              }
              firstIndex={1}
              loadData={(page, keyword) =>
                new Promise((resolve, reject) => {
                  const params = {
                    limit: 50,
                    page,
                    keyword,
                    // statuses: ['ACTIVE'],
                  };
                  getApi(API_IAM.LIST_USER, params)
                    .then(result => {
                      resolve({
                        data: result.data.rows,
                        totalCount: result.data.count,
                      });
                    })
                    .catch(err => reject(err));
                })
              }
              getOptionSelected={(option, selected) =>
                option.id === selected.id
              }
              renderOption={option => (
                <CardContent className={classes.optionAutocomplate}>
                  <Typography>{option.fullName}</Typography>
                  <Typography color="textSecondary">
                    {option.username} - {option.orgUnitName}
                  </Typography>
                </CardContent>
              )}
              onChange={(e, value) => {
                setCode(value);
              }}
              renderInput={params => (
                <TextField
                  {...params}
                  variant="outlined"
                  placeholder="Nhập username hoặc tên để thêm người dùng"
                />
              )}
            />
          </FormControl>
        </Grid>
        <Grid item xs={6} style={{ display: 'flex', alignItems: 'flex-end' }}>
          <Button
            style={{ height: '40px' }}
            variant="contained"
            color="primary"
            disabled={!code}
            onClick={() => {
              saveItemUser(code);
            }}
          >
            {intl.formatMessage({ id: 'app.containers.User.btnAdd' })}
          </Button>
        </Grid>
      </Grid>
      {listUser && (
        <PageHeader
          title={intl.formatMessage(messages.listUser)}
          showBackButton={false}
          showSearch
          showPager
          totalCount={listUser?.count}
          pageIndex={pageIndex}
          rowsPerPage={pageSize}
          handleChangePageIndex={pageIndex => {
            setPageIndex(pageIndex);
          }}
          placeholderSearch="Nhập username hoặc tên"
          handlePageSize={handlePageSize}
          onSearchValueChange={newVal => {
            setSearch(newVal);
            setPageIndex(1);
          }}
        />
      )}
      {listUser && (
        <DataGrid
          style={{
            height: '100%',
            maxHeight: `calc(100vh - ${50 + 84 + 25 + 76 + 48}px)`,
            width: '100%',
            maxWidth: '100%',
          }}
          dataSource={listUser.rows || []}
          showColumnLines={false}
          showBorders={false}
          noDataText="Không có dữ liệu"
          showRowLines
          columnAutoWidth
          rowAlternationEnabled
          sorting={{ mode: 'none' }}
        >
          <Paging enabled={false} />
          {columns.map((defs, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <Column {...defs} key={index} />
          ))}
        </DataGrid>
      )}
    </Fragment>
  );
}
