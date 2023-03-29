import { set, startOfDay } from 'date-fns';
import { isArray, isEmpty } from 'lodash';
import moment from 'moment';
const jwtDecode = require('jwt-decode');
export function validateLatLng(lat, lng) {
  if (
    lat === null ||
    lat === '' ||
    lat === undefined ||
    lng === undefined ||
    lng === null ||
    lng === ''
  )
    return false;
  // eslint-disable-next-line no-restricted-globals
  if (isNaN(Number(lat)) || Number(lat) < -90 || Number(lat) > 90) {
    return false;
  }
  // eslint-disable-next-line no-restricted-globals
  if (isNaN(Number(lng)) || Number(lng) < 0 || Number(lng) > 180) {
    return false;
  }
  return true;
}

export function trimDefaultPath() {
  return process.env.SMC_DEFAULT_PATH.replace('/', '');
}
export function formatDateTime(value) {
  if (value) return moment(value).format(process.env.DATE_TIME_FORMAT);
  return '';
}

export function formatDateTimeHHmmDDMMYYYY(value) {
  if (value) return moment(value).format('HH:mm DD/MM/YYYY');
  return '';
}

export const formatRawDataDepartment = dataset => {
  const hashTable = Object.create(null);
  dataset.forEach(
    // eslint-disable-next-line no-return-assign
    aData =>
      (hashTable[aData.departmentId] = {
        ...aData,
        children: [],
        label: aData.departmentName,
        value: aData.departmentId,
        checked: aData.checked,
      }),
  );
  const dataTree = [];
  dataset.forEach(aData => {
    if (
      aData.parentId &&
      hashTable[aData.parentId] &&
      hashTable[aData.parentId]
    ) {
      hashTable[aData.parentId].children.push(hashTable[aData.departmentId]);
    } else dataTree.push(hashTable[aData.departmentId]);
  });
  return dataTree;
};
export const formatRawDataZone = dataset => {
  const hashTable = Object.create(null);
  const dataTree = [];
  if (isArray(dataset)) {
    dataset.forEach(
      // eslint-disable-next-line no-return-assign
      aData =>
        (hashTable[aData.zoneId] = {
          ...aData,
          children: [],
          label: aData.zoneName,
          value: aData.zoneId,
          checked: aData.checked,
        }),
    );
    dataset.forEach(aData => {
      if (aData.parentId && hashTable[aData.parentId])
        hashTable[aData.parentId].children.push(hashTable[aData.zoneId]);
      else dataTree.push(hashTable[aData.zoneId]);
    });
  }
  return dataTree;
};

export const formatRawDataAssetGroup = dataset =>
  formatRawDataTree(dataset, 'id', 'parentId');

export const formatRawDataAssetType = dataset =>
  formatRawDataTree(dataset, 'assetTypeId', 'parentId');

export const formatRawDataCheckList = dataset =>
  formatRawDataTree(dataset, 'id', 'parentItemId');

export const formatRawDataTree = (dataset, idField, parentField) => {
  const hashTable = Object.create(null);
  const dataTree = [];
  if (isArray(dataset)) {
    dataset.forEach(
      // eslint-disable-next-line no-return-assign
      aData =>
        (hashTable[aData[idField]] = {
          ...aData,
          children: [],
          label: aData.name,
          value: aData[idField],
          checked: aData.checked,
        }),
    );
    dataset.forEach(aData => {
      if (aData[parentField] && hashTable[aData[parentField]])
        hashTable[aData[parentField]].children.push(hashTable[aData[idField]]);
      else dataTree.push(hashTable[aData[idField]]);
    });
  }
  return dataTree;
};

export const hashMenu = dataset => {
  const hashTable = Object.create(null);
  dataset.forEach(
    // eslint-disable-next-line no-return-assign
    aData =>
      (hashTable[aData.id] = {
        ...aData,
        children: [],
        id: aData.id,
        key: aData.url,
        isShowMenu: aData.active,
        text: aData.name,
        functionCode: aData.code,
        icon: aData.functionIcon
          ? aData.functionIcon
          : 'https://image.flaticon.com/icons/svg/2948/2948037.svg',
        selectedIcon: aData.functionIcon
          ? aData.functionIcon
          : 'https://image.flaticon.com/icons/svg/2948/2948037.svg',
      }),
  );
  return hashTable;
};
export const formatRawDataMenu = (dataset, hashObj) => {
  const hashTable = Object.assign({}, hashObj);
  const dataTree = [];
  dataset.forEach(aData => {
    if (aData.parentId && hashTable[aData.parentId]) {
      if (!hashTable[aData.parentId].children.find(d => d.id == aData.id))
        hashTable[aData.parentId].children.push(hashTable[aData.id]);
    } else dataTree.push(hashTable[aData.id]);
  });
  // let testIndex = dataTree.findIndex(
  //   item =>
  //     item.children &&
  //     item.children.find(el => el.children && el.children.length > 0),
  // );
  // while (testIndex >= 0) {
  //   // với các menu 3 cấp mà cấp 1 bị ẩn thì show cấp con của nó
  //   const items = [...[], ...dataTree[testIndex].children];
  //   dataTree.splice(testIndex, 1);
  //   for (let index = 0; index < items.length; index++) {
  //     const element = items[index];
  //     dataTree.push(element);
  //   }
  //   testIndex = dataTree.findIndex(item => !item.isShowMenu);
  // }
  return dataTree;
};
export const nonAccentVietnamese = str => {
  str = str.toLowerCase();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/đ/g, 'd');
  // Some system encode vietnamese combining accent as individual utf-8 characters
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ''); // Huyền sắc hỏi ngã nặng
  str = str.replace(/\u02C6|\u0306|\u031B/g, ''); // Â, Ê, Ă, Ơ, Ư
  return str;
};
export function getTimeBetweenTwoDate(date1, date2) {
  const hour = Math.abs(moment(date1).diff(moment(date2), 'hour'));
  const minute = Math.abs(moment(date1).diff(moment(date2), 'minute'));
  const second = Math.abs(moment(date1).diff(moment(date2), 'second'));
  return `${add0(hour)} : ${add0(minute - hour * 60)} : ${add0(
    second - minute * 60,
  )}`;
}
function add0(n) {
  return n > 9 ? `${n}` : `0${n}`;
}

export function getUserInfo() {
  try {
    let token = window.localStorage.getItem('token');
    if (token) {
      if (token.startsWith('Bearer ')) token = token.replace('Bearer ', '');
      const info = jwtDecode(token);
      return info;
    }
    return {};
  } catch (ex) {
    return {};
  }
}

export function getFirstMenuOfUser(userMenus) {
  if (userMenus.length > 0) {
    if (userMenus[0].functionUrl && userMenus[0].functionUrl != '#') {
      return process.env.SMC_DEFAULT_PATH + userMenus[0].functionUrl;
    }
    if (
      userMenus[0].children.length > 0 &&
      userMenus[0].children[0].functionUrl
    ) {
      return (
        process.env.SMC_DEFAULT_PATH + userMenus[0].children[0].functionUrl
      );
    }
  }
  return `/`;
}

// format data function permission to authorize action on button
/* sample input data
const authorities = [
  {
    areaId: 19,
    function: 'department',
    action: 'update',
    authority: 'area:19:action:update:function:department',
  },
  {
    areaId: 19,
    function: 'zone',
    action: 'view',
    authority: 'area:19:action:view:function:zone',
  },
  {
    areaId: 19,
    function: 'user',
    action: 'delete',
    authority: 'area:19:action:delete:function:user',
  },
  {
    areaId: 19,
    function: 'issue',
    action: 'mark_as_false',
    authority: 'area:19:action:mark_as_false:function:issue',
  },
  {
    areaId: 19,
    function: '(fire_alarm_monitor|event|issue|device)',
    action: 'update',
    authority:
      'area:19:action:update:function:(fire_alarm_monitor|event|issue|device)',
  },
];
*/
export function formatDataFunctionPermission(authorities) {
  let listFunc = [];
  const mapObject = {};
  authorities.forEach(item => {
    // ignore element .*
    if (item.function !== '.*') {
      const functions = item.function;
      if (functions.includes('|')) {
        listFunc = functions.substring(1, functions.length - 1).split('|');
      } else {
        listFunc = [functions];
      }
      listFunc.forEach(el => {
        item[el] = item.action;
        if (isEmpty(mapObject[el])) {
          mapObject[el] = [item.action];
        } else if (!mapObject[el].includes(item.action)) {
          mapObject[el].push(item.action);
        }
      });
    }
  });
  return mapObject;
}

export function checkAuthority(
  scope = ['list', 'get', 'create', 'update', 'delete'],
  resourceCode,
  listAuthority = {},
) {
  let userData;
  try {
    userData = JSON.parse(localStorage.getItem('userData'));
  } catch (err) {
    //
  }
  if (userData && userData.isRoot) {
    if (Array.isArray(scope)) {
      return scope.reduce((total, cur) => ({ ...total, [cur]: true }), {});
    }
    return true;
  }
  if (
    !resourceCode ||
    !listAuthority ||
    Object.keys(listAuthority).length <= 0
  ) {
    if (Array.isArray(scope)) {
      return scope.reduce((total, cur) => ({ ...total, [cur]: false }), {});
    }
    return false;
  }
  if (Array.isArray(scope)) {
    return scope.reduce(
      (total, cur) => ({
        ...total,
        [cur]:
          (listAuthority[resourceCode] && listAuthority[resourceCode][cur]) ||
          false,
      }),
      {},
    );
  }
  return (
    (listAuthority[resourceCode] && listAuthority[resourceCode][scope]) || false
  );
}

export function getIntlId(code) {
  switch (code) {
    case 'ACTIVE':
      return 'app.status.active';
    case 'UNACTIVE':
      return 'app.status.un_active';
    case 'OPENING':
      return 'app.status.opening';
    case 'CLOSING':
      return 'app.status.close';
    case 'NORMAL':
      return 'app.status.normal';
    case 'LOCKED':
      return 'app.status.lock';
    case 'UNLOCK':
      return 'app.status.un_lock';
    case 'ABNORMAL':
      return 'app.status.abnormal';
    case 'CONNECTED':
      return 'app.status.connected';
    case 'UNCONNECTED':
      return 'app.status.un_connected';
    case 'DISCONNECTED':
      return 'app.status.un_connected';
    default:
      return 'app.status.missing_status';
  }
}

export function time2Min(time) {
  if (!time) return 0;
  const h = time.getHours();
  const m = time.getMinutes();
  return h * 60 + m;
}
export function min2Time(min) {
  if (!min || min <= 0) return startOfDay(new Date());
  const h = Math.floor(min / 60);
  const m = min % 60;
  const today = new Date();
  return set(today, { hours: h, minutes: m });
}

export function getAreaString(obj) {
  if (!obj) return '';
  const result = [];
  // if (obj.area) result.push(obj.area.areaName);
  if (obj.zone) result.push(obj.zone.zoneName);
  if (obj.block) result.push(obj.block.blockName);
  if (obj.floor) result.push(obj.floor.floorName);
  if (obj.unit) result.push(obj.unit.unitName);
  return result.join('/ ');
}
export function getAreaObjectForTree(obj) {
  if (!obj) return {};
  if (obj.unit)
    return {
      ...obj.unit,
      id: `unitId_${obj.unit.unitId}`,
      name: obj.unit.unitName,
      type: 'unit',
    };
  if (obj.floor)
    return {
      ...obj.floor,
      id: `floorId_${obj.floor.floorId}`,
      name: obj.floor.floorName,
      type: 'floor',
    };
  if (obj.block)
    return {
      ...obj.block,
      id: `blockId_${obj.block.blockId}`,
      name: obj.block.blockName,
      type: 'block',
    };
  if (obj.zone)
    return {
      ...obj.zone,
      id: `zoneId_${obj.zone.zoneId}`,
      name: obj.zone.zoneName,
      type: 'zone',
    };
  if (obj.area)
    return {
      ...obj.area,
      id: `areaId_${obj.area.areaId}`,
      name: obj.area.areaName,
      type: 'area',
    };
  return null;
}
export function getAreaObjectFromTree(obj) {
  if (!obj || (typeof obj == 'object' && Object.keys(obj).length <= 0)) {
    return {};
  }
  const data = ['unitId', 'floorId', 'blockId', 'zoneId', 'areaId'].reduce(
    (total, cur) => {
      if (obj[cur]) return { ...total, [cur]: obj[cur] };
      return total;
    },
    {},
  );
  return data;
}
