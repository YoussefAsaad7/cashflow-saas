# CashFlow SaaS - API Documentation

**Base URL:** `http://localhost:3000/api/v1`  
**Authentication:** JWT (Cookie or Bearer token)

---

## Authentication

All endpoints except `/auth/register` and `/auth/login` require authentication.

**Web Clients:** Send the `next-auth.session-token` cookie  
**Mobile Clients:** Send `Authorization: Bearer <token>` header

---

## 🔐 Auth Endpoints

### POST /auth/register
Create a new user account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"           // optional
}
```

**Response (201):**
```json
{
  "id": "clx1y2z3...",
  "email": "user@example.com",
  "name": "John Doe",
  "createdAt": "2025-12-20T00:00:00.000Z"
}
```

**Errors:** `400` Validation Error, `409` User already exists

---

### POST /auth/login
Authenticate and receive JWT token.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "user": {
    "id": "clx1y2z3...",
    "name": "John Doe",
    "email": "user@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Cookies Set:** `next-auth.session-token` (HTTP-only, 30 days)

**Errors:** `400` Validation Error, `401` Invalid credentials

---

## 💰 Income Endpoints

### POST /incomes
Create an income source (e.g., "Freelance", "Salary").

**Request:**
```json
{
  "name": "Freelance Work",
  "type": "ACTIVE"              // "ACTIVE" | "PASSIVE" | "PORTFOLIO"
}
```

**Response (201):** Created income source object

---

### GET /incomes
List all income sources for the authenticated user.

**Response (200):**
```json
[
  {
    "id": "clx...",
    "name": "Freelance Work",
    "type": "ACTIVE",
    "createdAt": "..."
  }
]
```

---

### POST /incomes/entries
Log an income entry.

**Request:**
```json
{
  "sourceId": "clx...",         // CUID of income source
  "amount": 1500.00,
  "currency": "USD",            // 3-letter code
  "date": "2025-12-20T00:00:00.000Z",
  "type": "REGULAR",            // "REGULAR" | "BONUS" | "OVERTIME"
  "metadata": {}                // optional
}
```

**Response (201):** Created income entry object

---

### GET /incomes/entries
Get income entries within a date range.

**Query Parameters:**
- `from` (required): ISO date string
- `to` (required): ISO date string

**Example:** `GET /incomes/entries?from=2025-01-01T00:00:00Z&to=2025-12-31T23:59:59Z`

**Response (200):** Array of income entries

---

## 💸 Expense Endpoints

### POST /expenses
Create an expense category (e.g., "Rent", "Food").

**Request:**
```json
{
  "name": "Rent",
  "type": "FIXED"               // "FIXED" | "VARIABLE" | "DISCRETIONARY"
}
```

**Response (201):** Created expense category object

---

### GET /expenses
List all expense categories for the authenticated user.

**Response (200):** Array of expense categories

---

### POST /expenses/entries
Log an expense entry.

**Request:**
```json
{
  "categoryId": "clx...",       // CUID of expense category
  "amount": 500.00,
  "currency": "USD",
  "date": "2025-12-20T00:00:00.000Z",
  "metadata": {}                // optional
}
```

**Response (201):** Created expense entry object

---

### GET /expenses/entries
Get expense entries within a date range.

**Query Parameters:**
- `from` (required): ISO date string
- `to` (required): ISO date string

**Response (200):** Array of expense entries

---

## 📋 Salary Rules Endpoints

### POST /salary-rules
Create a salary calculation rule.

**Request:**
```json
{
  "name": "Full-time Contract",
  "currency": "USD",
  "baseType": "HOURLY",         // "HOURLY" | "DAILY" | "MONTHLY"
  "baseAmount": 50.00,
  "standardHoursPerDay": 8,
  "workingDaysPerMonth": 22,    // optional
  "overtimeEnabled": true,
  "overtimeMultiplier": 1.5,    // optional
  "holidayPaid": true,
  "holidayMultiplier": 2.0,     // optional
  "validFrom": "2025-01-01T00:00:00.000Z"
}
```

**Response (201):** Created salary rule object

---

### GET /salary-rules
Get the active salary rule for the authenticated user.

**Response (200):**
```json
{
  "active": { ... }             // Salary rule object or null
}
```

---

## 📅 Workday Endpoints

### POST /workdays
Log a workday.

**Request:**
```json
{
  "date": "2025-12-20T00:00:00.000Z",
  "status": "WORKED",           // "WORKED" | "HOLIDAY" | "SICK" | "VACATION" | "UNPAID"
  "hoursWorked": 8              // optional, 0-24
}
```

**Response (201):** Created workday object

---

### GET /workdays
Get workdays within a date range.

**Query Parameters:**
- `from` (required): ISO date string
- `to` (required): ISO date string

**Response (200):** Array of workday objects

---

## 📊 Analytics Endpoints

### GET /analytics/summary
Get financial summary for a date range.

**Query Parameters:**
- `from` (required): ISO date string
- `to` (required): ISO date string

**Response (200):**
```json
{
  "totalIncome": 5000.00,
  "totalExpenses": 2000.00,
  "netSavings": 3000.00,
  "savingsRate": 60.00
}
```

---

### GET /analytics/breakdown/expenses
Get expense breakdown by category.

**Query Parameters:**
- `from` (required): ISO date string
- `to` (required): ISO date string

**Response (200):**
```json
[
  {
    "categoryId": "clx...",
    "categoryName": "Rent",
    "total": 1500.00,
    "percentage": 75.00
  }
]
```

---

### GET /analytics/breakdown/incomes
Get income breakdown by source.

**Query Parameters:**
- `from` (required): ISO date string
- `to` (required): ISO date string

**Response (200):**
```json
[
  {
    "sourceId": "clx...",
    "sourceName": "Freelance",
    "total": 3000.00,
    "percentage": 60.00
  }
]
```

---

### GET /analytics/trends
Get income/expense trends over time.

**Query Parameters:**
- `from` (required): ISO date string
- `to` (required): ISO date string
- `interval` (optional): `"day"` | `"month"` (default: `"day"`)

**Response (200):**
```json
[
  {
    "period": "2025-12-01",
    "income": 1000.00,
    "expenses": 500.00,
    "net": 500.00
  }
]
```

---

## Error Responses

All endpoints return errors in this format:

```json
{
  "error": "Error message",
  "details": { ... }            // Optional validation details
}
```

**Common Status Codes:**
- `400` - Validation Error
- `401` - Unauthorized
- `409` - Conflict (e.g., user exists)
- `500` - Internal Server Error
