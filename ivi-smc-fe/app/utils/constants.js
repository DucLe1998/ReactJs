import moment from 'moment';
export const RESTART_ON_REMOUNT = '@@saga-injector/restart-on-remount';
export const DAEMON = '@@saga-injector/daemon';
export const ONCE_TILL_UNMOUNT = '@@saga-injector/once-till-unmount';

export const DEVICE_BMS_CODE = {
  WATERMETER: 'WaterMeter',
  SUPPLYAIRFAN: 'SupplyAirFan',
  SUMPPUMP: 'SumpPump',
  SENSOR: 'Sensor',
  PRESSURIZATIONFAN: 'PressurizationFan',
  PRESSUREPUMP: 'PressurePump',
  MULTIFUNCTIONENERGYMETER: 'MultiFunctionEnergyMeter',
  GENERICPUMP: 'GenericPump',
  EXHAUSTAIRFAN: 'ExhaustAirFan',
};
export const CONST_START_DATE = moment()
  .subtract(6, 'days')
  .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
  .toISOString();
export const CONST_END_DATE = moment()
  .set({
    hour: 23,
    minute: 59,
    second: 59,
    millisecond: 0,
  })
  .toISOString();
