# Saarthi 🏥
### The Intelligent Smart Hospital Management System

> Saarthi is a production-grade, AI-powered healthcare ecosystem designed to bridge the gap between patients and doctors with real-time monitoring, digital records, and intelligent diagnostic assistance.

---

## 👥 Meet the Team: **CodEx** 🚀
Managing and developing with excellence.

- **Tamanpreet Kaur** ([@YourGithub](https://github.com/)) - **Team Leader** & Lead Architect
- **Jasdeep Singh** ([@YourGithub](https://github.com/)) - Lead Full-Stack Engineer

---

## 📖 Table of Contents
1. [Project Overview](#project-overview)
2. [Key Features by Phase](#key-features-by-phase)
3. [Technology Stack](#technology-stack)
4. [Role-Based Dashboards](#role-based-dashboards)
5. [Installation & Setup](#installation--setup)
6. [Demo Credentials](#demo-credentials)
7. [Environment Variables](#environment-variables)

---

## 🏢 Project Overview
Built during the **Think-a-thon**, Saarthi transforms traditional hospital workflows into a "Phygital" (Physical + Digital) experience. From real-time queue management using Socket.io to AI-powered prescription helpers using Gemini Pro, Saarthi is built for scale and speed.

---

## ✨ Key Features by Phase

### 🔐 Phase 1 & 2: Architecture & Auth
- **PWA Ready**: Mobile-first design for patients and web-heavy for doctors.
- **RBAC (Role-Based Access Control)**: Secure JWT-driven authentication for Patients, Doctors, and Admin roles.

### ⏱️ Phase 3: Live OPD Queue System
- **Real-time Sync**: Socket.io-driven queue updates with no page refreshes.
- **Dynamic ETA**: Automatic estimation of waiting times based on current visit speeds.
- **Token Tracking**: Live position updates for patients on their personal dashboard.

### 🤳 Phase 4: QR Presence Verification
- **Anti-Ghosting**: Verify physical presence using a built-in QR scanner on the doctor's end.
- **Smart Filtering**: Doctors only see "Present" patients in their active call list, ensuring zero time wasted.

### 📂 Phase 5: Digital Health Records (EHR)
- **Cloudinary Integration**: Secure medical document uploads (X-Rays, Prescriptions, Reports).
- **Patient Privacy**: Patients control the visibility of their records; doctors can only view shared public records.

### 🫀 Phase 6: Emergency Monitoring (IoT Simulation)
- **Live Vitals**: Continuous streaming of Heart Rate (BPM), SpO2, and Blood Pressure.
- **Critical Alerts**: Visual and audio-visual pulses on the dashboard when vitals cross life-threatening thresholds.
- **Demo Mode**: Manual "Simulate Emergency" button for rapid-response demonstration.

### 🤖 Phase 7: AI-Powered Insights (Gemini Pro)
- **Medical Co-pilot**: Gemini Pro analyzes symptoms and patient history to suggest diagnostic tests and medications.
- **One-Click Drafting**: Apply AI suggestions directly to the digital prescription form to save time.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React.js (Vite), Tailwind CSS, Lucide Icons |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Mongoose) |
| **Real-time** | Socket.io |
| **AI Engine** | Google Gemini Pro API |
| **Storage** | Cloudinary (EHR Documents) |
| **PWA** | Vite-PWA-Plugin |

---

## 🖥️ Role-Based Dashboards

### 👤 Patient Dashboard
- Book instant appointments.
- Live token tracking and queue ETA.
- Digital Health Folder for medical records.
- Live heart-beat monitoring.

### 👨‍⚕️ Doctor Dashboard
- Advanced OPD Console with "Call Next" logic.
- Built-in QR Scanner for presence verification.
- Live Vitals Monitoring with Emergency Alert System.
- Gemini AI Prescription Assistant.

---

## 🛠️ Installation & Setup

1. **Clone the Repository**
   ```bash
   git clone <repo-url>
   cd saarthi
   ```

2. **Install Dependencies**
   ```bash
   # Install Backend
   cd server && npm install
   
   # Install Frontend
   cd ../client && npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` in both folders (see [Environment Variables](#environment-variables)).

4. **Run Development Mode**
   ```bash
   # From Root
   npm run dev
   ```

---

## 🔑 Demo Credentials
Use these pre-seeded accounts to experience all roles immediately:

- **Patient**: `patient1` / `pass123`
- **Doctor**: `doctor1` / `pass123`
- **Admin**: `admin1` / `pass123`

---

## 🔐 Environment Variables

### Backend (`/server/.env`)
```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CORS_ORIGIN=http://localhost:5173
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
GEMINI_API_KEY=xxx
```

### Frontend (`/client/.env`)
```env
VITE_API_URL=http://localhost:5000/api
VITE_CLOUDINARY_CLOUD_NAME=xxx
VITE_CLOUDINARY_UPLOAD_PRESET=xxx
```

---

*Made with ❤️ by Team **CodEx**.*