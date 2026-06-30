/**
 * ISRA SCHOOL MANAGEMENT PORTAL — Backend (Google Apps Script)
 * Phase 1: Employee Profile Management + Login/Roles + Campus Management
 *
 * SHEETS REQUIRED (exact names, case-sensitive):
 *  - Campuses
 *  - Employees
 *  - Sessions
 *
 * See SETUP_GUIDE.md for column headers and deployment steps.
 */

const SHEET_EMPLOYEES = 'Employees';
const SHEET_CAMPUSES = 'Campuses';
const SHEET_SESSIONS = 'Sessions';
const SESSION_HOURS = 12; // token validity

const ROLES = ['Teacher', 'Principal', 'Director', 'SuperAdmin'];

/* ============== ENTRY POINTS ============== */

function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  let action = '';
  let params = {};
  try {
    if (e.postData && e.postData.contents) {
      params = JSON.parse(e.postData.contents);
    } else {
      params = e.parameter || {};
    }
    action = params.action;

    let result;
    switch (action) {
      case 'login':
        result = login(params.email, params.password);
        break;
      case 'logout':
        result = logout(params.token);
        break;
      case 'getMe':
        result = withAuth(params.token, (emp) => emp);
        break;
      case 'getEmployees':
        result = withAuth(params.token, (emp) => getEmployees(emp));
        break;
      case 'addEmployee':
        result = withAuth(params.token, (emp) => addEmployee(emp, params.data));
        break;
      case 'updateEmployee':
        result = withAuth(params.token, (emp) => updateEmployee(emp, params.data));
        break;
      case 'deleteEmployee':
        result = withAuth(params.token, (emp) => deleteEmployee(emp, params.employeeId));
        break;
      case 'getCampuses':
        result = withAuth(params.token, (emp) => getCampuses());
        break;
      case 'addCampus':
        result = withAuth(params.token, (emp) => addCampus(emp, params.data));
        break;
      case 'updateCampus':
        result = withAuth(params.token, (emp) => updateCampus(emp, params.data));
        break;
      case 'deleteCampus':
        result = withAuth(params.token, (emp) => deleteCampus(emp, params.campusId));
        break;
      default:
        result = { success: false, message: 'Unknown action: ' + action };
    }
    return jsonOut(result);
  } catch (err) {
    return jsonOut({ success: false, message: 'Server error: ' + err.message });
  }
}

function jsonOut(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/* ============== AUTH ============== */

function hashPassword(pw) {
  const raw = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, pw);
  return raw.map(b => ('0' + (b & 0xFF).toString(16)).slice(-2)).join('');
}

function login(email, password) {
  if (!email || !password) return { success: false, message: 'Email aur password required hain.' };
  const sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_EMPLOYEES);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const idx = colIndexer(headers);

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (String(row[idx.Email]).toLowerCase() === String(email).toLowerCase()) {
      if (String(row[idx.Status]) !== 'Active') {
        return { success: false, message: 'Ye account inactive hai. Admin se rabta karein.' };
      }
      if (row[idx.PasswordHash] === hashPassword(password)) {
        const token = Utilities.getUuid();
        const expiresAt = new Date(Date.now() + SESSION_HOURS * 3600 * 1000);
        const sessSheet = SpreadsheetApp.getActive().getSheetByName(SHEET_SESSIONS);
        sessSheet.appendRow([token, row[idx.EmployeeID], expiresAt]);
        return {
          success: true,
          token: token,
          employee: rowToEmployee(headers, row, false)
        };
      } else {
        return { success: false, message: 'Password ghalat hai.' };
      }
    }
  }
  return { success: false, message: 'Is email se koi account nahi mila.' };
}

function logout(token) {
  const sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_SESSIONS);
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === token) {
      sheet.deleteRow(i + 1);
      break;
    }
  }
  return { success: true };
}

function withAuth(token, fn) {
  const emp = getEmployeeByToken(token);
  if (!emp) return { success: false, message: 'Session expire ho gayi. Dobara login karein.', authError: true };
  try {
    const data = fn(emp);
    if (data && typeof data === 'object' && 'success' in data) return data;
    return { success: true, data: data };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

function getEmployeeByToken(token) {
  if (!token) return null;
  const sessSheet = SpreadsheetApp.getActive().getSheetByName(SHEET_SESSIONS);
  const sessData = sessSheet.getDataRange().getValues();
  let employeeId = null;
  for (let i = 1; i < sessData.length; i++) {
    if (sessData[i][0] === token) {
      if (new Date(sessData[i][2]) < new Date()) return null; // expired
      employeeId = sessData[i][1];
      break;
    }
  }
  if (!employeeId) return null;

  const sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_EMPLOYEES);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const idx = colIndexer(headers);
  for (let i = 1; i < data.length; i++) {
    if (data[i][idx.EmployeeID] === employeeId) {
      return rowToEmployee(headers, data[i], true);
    }
  }
  return null;
}

/* ============== HELPERS ============== */

function colIndexer(headers) {
  const idx = {};
  headers.forEach((h, i) => idx[h] = i);
  return idx;
}

// All employee fields except internal-only ones (PasswordHash)
const EMPLOYEE_PUBLIC_FIELDS = [
  'EmployeeID','Name','Email','Role','CampusID','Designation','Phone','CNIC',
  'JoiningDate','Status','Photo','FatherHusbandName','DOB','Gender',
  'PermanentAddress','Qualification','BankName','BankAccountNo',
  'EmergencyContactName','EmergencyContactPhone','BloodGroup'
];

function rowToEmployee(headers, row, includeRole) {
  const idx = colIndexer(headers);
  const obj = {};
  EMPLOYEE_PUBLIC_FIELDS.forEach(f => {
    obj[f] = idx[f] !== undefined ? (row[idx[f]] || '') : '';
  });
  return obj;
}

function nextId(sheet, prefix) {
  const lastRow = sheet.getLastRow();
  return prefix + '-' + (lastRow); // simple incrementing id based on row count
}

/* ============== ROLE PERMISSION CHECKS ============== */

function canManageCampuses(emp) {
  return emp.Role === 'SuperAdmin';
}

function canManageAllEmployees(emp) {
  return emp.Role === 'SuperAdmin' || emp.Role === 'Director';
}

function canManageCampusEmployees(emp, campusId) {
  if (canManageAllEmployees(emp)) return true;
  return emp.Role === 'Principal' && emp.CampusID === campusId;
}

/* ============== EMPLOYEES ============== */

function getEmployees(emp) {
  const sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_EMPLOYEES);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const idx = colIndexer(headers);
  let rows = data.slice(1);

  if (emp.Role === 'SuperAdmin' || emp.Role === 'Director') {
    // all
  } else if (emp.Role === 'Principal') {
    rows = rows.filter(r => r[idx.CampusID] === emp.CampusID);
  } else {
    // Teacher: only self
    rows = rows.filter(r => r[idx.EmployeeID] === emp.EmployeeID);
  }
  return rows.map(r => rowToEmployee(headers, r, true));
}

function addEmployee(emp, dataIn) {
  if (!canManageAllEmployees(emp) && !(emp.Role === 'Principal' && dataIn.CampusID === emp.CampusID)) {
    return { success: false, message: 'Aapko employee add karne ki ijazat nahi hai.' };
  }
  if (!ROLES.includes(dataIn.Role)) return { success: false, message: 'Invalid role.' };
  if (emp.Role === 'Principal' && dataIn.Role !== 'Teacher') {
    return { success: false, message: 'Principal sirf Teacher add kar sakta hai.' };
  }

  const sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_EMPLOYEES);
  const headers = sheet.getDataRange().getValues()[0];
  const idx = colIndexer(headers);

  const allRows = sheet.getDataRange().getValues();
  for (let i = 1; i < allRows.length; i++) {
    if (String(allRows[i][idx.Email]).toLowerCase() === String(dataIn.Email).toLowerCase()) {
      return { success: false, message: 'Ye email pehle se register hai.' };
    }
  }

  const newId = 'EMP-' + Utilities.getUuid().substring(0, 8).toUpperCase();
  const tempPassword = dataIn.Password || 'Isra@123';

  const newRow = [];
  headers.forEach(h => {
    switch (h) {
      case 'EmployeeID': newRow.push(newId); break;
      case 'PasswordHash': newRow.push(hashPassword(tempPassword)); break;
      case 'Status': newRow.push('Active'); break;
      default: newRow.push(dataIn[h] !== undefined ? dataIn[h] : '');
    }
  });
  sheet.appendRow(newRow);
  return { success: true, message: 'Employee add ho gaya.', employeeId: newId, tempPassword: tempPassword };
}

function updateEmployee(emp, dataIn) {
  const sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_EMPLOYEES);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const idx = colIndexer(headers);

  for (let i = 1; i < data.length; i++) {
    if (data[i][idx.EmployeeID] === dataIn.EmployeeID) {
      const targetCampus = data[i][idx.CampusID];
      const isSelf = emp.EmployeeID === dataIn.EmployeeID;

      if (!canManageAllEmployees(emp) && !canManageCampusEmployees(emp, targetCampus) && !isSelf) {
        return { success: false, message: 'Aapko is employee ko edit karne ki ijazat nahi hai.' };
      }
      // Self (Teacher) can only edit limited fields
      const editableBySelf = ['Phone', 'Photo', 'FatherHusbandName', 'DOB', 'Gender',
        'PermanentAddress', 'Qualification', 'BankName', 'BankAccountNo',
        'EmergencyContactName', 'EmergencyContactPhone', 'BloodGroup'];
      const editableFields = (isSelf && !canManageAllEmployees(emp) && emp.Role !== 'Principal')
        ? editableBySelf
        : Object.keys(dataIn);

      editableFields.forEach(field => {
        if (idx[field] !== undefined && dataIn[field] !== undefined && field !== 'EmployeeID') {
          sheet.getRange(i + 1, idx[field] + 1).setValue(dataIn[field]);
        }
      });
      if (dataIn.NewPassword) {
        sheet.getRange(i + 1, idx.PasswordHash + 1).setValue(hashPassword(dataIn.NewPassword));
      }
      return { success: true, message: 'Profile update ho gayi.' };
    }
  }
  return { success: false, message: 'Employee nahi mila.' };
}

function deleteEmployee(emp, employeeId) {
  if (!canManageAllEmployees(emp)) return { success: false, message: 'Sirf Director/SuperAdmin delete kar sakte hain.' };
  const sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_EMPLOYEES);
  const data = sheet.getDataRange().getValues();
  const idx = colIndexer(data[0]);
  for (let i = 1; i < data.length; i++) {
    if (data[i][idx.EmployeeID] === employeeId) {
      sheet.getRange(i + 1, idx.Status + 1).setValue('Inactive'); // soft delete
      return { success: true, message: 'Employee deactivate kar diya gaya.' };
    }
  }
  return { success: false, message: 'Employee nahi mila.' };
}

/* ============== CAMPUSES ============== */

function getCampuses() {
  const sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_CAMPUSES);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const idx = colIndexer(headers);
  return data.slice(1).map(r => ({
    CampusID: r[idx.CampusID],
    CampusName: r[idx.CampusName],
    CampusType: r[idx.CampusType],
    Address: r[idx.Address],
    Latitude: r[idx.Latitude],
    Longitude: r[idx.Longitude],
    RadiusMeters: r[idx.RadiusMeters],
    Status: r[idx.Status]
  }));
}

function addCampus(emp, dataIn) {
  if (!canManageCampuses(emp)) return { success: false, message: 'Sirf Super Admin campus add kar sakta hai.' };
  const sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_CAMPUSES);
  const headers = sheet.getDataRange().getValues()[0];
  const newId = 'CAM-' + Utilities.getUuid().substring(0, 6).toUpperCase();
  const newRow = headers.map(h => {
    if (h === 'CampusID') return newId;
    if (h === 'Status') return 'Active';
    return dataIn[h] !== undefined ? dataIn[h] : '';
  });
  sheet.appendRow(newRow);
  return { success: true, message: 'Campus add ho gaya.', campusId: newId };
}

function updateCampus(emp, dataIn) {
  if (!canManageCampuses(emp)) return { success: false, message: 'Sirf Super Admin campus edit kar sakta hai.' };
  const sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_CAMPUSES);
  const data = sheet.getDataRange().getValues();
  const idx = colIndexer(data[0]);
  for (let i = 1; i < data.length; i++) {
    if (data[i][idx.CampusID] === dataIn.CampusID) {
      Object.keys(dataIn).forEach(field => {
        if (idx[field] !== undefined && field !== 'CampusID') {
          sheet.getRange(i + 1, idx[field] + 1).setValue(dataIn[field]);
        }
      });
      return { success: true, message: 'Campus update ho gayi.' };
    }
  }
  return { success: false, message: 'Campus nahi mila.' };
}

function deleteCampus(emp, campusId) {
  if (!canManageCampuses(emp)) return { success: false, message: 'Sirf Super Admin campus deactivate kar sakta hai.' };
  const sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_CAMPUSES);
  const data = sheet.getDataRange().getValues();
  const idx = colIndexer(data[0]);
  for (let i = 1; i < data.length; i++) {
    if (data[i][idx.CampusID] === campusId) {
      sheet.getRange(i + 1, idx.Status + 1).setValue('Inactive');
      return { success: true, message: 'Campus deactivate kar diya gaya.' };
    }
  }
  return { success: false, message: 'Campus nahi mila.' };
}

/* ============== ONE-TIME SETUP HELPER ==============
 * Run this function ONCE manually from the Apps Script editor
 * (select "createFirstSuperAdmin" in the function dropdown, then Run)
 * to create your first login. Change the values below first.
 */
/* ============== DIAGNOSTIC HELPER ==============
 * Run this function to check if your sheet tabs are named correctly.
 * Select "checkSetup" in the function dropdown, click Run, then
 * View > Logs (or Ctrl+Enter) to see the result.
 */
function checkSetup() {
  const ss = SpreadsheetApp.getActive();
  if (!ss) {
    Logger.log('PROBLEM: No active spreadsheet found. Make sure this script was opened via Extensions > Apps Script FROM INSIDE the Google Sheet.');
    return;
  }
  Logger.log('Connected to spreadsheet: ' + ss.getName());
  const allSheetNames = ss.getSheets().map(s => s.getName());
  Logger.log('Tabs found in this spreadsheet: ' + JSON.stringify(allSheetNames));

  [SHEET_EMPLOYEES, SHEET_CAMPUSES, SHEET_SESSIONS].forEach(name => {
    const sh = ss.getSheetByName(name);
    if (sh) {
      Logger.log('OK -> "' + name + '" tab found.');
    } else {
      Logger.log('MISSING -> "' + name + '" tab NOT found. Check spelling/capitalization exactly.');
    }
  });
}

function createFirstSuperAdmin() {
  const sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_EMPLOYEES);
  const headers = sheet.getDataRange().getValues()[0];
  const idx = colIndexer(headers);

  const name = 'Ali (Super Admin)';
  const email = 'admin@isra.edu.pk'; // <-- change this
  const password = 'Admin@123';      // <-- change this, then re-run if needed

  const newRow = headers.map(h => {
    switch (h) {
      case 'EmployeeID': return 'EMP-SUPERADMIN';
      case 'Name': return name;
      case 'Email': return email;
      case 'PasswordHash': return hashPassword(password);
      case 'Role': return 'SuperAdmin';
      case 'Status': return 'Active';
      default: return '';
    }
  });
  sheet.appendRow(newRow);
  Logger.log('Super Admin created: ' + email + ' / ' + password);
}