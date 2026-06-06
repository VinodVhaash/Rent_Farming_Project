# 🌾 Rent Farming – Agricultural Land Rental Marketplace

A full-stack web application connecting Indian landowners/farmers who want to rent out their agricultural land with buyers/tenants interested in farming on rented land.

## Tech Stack

| Layer          | Technology                              |
| -------------- | --------------------------------------- |
| Frontend       | React (Vite), Tailwind CSS, Redux Toolkit |
| Backend        | Node.js, Express.js                     |
| Database       | Microsoft SQL Server                    |
| Auth           | JWT + OTP verification                  |

## Getting Started

### Prerequisites
- Node.js ≥ 18
- MS SQL Server

### 1. Clone & Install

```bash
# Frontend
cd client
npm install

# Backend
cd ../server
npm install
```

### 2. Configure Environment

Copy `server/.env.example` → `server/.env` and fill in your database credentials:

```env
DB_USER=sa
DB_PASSWORD=your_password
DB_SERVER=localhost
DB_NAME=RentFarmingDB
JWT_SECRET=your_secret
```

### 3. Run Development Servers

```bash
# Terminal 1 – Backend
cd server
npm run dev

# Terminal 2 – Frontend
cd client
npm run dev
```

- Frontend: http://localhost:5173
- Backend:  http://localhost:5000

## Project Structure

```
Agri_Project_A/
├── client/                 # React frontend (Vite)
│   └── src/
│       ├── components/     # Reusable UI components
│       ├── pages/          # Page-level components
│       ├── layouts/        # Layout wrappers
│       ├── routes/         # Route definitions
│       ├── store/          # Redux store & slices
│       ├── services/       # API service (Axios)
│       ├── hooks/          # Custom hooks
│       └── context/        # React context providers
├── server/                 # Node.js backend (Express)
│   ├── config/             # DB connection config
│   ├── controllers/        # Route handlers
│   ├── middleware/         # Auth, upload middleware
│   ├── models/             # DB query helpers
│   ├── routes/             # Express routes
│   ├── services/           # Business logic
│   ├── utils/              # Helpers (OTP, validators)
│   └── uploads/            # Uploaded files
└── README.md
```
