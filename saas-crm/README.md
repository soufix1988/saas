# SaaS CRM & Booking System

Migration from Google Apps Script to a modern SaaS stack.

## Stack
- **Frontend**: React + Vite + TailwindCSS
- **Backend**: Node.js + Express
- **Database**: Supabase (PostgreSQL)
- **Auth**: Custom login (saas_users table)
- **Emails**: Resend (nodemailer fallback)
- **Calendar**: Google Calendar API

## Quick Start

### 1. Setup Supabase
Create a project at [supabase.com](https://supabase.com) and run `supabase/migrations/001_initial_schema.sql` in the SQL editor.

### 2. Configure environment
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
# Fill in your keys
```

### 3. Install & run
```bash
cd backend && npm install && npm run dev     # Port 3001
cd frontend && npm install && npm run dev    # Port 5173
```

Default admin credentials: `admin` / `admin123`

## Features
- Auth (custom login + Google OAuth)
- Form Builder (7 field types, conditional logic, quiz mode)
- Appointment Booking (time slots, capacity, auto-calendar)
- Google Calendar integration
- Automated multilingual emails (FR/EN/ES/DE/AR/HE)
- CRM table (view, edit, delete entries)
- Dashboard with KPI cards, weekly chart, monthly calendar
- User management with granular access rights
- App config (colors, patterns, logo, language)
- RTL support (Arabic, Hebrew)
- Public shareable form links
