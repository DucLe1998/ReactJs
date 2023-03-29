/* eslint-disable no-unused-vars */
import BomPCCC from '../images/icon-devices-bms/bom-pccc.svg';
import BomSinhHoat from '../images/icon-devices-bms/bom-sinh-hoat.svg';
import BomTangAp from '../images/icon-devices-bms/bom-tang-ap.svg';
import BomThoatNuocSan from '../images/icon-devices-bms/bom-thoat-nuoc-san.svg';
import BomThoatNuocThangMay from '../images/icon-devices-bms/bom-thoat-nuoc-thang-may.svg';
import BomTuHoat from '../images/icon-devices-bms/bom-tu-hoat.svg';
import CamBienNongDoCO from '../images/icon-devices-bms/cam-bien-nong-do-CO.svg';
import DongHoDaNang from '../images/icon-devices-bms/dongho-da-nang.svg';
import DongHoDoNhiet from '../images/icon-devices-bms/dongho-do-nhiet.svg';
import DongHoNuoc from '../images/icon-devices-bms/dongho-nuoc.svg';
import QuatCapKhiTuoi from '../images/icon-devices-bms/quat-cap-khi-tuoi.svg';
import QuatHutKhiThai from '../images/icon-devices-bms/quat-hut-khi-thai.svg';
import QuatHutKhoi from '../images/icon-devices-bms/quat-hut-khoi.svg';
import QuatTangAp from '../images/icon-devices-bms/quat-tang-ap.svg';
import { DEVICE_BMS_CODE } from './constants';

export const getSrcIconDeviceBMS = type => {
  switch (type) {
    case DEVICE_BMS_CODE.WATERMETER:
      return DongHoNuoc;
    case DEVICE_BMS_CODE.SUPPLYAIRFAN:
      return QuatCapKhiTuoi;
    case DEVICE_BMS_CODE.SUMPPUMP:
      return BomThoatNuocSan;
    case DEVICE_BMS_CODE.SENSOR:
      return CamBienNongDoCO;
    case DEVICE_BMS_CODE.PRESSURIZATIONFAN:
      return QuatTangAp;
    case DEVICE_BMS_CODE.PRESSUREPUMP:
      return BomTangAp;
    case DEVICE_BMS_CODE.MULTIFUNCTIONENERGYMETER:
      return DongHoDaNang;
    default:
      return BomSinhHoat;
  }
};
