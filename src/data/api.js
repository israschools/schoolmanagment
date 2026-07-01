// ============================================================
//  api.js  —  Isra School Portal  |  Frontend API Layer
//
//  Jab CONFIG.USE_DUMMY_DATA = true  → local dummyData.js use hoga
//  Jab APPS_SCRIPT_URL set ho        → real Google Apps Script call hoga
//
//  Har function same shape return karta hai, isliye pages ko
//  kuch change nahi karna padta.
// ============================================================

import CONFIG from "../config";
import * as dummy from "./dummyData";

// ── Low-level GAS fetch helper ────────────────────────────────
async function gasCall(action, params = {}) {
  const url = new URL(CONFIG.APPS_SCRIPT_URL);
  url.searchParams.set("action", action);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`GAS error ${res.status}`);
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json.data;
}

async function gasPost(action, payload = {}) {
  const res = await fetch(CONFIG.APPS_SCRIPT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, ...payload }),
  });
  if (!res.ok) throw new Error(`GAS POST error ${res.status}`);
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json.data;
}

// ── EMPLOYEES ─────────────────────────────────────────────────
export async function getEmployees(filters = {}) {
  if (CONFIG.USE_DUMMY_DATA) {
    let list = [...dummy.employees];
    if (filters.campus) list = list.filter((e) => e.campus === filters.campus);
    if (filters.dept)   list = list.filter((e) => e.dept === filters.dept);
    if (filters.status) list = list.filter((e) => e.status === filters.status);
    return list;
  }
  return gasCall("getEmployees", filters);
}

export async function getEmployee(empId) {
  if (CONFIG.USE_DUMMY_DATA) return dummy.employees.find((e) => e.id === empId) || null;
  return gasCall("getEmployee", { empId });
}

export async function addEmployee(data) {
  if (CONFIG.USE_DUMMY_DATA) { console.log("DEMO: addEmployee", data); return { success: true }; }
  return gasPost("addEmployee", data);
}

export async function updateEmployee(empId, data) {
  if (CONFIG.USE_DUMMY_DATA) { console.log("DEMO: updateEmployee", empId, data); return { success: true }; }
  return gasPost("updateEmployee", { empId, ...data });
}

// ── LEAVE ─────────────────────────────────────────────────────
export async function getLeaveRequests(filters = {}) {
  if (CONFIG.USE_DUMMY_DATA) {
    let list = [...dummy.leaveRequests];
    if (filters.status) list = list.filter((l) => l.status === filters.status);
    if (filters.empId)  list = list.filter((l) => l.empId === filters.empId);
    return list;
  }
  return gasCall("getLeaveRequests", filters);
}

export async function submitLeave(data) {
  if (CONFIG.USE_DUMMY_DATA) {
    console.log("DEMO: submitLeave", data);
    return { success: true, id: "LV-DEMO-" + Date.now() };
  }
  return gasPost("submitLeave", data);
}

export async function approveLeave(leaveId, approverRole, comment = "") {
  if (CONFIG.USE_DUMMY_DATA) {
    console.log("DEMO: approveLeave", leaveId, approverRole);
    return { success: true };
  }
  return gasPost("approveLeave", { leaveId, approverRole, comment });
}

export async function rejectLeave(leaveId, approverRole, comment = "") {
  if (CONFIG.USE_DUMMY_DATA) {
    console.log("DEMO: rejectLeave", leaveId, approverRole);
    return { success: true };
  }
  return gasPost("rejectLeave", { leaveId, approverRole, comment });
}

export async function getLeaveBalance(empId) {
  if (CONFIG.USE_DUMMY_DATA) return dummy.leaveTypes;
  return gasCall("getLeaveBalance", { empId });
}

// ── ATTENDANCE ────────────────────────────────────────────────
export async function getTodayAttendance(campusId = "") {
  if (CONFIG.USE_DUMMY_DATA) {
    let list = [...dummy.attendanceToday];
    return list;
  }
  return gasCall("getTodayAttendance", { campusId });
}

export async function checkIn(empId, campusId, lat, lng) {
  if (CONFIG.USE_DUMMY_DATA) {
    console.log("DEMO: checkIn", empId, campusId, lat, lng);
    return { success: true, time: new Date().toTimeString().slice(0, 5), geoStatus: "Verified" };
  }
  return gasPost("checkIn", { empId, campusId, lat, lng });
}

export async function checkOut(empId, campusId, lat, lng) {
  if (CONFIG.USE_DUMMY_DATA) {
    console.log("DEMO: checkOut", empId, campusId, lat, lng);
    return { success: true, time: new Date().toTimeString().slice(0, 5) };
  }
  return gasPost("checkOut", { empId, campusId, lat, lng });
}

export async function getAttendanceHistory(empId, month) {
  if (CONFIG.USE_DUMMY_DATA) return dummy.attendanceTrend;
  return gasCall("getAttendanceHistory", { empId, month });
}

// ── CAMPUSES ──────────────────────────────────────────────────
export async function getCampuses() {
  if (CONFIG.USE_DUMMY_DATA) return dummy.campuses;
  return gasCall("getCampuses");
}

export async function saveCampus(data) {
  if (CONFIG.USE_DUMMY_DATA) { console.log("DEMO: saveCampus", data); return { success: true }; }
  return gasPost("saveCampus", data);
}

export async function toggleCampusStatus(campusId, active) {
  if (CONFIG.USE_DUMMY_DATA) { console.log("DEMO: toggleCampus", campusId, active); return { success: true }; }
  return gasPost("toggleCampusStatus", { campusId, active });
}

// ── PAYROLL ───────────────────────────────────────────────────
export async function getPayrollSummary(month) {
  if (CONFIG.USE_DUMMY_DATA) return dummy.payrollSummary;
  return gasCall("getPayrollSummary", { month });
}

export async function getPaySlip(empId, month) {
  if (CONFIG.USE_DUMMY_DATA) return dummy.paySlip;
  return gasCall("getPaySlip", { empId, month });
}

export async function runPayroll(month, campusId = "ALL") {
  if (CONFIG.USE_DUMMY_DATA) {
    console.log("DEMO: runPayroll", month, campusId);
    return { success: true, processed: 687, totalNet: 38790000 };
  }
  return gasPost("runPayroll", { month, campusId });
}

// ── HOLIDAYS ──────────────────────────────────────────────────
export async function getHolidays(year) {
  if (CONFIG.USE_DUMMY_DATA) return dummy.holidays;
  return gasCall("getHolidays", { year });
}

export async function addHoliday(data) {
  if (CONFIG.USE_DUMMY_DATA) { console.log("DEMO: addHoliday", data); return { success: true }; }
  return gasPost("addHoliday", data);
}

// ── USERS / AUTH ──────────────────────────────────────────────
export async function loginUser(email, password) {
  if (CONFIG.USE_DUMMY_DATA) {
    const emp = dummy.employees.find((e) => e.email === email);
    if (emp) return { success: true, user: emp, role: emp.role };
    return { success: false, error: "Invalid credentials" };
  }
  return gasPost("loginUser", { email, password });
}

// ── REPORTS ───────────────────────────────────────────────────
export async function getAttendanceTrend() {
  if (CONFIG.USE_DUMMY_DATA) return dummy.attendanceTrend;
  return gasCall("getAttendanceTrend");
}

export async function getLeaveTrend() {
  if (CONFIG.USE_DUMMY_DATA) return dummy.leaveTrend;
  return gasCall("getLeaveTrend");
}

export async function getDeptSplit() {
  if (CONFIG.USE_DUMMY_DATA) return dummy.departmentSplit;
  return gasCall("getDeptSplit");
}
