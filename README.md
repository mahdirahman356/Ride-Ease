#  Ride Booking API

##  Project Overview

A role-based ride-booking system backend  built using **Express.js**, **MongoDB**, and **JWT**. The system enables riders to book rides, drivers to accept and complete them, and admins to manage the system securely and efficiently.


This backend API supports three user roles:

- **Riders** can request rides, cancel (within allowed time), and view ride history.
- **Drivers** can accept/reject requests, update ride statuses, toggle availability, and view earnings.
- **Admins** can approve/suspend drivers, block/unblock users, and view all rides and users.


---

##  Setup & Environment Instructions

###  Prerequisites

- **Node.js**: Make sure you have Node.js installed on your system.
- **npm or yarn**: The package manager of your choice.

### 📦 Installation

```bash
git clone https://github.com/mahdirahman356/Ride-Ease.git
cd ride-booking-api
```

Install dependencies:

```bash
npm install
# or
yarn install
```

###  Environment Variables

Create a `.env` file in the root directory of the project with the following variables:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/ride_booking_db
JWT_SECRET=your_super_secure_jwt_secret
```

- `PORT`: The port on which the server will run.
- `MONGO_URI`: The connection string for your MongoDB database.
- `JWT_SECRET`: A secret key used to sign and verify JWTs. Ensure this is kept secure and not committed to version control.

###  Running the Application

To start the server, use the following command:

```bash
npm run dev
# or
yarn dev
```

The API will be available at: [http://localhost:5000](http://localhost:5000)

---

##  API Endpoints Summary

All endpoints are protected and require a valid **JWT** in the `Authorization` header as `Bearer <token>`.

---

##  API Endpoints Summary

###  Authentication Endpoints

| Method | Endpoint           | Description         |
|--------|--------------------|---------------------|
| POST   | /api/user/register | Register a new user |
| POST   | /api/auth/login    | Login and get token |

---

###  Rider Endpoints

| Method | Endpoint               | Description                         |
|--------|------------------------|-------------------------------------|
| POST   | /api/rides/request     | Request a new ride                  |
| PATCH  | /api/rides/:id/status  | Cancel a ride (if not yet accepted) |
| GET    | /api/rides/me          | View ride history for the rider     |

---

###  Driver Endpoints

| Method | Endpoint                     | Description                        |
|--------|------------------------------|------------------------------------|
| PATCH  | /api/drivers/assign-ride/:id | Update ride status                 |
| PATCH  | /api/user/availability       | Set availability (Online/Offline)  |
| GET    | /api/drivers/my-earnings     | View total completed ride earnings |
| GET    | /api/drivers/assigned-ride   | View Assigned Ride                 |

---

### 🛠️ Admin Endpoints

| Method | Endpoint                      | Description                           |
|--------|-------------------------------|---------------------------------------|
| GET    | /api/user/view                | Get list of users, drivers, and rides |
| PATCH  | /api/user/drivers/approve/:id | Approve/Suspend driver account        |
| PATCH  | /api/user/activity-status/:id | Block or unblock any user account     |

## Live API Link
You can access the live API at the following URL:
🔗 [https://ride-ease-psi.vercel.app](https://ride-ease-psi.vercel.app)