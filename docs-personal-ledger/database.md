# Database Schema

The database stores users, expenses, participants, and payments.

This schema uses a **ledger-style calculation model**:
- Expenses create debts.
- Payments reduce debts.
- Balances are derived dynamically rather than stored.

---

# users

Stores the owner and friends.

Columns

id (uuid, primary key)

name (text, not null)

is_owner (boolean, default false)

created_at (timestamp with time zone)

Example

| id | name | is_owner |
|----|------|----------|
| 1 | Anurag | true |
| 2 | Rahul | false |

---

# expenses

Represents an event where someone paid money.

Columns

id (uuid, primary key)

paid_by_user_id (uuid → users.id, indexed)

amount (numeric(10,2), not null)

description (text)

expense_date (date, not null)

created_at (timestamp with time zone)

Indexes:
`idx_expenses_paid_by` ON `paid_by_user_id`

Example

| id | paid_by | amount | description |
|----|--------|--------|-------------|
| 1 | Anurag | 900.00 | Dinner |

---

# expense_participants

Stores how much each user owes from an expense.

Columns

id (uuid, primary key)

expense_id (uuid → expenses.id, indexed)

user_id (uuid → users.id, indexed)

owed_amount (numeric(10,2), not null)

Constraints:
`UNIQUE (expense_id, user_id)` — Prevents duplicate duplicate participants for a given expense.

Indexes:
`idx_expense_participants_expense_id` ON `expense_id`
`idx_expense_participants_user_id` ON `user_id`

Example

| expense_id | user | owed |
|------------|------|------|
| 1 | Rahul | 450.00 |
| 1 | Aman | 450.00 |

---

# payments

Records repayments.

Columns

id (uuid, primary key)

from_user_id (uuid → users.id, indexed)

to_user_id (uuid → users.id, indexed)

amount (numeric(10,2), not null)

method (text)

paid_at (timestamp with time zone)

created_at (timestamp with time zone)

Constraints:
`CHECK (from_user_id <> to_user_id)` — Prevents self-payments.

Indexes:
`idx_payments_from_user` ON `from_user_id`
`idx_payments_to_user` ON `to_user_id`

Example

| from | to | amount |
|------|----|--------|
| Rahul | Anurag | 200.00 |

---

# Balance Calculation

Balance is derived.

remaining_balance = sum(owed_amount) - sum(payments)

Debt is closed when:

remaining_balance <= 0