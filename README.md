# 🐾 PashuSewa - Animal Rescue Reporting System

[![Cloudflare Pages](https://img.shields.io/badge/Deployed%20on-Cloudflare%20Pages-orange?style=flat-square&logo=cloudflare)](https://pashusewa.pages.dev)
[![Cloudflare Workers](https://img.shields.io/badge/Backend-Cloudflare%20Workers-blue?style=flat-square&logo=cloudflare)](https://workers.cloudflare.com)

> **Empowering communities to save injured animals through technology**

PashuSewa is a web application that enables users to report injured animals and helps NGOs/rescue organizations efficiently manage and respond to these reports. Built with React, Vite, and Cloudflare Workers.

## 🌟 Features

### 🚨 For Users (Animal Reporters)
- **📸 Photo Upload**: Capture and upload photos of injured animals
- **📍 GPS Location**: Automatic location detection
- **📝 Notes**: Add descriptions and details about the animal
- **✅ Instant Confirmation**: Real-time feedback on submission
- **📱 Mobile Optimized**: Works seamlessly on all devices

### 🏢 For NGOs/Rescue Organizations
- **📊 Management Dashboard**: View all animal reports
- **🎯 Location-Based Filtering**: Find reports within specified radius
- **📏 Distance Calculation**: Auto-calculated distance from your location
- **🔄 Status Management**: Track reports through Pending → In Progress → Resolved
- **🗺️ Google Maps Integration**: Direct links to report locations
- **📱 Responsive Design**: Full functionality on all devices

## 🏗️ Architecture

### Frontend (React + Vite)
```
frontend-react/
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── ReportForm.jsx
│   │   ├── ReportList.jsx
│   │   └── AdminDashboard.jsx
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   └── AdminPage.jsx
│   ├── utils/
│   │   ├── api.js
│   │   └── location.js
│   └── App.jsx
└── vite.config.js
```

### Backend (Cloudflare Workers)
```
backend/
├── worker.js
├── schema.sql
└── wrangler.toml
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Cloudflare account (for deployment)

### 1. Backend Setup
```bash
cd backend
npm install
wrangler login
wrangler d1 create pashusewa
wrangler d1 execute pashusewa --file=schema.sql
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend-react
npm install
echo "VITE_API_BASE_URL=http://localhost:8787" > .env
npm run dev
```

Open http://localhost:5173 in your browser.

## 📊 Database Schema

```sql
CREATE TABLE reports (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  image TEXT NOT NULL,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  note TEXT,
  status TEXT NOT NULL DEFAULT 'Pending',
  created_at TEXT NOT NULL
);
```

## 🔧 API Endpoints

### `GET /api/reports`
Fetch all reports (sorted by creation date)

**Response:**
```json
[
  {
    "id": 1,
    "image": "data:image/jpeg;base64,...",
    "latitude": 28.6139,
    "longitude": 77.2090,
    "note": "Injured dog",
    "status": "Pending",
    "created_at": "2025-01-15T10:30:00.000Z"
  }
]
```

### `POST /api/report`
Create new animal report

**Request:**
```json
{
  "image": "data:image/jpeg;base64,...",
  "latitude": 28.6139,
  "longitude": 77.2090,
  "note": "Injured dog"
}
```

### `POST /api/update-status`
Update report status (NGO/Admin only)

**Request:**
```json
{
  "id": 1,
  "status": "In Progress"
}
```


