// ================================================================
//  ISRA SCHOOL PORTAL — Google Apps Script Backend
//  File: Code.gs
//
//  SETUP:
//  1. script.google.com → New project → naam dein "IsraPortalBackend"
//  2. Yeh poora code paste karein
//  3. SPREADSHEET_ID neeche apna Google Sheet ID se replace karein
//  4. initializeSheets() ek baar chalayein (Run menu → initializeSheets)
//  5. Deploy → New Deployment → Web App
//     Execute as: Me | Access: Anyone
//  6. Deploy karein → URL copy karein → config.js mein paste karein
// ================================================================

// ── YOUR GOOGLE SHEET ID ─────────────────────────────────────
// Sheet URL: https://docs.google.com/spreadsheets/d/XXXX_ID_XXXX/edit
// Wohi XXXX_ID_XXXX hissa yahan paste karein:
const SPREADSHEET_ID = "PASTE_YOUR_GOOGLE_SHEET_ID_HERE";

// ── Email addresses for notifications ────────────────────────
const DIRECTOR_EMAIL  = "director@isra.edu.pk";
const PRINCIPAL_EMAIL = "principal@isra.edu.pk"; // dynamic hoga production mein

// ── Sheet name constants ──────────────────────────────────────
const SH = {
  EMPLOYEES:  "Employees",
  LEAVES:     "Leaves",
  ATTENDANCE: "Attendance",
  CAMPUSES:   "Campuses",
  PAYROLL:    "Payroll",
  HOLIDAYS:   "Holidays",
  USERS:      "Users",
};

// ================================================================
//  ENTRY POINTS  (GET + POST)
// ================================================================

function doGet(e) {
  const action = e.parameter.action || "";
  const params = e.parameter;
  let result;

  try {
    switch (action) {
      case "getEmployees":     result = getEmployees(params);           break;
      case "getEmployee":      result = getEmployee(params.empId);      break;
      case "getLeaveRequests": result = getLeaveRequests(params);       break;
      case "getLeaveBalance":  result = getLeaveBalance(params.empId);  break;
      case "getTodayAttendance": result = getTodayAttendance(params.campusId); break;
      case "getAttendanceHistory": result = getAttendanceHistory(params.empId, params.month); break;
      case "getCampuses":      result = getCampuses();                  break;
      case "getPayrollSummary": result = getPayrollSummary(params.month); break;
      case "getPaySlip":       result = getPaySlip(params.empId, params.month); break;
      case "getHolidays":      result = getHolidays(params.year);      break;
      case "getAttendanceTrend": result = getAttendanceTrend();        break;
      case "getLeaveTrend":    result = getLeaveTrend();               break;
      case "getDeptSplit":     result = getDeptSplit();                break;
      default:                 result = { error: "Unknown action: " + action };
    }
  } catch (err) {
    result = { error: err.message };
  }

  return jsonResponse({ data: result });
}

function doPost(e) {
  const body   = JSON.parse(e.postData.contents || "{}");
  const action = body.action || "";
  let result;

  try {
    switch (action) {
      case "loginUser":         result = loginUser(body.email, body.password);          break;
      case "addEmployee":       result = addEmployee(body);                              break;
      case "updateEmployee":    result = updateEmployee(body.empId, body);               break;
      case "submitLeave":       result = submitLeave(body);                              break;
      case "approveLeave":      result = approveLeave(body.leaveId, body.approverRole, body.comment); break;
      case "rejectLeave":       result = rejectLeave(body.leaveId, body.approverRole, body.comment);  break;
      case "checkIn":           result = checkIn(body.empId, body.campusId, body.lat, body.lng);      break;
      case "checkOut":          result = checkOut(body.empId, body.campusId, body.lat, body.lng);     break;
      case "saveCampus":        result = saveCampus(body);                               break;
      case "toggleCampusStatus": result = toggleCampusStatus(body.campusId, body.active); break;
      case "runPayroll":        result = runPayroll(body.month, body.campusId);          break;
      case "addHoliday":        result = addHoliday(body);                               break;
      default:                  result = { error: "Unknown action: " + action };
    }
  } catch (err) {
    result = { error: err.message };
  }

  return jsonResponse({ data: result });
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// ================================================================
//  SHEET HELPER UTILITIES
// ================================================================

function getSheet(name) {
  return SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(name);
}

function sheetToObjects(sheetName) {
  const sh   = getSheet(sheetName);
  const data = sh.getDataRange().getValues();
  if (data.length < 2) return [];
  const headers = data[0];
  return data.slice(1).map((row) => {
    const obj = {};
    headers.forEach((h, i) => { obj[h] = row[i]; });
    return obj;
  });
}

function appendRow(sheetName, rowObj) {
  const sh      = getSheet(sheetName);
  const headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
  const row     = headers.map((h) => rowObj[h] !== undefined ? rowObj[h] : "");
  sh.appendRow(row);
}

function updateRowById(sheetName, idField, idValue, updates) {
  const sh      = getSheet(sheetName);
  const data    = sh.getDataRange().getValues();
  const headers = data[0];
  const idCol   = headers.indexOf(idField);
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][idCol]) === String(idValue)) {
      Object.entries(updates).forEach(([k, v]) => {
        const col = headers.indexOf(k);
        if (col >= 0) sh.getRange(i + 1, col + 1).setValue(v);
      });
      return true;
    }
  }
  return false;
}

function findRowById(sheetName, idField, idValue) {
  return sheetToObjects(sheetName).find((r) => String(r[idField]) === String(idValue)) || null;
}

function generateId(prefix) {
  return prefix + "-" + Date.now();
}

function nowPK() {
  return Utilities.formatDate(new Date(), "Asia/Karachi", "yyyy-MM-dd HH:mm:ss");
}

function todayPK() {
  return Utilities.formatDate(new Date(), "Asia/Karachi", "yyyy-MM-dd");
}

function timePK() {
  return Utilities.formatDate(new Date(), "Asia/Karachi", "HH:mm");
}

// ================================================================
//  EMPLOYEES
// ================================================================

function getEmployees(filters) {
  let list = sheetToObjects(SH.EMPLOYEES);
  if (filters.campus) list = list.filter((e) => e.campus === filters.campus);
  if (filters.dept)   list = list.filter((e) => e.dept   === filters.dept);
  if (filters.status) list = list.filter((e) => e.status === filters.status);
  return list;
}

function getEmployee(empId) {
  return findRowById(SH.EMPLOYEES, "id", empId);
}

function addEmployee(data) {
  const id = generateId("EMP");
  appendRow(SH.EMPLOYEES, { id, ...data, createdAt: nowPK() });
  return { success: true, id };
}

function updateEmployee(empId, data) {
  const ok = updateRowById(SH.EMPLOYEES, "id", empId, data);
  return { success: ok };
}

// ================================================================
//  LEAVE MANAGEMENT
// ================================================================

function getLeaveRequests(filters) {
  let list = sheetToObjects(SH.LEAVES);
  if (filters.status) list = list.filter((l) => l.status === filters.status);
  if (filters.empId)  list = list.filter((l) => l.empId  === filters.empId);
  if (filters.campus) list = list.filter((l) => l.campus === filters.campus);
  return list;
}

function submitLeave(data) {
  const id = generateId("LV");
  const leave = {
    id,
    empId:    data.empId,
    employee: data.employee,
    campus:   data.campus,
    type:     data.type,
    from:     data.from,
    to:       data.to,
    days:     data.days,
    reason:   data.reason,
    status:   "Pending",
    stage:    "Principal",
    appliedAt: nowPK(),
    principalComment: "",
    directorComment:  "",
  };
  appendRow(SH.LEAVES, leave);

  // Notify Principal
  const principal = getPrincipalForCampus(data.campus);
  if (principal && principal.email) {
    sendEmail(
      principal.email,
      `Leave Request: ${data.employee} [${data.type}]`,
      `Dear ${principal.name},\n\n${data.employee} has applied for ${data.type} from ${data.from} to ${data.to} (${data.days} day(s)).\nReason: ${data.reason}\n\nPlease review in the Isra School Portal.\n\nIsra School System`
    );
  }

  return { success: true, id };
}

function approveLeave(leaveId, approverRole, comment) {
  const leave = findRowById(SH.LEAVES, "id", leaveId);
  if (!leave) return { success: false, error: "Leave not found" };

  let updates = {};
  if (approverRole === "Principal") {
    updates = { stage: "Director", principalComment: comment };
    sendEmail(
      DIRECTOR_EMAIL,
      `Leave Pending Final Approval: ${leave.employee} [${leave.type}]`,
      `Dear Director,\n\nPrincipal has approved the leave for ${leave.employee}.\nType: ${leave.type} | Dates: ${leave.from} → ${leave.to}\n\nPlease give final approval in the Isra School Portal.\n\nIsra School System`
    );
  } else if (approverRole === "Director Schools" || approverRole === "Super Admin") {
    updates = { status: "Approved", directorComment: comment };
    updateLeaveBalance(leave.empId, leave.type, Number(leave.days));
    notifyEmployee(leave.empId, `Your ${leave.type} from ${leave.from} to ${leave.to} has been APPROVED.`);
  }

  updateRowById(SH.LEAVES, "id", leaveId, updates);
  return { success: true };
}

function rejectLeave(leaveId, approverRole, comment) {
  const leave = findRowById(SH.LEAVES, "id", leaveId);
  if (!leave) return { success: false, error: "Leave not found" };

  const updates = {
    status: "Rejected",
    [`${approverRole === "Principal" ? "principal" : "director"}Comment`]: comment,
  };
  updateRowById(SH.LEAVES, "id", leaveId, updates);
  notifyEmployee(leave.empId, `Your ${leave.type} from ${leave.from} to ${leave.to} has been REJECTED. Reason: ${comment}`);
  return { success: true };
}

function getLeaveBalance(empId) {
  // Returns balance from Employees sheet (stored as JSON column)
  const emp = findRowById(SH.EMPLOYEES, "id", empId);
  if (!emp || !emp.leaveBalance) return [];
  try { return JSON.parse(emp.leaveBalance); } catch { return []; }
}

function updateLeaveBalance(empId, type, daysUsed) {
  const emp = findRowById(SH.EMPLOYEES, "id", empId);
  if (!emp) return;
  let bal = [];
  try { bal = JSON.parse(emp.leaveBalance || "[]"); } catch { bal = []; }
  const idx = bal.findIndex((b) => b.type === type);
  if (idx >= 0) { bal[idx].used += daysUsed; bal[idx].balance -= daysUsed; }
  updateRowById(SH.EMPLOYEES, "id", empId, { leaveBalance: JSON.stringify(bal) });
}

// ================================================================
//  ATTENDANCE
// ================================================================

function getTodayAttendance(campusId) {
  const today = todayPK();
  let list = sheetToObjects(SH.ATTENDANCE).filter((a) => a.date === today);
  if (campusId) list = list.filter((a) => a.campusId === campusId);
  return list;
}

function checkIn(empId, campusId, lat, lng) {
  const campus = findRowById(SH.CAMPUSES, "id", campusId);
  const geoOk  = campus ? isWithinFence(lat, lng, campus.lat, campus.lng, Number(campus.radius)) : false;

  const timeNow = timePK();
  const late    = timeNow > "08:15";  // 8:15 AM cutoff
  const id      = generateId("ATT");

  const existing = sheetToObjects(SH.ATTENDANCE).find((a) => a.empId === empId && a.date === todayPK());
  if (existing) return { success: false, error: "Already checked in today" };

  appendRow(SH.ATTENDANCE, {
    id, empId, campusId, date: todayPK(),
    checkIn: timeNow, checkOut: "",
    geoStatus: geoOk ? "Verified" : "Outside Fence",
    status: geoOk ? (late ? "Late" : "Present") : "Geo-Failed",
    late, createdAt: nowPK(),
  });

  return { success: true, time: timeNow, geoStatus: geoOk ? "Verified" : "Outside Fence", late };
}

function checkOut(empId, campusId, lat, lng) {
  const today = todayPK();
  const sh    = getSheet(SH.ATTENDANCE);
  const data  = sh.getDataRange().getValues();
  const heads = data[0];
  const empCol  = heads.indexOf("empId");
  const dateCol = heads.indexOf("date");
  const outCol  = heads.indexOf("checkOut");
  const time    = timePK();

  for (let i = 1; i < data.length; i++) {
    if (data[i][empCol] === empId && data[i][dateCol] === today) {
      sh.getRange(i + 1, outCol + 1).setValue(time);
      return { success: true, time };
    }
  }
  return { success: false, error: "No check-in found for today" };
}

function getAttendanceHistory(empId, month) {
  let list = sheetToObjects(SH.ATTENDANCE);
  if (empId)  list = list.filter((a) => a.empId === empId);
  if (month)  list = list.filter((a) => a.date.startsWith(month));
  return list;
}

// ── Geo-fence distance check (Haversine) ─────────────────────
function isWithinFence(lat1, lng1, lat2, lng2, radiusMetres) {
  const R  = 6371000;
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = Number(lat2) * Math.PI / 180;
  const Δφ = (Number(lat2) - lat1) * Math.PI / 180;
  const Δλ = (Number(lng2) - lng1) * Math.PI / 180;
  const a  = Math.sin(Δφ/2)**2 + Math.cos(φ1)*Math.cos(φ2)*Math.sin(Δλ/2)**2;
  const d  = 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return d <= (radiusMetres + 50); // 50m buffer
}

// ================================================================
//  CAMPUSES
// ================================================================

function getCampuses() {
  return sheetToObjects(SH.CAMPUSES);
}

function saveCampus(data) {
  if (data.id) {
    updateRowById(SH.CAMPUSES, "id", data.id, data);
    return { success: true };
  }
  const id = generateId("CAM");
  appendRow(SH.CAMPUSES, { id, ...data, active: true, createdAt: nowPK() });
  return { success: true, id };
}

function toggleCampusStatus(campusId, active) {
  updateRowById(SH.CAMPUSES, "id", campusId, { active });
  return { success: true };
}

// ================================================================
//  PAYROLL
// ================================================================

function runPayroll(month, campusId) {
  const employees = getEmployees({ campus: campusId === "ALL" ? "" : campusId });
  const holidays  = getHolidayDatesForMonth(month);
  let processed   = 0;
  let totalNet    = 0;

  employees.forEach((emp) => {
    const attendanceRec = sheetToObjects(SH.ATTENDANCE).filter(
      (a) => a.empId === emp.id && a.date.startsWith(month)
    );
    const workingDays = getWorkingDays(month, holidays);
    const presentDays = attendanceRec.filter((a) => a.status === "Present" || a.status === "Late").length;
    const lateDays    = attendanceRec.filter((a) => a.late === true || a.late === "TRUE").length;
    const leaveDays   = getApprovedLeaveDays(emp.id, month);
    const absentDays  = Math.max(0, workingDays - presentDays - leaveDays);

    const basic       = Number(emp.basicSalary) || 0;
    const allowances  = Number(emp.allowances)  || 0;
    const perDay      = basic / workingDays;
    const deductAbsent= absentDays * perDay;
    const deductLate  = lateDays   * 300;
    const gross       = basic + allowances;
    const net         = Math.max(0, gross - deductAbsent - deductLate);
    totalNet         += net;

    const existing = sheetToObjects(SH.PAYROLL).find(
      (p) => p.empId === emp.id && p.month === month
    );
    const slip = {
      id: existing ? existing.id : generateId("PAY"),
      empId: emp.id, employee: emp.name, campus: emp.campus, month,
      basic, allowances, gross, deductAbsent, deductLate,
      net: Math.round(net), workingDays, presentDays, leaveDays, absentDays, lateDays,
      processedAt: nowPK(),
    };

    if (existing) updateRowById(SH.PAYROLL, "id", existing.id, slip);
    else          appendRow(SH.PAYROLL, slip);

    // Email salary slip
    const empObj = findRowById(SH.EMPLOYEES, "id", emp.id);
    if (empObj && empObj.email) {
      sendEmail(
        empObj.email,
        `Salary Slip — ${month} | Isra School System`,
        buildPaySlipEmail(slip, empObj)
      );
    }
    processed++;
  });

  return { success: true, processed, totalNet: Math.round(totalNet) };
}

function getPayrollSummary(month) {
  const slips = month
    ? sheetToObjects(SH.PAYROLL).filter((p) => p.month === month)
    : sheetToObjects(SH.PAYROLL);

  const byCampus = {};
  slips.forEach((p) => {
    if (!byCampus[p.campus]) byCampus[p.campus] = { campus: p.campus, employees: 0, gross: 0, deductions: 0, net: 0 };
    byCampus[p.campus].employees++;
    byCampus[p.campus].gross      += Number(p.gross)  || 0;
    byCampus[p.campus].deductions += (Number(p.deductAbsent) || 0) + (Number(p.deductLate) || 0);
    byCampus[p.campus].net        += Number(p.net)    || 0;
  });
  return Object.values(byCampus);
}

function getPaySlip(empId, month) {
  const slips = sheetToObjects(SH.PAYROLL).filter(
    (p) => p.empId === empId && (!month || p.month === month)
  );
  return slips.sort((a, b) => b.month.localeCompare(a.month))[0] || null;
}

function getApprovedLeaveDays(empId, month) {
  return sheetToObjects(SH.LEAVES)
    .filter((l) => l.empId === empId && l.status === "Approved" && l.from.startsWith(month))
    .reduce((s, l) => s + (Number(l.days) || 0), 0);
}

function getWorkingDays(month, holidays) {
  const [year, mon] = month.split("-").map(Number);
  const days = new Date(year, mon, 0).getDate();
  let count  = 0;
  for (let d = 1; d <= days; d++) {
    const date = new Date(year, mon - 1, d);
    if (date.getDay() === 0) continue; // Sunday = weekly off
    const ds = `${year}-${String(mon).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
    if (holidays.includes(ds)) continue;
    count++;
  }
  return count;
}

// ================================================================
//  HOLIDAYS
// ================================================================

function getHolidays(year) {
  let list = sheetToObjects(SH.HOLIDAYS);
  if (year) list = list.filter((h) => h.date.startsWith(year));
  return list;
}

function getHolidayDatesForMonth(month) {
  return sheetToObjects(SH.HOLIDAYS)
    .filter((h) => h.date.startsWith(month))
    .map((h) => h.date);
}

function addHoliday(data) {
  const id = generateId("HOL");
  appendRow(SH.HOLIDAYS, { id, ...data, createdAt: nowPK() });
  return { success: true, id };
}

// ================================================================
//  AUTH
// ================================================================

function loginUser(email, password) {
  const user = sheetToObjects(SH.USERS).find(
    (u) => u.email === email && u.password === hashPassword(password) && u.active !== false
  );
  if (!user) return { success: false, error: "Invalid email or password" };
  const emp  = findRowById(SH.EMPLOYEES, "id", user.empId);
  return { success: true, user: { ...emp }, role: user.role };
}

function hashPassword(pw) {
  // Simple hash for demo; use Apps Script CryptoJS or store bcrypt in production
  return Utilities.base64Encode(Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, pw));
}

// ================================================================
//  NOTIFICATIONS
// ================================================================

function sendEmail(to, subject, body) {
  try {
    GmailApp.sendEmail(to, `[Isra Portal] ${subject}`, body);
  } catch (e) {
    Logger.log("Email failed: " + e.message);
  }
}

function notifyEmployee(empId, message) {
  const emp = findRowById(SH.EMPLOYEES, "id", empId);
  if (emp && emp.email) {
    sendEmail(emp.email, "Update from Isra School Portal", `Dear ${emp.name},\n\n${message}\n\nIsra School System`);
  }
}

function getPrincipalForCampus(campusId) {
  return sheetToObjects(SH.EMPLOYEES).find(
    (e) => e.campus === campusId && e.role === "Principal" && e.status === "Active"
  ) || null;
}

function buildPaySlipEmail(slip, emp) {
  return `
Dear ${emp.name},

Your salary slip for ${slip.month} is ready.

-----------------------------------
  Isra School System — Pay Slip
  Employee : ${emp.name} (${emp.id})
  Month    : ${slip.month}
-----------------------------------
  Basic Salary     : PKR ${Number(slip.basic).toLocaleString()}
  Allowances       : PKR ${Number(slip.allowances).toLocaleString()}
  Gross Pay        : PKR ${Number(slip.gross).toLocaleString()}
-----------------------------------
  Absent deduction : PKR -${Number(slip.deductAbsent).toLocaleString()}
  Late deduction   : PKR -${Number(slip.deductLate).toLocaleString()}
-----------------------------------
  NET PAY          : PKR ${Number(slip.net).toLocaleString()}
-----------------------------------
  Working Days : ${slip.workingDays}
  Present Days : ${slip.presentDays}
  Leave Days   : ${slip.leaveDays}
  Absent Days  : ${slip.absentDays}

Login to the portal for full details.

Isra School System
  `.trim();
}

// ================================================================
//  REPORTS
// ================================================================

function getAttendanceTrend() {
  const rows = sheetToObjects(SH.ATTENDANCE);
  const map  = {};
  rows.forEach((a) => {
    const d = a.date;
    if (!map[d]) map[d] = { day: d, present: 0, late: 0, absent: 0 };
    if (a.status === "Present") map[d].present++;
    else if (a.status === "Late") { map[d].present++; map[d].late++; }
    else if (a.status === "Absent") map[d].absent++;
  });
  return Object.values(map).slice(-7);
}

function getLeaveTrend() {
  const rows = sheetToObjects(SH.LEAVES).filter((l) => l.status === "Approved");
  const map  = {};
  rows.forEach((l) => {
    const month = l.from.slice(0, 7);
    if (!map[month]) map[month] = { month, leaves: 0 };
    map[month].leaves++;
  });
  return Object.values(map).slice(-6);
}

function getDeptSplit() {
  const rows = sheetToObjects(SH.EMPLOYEES).filter((e) => e.status === "Active");
  const map  = {};
  rows.forEach((e) => {
    if (!map[e.dept]) map[e.dept] = { name: e.dept, value: 0 };
    map[e.dept].value++;
  });
  return Object.values(map);
}

// ================================================================
//  ONE-TIME SETUP  —  Run this once from the Script Editor
// ================================================================

function initializeSheets() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

  const schemas = {
    [SH.EMPLOYEES]: [
      "id","name","role","dept","campus","status","joined","phone","email",
      "basicSalary","allowances","avatarColor","leaveBalance","createdAt"
    ],
    [SH.LEAVES]: [
      "id","empId","employee","campus","type","from","to","days","reason",
      "status","stage","appliedAt","principalComment","directorComment"
    ],
    [SH.ATTENDANCE]: [
      "id","empId","campusId","date","checkIn","checkOut",
      "geoStatus","status","late","createdAt"
    ],
    [SH.CAMPUSES]: [
      "id","name","type","city","lat","lng","radius","active","staff","attendanceToday","createdAt"
    ],
    [SH.PAYROLL]: [
      "id","empId","employee","campus","month","basic","allowances","gross",
      "deductAbsent","deductLate","net","workingDays","presentDays","leaveDays","absentDays","lateDays","processedAt"
    ],
    [SH.HOLIDAYS]: [
      "id","date","name","type","createdAt"
    ],
    [SH.USERS]: [
      "id","empId","email","password","role","active","createdAt"
    ],
  };

  Object.entries(schemas).forEach(([name, headers]) => {
    let sh = ss.getSheetByName(name);
    if (!sh) sh = ss.insertSheet(name);
    if (sh.getLastRow() === 0) {
      sh.getRange(1, 1, 1, headers.length).setValues([headers]);
      sh.getRange(1, 1, 1, headers.length)
        .setBackground("#11203A").setFontColor("#FFFFFF").setFontWeight("bold");
    }
  });

  // Seed one admin user (password: admin123)
  const userSh = ss.getSheetByName(SH.USERS);
  if (userSh.getLastRow() <= 1) {
    userSh.appendRow([
      "USR-0001", "EMP-1001", "admin@isra.edu.pk",
      hashPassword("admin123"), "Super Admin", true, nowPK()
    ]);
  }

  SpreadsheetApp.getUi().alert("✅ Isra Portal sheets initialized successfully!");
}
