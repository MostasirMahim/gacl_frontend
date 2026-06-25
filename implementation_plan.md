# Integration Implementation Plan: Resolving System Holes, Bugs & Missing Workflows

This plan provides a comprehensive overview of the bugs, architectural holes, and missing workflows identified across the 5 integration phases, along with the proposed step-by-step corrections for both the **Backend (Django)** and **Frontend (Next.js)**.

---

## User Review Required

> [!IMPORTANT]
> **SSLCommerz Payment Flow Overhaul**
> Currently, the backend marks invoices as `"paid"` immediately when the payment method is selected as `"sslcommerz"`, before any payment is actually processed. We propose changing the initial invoice status to `"unpaid"` or `"due"` for SSLCommerz checkout. It will only be marked `"paid"` upon a successful callback from the SSLCommerz IPN validator. 
> 
> Similarly, for Reservations, selecting `"sslcommerz"` will leave the reservation in `pending_payment` until the IPN callback validates the payment and shifts it to `confirmed`.

> [!WARNING]
> **Vendor Re-selection Flow**
> Competing vendor offers are currently soft-deleted (`is_active=False`) upon selecting an offer, hiding them forever from the UI and locking in the choice. We propose keeping rejected offers active (`is_active=True`) but setting their status to `"rejected"`, and modifying the selection endpoint to allow switching vendors.

---

## Identified Issues & Proposed Changes

---

### 1. Attendance & Guest Registration (Phase 1)

#### Issues:
- **No Temporary Card Assignment in Frontend**: The guest registration form does not ask for or send a `temporary_card` UID/ID. Consequently, guest records are created with a null card link, making RFID scans impossible.
- **Card State Leak**: When a guest checks out via RFID scan, the card is not unlinked from the guest, nor is `is_assigned` updated to `False`. The card remains bound to the guest, meaning future scans will mistakenly check the same guest back in.
- **No Double-Assignment Protection**: Multiple guests can be assigned the same `temporary_card` concurrently.

#### Proposed Backend Changes:
- **[MODIFY] [serializers.py](file:///F:/Pepoltek/gacl/member_management_backend/attendance/serializers.py)**:
  - Add validation in `GuestSerializer` ensuring that the selected `temporary_card` is not already assigned to another active guest (`is_assigned=True`).
  - Override `create` in `GuestSerializer` to set `temporary_card.is_assigned = True` when a card is linked.
- **[MODIFY] [views.py](file:///F:/Pepoltek/gacl/member_management_backend/attendance/views.py)**:
  - Update `CardScanView` to release guest temporary cards upon checkout: set `guest.temporary_card = None` and set `card.is_assigned = False`.

#### Proposed Frontend Changes:
- **[MODIFY] [GuestRegisterForm.tsx](file:///F:/Pepoltek/gacl/frontend/Member-Management-Nextjs/src/components/attendance/GuestRegisterForm.tsx)**:
  - Add a dropdown query of available temporary cards (`/api/attendance/v1/attendance/cards/?card_type=guest_temporary&is_assigned=false`) to select one when registering a guest.

---

### 2. Restaurant Cross-Ordering & Inventory (Phase 2)

#### Issues:
- **Restaurant Inventory Leak on Cross-Orders**: When a member orders a restaurant item from a beverage outlet, the outlet's `_deduct_inventory` skips it because `outlet_item_id` is null. There is no other backend service that deducts the restaurant menu item's recipe ingredients.

#### Proposed Backend Changes:
- **[MODIFY] [order_service.py](file:///F:/Pepoltek/gacl/member_management_backend/outlet/services/order_service.py)**:
  - Update `_deduct_inventory` to handle restaurant-sourced line items: query `RestaurantItemRecipe` for `oi.restaurant_item` and deduct stock from the restaurant's `RestaurantInventoryItem`.

---

### 3. Reservations & Cancellations (Phase 3)

#### Issues:
- **Financial Disconnect on Cancel**: Cancelling a paid reservation leaves the invoice status as `"paid"` and doesn't issue any refund or credit note.
- **Retroactive Cancellations**: Active or completed reservations can be cancelled retroactively.

#### Proposed Backend Changes:
- **[MODIFY] [reservation_service.py](file:///F:/Pepoltek/gacl/member_management_backend/reservation/services/reservation_service.py)**:
  - Add validation in `cancel_reservation` to ensure `reservation.start_time` is in the future.
  - Generate a financial adjustment/refund log, or mark the linked invoice as cancelled/refunded where applicable.

---

### 4. Payroll & Vendor Lock-in (Phase 4)

#### Issues:
- **Payroll Loan Repayment Misattribution**: If a staff member has multiple active loans, the payment function `pay_payslip` grabs the *first* active loan and applies the deduction for all lines, double-paying the first loan and neglecting the others.
- **Permanent Vendor Lock-in**: Selecting an offer soft-deletes (`is_active=False`) all competing offers, causing them to disappear from the UI. Also, selecting a rejected offer is explicitly blocked without any way to re-offer.
- **Transactional Risk in Salary Structures**: Frontend performs separate requests to save a structure and then save each line sequentially. If a line request fails, the structure is left corrupted.

#### Proposed Backend Changes:
- **[MODIFY] [payroll_service.py](file:///F:/Pepoltek/gacl/member_management_backend/payroll/services/payroll_service.py)**:
  - Change loan deduction line format during payslip generation to `Loan repayment (ID: {loan.id})`.
  - In `pay_payslip`, parse the loan ID from the component name to ensure repayments are credited to the correct loan.
- **[MODIFY] [vendor_service.py](file:///F:/Pepoltek/gacl/member_management_backend/vendor/services/vendor_service.py)**:
  - Remove `is_active=False` update for rejected offers in `select_offer` to keep them visible.
  - Allow re-selecting a rejected offer (automatically rejecting the previously selected one).
  - Expose a direct endpoint/view that accepts bulk salary structure lines in a single transactional payload.

#### Proposed Frontend Changes:
- **[MODIFY] [SalaryStructureForm.tsx](file:///F:/Pepoltek/gacl/frontend/Member-Management-Nextjs/src/components/payroll/SalaryStructureForm.tsx)**:
  - Call the new bulk structure API rather than looping POST calls, preventing corrupted database records.

---

### 5. SSLCommerz Payment Gateway Integration (Phase 5)

#### Issues:
- **Immediate Invoice Settlement**: Billing with `"sslcommerz"` immediately marks the invoice as `"paid"` on the backend. This causes the hosted gateway initiation call `/sslcommerz/initiate/` to fail with a `400: Invoice already paid`.
- **Missing Redirects**: The frontend ignores the `"sslcommerz"` mode, toast-confirming payment without calling the initiate endpoint or redirecting the browser to SSLCommerz's sandbox payment page.

#### Proposed Backend Changes:
- **[MODIFY] [billing_service.py](file:///F:/Pepoltek/gacl/member_management_backend/restaurant/services/billing_service.py)** & **[billing_service.py](file:///F:/Pepoltek/gacl/member_management_backend/outlet/services/billing_service.py)**:
  - Exclude `"sslcommerz"` from `is_cash_settled`. Mark these invoices as `"unpaid"`, and set `balance_due = total_amount` initially.
- **[MODIFY] [payment_service.py](file:///F:/Pepoltek/gacl/member_management_backend/reservation/services/payment_service.py)**:
  - If `payment_mode == "sslcommerz"`, set invoice status to `"unpaid"` and do not mark reservation as `"confirmed"` or `advance_paid = True` yet.
- **[MODIFY] [sslcommerz_service.py](file:///F:/Pepoltek/gacl/member_management_backend/finance_core/services/sslcommerz_service.py)**:
  - When validation succeeds in `validate_ipn`, resolve the invoice type:
    - If it's a Reservation invoice, set `reservation.status = "confirmed"` and `reservation.advance_paid = True`.
    - If it's a Restaurant/Outlet order invoice, update the order status to `"billed"`.

#### Proposed Frontend Changes:
- **[MODIFY] [OrdersList.tsx](file:///F:/Pepoltek/gacl/frontend/Member-Management-Nextjs/src/components/restaurant_ordering/OrdersList.tsx)**, **[OutletOrdersList.tsx](file:///F:/Pepoltek/gacl/frontend/Member-Management-Nextjs/src/components/outlet/OutletOrdersList.tsx)**, and **[ReservationsList.tsx](file:///F:/Pepoltek/gacl/frontend/Member-Management-Nextjs/src/components/reservation/ReservationsList.tsx)**:
  - If `"sslcommerz"` is chosen, after getting the successful bill/pay response, fetch `/api/finance/v1/finance/sslcommerz/initiate/<invoice_id>/`.
  - On receiving the `gateway_url`, perform a client-side redirect: `window.location.href = data.gateway_url`.

---

## Verification Plan

### Manual Verification
1. **Attendance**: Register a guest with an available temporary card. Scan the card to check in. Scan again to check out. Verify that the card is released and `is_assigned` becomes `false`.
2. **Cross-Ordering**: Place a restaurant order from the Cigar Lounge. Advance it to Preparing. Verify that the restaurant inventory levels decrease correctly.
3. **Payroll**: Add two loans for a staff member. Run payroll. Verify that payslip payments debit the correct loan balances separately.
4. **Vendor Select**: Select Vendor A. Competing offers should change status to rejected but remain visible. Change selection to Vendor B. Verify status updates correctly.
5. **SSLCommerz**: Bill an order using SSLCommerz. Verify it redirects you to the SSLCommerz sandbox page. Pay via the sandbox, and verify the backend IPN callback marks the order/reservation as paid and confirmed.
