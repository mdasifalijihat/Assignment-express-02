# 🚗 Vehicle Rental System (Backend)

## 📖 Project Description
This is a **MERN-ready backend API** for a Vehicle Rental System.  
It allows you to manage **Vehicles, Users, and Bookings** with **JWT-based authentication** and **role-based access control** (Admin / Customer).  

💡 Built with **Node.js + TypeScript + Express + PostgreSQL**, following a **modular & production-ready architecture**.

---

## 🛠 Technology Stack

| Tool / Library | Version | Purpose |
|----------------|--------|---------|
| Node.js | 20.x | Runtime |
| TypeScript | 5.x | Static typing |
| Express.js | 4.x | Web framework |
| PostgreSQL | 16.x | Database |
| bcrypt | 5.x | Password hashing |
| jsonwebtoken | 9.x | JWT authentication |
| dotenv | 16.x | Environment variables |
| pg | 8.x | PostgreSQL client |

---

## 💻 Installation & Setup
1. **Clone the repository:**
```bash
---
git clone <repo-url>
cd vehicle-rental-backend
Install dependencies:

bash
Copy code
npm install
Create .env file:

ini
Copy code
PORT=5000
DATABASE_URL=postgres://<db_user>:<db_password>@localhost:5432/vehicle_rental
JWT_SECRET=your_jwt_secret
BCRYPT_SALT_ROUNDS=10
Setup PostgreSQL database:
---


sql

---
Copy code

CREATE DATABASE vehicle_rental;
-- Users, Vehicles, Bookings tables
Start server:

bash
Copy code
npm run dev
Server runs on: http://localhost:5000

---

---

📁 Folder Structure
pgsql
Copy code
vehicle-rental-backend/
├─ src/
│  ├─ config/             
│  ├─ db/                 
│  ├─ middlewares/        
│  ├─ modules/            
│  │   ├─ auth/
│  │   ├─ users/
│  │   ├─ vehicles/
│  │   └─ bookings/
│  ├─ app.ts              
│  └─ server.ts           
├─ .env                   
├─ package.json
├─ tsconfig.json
└─ README.md

------


🔐 Authentication & Authorization
JWT-based login

Admin → Full access (manage users, vehicles, bookings)

Customer → Manage own bookings & profile only

Password hashing using bcrypt

Protected routes require Authorization: Bearer <token>


---

🌐 API Endpoints
Auth
Method	Endpoint	Access	Description
POST	/api/v1/auth/signup	Public	Register new user
POST	/api/v1/auth/signin	Public	Login + JWT

--- 

Vehicles
Method	Endpoint	Access	Description
GET	/api/v1/vehicles	Public	List vehicles
GET	/api/v1/vehicles/:id	Public	Vehicle details
POST	/api/v1/vehicles	Admin	Add vehicle
PUT	/api/v1/vehicles/:id	Admin	Update vehicle
DELETE	/api/v1/vehicles/:id	Admin	Delete vehicle (no active booking)

--- 

Users
Method	Endpoint	Access	Description
GET	/api/v1/users	Admin	List users
PUT	/api/v1/users/:id	Admin / Self	Update user
DELETE	/api/v1/users/:id	Admin	Delete user (no active booking)

--- 

Bookings
Method	Endpoint	Access	Description
POST	/api/v1/bookings	Customer / Admin	Create booking
GET	/api/v1/bookings	Role-based	Admin: all, Customer: own
PUT	/api/v1/bookings/:id/cancel	Customer	Cancel before start
PUT	/api/v1/bookings/:id/return	Admin	Mark as returned

--- 

📷 Example Requests & Responses
Signup
http
Copy code
POST /api/v1/auth/signup
Content-Type: application/json

--- 

{
  "name": "Asif Ali",
  "email": "asif@example.com",
  "password": "123456",
  "phone": "017XXXXXXXX"
}
Response:

json
Copy code
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Asif Ali",
    "email": "asif@example.com",
    "phone": "017XXXXXXXX",
    "role": "customer"
  }

--- 

⚡ Tips & Notes

Protect sensitive routes with auth + role middleware

Use transactions for bookings to prevent data corruption

Keep JWT_SECRET safe in production

Validate dates & prices

Use lowercase emails consistently