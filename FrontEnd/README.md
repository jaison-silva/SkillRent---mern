# SkillRent Frontend

A premium, high-performance platform for renting skills and services.

## Tech Stack
- **Framework**: React 19 (Vite)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 (Glassmorphism & Framer Motion)
- **Validation**: React Hook Form + Zod
- **API**: Axios with Auto-refresh Interceptors

## Prerequisites
- **Node.js**: v18+
- **Backend**: The [SkillRent Backend](http://localhost:5000) must be running for authentication and data to work.

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
The application will be available at `http://localhost:5173`.

### 3. Build for Production
```bash
npm run build
```

## Features Implemented
- **Premium Auth**: Login, User/Provider Registration with OTP, Password Recovery.
- **Glassmorphism UI**: High-end look with micro-animations.
- **Session Security**: Automatic token refresh handling.
- **Protected Routes**: Role-based access control.
