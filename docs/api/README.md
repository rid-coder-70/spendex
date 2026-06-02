# SpendGuard API Documentation

Base URL: `http://localhost:5000/api`

> **Authentication:** All protected endpoints require the header:
> `Authorization: Bearer <token>`

---

## Table of Contents

- [Authentication](#authentication)
- [Transactions](#transactions)
- [Analytics](#analytics)
- [Subscriptions](#subscriptions)
- [Categories](#categories)
- [Upload (CSV)](#upload-csv)
- [Reports](#reports)
- [Public](#public)
- [Health Check](#health-check)
- [Error Responses](#error-responses)

---

## Authentication

### POST `/auth/register`
Register a new user account.

**Request Body:**
```json
{
  "name": "Ridoy Baidya",
  "email": "user@example.com",
  "password": "Secure123!"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGci...",
    "user": { "id": 1, "name": "Ridoy Baidya", "email": "user@example.com" }
  }
}
```

---

### POST `/auth/login`
Login and receive a JWT token.

**Request Body:**
```json
{ "email": "user@example.com", "password": "Secure123!" }
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGci...",
    "user": { "id": 1, "name": "Ridoy Baidya", "email": "user@example.com" }
  }
}
```

---

### GET `/auth/me` 🔒
Get the currently authenticated user's profile.

**Response (200):**
```json
{
  "success": true,
  "data": { "id": 1, "name": "Ridoy Baidya", "email": "user@example.com" }
}
```

---

### PUT `/auth/profile` 🔒
Update the authenticated user's profile.

**Request Body:**
```json
{ "name": "Ridoy Baidya Updated", "phone": "+8801712345678" }
```

---

## Transactions

> All transaction endpoints require authentication 🔒

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/transactions` | Get all transactions (paginated, filterable) |
| GET | `/transactions/:id` | Get a single transaction by ID |
| POST | `/transactions` | Create a new transaction |
| PUT | `/transactions/:id` | Update an existing transaction |
| DELETE | `/transactions/:id` | Delete a transaction |

### GET `/transactions`

**Query Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 20) |
| `type` | string | `income` or `expense` |
| `category_id` | number | Filter by category |
| `start_date` | string | ISO date string (e.g. `2026-01-01`) |
| `end_date` | string | ISO date string |

**Response (200):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 1,
        "amount": 150.00,
        "type": "expense",
        "description": "Netflix subscription",
        "merchant": "Netflix",
        "transaction_date": "2026-06-01",
        "payment_method": "Credit Card",
        "category_name": "Entertainment"
      }
    ],
    "total": 42,
    "page": 1,
    "limit": 20
  }
}
```

### POST `/transactions`

**Request Body:**
```json
{
  "amount": 150.00,
  "type": "expense",
  "description": "Netflix subscription",
  "merchant": "Netflix",
  "transaction_date": "2026-06-01",
  "payment_method": "Credit Card",
  "category_id": 3
}
```

---

## Analytics

> All analytics endpoints require authentication 🔒

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/analytics/summary` | Monthly income vs. expense summary |
| GET | `/analytics/category-breakdown` | Spending broken down by category |
| GET | `/analytics/spending-trends` | Weekly/monthly spending trends |
| GET | `/analytics/top-merchants` | Top merchants by spend |
| GET | `/analytics/income-vs-expense` | Income vs expense comparison over time |

### GET `/analytics/summary`

**Query Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `month` | number | Month (1–12) |
| `year` | number | Year (e.g. 2026) |

**Response (200):**
```json
{
  "success": true,
  "data": {
    "total_income": 50000,
    "total_expenses": 18000,
    "net_savings": 32000,
    "month": 6,
    "year": 2026
  }
}
```

---

## Subscriptions

> All subscription endpoints require authentication 🔒

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/subscriptions` | Get all detected subscriptions |
| GET | `/subscriptions/stats` | Get subscription statistics summary |
| GET | `/subscriptions/:id` | Get a single subscription |
| PUT | `/subscriptions/:id` | Update a subscription |
| POST | `/subscriptions/detect` | Trigger auto-detection of subscriptions from transactions |

### GET `/subscriptions/stats`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "active_subscriptions": 5,
    "total_monthly_cost": 2500,
    "upcoming_renewals": 2
  }
}
```

---

## Categories

> All category endpoints require authentication 🔒

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/categories` | Get all categories (system + user-defined) |
| GET | `/categories/:id` | Get a single category |
| POST | `/categories` | Create a custom category |

### POST `/categories`

**Request Body:**
```json
{
  "name": "Side Hustle",
  "type": "income",
  "icon": "💻",
  "color": "#27AE60"
}
```

---

## Upload (CSV)

> All upload endpoints require authentication 🔒

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/upload` | Upload a CSV file to bulk-import transactions |
| GET | `/upload/history` | Get all past upload records |
| GET | `/upload/history/:id` | Get details of a specific upload |
| GET | `/upload/template` | Download the CSV import template |

### POST `/upload`

**Content-Type:** `multipart/form-data`

| Field | Type | Description |
|-------|------|-------------|
| `file` | File | A `.csv` file matching the template format |

---

## Reports

> All report endpoints require authentication 🔒

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/reports/monthly` | Generate a monthly financial report |
| POST | `/reports/send` | Email the monthly report to the user |
| POST | `/reports/trigger-monthly-job` | Manually trigger the monthly report cron job |
| POST | `/reports/trigger-subscription-job` | Manually trigger the subscription detection cron job |

---

## Public

No authentication required.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/public/stats` | Get anonymized platform-wide statistics |

**Response (200):**
```json
{
  "success": true,
  "data": {
    "total_users": 120,
    "total_transactions": 5400
  }
}
```

---

## Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Server health status |
| GET | `/health/db` | Database connectivity check |

**Response (200):**
```json
{
  "success": true,
  "message": "SpendGuard API is running",
  "timestamp": "2026-06-02T14:00:00.000Z",
  "environment": "production",
  "version": "1.0.0"
}
```

---

## Error Responses

All errors follow this consistent format:

```json
{
  "success": false,
  "error": {
    "message": "A human-readable error message",
    "code": "ERROR_CODE"
  }
}
```

| Status Code | Meaning |
|-------------|---------|
| `400` | Bad Request — invalid or missing input fields |
| `401` | Unauthorized — missing or invalid JWT token |
| `404` | Not Found — resource does not exist |
| `409` | Conflict — resource already exists (e.g., email taken) |
| `429` | Too Many Requests — rate limit exceeded (100 req / 15 min) |
| `500` | Internal Server Error |
