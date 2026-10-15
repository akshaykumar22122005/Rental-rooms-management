# Rental Rooms Management System - Setup and Execution Guide

## 1. Prerequisites
Ensure the following tools are installed on your machine:
- **Java Development Kit (JDK)**: Version 21 (Verify: `java -version`)
- **Apache Maven**: Version 3.8+ (Verify: `mvn -version`)
- **Node.js**: Version 18+ and npm (Verify: `node -v`, `npm -v`)
- **MySQL Server**: Version 8.0+ running on port 3306

---

## 2. Database Initialization

### Step 2.1: Create MySQL Database
Log into your MySQL terminal:
```bash
mysql -u root -p
```
Run the following SQL statement:
```sql
CREATE DATABASE IF NOT EXISTS rental_rooms_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Step 2.2: Execute Schema & Sample Data (Optional)
The Spring Boot backend automatically generates and validates tables using Hibernate (`spring.jpa.hibernate.ddl-auto=update`) and seeds default categories, facilities, and initial accounts via `DataInitializer`.

To manually execute the SQL scripts using the MySQL CLI:
```bash
mysql -u root -p rental_rooms_db < database/schema.sql
mysql -u root -p rental_rooms_db < database/sample-data.sql
```

---

## 3. Backend Setup & Run

### Step 3.1: Configure Environment Variables
You can override default settings in `backend/src/main/resources/application.properties` or via environment variables:
```bash
export DB_USERNAME=root
export DB_PASSWORD=root
export JWT_SECRET=9a4f2c8d3b7a1e6f5c8d0e2b4a6c8e1f3a5b7c9d1e3f5a7b9c1d3e5f7a9b1c3d
export ADMIN_EMAIL=admin@rentalrooms.com
export ADMIN_PASSWORD=Admin@12345
```
*(On Windows PowerShell, use `$env:DB_PASSWORD="root"`)*

### Step 3.2: Compile and Run
Navigate to the `backend/` directory:
```bash
cd backend
mvn clean spring-boot:run
```
The backend server starts at: `http://localhost:8080`

### Step 3.3: Run Automated Backend Tests
```bash
mvn test
```

---

## 4. Frontend Setup & Run

### Step 4.1: Install Dependencies
Navigate to the `frontend/` directory:
```bash
cd frontend
npm install
```

### Step 4.2: Start the React Development Server
```bash
npm run dev
```
The frontend web application runs at: `http://localhost:5173`

---

## 5. Pre-Configured Test Credentials

| Role | Name | Email | Password |
|---|---|---|---|
| **Super Admin** | System Administrator | `admin@rentalrooms.com` | `Admin@12345` |
| **Landlord / Owner** | Rajesh Sharma | `owner@rentalrooms.com` | `Owner@12345` |
| **Tenant / Seeker** | Priya Patel | `tenant@rentalrooms.com` | `Tenant@12345` |

*(Quick demo buttons are also provided directly on the Login page for 1-click test logins!)*

---

## 6. Troubleshooting
1. **Access Denied for user 'root'@'localhost'**:
   Update `spring.datasource.password` in `backend/src/main/resources/application.properties` to match your local MySQL root password.
2. **Port 8080 or 5173 already in use**:
   Terminate the process holding port 8080 via `netstat -ano | findstr :8080` or adjust `server.port=8081` in `application.properties`.
3. **CORS issues**:
   CORS is pre-configured for `http://localhost:5173`, `http://localhost:3000`, and `http://127.0.0.1:5173`.
