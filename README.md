# CAPACITY CONNECT (Problem Statement ID: 26075)
## A Digital Capacity Building & Learning Management Portal
### Ministry of Earth Sciences (MoES) | India Meteorological Department (IMD)
**Theme:** Smart Education | **Category:** Software

---

## 🌟 Executive Overview
**CAPACITY CONNECT** is an institutional, production-ready Digital Capacity Building and Learning Management Portal designed for the **Ministry of Earth Sciences (MoES)** and the **India Meteorological Department (IMD)**. It unifies training, competency development, and knowledge sharing across India's atmospheric and earth sciences workforce (Mausam Bhavan HQ, 6 Regional Meteorological Centres, and 36+ Doppler Radar Observatories).

---

## 🚀 Key Features

### 1. Dual-Layer Authentication & RBAC
- **Real Google OAuth Login**: 1-click authentication using Google Identity Services.
- **Real Email & Password Signup with Activation Verification**: Automatically dispatches a genuine verification link to the user's email address via Firebase Authentication (`sendEmailVerification`).
- **Role-Based Access Control**:
  - `Trainee`: Meteorologists, Scientific Officers, Observational Staff.
  - `Trainer`: Subject-matter specialists, Senior Scientists, CTI Faculty.
  - `Admin`: Executive Directorate, Director General Office, Training Division.
- **Evaluator Fast-Login Switcher**: 1-click instant login to test as Trainee (`S. K. Verma`), Trainer (`Dr. R. S. Sharma`), or Admin (`Dr. M. Mohapatra`).

### 2. Trainee Module
- **Professional Profile**: Manage scientific qualifications, field postings/observatories, technical skills (e.g. WRF, Python, Radar), and research interests.
- **Course Enrollment & Progress**: Self-enroll in specialized meteorological courses (Doppler Weather Radar, High-Resolution NWP, INSAT-3DS Satellite Met, Cyclone Warning, Agromet Advisories).
- **Trainer Library Access**: Stream lecture recordings and download SOPs, PDF manuals, and presentation decks.
- **Subject-Wise MCQ Assessments**: Timed interactive exams with real-time countdown timer, question palette, automated grading, and scientific answer explanations.
- **Verifiable Digital Certificate**: Official MoES/IMD Certificate with unique verification ID, QR code, and DG signature.
- **Course Feedback**: Star rating and qualitative feedback submission.

### 3. Trainer Module
- **Faculty Profile**: Track specializations, publications, and postings.
- **Questionnaire & Quiz Builder**: Dynamic quiz creation with question pooling, 4 options, designated correct keys, explanations, duration limits, and deadlines.
- **Trainee Monitoring Gradebook**: Live table of enrolled trainees, test attempts, scores, and pass/fail metrics.
- **Trainer Library Uploader**: Upload lecture recordings (video links), presentation decks, and technical manuals.

### 4. Admin Module
- **User Approval Pipeline**: Review new registrations, approve or reject staff accounts.
- **National Role Directory**: Search staff, assign or modify roles, activate/suspend accounts.
- **Executive Analytics Dashboards**: Real-time KPI counters, discipline enrollment distribution, and Regional Meteorological Centre (RMC) participation tracking.
- **Homepage CMS**: Publish circulars, urgent advisories, and national achievements directly to the public notice board.
- **Competency Mapping Engine**: Algorithmic matrix mapping specialized meteorological subjects to qualified trainers based on skills and experience, featuring smart trainer discovery and skill-gap alerts.

---

## 🛠️ Technology Stack & Languages

- **Frontend Framework**: Next.js 14 / 15 (React 18 / 19, TypeScript)
- **Styling**: Tailwind CSS with custom MoES / IMD institutional color theme
- **Icons**: Lucide React
- **Authentication**: Firebase Authentication (Google OAuth + Email/Password + `sendEmailVerification`)
- **Database & Storage**: Cloud Firestore & Hybrid Local Persistence
- **Deployment**: Vercel (Edge serverless execution, 99.99% uptime)

---

## 📦 Local Quick-Start Guide

### Prerequisites
- Node.js v18+ or v24+
- npm v9+

### 1. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Production Build & Verification
```bash
npm run build
npm run start
```

---

## ☁️ Direct Vercel Deployment

This project is built using native Next.js conventions and is 100% ready for Vercel deployment:

### Option A: Via Vercel CLI
```bash
npm install -g vercel
vercel
```

### Option B: Via GitHub & Vercel Dashboard
1. Push this repository to GitHub.
2. In [Vercel Dashboard](https://vercel.com/new), select "Import Project" and choose the repository.
3. Framework Preset: **Next.js** (auto-detected).
4. Add Environment Variables (optional, for live Firebase Auth):
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
5. Click **Deploy**. Vercel will build and assign a live production URL!

---

## 🏛️ Ministry & Institutional Attribution
- **Ministry:** Ministry of Earth Sciences (MoES), Government of India
- **Department:** India Meteorological Department (IMD)
- **National Headquarters:** Mausam Bhavan, Lodhi Road, New Delhi – 110003
