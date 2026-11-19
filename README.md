# Online Exam & Anti-Cheating System

This project is a full-stack application consisting of:
- **Backend (`/server`)**: Node.js & Express REST API with MongoDB (Mongoose) for authentication, exam management, violation logging, and reports.
- **Frontend (`/client`)**: React 18 + Vite with web proctoring, face detection (`@vladmandic/face-api`), lockdown browser features, and admin dashboards.

---

## Prerequisites

1. **Node.js** (v18+ or v20+)
2. **MongoDB** (Local instance or MongoDB Atlas cloud connection)

---

## Quick Start Guide

### 1. Start MongoDB
Ensure MongoDB is running locally:
```bash
sudo systemctl start mongod
```
*(Or use a remote MongoDB Atlas URI in `server/.env`)*

### 2. Configure Backend Environment
A `server/.env` file has been prepared with defaults:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/onlineexam
JWT_SECRET=anticheat_jwt_secret_dev_key_2025

# Optional: For email OTP reset
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
```

### 3. Start the Backend Server
Open a terminal and run:
```bash
cd /home/david/Anti_Cheating_System-main/server
npm run dev
# Or: npm start
```
> The server will connect to MongoDB on port 5000 and automatically seed the default **Super Admin** account if it doesn't already exist.

### 4. Start the Frontend Client
In a second terminal, run:
```bash
cd /home/david/Anti_Cheating_System-main/client
npm run dev
```
> Vite will start the frontend dev server at `http://localhost:5173`. Open this URL in your browser.

---

## Default Super Admin Credentials
Once the server connects to MongoDB, it automatically seeds:
- **Email**: `superadmin1@gmail.com`
- **Password**: `superadmin`
- **Role**: `superadmin`

You can also register new Student or Admin accounts via the **Register** page on the frontend.

---

## 🚀 Production Deployment
For complete cloud and server deployment guides (Render, Vercel, Docker, VPS), see [DEPLOYMENT.md](./DEPLOYMENT.md).

