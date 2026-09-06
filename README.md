# 🌾 Kissan Kart — Full-Stack Agricultural Marketplace

**Kissan Kart** is a modern full-stack farmer-to-customer agricultural platform connecting farmers directly with customers to eliminate unnecessary middlemen, guarantee fresh harvests, and ensure fair earnings for agricultural growers.

Built strictly according to [DESIGN.md](./DESIGN.md) with unique, creative UI/UX, Dark/Light theme switching, and full role-based features for Customers, Farmers, and Administrators.

---

## ✨ Features

### 🎨 Unique Agricultural UI / UX & Theming
- **Dark & Light Mode**: Smooth transition between **Natural Cream & Lush Green Light Mode** and **Emerald Night & Forest Slate Dark Mode**.
- **Harvest Freshness Badges**: Live dynamic tags showing days since harvest (*"Harvested Today"*, *"Harvested Yesterday"*).
- **Interactive Micro-Interactions**: Wishlist heart animations, category emoji chips, order timeline progress trackers, and confetti celebrations.

### 👤 Customer Features
- **Landing Page & Catalog**: Search, category filters across 9 departments, price range slider, organic-only toggle, and sorting.
- **Product Details**: Multi-photo gallery, unit pricing (kg, g, dozen, liter), farming methods, and customer reviews.
- **Cart & Delivery Progress**: Live subtotal calculations with dynamic progress meter towards FREE delivery.
- **Multi-Step Checkout**: Delivery address form, payment options (Cash on Delivery, UPI, and Card), and instant order placement.
- **Visual Order Tracking**: Interactive step-by-step progress timeline (*Order Placed → Farm Confirmed → Harvesting & Packing → Out for Delivery → Delivered*).
- **Wishlist**: Persistent favorites with 1-click move to cart.

### 👨‍🌾 Farmer Portal (`/farmer/dashboard`)
- **Real-Time KPI Cards**: Total Revenue, Incoming Orders, Listed Crops, Customers served.
- **Live Inventory Control**: Automatic stock decrements upon order placement with low-stock and out-of-stock indicators.
- **Order Pipeline**: Step-by-step order progression controls (*Accept → Harvest & Pack → Ready for Dispatch → Out for Delivery → Delivered*).
- **Add / Edit Harvest Modal**: Form to publish new agricultural produce with image previews, units, and harvest dates.

### 🛡️ Admin Panel (`/admin`)
- **Platform Analytics**: Revenue metrics, order statistics, user distribution, and crop category breakdown.
- **Grower Verification**: Toggle farmer verification status (*Verified* vs *Pending* vs *Rejected*).
- **Listing Moderation**: Review and remove inappropriate products from the marketplace.
- **Orders Oversight**: Monitor all transaction flows.

### ⚡ 1-Click Demo Switcher
A persistent top bar allows reviewers to switch between **Customer**, **Farmer (Ravi)**, and **Admin** in one click.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS (with custom agricultural theme & dark mode), React Router v6, Lucide React, Axios, Canvas Confetti.
- **Backend**: Node.js v22, Express.js, JWT Authentication, bcryptjs, CORS, Morgan.
- **Database**: MongoDB / Mongoose with resilient zero-config fallback and rich initial Indian agricultural seed data.

---

## 🚀 Getting Started

### 1. Backend Setup
```bash
cd backend
npm install
npm run dev
```
*Backend server runs on `http://localhost:5000` with auto-seeded demo data.*

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`.*

---

## 🔑 Demo Test Credentials

| Role | Email | Password | Persona |
|---|---|---|---|
| **Customer** | `ananya@gmail.com` | `customer123` | Ananya Sharma (Bengaluru) |
| **Farmer** | `ravi@greenvalley.com` | `farmer123` | Ravi Kumar (Green Valley Farms) |
| **Admin** | `admin@kissankart.com` | `admin123` | Priya Sharma (Platform Oversight) |

*(Or click the demo role buttons directly in the top bar of the application!)*
