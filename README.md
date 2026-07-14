# RentNest Backend API

A robust and scalable backend API for **RentNest**, a rental property management platform. It enables tenants to discover rental properties, landlords to manage listings and rental requests, and administrators to oversee the entire platform. The application includes secure authentication, role-based authorization, Stripe payment integration, and a complete rental workflow.

---

## 🚀 Live API

> Add your deployed backend URL here

```
https://rentnest-backend-green.vercel.app/
```

---

## 📂 GitHub Repository

> Add your repository URL here

```
https://github.com/hrhabib0/rentnest-backend
```

---

# ✨ Features

### 🔐 Authentication & Authorization

* User Registration
* User Login
* JWT Authentication
* Access & Refresh Token Support
* Cookie-based Authentication
* Role-based Authorization
* Get Current User Profile

---

### 🏠 Property Management

* Create Property
* Update Property
* Delete Property
* Get All Properties
* Get Property Details
* Search Properties
* Filter Properties
* Sort Properties
* Pagination

---

### 📁 Category Management

* Create Category
* Get All Categories
* Get Category Details

---

### 📄 Rental Request Management

* Create Rental Request
* Get Rental Request Details
* Tenant Rental History
* Landlord Received Requests
* Approve Rental Request
* Reject Rental Request

---

### 💳 Payment

* Stripe Checkout Session
* Stripe Webhook Integration
* Payment Status Tracking
* Payment History
* Payment Details

---

### ⭐ Review System

* Create Review
* Update Review
* Delete Review
* Get Property Reviews

---

### 🛡️ Admin Panel

* Get All Users
* Block / Unblock Users
* Get All Properties
* Get All Rental Requests

---

# 🛠️ Tech Stack

* Node.js
* Express.js
* TypeScript
* Prisma ORM
* PostgreSQL
* JWT
* bcrypt
* Stripe
* Cookie Parser
* CORS

---

# 📦 Installation

Clone the repository

```bash
git clone https://github.com/your-username/rentnest-backend.git
```

Move into the project

```bash
cd rentnest-backend
```

Install dependencies

```bash
npm install
```

---

# ⚙️ Environment Variables

Create a `.env` file in the project root.

```env
NODE_ENV=development

PORT=5000

DATABASE_URL=

JWT_ACCESS_SECRET=
JWT_ACCESS_EXPIRES_IN=7d


BCRYPT_SALT_ROUNDS=10

CLIENT_URL=http://localhost:5173

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

---

# ▶️ Run the Project

Development

```bash
npm run dev
```

Build

```bash
npm run build
```

Production

```bash
npm start
```

---

# 📚 API Endpoints

## Authentication

| Method | Endpoint             |
| ------ | -------------------- |
| POST   | `/api/auth/register` |
| POST   | `/api/auth/login`    |
| GET    | `/api/auth/me`       |

---

## Categories

| Method | Endpoint              |
| ------ | --------------------- |
| POST   | `/api/categories`     |
| GET    | `/api/categories`     |
| GET    | `/api/categories/:id` |

---

## Properties

| Method | Endpoint              |
| ------ | --------------------- |
| POST   | `/api/properties`     |
| GET    | `/api/properties`     |
| GET    | `/api/properties/:id` |
| PATCH  | `/api/properties/:id` |
| DELETE | `/api/properties/:id` |

---

## Rental Requests

| Method | Endpoint                         |
| ------ | -------------------------------- |
| POST   | `/api/rentals`                   |
| GET    | `/api/rentals/my-requests`       |
| GET    | `/api/rentals/received-requests` |
| GET    | `/api/rentals/:id`               |
| PATCH  | `/api/rentals/:id/status`        |

---

## Payments

| Method | Endpoint                                                 |
| ------ | -------------------------------------------------------- |
| POST   | `/api/payments/create-checkout-session/:rentalRequestId` |
| POST   | `/api/payments/webhook`                                  |
| GET    | `/api/payments`                                          |
| GET    | `/api/payments/:id`                                      |

---

## Reviews

| Method | Endpoint                            |
| ------ | ----------------------------------- |
| POST   | `/api/reviews`                      |
| GET    | `/api/reviews/property/:propertyId` |
| PATCH  | `/api/reviews/:id`                  |
| DELETE | `/api/reviews/:id`                  |

---

## Admin

| Method | Endpoint                |
| ------ | ----------------------- |
| GET    | `/api/admin/users`      |
| PATCH  | `/api/admin/users/:id`  |
| GET    | `/api/admin/properties` |
| GET    | `/api/admin/rentals`    |

---

# 🔑 User Roles

### Tenant

* Browse properties
* Submit rental requests
* Make payments
* Leave reviews
* View payment history

### Landlord

* Manage properties
* Review rental requests
* Approve or reject requests

### Admin

* Manage platform users
* Block / Unblock users
* View all properties
* View all rental requests

---

# 📁 Project Structure

```
src
│
├── app
│   ├── config
│   ├── errors
│   ├── lib
│   ├── middlewares
│   ├── modules
│   │   ├── admin
│   │   ├── auth
│   │   ├── category
│   │   ├── payment
│   │   ├── property
│   │   ├── rentalRequest
│   │   ├── review
│   │   └── user
│   ├── routes
│   └── utils
│
├── prisma
│
└── server.ts
```

---

# 🔒 Security

* Password Hashing using bcrypt
* JWT Authentication
* Role-based Authorization
* Secure HTTP-only Cookies
* Stripe Webhook Verification
* Global Error Handling

---

# 👨‍💻 Author

**Md. Habibur Rahman**

GitHub: https://github.com/hrhabib0

LinkedIn: https://www.linkedin.com/in/habibur-rahman3/
