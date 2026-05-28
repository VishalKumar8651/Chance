# Chance Fashion Website

> **Elegant. Dynamic. Premium.**

## ✨ Overview
Chance is a modern, animated fashion e‑commerce showcase built with a **rich, glass‑morphism UI**, smooth micro‑animations, and a persistent **MongoDB‑backed cart**.  Users can sign‑up, log‑in, browse collections, view product modals, search instantly, and retain their cart across sessions.

---

## 🌟 Features

| Category | Feature | Description |
|----------|---------|-------------|
| **Core UI** | Glass‑morphism & dark‑mode | Gradient backgrounds, blurred containers, vibrant accent colors.
| | Animated loader & particles | Full‑screen loader with CSS animation; floating particles on each page.
| | Custom cursor & hover effects | Interactive cursor that follows mouse and reveals hover states.
| **Navigation** | Responsive header | Sticky header with smooth scroll‑reveal and mobile hamburger menu.
| | Search overlay | Full‑screen search with live results powered by a static product list.
| **Product Gallery** | Filterable collection | Category filters, view‑all toggle, and animated product cards.
| | Quick‑view modal | Click a product to open a detailed modal (size, quantity, add‑to‑cart).
| **User System** | Sign‑up & login | Backend endpoints `/api/signup` and `/api/login` with `bcrypt` password hashing and JWT token issuance.
| | Persistent session | User profile and JWT token are stored in `localStorage` for authenticated cart access.
| **Cart** | Client‑side cart UI | Add, remove, update quantity, checkout toast.
| | **Server‑side persistence** | Cart saved per user in MongoDB (`carts` collection) via `/api/cart` endpoints.  Cart survives logout and page reloads.
| **Backend** | Node.js + Express | Handles API routes, CORS, JSON body parsing.
| | MongoDB Atlas | Cloud‑hosted database; connection uses **Stable API v1** (`ServerApiVersion`).
| | Environment variables | `.env` stores `MONGODB_URI`, `JWT_SECRET`, and `PORT`.
| **Performance & SEO** | Semantic HTML5, proper headings, descriptive meta tags (you can add `<title>` and `<meta description>` per page). |
| | Optimized assets | Lazy‑loaded images (via `loading="lazy"` if added), CSS minification possible.

---

## 🛠️ Technical Stack

- **Frontend**: 
  - HTML5, CSS3 (custom design system, gradients, glass‑morphism, micro‑animations)
  - Vanilla JavaScript (`script.js`) – no framework, pure ES6+.
  - Google Fonts – *Inter*, *Playfair Display*, *Cormorant Garamond*.
- **Backend**: 
  - Node.js (v20+ recommended)
  - Express.js – lightweight routing & middleware.
  - `cors` – enable cross‑origin requests.
  - `dotenv` – load environment variables.
  - `mongodb` driver – direct MongoDB Atlas connectivity.
- **Database**: 
  - MongoDB Atlas – collections `users` and `carts`.
  - Stable API v1 (`ServerApiVersion.v1`, `strict: true`, `deprecationErrors: true`).
- **Development**: 
  - VS Code (or any editor) on Windows.
  - `npm` scripts: `npm start` (runs `node server.js`).
- **Design**: 
  - Custom color palette (purple‑pink gradient, dark background).
  - Glass‑morphism containers (backdrop‑filter, semi‑transparent).
  - Animations via CSS `@keyframes` and `requestAnimationFrame` for cursor & particles.

---

## 🚀 Getting Started

1. **Clone the repository** (or copy the project folder).
2. **Install dependencies**
   ```bash
   cd "C:/Users/Vishal Kumar/OneDrive/Desktop/Chance"
   npm install   # installs express, cors, dotenv, mongodb
   ```
3. **Configure environment**
   - Create a `.env` file (already present) and set:
     ```text
     MONGODB_URI="mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?appName=Chance"
     PORT=5000
     ```
   - Replace `<username>` and `<password>` with your Atlas credentials.
4. **Run the server**
   ```bash
   npm start   # or: node server.js
   ```
5. Open `http://localhost:5000` in your browser – the frontend files are served statically (you can use a simple HTTP server like `live-server` or open `index.html` directly).

---

## 📡 API Reference

| Method | Endpoint | Body / Params | Description |
|--------|----------|---------------|-------------|
| `POST` | `/api/signup` | `{ name, email, pass }` | Registers a new user.
| `POST` | `/api/login` | `{ email, pass }` | Authenticates a user.
| `GET` | `/api/cart` | Auth header required | Returns saved cart items for the authenticated user.
| `POST` | `/api/cart` | `{ items: [] }` + Auth header | Upserts the whole cart for the authenticated user.
| `DELETE` | `/api/cart/:index` | Auth header required | Removes the cart item at `index` for the authenticated user.

> **Security note**: Keep `.env` private, rotate secrets immediately if exposed, and always use a strong `JWT_SECRET`.

---

## 📂 Project Structure

```
Chance/
├─ index.html                # Home page
├─ about.html                # About page
├─ collection.html           # Product collection
├─ story.html                # Brand story
├─ contact.html              # Contact form
├─ login.html                # Sign‑up / login UI
├─ style.css                 # Global stylesheet (design system)
├─ pages.css                 # Page‑specific overrides
├─ script.js                 # Front‑end logic (cart, modal, search, etc.)
├─ server.js                 # Express backend with MongoDB connection
├─ .env                      # Environment variables (MongoDB URI, port)
└─ README.md                 # **This file**
```

---

## 📈 Future Improvements

- **Refresh token flow** – add refresh/rotation support for long-lived secure sessions.
- **HttpOnly cookies** – move JWT from `localStorage` to secure cookies for stronger XSS protection.
- **Payment gateway** – add Stripe/PayPal integration for real checkout.
- **Product data** – move product list from hard‑coded array to a `products` collection.
- **Responsive design polishing** – fine‑tune mobile breakpoints and lazy‑load images.
- **Unit & integration tests** – add Jest / Mocha tests for backend routes.

---

## 📝 License

This project is for personal learning and portfolio purposes. Feel free to adapt, improve, or use any part of it.

---

**Happy coding!** 🎨🚀
