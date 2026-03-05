# Project Setup Guide

Step 1

Create GitHub repository

debt-tracker-app

---

Step 2

Create folder structure

debt-tracker-app

frontend
backend
docs

---

Step 3

Initialize backend

cd backend
npm init -y

Install dependencies

npm install pg uuid
npm install serverless
npm install serverless-offline

---

Step 4

Backend folder structure

backend

handlers
services
queries
serverless.yml

---

Step 5

Setup PostgreSQL

Create database

debt_tracker_db

---

Step 6

Create tables

users
expenses
expense_participants
payments

---

Step 7

Create database connection pool

services/db.ts

---

Step 8

Implement APIs

users
expenses
payments
balances

---

Step 9

Setup React frontend

cd frontend
npm create vite@latest

Install axios

---

Step 10

Connect frontend to backend APIs

---

Step 11

Run system locally

serverless offline
npm run dev