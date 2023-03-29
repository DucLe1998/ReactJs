import {
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  OutlinedInput,
  Switch,
  DialogContent,
  DialogActions,
  Button,
  AppBar,
  Tab,
} from '@material-ui/core';
import { TabContext, TabList, TabPanel } from '@material-ui/lab';
import {
  Column,
  DataGrid,
  Paging,
  StateStoring,
  FilterRow,
} from 'devextreme-react/data-grid';
import {
  TreeList,
  StateStoring as TreeStoring,
} from 'devextreme-react/tree-list';
import { useFormik } from 'formik';
import React, { useEffect, useState, useRef } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import * as yup from 'yup';
import { addNewRow, detailPolicy, editRow, getMenuID } from './actions';
import reducer from './reducer';
import saga from './saga';
import {
  makeSelectDetailPolicy,
  makeSelectMenuDetail,
  makeSelectResource,
} from './selectors';
import btnMsg from '../Common/Messages/button';
import messages from './messages';
const dotProp = require('dot-prop-immutable');

export function EditPolicy({
  editingRow,
  title,
  loadDetailPolicy,
  detailPolicyInfo,
  editPolicy,
  addNewPolicy,
  getListMenu,
  setIsOpenEdit,
  dataMenuDetail,
}) {
  useInjectReducer({ key: 'policy', reducer });
  useInjectSaga({ key: 'policy', saga });
  // const classes = useStyles();
  const intl = useIntl();
  const [listMenu, setListMenu] = useState([]);
  const [tabIndex, setTabIndex] = useState('1');
  const handleTabChange = (e, idx) => setTabIndex(idx);
  const hashMenu = useRef({});
  const validationSchema = yup.object({
    policyName: yup
      .string()
      .trim()
      .required(intl.formatMessage({ id: 'app.invalid.required' }))
      .max(
        255,
        intl.formatMessage({ id: 'app.invalid.maxLength' }, { max: 255 }),
      ),
    policyCode: yup
      .string()
      .trim()
      .required(intl.formatMessage({ id: 'app.invalid.required' }))
      .matches(
        /^[a-zA-Z0-9_]*$/gm,
        'Chỉ chứa chữ cái không dấu, chữ số và dấu gạch dưới',
      )
      .max(
        255,
        intl.formatMessage({ id: 'app.invalid.maxLength' }, { max: 255 }),
      ),
    description: yup
      .string()
      .trim()
      // .required(intl.formatMessage({ id: 'app.invalid.required' }))
      .max(
        255,
        intl.formatMessage({ id: 'app.invalid.maxLength' }, { max: 255 }),
      ),
  });
  const editForm = useFormik({
    initialValues: {
      description: '',
      policyCode: '',
      policyName: '',
      resourceScope: [],
      status: true,
    },
    validationSchema,
    onSubmit: values => {
      const data = {
        description: values.description,
        policyName: values.policyName,
        policyCode: values.policyCode,
        resourceScopes: revertResourceScope(values.resourceScope),
        status: revertStatus(values.status),
      };
      const id = values.policyId;
      const listMenuId = listMenu.filter(d => d.read).map(d => d.id);
      if (title == 'edit') {
        editPolicy(id, data, listMenuId);
        setIsOpenEdit(false);
      } else {
        addNewPolicy(data, listMenuId);
        setIsOpenEdit(false);
      }
    },
  });
  useEffect(() => {
    if (editingRow.policyId == detailPolicyInfo.policyId) {
      if (title === 'edit') {
        editForm.setFieldValue('policyCode', detailPolicyInfo.policyCode);
      } else {
        editForm.setFieldValue('policyCode', '');
      }
      editForm.setFieldValue('policyName', detailPolicyInfo.policyName);
      if (detailPolicyInfo.status == 'ACTIVE') {
        editForm.setFieldValue('status', true);
      } else editForm.setFieldValue('status', false);
      editForm.setFieldValue('description', detailPolicyInfo.description);
      editForm.setFieldValue('resourceScope', detailPolicyInfo.scopes);
      editForm.setFieldValue('policyId', detailPolicyInfo.policyId);
    }
  }, [detailPolicyInfo]);
  useEffect(() => {
    hashMenu.current = dataMenuDetail.reduce(
      (total, cur) => ({ ...total, [cur.id]: cur }),
      {},
    );
    setListMenu(Object.values(hashMenu.current));
  }, [dataMenuDetail]);
  useEffect(() => {
    loadDetailPolicy(editingRow?.policyId);
    getListMenu(editingRow?.policyId);
  }, []);
  const revertStatus = status => (status ? 'ACTIVE' : 'INACTIVE');

  const revertResourceScope = listResource => {
    const result = [];
    listResource.forEach(rows => {
      const row = rows.scopes;
      row.forEach(el => {
        result.push({
          scope: el,
          resourceCode: rows.resourceCode,
          tenantId: rows.tenantId,
        });
      });
    });
    return result;
  };
  const handleChangeStatus = (e, checked) => {
    if (checked) {
      editForm.setFieldValue('status', true);
    } else editForm.setFieldValue('status', false);
  };
  const addResourceScopes = (checked, code, scope) => {
    const arrResource = [...editForm.values.resourceScope];
    const index = arrResource.findIndex(v => v.resourceCode == code);
    const row = arrResource[index];
    let newVal;
    if (checked) {
      newVal = [...row.scopes, scope];
    } else {
      newVal = row.scopes.filter(v => v != scope);
    }
    const newState = dotProp.set(
      editForm.values.resourceScope,
      `${index}.scopes`,
      newVal,
    );
    editForm.setFieldValue('resourceScope', newState);
  };
  const cellCheckbox = (item, type) => (
    <div style={{ textAlign: 'center' }}>
      <input
        type="checkbox"
        defaultChecked={item.data.scopes.includes(type)}
        onChange={e => {
          addResourceScopes(e.target.checked, item.data.resourceCode, type);
        }}
        disabled={!item.data.allowScopes.includes(type)}
      />
    </div>
  );
  function checkParent(id) {
    const current = hashMenu.current[id];
    if (current.parentId && hashMenu.current[current.parentId]) {
      hashMenu.current = dotProp.set(
        hashMenu.current,
        `${current.parentId}.read`,
        true,
      );
      checkParent(current.parentId);
    }
  }
  function unCheckChild(id) {
    const listChild = dataMenuDetail.filter(d => d.parentId == id);
    if (listChild.length) {
      listChild.forEach(v => {
        hashMenu.current = dotProp.set(hashMenu.current, `${v.id}.read`, false);
        unCheckChild(v.id);
      });
    }
  }
  const addIdsMenu = (checked, id) => {
    hashMenu.current = dotProp.set(hashMenu.current, `${id}.read`, checked);
    if (checked) {
      checkParent(id);
    } else {
      unCheckChild(id);
    }
    const newState = Object.values(hashMenu.current);
    setListMenu(newState);
  };
  const renderCellMenuRead = ({ data }) => (
    <div style={{ textAlign: 'center' }}>
      <input
        type="checkbox"
        checked={data.read}
        onChange={e => {
          addIdsMenu(e.target.checked, data.id);
        }}
      />
    </div>
  );

  return (
    <form onSubmit={editForm.handleSubmit}>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={4}>
            <FormControl
              size="small"
              fullWidth
              error={
                editForm.touched.policyName &&
                Boolean(editForm.errors.policyName)
              }
            >
              <FormLabel required>
                {
                  <FormattedMessage id="app.containers.Policy.columnNamePolicy" />
                }
              </FormLabel>
              <OutlinedInput
                value={editForm.values.policyName}
                margin="dense"
                name="policyName"
                onChange={editForm.handleChange}
                onBlur={editForm.handleBlur}
              />
              <FormHelperText>
                {editForm.touched.policyName && editForm.errors.policyName}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <FormControl
              size="small"
              fullWidth
              error={
                editForm.touched.policyCode &&
                Boolean(editForm.errors.policyCode)
              }
            >
              <FormLabel required>
                {
                  <FormattedMessage id="app.containers.Policy.columnCodePolicy" />
                }
              </FormLabel>
              <OutlinedInput
                value={editForm.values.policyCode}
                margin="dense"
                name="policyCode"
                onChange={editForm.handleChange}
                onBlur={editForm.handleBlur}
              />
              <FormHelperText>
                {editForm.touched.policyCode && editForm.errors.policyCode}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <FormControl size="small">
              <FormLabel>
                {
                  <FormattedMessage id="app.containers.Policy.columnStatusPolicy" />
                }
              </FormLabel>
              <Switch
                checked={editForm.values.status}
                color="primary"
                name="activated"
                onChange={(e, checked) => handleChangeStatus(e, checked)}
              />
            </FormControl>
          </Grid>
        </Grid>
        <FormControl
          size="small"
          margin="dense"
          fullWidth
          error={
            editForm.touched.description && Boolean(editForm.errors.description)
          }
        >
          <FormLabel>
            {
              <FormattedMessage id="app.containers.Policy.columnDescriptionPolicy" />
            }
          </FormLabel>
          <OutlinedInput
            value={editForm.values.description}
            margin="dense"
            name="description"
            onChange={editForm.handleChange}
            onBlur={editForm.handleBlur}
          />
          <FormHelperText>
            {editForm.touched.description && editForm.errors.description}
          </FormHelperText>
        </FormControl>
        <TabContext value={tabIndex}>
          <AppBar position="static" color="default">
            <TabList
              onChange={handleTabChange}
              centered
              indicatorColor="primary"
              textColor="primary"
            >
              <Tab label={intl.formatMessage(messages.function)} value="1" />
              <Tab label={intl.formatMessage(messages.category)} value="2" />
            </TabList>
          </AppBar>
          <TabPanel value="1" style={{ padding: 0 }}>
            <DataGrid
              style={{
                height: '100%',
                maxHeight: '40vh',
              }}
              width="100%"
              dataSource={editForm.values.resourceScope || []}
              showColumnLines={false}
              showBorders
              noDataText="Không có dữ liệu"
              showRowLines
              columnAutoWidth
              rowAlternationEnabled
            >
              <Paging enabled={false} />
              <FilterRow visible />
              <StateStoring
                enabled
                type="localStorage"
                storageKey="policyFunctionTable"
              />
              <Column
                // alignment="center"
                dataField="resourceName"
                caption={intl.formatMessage(messages.columnNameFunction)}
              />
              <Column
                alignment="Tên chức năng"
                dataField="resourceCode"
                caption={intl.formatMessage(messages.columnCodeFunction)}
              />
              <Column
                alignment="center"
                caption={intl.formatMessage(messages.columnListFunction)}
                cellRender={item => cellCheckbox(item, 'list')}
              />
              <Column
                alignment="center"
                caption={intl.formatMessage(messages.columnListDetailFunction)}
                cellRender={item => cellCheckbox(item, 'get')}
              />
              <Column
                alignment="center"
                caption={intl.formatMessage(messages.columnUpdateFunction)}
                cellRender={item => cellCheckbox(item, 'update')}
              />
              <Column
                alignment="center"
                caption={intl.formatMessage(messages.columnCreateFunction)}
                cellRender={item => cellCheckbox(item, 'create')}
              />
              <Column
                alignment="center"
                caption={intl.formatMessage(messages.columnRemoveFunction)}
                cellRender={item => cellCheckbox(item, 'delete')}
              />
            </DataGrid>
          </TabPanel>
          <TabPanel value="2" style={{ padding: 0 }}>
            <TreeList
              style={{
                height: '100%',
                maxHeight: '50vh',
              }}
              dataSource={listMenu}
              showColumnLines={false}
              showBorders
              showRowLines
              columnAutoWidth
              wordWrapEnabled
              keyExpr="id"
              parentIdExpr="parentId"
              // id="tasks"
            >
              <TreeStoring
                enabled
                type="localStorage"
                storageKey="policyTreeMenu"
              />
              <FilterRow visible />
              <Column
                dataField="name"
                caption={intl.formatMessage(messages.columnNameCategory)}
              />
              <Column dataField="description" caption="Mô tả" />
              <Column
                dataField="read"
                alignment="center"
                caption={intl.formatMessage(messages.columnSeeCategory)}
                cellRender={renderCellMenuRead}
                allowSorting={false}
                allowFiltering={false}
              />
            </TreeList>
          </TabPanel>
        </TabContext>
      </DialogContent>
      <DialogActions>
        <Button
          color="default"
          variant="contained"
          onClick={() => setIsOpenEdit(false)}
        >
          {intl.formatMessage(btnMsg.cancel)}
        </Button>
        <Button color="primary" variant="contained" type="submit">
          {intl.formatMessage(btnMsg.save)}
        </Button>
      </DialogActions>
    </form>
  );
}

const mapStateToProps = createStructuredSelector({
  detailPolicyInfo: makeSelectDetailPolicy(),
  dataMenu: makeSelectResource(),
  dataMenuDetail: makeSelectMenuDetail(),
});

function mapDispatchToProps(dispatch) {
  return {
    loadDetailPolicy: id => dispatch(detailPolicy(id)),
    editPolicy: (id, rows, menuId, listUserId) =>
      dispatch(editRow(id, rows, menuId, listUserId)),
    addNewPolicy: (data, menu) => dispatch(addNewRow(data, menu)),
    getListMenu: id => dispatch(getMenuID(id)),
  };
}
const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);
export default compose(withConnect)(EditPolicy);
