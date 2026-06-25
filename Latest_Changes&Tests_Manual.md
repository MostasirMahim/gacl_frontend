# Latest Changes and Elaborate Testing Guide

This document provides a comprehensive breakdown of exactly what was modified in both the **Backend** and **Frontend**, separated into the 5 distinct integration phases. Crucially, every section contains an **Elaborate Testing Scenario** walking you through setting up prerequisite data and testing the features step-by-step.

---

## 1. Part 1: Attendance & Restaurant Ordering

**Feature Overview & Goal:**  
To introduce automated RFID-based access control and streamline the restaurant's operational workflow. Members and staff check in by scanning their physical RFID cards, creating an auditable log of club presence. Simultaneously, the restaurant module enables a digital "Kitchen Display" workflow, allowing chefs to receive real-time orders from the front-of-house and visually advance food statuses from "preparing" to "served" before billing.

### Backend Changes
- **New Apps:** Dropped in the `attendance` app.
- **Modified Apps:** Appended order management and kitchen display logic to `restaurant/models.py`, `urls.py`, and `admin.py`.
- **URLs:** Registered `/api/attendance/` in `config/urls.py`.

### Frontend Changes
- **Pages Added:** `/attendance` and `/restaurant-orders`.
- **Components:** `GuestRegisterForm`, `AttendanceRecordsTable`, `KitchenDisplay`, `OrdersList`.
- **Navigation:** Added **"Attendance"** and **"Kitchen & Orders"** to the sidebar.

### 🧪 Elaborate Testing Scenario
**Step 1: Set up a Member and an RFID Card**
1. Note the name of an existing active member from **MemberSphere -> View Members**.
2. Go to the backend Django Admin (`http://127.0.0.1:8000/admin/`).
3. Log in as your superuser. Scroll down to **Attendance** -> **RFID Cards** and click **Add**.
4. Enter a dummy UID (e.g., `123456789`), set card type to `Member`, pick your member, and save.

**Step 2: Test Attendance Check-in**
1. In the Next.js frontend, go to **Attendance** -> **Check-in** tab.
2. Type the UID (`123456789`) and press Enter. A toast confirms they are **Checked in**.
3. Type the exact same UID again. The system detects the open session and automatically marks them **Checked out**.
4. Check the **Records** tab to verify the timestamps.

**Step 3: Test Guest Registration**
1. Go to the **Register Guest** tab.
2. Enter a fake guest name and phone number. Set **Host Type** as `Member`, and select your member from the dropdown.
3. Submit. Switch to the **Records** tab to verify the guest appears.

**Step 4: Set up a Restaurant Order**
1. Go to **Restaurant management -> Restaurants** and create a Restaurant (e.g., "Main Dining").
2. Go to **Add restaurant item** and create a menu item (e.g., "Burger").
3. Go to **View cart / Checkout**, add the Burger, select your member, and check out to generate a live Order.

**Step 5: Test the Kitchen Flow**
1. Immediately go to **Restaurant management -> Kitchen & Orders**.
2. In the **Kitchen Display** tab, you will see a live card for the order marked `Confirmed`.
3. Click **Start Preparing** (status -> `preparing`).
4. Click **Mark Ready** (status -> `ready`).
5. Click **Serve**. The card will disappear from the active kitchen view.

**Step 6: Test Billing**
1. Click the **All Orders** tab. Locate the order you just served.
2. Click the **Bill** button, choose **Cash**, and confirm. The order will be marked `billed`.

---

## 2. Part 2: Beverage Outlets (Bar, Cigar Lounge, Tea Lounge)

**Feature Overview & Goal:**  
To digitize specialty beverage outlets and enforce strict physical boundary rules for serving specialty items. Administrators define distinct Outlets and their specific inventory. Crucially, a "Cross-Ordering" rule engine automatically dictates whether a member sitting in one location (like the Cigar Lounge) is legally permitted to request drinks from another location (like the Bar), ensuring compliance and precise inventory deduction across different physical rooms.

### Backend Changes
- **New Apps:** Dropped in the `outlet` app.
- **Database:** Seeded initial `CrossOrderingRule` data.

### Frontend Changes
- **Pages Added:** `/outlets`.
- **Components:** Outlet Creation, Outlet Menus, `CrossOrderingRules` UI, and `PreparationQueue`.
- **Navigation:** Added **"Outlets (Bar/Lounge)"** to the sidebar.

### 🧪 Elaborate Testing Scenario
**Step 1: Create Outlets**
1. Go to **Outlets (Bar/Lounge)** -> **Create Outlet** tab.
2. Create an outlet of type `Bar` (e.g., "Main Bar") and an outlet of type `Cigar Lounge` (e.g., "VIP Cigar Room").

**Step 2: Add Menu Items**
1. Go to the **Post Item** tab.
2. Create an item for the Bar (e.g., "Whiskey") and an item for the Cigar Lounge (e.g., "Cuban Cigar").

**Step 3: Configure Cross-Ordering Rules**
1. Go to the **Cross-Ordering Rules** tab.
2. Create a rule where **Source** = `Bar` and **Target** = `Cigar Lounge`. Set it to **Allowed**.
3. Create a rule where **Source** = `Cigar Lounge` and **Target** = `Bar`. Set it to **Denied**.

**Step 4: Place Orders & Manage Queue**
1. Using an API client or checkout UI, place an order for a "Cuban Cigar" originating from the "Main Bar". It should succeed.
2. Place an order for "Whiskey" originating from the "Cigar Lounge". The API will explicitly block it due to the rule.
3. Go to the **Preparation Queue** tab. You will see the successful cross-order. Click through the status buttons to advance it to `served`.

**Step 5: Bill the Order**
1. Go to the **Orders** tab. Locate the served order.
2. Click **Bill**, select a payment method, and complete the transaction.

---

## 3. Part 3: Reservations

**Feature Overview & Goal:**  
To provide a comprehensive booking engine for physical club resources like tennis courts, pools, and card rooms. Administrators define bookable resources, caps on concurrent capacity, and advance payment requirements. Members can request timeslots, and the system performs real-time capacity checks to prevent double-booking before holding the reservation pending an advance payment.

### Backend Changes
- **New Apps:** Dropped in the `reservation` app to handle capacities and bookings.

### Frontend Changes
- **Pages Added:** `/reservations`.
- **Components:** `ResourceForm`, `BookingForm`, `ReservationsList`.
- **Navigation:** Added **"Reservations"** to the sidebar.

### 🧪 Elaborate Testing Scenario
**Step 1: Define a Resource**
1. Go to **Reservations** -> **Add Resource**.
2. Create a new resource named "Tennis Court 1". Set capacity to `4`, and set an **Advance Payment** amount (e.g., 500).

**Step 2: Check Availability**
1. Go to the **New Booking** tab.
2. Select "Tennis Court 1" and pick a time slot for tomorrow. 
3. Click **Check Availability**. The system will ping the database and return `Capacity 4/4 free`.

**Step 3: Create Booking**
1. Set party size to 2, select a member, and click **Create Reservation**.
2. Because the court requires an advance, the reservation status will default to `pending_payment`.

**Step 4: Pay Advance & Cancel**
1. Switch to the **All Reservations** tab.
2. Find the pending booking and click **Pay Advance**. Process the payment. The status will immediately shift to `confirmed`.
3. To free up the slot for other members, click **Cancel** on the confirmed booking.

---

## 4. Part 4: Payroll, Vendor, Finance & Event Costs

**Feature Overview & Goal:**  
To centralize the club's financial accounting, staff remuneration, and third-party supplier management into a single ledger. The Payroll module dynamically calculates gross/net payslips based on base salary and components. The Vendor module aggregates service offers and processes payouts. The Finance core tracks these outgoing expenses alongside Event expenditures, projecting everything into a unified, real-time Profit & Loss dashboard.

### Backend Changes
- **New Apps:** Dropped in `payroll`, `vendor`, and `finance_core`.
- **Modified Apps:** Appended expense tracking logic to `event` app.

### Frontend Changes
- **Pages Added:** `/payroll`, `/vendors`, `/finance`.
- **Navigation:** Added **"Payroll"**, **"Vendor Management"**, and **"Finance & Reports"** to the sidebar.

### 🧪 Elaborate Testing Scenario
**Step 1: Setup a Payroll Run**
1. Ensure you have active staff profiles. Go to **Payroll** -> **Generate Run**.
2. Enter the current Month and Year and click generate.
3. Expand the generated accordion to view the calculated payslips (Gross, Net, Deductions) for the staff.
4. Click **Pay** on a payslip. This executes the transfer and automatically logs the expense in the central ledger.

**Step 2: Manage Vendors**
1. Go to **Vendor Management**. 
2. In the "Offers & Selection" tab, locate a service category that has multiple offers.
3. Click **Select** on the best offer. The backend will automatically disable the competing offers.
4. Click **Pay** on the active vendor. This triggers another expense entry in the central ledger.

**Step 3: Record Event Expense**
1. Go to **Finance & Reports** -> **Event Costs**.
2. Select an upcoming Event from the dropdown. Record a new expense (e.g., "DJ Services", Qty 1, Cost 1000).
3. The dashboard will instantly compare this expense against the event's ticket income to show profitability.

**Step 4: View Finance Dashboard**
1. Go to **Finance & Reports** -> **Dashboard**.
2. Adjust the date range. You will see a comprehensive Profit & Loss chart explicitly breaking down the Payroll payments, Vendor payments, and Event expenses you just executed!

---

## 5. EXTEND: SMS, SSLCommerz, Celery & Setup Forms

**Feature Overview & Goal:**  
To plug the internal operational applications into the outside world via payment gateways, telecom providers, and background task schedulers. It replaces placeholder development stubs with live integrations: Bills can now be paid dynamically using the SSLCommerz gateway sandbox, automated scheduled tasks (like monthly overdue notices) are pushed continuously via background Celery workers, and OTPs are dispatched through a real HTTP SMS adapter.

### Backend Changes
- **SMS System:** Overwrote `notifications.py` for live HTTP SMS routing.
- **SSLCommerz:** Injected `sslcommerz_service.py` for IPN redirects.
- **Celery Beat:** Scheduled `send_monthly_due_reminders`.

### Frontend Changes
- **Payroll UI Extended:** Added **Salary Structure** and **Components** tabs.
- **Vendor UI Extended:** Added **Add Vendor / Offer** tab.

### 🧪 Elaborate Testing Scenario
**Step 1: Salary Structure Builder**
1. Go to **Payroll** -> **Components** tab. Create an "Earning" (e.g., Basic Wage) and a "Deduction" (e.g., Tax).
2. Go to the **Salary Structure** tab. Select a staff member, input their base rate, and dynamically attach the components you just created to build their profile.

**Step 2: Vendor Builder**
1. Go to **Vendor Management** -> **Add Vendor/Offer**.
2. Use the panels to add a new Vendor, create a Service Category (e.g., "Plumbing"), and then generate an Offer linking the vendor's price to the category.

**Step 3: Test SSLCommerz Hook**
1. Navigate to any billing table (e.g., Restaurant All Orders, or Reservations).
2. Click **Bill** and select **SSLCommerz** as the method.
3. The UI will instantly communicate with the backend `/initiate/` route and redirect your browser to the SSLCommerz gateway sandbox URL.

**Step 4: Test Monthly Reminders (Celery)**
1. To test the scheduled reminders without waiting for the 28th of the month, open your backend terminal.
2. Run `python manage.py shell`.
3. Type: `from finance_core.tasks import send_monthly_due_reminders` and press Enter.
4. Type: `send_monthly_due_reminders()` and press Enter.
5. The console will output `Monthly due reminders sent: X`, verifying that the script successfully scanned for overdue members and triggered the SMS adapter!
