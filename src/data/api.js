// ============================================================
//  api.js  —  Isra School Portal  |  Frontend API Layer
//  AUTO SWITCH: dummy data jab tak GAS URL set nahi
// ============================================================
import CONFIG from "../config";
import * as dummy from "./dummyData";

// ── GAS fetch helpers ─────────────────────────────────────────
async function gasGet(action, params = {}) {
  const url = new URL(CONFIG.APPS_SCRIPT_URL);
  url.searchParams.set("action", action);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Server error ${res.status}`);
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json.data;
}

async function gasPost(action, payload = {}) {
  const res = await fetch(CONFIG.APPS_SCRIPT_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain" }, // GAS needs text/plain for CORS
    body: JSON.stringify({ action, ...payload }),
  });
  if (!res.ok) throw new Error(`Server error ${res.status}`);
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json.data;
}

// ── AUTH ──────────────────────────────────────────────────────
export async function loginUser(email, password) {
  if (CONFIG.USE_DUMMY_DATA) {
    // Demo credentials
    const DEMO_USERS = [
      { email: "admin@isra.edu.pk",     password: "admin123",   role: "Super Admin",     empId: "EMP-1008" },
      { email: "director@isra.edu.pk",  password: "director123",role: "Director Schools", empId: "EMP-1006" },
      { email: "principal@isra.edu.pk", password: "principal123",role: "Principal",       empId: "EMP-1002" },
      { email: "teacher@isra.edu.pk",   password: "teacher123", role: "Teacher",          empId: "EMP-1001" },
    ];
    const found = DEMO_USERS.find(u => u.email === email && u.password === password);
    if (!found) return { success: false, error: "Invalid email or password" };
    const user = dummy.employees.find(e => e.id === found.empId) || { name: email, id: found.empId };
    return { success: true, user: { ...user, avatarColor: user.avatarColor || "#11203A" }, role: found.role };
  }
  return gasPost("loginUser", { email, password });
}

// ── EMPLOYEES ─────────────────────────────────────────────────
export async function getEmployees(filters = {}) {
  if (CONFIG.USE_DUMMY_DATA) {
    let list = [...dummy.employees];
    if (filters.campus) list = list.filter(e => e.campus === filters.campus);
    if (filters.dept)   list = list.filter(e => e.dept   === filters.dept);
    if (filters.status) list = list.filter(e => e.status === filters.status);
    return list;
  }
  return gasGet("getEmployees", filters);
}

export async function getEmployee(empId) {
  if (CONFIG.USE_DUMMY_DATA) return dummy.employees.find(e => e.id === empId) || null;
  return gasGet("getEmployee", { empId });
}

export async function addEmployee(data) {
  if (CONFIG.USE_DUMMY_DATA) { console.log("addEmployee", data); return { success: true }; }
  return gasPost("addEmployee", data);
}

export async function updateEmployee(empId, data) {
  if (CONFIG.USE_DUMMY_DATA) { console.log("updateEmployee", empId, data); return { success: true }; }
  return gasPost("updateEmployee", { empId, ...data });
}

// ── LEAVE ─────────────────────────────────────────────────────
export async function getLeaveRequests(filters = {}) {
  if (CONFIG.USE_DUMMY_DATA) {
    let list = [...dummy.leaveRequests];
    if (filters.status) list = list.filter(l => l.status === filters.status);
    if (filters.empId)  list = list.filter(l => l.empId  === filters.empId);
    return list;
  }
  return gasGet("getLeaveRequests", filters);
}

export async function submitLeave(data) {
  if (CONFIG.USE_DUMMY_DATA) { console.log("submitLeave", data); return { success: true, id: "LV-DEMO" }; }
  return gasPost("submitLeave", data);
}

export async function approveLeave(leaveId, approverRole, comment = "") {
  if (CONFIG.USE_DUMMY_DATA) { console.log("approveLeave", leaveId); return { success: true }; }
  return gasPost("approveLeave", { leaveId, approverRole, comment });
}

export async function rejectLeave(leaveId, approverRole, comment = "") {
  if (CONFIG.USE_DUMMY_DATA) { console.log("rejectLeave", leaveId); return { success: true }; }
  return gasPost("rejectLeave", { leaveId, approverRole, comment });
}

export async function getLeaveBalance(empId) {
  if (CONFIG.USE_DUMMY_DATA) return dummy.leaveTypes;
  return gasGet("getLeaveBalance", { empId });
}

// ── ATTENDANCE ────────────────────────────────────────────────
export async function getTodayAttendance(campusId = "") {
  if (CONFIG.USE_DUMMY_DATA) return dummy.attendanceToday;
  return gasGet("getTodayAttendance", { campusId });
}

export async function checkIn(empId, campusId, lat, lng) {
  if (CONFIG.USE_DUMMY_DATA) {
    const time = new Date().toTimeString().slice(0,5);
    return { success: true, time, geoStatus: "Verified", late: time > "08:15" };
  }
  return gasPost("checkIn", { empId, campusId, lat, lng });
}

export async function checkOut(empId, campusId, lat, lng) {
  if (CONFIG.USE_DUMMY_DATA) {
    return { success: true, time: new Date().toTimeString().slice(0,5) };
  }
  return gasPost("checkOut", { empId, campusId, lat, lng });
}

export async function getAttendanceHistory(empId, month) {
  if (CONFIG.USE_DUMMY_DATA) return dummy.attendanceTrend;
  return gasGet("getAttendanceHistory", { empId, month });
}

// ── CAMPUSES ──────────────────────────────────────────────────
export async function getCampuses() {
  if (CONFIG.USE_DUMMY_DATA) return dummy.campuses;
  return gasGet("getCampuses");
}

export async function saveCampus(data) {
  if (CONFIG.USE_DUMMY_DATA) { console.log("saveCampus", data); return { success: true }; }
  return gasPost("saveCampus", data);
}

export async function toggleCampusStatus(campusId, active) {
  if (CONFIG.USE_DUMMY_DATA) { console.log("toggleCampus", campusId); return { success: true }; }
  return gasPost("toggleCampusStatus", { campusId, active });
}

// ── PAYROLL ───────────────────────────────────────────────────
export async function getPayrollSummary(month) {
  if (CONFIG.USE_DUMMY_DATA) return dummy.payrollSummary;
  return gasGet("getPayrollSummary", { month });
}

export async function getPaySlip(empId, month) {
  if (CONFIG.USE_DUMMY_DATA) return dummy.paySlip;
  return gasGet("getPaySlip", { empId, month });
}

export async function runPayroll(month, campusId = "ALL") {
  if (CONFIG.USE_DUMMY_DATA) {
    return { success: true, processed: 687, totalNet: 38790000 };
  }
  return gasPost("runPayroll", { month, campusId });
}

// ── HOLIDAYS ──────────────────────────────────────────────────
export async function getHolidays(year) {
  if (CONFIG.USE_DUMMY_DATA) return dummy.holidays;
  return gasGet("getHolidays", { year });
}

export async function addHoliday(data) {
  if (CONFIG.USE_DUMMY_DATA) { console.log("addHoliday", data); return { success: true }; }
  return gasPost("addHoliday", data);
}

// ── REPORTS ───────────────────────────────────────────────────
export async function getAttendanceTrend() {
  if (CONFIG.USE_DUMMY_DATA) return dummy.attendanceTrend;
  return gasGet("getAttendanceTrend");
}

export async function getLeaveTrend() {
  if (CONFIG.USE_DUMMY_DATA) return dummy.leaveTrend;
  return gasGet("getLeaveTrend");
}

export async function getDeptSplit() {
  if (CONFIG.USE_DUMMY_DATA) return dummy.departmentSplit;
  return gasGet("getDeptSplit");
}
