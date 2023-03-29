/*
 * User Messages
 *
 * This contains all the text for the User container.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.containers.User';

export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: 'List User',
  },
  fileEmpty: {
    id: `${scope}.fileEmpty`,
    defaultMessage: 'File upload not empty!',
  },
  importUser: {
    id: `${scope}.importUser`,
    defaultMessage: 'Cập nhật',
  },
  exportUser: {
    id: `${scope}.exportUser`,
    defaultMessage: 'Export user',
  },
  importUserTitle: {
    id: `${scope}.importUserTitle`,
    defaultMessage: 'Update user',
  },
  cancelAddNewUser: {
    id: `${scope}.cancelAddNewUser`,
    defaultMessage: 'Cancel add new user',
  },
  cancelUpdateUser: {
    id: `${scope}.cancelUpdateUser`,
    defaultMessage: 'Cancel update user',
  },
  informationNoChange: {
    id: `${scope}.informationNoChange`,
    defaultMessage: 'Information no change',
  },
  deleteSuccess: {
    id: `${scope}.deleteSuccess`,
    defaultMessage: 'Delete success',
  },
  importUserContent: {
    id: `${scope}.importUserContent`,
    defaultMessage: 'Click to download Excel file and import user list',
  },
  sampleData: {
    id: `${scope}.sampleData`,
    defaultMessage: 'Sample data',
  },
  importUserContent2: {
    id: `${scope}.importUserContent2`,
    defaultMessage:
      'The system will compare the data you upload to add update users to the system. This means you have to prepare a data template for the employee you want to update. Download sample data here:',
  },
  addUser: {
    id: `${scope}.addUser`,
    defaultMessage: 'Add account (Local)',
  },
  createUser: {
    id: `${scope}.createUser`,
    defaultMessage: 'Add new system users (Local)',
  },
  accessCode: {
    id: `${scope}.accessCode`,
    defaultMessage: 'Access code',
  },
  titleOptionsExt: {
    id: `${scope}.titleOptionsExt`,
    defaultMessage: 'Customize your account validity period',
  },
  option: {
    id: `${scope}.option`,
    defaultMessage: 'Option',
  },
  unknown: {
    id: `${scope}.unknown`,
    defaultMessage: 'Unknown',
  },
  btnChoose: {
    id: `${scope}.btnChoose`,
    defaultMessage: 'Choose',
  },
  btnNo: {
    id: `${scope}.btnNo`,
    defaultMessage: 'No',
  },
  accountLocal: {
    id: `${scope}.accountLocal`,
    defaultMessage: 'System account (Local)',
  },
  accountVin3S: {
    id: `${scope}.accountVin3S`,
    defaultMessage: 'Account Vin3S',
  },
  accountLDAP: {
    id: `${scope}.accountLDAP`,
    defaultMessage: 'Account LDAP',
  },
  startTime: {
    id: `${scope}.startTime`,
    defaultMessage: 'Start time',
  },
  fingerprint: {
    id: `${scope}.fingerprint`,
    defaultMessage: 'Fingerprint',
  },
  card: {
    id: `${scope}.card`,
    defaultMessage: 'Card',
  },
  face: {
    id: `${scope}.face`,
    defaultMessage: 'Face',
  },
  addRoleUser: {
    id: `${scope}.addRoleUser`,
    defaultMessage: 'Add role user',
  },
  deleteRoleUser: {
    id: `${scope}.deleteRoleUser`,
    defaultMessage: 'Delete role user',
  },
  descriptionRole: {
    id: `${scope}.descriptionRole`,
    defaultMessage: 'Description role',
  },
  noDescription: {
    id: `${scope}.noDescription`,
    defaultMessage: 'No description',
  },
  availableSoon: {
    id: `${scope}.availableSoon`,
    defaultMessage: '(Available soon)',
  },
  role: {
    id: `${scope}.role`,
    defaultMessage: 'Role',
  },
  codeRole: {
    id: `${scope}.codeRole`,
    defaultMessage: 'Role Code',
  },
  addRole: {
    id: `${scope}.addRole`,
    defaultMessage: 'Add Role',
  },
  nameRole: {
    id: `${scope}.nameRole`,
    defaultMessage: 'Role Name',
  },
  endTime: {
    id: `${scope}.endTime`,
    defaultMessage: 'End time',
  },
  typeAccount: {
    id: `${scope}.typeAccount`,
    defaultMessage: 'Type account',
  },
  validatePassword: {
    id: `${scope}.validatePassword`,
    defaultMessage:
      'Minimum 8 characters, including numbers, lowercase letters, uppercase letters and special characters',
  },
  validatePhone: {
    id: `${scope}.validatePhone`,
    defaultMessage: 'Phone number not correct format',
  },
  validateAccount: {
    id: `${scope}.validateAccount`,
    defaultMessage:
      'Account is unique, including alphanumeric, 3-20 characters, no special characters',
  },
  validateEmployeeCode: {
    id: `${scope}.validateEmployeeCode`,
    defaultMessage: 'Employee code not empty and not character special',
  },
  validateFullName: {
    id: `${scope}.validateFullName`,
    defaultMessage:
      'Full name including alphanumeric, 3-100 characters, no special characters',
  },
  validateEmail: {
    id: `${scope}.validateEmail`,
    defaultMessage: 'Email not correct format',
  },
  deleteUserSuccess: {
    id: `${scope}.deleteUserSuccess`,
    defaultMessage: 'Delete user success',
  },
  updateUserSuccess: {
    id: `${scope}.updateUserSuccess`,
    defaultMessage: 'Update user success',
  },
  deleteUserError: {
    id: `${scope}.deleteUserError`,
    defaultMessage: 'Delete user failed',
  },
  updateUserError: {
    id: `${scope}.updateUserError`,
    defaultMessage: 'Update user failed',
  },
  partTimeUnit: {
    id: `${scope}.partTimeUnit`,
    defaultMessage: 'Part-time Unit',
  },
  deleteTitleTimeUnit: {
    id: `${scope}.deleteTitleTimeUnit`,
    defaultMessage: 'Delete Part-time Unit User',
  },
  deleteTimeUnit: {
    id: `${scope}.deleteTimeUnit`,
    defaultMessage: 'This Part-time Unit will be delete and can not restore',
  },
  addPartTimeUnit: {
    id: `${scope}.addPartTimeUnit`,
    defaultMessage: 'Add Part-time Unit',
  },
  editPartTimeUnit: {
    id: `${scope}.editPartTimeUnit`,
    defaultMessage: 'Edit Part-time Unit',
  },
  identifyCard: {
    id: `${scope}.identifyCard`,
    defaultMessage: 'Identify Card',
  },
  unitCode: {
    id: `${scope}.unitCode`,
    defaultMessage: 'Unit Code',
  },
  unitName: {
    id: `${scope}.unitName`,
    defaultMessage: 'Unit Name',
  },
  identificationInformation: {
    id: `${scope}.identificationInformation`,
    defaultMessage: 'Identification Information',
  },
  addIdentificationInformation: {
    id: `${scope}.addIdentificationInformation`,
    defaultMessage: 'Add Identification Information',
  },
  deleteCard: {
    id: `${scope}.deleteCard`,
    defaultMessage: 'Delete Card',
  },
  deleteIdentificationInformation: {
    id: `${scope}.deleteIdentificationInformation`,
    defaultMessage: 'Delete Identification User',
  },
  deleteContentIdentificationInformation: {
    id: `${scope}.deleteContentIdentificationInformation`,
    defaultMessage: 'This Identification will be delete and can not restore',
  },
  methodIdentify: {
    id: `${scope}.methodIdentify`,
    defaultMessage: 'Method',
  },
  chooseMethodIdentify: {
    id: `${scope}.chooseMethodIdentify`,
    defaultMessage: 'Choose method identify',
  },
  updatedDateIdentify: {
    id: `${scope}.updatedDateIdentify`,
    defaultMessage: 'Updated Date',
  },
  statusIdentify: {
    id: `${scope}.statusIdentify`,
    defaultMessage: 'Status Identify',
  },
  parkingInformation: {
    id: `${scope}.parkingInformation`,
    defaultMessage: 'Parking Information',
  },
  addParkingInformation: {
    id: `${scope}.addParkingInformation`,
    defaultMessage: 'Add Parking Information',
  },
  editParkingInformation: {
    id: `${scope}.editParkingInformation`,
    defaultMessage: 'Edit Parking Information',
  },
  deleteParkingInformation: {
    id: `${scope}.deleteParkingInformation`,
    defaultMessage: 'Xóa đăng ký xe của người dùng?',
  },
  deleteContentParkingInformation: {
    id: `${scope}.deleteContentParkingInformation`,
    defaultMessage:
      'This Parking Information will be delete and can not restore',
  },
  vehicleCardCode: {
    id: `${scope}.vehicleCardCode`,
    defaultMessage: 'Vehicle Card Code',
  },
  carName: {
    id: `${scope}.carName`,
    defaultMessage: 'Car Name',
  },
  carType: {
    id: `${scope}.carType`,
    defaultMessage: 'Car Type',
  },
  licensePlate: {
    id: `${scope}.licensePlate`,
    defaultMessage: 'License Plate',
  },
  editUser: {
    id: `${scope}.editUser`,
    defaultMessage: 'Edit User',
  },
  infoUser: {
    id: `${scope}.infoUser`,
    defaultMessage: 'Info User',
  },
  profile: {
    id: `${scope}.profile`,
    defaultMessage: 'Profile',
  },
  information: {
    id: `${scope}.information`,
    defaultMessage: 'Information',
  },
  roles: {
    id: `${scope}.roles`,
    defaultMessage: 'Roles',
  },
  deleteUser: {
    id: `${scope}.deleteUser`,
    defaultMessage: 'Delete User',
  },
  deleteUserByName: {
    id: `${scope}.deleteUserByName`,
    defaultMessage: 'User {fullName} will delete and can not restore',
  },
  leadershipUnit: {
    id: `${scope}.leadershipUnit`,
    defaultMessage: 'Leadership Unit',
  },
  landlinePhone: {
    id: `${scope}.landlinePhone`,
    defaultMessage: 'Landline Phone',
  },
  updateStatusTitle: {
    id: `${scope}.updateStatusTitle`,
    defaultMessage: 'Update status',
  },
  updateStatus: {
    id: `${scope}.updateStatus`,
    defaultMessage: 'User {username} will be change status',
  },
  change: {
    id: `${scope}.change`,
    defaultMessage: 'Change',
  },
  exportListUsers: {
    id: `${scope}.exportListUsers`,
    defaultMessage: 'Export List Users',
  },
  chooseMethodExport: {
    id: `${scope}.chooseMethodExport`,
    defaultMessage: 'Choose a method to export data:',
  },
  cardNumber: {
    id: `${scope}.cardNumber`,
    defaultMessage: 'Enter card number',
  },
  identify: {
    id: `${scope}.identify`,
    defaultMessage: 'Identify',
  },
  verify: {
    id: `${scope}.verify`,
    defaultMessage: 'Verify',
  },
  groupAccess: {
    id: `${scope}.groupAccess`,
    defaultMessage: 'Group Access',
  },
  positionWork: {
    id: `${scope}.positionWork`,
    defaultMessage: 'Position Work',
  },
  fileExcel: {
    id: `${scope}.fileExcel`,
    defaultMessage: 'File Excel',
  },
  fileData: {
    id: `${scope}.fileData`,
    defaultMessage: 'File Database',
  },
  save: {
    id: `${scope}.save`,
    defaultMessage: 'Save',
  },
  filter: {
    id: `${scope}.filter`,
    defaultMessage: 'Filter',
  },
  resultFilter: {
    id: `${scope}.resultFilter`,
    defaultMessage: 'Filter result',
  },
  btnOK: {
    id: `${scope}.btnOK`,
    defaultMessage: 'OK',
  },
  btnAdd: {
    id: `${scope}.btnAdd`,
    defaultMessage: 'Add',
  },
  formatDataErr: {
    id: `${scope}.formatDataErr`,
    defaultMessage: 'The data format is incorrect. Please try again!',
  },
  btnEdit: {
    id: `${scope}.btnEdit`,
    defaultMessage: 'Edit',
  },
  btnFilter: {
    id: `${scope}.btnFilter`,
    defaultMessage: 'Filter',
  },
  btnCancel: {
    id: `${scope}.btnCancel`,
    defaultMessage: 'Cancel',
  },
  unit: {
    id: `${scope}.unit`,
    defaultMessage: 'Unit',
  },
  name: {
    id: `${scope}.name`,
    defaultMessage: 'Name',
  },
  email: {
    id: `${scope}.email`,
    defaultMessage: 'Email',
  },
  empCode: {
    id: `${scope}.empCode`,
    defaultMessage: 'MSNV',
  },
  phoneNumber: {
    id: `${scope}.phoneNumber`,
    defaultMessage: 'Phone',
  },
  position: {
    id: `${scope}.position`,
    defaultMessage: 'Position',
  },
  authority: {
    id: `${scope}.authority`,
    defaultMessage: 'Role',
  },
  status: {
    id: `${scope}.status`,
    defaultMessage: 'Status',
  },
  mnv: {
    id: `${scope}.mnv`,
    defaultMessage: 'Employee code',
  },
  account: {
    id: `${scope}.account`,
    defaultMessage: 'Account',
  },
  fullName: {
    id: `${scope}.fullName`,
    defaultMessage: 'Full name',
  },
  password: {
    id: `${scope}.password`,
    defaultMessage: 'Password',
  },
  confirmPassword: {
    id: `${scope}.confirmPassword`,
    defaultMessage: 'Confirm password',
  },
  phone: {
    id: `${scope}.phone`,
    defaultMessage: 'Phone',
  },
  phoneOn: {
    id: `${scope}.phoneOn`,
    defaultMessage: 'Landline phone',
  },
  ext: {
    id: `${scope}.ext`,
    defaultMessage: 'Ext',
  },
  expAccount: {
    id: `${scope}.expAccount`,
    defaultMessage: 'Term of account',
  },
  isLanhDaoDonVi: {
    id: `${scope}.isLanhDaoDonVi`,
    defaultMessage: 'Leadership unit',
  },
  und: {
    id: `${scope}.und`,
    defaultMessage: 'Unknown',
  },
  active: {
    id: `${scope}.active`,
    defaultMessage: 'Active',
  },
  deActive: {
    id: `${scope}.deActive`,
    defaultMessage: 'In active',
  },
  authorityCode: {
    id: `${scope}.authority.code`,
    defaultMessage: 'Code',
  },
  authorityPlaceholder: {
    id: `${scope}.authority.placeholder`,
    defaultMessage: 'Choose role',
  },
  orgUnitPlaceholder: {
    id: `${scope}.org.unit.placeholder`,
    defaultMessage: 'Choose organization unit',
  },
  positionPlaceholder: {
    id: `${scope}.position.placeholder`,
    defaultMessage: 'Choose position',
  },
});
