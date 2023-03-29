import {
  Button,
  CircularProgress,
  FormControlLabel,
  IconButton,
  makeStyles,
  Paper,
  Switch,
  Tooltip,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/AddOutlined';
import ClearIcon from '@material-ui/icons/DeleteOutlineOutlined';
import useAxios from 'axios-hooks';
import CustomTable from 'components/Custom/table/CustomTable';
import RenderDetails from 'components/RenderDetails';
import { API_DETAIL_USER_IDENTITY } from 'containers/apiUrl';
import Loading from 'containers/Loading';
import { format } from 'date-fns';
import { Popup } from 'devextreme-react/popup';
import fingerprintImg from 'images/vantay.png';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';
import { showError, showSuccess } from 'utils/toast-utils';
import { buildUrlWithToken, showAlertConfirm } from 'utils/utils';
import messages from '../messages';
import VerifyIdentifi from './VerifyIdentifi';

const ImgCards = ({ data, imgTitle }) => (
  <div style={{ display: 'flex', gap: '34px' }}>
    {React.Children.toArray(
      data.map((item, index) => (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Img
            src={
              item
                ? item.imageFileUrl
                  ? buildUrlWithToken(item.imageFileUrl)
                  : `data:image/jpeg;base64,${item.imageBase64}`
                : null
            }
          />
          <p style={{ margin: 0, marginTop: '5px', whiteSpace: 'nowrap' }}>
            {imgTitle} {index + 1}
          </p>
        </div>
      )),
    )}
  </div>
);

const Img = React.memo((props) => {
  const [loaded, setLoaded] = useState(false);
  const { src } = props;
  return (
    <>
      <div
        style={
          loaded
            ? { display: 'none' }
            : {
                width: '100px',
                height: '100px',
                display: 'grid',
                backgroundColor: '#C4C4C4',
                placeItems: 'center',
              }
        }
      >
        <CircularProgress size={20} />
      </div>
      <img
        {...props}
        src={src}
        alt="Ảnh"
        onLoad={() => setLoaded(true)}
        style={
          loaded ? { width: '100px', height: '100px' } : { display: 'none' }
        }
      />
    </>
  );
});
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
export default function Identity() {
  const { id } = useParams();
  const intl = useIntl();
  const [openAddCard, setOpenAddCard] = useState(false);
  const [identityData, setIdentityData] = useState(null);
  const classes = useStyles();
  const [change, setChange] = useState(0);
  // table data
  const [
    { data: getData, loading: getLoading, error: getError },
    executeGetData,
  ] = useAxios(API_DETAIL_USER_IDENTITY.LIST(id), {
    useCache: false,
    manual: true,
  });
  useEffect(() => {
    if (id) {
      executeGetData();
    }
  }, [id, change]);
  useEffect(() => {
    if (getData) {
      setIdentityData(getData);
    }
  }, [getData]);
  useEffect(() => {
    if (getError) {
      if (getError.response?.status == 404) {
        setIdentityData({});
      } else showError(getError);
    }
  }, [getError]);
  // on/off identity type
  const [{ data: putData, loading: putLoading, error: putError }, executePut] =
    useAxios(
      {
        url: API_DETAIL_USER_IDENTITY.AUTHENTICATION_MODE(id),
        method: 'PUT',
      },
      { manual: true },
    );
  useEffect(() => {
    if (putData) {
      showSuccess('Thành công');
      setChange(change + 1);
    }
  }, [putData]);
  useEffect(() => {
    if (putError) {
      showError(putError);
    }
  }, [putError]);
  // delete
  const [
    { response: deleteData, loading: deleteLoading, error: deleteError },
    executeDelete,
  ] = useAxios(
    {
      method: 'DELETE',
    },
    {
      manual: true,
    },
  );
  useEffect(() => {
    if (deleteError) {
      showError(deleteError);
    }
  }, [deleteError]);
  useEffect(() => {
    if (deleteData) {
      showSuccess('Thành công');
      setChange(change + 1);
    }
  }, [deleteData]);
  const handleChangeIdentity = (e) => {
    const { name, checked } = e.target;
    const payload = [
      'enableCardIdentification',
      'enableFaceIdentification',
      'enableFingerprintIdentification',
    ].reduce(
      (total, cur) => ({
        ...total,
        [cur]: name == cur ? checked : identityData[cur],
      }),
      {},
    );
    executePut({ data: payload });
  };
  const deleteIdentity = (type, cardId) => {
    showAlertConfirm(
      {
        text: intl.formatMessage(
          messages.deleteContentIdentificationInformation,
          {
            type,
          },
        ),
      },
      intl,
    ).then((result) => {
      if (result.value) {
        let url = '';
        switch (type) {
          case 0:
            // FACE
            url = API_DETAIL_USER_IDENTITY.DELETE_FACE(id);
            break;
          case 1:
            // FINGER
            url = API_DETAIL_USER_IDENTITY.DELETE_FINGER(id);
            break;
          case 2:
            // CARD
            url = API_DETAIL_USER_IDENTITY.DELETE_CARD(cardId);
            break;
          default:
            break;
        }
        executeDelete({
          url,
        });
      }
    });
  };
  // add card
  const [
    { response: addData, loading: addLoading, error: addError },
    executeAdd,
  ] = useAxios(
    {
      url: API_DETAIL_USER_IDENTITY.ADD_CARD,
      method: 'POST',
    },
    {
      manual: true,
    },
  );
  useEffect(() => {
    if (addError) {
      showError(addError);
    }
  }, [addError]);
  useEffect(() => {
    if (addData) {
      showSuccess('Thêm thẻ thành công');
      setOpenAddCard(false);
      setChange(change + 1);
    }
  }, [addData]);
  const handleCloseAddCard = (ret) => {
    if (ret) {
      // add card
      executeAdd({
        data: { ...ret, userId: id },
      });
    } else setOpenAddCard(false);
  };
  const onDeleteBtnClick = (cardId) => {
    deleteIdentity(2, cardId);
  };
  const actionRenderer = ({ data }) => (
    // <Fragment>
    <Tooltip title={intl.formatMessage({ id: 'app.tooltip.delete' })}>
      <IconButton onClick={() => onDeleteBtnClick(data.id)}>
        <ClearIcon fontSize="small" />
      </IconButton>
    </Tooltip>
    // </Fragment>
  );
  const onAddBtnClick = () => {
    setOpenAddCard(true);
  };
  const headerAction = () => (
    <Tooltip title={intl.formatMessage({ id: 'app.tooltip.add' })}>
      <IconButton size="small" onClick={() => onAddBtnClick()}>
        <AddIcon fontSize="inherit" />
      </IconButton>
    </Tooltip>
  );
  const faceDetails = identityData && (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <span style={{ fontWeight: 500, fontSize: 20 }}>Khuôn mặt</span>
        {identityData?.faces?.length > 0 && (
          <FormControlLabel
            control={
              <Switch
                color="primary"
                checked={identityData?.enableFaceIdentification}
                onChange={(e) => handleChangeIdentity(e)}
                name="enableFaceIdentification"
              />
            }
            label={
              identityData?.enableFaceIdentification
                ? 'Hoạt động'
                : 'Ngưng hoạt động'
            }
          />
        )}
      </div>
      <div className="ct-flex-row">
        <div style={{ width: '80%' }}>
          <RenderDetails
            nopaper
            data={[
              {
                field: 'Thời gian cập nhật',
                width: 6,
                content: identityData?.faceIdentificationUpdatedAt
                  ? format(
                      new Date(identityData?.faceIdentificationUpdatedAt),
                      'HH:mm dd/MM/yyyy',
                    )
                  : '',
              },
              {
                field: 'Trạng thái',
                width: 6,
                content: identityData?.faces?.length
                  ? identityData?.enableFaceIdentification
                    ? 'Hoạt động'
                    : 'Ngưng hoạt động'
                  : 'Chưa định danh',
              },
            ]}
          />
        </div>
        {identityData?.faces?.length > 0 && (
          <div className={classes.btnWraper}>
            <Button
              color="primary"
              variant="contained"
              style={{ height: '40px' }}
              onClick={() => deleteIdentity(0)}
            >
              Xoá khuôn mặt
            </Button>
          </div>
        )}
      </div>
      <div>
        {(identityData?.faces?.length && (
          <>
            <h4 style={{ fontSize: '16px' }}>Hình ảnh khuôn mặt</h4>
            <div style={{ display: 'flex' }}>
              <ImgCards data={identityData?.faces} imgTitle="Ảnh" />
            </div>
          </>
        )) ||
          null}
      </div>
    </div>
  );

  const fingerprintDetails = identityData && (
    <div style={{ marginTop: 24 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <span style={{ fontWeight: 500, fontSize: 20 }}>Vân tay</span>
        {identityData?.fingerprints?.length > 0 && (
          <FormControlLabel
            control={
              <Switch
                color="primary"
                checked={identityData?.enableFingerprintIdentification}
                onChange={(e) => handleChangeIdentity(e)}
                name="enableFingerprintIdentification"
              />
            }
            label={
              identityData?.enableFingerprintIdentification
                ? 'Hoạt động'
                : 'Ngưng hoạt động'
            }
          />
        )}
      </div>
      <div className="ct-flex-row">
        <div style={{ width: '80%' }}>
          <RenderDetails
            nopaper
            data={[
              {
                field: 'Thời gian cập nhật',
                width: 6,
                content: identityData?.fingerprintIdentificationUpdatedAt
                  ? format(
                      new Date(
                        identityData?.fingerprintIdentificationUpdatedAt,
                      ),
                      'HH:mm dd/MM/yyyy',
                    )
                  : '',
              },
              {
                field: 'Trạng thái',
                width: 6,
                content: identityData?.fingerprints?.length
                  ? identityData?.enableFingerprintIdentification
                    ? 'Hoạt động'
                    : 'Ngưng hoạt động'
                  : 'Chưa định danh',
              },
            ]}
          />
        </div>
        {identityData?.fingerprints?.length > 0 && (
          <div className={classes.btnWraper}>
            <Button
              color="primary"
              variant="contained"
              style={{ height: '40px' }}
              onClick={() => deleteIdentity(1)}
            >
              Xoá vân tay
            </Button>
          </div>
        )}
      </div>
      <div
        style={{
          display: 'flex',
          height: '300px',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        <img
          src={fingerprintImg}
          alt="Ảnh vân tay"
          style={{
            width: '200px',
            height: '200px',
          }}
        />

        <span style={{ marginTop: '10px' }}>
          {identityData?.fingerprints?.length
            ? `Đã có ${identityData?.fingerprints?.length} vân tay được định danh`
            : 'Chưa có định danh vân tay cho người này'}
        </span>
      </div>
    </div>
  );

  const cardDetails = identityData && (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <span style={{ fontWeight: 500, fontSize: 20 }}>
          Thẻ
          {identityData?.cards?.length ? ` (${identityData.cards.length})` : ''}
        </span>
        {identityData?.cards?.length > 0 && (
          <FormControlLabel
            control={
              <Switch
                color="primary"
                checked={identityData?.enableCardIdentification}
                onChange={(e) => handleChangeIdentity(e)}
                name="enableCardIdentification"
              />
            }
            label={
              identityData?.enableCardIdentification
                ? 'Hoạt động'
                : 'Ngưng hoạt động'
            }
          />
        )}
      </div>
      <CustomTable
        data={identityData?.cards || []}
        disabledSelect
        enabledPaging
        height={333}
        row={[
          {
            caption: 'STT',
            cellRender: (item) =>
              item.rowIndex +
              item.component.pageIndex() * item.component.pageSize() +
              1,
            alignment: 'center',
            // width: 'auto',
          },
          {
            dataField: 'cardNumber',
            caption: 'Mã thẻ',
          },
          {
            dataField: 'cardType',
            caption: 'Loại thẻ',
            cellRender: () => 'MIFARE',
          },
          {
            dataField: 'availableAt',
            caption: 'Thời gian',
            dataType: 'datetime',
            format: 'HH:mm:ss dd/MM/yyyy',
          },
          {
            dataField: 'cardStatus',
            caption: 'Trạng thái',
            cellRender: (v) =>
              v.data.cardStatus === 'NEW'
                ? 'Chưa cấp'
                : v.data.cardStatus === 'ACTIVE'
                ? 'Đã cấp còn hiệu lực'
                : 'Đã cấp hết hiệu lực',
          },
          {
            cellRender: actionRenderer,
            headerCellRender: headerAction,
            width: 'auto',
            alignment: 'center',
          },
        ]}
      />
    </div>
  );

  return (
    <Paper className={classes.paper}>
      {(getLoading || putLoading || deleteLoading || addLoading) && <Loading />}
      {faceDetails}
      {fingerprintDetails}
      {cardDetails}
      {openAddCard && (
        <Popup
          className="popup"
          visible
          title={intl.formatMessage(messages.identifyCard)}
          showTitle
          onHidden={() => handleCloseAddCard(0)}
          dragEnabled
          width={600}
          height="auto"
        >
          <VerifyIdentifi onSubmit={handleCloseAddCard} />
        </Popup>
      )}
    </Paper>
  );
}
