# Flux — AI-Powered Counterfeit Detection

> **"See the truth."** — Point your camera at any product. Get a forensic verdict in 4 seconds.


## What is Flux?

Bloomberg labelled Nigeria the most counterfeit market in the developing world. **70% of drugs in circulation are fake. 12,300 Nigerians die every year from counterfeit malaria drugs alone.**

Flux is an AI-powered product authentication platform that uses computer vision, OCR, and NLP to verify whether a product is genuine or counterfeit — in real time, using only a smartphone camera or uploaded photo.

**No QR codes. No special hardware. No manufacturer cooperation required. Just a camera.**

---

## Live Demo

| Resource | Link |
|---|---|
| 🌐 Web App | [Flux.vercel.app](https://Fluxsquad.vercel.app) |
| 🔌 API | [your-railway-url.railway.app](https://flux-w0wv.onrender.com) |
| 🤖 AI Model | [Oriadee-Flux-api.hf.space](https://Oriadee-Flux-api.hf.space) |

---

## The Problem

| Metric | Scale |
|---|---|
| Fake products in Nigeria | 70% of Product in circulation |
| Deaths per year | 12,300 from fake malaria drugs alone |
| Counterfeit auto parts | 75% of parts in Nigeria (SON) |
| NAFDAC seizures | ₦120B worth in just 6 months |
| Global economic loss | $1.7 trillion per year |

---

## How It Works

A user points their camera — or uploads a photo — at any product. In under 5 seconds, Flux analyses six forensic signals simultaneously and returns a trust score: **GENUINE**, **SUSPICIOUS**, or **COUNTERFEIT** — with a full forensic breakdown.

### Six Forensic Signals

| Signal | What the AI Detects |
|---|---|
| **Typography Forensics** | Kerning, font weight, letter spacing anomalies invisible to the human eye |
| **Colour Profile Analysis** | Pantone/CMYK deviations — even a 2% colour shift in hue or saturation |
| **Print Quality & Halftone** | Dot density, ink bleed, resolution artifacts in packaging print |
| **Geometric Ratio Analysis** | Logo proportions, border thickness — counterfeits compress or stretch slightly |
| **OCR + NLP Validation** | NAFDAC numbers, batch codes, expiry formats, manufacturer address checking |
| **Texture & Surface Analysis** | Embossing depth, seal ridge consistency, hologram integrity |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Flux                            │
├──────────────┬──────────────────────┬───────────────────────┤
│   Frontend   │      Backend         │    AI Microservice    │
│  React/Vite  │  Node.js + Express   │  FastAPI + Python     │
│  Vercel      │  Railway             │  HuggingFace Spaces   │
│              │                      │                       │
│  /scan       │  POST /api/scan ─────┼──► POST /verify       │
│  /onboard    │  POST /api/brands    │   EfficientNet-B0     │
│  /brand      │  POST /api/vendors   │   Tesseract OCR       │
│  /dashboard  │  GET  /api/dashboard │   BERT NLP            │
│  /vendor/... │  POST /api/squad/... │                       │
└──────────────┴──────────────────────┴───────────────────────┘
                         │
                    MongoDB Atlas
```

### Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js (Vite), React Router, Axios |
| Backend | Node.js, Express.js, Mongoose |
| Database | MongoDB (Atlas) |
| AI Model | EfficientNet-B0, Tesseract OCR, BERT (FastAPI on HuggingFace) |
| Payments | Squad API (GTBank SquadCo) |
| Auth | JWT + bcryptjs |
| Deployment | Vercel (frontend) + Render (backend) |

---

## Squad API Integration

Squad is not a payment button in Flux — it is the **trust layer** that connects every actor in the ecosystem.

| API | How We Use It |
|---|---|
| **Squad Checkout API** | Brand onboarding — ₦50,000/mo triggers product entry into verification pipeline |
| **Squad Payment Links** | Consumer purchases from verified vendors after counterfeit detected |
| **Squad Recurring Billing** | NAFDAC intelligence dashboard monthly subscription |
| **Squad Webhooks** | Real-time payment confirmation auto-activates brand/vendor accounts |

> Remove Squad from Flux and the entire commercial model collapses. It is the backbone, not a feature.

---

## Features

### For Consumers
- 📷 **Live camera scan** — point and get verdict in 4 seconds
- 📁 **Photo upload** — upload any product image for analysis
- 🔬 **Forensic breakdown** — see exactly what the AI detected
- 🏥 **Verified vendor locator** — find genuine product near you after fake detected
- 🧾 **Receipt system** — pay via Squad, get a receipt code to show at vendor place

### For Brands
- 🔐 **Brand portal** — register company, add unlimited products
- 📊 **Scan analytics** — see scan count and fake detections per product
- 🚨 **Real-time alerts** — notified when counterfeits detected
- ₦ **Squad-powered onboarding** — ₦50,000/mo, unlimited products

### For Vendors (Pharmacies)
- 🏪 **Vendor portal** — manage products, prices, stock levels
- 💳 **Customer payments** — receive Squad payments directly
- 📦 **Order tracking** — see customers directed to your vendor
- 🗺 **Network listing** — appear in locator when fakes detected nearby

### For NAFDAC
- 🗺 **Intelligence dashboard** — real-time counterfeit heatmap by region
- 📈 **Scan analytics** — total scans, detection rates, by-product breakdown
- ⚠ **Active alerts** — proactive deployment recommendations
- 👥 **Vendor & brand management** — activate, monitor, manage all actors

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Squad sandbox API keys — [sandbox.squadco.com](https://sandbox.squadco.com)
- Gmail account (for email notifications)

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/Warris-web/verrascan
cd verrascan

# 2. Install server dependencies
cd server
npm install

# 3. Install client dependencies
cd ../client
npm install
```

### Environment Variables

**`verrascanlux/server/.env`**

```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=**************

# Squad API (get from sandbox.squadco.com)
SQUAD_SECRET_KEY=
SQUAD_PUBLIC_KEY=
SQUAD_BASE_URL=https://sandbox-api-d.squadco.com

# AI microservice
AI_SERVICE_URL=https://Oriadee-Flux-api.hf.space

# Client URL (for Squad redirect callbacks)
CLIENT_URL=https://fluxsquad.vercel.app/

# Email (optional — for credential notifications)
MAIL_USER=
MAIL_PASS=
```

**`Flux/client/.env`**

```env
VITE_API_URL=https://fluxsquad.vercel.app/
```

### Run Locally

```bash
# Terminal 1 — Backend
cd flux/server
npm run dev

# Terminal 2 — Frontend
cd flux/client
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---



### Demo Credentials

For security reasons, demo credentials are not published in this repository.


---


## API Reference

### Scan a product

```http
POST /api/scan
Content-Type: application/json

{
  "image": "base64string",
  "product_name": "Coartem",
  "product_category": "pharma",
  "region": "Lagos"
}
```

**Response:**
```json
{
  "success": true,
  "verdict": "COUNTERFEIT",
  "confidence": 91,
  "signals": [
    {
      "name": "NAFDAC Number Validation",
      "status": "FAIL",
      "detail": "Reg. A4-1234 — format invalid",
      "score": 12
    }
  ],
  "recommendation": "Do not use this product. Find a verified vendor nearby."
}
```

### Register a brand

```http
POST /api/brands/register
Content-Type: application/json

{
  "company_name": "Roche Nigeria Ltd",
  "contact_email": "brand@roche.com",
  "password": "yourpassword"
}
```

### Find nearby vendors

```http
GET /api/vendors/nearby?city=Lagos&product=Coartem
```

### Auth — Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "ngozi@nafdac.gov.ng",
  "password": "nafdac123"
}
```

---

## Project Structure

```
Flux/
├── client/                     # React frontend (Vite)
│   └── src/
│       ├── pages/
│       │   ├── LandingPage.jsx       # Public landing page
│       │   ├── ScanPage.jsx          # Camera + upload scanner
│       │   ├── OnboardPage.jsx       # Brand registration + Squad payment
│       │   ├── LoginPage.jsx         # Auth — brand, vendor, NAFDAC
│       │   ├── BrandPortal.jsx       # Brand dashboard + product management
│       │   ├── NafdacPortal.jsx      # NAFDAC intelligence dashboard
│       │   ├── VendorPortal.jsx      # Vendor dashboard + product/price management
│       │   ├── VendorRegisterPage.jsx# Vendor registration + Squad payment
│       │   └── VendorLocatorPage.jsx # Verified vendor locator + receipt system
│       ├── components/
│       │   └── Topbar.jsx
│       └── context/
│           └── AuthContext.jsx       # JWT auth state
│
├── server/                     # Node.js backend (Express)
│   ├── controllers/
│   │   ├── scanController.js         # AI microservice bridge + fallback mock
│   │   ├── brandController.js        # Brand registration + Squad checkout
│   │   ├── vendorController.js       # Vendor registration + payments + locator
│   │   ├── productController.js      # Product CRUD for brands
│   │   ├── authController.js         # JWT login + register
│   │   ├── dashboardController.js    # Real-time stats + heatmap
│   │   └── squadController.js        # Webhook handler
│   ├── models/
│   │   ├── User.js                   # brand | vendor | nafdac roles
│   │   ├── BrandRegistration.js      # Company-level brand account
│   │   ├── Product.js                # Individual products per brand
│   │   ├── Vendor.js                 # Vendor with products + prices
│   │   └── ScanResult.js             # Every scan stored with verdict
│   ├── routes/
│   │   ├── auth.js
│   │   ├── brands.js
│   │   ├── vendors.js
│   │   ├── products.js
│   │   ├── scan.js
│   │   ├── dashboard.js
│   │   └── squad.js
│   └── middleware/
│       └── auth.js                   # JWT verification + role-based access
│
└── README.md
```

---

## Deployment

### Backend — Render

1. Push repo to GitHub
2. Go to [Render.app](https://Render.app) → New Project → Deploy from GitHub
3. Set root directory to `server`
4. Add all environment variables from `server/.env`
5. Render auto-detects Node.js and deploys

### Frontend — Vercel

1. Go to [vercel.com](https://vercel.com) → New Project → Import from GitHub
2. Set root directory to `client`
3. Add environment variable: `VITE_API_URL=https://your-render-url.render.app`
4. Deploy

### Database — MongoDB Atlas

1. Go to [mongodb.com/atlas](https://mongodb.com/atlas) → Free cluster
2. Get connection string
3. Add to Railway env as `MONGODB_URI`

---

## The Business Model

| Stream | Customer | Price | Squad API |
|---|---|---|---|
| **B2B** | Brands (FMCG, pharma,) | $5,000 —  products | Squad Checkout |
| **B2G** | NAFDAC, SON | $7,000 — intelligence dashboard | Squad Recurring |
| **Vendor** | Product | $100 per listing | Squad Checkout |
| **B2C** | Consumers | Free forever — data flywheel | Squad Payment Links |


---

## The Team

| Name | Role |
|---|---|
| Warris  | Full Stack Engineer — React, Node.js, MongoDB, Squad API |
| Boluwatife | AI/ML Engineer — EfficientNet-B0, Tesseract OCR, BERT, FastAPI,NLP |
| Similoluwa | Product & UI/UX Designer |

---


*Flux · See the truth · Squad Hackathon 3.0 · Challenge 01: Proof of Life*