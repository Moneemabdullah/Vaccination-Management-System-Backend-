# 💉 Vaccination Management System

A full-featured web-based system to manage vaccination processes for admins, doctors, and patients. Built with **Node.js**, **Express**, **MongoDB**, and **JWT Authentication**.

---

## 🚀 Features

-   ✅ User authentication (JWT)
-   👩‍⚕️ Doctor approval and vaccine management (Admin)
-   📅 Appointment booking and medical history (Patient)
-   🗓️ Appointment handling and patient record access (Doctor)
-   ✉️ Email notifications for appointments
-   🔒 Role-based access control

---

## 🧱 Tech Stack

-   **Backend**: Node.js, Express
-   **Database**: MongoDB + Mongoose
-   **Authentication**: JWT + Middleware
-   **Email**: Nodemailer
-   **Scheduling**: Node-cron (for appointment reminders)

---

## 📁 Folder Structure

<pre> 
backend/
├── config/
│ └── db.js # MongoDB connection
├── controllers/ # Business logic per role
├── models/ # Mongoose models
├── routes/ # API routes
├── middleware/ # Auth middlewares
├── utils/ # Utility functions (email, etc.)
├── cron/ # Scheduled jobs (reminders)
├── index.js # Main server file </pre>

yaml
Copy code

---

## 📦 Setup Instructions

1. **Clone the repository**
    ```bash
    [git clone https://github.com/your-username/vaccination-management.git](https://github.com/Moneemabdullah/Vaccination-Management-System-Backend-.git)
    cd vaccination-management
    Install dependencies
    ```

```bash
npm install
```

Configure environment
Create a .env file in the root directory and add:

env

```bash

PORT=5000
MONGODB_URI=mongodb://localhost:27017/vaccine_db
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
Start the server
```

bash
Copy code
npm run dev
📡 API Overview

Landing Page APIs

<pre>
GET /api/patient/doctors

GET /api/patient/vaccines
</pre>

Auth APIs

<pre>
POST /api/auth/register

POST /api/auth/login
</pre>

Admin APIs

<pre>
PUT /api/admin/approve-doctor/:id

POST /api/admin/vaccine

GET /api/admin/doctors
</pre>

Doctor APIs

<pre>
GET /api/doctor/appointments

PUT /api/doctor/appointment/:id

GET /api/doctor/patient-history/:patientId
</pre>

Patient APIs

<pre>
POST /api/patient/appointment

GET /api/patient/appointments

PUT /api/patient/medical-history

GET /api/patient/medical-history
</pre>

🛡️ Middleware & Roles
authMiddleware: Validates JWT token

adminOnly: Restricts to admin users

doctorOnly: Restricts to doctors

patientOnly: Restricts to patients

📬 Appointment Reminders
Uses node-cron to send email reminders to doctors and patients daily for upcoming appointments.

📖 License
MIT License © 2025 Moneem Abdullah

