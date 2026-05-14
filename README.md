# ElectroPi — Online Food Ordering 🍔

A full-stack MERN food ordering web application.

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB running locally (`mongod`)

### 1. Install Dependencies
```bash
npm install           # backend
cd frontend && npm install   # frontend
```

### 2. Seed the Database
```bash
npm run seed
```
This creates:
- **Admin**: `admin@electropi.com` / `admin123`
- **User**: `ahmed@test.com` / `test123`

### 3. Run the App
```bash
npm run dev     # runs both backend (port 5000) & frontend (port 3000)
```

Or separately:
```bash
npm run server   # backend only
npm run client   # frontend only
```

### 4. Open the App
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api

## Features

| Feature | Details |
|---------|---------|
| 🍕 Menu | Full product catalog with categories, search, filters |
| 🛒 Cart | Add/remove items, quantity control, free delivery threshold |
| 🔐 Auth | JWT-based login/register, roles (user/admin) |
| 💳 Payment | Online payment (simulated) or Cash on Delivery |
| 📦 Tracking | Real-time order status: Pending → Delivered |
| 👑 Admin | CRUD products & categories, order management, stats |
| 🌍 i18n | Full Arabic & English with RTL layout support |

## API Endpoints

| Method | Endpoint | Auth |
|--------|----------|------|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/products` | Public |
| GET | `/api/categories` | Public |
| POST | `/api/orders` | User |
| GET | `/api/orders/my` | User |
| GET | `/api/orders` | Admin |
| PUT | `/api/orders/:id/status` | Admin |
| POST | `/api/products` | Admin |
| DELETE | `/api/products/:id` | Admin |

## Tech Stack
- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT, bcrypt
- **Frontend**: React 18, Vite, React Router v6, Axios, i18next, react-icons
