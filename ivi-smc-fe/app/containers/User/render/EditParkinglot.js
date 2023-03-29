import React, { useState } from 'react';
import { Button } from 'devextreme-react/button';
import SelectBox from 'devextreme-react/select-box';
import { Grid } from '@material-ui/core';
import clsx from 'clsx';
import { useIntl } from 'react-intl';
import { TextBox } from 'devextreme-react/text-box';
import {
  RowContent,
  RowItem,
  RowLabel,
} from '../../../components/CommonComponent';
import { Label } from '../../Login/style';
import { useStyles } from '../style';
import messages from '../messages';
import { getApi } from '../../../utils/requestUtils';
import { API_IAM } from '../../apiUrl';

export function EditParkinglot({ close, confirm, isEdit, isAdd, value, data }) {
  const intl = useIntl();
  const classes = useStyles();
  const [vehicleType, setVehicleType] = useState(
    isEdit ? value?.vehicleType : null,
  );
  const [name, setName] = useState(isEdit ? value?.name : null);
  const [plateNumber, setPlateNumber] = useState(
    isEdit ? value?.plateNumber : null,
  );
  const [cardNumber, setCardNumber] = useState(
    isEdit ? value?.cardNumber : null,
  );
  const [disable, setDisable] = useState(isEdit);
  const isDisable = (value, setValue) => {
    setDisable(false);
    if (value === null || value.toString().trim().length === 0) {
      setValue(null);
    } else {
      setValue(value);
    }
  };
  const [plateNumberExist, setPlateNumberExist] = useState(false);
  const [cardNumberExist, setCardNumberExist] = useState(false);

  const CheckPlateNumber = plateNumber =>
    new Promise(resolve => {
      getApi(API_IAM.VEHICLE_SEARCH, { plateNumber }).then(res => {
        const data = res?.data?.rows || [];
        if (data.length > 0) {
          if (isAdd) {
            setPlateNumberExist(true);
            return resolve(true);
          }
          if (data.length === 1) {
            if (data[0].plateNumber === value.plateNumber) {
              setPlateNumberExist(false);
              return resolve(false);
            }
            setPlateNumberExist(true);
            return resolve(true);
          }
          setPlateNumberExist(true);
          return resolve(true);
        }
        setPlateNumberExist(false);
        return resolve(false);
      });
    });

  const CheckCardNumber = cardNumber =>
    new Promise(resolve => {
      getApi(API_IAM.VEHICLE_SEARCH, { cardNumber }).then(res => {
        const data = res?.data?.rows || [];
        if (data.length > 0) {
          setCardNumberExist(true);
          return resolve(true);
        }
        setCardNumberExist(false);
        return resolve(false);
      });
    });

  const CheckExist = async (params, value) => {
    const { plateNumber, cardNumber } = params;
    await Promise.all([
      CheckPlateNumber(plateNumber),
      CheckCardNumber(cardNumber),
    ]).then(res => {
      if (res[0] === false && res[1] === false) {
        confirm(value);
      }
    });
  };

  return (
    <React.Fragment>
      <Grid container spacing={3}>
        <Grid container item xs={6}>
          <div className={classes.fullWidth}>
            <Label className={classes.label}>
              {intl.formatMessage(messages.carType)}
            </Label>
            <SelectBox
              items={data}
              placeholder={intl.formatMessage(messages.carType)}
              width="100%"
              displayExpr="name"
              valueExpr="typeId"
              value={vehicleType}
              onValueChanged={e => {
                setVehicleType(e.value);
                setDisable(false);
              }}
            />
          </div>
        </Grid>
        <Grid container item xs={6}>
          <div className={classes.fullWidth}>
            <Label className={classes.label}>
              {intl.formatMessage(messages.carName)}
            </Label>
            <TextBox
              id="tenXe"
              name="tenXe"
              placeholder={intl.formatMessage(messages.carName)}
              stylingMode="outlined"
              value={name}
              onInput={e => {
                const value = e?.event.target.value;
                isDisable(value, setName);
              }}
            />
          </div>
        </Grid>

        <Grid container item xs={6}>
          <div className={classes.fullWidth}>
            <Label className={classes.label}>
              {intl.formatMessage(messages.licensePlate)}
            </Label>
            <TextBox
              id="bienSoXe"
              name="bienSoXe"
              placeholder={intl.formatMessage(messages.licensePlate)}
              stylingMode="outlined"
              value={plateNumber}
              onInput={e => {
                const value = e?.event.target.value;
                isDisable(value, setPlateNumber);
              }}
            />
            {plateNumberExist && (
              <p style={{ color: 'red', marginTop: 5, marginBottom: 0 }}>
                Biển số đã tồn tại
              </p>
            )}
          </div>
        </Grid>
        <Grid container item xs={6}>
          <div className={classes.fullWidth}>
            <Label className={classes.label}>
              {intl.formatMessage(messages.vehicleCardCode)}
            </Label>
            <TextBox
              id="maTheXe"
              name="maTheXe"
              placeholder={intl.formatMessage(messages.vehicleCardCode)}
              stylingMode="outlined"
              value={cardNumber}
              disabled={isEdit}
              onInput={e => {
                const value = e?.event.target.value;
                isDisable(value, setCardNumber);
              }}
            />
            {cardNumberExist && (
              <p style={{ color: 'red', marginTop: 5, marginBottom: 0 }}>
                Mã số thẻ đã tồn tại
              </p>
            )}
          </div>
        </Grid>
      </Grid>
      <RowItem
        style={{
          float: 'right',
          marginTop: 20,
        }}
      >
        <RowLabel />
        <RowContent>
          <Button
            style={{ marginRight: 10 }}
            className={clsx(classes.button, classes.buttonCancel)}
            onClick={close}
          >
            {intl.formatMessage(messages.btnCancel)}
          </Button>
          <Button
            disabled={
              vehicleType === null ||
              name === null ||
              plateNumber === null ||
              cardNumber === null ||
              disable
            }
            className={clsx(classes.button, classes.buttonFilter)}
            onClick={() => {
              const res = data.filter(item => item.typeId === vehicleType)[0];
              const val = {
                vehicleTypeName: res.name,
                vehicleType,
                name,
                cardNumber,
                plateNumber,
                id: isAdd ? null : value.id,
                status: isAdd ? 'ACTIVE' : value.status,
              };
              if (isAdd) {
                CheckExist({ plateNumber, cardNumber }, val).then(() => {});
              } else {
                CheckPlateNumber(plateNumber).then(r => {
                  if (!r) {
                    confirm(val);
                  }
                });
              }
            }}
          >
            {isAdd
              ? intl.formatMessage(messages.btnAdd)
              : intl.formatMessage(messages.btnEdit)}
          </Button>
        </RowContent>
      </RowItem>
    </React.Fragment>
  );
}

export default EditParkinglot;
