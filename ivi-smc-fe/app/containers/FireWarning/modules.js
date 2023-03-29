import axios from 'axios';
import { SAP_SRC } from 'containers/apiUrl';

export const loadZones = (page, keyword) => {
  return new Promise((resolve, reject) => {
    const params = {
      limit: 50,
      page,
      searchValue: keyword,
    };
    axios
      .get(`${SAP_SRC}/zones`, {
        params,
        headers: {
          'X-TenantID': 19,
        },
      })
      .then(result => {
        resolve({
          data: result,
          totalCount: result.length,
        });
      })
      .catch(err => reject(err));
  });
};

export const loadBlocks = (page, keyword, zone) => {
  return new Promise((resolve, reject) => {
    const params = {
      limit: 50,
      page,
      searchValue: keyword,
    };
    if (zone.length == 0) {
      resolve({
        data: [],
        totalCount: 0,
      });
    }
    axios
      .get(`${SAP_SRC}/blocks/search`, {
        params,
        headers: {
          'X-TenantID': 19,
        },
      })
      .then(result => {
        resolve({
          data: result,
          totalCount: result.length,
        });
      })
      .catch(err => reject(err));
  });
};
export const loadFloors = (page, keyword) => {
  return new Promise((resolve, reject) => {
    const params = {
      limit: 50,
      page,
      searchValue: keyword,
    };
    axios
      .get(`${SAP_SRC}/floors`, {
        params,
        headers: {
          'X-TenantID': 19,
        },
      })
      .then(result => {
        resolve({
          data: result.rows,
          totalCount: result.count,
        });
      })
      .catch(err => reject(err));
  });
};

export const loadFunctionLocations = (page, keyword) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${SAP_SRC}/functions`, {
        headers: {
          'X-TenantID': 19,
        },
      })
      .then(result => {
        resolve({
          data: result.rows,
          totalCount: result.count,
        });
      })
      .catch(err => reject(err));
  });
};
