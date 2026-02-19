# CMS Administrator Project

A modern, full-stack Content Management System core designed with security and scalability in mind. This project provides a robust foundation for User Management with fine-grained, permission-based Role-Based Access Control (RBAC).

## Architecture

The project is built using a **Layered Monolithic Architecture**:

- **Frontend**: React (Vite) SPA with a custom design system based on modern CSS tokens.
- **Backend**: Node.js & Express REST API.
- **Database**: PostgreSQL (Supabase) managed via Sequelize ORM.
- **Authentication**: Stateless JWT-based authentication with bcrypt password hashing.

## Features

- **Authentication**: Secure Login and Registration flows.
- **RBAC**: Permission-linked roles allowing for granular access control.
- **User Management**: Full CRUD operations for administrators.
- **Responsive Dashboard**: Summary views for system status and active sessions.
- **Interactive UI**: Modern, high-performance interface with glassmorphism aesthetics and smooth transitions.

## Authentication & Security

- **JWT Identity**: Tokens are signed on the server and verified via middleware.
- **Cryptographic Hashing**: Passwords are never stored in plain text; `bcryptjs` is used for industry-standard protection.
- **RBAC Middleware**: Enforces server-side permission checks on every sensitive endpoint.
- **Safe-by-Default Models**: Sensitive data (like password hashes) is excluded by default from database queries.

## Tech Stack

- **Frontend**: React 18+, Vite, React Router 6, Axios.
- **Backend**: Node.js, Express, Sequelize, JWT, Bcrypt.
- **Database**: PostgreSQL.
- **Styling**: Vanilla CSS with a centralized token-based design system.

## Folder Structure

```text
├── backend
│   ├── src
│   │   ├── config        # Database configuration
│   │   ├── controllers   # Business logic / Request handling
│   │   ├── middleware    # Auth & RBAC enforcement
│   │   ├── models        # Sequelize schema definitions
│   │   ├── routes        # API endpoint definitions
│   │   └── app.js        # Express app initialization
├── frontend
│   ├── src
│   │   ├── api           # Axios client & service layers
│   │   ├── components    # Shared UI & Layout components
│   │   ├── context       # Authentication context
│   │   ├── pages         # View-level components
│   │   └── App.jsx       # Routing & provider setup
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- PostgreSQL Database

### Installation

1. **Clone the repository.**
2. **Backend Setup**:
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Update your DATABASE_URL and JWT_SECRET in .env
   npm start
   ```
3. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## API Endpoints

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| POST | `/api/auth/login` | User login | No |
| POST | `/api/auth/register` | User registration | No |
| GET | `/api/users` | List users (Paginated) | Yes |
| GET | `/api/users/:id` | Get user profile | Yes |
| POST | `/api/users` | Create user | Admin Only |
| PUT | `/api/users/:id` | Update user | Admin Only |
| DELETE | `/api/users/:id` | Delete user | Admin Only |

---

## Known Limitations & Future Improvements

- **Observability**: Structured logging (Winston) and performance monitoring (New Relic/Datadog) are not yet implemented.
- **Security Hardening**: Integration of Helmet.js and Rate Limiting for production deployment.
- **Testing**: Implementation of Jest unit tests and Playwright E2E tests.
- **Storage**: Migrate JWT from `localStorage` to `httpOnly` secure cookies.
