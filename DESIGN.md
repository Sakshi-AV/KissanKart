# Kissan Kart — Full-Stack Web App Design Specification

## 1. Project Overview

**Kissan Kart** is a full-stack farmer-to-customer agricultural marketplace.

The platform connects farmers directly with customers so farmers can sell agricultural products without unnecessary intermediaries.

### Main Goals

- Allow farmers to list and sell agricultural products.
- Allow customers to discover and purchase products directly from farmers.
- Provide transparent pricing and farmer information.
- Provide secure authentication and role-based access.
- Provide product, cart, checkout, order, inventory, review, and dashboard functionality.
- Deliver a clean, modern, responsive, agriculture-focused user experience.

---

## 2. User Roles

### Customer

Customers can:

- Register and log in.
- Browse products.
- Search and filter products.
- View product details.
- View farmer profiles.
- Add products to cart.
- Add products to wishlist.
- Manage quantities in cart.
- Add delivery addresses.
- Place orders.
- View order history.
- Track orders.
- Cancel eligible orders.
- Rate and review products.
- Manage their profile.

### Farmer

Farmers can:

- Register as farmers.
- Create and manage a farmer profile.
- Add agricultural products.
- Upload product images.
- Edit and delete their products.
- Set prices and available quantities.
- Manage inventory.
- View incoming orders.
- Accept/reject orders.
- Update order status.
- View sales and revenue.
- Manage their farm information.

### Admin

Admins can:

- View platform statistics.
- Manage customers.
- Manage farmers.
- Approve/reject farmer accounts.
- Manage products.
- Manage categories.
- Manage orders.
- Remove inappropriate products.
- Monitor marketplace activity.
- Handle reported users/products.

---

## 3. Application Structure

```text
KISSAN KART
│
├── Landing Page
│
├── Authentication
│   ├── Login
│   ├── Register
│   ├── Forgot Password
│   └── Reset Password
│
├── Customer
│   ├── Home
│   ├── Products
│   ├── Product Details
│   ├── Farmers
│   ├── Farmer Profile
│   ├── Wishlist
│   ├── Cart
│   ├── Checkout
│   ├── Orders
│   ├── Order Details
│   └── Profile
│
├── Farmer
│   ├── Dashboard
│   ├── My Products
│   ├── Add Product
│   ├── Edit Product
│   ├── Orders
│   ├── Inventory
│   ├── Sales
│   └── Farmer Profile
│
└── Admin
    ├── Dashboard
    ├── Farmers
    ├── Customers
    ├── Products
    ├── Orders
    └── Categories
```

---

## 4. Design Direction

The application should look like a modern agricultural e-commerce platform.

### Design Keywords

- Fresh
- Natural
- Trustworthy
- Modern
- Clean
- Professional
- Friendly
- Simple
- Farmer-focused

Avoid making the UI look like a generic shopping template.

Avoid excessive gradients, excessive animations, or overly complicated layouts.

---

## 5. Color Palette

Use the following color system:

```text
Primary Green:       #2E7D32
Dark Green:          #1B5E20
Light Green:         #E8F5E9
Accent Yellow:       #F9A825
Cream:               #FFFDF5
Dark Text:           #263238
Muted Text:          #607D8B
White:               #FFFFFF
```

Green should mainly be used for:

- Primary buttons
- Active navigation
- Verification badges
- Success states
- Important agricultural accents

Use white and cream backgrounds for readability.

---

## 6. Typography

Use:

**Primary Font:** Poppins

Alternative:

**Inter**

Recommended sizes:

```text
Hero Heading:       48–64px
Page Heading:       32–40px
Section Heading:    24–30px
Card Heading:       18–20px
Body Text:          14–16px
Small Text:         12–14px
Button Text:        14–16px
```

Use appropriate font weights to establish hierarchy.

---

## 7. Landing Page

Create a strong first impression.

### Hero Section

Headline:

> From Our Farms to Your Home.

Supporting text:

> Buy fresh agricultural products directly from trusted farmers.

Primary CTA:

**Shop Fresh Products**

Secondary CTA:

**Sell Your Products**

Hero visual should communicate:

- Fresh produce
- Farmers
- Farms
- Direct selling
- Natural agriculture

Use subtle agricultural illustrations or high-quality imagery.

---

## 8. Navigation

Desktop navigation:

```text
Kissan Kart

Home | Shop | Farmers | Categories | About

                    Search | Wishlist | Cart | Login
```

For customers:

```text
Home
Shop
Farmers
Orders
Wishlist
Cart
Profile
```

For farmers:

```text
Dashboard
Products
Add Product
Orders
Inventory
Sales
Profile
```

For admins:

```text
Dashboard
Farmers
Customers
Products
Orders
Categories
```

Mobile navigation should use a clean hamburger menu.

---

## 9. Homepage Sections

The homepage should contain:

1. Navbar
2. Hero section
3. Popular categories
4. Fresh products
5. Featured farmers
6. Why Kissan Kart?
7. How It Works
8. Customer reviews
9. Farmer CTA
10. Footer

---

## 10. Product Categories

Create visually attractive category cards.

Categories:

- Vegetables
- Fruits
- Grains
- Pulses
- Spices
- Dairy
- Organic Products
- Seeds
- Other Farm Products

Example:

```text
🥕 Vegetables
🍎 Fruits
🌾 Grains
🫘 Pulses
🌶️ Spices
🥛 Dairy
🌱 Organic
🌻 Seeds
```

---

## 11. Product Catalog

Create a responsive product grid.

Each product card should contain:

- Product image
- Product name
- Category
- Price
- Unit
- Farmer name
- Rating
- Availability
- Wishlist button
- Add to Cart button

Example:

```text
┌──────────────────────┐
│                      │
│    PRODUCT IMAGE     │
│                      │
│  Organic Tomatoes    │
│  ⭐ 4.8              │
│                      │
│  ₹60 / kg            │
│  Farmer: Ravi Farms  │
│                      │
│  [ Add to Cart ]     │
└──────────────────────┘
```

Add a subtle hover effect.

---

## 12. Search and Filters

The Shop page must support:

### Search

```text
Search for vegetables, fruits, grains...
```

### Filters

- Category
- Price range
- Organic/non-organic
- Availability
- Rating
- Farmer location

### Sorting

- Price: Low to High
- Price: High to Low
- Highest Rated
- Newest

Search and filters must work with backend data.

---

## 13. Product Details Page

Create a detailed product page.

### Main Information

- Large product image/gallery
- Product name
- Rating
- Price
- Unit
- Available quantity
- Description
- Organic status
- Harvest date
- Farming method
- Location
- Quantity selector
- Add to Cart button
- Wishlist button

### Farmer Section

Display:

```text
Farmer: Ravi Kumar
Farm: Green Valley Farms
Location: Hubballi, Karnataka
⭐ 4.8
✓ Verified Farmer

[ View Farmer ]
```

---

## 14. Farmer Profile

The farmer profile is an important trust feature.

Display:

- Farmer photo
- Farmer name
- Verified badge
- Farm name
- Location
- Farming experience
- Farm description
- Rating
- Number of products
- Reviews
- Products sold by the farmer

Example:

```text
👨‍🌾

Ravi Kumar ✓ Verified

Green Valley Farms
📍 Hubballi, Karnataka

⭐ 4.8
Products: 24

"Growing fresh and healthy produce
for our community."
```

---

## 15. How It Works

Create a simple visual process:

```text
01
FARMER
Lists fresh products
        ↓
02
CUSTOMER
Discovers products
        ↓
03
CUSTOMER
Places an order
        ↓
04
FARMER
Prepares the order
        ↓
05
DELIVERY
Order reaches customer
```

---

## 16. Why Kissan Kart?

Create four feature cards:

### Fresh From Farms

Products are sourced directly from farmers.

### Direct Connection

Farmers connect directly with customers.

### Fair Pricing

Transparent pricing for both sides.

### Trusted Farmers

Verified profiles and reviews build trust.

---

## 17. Cart

Cart should show:

```text
Product
Price
Quantity
Subtotal
```

Example:

```text
Organic Tomatoes
₹60/kg
Quantity: [- 2 +]
Subtotal: ₹120

Fresh Mangoes
₹100/kg
Quantity: [- 1 +]
Subtotal: ₹100

--------------------------------

Subtotal: ₹220
Delivery: ₹30
Total: ₹250

[ Proceed to Checkout ]
```

Cart totals must update automatically.

---

## 18. Checkout

Create a multi-step checkout:

```text
Delivery Address
       ↓
Order Summary
       ↓
Payment
       ↓
Order Confirmation
```

### Address Fields

- Full name
- Phone number
- Address
- City
- State
- Pincode

### Payment

Initially support:

- Cash on Delivery
- Online Payment placeholder/integration-ready architecture

Payment gateway credentials must never be exposed in frontend code.

---

## 19. Order Confirmation

After successful order:

```text
✓

ORDER PLACED!

Your order has been successfully placed.

Order ID:
KK202600123

Estimated Delivery:
2–3 Days

[ Track Order ]

[ Continue Shopping ]
```

---

## 20. Order Tracking

Use a visual timeline:

```text
Order Placed
     │
     ✓
Order Confirmed
     │
     ✓
Preparing
     │
     ○
Out for Delivery
     │
     ○
Delivered
```

Order status should be controlled by backend data.

---

## 21. Customer Orders

Display:

```text
MY ORDERS

Order #KK202600123
Organic Tomatoes
₹120
Status: Out for Delivery

[ View Details ]
```

Allow filtering:

- All
- Pending
- Confirmed
- Preparing
- Out for Delivery
- Delivered
- Cancelled

---

## 22. Wishlist

Customers can save products.

Wishlist card:

```text
♡ Organic Tomatoes
₹60/kg
⭐ 4.8

[ Add to Cart ]
```

Wishlist state must persist for authenticated users.

---

## 23. Reviews and Ratings

After an eligible delivered order, customers can submit:

```text
How was your experience?

⭐ ⭐ ⭐ ⭐ ⭐

Write your review...

[ Submit Review ]
```

Reviews should include:

- Customer
- Rating
- Comment
- Date

Calculate product/farmer ratings from review data.

---

## 24. Farmer Dashboard

Create a professional dashboard.

### Summary Cards

```text
Total Sales
₹48,520

Orders
126

Products
32

Customers
94
```

### Dashboard Sections

- Revenue chart
- Orders chart
- Recent orders
- Top-selling products
- Low-stock products
- Quick actions

### Quick Actions

```text
+ Add Product
View Orders
Manage Inventory
View Sales
```

---

## 25. Add Product

Create a farmer-friendly form.

Fields:

```text
Product Name
Category
Description
Price
Unit
Available Quantity
Organic / Non-organic
Harvest Date
Location
Product Images
```

Features:

- Image preview
- Client-side validation
- Backend validation
- Clear error messages
- Publish Product button

---

## 26. Inventory

Display:

```text
Product          Stock       Status
────────────────────────────────────
Tomatoes         25 kg       Available
Potatoes         5 kg        Low Stock
Rice             0 kg        Out of Stock
Mangoes          50 kg       Available
```

Statuses:

- Available
- Low Stock
- Out of Stock

Inventory must automatically decrease when an order is successfully placed.

Do not allow orders beyond available inventory.

---

## 27. Farmer Order Management

Farmer should see:

```text
Order ID
Customer
Products
Quantity
Total
Date
Status
```

Possible workflow:

```text
Pending
   ↓
Accepted
   ↓
Preparing
   ↓
Ready
   ↓
Out for Delivery
   ↓
Delivered
```

Farmers can update statuses according to authorization rules.

---

## 28. Admin Dashboard

Show:

```text
Total Users
Total Farmers
Total Customers
Total Products
Total Orders
Total Revenue
```

Charts:

- Sales over time
- New users
- Orders
- Products by category

Admin tables:

- Farmers
- Customers
- Products
- Orders
- Categories

Include:

- Search
- Filters
- Pagination
- Status controls

---

## 29. Authentication

Pages:

```text
Login
Register
Forgot Password
Reset Password
```

Registration should allow:

```text
Customer
Farmer
```

Farmer registration fields:

- Name
- Email
- Phone
- Farm name
- Location
- Farming type

Use secure authentication and role-based access.

---

## 30. Database

Use:

**MongoDB + MongoDB Atlas + Mongoose**

### User

```text
User
├── _id
├── name
├── email
├── passwordHash
├── phone
├── role
├── profileImage
├── address
├── createdAt
└── updatedAt
```

Roles:

```text
customer
farmer
admin
```

### Farmer

```text
Farmer
├── _id
├── userId
├── farmName
├── location
├── description
├── experience
├── verificationStatus
├── rating
├── totalProducts
└── createdAt
```

### Product

```text
Product
├── _id
├── farmerId
├── name
├── category
├── description
├── images
├── price
├── unit
├── quantity
├── organic
├── harvestDate
├── location
├── rating
├── createdAt
└── updatedAt
```

### Order

```text
Order
├── _id
├── customerId
├── items
├── totalAmount
├── deliveryAddress
├── paymentMethod
├── paymentStatus
├── orderStatus
├── createdAt
└── updatedAt
```

### Order Item

```text
OrderItem
├── productId
├── farmerId
├── quantity
├── price
└── subtotal
```

### Review

```text
Review
├── _id
├── productId
├── customerId
├── rating
├── comment
└── createdAt
```

---

## 31. REST API

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

### Products

```text
GET    /api/products
GET    /api/products/:id
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
```

### Farmers

```text
GET /api/farmers
GET /api/farmers/:id
PUT /api/farmers/:id
```

### Cart

```text
GET    /api/cart
POST   /api/cart
PUT    /api/cart/:id
DELETE /api/cart/:id
```

### Orders

```text
POST /api/orders
GET  /api/orders
GET  /api/orders/:id
PUT  /api/orders/:id/status
```

### Reviews

```text
POST /api/reviews
GET  /api/products/:id/reviews
```

---

## 32. Recommended Tech Stack

### Frontend

```text
React
JavaScript
Tailwind CSS
React Router
Axios
```

### Backend

```text
Node.js
Express.js
REST API
JWT
bcrypt
```

### Database

```text
MongoDB
MongoDB Atlas
Mongoose
```

### Image Storage

Use:

```text
Cloudinary
```

Product images should be stored using cloud storage rather than directly inside MongoDB.

---

## 33. Frontend Components

Create reusable components:

```text
components/

Navbar
Footer
Hero
ProductCard
ProductGrid
CategoryCard
SearchBar
FilterSidebar
FarmerCard
FarmerBadge
Rating
ReviewCard
CartItem
OrderCard
OrderTimeline
LoadingSpinner
Skeleton
Modal
Toast
Button
Input
Select
```

Do not duplicate UI code unnecessarily.

---

## 34. Folder Structure

```text
kissan-kart/

├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── context/
│   │   ├── utils/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   ├── utils/
│   ├── config/
│   ├── server.js
│   └── package.json
│
├── .env.example
├── README.md
└── DESIGN.md
```

---

## 35. Security

Implement:

- Password hashing using bcrypt.
- JWT authentication.
- Protected routes.
- Role-based authorization.
- Input validation.
- Backend validation.
- Secure CORS configuration.
- Environment variables.
- Ownership checks for farmer products.
- Authorization checks for admin operations.
- Inventory validation before order creation.

Use `.env` for secrets:

```text
DATABASE_URL
JWT_SECRET
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
PAYMENT_SECRET
```

Never expose secrets in frontend code.

---

## 36. Error Handling

Use friendly UI messages.

Examples:

```text
No products found.

Your cart is empty.

Something went wrong. Please try again.

Product added to cart successfully.

Order placed successfully.

Your session has expired. Please login again.

This product is currently out of stock.
```

Do not expose raw server/database errors to users.

---

## 37. Loading States

Use skeleton loaders rather than blank screens.

Implement loading states for:

- Products
- Farmer profiles
- Dashboard
- Orders
- Cart
- Product details

Example:

```text
┌─────────────────────┐
│ ██████████████████  │
│ ███████             │
│ █████████           │
│ █████               │
└─────────────────────┘
```

---

## 38. Empty States

### Empty Cart

```text
🛒

Your cart is empty.

Discover fresh products from local farmers.

[ Start Shopping ]
```

### Empty Wishlist

```text
♡

No products saved yet.

[ Explore Products ]
```

### Empty Orders

```text
📦

You haven't placed any orders yet.

[ Browse Products ]
```

---

## 39. Responsive Design

The application must work correctly on:

- Desktop
- Laptop
- Tablet
- Mobile

Product grid:

```text
Desktop: 4 cards
Tablet: 2–3 cards
Mobile: 1–2 cards
```

Dashboard layouts must also adapt to smaller screens.

Tables should become responsive cards or horizontally scrollable sections where appropriate.

---

## 40. Micro-Interactions

Use subtle animations for:

- Button hover
- Product card hover
- Add-to-cart feedback
- Wishlist heart animation
- Toast notifications
- Page transitions
- Loading skeletons
- Order status transitions

Animations must be subtle and professional.

---

## 41. Development Phases

Build the application in this order:

```text
PHASE 1
Project Setup
       ↓
PHASE 2
Database + Models
       ↓
PHASE 3
Authentication
       ↓
PHASE 4
Product Management
       ↓
PHASE 5
Customer Marketplace
       ↓
PHASE 6
Cart + Checkout
       ↓
PHASE 7
Orders
       ↓
PHASE 8
Farmer Dashboard
       ↓
PHASE 9
Admin Dashboard
       ↓
PHASE 10
Reviews + Wishlist
       ↓
PHASE 11
Responsive UI
       ↓
PHASE 12
Testing + Bug Fixing
       ↓
PHASE 13
Deployment
```

---

## 42. Antigravity Implementation Requirements

Antigravity must build a **fully functional full-stack application**, not only a static frontend mockup.

The implementation must:

1. Set up frontend and backend.
2. Connect the backend to MongoDB.
3. Implement authentication.
4. Implement role-based authorization.
5. Implement customer functionality.
6. Implement farmer functionality.
7. Implement admin functionality.
8. Implement product CRUD.
9. Implement image uploads.
10. Implement search and filters.
11. Implement cart functionality.
12. Implement checkout.
13. Implement order creation.
14. Implement order tracking.
15. Implement inventory management.
16. Implement farmer sales dashboard.
17. Implement reviews and ratings.
18. Implement wishlist.
19. Implement responsive UI.
20. Implement loading states.
21. Implement error states.
22. Validate frontend and backend forms.
23. Protect API endpoints.
24. Prevent unauthorized data access.
25. Keep the code modular and maintainable.

---

## 43. Final Product Experience

The final application should feel like a real agricultural marketplace.

### Prioritize

**Usability + Trust + Clean Design + Real Functionality + Scalability**

The application should clearly communicate:

> **Farmers sell directly. Customers buy directly. Everyone benefits.**

Build the application with clean, reusable, maintainable, production-oriented code.

Do not leave important buttons as non-functional placeholders.

Where external services such as payment gateways or delivery APIs are not configured, create a clean integration-ready architecture and clearly document the required environment variables and setup steps.
