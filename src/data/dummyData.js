// Centralized dummy data for the Isra School Management Portal prototype.
// In production, every array here maps to a Google Sheet tab + Apps Script endpoint.

export const campuses = [
  { id: "C-01", name: "Main Campus", type: "Main", city: "Karachi", lat: 24.8607, lng: 67.0011, radius: 150, active: true, staff: 312, attendanceToday: 94 },
  { id: "C-02", name: "North Branch", type: "Branch", city: "Karachi", lat: 24.9265, lng: 67.0822, radius: 120, active: true, staff: 158, attendanceToday: 89 },
  { id: "C-03", name: "Gulshan Branch", type: "Branch", city: "Karachi", lat: 24.9180, lng: 67.0970, radius: 120, active: true, staff: 121, attendanceToday: 91 },
  { id: "C-04", name: "Hyderabad Regional", type: "Regional", city: "Hyderabad", lat: 25.3960, lng: 68.3578, radius: 200, active: true, staff: 96, attendanceToday: 86 },
  { id: "C-05", name: "Clifton Branch", type: "Branch", city: "Karachi", lat: 24.8138, lng: 67.0299, radius: 100, active: false, staff: 0, attendanceToday: 0 },
];

export const departments = ["Mathematics", "Science", "English", "Social Studies", "Computer Science", "Sports", "Administration", "Accounts", "HR", "Library"];

export const employees = [
  { id: "EMP-1001", name: "Ayesha Khan", role: "Teacher", dept: "Mathematics", campus: "C-01", status: "Active", joined: "2021-03-12", phone: "0300-1234567", email: "ayesha.khan@isra.edu.pk", avatarColor: "#1C8C6B" },
  { id: "EMP-1002", name: "Bilal Ahmed", role: "Principal", dept: "Administration", campus: "C-01", status: "Active", joined: "2018-07-01", phone: "0301-2233445", email: "bilal.ahmed@isra.edu.pk", avatarColor: "#11203A" },
  { id: "EMP-1003", name: "Sana Tariq", role: "Teacher", dept: "Science", campus: "C-02", status: "Active", joined: "2022-01-19", phone: "0333-9988776", email: "sana.tariq@isra.edu.pk", avatarColor: "#C99A3B" },
  { id: "EMP-1004", name: "Hassan Raza", role: "Principal", dept: "Administration", campus: "C-02", status: "Active", joined: "2019-09-05", phone: "0345-1122334", email: "hassan.raza@isra.edu.pk", avatarColor: "#11203A" },
  { id: "EMP-1005", name: "Fatima Noor", role: "Teacher", dept: "English", campus: "C-01", status: "On Leave", joined: "2020-11-23", phone: "0312-7766554", email: "fatima.noor@isra.edu.pk", avatarColor: "#1C8C6B" },
  { id: "EMP-1006", name: "Usman Ali", role: "Director Schools", dept: "Administration", campus: "C-01", status: "Active", joined: "2015-04-10", phone: "0321-5544332", email: "usman.ali@isra.edu.pk", avatarColor: "#C04A4A" },
  { id: "EMP-1007", name: "Mehwish Iqbal", role: "Teacher", dept: "Computer Science", campus: "C-03", status: "Active", joined: "2023-02-14", phone: "0302-4455667", email: "mehwish.iqbal@isra.edu.pk", avatarColor: "#1C8C6B" },
  { id: "EMP-1008", name: "Super Admin", role: "Super Admin", dept: "Administration", campus: "C-01", status: "Active", joined: "2014-01-01", phone: "0300-0000000", email: "admin@isra.edu.pk", avatarColor: "#1F2430" },
  { id: "EMP-1009", name: "Zara Sheikh", role: "Teacher", dept: "Social Studies", campus: "C-04", status: "Active", joined: "2021-08-30", phone: "0334-8899001", email: "zara.sheikh@isra.edu.pk", avatarColor: "#1C8C6B" },
  { id: "EMP-1010", name: "Imran Farooq", role: "Teacher", dept: "Sports", campus: "C-02", status: "Active", joined: "2020-05-17", phone: "0306-3344556", email: "imran.farooq@isra.edu.pk", avatarColor: "#1C8C6B" },
];

export const leaveTypes = [
  { type: "Casual Leave", balance: 8, used: 4, total: 12 },
  { type: "Sick Leave", balance: 6, used: 2, total: 8 },
  { type: "Annual Leave", balance: 12, used: 8, total: 20 },
  { type: "Maternity Leave", balance: 90, used: 0, total: 90 },
  { type: "Paternity Leave", balance: 7, used: 0, total: 7 },
  { type: "Special Leave", balance: 3, used: 0, total: 3 },
  { type: "Unpaid Leave", balance: "—", used: 0, total: "—" },
];

export const leaveRequests = [
  { id: "LV-2031", employee: "Ayesha Khan", empId: "EMP-1001", type: "Sick Leave", from: "2026-06-22", to: "2026-06-23", days: 2, status: "Pending", stage: "Principal", reason: "Fever" },
  { id: "LV-2030", employee: "Fatima Noor", empId: "EMP-1005", type: "Annual Leave", from: "2026-06-18", to: "2026-06-25", days: 8, status: "Approved", stage: "Director", reason: "Family trip" },
  { id: "LV-2029", employee: "Sana Tariq", empId: "EMP-1003", type: "Casual Leave", from: "2026-06-15", to: "2026-06-15", days: 1, status: "Approved", stage: "Director", reason: "Personal work" },
  { id: "LV-2028", employee: "Mehwish Iqbal", empId: "EMP-1007", type: "Sick Leave", from: "2026-06-10", to: "2026-06-11", days: 2, status: "Rejected", stage: "Principal", reason: "Medical" },
  { id: "LV-2027", employee: "Imran Farooq", empId: "EMP-1010", type: "Special Leave", from: "2026-06-28", to: "2026-06-29", days: 2, status: "Pending", stage: "Director", reason: "Sports event travel" },
  { id: "LV-2026", employee: "Zara Sheikh", empId: "EMP-1009", type: "Casual Leave", from: "2026-06-05", to: "2026-06-05", days: 1, status: "Approved", stage: "Director", reason: "Personal" },
];

export const attendanceToday = [
  { empId: "EMP-1001", name: "Ayesha Khan", campus: "Main Campus", checkIn: "08:02", checkOut: "—", status: "Present", late: false, geo: "Verified" },
  { empId: "EMP-1003", name: "Sana Tariq", campus: "North Branch", checkIn: "08:21", checkOut: "—", status: "Late", late: true, geo: "Verified" },
  { empId: "EMP-1005", name: "Fatima Noor", campus: "Main Campus", checkIn: "—", checkOut: "—", status: "On Leave", late: false, geo: "—" },
  { empId: "EMP-1007", name: "Mehwish Iqbal", campus: "Gulshan Branch", checkIn: "07:58", checkOut: "—", status: "Present", late: false, geo: "Verified" },
  { empId: "EMP-1009", name: "Zara Sheikh", campus: "Hyderabad Regional", checkIn: "08:34", checkOut: "—", status: "Late", late: true, geo: "Verified" },
  { empId: "EMP-1010", name: "Imran Farooq", campus: "North Branch", checkIn: "—", checkOut: "—", status: "Absent", late: false, geo: "—" },
];

export const attendanceTrend = [
  { day: "Mon", present: 462, late: 22, absent: 26 },
  { day: "Tue", present: 470, late: 18, absent: 22 },
  { day: "Wed", present: 455, late: 31, absent: 24 },
  { day: "Thu", present: 480, late: 14, absent: 16 },
  { day: "Fri", present: 449, late: 27, absent: 34 },
  { day: "Sat", present: 410, late: 12, absent: 8 },
];

export const leaveTrend = [
  { month: "Jan", leaves: 38 }, { month: "Feb", leaves: 29 }, { month: "Mar", leaves: 44 },
  { month: "Apr", leaves: 33 }, { month: "May", leaves: 51 }, { month: "Jun", leaves: 40 },
];

export const departmentSplit = [
  { name: "Mathematics", value: 62 }, { name: "Science", value: 58 }, { name: "English", value: 47 },
  { name: "Computer Science", value: 39 }, { name: "Admin/Ops", value: 71 }, { name: "Sports", value: 24 },
];

export const payrollSummary = [
  { campus: "Main Campus", employees: 312, gross: 18_540_000, deductions: 612_000, net: 17_928_000 },
  { campus: "North Branch", employees: 158, gross: 9_120_000, deductions: 304_000, net: 8_816_000 },
  { campus: "Gulshan Branch", employees: 121, gross: 7_260_000, deductions: 218_000, net: 7_042_000 },
  { campus: "Hyderabad Regional", employees: 96, gross: 5_180_000, deductions: 176_000, net: 5_004_000 },
];

export const paySlip = {
  empId: "EMP-1001", name: "Ayesha Khan", month: "May 2026", basic: 65000, allowances: 12000,
  overtime: 1500, deductionsLate: 800, deductionsLeave: 0, tax: 3200, net: 65000 + 12000 + 1500 - 800 - 3200,
  workingDays: 26, presentDays: 25, leaveDays: 1,
};

export const holidays = [
  { date: "2026-08-14", name: "Independence Day", type: "Public" },
  { date: "2026-12-25", name: "Quaid-e-Azam Day", type: "Public" },
  { date: "2026-07-06", name: "Eid-ul-Adha (Day 1)", type: "Public" },
  { date: "2026-09-01", name: "Founders' Day", type: "Institution" },
  { date: "2026-11-09", name: "Iqbal Day", type: "Public" },
];

export const roles = ["Teacher", "Principal", "Director Schools", "Super Admin"];

export const notifications = [
  { id: 1, title: "Leave request from Ayesha Khan", time: "10 min ago", type: "leave" },
  { id: 2, title: "Sana Tariq checked in late at North Branch", time: "1 hr ago", type: "attendance" },
  { id: 3, title: "May payroll generated for Main Campus", time: "Yesterday", type: "payroll" },
  { id: 4, title: "Leave approved: Fatima Noor", time: "2 days ago", type: "leave" },
];

export const kpisFor = (role) => {
  if (role === "Teacher") return [
    { label: "Leave Balance", value: "26 days", trend: "+2 vs last qtr" },
    { label: "Attendance This Month", value: "96%", trend: "+1.2%" },
    { label: "Pending Requests", value: "1", trend: "Awaiting Principal" },
    { label: "Next Pay Date", value: "1 Jul", trend: "On schedule" },
  ];
  if (role === "Principal") return [
    { label: "Campus Staff", value: "312", trend: "+4 this month" },
    { label: "Today's Attendance", value: "94%", trend: "+1.4%" },
    { label: "Pending Approvals", value: "5", trend: "2 urgent" },
    { label: "Open Corrections", value: "3", trend: "Awaiting review" },
  ];
  if (role === "Director Schools") return [
    { label: "Total Employees", value: "687", trend: "+12 this qtr" },
    { label: "Active Campuses", value: "4", trend: "1 inactive" },
    { label: "Avg Attendance", value: "90.5%", trend: "-0.8%" },
    { label: "Pending Final Approvals", value: "2", trend: "Director stage" },
  ];
  return [
    { label: "Total Employees", value: "687", trend: "+12 this qtr" },
    { label: "Monthly Payroll", value: "PKR 40.2M", trend: "+3.1%" },
    { label: "Campuses", value: "5", trend: "4 active" },
    { label: "System Health", value: "99.9%", trend: "All services up" },
  ];
};
