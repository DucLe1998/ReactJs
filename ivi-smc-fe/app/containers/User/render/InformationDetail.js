import Grid from '@material-ui/core/Grid';
import clsx from 'clsx';
import CustomTable from 'components/Custom/table/CustomTable';
import { Button } from 'devextreme-react/button';
import DateBox from 'devextreme-react/date-box';
import { TextBox } from 'devextreme-react/text-box';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { RowContent, RowItem, RowLabel } from 'components/CommonComponent';
import VanTay from 'images/vantay.png';
import { buildUrlWithToken } from 'utils/utils';
import { IDENTIFY_TYPES } from '../constants';
import messages from '../messages';
import { useStyles } from '../style';

export default function InformationDetail({
  type,
  identifyId,
  data,
  close,
  isAdd,
}) {
  const classes = useStyles();
  const intl = useIntl();
  const [value, setValue] = useState({});
  const [faceAndFingerprint, setFaceAndFingerprint] = useState([]);
  const [status, setStatus] = useState(true);
  useEffect(() => {
    if (data.length) {
      const val = data.filter(item => item.identifyMethod === type)[0];
      if (type === IDENTIFY_TYPES.CARD.id) {
        if (isAdd) {
          setValue({ ...val });
          setStatus(true);
        } else if (val?.cards) {
          const card = val?.cards.filter(item => item.id === identifyId)[0];
          setValue({ ...card, updatedAt: val?.updatedAt || card.updatedAt });
          setFaceAndFingerprint([...val.cards]);
          setStatus(val.enableCardIdentification);
        } else {
          setValue({ ...val });
          setStatus(val.enableCardIdentification);
        }
      }
      if (type === IDENTIFY_TYPES.FINGERPRINTS.id) {
        const fingerprints = val.fingerprints.filter(
          item => item.id === identifyId,
        )[0];
        setValue({
          ...fingerprints,
          updatedAt: val?.updatedAt || fingerprints.updatedAt,
        });
        setFaceAndFingerprint([...val.fingerprints]);
        setStatus(val.enableFingerprintIdentification);
      }
      if (type === IDENTIFY_TYPES.FACES.id) {
        const faces = val.faces.filter(item => item.id === identifyId)[0];
        setValue({ ...faces, updatedAt: val?.updatedAt || faces.updatedAt });
        setFaceAndFingerprint([...val.faces]);
        setStatus(val.enableFaceIdentification);
      }
    }
  }, []);

  return (
    <div className={classes.marginCard}>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <span className={classes.label}>Thời gian cập nhật</span>
          <DateBox
            disabled
            id="timeUpdate"
            name="timeUpdate"
            type="date"
            displayFormat="dd/MM/yyyy HH:mm"
            value={value?.updatedAt || ''}
            showClearButton={false}
          />
        </Grid>
        <Grid item xs={6}>
          <span className={classes.label}>
            {intl.formatMessage(messages.status)}
          </span>
          <TextBox
            disabled
            id="status"
            name="status"
            placeholder={intl.formatMessage(messages.status)}
            stylingMode="outlined"
            value={status ? 'Hoạt động' : 'Không hoạt động'}
          />
        </Grid>
        {type === IDENTIFY_TYPES.CARD.id && (
          <CustomTable
            data={faceAndFingerprint || []}
            disabledSelect
            enabledPaging
            height={333}
            row={[
              {
                caption: 'STT',
                cellRender: item =>
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
                cellRender: v => (
                  <div>
                    {v.data.cardStatus === 'NEW'
                      ? 'Chưa cấp'
                      : v.data.cardStatus === 'ACTIVE'
                      ? 'Đã cấp còn hiệu lực'
                      : 'Đã trả'}
                  </div>
                ),
              },
            ]}
          />
        )}
        {type === IDENTIFY_TYPES.FINGERPRINTS.id && (
          <>
            <Grid
              item
              xs={12}
              style={{
                marginTop: 10,
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              <div>
                <img src={VanTay} alt="Vân tay" />
              </div>
              <p>
                Đã có {faceAndFingerprint.length || 0} vân tay được định danh
              </p>
            </Grid>
            {/* {faceAndFingerprint.map((item, index) => ( */}
            {/*  <Grid key={item.id} item xs={2}> */}
            {/*    <div */}
            {/*      style={{ */}
            {/*        width: 150, */}
            {/*        height: 150, */}
            {/*        background: 'white', */}
            {/*        border: '1px solid rgba(0, 0, 0, 0.24)', */}
            {/*      }} */}
            {/*    > */}
            {/*      <img */}
            {/*        style={{ */}
            {/*          width: 150, */}
            {/*          height: 150, */}
            {/*        }} */}
            {/*        src={ */}
            {/*          item?.imageFileUrl && item.imageFileUrl.length > 0 */}
            {/*            ? buildUrlWithToken(item.imageFileUrl) */}
            {/*            : `data:image/jpeg;base64,${item.imageBase64}` */}
            {/*        } */}
            {/*        alt={index + 1} */}
            {/*      /> */}
            {/*    </div> */}
            {/*    <p style={{ textAlign: 'center' }}>Vân tay {index + 1}</p> */}
            {/*  </Grid> */}
            {/* ))} */}
          </>
        )}
        {type === IDENTIFY_TYPES.FACES.id && (
          <>
            <Grid item xs={12}>
              <p>Hình ảnh Khuôn mặt</p>
            </Grid>
            {faceAndFingerprint.map((item, index) => (
              <Grid key={item.id} item xs={2}>
                <div
                  style={{
                    width: 150,
                    height: 150,
                    background: 'white',
                    border: '1px solid rgba(0, 0, 0, 0.24)',
                  }}
                >
                  <img
                    style={{
                      width: 150,
                      height: 150,
                    }}
                    src={
                      item?.imageFileUrl && item.imageFileUrl.length > 0
                        ? buildUrlWithToken(item.imageFileUrl)
                        : `data:image/jpeg;base64,${item.imageBase64}`
                    }
                    alt={item.faceType}
                  />
                </div>
                <p style={{ textAlign: 'center' }}>Ảnh {index + 1}</p>
              </Grid>
            ))}
          </>
        )}
      </Grid>
      <RowItem style={{ float: 'right', marginTop: 20 }}>
        <RowLabel />
        <RowContent>
          <Button
            className={clsx(classes.button, classes.buttonFilter)}
            onClick={close}
          >
            {intl.formatMessage({ id: 'app.status.close' })}
          </Button>
        </RowContent>
      </RowItem>
    </div>
  );
}
