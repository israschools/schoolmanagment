# Isra Portal — Google Apps Script Setup Guide
## Step by Step (Urdu/English Mixed)

---

## PART 1 — Google Sheet Banana

1. **Google Drive** kholo → `drive.google.com`
2. **New → Google Sheets** karein
3. Sheet ka naam dein: **"Isra School Portal DB"**
4. Address bar mein URL check karein:
   ```
   https://docs.google.com/spreadsheets/d/XXXXXXXXXXXXXXXXXXXXXXXX/edit
   ```
   Wohi `XXXXXXXXXXXXXXXXXXXXXXXX` hissa copy karein — **yeh aapka Sheet ID hai**

---

## PART 2 — Apps Script Setup

1. Wohi Sheet mein **Extensions → Apps Script** karein
2. Project ka naam change karein: **"IsraPortalBackend"**
3. `Code.gs` file mein **saara purana code delete** karein
4. `Code.gs` file ka content **paste** karein (jo aapko diya gaya hai)
5. Line #14 update karein:
   ```js
   // PEHLE:
   const SPREADSHEET_ID = "PASTE_YOUR_GOOGLE_SHEET_ID_HERE";
   
   // BAAD MEIN (apna ID):
   const SPREADSHEET_ID = "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms";
   ```
6. **Save** karein (Ctrl+S)

---

## PART 3 — Sheets Initialize Karna (Ek baar)

1. Apps Script editor mein **function dropdown** se `initializeSheets` select karein
2. **Run** button dabayein (▶)
3. Google permission maangega → **Allow** karein
4. Success message aayega: "✅ Isra Portal sheets initialized successfully!"
5. Wapas Google Sheet mein jao — **7 tabs** ban gaye honge:
   - Employees, Leaves, Attendance, Campuses, Payroll, Holidays, Users

---

## PART 4 — Web App Deploy Karna

1. Apps Script mein **Deploy → New Deployment**
2. Settings:
   ```
   Type:         Web App
   Description:  IsraPortal v1
   Execute as:   Me (your account)
   Who can access: Anyone
   ```
3. **Deploy** karein
4. **Authorization** karein → Allow
5. **Web App URL** copy karein, kuch aisa dikhega:
   ```
   https://script.google.com/macros/s/AKfycbXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/exec
   ```
   **Yeh URL save karein!**

---

## PART 5 — Frontend mein URL Paste Karna

1. `src/config.js` file kholo
2. Line 14 update karein:
   ```js
   // PEHLE (empty):
   const APPS_SCRIPT_URL = "";
   
   // BAAD MEIN (apna URL):
   const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbXXXXX/exec";
   ```
3. File **save** karein
4. App **automatic real data** use karna shuru kar dega!
   (`USE_DUMMY_DATA` automatically `false` ho jata hai jab URL set ho)

---

## PART 6 — Employees Aur Data Add Karna

### Google Sheet mein directly:
Employees tab mein rows add karein, yeh columns fill karein:

| id | name | role | dept | campus | status | joined | phone | email | basicSalary | allowances |
|----|------|------|------|--------|--------|--------|-------|-------|-------------|------------|
| EMP-1001 | Ayesha Khan | Teacher | Mathematics | C-01 | Active | 2021-03-12 | 0300-1234567 | ayesha@isra.edu.pk | 65000 | 12000 |

### Leave balance column (JSON format):
```json
[
  {"type":"Casual Leave","balance":8,"used":4,"total":12},
  {"type":"Sick Leave","balance":6,"used":2,"total":8},
  {"type":"Annual Leave","balance":12,"used":8,"total":20}
]
```

---

## PART 7 — Re-deploy After Code Changes

Jab bhi Code.gs mein koi change karein:
1. **Deploy → Manage Deployments**
2. Edit (pencil icon) → **New Version** → **Deploy**
3. URL same rahegi, no need to update config.js

---

## TROUBLESHOOTING

| Problem | Solution |
|---------|----------|
| "Script function not found" | Check function name in Run dropdown |
| "You do not have permission" | Allow Google permissions again |
| CORS error in browser | Make sure "Anyone" access is selected |
| Data nahi aa raha | Check SPREADSHEET_ID is correct |
| Email nahi ja raha | Gmail quota 100/day — check Apps Script logs |

---

## EMAIL NOTIFICATIONS — Auto Hoti Hain

| Event | Email jaata hai |
|-------|----------------|
| Leave apply | Principal ko |
| Principal approve | Director ko |
| Final approve/reject | Employee ko |
| Payroll process | Har employee ko salary slip |
