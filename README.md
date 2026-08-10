# Flux — AI-Powered Counterfeit Detection

> **"See the truth."**  
> Point your camera at any product and get an AI-powered authenticity assessment in seconds.

Flux is an AI-powered product authentication platform designed to help consumers, brands, vendors, and regulatory bodies detect counterfeit products using computer vision, OCR, NLP, and product intelligence.

The platform allows users to scan a product using a smartphone camera or upload an image and receive an authenticity assessment together with a forensic breakdown of the signals used during verification.

---

## What is Flux?

Counterfeit products remain a major challenge across healthcare, consumer goods, and other industries.

Flux addresses this problem by providing a technology-driven verification layer that can analyze product packaging and associated information without requiring QR codes, specialized hardware, or direct manufacturer integration.

Flux combines:

- Computer vision
- OCR
- Natural Language Processing
- Product information validation
- Real-time analytics
- Geolocation
- Vendor discovery
- Payment infrastructure

The goal is to make product verification accessible through a standard smartphone camera.

---

## Live Demo

| Resource | Link |
|---|---|
| 🌐 Web Application | [Flux](https://fluxsquad.vercel.app) |
| 🔌 Backend API | [Flux API](https://flux-w0wv.onrender.com) |
| 🤖 AI Microservice | [Flux AI API](https://Oriadee-Flux-api.hf.space) |

---

## The Problem

Counterfeit products create significant risks for consumers, legitimate businesses, and regulatory agencies.

Flux focuses particularly on the problem of counterfeit pharmaceutical products and other high-risk consumer goods.

---

## How Flux Works

A user can point their camera at a product or upload a product image.

Flux processes the submitted information through multiple verification layers and returns an authenticity assessment.

The system can classify a product as:

- **GENUINE**
- **SUSPICIOUS**
- **COUNTERFEIT**

The result is accompanied by a forensic breakdown explaining the signals considered during verification.

---

## Forensic Verification Signals

| Signal | What the system analyzes |
|---|---|
| **Typography Forensics** | Font characteristics, spacing and typography anomalies |
| **Colour Profile Analysis** | Colour and visual deviations |
| **Print Quality & Halftone Analysis** | Printing artifacts, dot patterns and quality inconsistencies |
| **Geometric Ratio Analysis** | Logo proportions, borders and packaging geometry |
| **OCR + NLP Validation** | Product numbers, batch information, expiry formats and manufacturer information |
| **Texture & Surface Analysis** | Packaging texture, embossing, seals and other physical characteristics |

---

# Architecture

Flux is implemented as a multi-service application consisting of a frontend, backend API, database layer and AI microservice.

```
┌─────────────────────────────────────────────────────────────────────┐
│                              FLUX                                   │
├──────────────────────┬───────────────────────┬──────────────────────┤
│      Frontend        │       Backend         │    AI Microservice   │
│                      │                       │                      │
│    React + Vite      │    Node.js + Express  │    FastAPI + Python  │
│      Vercel          │       Render          │   Hugging Face       │
│                      │                       │                      │
│  /scan               │ POST /api/scan        │ POST /verify         │
│  /onboard            │ POST /api/brands      │ EfficientNet-B0      │
│  /brand              │ POST /api/vendors     │ Tesseract OCR        │
│  /dashboard          │ GET  /api/dashboard   │ BERT NLP             │
│  /vendor             │ POST /api/squad       │                      │
└──────────────────────┴───────────────────────┴──────────────────────┘
                              │
                              ▼
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
MONGODB_URI=mongodb_uri
JWT_SECRET=yoursecretkey

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
cd verascan/server
npm run dev

# Terminal 2 — Frontend
cd verascan/client
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

### Team

| Name | Role |
|---|---|
| Warris | Full Stack Engineer — designed and implemented the React frontend, Node.js/Express backend, MongoDB data layer, authentication, APIs and Squad payment integration |
| Boluwatife | AI/ML Engineer — EfficientNet-B0, Tesseract OCR, BERT, FastAPI, NLP |
| Similoluwa | Product & UI/UX Designer |

---


*Flux · See the truth  ·Proof of Life*