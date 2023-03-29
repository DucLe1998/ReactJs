import { Button, Grid, Paper } from '@material-ui/core';
import useAxios from 'axios-hooks';
import PageHeader from 'components/PageHeader';
import TableCustom from 'components/TableCustom';
import TextField from 'components/TextField';
import { USER_CARD_API } from 'containers/apiUrl';
import Loading from 'containers/Loading/Loadable';
import { Item, Toolbar } from 'devextreme-react/data-grid';
import { useFormik } from 'formik';
import { get, pick } from 'lodash';
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';
import { showError } from 'utils/toast-utils';
import * as yup from 'yup';
import { STATUS_MAP, TYPE_MAP, USER_TYPE_MAP } from './constants';
const defaultNew = {
  backNumber: '',
  cardNumber: '',
  cardType: 'PROXIMITY',
  frontNumber: '',
};
const pickProps = ['backNumber', 'cardNumber', 'cardType', 'frontNumber'];
export default function Details({ history, location }) {
  const intl = useIntl();
  const { id } = useParams();
  const [{ data: getData, loading: getLoading, error: getError }, executeGet] =
    useAxios(USER_CARD_API.DETAILS(id), {
      manual: true,
    });
  useEffect(() => {
    if (id) executeGet();
  }, [id]);
  useEffect(() => {
    if (getError) showError(getError);
  }, [getError]);
  // put
  const [{ data: putData, loading: putLoading, error: putError }, executePut] =
    useAxios(
      { url: USER_CARD_API.UPDATE(id), method: 'PUT' },
      {
        manual: true,
      },
    );
  useEffect(() => {
    if (putError) showError(putError);
  }, [putError]);
  const goBack = () => {
    history.push({
      pathname: '/card',
      state: location.state,
    });
  };
  const validationSchema = yup.object().shape({
    // backNumber: yup
    //   .string()
    //   .trim()
    //   .required(intl.formatMessage({ id: 'app.invalid.required' })),
    cardNumber: yup
      .string()
      .trim()
      .required(intl.formatMessage({ id: 'app.invalid.required' })),
    // frontNumber: yup
    //   .string()
    //   .trim()
    //   .required(intl.formatMessage({ id: 'app.invalid.required' })),
  });
  const onSubmit = (data) => {
    executePut({ data });
  };
  const formik = useFormik({
    initialValues: defaultNew,
    validationSchema,
    onSubmit,
  });
  useEffect(() => {
    if (getData) {
      formik.resetForm({
        values: pick({ ...defaultNew, ...getData }, pickProps),
      });
    }
  }, [getData]);
  useEffect(() => {
    if (putData) {
      formik.resetForm({
        values: pick({ ...defaultNew, ...putData }, pickProps),
      });
    }
  }, [putData]);
  const userTypeRenderer = (value) =>
    USER_TYPE_MAP.get(value || 'NONE') || 'Không xác định';
  const statusRenderer = (value) => STATUS_MAP.get(value) || 'Không xác định';
  const columns = [
    {
      dataField: 'cardNumber',
      label: 'Mã thẻ',
    },
    {
      dataField: 'frontNumber',
      label: 'Mã thẻ mặt trước',
    },
    {
      dataField: 'backNumber',
      label: 'Mã thẻ mặt sau',
    },
    {
      dataField: 'cardType',
      label: 'Loại thẻ',
      lookup: TYPE_MAP,
    },
    {
      dataField: 'cardStatus',
      label: 'Trạng thái',
      cellRender: statusRenderer,
    },
    {
      dataField: 'cardUserType',
      label: 'Đối tượng',
      cellRender: userTypeRenderer,
    },
    {
      dataField: 'accessCode',
      label: 'Mã định danh',
    },
    {
      dataField: 'groupName',
      label: 'Đơn vị',
    },
  ];
  const cols = [
    {
      dataField: 'accessCode',
      caption: 'Mã định danh',
      minWidth: 105,
    },
    {
      dataField: 'fullName',
      caption: 'Tên',
    },
    {
      dataField: 'cardUserType',
      caption: 'Đối tượng',
      cellRender: userTypeRenderer,
    },
    {
      dataField: 'groupName',
      caption: 'Đơn vị',
      minWidth: 100,
    },
    {
      dataField: 'cardStatus',
      caption: 'Trạng thái',
      cellRender: statusRenderer,
      minWidth: 134,
    },
    {
      dataField: 'updatedAt',
      caption: 'Thời gian cập nhật',
      dataType: 'datetime',
      format: 'HH:mm dd/MM/yyyy',
      // width: 'auto',
      minWidth: 130,
    },
  ];
  return (
    <>
      <Helmet>
        <title>Chi tiết thẻ</title>
        <meta name="description" content="Chi tiết thẻ" />
      </Helmet>
      {(getLoading || putLoading) && <Loading />}
      <Paper
        style={{
          padding: '0 16px 16px 16px',
          marginTop: '25px',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <PageHeader title="Chi tiết thẻ" showBackButton onBack={goBack}>
          {getData?.cardStatus == 'NEW' && (
            <Button
              variant="contained"
              color="primary"
              onClick={formik.handleSubmit}
              disabled={!formik.dirty}
            >
              Cập nhật
            </Button>
          )}
        </PageHeader>
        {getData && (
          <>
            <Grid container spacing={2}>
              {React.Children.toArray(
                columns.map((col) => {
                  const key = col.dataField;
                  const val = get(getData, key);
                  const edit =
                    getData?.cardStatus == 'NEW' && pickProps.includes(key);
                  return (
                    <Grid item sm={12} md={6} lg={4} xl={3}>
                      {edit ? (
                        <TextField
                          label={col.label}
                          value={formik.values[key]}
                          error={
                            formik.touched[key] && Boolean(formik.errors[key])
                          }
                          helperText={formik.touched[key] && formik.errors[key]}
                          lookup={col?.lookup}
                          name={key}
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange}
                        />
                      ) : (
                        <TextField
                          disabled
                          label={col.label}
                          value={col.cellRender ? col.cellRender(val) : val}
                        />
                      )}
                    </Grid>
                  );
                }),
              )}
            </Grid>
            <div style={{ marginTop: 16, flex: 1 }}>
              <TableCustom
                hideTable={false}
                data={getData.cardHistories}
                columns={cols}
              >
                <Toolbar>
                  <Item
                    text="Lịch sử thay đổi trạng thái thẻ"
                    location="before"
                  />
                </Toolbar>
              </TableCustom>
            </div>
          </>
        )}
      </Paper>
    </>
  );
}
