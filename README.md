# 🏠 Rental Rooms Management System

A complete, production-grade full-stack web application connecting **room seekers** with **property owners**, managed by a **Super Admin**. Built with Java 21 + Spring Boot on the backend and React 18 on the frontend.

---

## 📋 Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Features by Role](#features-by-role)
- [Prerequisites](#prerequisites)
- [Database Setup](#database-setup)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Running the Application](#running-the-application)
- [Default Credentials](#default-credentials)
- [API Overview](#api-overview)
- [Testing](#testing)
- [Environment Configuration](#environment-configuration)

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Language** | Java 21, JavaScript (ES2022) |
| **Backend Framework** | Spring Boot 3.3.x |
| **ORM** | Spring Data JPA + Hibernate |
| **Security** | Spring Security 6 + JWT (JJWT 0.12.x) |
| **Database** | MySQL 8.0 |
| **Frontend** | React 18, React Router 6, Axios |
| **Frontend Build** | Vite 5 |
| **UI Icons** | Lucide React |
| **Build Tool** | Maven 3.9+ |
| **Testing** | JUnit 5, Mockito, Postman |
| **Version Control** | Git / GitHub |

---

## 📁 Project Structure

```
rental-rooms-management-system/
├── backend/                         # Spring Boot application
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/rentalrooms/
│   │   │   │   ├── config/          # Security, CORS, DataInitializer
│   │   │   │   ├── controller/      # 12 REST controllers
│   │   │   │   ├── dto/             # 22 Data Transfer Objects
│   │   │   │   ├── entity/          # 10 JPA entities
│   │   │   │   ├── enums/           # 9 enums
│   │   │   │   ├── exception/       # Global exception handling
│   │   │   │   ├── repository/      # 9 Spring Data JPA repos
│   │   │   │   ├── security/        # JWT filter, UserDetails
│   │   │   │   └── service/         # 13 business-logic services
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/                    # JUnit + Mockito tests
│   └── pom.xml
├── frontend/                        # React application
│   ├── src/
│   │   ├── api/                     # Axios client + API modules
│   │   ├── components/              # Reusable UI components
│   │   ├── context/                 # Auth + Notification contexts
│   │   ├── layouts/                 # MainLayout, DashboardLayout
│   │   ├── pages/
│   │   │   ├── public/              # Home, Rooms, Room Details, About, Contact
│   │   │   ├── auth/                # Login, Register
│   │   │   ├── tenant/              # Tenant dashboard pages
│   │   │   ├── owner/               # Owner dashboard pages
│   │   │   └── admin/               # Admin dashboard pages
│   │   ├── routes/                  # AppRoutes + ProtectedRoute
│   │   └── styles/                  # Global CSS design system
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── database/
│   ├── schema.sql                   # Full DDL with FK constraints
│   └── sample-data.sql              # Realistic seed data
├── docs/
│   ├── api-documentation.md
│   ├── database-design.md
│   └── setup-guide.md
└── postman/
    └── Rental_Rooms_API.postman_collection.json
```

---

## 👥 Features by Role

### 🔵 Tenant (Room Seeker)
- Register / Login / Profile management
- Browse, search, and filter rental rooms
- View room details, image galleries, and owner info
- Submit and track rental inquiries with proposed move-in dates
- Cancel pending requests
- Save rooms to wishlist
- Submit reviews for eligible stays
- Report suspicious listings
- Receive in-app notifications

### 🟢 Property Owner / Landlord
- Register / Login / Dashboard overview
- Create, edit, and deactivate property listings
- Upload multiple property images (via URL or file upload)
- Set rent, deposit, facilities, house rules, gender preference
- Manage availability status
- View, accept, or reject rental requests
- View tenant reviews on their properties
- Receive notifications on new inquiries

### 🔴 Super Admin
- Secure admin login (no self-registration possible)
- Platform-wide dashboard with statistics
- Manage all users and property owners (activate / deactivate)
- Approve, reject, or suspend property listings (moderation)
- Manage rental categories and facilities
- Review and resolve reported listings
- View all rental requests and reviews platform-wide

---

## ✅ Prerequisites

| Tool | Minimum Version |
|---|---|
| Java JDK | 21 |
| Maven | 3.9+ |
| MySQL Server | 8.0 |
| Node.js | 18+ |
| npm | 9+ |
| Git | any |

---

## 🗄 Database Setup

### 1. Create the database

```sql
CREATE DATABASE IF NOT EXISTS rental_rooms_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'rental_user'@'localhost'
  IDENTIFIED BY 'StrongPassword@2025';

GRANT ALL PRIVILEGES ON rental_rooms_db.* TO 'rental_user'@'localhost';
FLUSH PRIVILEGES;
```

> **Note:** If you prefer to use the root user or a different username/password, update `backend/src/main/resources/application.properties` accordingly.

### 2. (Optional) Apply the DDL schema manually

Hibernate will auto-create tables on startup (`ddl-auto=update`). To instead apply the DDL manually:

```bash
mysql -u root -p rental_rooms_db < database/schema.sql
```

---

## ⚙ Backend Setup

### 1. Configure the database connection

Edit `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/rental_rooms_db?useSSL=false&serverTimezone=UTC
spring.datasource.username=rental_user
spring.datasource.password=StrongPassword@2025
```

### 2. (Optional) Override admin credentials via environment variables

```bash
# Windows PowerShell
$env:APP_ADMIN_EMAIL = "admin@yourcompany.com"
$env:APP_ADMIN_PASSWORD = "YourSecurePassword@123"
$env:APP_ADMIN_PHONE = "+91 9999999999"
$env:JWT_SECRET = "your-256-bit-base64-secret-key"
```

### 3. Build the backend

```bash
cd backend
mvn clean package -DskipTests
```

### 4. Run the backend

```bash
java -jar target/rental-rooms-backend-1.0.0.jar
```

Backend starts at: **http://localhost:8080**

---

## 🌐 Frontend Setup

### 1. Install dependencies

```bash
cd frontend
npm install
```

### 2. Create environment file (optional)

```bash
cp .env.example .env
# Edit .env if needed — defaults work out of the box with Vite proxy
```

### 3. Start the development server

```bash
npm run dev
```

Frontend starts at: **http://localhost:5173**

> The Vite dev server proxies all `/api/*` and `/uploads/*` requests to `http://localhost:8080` automatically.

### 4. Production build

```bash
npm run build
# Output in: frontend/dist/
```

---

## 🚀 Running the Application

Start both services in separate terminals:

**Terminal 1 — Backend:**
```bash
cd backend
mvn spring-boot:run
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```

Then open: **http://localhost:5173**

---

## 🔑 Default Credentials

These accounts are automatically created on first startup by `DataInitializer.java`.

| Role | Email | Password |
|---|---|---|
| **Super Admin** | `admin@rentalrooms.com` | `Admin@12345` |
| **Demo Owner** | `owner@rentalrooms.com` | `Owner@12345` |
| **Demo Tenant** | `tenant@rentalrooms.com` | `Tenant@12345` |

> The Login page includes **one-click demo shortcuts** to auto-fill credentials for quick testing.

---

## 📡 API Overview

All API endpoints are prefixed with `/api/`.

| Module | Base Path | Description |
|---|---|---|
| Auth | `/api/auth` | Register, login, get current user |
| Users | `/api/users` | Profile update, password change |
| Properties | `/api/properties` | Browse, search, CRUD for owners |
| Categories | `/api/categories` | List rental categories |
| Facilities | `/api/facilities` | List available facilities |
| Rental Requests | `/api/rental-requests` | Submit, cancel, status updates |
| Wishlist | `/api/wishlist` | Save / unsave rooms |
| Reviews | `/api/reviews` | Submit and view reviews |
| Notifications | `/api/notifications` | In-app notification management |
| Reports | `/api/reports` | Report suspicious listings |
| Owner | `/api/owners/me` | Owner dashboard, properties, requests |
| Admin | `/api/admin` | Full platform management |

See **`docs/api-documentation.md`** for the complete endpoint reference.

Import **`postman/Rental_Rooms_API.postman_collection.json`** into Postman to test all endpoints interactively.

---

## 🧪 Testing

### Backend Unit Tests

```bash
cd backend
mvn test
```

Tests cover:
- `AuthServiceTest` — Register, login, duplicate-email validation
- `RentalRequestServiceTest` — Create, cancel, status update, authorization

### API Testing via Postman

1. Import `postman/Rental_Rooms_API.postman_collection.json`
2. Set environment variable `base_url = http://localhost:8080/api`
3. Use the **Auth** folder first to obtain a JWT token
4. The collection auto-sets `{{token}}` for subsequent calls

---

## 🔧 Environment Configuration

Key settings in `backend/src/main/resources/application.properties`:

```properties
# JWT Secret (override in production with a 256-bit random base64 key)
jwt.secret=change-this-in-production

# JWT expiry (default: 7 days)
jwt.expiration=604800000

# File upload location
app.file.upload-dir=./uploads

# Admin bootstrap (override via env vars)
app.admin.email=admin@rentalrooms.com
app.admin.password=Admin@12345
```

Frontend environment (`.env`):
```env
VITE_API_BASE_URL=/api
```

---

## 🛡 Security Notes

- Passwords are hashed with **BCrypt** (strength 12)
- JWT tokens are stateless with configurable expiry
- Role-based access control enforced via Spring Security `@PreAuthorize`
- Super Admin account cannot be created via self-registration
- CORS configured to allow only `http://localhost:5173` in development
- Input validation on all DTOs via Jakarta Bean Validation

---

## 📄 License

This project is for educational and portfolio purposes.

---

*Built with ❤️ using Java 21, Spring Boot 3, React 18, and MySQL 8*
