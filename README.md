# Promo Code API
A simple REST API for managing and activating promo codes. Built with Node.js, Express, TypeScript, and PostgreSQL.

## What it does

- Create and manage promo codes with a discount, activation limit, and expiry date
- Activate a promo code with an email address
- Prevents duplicate activations — each email can activate a promo code only once
- Prevents activation if the code is expired or has reached its limit

## Requirements

- Node.js 18+
- PostgreSQL

## Getting started

### 1. Clone the repo
```bash
git clone https://github.com/Musaye99/promo-api
cd promo-api
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup environment
Create a `.env` file in the root:
```
DATABASE_URL="postgresql://user:password@localhost:5432/promodb"
```

### 4. Run database migrations
```bash
npx prisma migrate dev
```

### 5. Start the server
```bash
npm run dev
```
Server runs on http://localhost:3000

---

## API Endpoints

### Create a promo code
`POST /promo-codes`
```json
{
  "code": "SAVE20",
  "discount": 20,
  "limit": 5,
  "expiresAt": "2026-12-31"
}
```

### Get all promo codes
`GET /promo-codes`

### Get a single promo code
`GET /promo-codes/:code`

### Activate a promo code
`POST /promo-codes/:code/activate`
```json
{
  "email": "user@example.com"
}
```

---

## Error responses

| Status | Meaning |
|--------|---------|
| 400 | Missing fields, code expired, or limit reached |
| 404 | Promo code not found |
| 409 | Code already exists or email already activated |
| 500 | Server error |

---

## Tech stack

- Node.js + TypeScript
- Express
- Prisma
- PostgreSQL
