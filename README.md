# DisasterShield - Emergency Response Coordination System

> **A Centralized Disaster Management Platform Uniting Citizens, Volunteers, Rescue Teams, and Head Office Administration.**  
> Suitable for Academic Project Demonstrations, College Viva Presentations, and Hackathons.

---

## 1. Project Overview & Architecture

**DisasterShield** is a centralized full-stack disaster management and emergency response system. During natural disasters (floods, cyclones, earthquakes, fires), emergency communications often suffer from fragmentation between affected civilians, community volunteers, dispatch rescue units, and government command centers.

DisasterShield solves this by providing **four interconnected operational portals** sharing a single, persistent **SQLite relational database** with real-time periodic synchronization:

1. **People Portal**: Allows citizens in distress to submit emergency assistance requests with contact information, affected area, emergency category, number of people affected, and special medical/shelter requirements. Generates a unique tracking ID (`REQ-YYYY-XXXX`) and allows tracking triage updates without exposing private citizen data.
2. **Volunteer Portal**: Allows certified community volunteers to register, toggle active availability status (`Available`, `Busy`, `Off-duty`), accept field tasks dispatched by rescue teams, and log mission completion reports.
3. **Rescue Team Portal**: Real-time dispatch dashboard featuring live KPI counters, status triage controls (`Pending` &rarr; `In Progress` &rarr; `Completed`), volunteer task assignment modal, and an interactive **Leaflet Incident Geography Map**.
4. **Head Office Portal**: Executive administration console offering real-time database charts (Category Distribution, Triage Pipeline Breakdown), live audit log of all system transitions, and one-click **CSV export** for official incident reporting.

---

## 2. Key Features

- **Full-Stack Relational Architecture**: Built on Node.js/Express with pure SQLite relational database persistence (`data/disastershield.sqlite`).
- **Real-Time Multi-Laptop Synchronization**: Built-in 3-second polling mechanism synchronizes all submissions, status changes, and task updates across multiple devices on the same Wi-Fi network.
- **Multilingual Support (3 Languages)**: Full natural language switching across all portals in:
  - **English** (Default)
  - **Tamil (தமிழ்)**
  - **Hindi (हिन्दी)**
- **Role-Based Access Control (RBAC)**: Secure authentication with encrypted passwords (`bcryptjs`), cryptographic session tokens, and route protection guards preventing unauthorized portal access.
- **Incident Mapping**: Interactive Leaflet map with color-coded status pins (Amber for Pending, Blue for In Progress, Green for Completed).
- **Executive Reporting**: One-click download of all emergency database records as a CSV spreadsheet.
- **Two-Laptop Viva Demo Mode**: Embedded network helper displaying host IP for seamless multi-laptop college demonstration.

---

## 3. Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Leaflet Maps
- **Backend**: Node.js & Express REST API (`server.ts`, `server/routes/api.ts`)
- **Database**: SQLite Relational Engine (`sql.js`), persistent file storage (`data/disastershield.sqlite`)
- **Security**: Bcrypt password hashing, HMAC-SHA256 token verification, parameterized SQL queries
- **Runtime Environment**: Vite & tsx on Node.js

---

## 4. Pre-Configured Demonstration Accounts

For viva presentations and testing, DisasterShield comes pre-seeded with test accounts:

| Role | Username / Email | Password | Accessible Portals |
| :--- | :--- | :--- | :--- |
| **Rescue Team** | `rescue@shield.org` | `rescue123` | Rescue Dispatch Console & Map |
| **Volunteer** | `volunteer@shield.org` | `volunteer123` | Volunteer Desk & Assigned Tasks |
| **Head Office** | `headoffice@shield.org` | `office123` | Head Office Analytics & CSV Export |
| **Citizen (People)** | `citizen@shield.org` | `citizen123` | Emergency Submission & Tracker |

> *Tip: On the Sign In page, you can simply click any of the "Quick Demo Credentials" chips to autofill login credentials instantly.*

---

## 5. Folder Structure

```
DisasterShield/
├── data/
│   └── disastershield.sqlite       # Relational SQLite database file (persisted on disk)
├── server/
│   ├── db.ts                       # SQLite initialization, schema, seeds & query helpers
│   ├── auth.ts                     # Password hashing, token creation & role guards
│   ├── routes/
│   │   └── api.ts                  # REST API routes for requests, volunteers, tasks, stats
│   └── test_workflow.ts            # Automated test suite verifying all required workflows
├── src/
│   ├── assets/
│   │   └── images/                 # High-resolution disaster response photography
│   ├── components/
│   │   ├── Navbar.tsx              # Strict 3-zone responsive top bar & language selector
│   │   ├── Footer.tsx              # 112 emergency helpline notice & quick links
│   │   ├── EmergencyNotice.tsx     # National helpline 112 notice banner
│   │   ├── EmergencyMap.tsx        # Leaflet incident mapping with color pins
│   │   ├── Charts.tsx              # SVG Category & Status breakdown charts
│   │   └── MultiLaptopModal.tsx    # Step-by-step 2-laptop Wi-Fi presentation helper
│   ├── context/
│   │   ├── AuthContext.tsx         # User authentication & token state provider
│   │   └── LanguageContext.tsx     # English, Tamil, and Hindi i18n provider
│   ├── i18n/
│   │   └── translations.ts         # Multilingual dictionaries for all 4 portals
│   ├── pages/
│   │   ├── HomePage.tsx            # Landing page with hero banner & portal cards
│   │   ├── LoginPage.tsx           # Split-screen role-based login & registration
│   │   ├── PeoplePortal.tsx        # Emergency request submission & status tracker
│   │   ├── VolunteerPortal.tsx     # Volunteer profile & task action desk
│   │   ├── RescuePortal.tsx        # Command dispatch dashboard, triage & volunteer assignment
│   │   └── HeadOfficePortal.tsx    # State command center, charts, audit log & CSV export
│   ├── types.ts                    # Shared TypeScript interfaces
│   ├── index.css                   # Tailwind CSS styling and theme definitions
│   └── main.tsx                    # React client application entry
├── index.html                      # HTML entry with metadata and Plus Jakarta Sans font
├── package.json                    # Dependencies & npm scripts
├── server.ts                       # Full-stack Express server with Vite middleware
├── tsconfig.json                   # TypeScript compiler configuration
└── vite.config.ts                  # Vite build tool configuration
```

---

## 6. Installation & Setup Guide (Beginner Friendly)

### Prerequisites:
1. **Node.js**: Install Node.js LTS (v18 or higher) from [nodejs.org](https://nodejs.org).
2. **VS Code**: Install Visual Studio Code from [code.visualstudio.com](https://code.visualstudio.com).

### Step-by-Step Installation:

1. **Extract or Clone the Project**:
   Open VS Code, click **File &gt; Open Folder**, and select the `DisasterShield` project directory.

2. **Open the Integrated Terminal in VS Code**:
   Press `Ctrl + ~` (or go to `Terminal > New Terminal`).

3. **Install Dependencies**:
   Type the following command and press Enter:
   ```bash
   npm install
   ```

4. **Start the Application**:
   Type the following command:
   ```bash
   npm run dev
   ```
   You will see:
   ```
   [DisasterShield] Emergency Coordination Server online at http://0.0.0.0:3000
   [DisasterShield] Local network ready for multi-laptop demonstrations.
   ```

5. **Open in Your Browser**:
   Open Google Chrome, Edge, or Firefox and go to:
   ```
   http://localhost:3000
   ```

---

## 7. How to Demonstrate across Two Laptops on the Same Wi-Fi

This setup demonstrates real-time distributed disaster management during your viva:

1. **Connect Both Laptops to the Same Wi-Fi Network**:
   - Both Laptop 1 and Laptop 2 must be connected to the same Wi-Fi router (or connect both to a smartphone mobile hotspot).

2. **Laptop 1 (Host Server)**:
   - Run `npm run dev`.
   - Find Laptop 1's local IP address (or click the **Two-Laptop Setup Guide** button in the app header).
   - Example Host IP: `192.168.1.15`.
   - On Laptop 1, open `http://localhost:3000` and sign in as **Rescue Team** (`rescue@shield.org` / `rescue123`).

3. **Laptop 2 (Client Laptop)**:
   - Open browser and navigate to:
     ```
     http://192.168.1.15:3000
     ```
     *(Replace `192.168.1.15` with Laptop 1's actual IP)*.
   - On Laptop 2, submit an emergency assistance request from the **People Portal** or sign in as a **Volunteer** (`volunteer@shield.org` / `volunteer123`).

4. **Verify Live Synchronization**:
   - As soon as Laptop 2 submits the emergency request, it appears on Laptop 1's Rescue Team dashboard within **3 seconds** without refreshing the page!

### Firewall Troubleshooting for Windows:
If Laptop 2 cannot connect to Laptop 1:
- Open **Windows Defender Firewall with Advanced Security**.
- Click **Inbound Rules &gt; New Rule**.
- Select **Port &gt; TCP &gt; Specific local ports: 3000**.
- Select **Allow the connection**, name it `DisasterShield`, and click **Finish**.

---

## 8. Verifying Core Demonstration Workflows

- **Test 1 (Submit Emergency)**: Go to People Portal &rarr; Fill in name, contact number, area, category &rarr; Submit &rarr; Copy Request ID (`REQ-YYYY-XXXX`).
- **Test 2 (Triage in Rescue Portal)**: Sign in as Rescue Team &rarr; Locate request &rarr; Change status from `Pending` to `In Progress`.
- **Test 3 (Volunteer Task Assignment)**: In Rescue Portal, click `Assign Volunteer` on the incident &rarr; Select volunteer `Karthik Raja` &rarr; Dispatch.
- **Test 4 (Volunteer Action)**: Sign in on Laptop 2 as Volunteer &rarr; Notice new task under `Your Assigned Relief Tasks` &rarr; Click `Accept Mission`, then `Mark Mission Completed`.
- **Test 5 (Head Office Intelligence)**: Sign in as Head Office &rarr; Verify category breakdown charts and live audit trail update &rarr; Click `Export Requests as CSV` to download spreadsheet report.
- **Test 6 (Multilingual Switching)**: Click the Globe icon in the navigation bar &rarr; Switch between **English**, **தமிழ் (Tamil)**, and **हिन्दी (Hindi)** &rarr; Verify all navigation, forms, categories, and labels translate instantly.

---

## 9. Important Safety & Disclaimer

> **Emergency Notice**:
> For real life-threatening emergencies in India, dial **112** (National Emergency Helpline) or contact local police and fire services immediately.  
> DisasterShield is an academic prototype and student demonstration system designed to showcase disaster coordination technologies.
