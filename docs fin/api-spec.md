# API Specification

Backend runs on AWS Lambda with API Gateway.

---

# Users

Create friend

POST /users

Body

{
  "name": "Rahul"
}

Response

{
  "id": "uuid",
  "name": "Rahul"
}

---

Get all users

GET /users

---

# Expenses

Create expense

POST /expenses

Body

{
  "description": "Dinner",
  "amount": 900,
  "participants": [
    {
      "userId": "rahul_id",
      "owedAmount": 450
    },
    {
      "userId": "aman_id",
      "owedAmount": 450
    }
  ]
}

Process

1 insert expense
2 insert expense_participants rows

---

Get expenses

GET /expenses

---

# Payments

Record repayment

POST /payments

Body

{
  "fromUserId": "rahul_id",
  "toUserId": "owner_id",
  "amount": 200,
  "method": "UPI"
}

---

# Balance

GET /balances

Example response

[
  {
    "name": "Rahul",
    "balance": 250
  },
  {
    "name": "Aman",
    "balance": 450
  }
]