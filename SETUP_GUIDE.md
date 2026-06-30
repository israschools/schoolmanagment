# Isra School Management Portal — Setup Guide (Phase 1)

Phase 1 mein ye bana hai: **Login/Roles, Employee Profile Management, Campus Management (Super Admin only)**.
Attendance, Leave aur Salary modules agle phases mein add honge.

---

## STEP 1: Google Sheet banayein

1. Google Drive mein jaa kar naya **Google Sheet** banayein, naam dein: `Isra School Management DB`
2. Is sheet mein **3 tabs (sheets)** banayein, exact naam ke sath (capital letters match karna zaroori hai):
   - `Employees`
   - `Campuses`
   - `Sessions`

### Tab 1: `Employees` — Row 1 mein ye headers (exactly is order mein) likhein:

```
EmployeeID | Name | Email | PasswordHash | Role | CampusID | Designation | Phone | CNIC | JoiningDate | Status | Photo | FatherHusbandName | DOB | Gender | PermanentAddress | Qualification | BankName | BankAccountNo | EmergencyContactName | EmergencyContactPhone | BloodGroup
```

### Tab 2: `Campuses` — Row 1 headers:

```
CampusID | CampusName | CampusType | Address | Latitude | Longitude | RadiusMeters | Status
```

### Tab 3: `Sessions` — Row 1 headers:

```
Token | EmployeeID | ExpiresAt
```

Baaki sab kuch (data) backend khud bharega — aapko sirf headers likhne hain.
(Note: column **order** important nahi, sirf header **naam** exactly match hone chahiye — system naam se hi column dhoondta hai.)

---

## STEP 2: Apps Script backend lagayein

1. Sheet ke andar: **Extensions > Apps Script**
2. Jo default code dikh raha hai (`function myFunction(){}`) — usay pura delete kar dein.
3. Ye repository ki `Code.gs` file ka pura content copy karein aor paste kar dein.
4. Top-left mein project ka naam dein: `Isra Portal Backend`
5. Save karein (Ctrl+S / disk icon).

### Pehla Super Admin account banayein:

1. Code.gs ke andar function dropdown (upar) se `createFirstSuperAdmin` select karein.
2. Us se pehle, code mein ye lines dhoondein aor apni email/password se replace karein:
   ```js
   const email = 'admin@isra.edu.pk'; // <-- apni email likhein
   const password = 'Admin@123';      // <-- apna password likhein
   ```
3. **Run** button dabayein. Pehli dafa permissions allow karne ko bolega — **Allow** kar dein (Google warning dikhayega "unverified app", us mein **Advanced > Go to Isra Portal Backend (unsafe)** pe click karein, ye normal hai kyunke ye aapki khud ki script hai).
4. Run hone ke baad `Employees` sheet check karein — pehli row mein Super Admin add ho chuka hoga.

---

## STEP 3: Backend ko Web App ke roop mein Deploy karein

1. Apps Script editor mein top-right **Deploy > New deployment**
2. Gear icon (⚙) pe click karein, **Web app** select karein
3. Settings:
   - **Execute as:** Me (your email)
   - **Who has access:** Anyone
4. **Deploy** dabayein, permissions dobara allow karein agar mange.
5. Ek **Web App URL** milega jaisे:
   `https://script.google.com/macros/s/AKfycb.../exec`
6. Ye URL copy kar lein — agle step mein chahiye hoga.

⚠️ **Important:** Jab bhi Code.gs mein koi tabdeeli karein, dobara deploy karna zaroori hai (**Deploy > Manage deployments > Edit (pencil) > New version > Deploy**).

---

## STEP 4: config.js mein API URL dalein

1. `config.js` file kholein, ye line dhoondein:
   ```js
   const CONFIG = {
     API_URL: "PASTE_YOUR_WEB_APP_URL_HERE"
   };
   ```
2. Step 3 wala Web App URL yahan paste karein:
   ```js
   const CONFIG = {
     API_URL: "https://script.google.com/macros/s/AKfycb.../exec"
   };
   ```
3. Save karein. `index.html` ko chhedne ki zaroorat nahi — wo khud `config.js` se URL utha leta hai.

> 💡 Agar future mein **alag campuses ke liye alag Sheet** ya **staging/testing backend** chahiye ho, to bas `config.js` ki copy badal kar naya URL daal dein — baqi sara code wahi rahega.

---

## STEP 5: GitHub Pages pe host karein

1. GitHub pe naya repository banayein, jaise `isra-school-portal`
2. `index.html` aor `config.js` dono files us repo mein upload karein (root mein, dono ek hi folder mein).
3. Repo **Settings > Pages** mein jaa kar:
   - Source: `main` branch, `/ (root)` folder
   - Save karein
4. Kuch minute baad aapka portal is URL pe live ho jayega:
   `https://<aapka-username>.github.io/isra-school-portal/`

---

## STEP 6: Test karein

1. Portal URL kholein → Login screen aayegi.
2. Step 2 wali Super Admin email/password se login karein.
3. Login ke baad:
   - **Campuses** tab mein jaa kar apni 2-3 campuses add karein (Latitude/Longitude Google Maps se le sakte hain — campus pe right-click > "What's here?")
   - **Employees** tab mein jaa kar Director, Principal, Teachers add karein, har ek ko sahi campus assign karein.
   - Naya employee add karte waqt default temporary password `Isra@123` set hota hai — unhein bata dein ke pehli login ke baad **My Profile** se password change kar lein.

---

## Roles ka Access Summary

| Role | Employees Dekh/Manage | Campuses |
|---|---|---|
| **Teacher** | Sirf apni profile (limited edit) | — |
| **Principal** | Sirf apni campus ke Teachers add/edit | — |
| **Director** | Sab employees (sab campuses) add/edit/deactivate | — |
| **SuperAdmin** | Sab kuch | Add/Edit/Deactivate |

---

## Agla Phase (jab aap ready hon)

- **Phase 2:** Attendance — GPS check-in/check-out + Geo-fencing (Campus ki Latitude/Longitude/Radius already is phase mein add ho chuki hai, isi pe build hoga)
- **Phase 3:** Leave Management — apply/approve workflow, leave types, balance tracking, email notifications
- **Phase 4:** Salary auto-generation — attendance-based calendar, Sunday off, holiday calendar

Jab Phase 1 test ho jaye aor sab theek chale, bata dein — Phase 2 (Attendance) shuru karte hain.
