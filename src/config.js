// ============================================================
//  ISRA SCHOOL PORTAL — CONFIGURATION FILE
//  Apna Google Apps Script Web App URL yahan paste karein.
//
//  Steps:
//   1. Google Apps Script kholo (script.google.com)
//   2. "Deploy > New Deployment > Web App" karein
//   3. Execute as: "Me"  |  Access: "Anyone"
//   4. Jo URL mile usse APPS_SCRIPT_URL mein paste karein
//   5. File save karein → app automatic real data use karega
// ============================================================

const APPS_SCRIPT_URL = "";
// Example:
// const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxxxxxxxxxxxxxxxx/exec";

// ── Sheet names (Google Sheet mein same naam rakhen) ─────────
export const SHEET_NAMES = {
  EMPLOYEES:   "Employees",
  LEAVES:      "Leaves",
  ATTENDANCE:  "Attendance",
  CAMPUSES:    "Campuses",
  PAYROLL:     "Payroll",
  HOLIDAYS:    "Holidays",
  USERS:       "Users",
};

// ── Feature flags ─────────────────────────────────────────────
export const CONFIG = {
  APPS_SCRIPT_URL,
  USE_DUMMY_DATA: !APPS_SCRIPT_URL,   // URL nahi hai to dummy data
  APP_NAME:        "Isra School Portal",
  VERSION:         "1.0.0",
  ORG_NAME:        "Isra School System",
  SUPPORT_EMAIL:   "admin@isra.edu.pk",
  DEFAULT_TIMEZONE: "Asia/Karachi",
  GEO_FENCE_BUFFER: 50,              // metres extra tolerance
};

export default CONFIG;
