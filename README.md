# Fenmo – Expense Tracker

A full-stack, production-ready REST API and frontend UI for tracking personal expenses. Built with **Node.js + Express + SQLite** (Backend) and **React + TypeScript + Vite** (Frontend).

---

## Quick Start

### 1. Start Backend API
```bash
npm install
node server.js
```
*Server starts at **http://localhost:3000***

### 2. Start Frontend UI
Open a new terminal:
```bash
cd Frontend
npm install
npm run dev
```
*App opens at **http://localhost:5173***

---

## Project Structure

```text
Fenmo/
├── server.js                   # Express app setup
├── db.js                       # SQLite connection + schema
├── routes/
│   └── expenses.js             # Route definitions
├── controllers/
│   └── expensesController.js   # Business logic
├── tests/
│   └── expenses.test.js        # Automated tests
├── expenses.db                 # SQLite DB (auto-generated)
└── Frontend/                   # React + Vite frontend
    ├── src/
    │   ├── api.ts              # API client (handles idempotency)
    │   ├── App.tsx             # Main UI layout
    │   └── components/         # React components
    └── package.json
```

---

## API Reference

### `GET /health`
Simple uptime check.

**Response `200`**
```json
{ "status": "ok", "timestamp": "2024-01-15T10:30:00.000Z" }
```

---

### `POST /expenses`
Create a new expense.

**Required Header**
| Header            | Example value           |
|-------------------|-------------------------|
| `Idempotency-Key` | `uuid-or-any-unique-id` |

**Request Body**
```json
{
  "amount": 150.75,
  "category": "Food",
  "description": "Lunch at cafe",
  "date": "2024-01-15"
}
```

| Field         | Type   | Required | Notes                               |
|---------------|--------|----------|-------------------------------------|
| `amount`      | number | ✅       | Positive number in rupees           |
| `category`    | string | ✅       | e.g. Food, Travel, Bills            |
| `description` | string | ❌       | Optional freeform note              |
| `date`        | string | ✅       | ISO format: `YYYY-MM-DD`            |

**Response `201`** – Created
```json
{
  "message": "Expense created successfully",
  "expense": {
    "id": "a3f9...",
    "amount": 150.75,
    "category": "Food",
    "description": "Lunch at cafe",
    "date": "2024-01-15",
    "created_at": "2024-01-15T10:30:00.000Z",
    "idempotency_key": "your-key-here"
  }
}
```

**Response `200`** – Duplicate (same `Idempotency-Key`)
```json
{
  "message": "Duplicate request – returning existing expense",
  "expense": { ... }
}
```

**Response `422`** – Validation error
```json
{
  "error": "Validation failed",
  "details": ["amount must be a positive number", "date is required"]
}
```

---

### `GET /expenses`
Retrieve all expenses.

**Query Parameters**

| Param      | Type   | Description                          |
|------------|--------|--------------------------------------|
| `category` | string | Filter by category (case-insensitive)|
| `sort`     | string | `date_desc` → newest date first      |

**Examples**
```
GET /expenses
GET /expenses?category=Food
GET /expenses?sort=date_desc
GET /expenses?category=Travel&sort=date_desc
```

**Response `200`**
```json
{
  "count": 2,
  "expenses": [
    {
      "id": "a3f9...",
      "amount": 150.75,
      "category": "Food",
      "description": "Lunch",
      "date": "2024-01-15",
      "created_at": "2024-01-15T10:30:00.000Z",
      "idempotency_key": "key-1"
    }
  ]
}
```

---

## Assignment Notes

### Key Design Decisions
- **Database (`better-sqlite3`)**: Chose SQLite as it requires zero setup for reviewers while providing a robust, relational schema. Used the synchronous `better-sqlite3` driver since it is extremely fast and avoids promise/callback overhead for a single-process Node application.
- **Handling Real Money**: Amounts are stored in the database as **paise (integers)**. Floating point math (`0.1 + 0.2 = 0.30000000000000004`) is notoriously dangerous for financial applications. The backend converts rupees to paise on `POST` and converts back to decimal rupees on `GET`.
- **Idempotency & Retries**: Implemented an `Idempotency-Key` requirement for the `POST` endpoint. If a user clicks "Submit" multiple times or the network stutters, the backend gracefully catches the duplicate key and returns the existing resource instead of creating duplicates.
- **Frontend Architecture**: Built using React + TypeScript + Vite. State management relies on standard React Hooks. Used a proxy in `vite.config.ts` to seamlessly route `/expenses` calls to the backend, avoiding CORS configuration overhead in development.

### Trade-offs Made Because of the Timebox
- **No Database Migrations**: The schema is initialized directly on startup via a simple `CREATE TABLE IF NOT EXISTS` query. In a real-world application, I would use a migration runner (like Knex or Prisma) to track schema evolution.
- **Basic Client-Side Routing**: Kept everything on a single page instead of bringing in `react-router-dom`. Given the minimal feature set, a single dashboard is simpler and faster to review.
- **No Global State Manager**: Since the app only shares data between a few components on a single screen, I used prop drilling and localized state instead of Redux or Zustand to keep the cognitive load low.

### Anything Intentionally Did Not Do
- **User Authentication**: Skipped auth entirely to keep the scope focused on core money handling, network resilience, and basic CRUD operations.
- **Pagination**: The `GET /expenses` endpoint returns all records. While fine for a prototype, this would need `LIMIT`/`OFFSET` and cursor-based pagination for a production app with thousands of expenses.
- **Strict Date Library**: Used native JavaScript `Date` and `Intl.NumberFormat` instead of adding heavy dependencies like `date-fns` or `moment`.

---

## .gitignore

```
node_modules/
expenses.db
```
