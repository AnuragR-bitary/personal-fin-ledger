# Database Schema

The database stores users, expenses, participants, and payments.

---

# users

Stores the owner and friends.

Columns

id (uuid, primary key)

name (text)

is_owner (boolean)

created_at (timestamp)

Example

| id | name | is_owner |
|----|------|----------|
| 1 | Anurag | true |
| 2 | Rahul | false |

---

# expenses

Represents an event where someone paid money.

Columns

id (uuid)

paid_by_user_id (uuid → users.id)

amount (numeric)

description (text)

expense_date (date)

created_at (timestamp)

Example

| id | paid_by | amount | description |
|----|--------|--------|-------------|
| 1 | Anurag | 900 | Dinner |

---

# expense_participants

Stores how much each user owes from an expense.

Columns

id (uuid)

expense_id (uuid → expenses.id)

user_id (uuid → users.id)

owed_amount (numeric)

Example

| expense_id | user | owed |
|------------|------|------|
| 1 | Rahul | 450 |
| 1 | Aman | 450 |

---

# payments

Records repayments.

Columns

id (uuid)

from_user_id (uuid)

to_user_id (uuid)

amount (numeric)

method (text)

paid_at (timestamp)

created_at (timestamp)

Example

| from | to | amount |
|------|----|--------|
| Rahul | Anurag | 200 |

---

# Balance Calculation

Balance is derived.

remaining_balance =
sum(owed_amount) - sum(payments)

Debt is closed when:

remaining_balance <= 0